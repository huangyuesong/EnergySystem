import React, { Component } from 'react';

import {
	Navigator,
} from 'react-native';

import Login from './Login';
import MapView from './Map';
import Management from './Management';

export default class Nav extends Component {
	_renderScene (route, navigator) {
		switch (route.name) {
			case 'Login':
				return (
					<Login navigator={navigator} />
				);
			case 'MapView':
				return (
					<MapView navigator={navigator} {...route.props} />
				);
			case 'Management':
				return (
					<Management navigator={navigator} {...route.props} />
				);
		}
	}

	render () {
		return (
			<Navigator
				initialRoute={{name: 'Login', index: 0}}
				renderScene={this._renderScene} />
		);
	}
}