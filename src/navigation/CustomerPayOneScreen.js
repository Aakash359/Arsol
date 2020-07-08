import React from 'react';
import { CustomerPayOne } from '@containers';

export default class CustomerPayOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <CustomerPayOne navigation={this.props.navigation}
          EditId={this.props.route.params?.EditId ?? 'NO-ID'}
        
         />
      </>
    );
  }
}
