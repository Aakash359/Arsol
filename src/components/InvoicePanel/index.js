import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Animated,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import {Images} from '@common';

export default class InvoicePanel extends Component {
  constructor(props) {
    super(props);

    this.icons = {
      up: Images.uparrow,
      down: Images.downarow,
    };

    this.state = {
      inv_no: props.inv_no,
      cont_name: props.cont_name,
      inv_date: props.inv_date,
      expanded: props.expanded,
      animationValue: new Animated.Value(scale(90)),
    };
  }

  toggle() {
    if (this.state.expanded == true) {
      Animated.spring(this.state.animationValue, {
        toValue: scale(280),
      }).start(this.setState({expanded: false}));
    } else {
      Animated.spring(this.state.animationValue, {
        toValue: scale(90),
      }).start(this.setState({expanded: true}));
    }
  }

  render() {
    let icon = this.icons['up'];

    if (this.state.expanded) {
      icon = this.icons['down'];
    }
    const {inv_no, cont_name, inv_date} = this.state;

    return (
      <Animated.View
        style={{height: this.state.animationValue, overflow: 'hidden'}}>
        <View style={{padding: scale(7)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '80%'}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{fontSize: scale(15), fontWeight: 'bold'}}
                  numberOfLines={1}>
                  Invoice Number:{' '}
                </Text>
                <Text
                  style={{
                    color: '#5D6D7E',
                    fontSize: scale(15),
                  }}
                  numberOfLines={1}>
                  {inv_no}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{fontSize: scale(15), fontWeight: 'bold'}}
                  numberOfLines={1}>
                  Contact Display Name:{' '}
                </Text>
                <Text
                  style={{
                    color: '#5D6D7E',
                    fontSize: scale(15),
                  }}
                  numberOfLines={1}>
                  {cont_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{fontSize: scale(15), fontWeight: 'bold'}}
                  numberOfLines={1}>
                  Invoice Date:{' '}
                </Text>
                <Text
                  style={{
                    color: '#5D6D7E',
                    fontSize: scale(15),
                  }}
                  numberOfLines={1}>
                  {inv_date}
                </Text>
              </View>
            </View>

            <TouchableHighlight
              onPress={this.toggle.bind(this)}
              underlayColor="#f1f1f1">
              <Image style={styles.buttonImage} source={icon} />
            </TouchableHighlight>
          </View>
        </View>

        <View style={{padding: scale(7)}}>{this.props.children}</View>
      </Animated.View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },

  title: {
    color: '#2a2f43',
    fontWeight: 'bold',
  },
  button: {
    //  backgroundColor:"red"
  },
  buttonImage: {
    width: scale(20),
    height: scale(20),
  },
});
