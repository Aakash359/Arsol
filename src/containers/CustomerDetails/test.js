import React, { PureComponent } from "react";

import {
    View,

    Text,
    StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';

class CustomerDetailsScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            refresh: false,
            load_more: false,
            onEndReachedCalledDuringMomentum: true,
            page: 0,
            show_list: []
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
            this.setState({ loading: true }, () => {
                this.hit_customerDetailApi()
            })
        }
    }

    hit_customerDetailApi() {
        const { user_id, user_type } = this.props
        const { page } = this.state
        ArsolApi.CustomerDetails_api(user_id, user_type, page)

            .then(responseJson => {
                console.log('CustomerDetails_api', responseJson);

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
                                                load_more: responseJson.data.load_more
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
                    load_more: false,
                    page: 0,
                    show_list: [],
                },
                () => {
                    this.hit_customerDetailApi();
                },
            );
        }

    }
    //scroll
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
                        this.hit_customerDetailApi();
                    },
                );
            }
        }
    };
    //footer
    renderFooter = () => {
        if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
        return (
            <View style={{ marginBottom: scale(100), }}>
                <ActivityIndicator size="large" color="#ddd" />
            </View>
        );
    };


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

    GetItem(item) {

        Alert.alert(item);



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

                <TouchableOpacity
                    key={index}
                    onPress={() => { this.props.navigation.navigate('Customer', { Cust_id: rowData.item.customer_id }) }}>
                    <Text style={{
                        fontSize: scale(14), fontWeight: 'bold', fontStyle: 'italic',
                        textTransform: 'capitalize'
                    }}
                        numberOfLines={1}
                    >{rowData.item.customer_name}</Text>
                </TouchableOpacity>


                <TouchableHighlight
                    activeOpacity={1}
                    underlayColor={'#ddd'}
                    onPress={() => { this.props.navigation.navigate("ContactOne", { Edit_Id: rowData.item.customer_id }) }}
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




                <Text style={styles.txt}
                    numberOfLines={1}
                >  Display Name:{rowData.item.display_name}</Text>

                <Text style={styles.txt}
                    numberOfLines={1}
                >  Company Name:{rowData.item.company_name}</Text>


                <View style={{
                    borderRadius: scale(3),
                    borderColor: '#73C6B6',
                    padding: scale(5),
                    flexDirection: "row",
                    justifyContent: 'space-between',
                    borderWidth: scale(1),
                    borderRadius: scale(10),
                    marginTop: scale(5)

                }}>


                    <Text style={styles.txt}
                        numberOfLines={1}
                    >Email Id: {rowData.item.email_id}</Text>



                </View>


            </View>


        )
    }


    renderFOB() {
        const { offset } = this.state;
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
                    this.props.navigation.navigate("ContactOne")
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
                }}>Customer Details</Text>

            </View>
        )
    }

    render() {



        return (
            <View style={{
                justifyContent: "center", flex: 1, backgroundColor: "#fff"
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
                    //pagination

                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReachedThreshold={0.01}
                    onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                    onEndReached={this.handleLoadMore.bind(this)}

                />

                {this.renderFOB()}

            </View>
        );
    }
}



const styles = StyleSheet.create({

    txt: { fontSize: scale(12), width: scale(270), },
    txth: { fontSize: scale(15), fontWeight: 'bold' }

});



CustomerDetailsScreen.defaultProps = {
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
)(CustomerDetailsScreen);