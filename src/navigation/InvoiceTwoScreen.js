import React from 'react';
import { InvoiceTwo } from '@containers';

export default class InvoiceTwoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <InvoiceTwo navigation={this.props.navigation} />
      </>
    );
  }
}