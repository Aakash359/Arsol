import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from "react-redux";
import { scale } from "react-native-size-matters";
import { Images, Config, Color } from '@common';
const msg = Config.SuitCRM;
import Snackbar from 'react-native-snackbar';
import { LogoSpinner } from '@components';
import { validate_email } from '../../Omni';
import ArsolApi from '@services/ArsolApi';

class ForgotPasswordScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: ""
        }
    }

    submitPress() {
        const { email } = this.state
        const { network } = this.props;

        if (email.trim() == '') {
            Snackbar.show({
                text: 'Enter Email',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
            });
        } else if (validate_email(email) === false) {

            Snackbar.show({
                text: 'Invalid Email',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
            });
        } else if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        }
        else {
            this.setState({ loading: true }, () => {
                this.hit_forgotPassword(email)
            });
        }
        //this.props.navigation.navigate('Login')
    }

    hit_forgotPassword(email) {
        ArsolApi.ForgotPassword_api(email)

            .then(responseJson => {
                console.log('ForgotPassword_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {

                                if (responseJson.data.hasOwnProperty('message')) {
                                    this.setState({ email: "" }, () => {
                                        alert(responseJson.data.message)
                                    })


                                }


                            } else if (responseJson.data.status == 'failed') {

                                if (responseJson.data.hasOwnProperty('message')) {
                                    alert(responseJson.data.message)
                                }

                            } else {
                                Snackbar.show({
                                    text: msg.servErr,
                                    duration: Snackbar.LENGTH_SHORT,
                                    backgroundColor: "red"
                                });
                            }
                        } else {
                            Snackbar.show({
                                text: msg.servErr,
                                duration: Snackbar.LENGTH_SHORT,
                                backgroundColor: "red"
                            });
                        }
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
                        });
                    }
                } else {
                    if (responseJson.problem == 'NETWORK_ERROR') {
                        Snackbar.show({
                            text: msg.netError,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,

                        });
                    } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                        Snackbar.show({
                            text: msg.serTimErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,

                        });
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
                        });
                        this.setState({
                            loading: false,

                        });
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false,

                });
            });
    }


    render() {
        const { email } = this.state
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled">

                <LogoSpinner loading={this.state.loading} />

                <View style={styles.container}>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: "center",
                    }}>
                        <View style={{

                        }}>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack()}>
                                <View style={{
                                    marginLeft: scale(10)
                                }}>
                                    <Image source={Images.backred} style={{
                                        width: scale(20), height: scale(20),
                                        marginLeft: scale(2),
                                    }} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginLeft: scale(10) }}>
                            <Text style={{
                                //color: '#3498DB',
                                fontSize: scale(20),
                            }}>
                                Forgot Password
                            </Text>
                        </View>


                    </View>

                    <View style={{ marginTop: scale(80) }}>

                        <Image
                            style={styles.image}
                            resizeMode={'contain'}
                            source={Images.forgot}
                        />

                        <View style={{ marginTop: scale(80) }}>
                            <Text
                                style={{
                                    marginLeft: scale(20),
                                    fontSize: scale(12),
                                    fontWeight: 'bold'
                                }}>Please enter your registered email ID.</Text>
                        </View>

                        <View style={{}}>
                            <Text
                                style={{
                                    marginLeft: scale(20),
                                    paddingBottom: scale(20),
                                    fontSize: scale(10),
                                }}>We will send a verification code to your registered email ID.</Text>
                        </View>

                        <View style={styles.userInput}>

                            <TextInput
                                style={styles.input}
                                placeholder={'User Email'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"
                                onChangeText={email => this.setState({ email })}
                                value={email}
                                keyboardType='email-address'
                            />
                        </View>

                        <View
                            style={{
                                marginTop: scale(30),
                                marginBottom: scale(20),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                            <TouchableOpacity

                                onPress={() => { this.submitPress() }}
                                style={{
                                    width: scale(290),
                                    height: scale(40),
                                    borderRadius: scale(20),
                                    backgroundColor: '#3498DB',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={styles.txt_log}
                                    numberOfLines={1}
                                >Submit</Text>
                            </TouchableOpacity>

                        </View>


                    </View>



                </View>




            </KeyboardAwareScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: scale(10),
        flex: 1

    },

    userInput: {
        borderBottomColor: '#000000',
        borderBottomWidth: scale(1),
        marginLeft: scale(30),
        marginRight: scale(30),
    },

    input: {
        width: '73%',
        fontSize: scale(12)
    },

    txt: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(120),
        textAlign: 'center'
    },

    txt_log: {
        fontSize: scale(12),
        color: '#fff',
        fontWeight: 'bold',
        width: scale(100),
        textAlign: 'center'
    },

    txt_reg: {
        fontSize: scale(12),
        color: 'black',
        fontWeight: 'bold',
        width: scale(100),
        textAlign: 'center'
    },
    image: {
        width: scale(120),
        height: scale(120),
        alignSelf: 'center',
        marginTop: scale(5),
    },
})





ForgotPasswordScreen.defaultProps = {
    network: '',

}


const mapStateToProps = (state) => {
    return {



        network: state.network,



    };
};




export default connect(
    mapStateToProps,
    null
)(ForgotPasswordScreen);