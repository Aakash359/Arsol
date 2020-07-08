import React from 'react';
import { CreditNoteOne } from '@containers';

export default class CreditNoteOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <CreditNoteOne 
        navigation={this.props.navigation}
        EditId={this.props.route.params?.EditId ?? 'NO-ID'}
        /> 
      </>
    );
  }
}