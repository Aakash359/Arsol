import React from 'react';
import { SummaryTab } from '@containers';



export default class SummaryTabScreen extends React.Component {
    render() {
        const {  navigation } = this.props;

        return (
            <SummaryTab
             
                navigation={navigation}
            />
        );
    }
}
