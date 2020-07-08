import React from 'react';
import {Loading} from '@containers';


export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Render any loading content that you like here
  render() {
    return <Loading navigation={this.props.navigation} />;
  }
}
