import React, { PureComponent } from "react";

import {
    View, TouchableHighlight, TextInput, Switch,

    Text,
    StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, Modal
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

import Checkbox from 'react-native-modest-checkbox'
import { ScrollView } from "react-native-gesture-handler";
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';



class UserRolesScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            switch_status: false,
            refresh: false,
            show_list: [],

            edit_id: "",
            roles_data: [],
            search_text: '',
            btn_confirm: 'Confirm '

        }
        this.array_roles = []



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
            this.setState({ loading: true }, () => {
                this.hit_userRoleApi()
            })
        }
    }

    hit_userRoleApi() {
        const { user_id, user_type } = this.props

        ArsolApi.UserRole_api(user_id, user_type)

            .then(responseJson => {
                console.log('UserRole_api', responseJson);

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
                    roles_data: [],
                    edit_id: "",
                },
                () => {
                    this.hit_userRoleApi();
                    this.array_roles = []
                },
            );
        }

    }


    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: scale(5),
                    width: "100%",

                }}
            />
        );
    }

    GetItem(i) {
        const { show_list, } = this.state;

        this.setState({
            switch_status: true,
            edit_id: show_list[i].user_id,
            roles_data: show_list[i].user_roles
        })
        this.array_roles = show_list[i].user_roles
    }

    _renderListItem(rowData) {

        return (
            <View
                style={{
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
                    marginVertical: scale(10),


                }}
                key={rowData.index}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>



                    <Text style={styles.txt}
                        numberOfLines={3}
                    > {rowData.item.user_email}</Text>


                    <TouchableOpacity
                        style={{
                            backgroundColor: this.props.user_id == rowData.item.user_id ? "#7B9799" : '#335E61',
                            width: scale(50),
                            height: scale(30),
                            justifyContent: "center", alignItems: "center",
                            borderRadius: scale(5),
                            margin: scale(5)
                        }}
                        onPress={() => { this.GetItem(rowData.index) }}
                        disabled={this.props.user_id == rowData.item.user_id ? true : false}
                    >

                        <Text style={{ fontSize: scale(12), color: '#fff' }}>Update</Text>

                    </TouchableOpacity>

                </View>





            </View>
        )
    }





    hit_update_user_roleApi() {
        const {
            edit_id,
            roles_data
        } = this.state


        const { user_id, user_type, network } = this.props
        if (!network.isConnected) {
            Snackbar.show({
                text: msg.noInternet,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: "red"
            });
        } else {
            this.setState({ loading: true, switch_status: false }, () => {

                ArsolApi.UpdateRole_api(
                    user_id,
                    user_type,
                    edit_id,
                    roles_data
                )

                    .then(responseJson => {
                        console.log('UpdateRole_api', responseJson);

                        if (responseJson.ok) {
                            this.setState({
                                loading: false,

                            });

                            if (responseJson.data != null) {
                                if (responseJson.data.hasOwnProperty('status')) {

                                    if (responseJson.data.status == 'success') {
                                        if (responseJson.data.hasOwnProperty('message')) {
                                            alert(responseJson.data.message)
                                            this.onRefresh()
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
            })
        }


    }


    searchData = (text) => {
        // const {roles_data}=this.state

        const newData = this.array_roles.filter(item => {
            const itemData = item.label.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });


        this.setState({
            roles_data: newData,
            search_text: text
        })



    }




    changeSwitch = (val, index) => {
        let items = this.state.roles_data
        items[index].value = val
        this.setState({
            roles_data: items,
            btn_confirm: this.state.btn_confirm == "Confirm" ? "Confirm " : "Confirm"
        })
    }

    _renderRoles(rowData) {
        return (<View style={{
            flexDirection: "row",
            justifyContent: "space-between",


            padding: scale(10),
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,

            elevation: 10,
            borderRadius: scale(15),
            backgroundColor: "#fff",
            marginHorizontal: scale(10),
            marginVertical: scale(5),



        }}
            key={rowData.index}
        >
            <Text style={{
                fontSize: scale(14),
                textAlignVertical: "center"
            }}
            >{rowData.item.label}</Text>

            <Switch
                onValueChange={(value) => this.changeSwitch(value, rowData.index)}
                value={rowData.item.value}

            />

        </View>)

    }


    //switch
    _renderPermission() {
        const { roles_data, btn_confirm } = this.state

        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.switch_status}
                onRequestClose={() => {
                    this.setState({
                        switch_status: false,
                        edit_id: "",
                        roles_data: []
                    });
                    this.array_roles = []
                }}>
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: "center",
                    alignItems: "center"
                }}>



                    <View style={{
                        width: '90%',
                        height: "90%",
                        backgroundColor: '#fff',
                        borderRadius: scale(5)
                    }}>
                        <View style={{
                            backgroundColor: "#ddd", padding: scale(5),
                        }}>
                            <TextInput
                                style={{
                                    textAlign: 'center',
                                    height: scale(40),
                                    borderColor: '#ddd',

                                    backgroundColor: "#FFFF",
                                    margin: scale(5),
                                    borderRadius: scale(20),
                                    borderWidth: scale(1),
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 9,
                                    },
                                    shadowOpacity: 0.48,
                                    shadowRadius: 11.95,
                                    elevation: 20,
                                }}
                                onChangeText={(text) => this.searchData(text)}
                                value={this.state.search_text}
                                underlineColorAndroid='transparent'
                                placeholder="Search Roles" />
                        </View>




                        <FlatList
                            style={{ flex: 1 }}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: scale(100) }}
                            bounces={false}
                            data={roles_data}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                            renderItem={(item, index) => this._renderRoles(item)}
                            extraData={this.state}
                            style={{ margin: scale(10), paddingBottom: scale(10) }} />



                        <View style={{
                            flexDirection: 'row', justifyContent: "space-between",
                            position: 'absolute',
                            bottom: 0,
                            width: "100%"
                        }}>


                            <TouchableOpacity

                                style={{
                                    width: '50%',
                                    backgroundColor: "#ddd",
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    padding: scale(10),


                                }}
                                onPress={() => {
                                    this.setState({
                                        edit_id: '',
                                        roles_data: [],
                                        switch_status: false
                                    })
                                    this.array_roles = []
                                }}
                            >
                                <Text style={{
                                    fontSize: scale(15),
                                    fontWeight: 'bold',

                                }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity

                                style={{
                                    width: '50%',
                                    backgroundColor: "#ddd",
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    padding: scale(10),


                                }}
                                onPress={() => this.hit_update_user_roleApi()}
                            >
                                <Text style={{
                                    fontSize: scale(15),
                                    fontWeight: 'bold',

                                }}>{btn_confirm.trim()}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </Modal>
        )
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
                }}>User Roles</Text>

            </View>
        )
    }

    render() {

        const { show_list, roles_data, loading } = this.state;


        return (
            <View style={{
                 flex: 1,
                backgroundColor: "#fff"
            }}>
                <LogoSpinner loading={loading} />
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    stickyHeaderIndices={[0]}

                    contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
                    keyExtractor={(item, index) => index.toString()}
                    data={show_list}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={(item, index) => this._renderListItem(item)}
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

                {roles_data.length > 0 ? this._renderPermission() : null}

            </View>
        );
    }
}



const styles = StyleSheet.create({

    txt: { fontSize: scale(12), width: '80%', textAlignVertical: "center" },


});



UserRolesScreen.defaultProps = {
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
)(UserRolesScreen);

