import React from 'react';
import { CustomerDetails } from '@containers';
import { NavigationBar } from '@components';
import { Color } from '@common';
import { Images } from '@common';
import { scale } from 'react-native-size-matters';


export default class CustomerDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (

      <CustomerDetails navigation={this.props.navigation} />

    );
  }
}
