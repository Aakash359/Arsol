import React, {Component} from 'react';
import {SideMenu} from '@containers';

export default class SideMenuScreen extends Component {
  render() {
    return <SideMenu navigation={this.props.navigation} />;
  }
}
