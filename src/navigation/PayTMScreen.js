import React from 'react';
import {PayTM} from '@containers';


export default class PayTMScreen extends React.Component {
  
// Render any loading content that you like here
  render() {
    return <PayTM navigation={this.props.navigation}
                  route={this.props.route}
                   />;
  }
}
