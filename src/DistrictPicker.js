import React, { Component } from 'react';

import {
	StyleSheet,
	Modal,
	View,
	PickerIOS,
	TouchableOpacity,
	Text,
	Platform,
} from 'react-native';

import PickerAndroid from 'react-native-picker-android';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;

export default class DistrictPicker extends Component {
	constructor(props) {
		super(props);
	}

	render () {
		let { show, options, firstLabel, onSelect, onClose, selectedValue } = this.props;

		return (
			<Modal visible={show}
					transparent={true}
					animated={true}
					onRequestClose={()=> null}>
				<View style={styles.modalPickerContainer}>
					<Picker selectedValue={selectedValue || 0}
							onValueChange={onSelect}>
						<Picker.Item label={firstLabel} value="" />
						{(()=> {
							return options.map((_option, idx)=> {
								return (
									<Picker.Item key={idx} label={_option} value={_option} />
								);
							});
						})()}
					</Picker>
					<TouchableOpacity style={styles.modalPickerButton} 
							onPress={onClose}>
						<Text>确定</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		);
	}
}

const styles = StyleSheet.create({
	modalPickerContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'white',
		paddingHorizontal: 20,
	},
	modalPickerButton: {
		height: 40,
		borderRadius: 10,
		backgroundColor: 'rgb(220, 220, 220)',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch',
	},
});