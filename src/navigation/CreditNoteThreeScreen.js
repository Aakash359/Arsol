import React from 'react';
import { CreditNoteThree } from '@containers';

export default class CreditNoteThreeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <CreditNoteThree navigation={this.props.navigation} />
            </>
        );
    }
}