import React from 'react';
import {CreditNoteList} from '@containers';

export default class CreditNoteListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
  
        <CreditNoteList navigation={this.props.navigation} />
        </>
    )

  }
}
