import React from 'react';
import {MonthlyInvoiceChart} from '@containers';
import {NavigationBar} from '@components';
import {Color} from '@common';
import {Images} from '@common';
import {scale} from 'react-native-size-matters';


export default class MonthlyInvoiceChartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <>
      <NavigationBar
              leftButtonTitle={'Monthly Invoice Chart'}
              height={scale(44)}
              leftButtonTitleColor={Color.black}
              leftButtonIcon={Images.back}
              backgroundColor={Color.headerTintColor}
              onLeftButtonPress={() => {
                this.props.navigation.goBack();
              }}
            />
        <MonthlyInvoiceChart navigation={this.props.navigation} />
        </>
    )

  }
}
