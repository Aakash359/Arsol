import React from 'react';
import {UserDetails} from '@containers';


export default class UserDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <>
     
         <UserDetails navigation={this.props.navigation} />
         </>
    )
  }
}
