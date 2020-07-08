import React from 'react';
import {RegistrationOne} from '@containers';
import { scale } from 'react-native-size-matters';
import {RegistrationHeader} from '@components';

export default class RegistrationOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
      <RegistrationHeader
       step1={true}
       step2={false}
       step3={false}
    />
     
      <RegistrationOne navigation={this.props.navigation} />
      </>
    )
    
    
  
  }
}
