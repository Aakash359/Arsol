import React from 'react';
import {CustomerLedger} from '@containers';

export default class CustomerLedgerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
     
        <CustomerLedger navigation={this.props.navigation} />
        </>
    )

  }
}
