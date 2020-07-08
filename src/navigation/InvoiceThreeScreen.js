import React from 'react';
import { InvoiceThree } from '@containers';

export default class InvoiceThreeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <InvoiceThree navigation={this.props.navigation} />
      </>
    );
  }
}