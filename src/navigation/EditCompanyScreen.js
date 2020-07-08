import React from 'react';
import { EditCompany } from '@containers';

export default class EditCompanyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <EditCompany navigation={this.props.navigation} />
      </>
    );
  }
}
