import React from 'react';
import {UserRoles} from '@containers';
import {NavigationBar} from '@components';
import {Color} from '@common';
import {Images} from '@common';
import {scale} from 'react-native-size-matters';

export default class UserRolesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    
    return (<>
      
         <UserRoles navigation={this.props.navigation} />
         
         </>
         ) ;
  }
}
