import React from 'react';
import {ItemDetails} from '@containers';

import {Color} from '@common';
import {Images} from '@common';
import {scale} from 'react-native-size-matters';


export default class ItemDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return(
    <>
        


          <ItemDetails navigation={this.props.navigation} />
    </>) 
  }
}
