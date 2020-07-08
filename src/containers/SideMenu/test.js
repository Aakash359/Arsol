import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet, Modal, ScrollView
} from 'react-native';
import { connect } from 'react-redux';

import { Images, Config, Color } from '@common';
import { scale } from 'react-native-size-matters';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';




class SideMenuScreen extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            create_vb: false,
            list_vb: false,
            reports: false,
            option_status: true
        };


    }

    create() {
        const { create_vb } = this.state

        if (create_vb) {
            this.setState({
                create_vb: false, list_vb: false,
                reports: false
            })
        } else {
            this.setState({
                create_vb: true, list_vb: false,
                reports: false
            })
        }
    }

    list() {
        const { list_vb } = this.state

        if (list_vb) {
            this.setState({
                create_vb: false, list_vb: false,
                reports: false
            })
        } else {
            this.setState({
                create_vb: false, list_vb: true,
                reports: false
            })
        }
    }

    reports_fun() {
        const { reports } = this.state

        if (reports) {
            this.setState({
                create_vb: false, list_vb: false,
                reports: false
            })
        } else {
            this.setState({
                create_vb: false, list_vb: false,
                reports: true
            })
        }
    }

    //option
    _OptionRender() {
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.option_status}
                onRequestClose={() => {
                    this.setState({ option_status: false });
                }}>
                <View style={{ flex: 1 }}>



                    <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: "center",
                            padding: scale(5)
                        }}
                    >


                        <View>


                            <View style={{
                                backgroundColor: '#fff',
                                width: '100%',
                                padding: scale(10),
                                borderRadius: scale(5),
                            }}>

                                <View style={{ borderRadius: scale(5), borderWidth: scale(1) }}>

                                    <TouchableOpacity
                                        style={styles.btnoption}
                                        onPress={() => {
                                            this.setState({ option_status: false }, () => {
                                                this.props.navigation.navigate('EditCompany')
                                            })
                                        }}
                                    >
                                        <Text style={styles.txtstyle}
                                            numberOfLines={2}
                                        >Edit Company Details </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.btnoption}
                                        onPress={() => {
                                            this.setState({ option_status: false }, () => {
                                                this.props.navigation.navigate('ChangePassword')
                                            })
                                        }}
                                    >
                                        <Text style={styles.txtstyle}
                                            numberOfLines={2}
                                        >Change Password </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.btnoption}
                                        onPress={() => {
                                            this.setState({ option_status: false }, () => {
                                                this.props.navigation.navigate('BankDetails')
                                            })
                                        }}

                                    >
                                        <Text style={styles.txtstyle}
                                            numberOfLines={2}
                                        >Bank Details </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.btnoption}
                                        onPress={() => {
                                            this.setState({ option_status: false }, () => {
                                                this.props.navigation.navigate('ManageSubscription')
                                            })
                                        }}
                                    >
                                        <Text style={styles.txtstyle}
                                            numberOfLines={2}
                                        >Manage Subscription </Text>
                                    </TouchableOpacity>

                                    <View style={{ height: scale(1), backgroundColor: "grey", marginVertical: scale(5) }} />

                                    <TouchableOpacity
                                        style={styles.btnoption}
                                        onPress={() => {
                                            this.setState({ option_status: false }, () => {
                                                this.props.navigation.dispatch(
                                                    CommonActions.reset({
                                                        index: 0,
                                                        routes: [
                                                            { name: 'Auth' },
                                                        ],
                                                    })
                                                )


                                            })
                                        }}
                                    >
                                        <Text style={styles.txtstyle}
                                            numberOfLines={2}
                                        >Logout </Text>
                                    </TouchableOpacity>
                                </View>




                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{
                                        width: scale(100),
                                        height: scale(40),
                                        padding: scale(10),
                                        backgroundColor: '#3D8EE1',
                                        borderRadius: scale(8),
                                        margin: scale(5),
                                        alignSelf: "center"

                                    }}
                                    onPress={() => {
                                        this.setState({ option_status: false });
                                    }}>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: scale(15),
                                        textAlign: 'center'
                                    }}> Cancel </Text>
                                </TouchableOpacity>


                            </View>



                        </View>
                    </ScrollView>
                </View>

            </Modal>
        )
    }



    render() {


        const { create_vb, list_vb, reports } = this.state;
        return (
            <ScrollView

            >
                <View style={{ flex: 1 }}>

                    {this._OptionRender()}


                    <View style={{
                        backgroundColor: "#80d4ff",
                        height: scale(130),
                        borderBottomLeftRadius: scale(200),
                        borderBottomRightRadius: scale(200),
                        width: '100%',
                        alignItems: "center",
                    }}>
                        <Text style={{
                            marginTop: scale(25), color: "#fff",
                            fontSize: scale(18), fontWeight: "bold"
                        }}>Rahul Singh</Text>

                        <View style={{
                            width: scale(90),
                            height: scale(120),
                            position: "absolute",
                            bottom: -60,
                            alignItems: "center"
                        }}>

                            <Image
                                source={{ uri: this.props.user_image }}
                                style={{
                                    width: scale(90),
                                    height: scale(90),

                                    borderRadius: scale(10)
                                }}

                            >
                            </Image>

                            <Text style={{
                                marginTop: scale(5), color: "#000",
                                fontSize: scale(12),

                            }}>TECH ABC</Text>


                        </View>



                    </View>

                    <TouchableOpacity style={{
                        marginTop: scale(60),
                        width: scale(110), height: scale(33),
                        borderRadius: scale(20),
                        borderWidth: scale(2),
                        borderColor: '#ddd',
                        flexDirection: "row",
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: "center"
                    }}
                        underlayColor={'grey'}
                        onPress={() => { this.setState({ option_status: true }) }}
                    >


                        <Image source={Images.options}
                            style={{ height: scale(18), width: scale(18) }}
                            resizeMode={'contain'}
                        />

                        <Text style={{
                            fontSize: scale(12),
                            color: "#6A6C6F",
                            width: scale(50),
                            textAlign: "center"
                        }}
                            numberOfLines={1}
                        >Profile</Text>


                    </TouchableOpacity>



                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff", borderColor: "#EAEAEA",
                            borderTopWidth: 1,
                            marginTop: scale(30),
                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            padding: scale(10)


                        }}

                        onPress={() => { this.props.navigation.navigate('Dashboard') }}
                    >
                        <Image style={{ height: scale(25), width: scale(25) }}
                            source={Images.meter}
                        />

                        <Text style={styles.txt}
                            numberOfLines={1}
                        >
                            DASHBOARD</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",
                            borderTopWidth: 1,

                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            padding: scale(10)

                        }}

                        onPress={() => { this.props.navigation.navigate('ItemDetails') }}
                    >
                        <Image style={{ height: scale(25), width: scale(25) }}
                            source={Images.transport}
                        />

                        <Text style={styles.txt}
                            numberOfLines={1}
                        >
                            ITEM DETAILS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            padding: scale(10)
                        }}
                        onPress={() => { this.props.navigation.navigate('CustomerDetails') }}

                    >

                        <Image style={{ height: scale(25), width: scale(25) }}
                            source={Images.care}
                        />
                        <Text style={styles.txt}
                            numberOfLines={1}
                        >
                            CUSTOMER DETAILS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { this.create() }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",
                            borderBottomWidth: 1,
                            alignItems: "center",
                            padding: scale(10)
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Image style={{ height: scale(25), width: scale(25) }}
                                    source={Images.create}
                                />

                                <Text style={styles.txt}
                                    numberOfLines={1}
                                >
                                    CREATE</Text>
                            </View>


                            <Image source={
                                create_vb ? Images.downarrow :
                                    Images.next
                            }
                                style={{ height: scale(15), width: scale(20), marginEnd: scale(10) }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </TouchableOpacity>
                    {
                        create_vb ?
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderBottomWidth: 1,


                                    }}
                                    onPress={() => { this.props.navigation.navigate('EstimateOne') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Estimate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('InvoiceOne') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Invoice</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('CreditNoteOne') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Credit Note</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('CustomerPayOne') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Customer Payment</Text>
                                </TouchableOpacity>

                            </View> : null

                    }



                    <TouchableOpacity
                        onPress={() => { this.list() }}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",
                            borderBottomWidth: 1,
                            alignItems: "center",
                            padding: scale(10)
                        }}>

                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Image style={{ height: scale(25), width: scale(25) }}
                                    source={Images.filter}
                                />
                                <Text style={styles.txt}
                                    numberOfLines={1}
                                >
                                    LIST</Text>
                            </View>
                            <Image source={list_vb ? Images.downarrow : Images.next}
                                style={{ height: scale(15), width: scale(20), marginEnd: scale(10) }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </TouchableOpacity>

                    {
                        list_vb ?
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('EstimateList') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Estimate List</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",

                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('InvoiceList') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Invoice List</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",

                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('CreditNoteList') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Credit Note List</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",

                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('CustomerPaymentList') }}

                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Customer Payment List</Text>
                                </TouchableOpacity>

                            </View> : null

                    }

                    <TouchableOpacity
                        onPress={() => { this.reports_fun() }}
                    >

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: "#fff",
                            alignItems: "center",
                            padding: scale(10)
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                <Image style={{ height: scale(25), width: scale(25) }}
                                    source={Images.line}
                                />
                                <Text style={styles.txt}
                                    numberOfLines={1}
                                >
                                    REPORTS</Text>
                            </View>
                            <Image source={reports ? Images.downarrow : Images.next}
                                style={{ height: scale(15), width: scale(20), marginEnd: scale(10) }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </TouchableOpacity>

                    {
                        reports ?
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('InvoiceReport') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Invoice Report</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",

                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('ArReport') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        AR Report</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: "#fff",
                                        borderColor: "#EAEAEA",

                                        borderBottomWidth: 1
                                    }}
                                    onPress={() => { this.props.navigation.navigate('GstReport') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        GST Report</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: "#fff" }}
                                    onPress={() => { this.props.navigation.navigate('CustomerLedger') }}
                                >
                                    <Text style={styles.sub_txt}
                                        numberOfLines={1}
                                    >
                                        Customer Ledger</Text>
                                </TouchableOpacity>

                            </View> : null

                    }


                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            padding: scale(10)
                        }}

                        onPress={() => { this.props.navigation.navigate('UserDetails') }}

                    >
                        <Image style={{ height: scale(25), width: scale(25) }}
                            source={Images.user}
                        />

                        <Text style={styles.txt}
                            numberOfLines={1}
                        >
                            USERS DETAILS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: "#fff",
                            borderColor: "#EAEAEA",

                            borderBottomWidth: 1,
                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            padding: scale(10)

                        }}


                        onPress={() => { this.props.navigation.navigate('UserRoles') }}
                    >
                        <Image style={{ height: scale(25), width: scale(25) }}
                            source={Images.role}
                        />


                        <Text style={styles.txt}
                            numberOfLines={1}
                        >
                            USERS ROLES</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    txt: {
        fontSize: scale(12),
        fontWeight: 'bold',
        color: "#6A6C6F",
        marginLeft: scale(10)
    },

    sub_txt: {
        height: scale(30),
        fontSize: scale(12),

        color: "grey",
        textAlignVertical: "center",
        marginLeft: scale(30)
    },

    btnoption: { backgroundColor: "#ddd", padding: scale(5), borderRadius: scale(5), margin: scale(5) },

    txtstyle: { fontSize: scale(15), width: scale(200) }

})



const mapStateToProps = (state) => {
    return {

        user_id: state.user.id,
        user_type: state.user.type,
        user_name: state.user.Name,
        user_image: state.user.image,
        network: state.network

    };
};


export default connect(mapStateToProps, undefined, null)(SideMenuScreen);
