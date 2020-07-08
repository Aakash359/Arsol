import React from 'react';
import { ContactTwo} from '@containers';


export default class ContactTwoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
      <ContactTwo navigation={this.props.navigation} />
      </>
    )
  }
}