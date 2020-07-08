import React, { PureComponent } from "react";

import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Keyboard, ImageBackground } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import { connect } from "react-redux";

import { scale } from "react-native-size-matters";
import { StackActions, CommonActions } from '@react-navigation/native';
import { Images, Config, Color } from '@common';
//import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import { validate_email } from '../../Omni';
import AnimateLoadingButton from 'react-native-animate-loading-button';



class LoginScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            //  username: 'rahul.singh@tactionsoftware.com',
            //  password: 'Rahul@123',
            username: 'abhishek@tactionsoftware.com',
            password: 'Abhi@123',
        }

    }

    componentDidMount() {

        this.props.logout();

    }


    _handlePaytmResponse = (resp) => {
        const { STATUS, status, response } = resp;

        this.setState({ processing: false, payment_text: '' });
        console.log(JSON.stringify(resp));
    };



    hit_login(username, password) {

        ArsolApi.login_api(username, password)
            .then(responseJson => {
                console.log('login', responseJson);
                this.setState({ loading: false })
                this.loadingButton.showLoading(false)
                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                    });
                    this.loadingButton.showLoading(false)

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    //  alert(responseJson.data.message)

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {
                                            this.props.login(responseJson.data.data[0]);
                                            this.props.navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 0,
                                                    routes: [
                                                        { name: 'Main' },

                                                    ],
                                                })
                                            );
                                        }
                                    }

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
                        this.loadingButton.showLoading(false)
                    } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                        Snackbar.show({
                            text: msg.serTimErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,
                        });
                        this.loadingButton.showLoading(false)
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
                        });
                        this.setState({
                            loading: false,
                        });
                        this.loadingButton.showLoading(false)
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false,
                });
                this.loadingButton.showLoading(false)
            });
    }

    _onPressHandler() {
        Keyboard.dismiss();
        const { username, password } = this.state;
        const { network } = this.props;

        if (username.trim() == '') {
            Snackbar.show({
                text: 'Enter Email',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
            });
        } else if (validate_email(username) === false) {

            Snackbar.show({
                text: 'Invalid Email',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen
            });
        } else if (password.trim() == '') {
            Snackbar.show({
                text: 'Enter Password',
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
            this.loadingButton.showLoading(true);

            this.setState({ loading: true }, () => {
                this.hit_login(username, password)
            });



        }
    }






    render() {



        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1, }}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled">

                <LogoSpinner loading={this.state.loading} />

                <View style={styles.container}>


                    <ImageBackground style={{
                        height: scale(200), padding: scale(20),

                    }}
                        source={Images.bglogin}
                    >

                        {/* <View style={{flexDirection:'row',alignItems:"center"}}>
          <Text style={{
            color: 'yellow',
            fontSize: scale(20)
          }}>Welcome to</Text>
          <Text style={{
            color: 'yellow',
            fontSize: scale(25),
            fontWeight:"bold",
            marginLeft:scale(5)
          }}>Arsol,</Text>

</View>

        <Text style={{
          color: '#fff',
          fontSize: scale(15),
          fontWeight:"bold"
        }}>   Signin to Continue</Text> */}


                    </ImageBackground>


                    <View style={{
                        position: 'absolute',
                        bottom: 100,
                        alignSelf: "center"

                    }}>
                        <Text style={{ fontSize: scale(14), textAlign: "center" }}>----------Or----------</Text>

                        <TouchableOpacity
                            onPress={() => { this.props.navigation.navigate('RegistrationOne') }}
                        >
                            <Text style={{ fontSize: scale(18), color: "grey", textAlign: "center" }}>Signup</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={{
                        marginHorizontal: scale(20),
                        height: scale(250),
                        borderRadius: scale(15),
                        backgroundColor: "#fff",
                        position: "absolute",
                        width: scale(300),
                        alignSelf: "center",
                        top: scale(160),


                        padding: scale(15),
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 9,
                        },
                        shadowOpacity: 0.48,
                        shadowRadius: 11.95,

                        elevation: 18,

                    }}>
                        <View style={{
                            margin: scale(10), alignItems: "center",
                            justifyContent: "center"
                        }}
                        >
                            <Text style={{
                                fontSize: scale(16),
                                color: "#000",
                                fontWeight: "bold"
                            }}>LOGIN</Text>
                            <View style={{ backgroundColor: "orange", height: scale(1.5), width: scale(80) }} />
                            <View style={{ backgroundColor: "orange", height: scale(1.5), width: scale(40), marginTop: scale(2) }} />
                            <View style={styles.SectionStyle}>

                                <Image source={Images.mail} style={styles.ImageStyle} />

                                <TextInput
                                    style={{ flex: 1 }}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    placeholder="Enter Email"
                                    underlineColorAndroid="transparent"
                                    onChangeText={username => this.setState({ username })}
                                    returnKeyType={'next'}
                                    onSubmitEditing={() => {
                                        this.state.username.trim() != '' ?
                                            this.secondTextInput.focus() :
                                            Snackbar.show({
                                                text: 'Enter Email',
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: Color.lgreen
                                            });
                                    }}
                                    value={this.state.username}
                                />

                            </View>

                            <View style={styles.SectionStyle}>

                                <Image source={Images.lock} style={styles.ImageStyle} />

                                <TextInput
                                    ref={(input) => { this.secondTextInput = input; }}
                                    style={{ flex: 1 }}
                                    autoCorrect={false}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    placeholder="Enter Password"
                                    underlineColorAndroid="transparent"
                                    onChangeText={password => this.setState({ password })}
                                    secureTextEntry
                                    onSubmitEditing={() => { this._onPressHandler() }}
                                    value={this.state.password}
                                />

                            </View>

                            <TouchableOpacity
                                style={{ alignSelf: "flex-end", marginTop: scale(10), }}
                                onPress={() => { this.props.navigation.navigate('ForgotPassword') }}
                            >
                                <Text style={{

                                    color: "grey"
                                }}>Forgot Password ?</Text>
                            </TouchableOpacity>




                        </View>


                        <View style={{
                            alignSelf: "center",
                            position: "absolute",
                            bottom: scale(-40),
                            borderBottomLeftRadius: scale(80),
                            borderBottomRightRadius: scale(80),

                            borderTopColor: '#fff',
                            height: scale(80),
                            width: scale(80),
                            borderColor: '#78909C',
                            backgroundColor: "#fff",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: scale(9),
                            },

                            shadowBottomRightRadius: 11.95,
                            shadowBottomLeftRadius: 11.95,
                            shadowBottomLeftRadius: scale(0.48),
                            shadowBottomRightRadius: scale(0.48),



                        }}>


                            <AnimateLoadingButton
                                ref={c => (this.loadingButton = c)}
                                width={scale(70)}
                                height={scale(70)}
                                title="Login"
                                titleFontSize={scale(16)}
                                titleColor="rgb(255,255,255)"
                                backgroundColor="rgb(29,18,121)"
                                borderRadius={scale(35)}
                                onPress={this._onPressHandler.bind(this)}
                            />





                        </View>


                    </View>



                </View>






            </KeyboardAwareScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1

    },

    userInput: {
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginLeft: scale(30),
        marginRight: scale(30),
    },
    userImg: {
        position: 'absolute',
        zIndex: scale(99),
        width: scale(22),
        height: scale(22),
        left: scale(10),
        top: scale(9),
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
        color: 'black',
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
        width: scale(200),
        height: scale(100),
        alignSelf: 'center',
        marginTop: scale(5),
    },

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: .5,
        borderColor: '#000',
        height: 40,
        borderRadius: 20,
        marginTop: scale(10),
        marginHorizontal: scale(5)
    },

    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center'
    },
})





LoginScreen.defaultProps = {
    id: "",
}


const mapStateToProps = (state) => {
    return {


        id: state.user.id,
        network: state.network,



    };
};

const mapDispatchToProps = dispatch => {
    const { actions } = require('@redux/UserRedux');

    return {
        login: customers => dispatch(actions.login(customers)),
        logout: () => dispatch(actions.logout()),
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);