import React from 'react';
import {Customer} from '@containers';



export default class CustomerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
        <Customer navigation={this.props.navigation} 
        Cust_id = {this.props.route.params?.Cust_id ?? 'NO-ID'}/>

    )

  }
}
