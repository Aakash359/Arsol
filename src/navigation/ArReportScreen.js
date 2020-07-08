import React from 'react';
import {ArReport} from '@containers';


export default class ArReportScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
     
        <ArReport navigation={this.props.navigation} />
        </>
    )

  }
}
