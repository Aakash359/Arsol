import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TouchableHighlight,
    Modal,
    ScrollView,
    TextInput
} from 'react-native'; 

import { connect } from "react-redux";
import { Images, Color } from '@common';
import { scale } from "react-native-size-matters";
//import Snackbar from 'react-native-snackbar';
import { Panel } from '@components'
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';


class CreditNoteTwoScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: null,
            date: "27-03-2020",
            extra_chrg: '0',
            tc: 'Thanks for your Business',
            addItem: false,

            show_list: [

                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },
                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },
                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },
                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },
                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },
                {
                    item_type: 'Goods',
                    item_quant: '4',
                    item_desc: 'item1',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },

            ]
        }

    }


    _renderListItem(rowData) {

        console.log(rowData)

        return (

            <TouchableHighlight
                onPress={() => { this.props.navigation.navigate('CreditNoteThree') }}
                style={styles.rowFront}
                underlayColor={'#AAA'}>

                <Panel
                    item_type={rowData.item.item_type}
                    item_quant={rowData.item.item_quant}
                    item_desc={rowData.item.item_desc}
                    expanded={true}>

                    <View
                        style={{
                            padding: scale(3),
                            backgroundColor: '#F7F7F7',
                        }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txth}
                                numberOfLines={1}
                            >Item Unit: </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.item_unit}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txth}
                                numberOfLines={1}
                            >Item Rate: </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.item_rate}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txth}
                                numberOfLines={1}
                            >HSN/SAC Code: </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.code}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles .txth}
                                numberOfLines={1}
                            >Item Gst (%): </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.item_gst}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txth}
                                numberOfLines={1}
                            >Discount(%): </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.item_disc}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txth}
                                numberOfLines={1}
                            >Amount: </Text>
                            <Text style={styles.txt}
                                numberOfLines={1}
                            >{rowData.item.item_amt}</Text>
                        </View>


                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: scale(5), backgroundColor: '#fff' }}>
                            <TouchableOpacity
                                style={{}}
                            >
                                <Image source={Images.edit} style={{
                                    width: scale(30), height: scale(30),
                                }} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{}}
                            >
                                <Image source={Images.bin} style={{
                                    width: scale(30), height: scale(30),
                                }} />
                            </TouchableOpacity>
                        </View>

                    </View>


                </Panel>

            </TouchableHighlight>

        );

    }



    render() {

        return (
            <View style={{flex:1,
            }}>
            <NavigationBar
                     leftButtonTitle={'Create Credit Note'}
                     height={scale(44)}
                     leftButtonTitleColor={Color.black}
                     leftButtonIcon={Images.back}
                     backgroundColor={Color.headerTintColor}
                     onLeftButtonPress={() => {
                       this.props.navigation.goBack();
                     }}
        />




           

               


              


            </View>

        );
    }
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    radioText: {
        marginRight: scale(10),
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold'
    },
    radioCircle: {
        height: scale(15),
        width: scale(15),
        borderRadius: scale(10),
        borderWidth: scale(1),
        borderColor: '#3498DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: scale(15),
        height: scale(15),
        borderRadius: scale(30),
        backgroundColor: '#3498DB',
    },
    txt: { fontSize: scale(15), width: scale(150), color: '#5D6D7E', },
    txth: { fontSize: scale(15), fontWeight: 'bold' },

    rowFront: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        borderRadius: scale(12),
        margin: scale(10),
        shadowColor: "#000",
        shadowRadius: scale(5),
        elevation: scale(5),
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.9,
    },
    listTouch1: {
        position: 'absolute',
        width: scale(45),
        height: scale(45),
        alignItems: 'center',
        justifyContent: 'center',
        right: scale(20),
        bottom: scale(10),
    },

    listImg2: {
        resizeMode: 'contain',
        width: scale(50),
        height: scale(50),
    },
    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        
        textAlign: 'left'
    },

    userInput: {
        height: scale(40),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
        borderRadius: scale(5)
    },

    input: {
        color: '#000',
        marginLeft: scale(5),
        width: '73%',
        fontSize: scale(12)
    },



    userInputTC: {
        height: scale(100),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
    },

    inputTC: {
        color: '#000',
        fontSize: scale(12)
    },
});


CreditNoteTwoScreen.defaultProps = {
    session: [],
}


const mapStateToProps = (state) => {
    return {

        session: state.user.session_id,
        network: state.network,

    };
};


export default connect(
    mapStateToProps,
    null
)(CreditNoteTwoScreen);



