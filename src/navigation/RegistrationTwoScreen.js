import React from 'react';
import {RegistrationTwo} from '@containers';
import {RegistrationHeader} from '@components';

export default class RegistrationTwoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
      <RegistrationHeader
       step1={false}
       step2={true}
       step3={false}
    />
    <RegistrationTwo navigation={this.props.navigation} />
    </>
    );
  }
}
