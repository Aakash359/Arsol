import React from 'react';
import {InvoiceList} from '@containers';

export default class InvoiceListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
       <InvoiceList navigation={this.props.navigation} />
        </>
    )

  }
}
