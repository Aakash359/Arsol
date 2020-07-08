import React from 'react';
import { CreditNoteTwo } from '@containers';

export default class CreditNoteTwoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <CreditNoteTwo navigation={this.props.navigation} />
            </>
        );
    }
}
