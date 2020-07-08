import React from 'react';
import { ChangePassword } from '@containers';

export default class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <ChangePassword navigation={this.props.navigation} />
      </>
    );
  }
}