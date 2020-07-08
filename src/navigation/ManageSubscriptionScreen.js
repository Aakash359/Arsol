import React from 'react';
import {ManageSubscription} from '@containers';
import {NavigationBar} from '@components';
import {Color} from '@common';
import {Images} from '@common';
import {scale} from 'react-native-size-matters';

export default class ManageSubscriptionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    
    return (<>
     
         <ManageSubscription navigation={this.props.navigation} />
          </>
         ) ;
  }
}
