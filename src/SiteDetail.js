import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	ScrollView,
	Switch,
	DatePickerIOS,
	Alert,
	Platform,
	PickerIOS,
} from 'react-native';

import Header from './Header';
import PickerAndroid from 'react-native-picker-android';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;

import { serverUrl } from '../config';

export default class SiteDetail extends Component {
	constructor(props) {
		super(props);

		let {
			area,
			carrierCount,
			city,
			id,
			identityNo,
			isFlag,
			latitude,
			longitude,
			name,
			powerId,
			powerPrice,
			typeId,
			useDate,
			wallInfo,
		} = props;

		this.state = {
			area: area,
			carrierCount: carrierCount,
			city: city,
			identityNo: identityNo,
			isFlag: isFlag || 0,
			latitude: latitude,
			longitude: longitude,
			name: name,
			powerId: powerId,
			powerPrice: powerPrice,
			typeId: typeId,
			useDate: useDate.substring(0, 10),
			wallInfo: wallInfo,
			districts: [],
		};
	}

	_onUpdate () {
		if (this.props.new) {
			let form = new FormData();
			Object.keys(this.state).map(key=> {
				form.append(key, this.state[key]);
			});

			fetch(`${serverUrl}/insertSite`, {
				method: 'post',
				body: form,
			}).then(res=> res.json())
				.then(json=> {
					if (json.success) {
						Alert.alert('新增基站成功');
					} else {
						Alert.alert(json.errors);
					}
				})
				.catch(err=> Alert.alert('Network Error!'));
		} else {
			let form = new FormData();
			form.append('id', this.props.id);
			Object.keys(this.state).map(key=> {
				form.append(key, this.state[key]);
			});

			fetch(`${serverUrl}/updateSite`, {
				method: 'post',
				body: form,
			}).then(res=> res.json())
				.then(json=> {
					if (json.success) {
						Alert.alert('修改成功');
					} else {
						Alert.alert(json.errors);
					}
				})
				.catch(err=> Alert.alert('Network Error!'));
		}
	}

	_onDelete () {
		let form = new FormData();
		form.append('siteId', this.props.id);

		fetch(`${serverUrl}/deleteSite`, {
			method: 'post',
			body: form,
		}).then(res=> res.json())
			.then(json=> {
				if (json.success) {
					Alert.alert('删除成功');
					this.props.navigator.pop();
				} else {
					Alert.alert(json.errors);
				}
			})
			.catch(err=> Alert.alert('Network Error!'));
	}

	componentDidMount () {
		fetch(`${serverUrl}/getDistrictList`)
			.then(res=> res.json())
			.then(json=> this.setState({
				districts: json.districts,
				city: this.props.city || 
					json.districts[0].province.concat(json.districts[0].city).concat(json.districts[0].county),
			}))
			.catch(err=> Alert.alert('Network Error!'));
	}

	render () {
		return (
			<View style={styles.container} >
				<Header title="查看基站详情" 
					onBack={()=> this.props.navigator.pop()} />
				<View style={styles.buttonWrapper} >
					<TouchableOpacity style={styles.button}
							onPress={this._onUpdate.bind(this)} >
						<Text>保存修改</Text>
					</TouchableOpacity>
					{(()=> {
						if (!this.props.new) {
							return (
								<TouchableOpacity style={[styles.button, {borderLeftWidth: 1, borderLeftColor: 'black'}]}
										onPress={this._onDelete.bind(this)} >
									<Text>删除基站</Text>
								</TouchableOpacity>
							);
						}
					})()}
				</View>
				<ScrollView style={styles.siteInfoWrapper} >
					<Text>基站编号：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={this.state.identityNo}
						autoCapitalize="none"
						onChangeText={text=> this.setState({identityNo: text})} />
					<Text>基站名称：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={this.state.name}
						autoCapitalize="none"
						onChangeText={text=> this.setState({name: text})} />
					<Text>基站类型ID：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.typeId)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({typeId: Number(text)})} />
					<Text>基站面积：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.area)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({area: Number(text)})} />
					<Text>供电类型：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.powerId)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({powerId: Number(text)})} />
					<Text>电价：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.powerPrice)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({powerPrice: Number(text)})} />
					<Text>经度：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.latitude)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({latitude: Number(text)})} />
					<Text>纬度：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.longitude)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({longitude: Number(text)})} />
					<Text>墙体信息：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={this.state.wallInfo}
						autoCapitalize="none"
						onChangeText={text=> this.setState({wallInfo: text})} />
					<Text>载频数：</Text>
					<TextInput style={styles.siteInfoInput} 
						value={String(this.state.carrierCount)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({carrierCount: Number(text)})} />
					<Text>是否标杆：</Text>
					<Switch style={styles.switch}
						value={this.state.isFlag ? true : false}
						onValueChange={value=> this.setState({isFlag: value ? 1 : 0})} />
					<Text>启用时间：</Text>
					<DatePickerIOS mode="date"
						date={new Date(...this.state.useDate.split('-').map((_, idx)=> idx === 1 ? _ - 1 : _))}
						onDateChange={date=> {
							this.setState({
								useDate: [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'),
							});
						}} />
					<Text>所在区域：</Text>
					<Picker selectedValue={this.state.city || 0}
							onValueChange={value=> this.setState({city: value})}>
						{
							this.state.districts.map(_district=> 
								<Picker.Item
									key={_district.id}
									label={`${_district.province}${_district.city}${_district.county}`}
									value={`${_district.province}${_district.city}${_district.county}`} />
							)
						}
					</Picker>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	buttonWrapper: {
		height: 30,
		flexDirection: 'row',
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		paddingVertical: 3,
	},
	button: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	siteInfoWrapper: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	siteInfoInput: {
		height: 30,
		paddingHorizontal: 10,
		marginVertical: 5,
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 10,
		backgroundColor: 'white',
		color: 'black',
	},
	switch: {
		marginVertical: 5,
	},
});