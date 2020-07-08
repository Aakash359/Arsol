import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import {scale} from 'react-native-size-matters';

export default class NavigationBar extends Component {
  static propTypes = {
    //not include the height of statusBar on ios platform
    height: PropTypes.number,
    titleColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    onLeftButtonPress: PropTypes.func,
  };

  static defaultProps = {
    height: scale(44),
    titleColor: '#000',
    backgroundColor: '#f5f3f4',
  };

  _renderLeftIcon() {
    if (this.props.leftButtonIcon) {
      return (
        <Image
          style={styles.leftButtonIcon}
          resizeMode={'contain'}
          source={this.props.leftButtonIcon}
        />
      );
    }
    return null;
  }
  _renderSearchIcon() {
    if (this.props.SearchButtonIcon) {
      return (
        <Image
          style={styles.leftButtonIcon}
          resizeMode={'contain'}
          source={this.props.SearchButtonIcon}
        />
      );
    }
    return null;
  }

  _renderPrintIcon() {
    if (this.props.PrintButtonIcon) {
      return (
        <Image
          style={styles.leftButtonIcon}
          resizeMode={'contain'}
          source={this.props.PrintButtonIcon}
        />
      );
    }
    return null;
  }

  _renderAddIcon() {
    if (this.props.AddButtonIcon) {
      return (
        <Image
          style={styles.leftButtonIcon}
          resizeMode={'contain'}
          source={this.props.AddButtonIcon}
        />
      );
    }
    return null;
  }

  

  _onLeftButtonPressHandle(event) {
    let onPress = this.props.onLeftButtonPress;
    typeof onPress === 'function' && onPress(event);
  }

  _onSearchButtonPressHandle(event) {
    let onPress = this.props.onSearchButtonPressHandle;
    typeof onPress === 'function' && onPress(event);
  }

  _onAddButtonPressHandle(event) {
    let onPress = this.props.onAddButtonPressHandle;
    typeof onPress === 'function' && onPress(event);
  }

  _onPrintButtonPressHandle(event) {
    let onPress = this.props.onPrintButtonPressHandle;
    typeof onPress === 'function' && onPress(event);
  }

  render() {
    return (
      <View
        style={{
          height: this.props.height,
          backgroundColor: this.props.backgroundColor,
           
          justifyContent: 'center',
          borderTopWidth:scale(0.5),
          borderBottomWidth:scale(0.5),
          borderColor:'grey'

        }}>
     
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={this._onLeftButtonPressHandle.bind(this)}>
              {this._renderLeftIcon()}
            </TouchableOpacity>

            <Text
              style={[
                styles.leftButtonTitle,
                {color: this.props.leftButtonTitleColor},
              ]}>
              {this.props.leftButtonTitle}
            </Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>

          <TouchableOpacity
              onPress={this._onPrintButtonPressHandle.bind(this)}>
              {this._renderPrintIcon()}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._onSearchButtonPressHandle.bind(this)}>
              {this._renderSearchIcon()}
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={this._onAddButtonPressHandle.bind(this)}
            style={{marginRight:scale(5)}}
            >
              {this._renderAddIcon()}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  leftButtonIcon: {
    width: scale(29),
    height: scale(29),
    marginRight: scale(6),
    marginLeft: scale(10),
  },
  leftButtonTitle: {
    fontSize: scale(15),
  },
});
