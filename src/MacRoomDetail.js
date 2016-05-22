import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	ScrollView,
	Switch,
	Alert,
} from 'react-native';

import Header from './Header';

import { serverUrl } from '../config';

export default class MacRoomDetail extends Component {
	constructor(props) {
		super(props);

		let {
			area,
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
			floor,
			floorHeight,
			devicePercent,
		} = props;

		this.state = {
			area: area,
			city: city,
			identityNo: identityNo,
			isFlag: isFlag || false,
			latitude: latitude,
			longitude: longitude,
			name: name,
			powerId: powerId,
			powerPrice: powerPrice,
			typeId: typeId,
			floor: floor,
			floorHeight: floorHeight,
			devicePercent: devicePercent,
		};
	}

	_onUpdate () {
		if (this.props.new) {
			let form = new FormData();
			Object.keys(this.state).map(key=> {
				form.append(key, this.state[key]);
			});

			fetch(`${serverUrl}/insertMacRoom`, {
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
		} else {
			let form = new FormData();
			form.append('id', this.props.id);
			Object.keys(this.state).map(key=> {
				form.append(key, this.state[key]);
			});

			fetch(`${serverUrl}/updateMacRoom`, {
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
		form.append('macRoomId', this.props.id);

		fetch(`${serverUrl}/deleteMacRoom`, {
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

	render () {
		return (
			<View style={styles.container} >
				<Header title="查看机房详情" 
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
									<Text>删除机房</Text>
								</TouchableOpacity>
							);
						}
					})()}
				</View>
				<ScrollView style={styles.macRoomInfoWrapper} >
					<Text>机房编号：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={this.state.identityNo}
						autoCapitalize="none"
						onChangeText={text=> this.setState({identityNo: text})} />
					<Text>机房名称：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={this.state.name}
						autoCapitalize="none"
						onChangeText={text=> this.setState({name: text})} />
					<Text>机房类型ID：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.typeId)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({typeId: Number(text)})} />
					<Text>所在楼层：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.floor)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({floor: Number(text)})} />
					<Text>层高：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.floorHeight)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({floorHeight: Number(text)})} />
					<Text>机房面积：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.area)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({area: Number(text)})} />
					<Text>供电类型：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.powerId)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({powerId: Number(text)})} />
					<Text>电价：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.powerPrice)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({powerPrice: Number(text)})} />
					<Text>经度：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.latitude)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({latitude: Number(text)})} />
					<Text>纬度：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.longitude)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({longitude: Number(text)})} />
					<Text>装机率：</Text>
					<TextInput style={styles.macRoomInfoInput} 
						value={String(this.state.devicePercent)}
						autoCapitalize="none"
						onChangeText={text=> this.setState({devicePercent: Number(text)})} />
					<Text>是否标杆：</Text>
					<Switch style={styles.switch}
						value={this.state.isFlag ? true : false}
						onValueChange={value=> this.setState({isFlag: value ? 1 : 0})} />
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
	macRoomInfoWrapper: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 20,
	},
	macRoomInfoInput: {
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