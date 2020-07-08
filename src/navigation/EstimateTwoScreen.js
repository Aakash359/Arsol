import React from 'react';
import { EstimateTwo } from '@containers';

export default class EstimateTwoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <EstimateTwo navigation={this.props.navigation} />
            </>
        );
    }
}
