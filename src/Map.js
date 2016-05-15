import React, { Component } from 'react';

import {
  	StyleSheet,
  	View,
  	WebView,
} from 'react-native';

import Header from './Header';

export default class MapView extends Component {
	render () {
		let { username, password } = this.props;
		let query = username && password ? `username=${username}&password=${password}` : '';

		return (
			<View style={{flex: 1}}>
				<Header title="能耗节点分布" onBack={()=> this.props.navigator.pop()} />
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
					scalesPageToFit={true} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	webView: {
		
	},
});