import React from 'react';
import {ContactOne} from '@containers';

export default class ContactOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
      <ContactOne navigation={this.props.navigation}
      Edit_Id = {this.props.route.params?.Edit_Id ?? 'NO-ID'} />
      </>
    )
  }
}
