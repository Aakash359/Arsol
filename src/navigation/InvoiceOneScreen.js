import React from 'react';
import { InvoiceOne } from '@containers';

export default class InvoiceOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <InvoiceOne navigation={this.props.navigation}
              EditId={this.props.route.params?.EditId ?? 'NO-ID'}
         />
      </>
    );
  }
}
