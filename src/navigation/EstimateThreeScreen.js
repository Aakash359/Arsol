import React from 'react';
import { EstimateThree } from '@containers';

export default class EstimateThreeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <EstimateThree navigation={this.props.navigation} />
            </>
        );
    }
}