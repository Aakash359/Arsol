import React from 'react';
import {GstReport} from '@containers';


export default class GstReportScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
      
        <GstReport navigation={this.props.navigation} />
        </>
    )

  }
}
