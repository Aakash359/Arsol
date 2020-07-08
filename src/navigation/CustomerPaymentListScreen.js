import React from 'react';
import {CustomerPaymentList} from '@containers';


export default class CustomerPaymentListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
 
        <CustomerPaymentList navigation={this.props.navigation} />
        </>
    )

  }
}
