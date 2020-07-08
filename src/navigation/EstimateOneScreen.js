import React from 'react';
import { EstimateOne } from '@containers';

export default class EstimateOneScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <EstimateOne 
             navigation={this.props.navigation}
             EditId={this.props.route.params?.EditId ?? 'NO-ID'}
              />
             
      </>
    );
  }
}
