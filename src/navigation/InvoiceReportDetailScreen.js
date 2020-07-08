import React from 'react';
import {InvoiceReportDetail} from '@containers';


export default class InvoiceReportDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
  
        <InvoiceReportDetail navigation={this.props.navigation} />
        </>
    )

  }
}