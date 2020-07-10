import React from 'react';
import { AgingTab } from '@containers';



export default class AgingTabScreen extends React.Component {
 

    render() {
        const {  navigation } = this.props;

        return (
            <AgingTab
            
                navigation={navigation}
            />
        );
    }
}
