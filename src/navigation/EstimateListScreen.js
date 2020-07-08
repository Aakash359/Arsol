import React from 'react';
import {EstimateList} from '@containers';



export default class EstimateListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
     
        <EstimateList navigation={this.props.navigation} />
        </>
    )

  }
}
