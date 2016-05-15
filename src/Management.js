import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TabBarIOS,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	ListView,
	RecyclerViewBackedScrollView,
	Platform,
} from 'react-native';

import Header from './Header';
import DistrictPicker from './DistrictPicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabNavigator from 'react-native-tab-navigator';

import { serverUrl } from '../config';

const PAGE_SIZE = 10;

export default class Management extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedTab: 0,
			keyword: '',
			showPicker: false,
			districtPickerOptions: [],
			districtPickerFirstLabel: '全国',
			districtPickerTarget: 'province',
			districts: {},
			province: '',
			city: '',
			county: '',
			pageIndex: 1,
			fetchMoreData: true,
			sites: [],
			macRooms: [],
		};
	}

	_fetchDistrictList () {
		return fetch(`${serverUrl}/getDistrictList`)
			.then(res=> res.json())
			.then(json=> {
				return new Promise((resolve, reject)=> {
					let { districts } = json;
					let _districts = {};

					districts.map((district)=> {
						let { province, city, county } = district;

						if (_districts[province] === undefined) {
							_districts[province] = {};
						}

						if (_districts[province][city] === undefined) {
							_districts[province][city] = [];
						} else {
							_districts[province][city].push(county);
						}
					});
					resolve(_districts);
				});
			})
			.catch(err=> Alert.alert('Network Error!'));
	}

	_fetchSite () {
		if (!this.state.fetchMoreData) {
			return;
		}

		let { pageIndex, keyword, province, city, county } = this.state;

		let form = new FormData();
		form.append('pageIndex', pageIndex);
		form.append('pageSize', PAGE_SIZE);
		form.append('keyword', keyword);
		form.append('province', province);
		form.append('city', city);
		form.append('county', county);

		fetch(`${serverUrl}/searchSite`, {
			method: 'post',
			body: form,
		}).then(res=> res.json())
			.then(json=> {
				if (json.sites.length < PAGE_SIZE) {
					this.setState({
						fetchMoreData: false,
					});
				}

				this.setState({
					sites: this.state.sites.concat(json.sites),
					pageIndex: this.state.pageIndex + 1,
				});
			})
			.catch(err=> console.error(err));
	}

	_fetchMacRoom () {
		if (!this.state.fetchMoreData) {
			return;
		}

		let { pageIndex, keyword, province, city, county } = this.state;

		let form = new FormData();
		form.append('pageIndex', pageIndex);
		form.append('pageSize', PAGE_SIZE);
		form.append('keyword', keyword);
		form.append('province', province);
		form.append('city', city);
		form.append('county', county);

		fetch(`${serverUrl}/searchMacRoom`, {
			method: 'post',
			body: form,
		}).then(res=> res.json())
			.then(json=> {
				if (json.macRooms.length < PAGE_SIZE) {
					this.setState({
						fetchMoreData: false,
					});
				}

				this.setState({
					macRooms: this.state.macRooms.concat(json.macRooms),
					pageIndex: this.state.pageIndex + 1,
				});
			})
			.catch(err=> console.error(err));
	}

	componentDidMount () {
		this._fetchDistrictList()
			.then(districts=> this.setState({districts: districts}, ()=> this._fetchSite()));
	}

	componentWillUpdate (nextProps, nextState) {
		if (this.state.selectedTab === 0 && nextState.selectedTab === 1) {
			this.setState({
				pageIndex: 1,
				sites: [],
				macRooms: [],
				fetchMoreData: true,
			}, ()=> this._fetchMacRoom());
		} else if (this.state.selectedTab === 1 && nextState.selectedTab === 0) {
			this.setState({
				pageIndex: 1,
				sites: [],
				macRooms: [],
				fetchMoreData: true,
			}, ()=> this._fetchSite());
		}
	}

	render () {
		let listViews = [];

		return (
			<View style={styles.container}>
				<Header title="能耗节点管理" 
					onBack={()=> this.props.navigator.pop()}
					rightButtonText="回顶部"
					onRightButtonPress={()=> {
						if (Platform.OS === 'ios') {
							listViews.map(view=> view.scrollTo({x: 0, y: 0, animated: true}));	
						} else {
							this.setState({
								sites: [],
								macRooms: [],
								fetchMoreData: true,
								pageIndex: 1,
							}, ()=> this.state.selectedTab ? this._fetchMacRoom() : this._fetchSite());
						}
					}} />
				<View style={styles.pickerWrapper}>
					<TouchableOpacity style={styles.pickerButton}
							onPress={()=> this.setState({
								showPicker: true,
								districtPickerOptions: Object.keys(this.state.districts),
								districtPickerFirstLabel: '全国',
								districtPickerTarget: 'province',
							})}>
						<Text>{this.state.province || '全国'}</Text>
						<Icon name="chevron-down" size={10} style={{position: 'absolute', right: 10, top: 10}} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.pickerButton}
							onPress={()=> this.setState({
								showPicker: true,
								districtPickerOptions: this.state.province ? 
									Object.keys(this.state.districts[this.state.province]) : [],
								districtPickerFirstLabel: '-',
								districtPickerTarget: 'city',
							})}>
						<Text>{this.state.city || '-'}</Text>
						<Icon name="chevron-down" size={10} style={{position: 'absolute', right: 10, top: 10}} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.pickerButton}
							onPress={()=> this.setState({
								showPicker: true,
								districtPickerOptions: this.state.province && this.state.city ? 
									this.state.districts[this.state.province][this.state.city] : [],
								districtPickerFirstLabel: '-',
								districtPickerTarget: 'county',
							})}>
						<Text>{this.state.county || '-'}</Text>
						<Icon name="chevron-down" size={10} style={{position: 'absolute', right: 10, top: 10}} />
					</TouchableOpacity>
				</View>
				<DistrictPicker show={this.state.showPicker}
					options={this.state.districtPickerOptions}
					firstLabel={this.state.districtPickerFirstLabel}
					onClose={()=> this.setState({showPicker: false})}
					selectedValue={this.state[this.state.districtPickerTarget]}
					onSelect={value=> {
						switch (this.state.districtPickerTarget) {
							case 'province':
								this.setState({province: value, city: '', county: ''});
								break;
							case 'city':
								this.setState({city: value, county: ''});
								break;
							case 'county':
								this.setState({county: value});
								break;
							default:
								break;
						}

						this.setState({
							pageIndex: 1,
							fetchMoreData: true,
							sites: [],
							macRooms: [],
						}, ()=> this.state.selectedTab ? this._fetchMacRoom() : this._fetchSite());
					}} />
				<View style={styles.searchWrapper}>
					<TextInput style={styles.searchInput} 
						placeholder={`输入${this.state.selectedTab ? '机房' : '基站'}名称进行搜索`} 
						autoCapitalize="none"
						onChangeText={text=> this.setState({keyword: text})} />
					<TouchableOpacity style={styles.searchButton}
							onPress={()=> {
								this.setState({
									sites: [],
									macRooms: [],
									pageIndex: 1,
									fetchMoreData: true,
								}, ()=> this.state.selectedTab ? this._fetchMacRoom() : this._fetchSite());
							}}>
						<Text>搜索</Text>
						<Icon name="search" size={15} style={{position: 'relative', left: 5}} />
					</TouchableOpacity>
				</View>
				<TabNavigator tabBarStyle={{backgroundColor: 'black'}}>
					<TabNavigator.Item
							titleStyle={{fontSize: 12}}
							selectedTitleStyle={{color: 'white'}}
							renderIcon={()=> 
								<Icon name="volume-control-phone" size={20} style={{color: 'gray'}} />}
							renderSelectedIcon={()=> 
								<Icon name="volume-control-phone" size={20} style={{color: 'white'}} />}
							title="基站"
							selected={this.state.selectedTab === 0}
							onPress={()=> this.setState({selectedTab: 0})}>
						<ListView
							ref={view=> listViews.push(view)}
							dataSource={new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 !== r2})
								.cloneWithRows(this.state.sites)}
							renderRow={(rowData, sectionID, rowID)=> {
								return (
									<View style={{height: 50, justifyContent: 'center'}}>
										<Text>{rowData.name}</Text>
										<Text>{rowData.city}</Text>
									</View>
								);
							}}
							renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
							onEndReached={()=> {
								this.state.sites.length >= PAGE_SIZE ? this._fetchSite() : ()=> null;
							}}
							onEndReachedThreshold={40}
							enableEmptySection={true}
							renderSeparator={(sectionID, rowID)=> 
								<View key={`${sectionID}-${rowID}`} 
									style={{height: 1, backgroundColor: '#CCCCCC'}} />} />
					</TabNavigator.Item>
					<TabNavigator.Item
							titleStyle={{fontSize: 12}}
							selectedTitleStyle={{color: 'white'}}
							renderIcon={()=> 
								<Icon name="cubes" size={20} style={{color: 'gray'}} />}
							renderSelectedIcon={()=> 
								<Icon name="cubes" size={20} style={{color: 'white'}} />}
							title="机房"
							selected={this.state.selectedTab === 1}
							onPress={()=> this.setState({selectedTab: 1})}>
						<ListView
							ref={view=> listViews.push(view)}
							dataSource={new ListView.DataSource({rowHasChanged: (r1, r2)=> r1 !== r2})
								.cloneWithRows(this.state.macRooms)}
							renderRow={(rowData, sectionID, rowID)=> {
								return (
									<View style={{height: 50, justifyContent: 'center'}}>
										<Text>{rowData.name}</Text>
										<Text>{rowData.city}</Text>
									</View>
								);
							}}
							renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
							onEndReached={()=> {
								this.state.macRooms.length >= PAGE_SIZE ? this._fetchMacRoom() : ()=> null;
							}}
							onEndReachedThreshold={40}
							enableEmptySection={true}
							renderSeparator={(sectionID, rowID)=> 
								<View key={`${sectionID}-${rowID}`} 
									style={{height: 1, backgroundColor: '#CCCCCC'}} />} />
					</TabNavigator.Item>
				</TabNavigator>
				<TouchableOpacity style={styles.mapButtonWrapper}
						onPress={()=> this.props.navigator.replace({
							name: 'MapView',
							index: 1,
							props: {
								username: this.props.username,
								password: this.props.password,
							},
						})}>
					<Text style={styles.mapButtonText}>去地图</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	pickerWrapper: {
		height: 35,
		flexDirection: 'row',
	},
	pickerButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 5,
		marginHorizontal: 5,
		marginVertical: 2,
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
	},
	searchWrapper: {
		height: 40,
		flexDirection: 'row',
		marginVertical: 3,
	},
	searchInput: {
		flex: 1,
		paddingHorizontal: 10,
		borderRadius: 10,
		backgroundColor: 'white',
		color: 'black',
	},
	searchButton: {
		width: 80,
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		marginHorizontal: 2,
		flexDirection: 'row',
	},
	mapButtonWrapper: {
		width: 50,
		height: 50,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.2)',
		borderRadius: 50,
		position: 'absolute',
		right: 5,
		bottom: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	mapButtonText: {
		fontSize: 12,
	},
});