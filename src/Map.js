import React, { Component } from 'react';

import {
  	StyleSheet,
  	View,
  	WebView,
  	Text,
} from 'react-native';

import Header from './Header';

export default class MapView extends Component {
	constructor(props) {
		super(props);
	
		this.state = {
			loading: true,
		};
	}

	render () {
		let { username, password } = this.props;
		let query = username && password ? `username=${username}&password=${password}` : '';

		return (
			<View style={{flex: 1}}>
				{(()=> {
					if (this.props.isAdministrator) {
						return (
							<Header title={this.state.loading ? "地图控件加载中……" : '能耗节点分布'}
								onBack={()=> this.props.navigator.pop()}
								rightButtonText="管理入口"
								onRightButtonPress={()=> this.props.navigator.replace({
									name: 'Management',
									index: 1,
									props: {
										username: username,
										password: password,
									},
								})} />
						);
					} else {
						return (
							<Header title={this.state.loading ? "地图控件加载中……" : '能耗节点分布'}
								onBack={()=> this.props.navigator.pop()} />
						);
					}
				})()}
				<WebView
	            	source={{uri: `http://115.28.193.141/Map?${query}`}}
					automaticallyAdjustContentInsets={false}
					style={styles.webView}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					onNavigationStateChange={navState=> null}
					onShouldStartLoadWithRequest={event=> true}
					startInLoadingState={false}
					scalesPageToFit={true}
					onLoad={()=> this.setState({loading: false})} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	webView: {
		
	},
});