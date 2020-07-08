import React from 'react';
import {Home} from '@containers';
import {NavigationBar} from '@components';
import {Color} from '@common';
import {Images} from '@common';
import {scale} from 'react-native-size-matters';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
  
        <Home navigation={this.props.navigation} />
        </>
    )

  }
}
