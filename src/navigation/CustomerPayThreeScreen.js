import React from 'react';
import { CustomerPayThree } from '@containers';

export default class CustomerPayThreeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <CustomerPayThree navigation={this.props.navigation} />
      </>
    );
  }
}
