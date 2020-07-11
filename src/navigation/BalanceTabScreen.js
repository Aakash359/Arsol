import React from 'react';
import { BalanceTab } from '@containers';



export default class BalanceTabScreen extends React.Component {
    render() {
        const {  navigation } = this.props;

        return (
            <BalanceTab
              
                navigation={navigation}
            />
        );
    }
}
