import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    TextInput,
    Modal
} from 'react-native';

import { connect } from "react-redux";
import { Images ,Color} from '@common';
import { scale } from "react-native-size-matters";
//import Snackbar from 'react-native-snackbar';
import Checkbox from 'react-native-modest-checkbox';
import {NavigationBar} from '@components';



class CustomerPayThreeScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            value: null,
            date: "27-03-2020",
            extra_chrg: '0',
            tc: 'Thanks for your Business',
            SalesModalStatus: 'false',

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
            <View style={{ paddingHorizontal: scale(10),
                marginHorizontal: scale(40),}}>

                <View>

                    <View style={{ marginTop: scale(5), }}>
                        <Checkbox
                            label='Advance/On Account'
                            onChange={(checked) => console.log('Checked!')}
                        />
                    </View>

                    <View style={{ marginTop: scale(10) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Total Amount</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Amount Recieved</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>TDS Amount</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Round Off</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Balance</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}

                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            // onChangeText={invoicno => this.setState({ invoicno })}
                            value={this.state.extra_chrg}
                        />

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Advance/On Account</Text>

                        <TextInput
                            style={{
                                
                                marginTop: scale(5),
                                fontSize: scale(12),
                                padding: scale(7),
                                borderWidth: scale(1),
                                borderColor: '#808B96',
                                borderRadius: scale(5)
                            }}
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                        // onChangeText={invoicno => this.setState({ invoicno })}
                        // value={this.state.invoicno}
                        />

                    </View>

                    <View
                        style={{
                            marginTop: scale(20),
                            marginBottom: scale(10),
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                        <TouchableOpacity
                            onPress={() => { this.props.navigation.push('Main') }}
                            style={{
                                width: scale(230),
                                height: scale(40),
                                borderRadius: scale(20),
                                backgroundColor: '#3498DB',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: scale(70)
                            }}
                        >
                            <Text style={styles.txt_log}
                                numberOfLines={1}
                            >Recieve Payment</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        )
    }


    render() {

        return (
            <View style={{flex:1,
            }}>
            <NavigationBar
                     leftButtonTitle={'Customer Payment'}
                     height={scale(44)}
                     leftButtonTitleColor={Color.black}
                     leftButtonIcon={Images.back}
                     backgroundColor={Color.headerTintColor}
                     onLeftButtonPress={() => {
                       this.props.navigation.goBack();
                     }}
        />



                <View style={{ height: scale(50), backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{
                        flexDirection: "row",
                        borderRadius: 5,
                        height: scale(40),
                        width: '90%',
                        borderWidth: 1,
                        justifyContent: 'space-around',
                        borderColor: '#ddd',
                        marginTop: scale(3)
                    }}>

                        <View style={{
                            backgroundColor: false ? "#1C77BA" : "#fff",
                            width: scale(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: scale(5),
                            margin: scale(2)

                        }}>

                            <Text style={{
                                color: false ? "#fff" : "#000"
                                , fontSize: scale(15)
                            }}>Step 1</Text>
                        </View>

                        <View style={{
                            backgroundColor: false ? "#1C77BA" : "#fff",
                            width: scale(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: scale(5),
                            margin: scale(2)

                        }}>

                            <Text style={{
                                color: false ? "#fff" : "#000"
                                , fontSize: scale(15)
                            }}>Step 2</Text>
                        </View>

                        <View style={{
                            backgroundColor: true ? "#1C77BA" : "#fff",
                            width: scale(100),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: scale(5),
                            margin: scale(2)

                        }}>

                            <Text style={{
                                color: true ? "#fff" : "#000"
                                , fontSize: scale(15)
                            }}>Step 3</Text>
                        </View>



                    </View>

                </View>



                <FlatList
                    contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
                    keyExtractor={(item, index) => index}
                    data={this.state.show_list}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={(item, index) => this._renderListItem(item, index)}
                    bounces={false}
                //extraData={this.state}

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
    txt: { fontSize: scale(15), width: scale(150), },
    txth: { fontSize: scale(15), fontWeight: 'bold' },
    txt_log: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        width: scale(200),
        textAlign: 'center'
    },
});


CustomerPayThreeScreen.defaultProps = {
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
)(CustomerPayThreeScreen);