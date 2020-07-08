import React from 'react';
import { ForgotPassword } from '@containers';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ForgotPassword navigation={this.props.navigation} />
      </>
    );
  }
}