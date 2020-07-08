import React from 'react';
import {InvoiceReport} from '@containers';


export default class InvoiceReportScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
     
        <InvoiceReport navigation={this.props.navigation} />
        </>
    )

  }
}
