import React, { PureComponent } from "react";

import {
    View, Keyboard, TouchableHighlight,

    Text, Modal, ScrollView, TextInput,
    StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import { NavigationBar } from '@components';
import { validate_email, validate_pass } from '../../Omni';

class UserDetailsScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refresh: false,
            addItem: false,
            show_list: [],
            fname: '',
            lname: '',
            u_type: 'Admin',
            email_id: '',
            password: '',
        }

    }

    componentDidMount() {
        const { network } = this.props;
        if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else {
            this.setState({ loading: true, ed_id: "", }, () => {
                this.hit_userDetailApi()
            })
        }
    }



    //add
    _addUser_fun() {
        const { fname,
            lname,
            u_type,
            email_id,
            password,
            ed_id,

        } = this.state

        const { user_id, user_type, network } = this.props
        Keyboard.dismiss()
        if (fname == "") {
            alert("Enter First Name")
        } else if (lname == "") {
            alert("Enter Last  Name")
        } else if (u_type == "") {
            alert("Select User Type")
        } else if (email_id == "") {
            alert("Enter Email id")

        } else if (validate_email(email_id) === false) {
            alert("Invalid Email id")
        } else if (password == "") {
            alert("Enter Password")
        }
        else if (validate_pass(password) === false) {
            alert("password must contain at least eight characters, at least one number and both lower and uppercase letters and special characters")
        }
        else if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else {
            this.setState({ loading: true, addItem: false, ed_id: "", }, () => {
                this.hit_addUserApi(user_id, user_type,
                    fname,
                    lname,
                    u_type,
                    email_id,
                    password,
                    ed_id)

            })
        }

    }



    hit_userDetailApi() {
        const { user_id, user_type } = this.props

        ArsolApi.UserDetails_api(user_id, user_type)

            .then(responseJson => {
                console.log('UserDetails_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                        refresh: false
                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {
                                            this.setState({
                                                show_list: [...this.state.show_list, ...responseJson.data.data],
                                            })
                                            Snackbar.show({
                                                text: responseJson.data.message,
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: Color.lgreen
                                            });
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
                            refresh: false
                        });
                    } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                        Snackbar.show({
                            text: msg.serTimErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,
                            refresh: false
                        });
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
                        });
                        this.setState({
                            loading: false,
                            refresh: false
                        });
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false,
                    refresh: false
                });
            });
    }


    hit_addUserApi(user_id, user_type,
        fname,
        lname,
        u_type,
        email_id,
        password,
        ed_id, ) {

        ArsolApi.AddUser_post_api(user_id, user_type,
            fname,
            lname,
            u_type,
            email_id,
            password,
            ed_id)


            .then(responseJson => {
                console.log('AddUser_Post_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,

                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {

                                            alert(responseJson.data.message)

                                            this.setState({
                                                fname: "",
                                                lname: "",
                                                u_type: "",
                                                email_id: "",
                                                password: "",
                                            }, () => {
                                                this.onRefresh()
                                            })

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


    hit_userDetailApi() {
        const { user_id, user_type } = this.props

        ArsolApi.UserDetails_api(user_id, user_type)

            .then(responseJson => {
                console.log('UserDetails_api', responseJson);

                if (responseJson.ok) {
                    this.setState({
                        loading: false,
                        refresh: false
                    });

                    if (responseJson.data != null) {
                        if (responseJson.data.hasOwnProperty('status')) {

                            if (responseJson.data.status == 'success') {
                                if (responseJson.data.hasOwnProperty('message')) {

                                    if (responseJson.data.hasOwnProperty("data")) {
                                        if (responseJson.data.data.length > 0) {
                                            this.setState({
                                                show_list: [...this.state.show_list, ...responseJson.data.data],
                                            })
                                            Snackbar.show({
                                                text: responseJson.data.message,
                                                duration: Snackbar.LENGTH_SHORT,
                                                backgroundColor: Color.lgreen
                                            });
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
                            refresh: false
                        });
                    } else if (responseJson.problem == 'TIMEOUT_ERROR') {
                        Snackbar.show({
                            text: msg.serTimErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: Color.lgreen
                        });
                        this.setState({
                            loading: false,
                            refresh: false
                        });
                    } else {
                        Snackbar.show({
                            text: msg.servErr,
                            duration: Snackbar.LENGTH_SHORT,
                            backgroundColor: "red"
                        });
                        this.setState({
                            loading: false,
                            refresh: false
                        });
                    }
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false,
                    refresh: false
                });
            });
    }


    //refresh
    onRefresh() {
        const { network } = this.props
        if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else {
            this.setState(
                {
                    refresh: true,

                    show_list: [],
                },
                () => {
                    this.hit_userDetailApi();
                },
            );
        }

    }

    _onMomentumScrollBegin = () => this.setState({ onEndReachedCalledDuringMomentum: false });
    //loadmore
    handleLoadMore = () => {
        const { load_more, page } = this.state;
        const { network } = this.props;

        if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else if (!this.state.onEndReachedCalledDuringMomentum) {
            if (load_more) {
                this.setState(
                    {
                        page: page + 10,
                        onEndReachedCalledDuringMomentum: true,
                    },
                    () => {
                        this.hit_userDetailApi();
                    },
                );
            }
        }
    };



    GetItem(item, i) {
        const { show_list } = this.state

        this.setState({
            addItem: true,
            fname: show_list[i].fname,
            lname: show_list[i].lname,
            u_type: 'Admin',
            email_id: show_list[i].email_id,
            password: show_list[i].password,
            ed_id: item,

        })



    }

    _renderListItem(rowData, index) {
        console.log(rowData)
        return (
            <View style={{
                padding: scale(10),
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderRadius: scale(15),
                backgroundColor: "#fff",
                marginHorizontal: scale(20),
                marginVertical: scale(10)

            }}
                key={rowData.index}
            >

                <Text style={{
                    fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                    textTransform: 'capitalize'
                }}
                    numberOfLines={1}
                >{rowData.item.email_id}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >First Name:{rowData.item.fname}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >Last Name:{rowData.item.lname}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >User Type:{rowData.item.usertype}</Text>







                <Text style={styles.txt}
                    numberOfLines={2}
                >Create Date:{rowData.item.created_date}</Text>



                <Text style={styles.txt}
                    numberOfLines={1}
                >Created By:{rowData.item.created_by}</Text>


                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={'#ddd'}
                    onPress={() => { this.GetItem(rowData.item.user_id, rowData.index) }}
                    style={{
                        width: scale(40), height: scale(40),
                        alignItems: "center",
                        justifyContent: 'center',
                        borderRadius: scale(20),
                        position: 'absolute',
                        right: -10,
                        top: -12
                    }}
                >

                    <Image source={Images.pencil} style={{
                        width: scale(20), height: scale(20),


                    }} />

                </TouchableHighlight>

            </View>
        )
    }

    //additem

    _addUserRender() {
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.addItem}
                onRequestClose={() => {
                    this.setState({ addItem: false });
                }}>
                <View style={{ flex: 1 }}>



                    <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: "center",
                            padding: scale(5)
                        }}
                        keyboardShouldPersistTaps="handled"
                    >


                        <View>


                            <View style={{
                                backgroundColor: 'white',
                                width: '90%',
                                padding: scale(10),
                                borderRadius: scale(5),
                                alignItems: 'center'
                            }}>



                                <Text style={styles.txt_h}>First Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={fname => this.setState({ fname })}
                                        value={this.state.fname}
                                    />
                                </View>

                                <Text style={styles.txt_h}>Last Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={lname => this.setState({ lname })}
                                        value={this.state.lname}
                                    />
                                </View>

                                <Text style={styles.txt_h}>User type</Text>
                                <View style={styles.userInput}>

                                    <RNPickerSelect
                                        placeholder={{}}
                                        items={[
                                            { label: 'Admin', value: 'Admin' },
                                            { label: 'User', value: 'User' },

                                        ]}
                                        onValueChange={(u_type) => {
                                            this.setState({ item_type: u_type })

                                        }}
                                        value={this.state.u_type}
                                    />

                                </View>

                                <Text style={styles.txt_h}>Email Id</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}
                                        keyboardType='email-address'
                                        autoCorrect={false}
                                        autoCapitalize={'none'}

                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={email_id => this.setState({ email_id })}
                                        value={this.state.email_id}
                                    />
                                </View>

                                <Text style={styles.txt_h}>Password</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}

                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        secureTextEntry
                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={password => this.setState({ password })}
                                        value={this.state.password}
                                    />
                                </View>


                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)

                                        }}
                                        onPress={() => {
                                            this.setState({
                                                addItem: false, item_type: "Goods",
                                                name: "",
                                                unit: '',
                                                rate: "",
                                                hsn_sac_code: "",
                                                gst: "",
                                                des: "",
                                            });
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}> Cancel </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            width: scale(100),
                                            height: scale(40),
                                            padding: scale(10),
                                            backgroundColor: '#3D8EE1',
                                            borderRadius: scale(8),
                                            margin: scale(5)
                                        }}
                                        onPress={() => {
                                            this._addUser_fun()
                                        }}>
                                        <Text style={{
                                            color: '#fff',
                                            fontSize: scale(15),
                                            textAlign: 'center'
                                        }}> Save </Text>
                                    </TouchableOpacity>

                                </View>


                            </View>



                        </View>
                    </ScrollView>
                </View>

            </Modal>
        )
    }

    renderFOB() {

        return (
            <TouchableOpacity activeOpacity={0.5}
                style={{
                    position: 'absolute',
                    width: scale(50),
                    height: scale(50),
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: 30,
                    bottom: 30,
                    backgroundColor: "#fff",
                    borderRadius: scale(25),
                    elevation: 20,
                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    shadowOffset: {
                        height: 1,
                        width: 0
                    }

                }}
                onPress={() => {
                    this.setState({ addItem: true, ed_id: "" })
                }}
            >

                <Image source={Images.add}

                    style={{
                        resizeMode: 'contain',
                        width: 25,
                        height: 25,
                    }} />

            </TouchableOpacity>
        );
    }


    renderHeader() {
        return (
            <View
                style={{
                    height: scale(50), backgroundColor: "#80d4ff",

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 9,
                    },
                    shadowOpacity: 0.48,
                    shadowRadius: 11.95,

                    elevation: 20,
                    borderRadius: scale(15),
                    margin: scale(7),
                    justifyContent: "center",
                    padding: scale(10)

                }}
            >



                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={'#ddd'}
                    onPress={() => this.props.navigation.toggleDrawer()}
                    style={{
                        width: scale(40), height: scale(40),



                        alignItems: "center",
                        justifyContent: 'center',
                        borderRadius: scale(20)
                    }}
                >

                    <Image source={Images.menu} style={{
                        width: scale(20), height: scale(20),


                    }} />

                </TouchableHighlight>

                <Text style={{
                    position: "absolute",
                    alignSelf: "center",
                    fontSize: scale(18),
                    color: "#fff",
                    fontWeight: 'bold'
                }}>User Details</Text>

            </View>
        )
    }


    render() {



        return (
            <View style={{
                justifyContent: "center", flex: 1,
                backgroundColor: "#fff"
            }}>

                <LogoSpinner loading={this.state.loading} />

                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    stickyHeaderIndices={[0]}

                    contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.show_list}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={(item, index) => this._renderListItem(item, index)}
                    bounces={false}
                    extraData={this.state}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    ListEmptyComponent={
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {this.state.loading == false ? (
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <View style={{
                                        backgroundColor: "#ddd",
                                        width: scale(80), height: scale(80),
                                        alignItems: "center",
                                        justifyContent: 'center',
                                        borderRadius: scale(80) / 2,
                                        borderWidth: 2,
                                        borderColor: '#AED581'
                                    }}>

                                        <Image source={Images.logo} style={{
                                            resizeMode: 'contain',
                                            width: scale(50),
                                            height: scale(50),
                                        }} />
                                    </View>

                                    <Text style={{
                                        fontSize: scale(15),
                                        width: scale(150),
                                        textAlign: 'center',
                                        marginTop: scale(5)
                                    }}>No Record Found</Text>
                                </View>
                            ) : null}
                        </View>
                    }


                />


                {this._addUserRender()}

                {this.renderFOB()}



            </View>
        );
    }
}





const styles = StyleSheet.create({



    txt: { fontSize: scale(12) },

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

    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(200),
        textAlign: 'left'
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


UserDetailsScreen.defaultProps = {
    user_id: '',
    user_type: ''
}


const mapStateToProps = (state) => {
    return {
        user_id: state.user.id,
        user_type: state.user.type,
        network: state.network,
    };
};


export default connect(
    mapStateToProps,
    null
)(UserDetailsScreen);