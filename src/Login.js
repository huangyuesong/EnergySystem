import React, { Component } from 'react';

import {
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
} from 'react-native';

import { serverUrl } from '../config';

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
		};
	}

	_onLoginPress () {
		let form = new FormData();
		form.append('username', this.state.username);
		form.append('password', this.state.password);

		fetch(`${serverUrl}/mobileLoginIn`, {
			method: 'post',
			body: form,
		}).then(res=> res.json())
			.then(json=> {
				if (json.success) {
					if (json.isAdministrator) {
						Alert.alert('您是系统管理员，要进入管理界面吗？', null, [
							{text: '进入地图', onPress: ()=> {
								this.props.navigator.push({
									name: 'MapView',
									index: 1,
									props: {
										username: this.state.username,
										password: this.state.password,
									},
								});
							}},
			            	{text: '进入管理界面', onPress: ()=> {
			            		this.props.navigator.push({
									name: 'Management',
									index: 1,
									props: {
										username: this.state.username,
										password: this.state.password,
									},
								});
			            	}},
						]);
					} else {
						this.props.navigator.push({
							name: 'MapView',
							index: 1,
							props: {
								username: this.state.username,
								password: this.state.password,
							},
						});
					}
				} else {
					Alert.alert(json.errors);
				}
			})
			.catch(err=> Alert.alert(err));
	}

	render () {
		return (
			<View style={styles.container}>
				<TextInput style={styles.input} 
					placeholder="用户名" 
					autoCapitalize="none"
					onChangeText={text=> this.setState({username: text})} />
				<TextInput style={styles.input} 
					placeholder="密码" 
					secureTextEntry={true}
					onChangeText={text=> this.setState({password: text})} />
				<TouchableOpacity style={styles.button} 
						onPress={this._onLoginPress.bind(this)}>
					<Text>登录</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = {
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#1f2933',
		padding: 10,
	},
	input: {
		height: 40,
		paddingHorizontal: 10,
		margin: 5,
		borderRadius: 10,
		backgroundColor: 'white',
		color: 'black',
	},
	button: {
		height: 40,
		borderRadius: 10,
		backgroundColor: 'rgb(220, 220, 220)',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch',
		margin: 5,
	},
};