import React from 'react';
import {ContactThree} from '@containers';

export default class ContactThreeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
     
      <ContactThree navigation={this.props.navigation} />
      </>
    )
  }
}