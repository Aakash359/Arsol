import React from 'react';
import {BankDetails} from '@containers';

export default class BankDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return(
    <>
        


          <BankDetails navigation={this.props.navigation} />
    </>) 
  }
}
