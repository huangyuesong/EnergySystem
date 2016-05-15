import React, { Component } from 'react';

import {
  	StyleSheet,
  	View,
  	TouchableOpacity,
  	Text,
} from 'react-native';

export default class Header extends Component {
	render () {
		return (
			<View style={styles.headerWrapper}>
				<TouchableOpacity style={styles.backButton}
						onPress={this.props.onBack}>
					<Text style={styles.text}>{`<`}返回</Text>
				</TouchableOpacity>
				<View style={styles.title}>
					<Text style={styles.text}>{this.props.title}</Text>
				</View>
				<TouchableOpacity style={styles.rightButton}
						onPress={this.props.onRightButtonPress}>
					{(()=> {
						if (this.props.rightButtonText) {
							return (
								<Text style={styles.text}>{this.props.rightButtonText}</Text>
							);
						}
					})()}
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	headerWrapper: {
		flexDirection: 'row',
		height: 30,
		backgroundColor: 'black',
		paddingVertical: 5,
	},
	backButton: {
		width: 60,
		alignItems: 'center',
		justifyContent: 'center',
		borderRightWidth: 1,
		borderRightColor: 'white',
	},
	text: {
		color: 'white',
	},
	title: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rightButton: {
		width: 60,
		alignItems: 'center',
		justifyContent: 'center',
	},
});