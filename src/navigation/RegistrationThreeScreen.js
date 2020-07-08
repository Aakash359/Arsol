import React from 'react';
import {RegistrationThree} from '@containers';
import {RegistrationHeader} from '@components';

export default class RegistrationThreeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
      <RegistrationHeader
       step1={false}
       step2={false}
       step3={true}
    />
    <RegistrationThree navigation={this.props.navigation} />
    </>
    ) ;
  }
}
