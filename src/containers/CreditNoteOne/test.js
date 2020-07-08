import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    Modal,
    ScrollView
} from 'react-native';

import { connect } from "react-redux";
import { Images, Color } from '@common';
import { scale } from "react-native-size-matters";
//import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';


class CreditNoteOneScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: null,
            date: "27-03-2020",
            extra_chrg: '0',
            tc: 'Thanks for your Business',
            name: '',
            email: '',

            show_list: [

                {
                    item_type: 'Goods',
                    item_des: 'item1',
                    item_qun: '4',
                    item_unit: 'Kg',
                    item_rate: '2000',
                    code: 'test01',
                    item_gst: "12",
                    item_disc: '40%',
                    item_amt: '4000'

                },]
        }

    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#607D8B",
                }}
            />
        );
    }


    _renderListItem(rowData, index) {
        const { value } = this.state;
        console.log(rowData)
        return (
            <View style={{ marginHorizontal: scale(10), paddingHorizontal: scale(15) }}>

                <View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Number</Text>


                        <View style={{
                            height: scale(40),
                            width: '90%',
                            marginTop: scale(5),
                            borderColor: 'grey',
                            borderWidth: scale(1),
                            borderRadius: scale(3)
                        }}>
                            <RNPickerSelect
                                placeholder={{
                                    label: "Please Select",
                                    value: "",
                                    color: 'black',
                                    fontSize: scale(12),
                                    fontWeight: 'bold',
                                }}
                                items={[
                                    { label: 'APV', value: 'APV' },
                                    { label: 'APV', value: 'APV' },
                                ]}
                                onValueChange={(value) => this.state.Constitution}
                            />

                        </View>


                    </View>


                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Type</Text>


                        <View style={{ flexDirection: 'row', marginTop: scale(5), justifyContent: 'space-between' }}>
                            <TextInput
                                style={{
                                    width: '90%',
                                    fontSize: scale(12),
                                    padding: scale(7),
                                    borderWidth: scale(1),
                                    borderColor: '#808B96',
                                    borderRadius: scale(3)
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                
                                underlineColorAndroid="transparent"
                            // onChangeText={invoicno => this.setState({ invoicno })}
                            // value={this.state.invoicno}
                            />

                        </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Customer Name</Text>

                        <TextInput
                            style={{
                                width: '90%',
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(3)
                            }}
                            
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                          
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Credit Note Number</Text>

                        <TextInput
                            style={{
                                width: '90%',
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(3)
                            }}
                            
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                           
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Order Number</Text>

                        <TextInput
                            style={{
                                width: '90%',
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(3)
                            }}
                           
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                           
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Date</Text>

                      <DatePicker
                            style={{ width: scale(305), marginTop: scale(5), }}
                            date={this.state.date}
                            placeholder="Select DateTime"
                            mode="date"
                            format="DD-MM-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"

                            customStyles={{
                                // dateIcon: {
                                //     position: 'absolute',
                                //     left: scale(0),
                                //     top: scale(4),
                                //     marginLeft: scale(0)
                                // },
                                dateInput: {
                                    //marginLeft: scale(36),
                                    height: scale(40),
                                    borderRadius: scale(3),
                                    borderColor: '#808B96',


                                },
                                placeholderText: {
                                    color: '#565656',
                                },
                            }}

                            minuteInterval={10}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Credit Date</Text>

                        <DatePicker
                            style={{ width: scale(305), marginTop: scale(5), }}
                            date={this.state.date}
                            placeholder="Select DateTime"
                            mode="date"
                            format="DD-MM-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"

                            customStyles={{
                                // dateIcon: {
                                //     position: 'absolute',
                                //     left: scale(0),
                                //     top: scale(4),
                                //     marginLeft: scale(0)
                                // },
                                dateInput: {
                                    //marginLeft: scale(36),
                                    height: scale(40),
                                    borderRadius: scale(3),
                                    borderColor: '#808B96',


                                },
                                placeholderText: {
                                    color: '#565656',
                                },
                            }}

                            minuteInterval={10}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />

                    </View>


                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Sales Person</Text>
                           
                        

                        <View style={{
                            height: scale(40),
                            width: '90%',
                            marginTop: scale(5),
                            borderColor: 'grey',
                            borderWidth: scale(1),
                            borderRadius: scale(3)
                        }}>
                            <RNPickerSelect
                                placeholder={{
                                    label: "Sales Person",
                                    value: "",
                                    color: 'black',
                                    fontSize: scale(12),
                                    fontWeight: 'bold',
                                }}
                                items={[
                                    { label: 'Custom', value: 'Custom'},
                                    { label: 'Custom', value: 'Custom' },
                                    
                                ]}
                                onValueChange={(value) => this.state.Constitution}
                            />

                        </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Project Code</Text>

                        <View style={{ flexDirection: 'row', marginTop: scale(5), justifyContent: 'space-between' }}>
                            <TextInput
                                style={{
                                    width: '90%',
                                    fontSize: scale(12),
                                    padding: scale(7),
                                    borderWidth: scale(1),
                                    borderColor: '#808B96',
                                    borderRadius: scale(3)
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                             
                                underlineColorAndroid="transparent"
                            // onChangeText={invoicno => this.setState({ invoicno })}
                            // value={this.state.invoicno}
                            />
                        </View>

                    </View>

                </View>



                <View
                    style={{
                        marginTop: scale(30),
                        marginBottom: scale(100),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                    <TouchableOpacity
                        onPress={() => { this.props.navigation.navigate('CreditNoteTwo')}}
                        style={{
                            width: scale(230),
                            height: scale(40),
                            borderRadius: scale(20),
                            backgroundColor: '#3498DB',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text style={styles.txt_log}
                            numberOfLines={1}
                        >Next</Text>
                    </TouchableOpacity>

                </View>

            </View>

        )
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
        color: '#5D6D7E',
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
    txt: { fontSize: scale(15), width: scale(150), },
    txth: { fontSize: scale(15), fontWeight: 'bold' },

    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(200),
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
    txt_log: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        width: scale(100),
        textAlign: 'center'
    },
});


CreditNoteOneScreen.defaultProps = {
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
)(CreditNoteOneScreen);