import React from 'react';
import { CustomerPayTwo } from '@containers';

export default class CustomerPayTwoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <CustomerPayTwo navigation={this.props.navigation} 
         comp_id = {this.props.route.params?.comp_id ?? 'NO-ID'}
         date = {this.props.route.params?. date ?? 'NO-ID' }/>
      </>
    );
  }
}
