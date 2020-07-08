import React, { PureComponent } from "react";
import {
  View,TouchableHighlight,

  Text, Modal, ScrollView, Dimensions,ImageBackground,
  StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import { Config, Color, Images } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import { NavigationBar } from '@components';

import RNPickerSelect from 'react-native-picker-select';
import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';


class CustomerPaymentListScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      page: 0,
      show_list: [],
 
  

      ch_all: false,
      ch_receive_date: true,
      ch_customer_name: false,
    
      display_name: '',
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),

      customer_list: [],
      filter_type: 1
    }

  }

  componentDidMount() {
    const { network } = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {

    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true,
        refresh: false,
        load_more: false,
        onEndReachedCalledDuringMomentum: true,
        page: 0,
        show_list: [],
        filter: false,


        ch_all: false,
        ch_receive_date: true,
        ch_customer_name: false,

        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),

        customer_list: [],
        filter_type: 1 }, () => {



        this.hit_customer_paymentListApi(),
          this.hit_CompanyNameApi()

      })
    }
  })}

  filter_fun() {

    const { ch_all, ch_receive_date, ch_customer_name } = this.state
    if (ch_all) {
      return 0
    } else if (ch_receive_date) {
      return 1
    } else if (ch_customer_name) {
      return 2
    } else {
      return 0
    }
  }

  _checkbox_fun(val) {
    if (val==0) {
      this.setState({
        ch_all: true,
        ch_receive_date: false,
        ch_customer_name: false,
        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),


      })
    } else if (val == 1) {
      this.setState({
        ch_all: false,
        ch_receive_date: true,
        ch_customer_name: false,
        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }

    else if (val == 2) {
      this.setState({
        ch_all: false,
        ch_receive_date: false,
        ch_customer_name: true,
        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }
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
          this.hit_customer_paymentListApi();
        },
      );
    }

  }

  hit_customer_paymentListApi() {
    const { user_id, user_type } = this.props
    const { page, start_date, end_date, display_name } = this.state
    var filter_type = this.filter_fun()
    this.setState({ filter_type: filter_type })
    ArsolApi.CustomerPaymentList_api(user_id, user_type,
      filter_type,
      start_date,
      end_date,
      display_name,
      page
    )

      .then(responseJson => {
        console.log('CustomerPaymentList_api', responseJson);

        if (responseJson.ok) {
          this.setState({
            loading: false,
            refresh: false,
           

          });

          if (responseJson.data != null) {
            if (responseJson.data.hasOwnProperty('status')) {

              if (responseJson.data.status == 'success') {
                if (responseJson.data.hasOwnProperty('message')) {

                  Snackbar.show({
                    text: responseJson.data.message,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: Color.lgreen
                  });

                  if (responseJson.data.hasOwnProperty("data")) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        show_list: [...this.state.show_list, ...responseJson.data.data],
                        load_more: responseJson.data.load_more
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


  hit_CompanyNameApi() {
    const { network, user_id, user_type } = this.props
    if (network.isConnected) {
      ArsolApi.CompanyName_api(
        user_id,
        user_type,
      )

        .then(responseJson => {
          console.log('CompanyName_api', responseJson);

          if (responseJson.ok) {
            this.setState({
              loading: false,
            });

            if (responseJson.data != null) {
              if (responseJson.data.hasOwnProperty('status')) {

                if (responseJson.data.status == 'success') {

                  if (responseJson.data.hasOwnProperty('data')) {
                    if (responseJson.data.data.length > 0) {
                      this.setState({
                        customer_list: responseJson.data.data
                      })
                    }

                  }



                } else if (responseJson.data.status == 'failed') {

                  alert(responseJson.data.message)

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
            this.hit_customer_paymentListApi();
          },
        );
      }
    }
  };

  _renderListItem(rowData, index) {
    //console.log(rowData)
    return (

      <View style={{
        flexDirection: 'row',
        borderWidth: scale(0.5),
        borderColor: '#ccc'

      }}
        key={rowData.index}
      >
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.inv_date}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.in_no}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.rec_date}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.cust_name}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.total_amt}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.open_balance}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.amt_rec}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.tds}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.round_of}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.close_balance}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          
        }}
          numberOfLines={2}
        >{rowData.item.bank_name}</Text>
        <View
          style={{
            padding: scale(10),
            width: scale(100),
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: Color.btn,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              height: scale(30),
              width: scale(40),


            }}
            onPress={() => {
              this.props.navigation.navigate('CustomerPayOne', {
                EditId: rowData.item.in_id
              })

            }}
          >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Edit</Text>
          </TouchableOpacity>

        </View>




      </View>






    )
  }

  //footer
  renderFooter = () => {
    if (!this.state.load_more ) return (

      <View>
      {
          this.state.show_list.length > 0 ?
          
            <View style={{
              flexDirection: 'row',

              borderWidth: scale(0.5),
              borderColor: '#ccc',
              backgroundColor: '#fff'
            }}>
              <Text style={{
                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              ></Text>

              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1),
                textAlign:'right'
              }}
                numberOfLines={2}
              >Total:</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              ></Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              ></Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.total_amt), 0)}</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.open_balance), 0)}</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.amt_rec), 0)}</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.tds), 0)}</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.round_of), 0)}</Text>
              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              >{this.state.show_list.reduce((prev, next) =>
                prev + parseInt(next.close_balance), 0)}</Text>

              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),
                textAlign: 'center',
                textAlignVertical: 'center',
                borderColor: '#ddd',
                borderRightWidth: scale(1)
              }}
                numberOfLines={2}
              ></Text>

              <Text style={{

                padding: scale(10),
                width: scale(100),
                fontWeight: 'bold',
                fontSize: scale(12),

              }}
                numberOfLines={2}
              ></Text>


            </View>

          
          
          : <View style={{ marginBottom: scale(100), }} />
      }

      </View>
      

    )

    return (
      <View style={{
        marginBottom: scale(100),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
        <ActivityIndicator size="small" color="#ddd" />
      </View>
    );
  };

  renderHeader() {
    return (
      <View
        style={{
          backgroundColor: Color.bgColor,
          borderRadius: scale(5),
          justifyContent: "center",
          alignItems: "center",
          padding: scale(10),
          width: scale(220),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Received Payment</Text>

      </View>
    )
  }

  renderTitle() {
    return (
      <View style={{
        flexDirection: 'row',

        borderWidth: scale(0.5),
        borderColor: '#ccc',
        backgroundColor: '#fff'
      }}>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Invoice Date</Text>

        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Invoice Number</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Receive Date</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Customer Name</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Total Amount (INR)</Text>
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Opening Balance</Text>
      <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Amount Received</Text>
          <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >TDS</Text>
          <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Round Off</Text>
          <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Closing Balance</Text>

          <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Bank Name</Text>

        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),

        }}
          numberOfLines={2}
        ></Text>


      </View>
    )
  }



  render() {
    const { ch_customer_name, ch_receive_date, ch_all, display_name,
      customer_list,
      filter_type } = this.state;


    return (
     <View>
        <ImageBackground
          style={[styles.fixed, styles.containter]}
          source={Images.listbg}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() =>
            this.props.navigation.toggleDrawer()}
          style={{
            width: scale(35), height: scale(35),
            alignItems: "center",
            justifyContent: 'center',
            backgroundColor: Color.headerTintColor
          }}
        >
          <Image source={Images.menu}
            style={{
              width: scale(20),
              height: scale(20),
            }} />
        </TouchableHighlight>

        {this.renderHeader()}

        <LogoSpinner loading={this.state.loading} />



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
            marginHorizontal: scale(10),
            marginVertical: scale(20),
            height: '70%'
          }}

        >
          <View style={{
            borderWidth: 1,
            height: '100%',
            borderColor: '#ccc',
            borderRadius: scale(5),
            paddingBottom: scale(5)

          }}>
            <View
              style={{
                padding: scale(5),
                backgroundColor: '#f1f3f6'
              }}
            >

              <View style={{
                flexDirection: 'row',
                marginVertical: scale(5),
                alignItems: "center"

              }}>
                <Text style={{
                  fontSize: scale(12),
                  fontWeight: 'bold',
                  width: scale(50)
                }}
                  numberOfLines={2}
                >Search Option:</Text>

                <TouchableOpacity>
                  <Text
                    style={{
                      padding: scale(5),
                      borderColor: '#000',
                      borderWidth: scale(1),

                      textAlign: 'center',

                      fontSize: scale(10),
                      backgroundColor: ch_all ? Color.headerTintColor : '#ccc',

                      borderRadius: scale(5),
                      color: ch_all ? '#fff' : '#000',
                      marginLeft: scale(5)
                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(0) }}
                  >All</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text
                    style={{
                      padding: scale(5),
                      borderColor: '#000',
                      borderWidth: scale(1),

                      textAlign: 'center',

                      fontSize: scale(10),
                      backgroundColor: ch_receive_date ? Color.headerTintColor : '#ccc',
                      color: ch_receive_date ? '#fff' : '#000',
                      maxWidth: scale(100),
                      borderRadius: scale(5),
                      marginLeft: scale(5)

                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(1) }}

                  >Receive Date</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text
                    style={{
                      padding: scale(5),
                      borderColor: '#000',
                      borderWidth: scale(1),

                      textAlign: 'center',

                      fontSize: scale(10),
                      backgroundColor: ch_customer_name ? Color.headerTintColor : '#ccc',
                      color: ch_customer_name ? '#fff' : '#000',
                      width: scale(100),
                      borderRadius: scale(5),
                      marginLeft: scale(5)

                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(2) }}
                  >Customer Name</Text>
                </TouchableOpacity>


              </View>

             

              <View style={{
                flexDirection: 'row',
                marginTop: scale(5),

                alignItems: "center"
              }}>

                {
                  ch_receive_date ?
                    <View style={{ flexDirection: "row", }}>
                      <DatePicker
                        style={{ width: scale(100), }}
                        date={this.state.start_date}
                        placeholder="Select Start Date"
                        mode={'date'}
                        format="DD/MM/YYYY"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        minuteInterval={10}
                        onDateChange={(date) => { this.setState({ start_date: date }) }}

                      />
                      <DatePicker
                        style={{ width: scale(100), marginLeft: scale(5) }}
                        date={this.state.end_date}
                        placeholder="Select End Date"
                        mode={'date'}
                        format="DD/MM/YYYY"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        showIcon={false}
                        minuteInterval={10}
                        onDateChange={(date) => { this.setState({ end_date: date }) }}

                      />
                    </View>
                    : null
                }

                

                {ch_customer_name ?
                  <View style={styles.userInput}>

                    <RNPickerSelect
                      placeholder={{
                        label: "Customer Name",
                        value: "",
                        color: 'black',
                        fontSize: scale(12),
                        fontWeight: 'bold',
                      }}
                      style={{
                        inputIOS: styles.inputIOS,
                        inputAndroid: styles.inputAndroid,
                      }}
                      items={customer_list}
                      onValueChange={(display_name) => this.setState({ display_name })}
                      value={this.state.display_name}
                    />
                  </View> : null
                }






                <TouchableOpacity
                  onPress={() => {
                    this.onRefresh()
                  }}

                >
                  <Text style={{
                    textAlign: 'center',
                    fontSize: scale(10),
                    padding: scale(5),
                    maxWidth: scale(100),
                    backgroundColor: '#0095DF',
                    borderRadius: scale(5),
                    color: '#fff',
                    marginLeft: scale(10),
                    height: scale(40),
                    textAlignVertical: "center",
                    minWidth: scale(60)
                  }}
                    numberOfLines={1}
                  >Search</Text>
                </TouchableOpacity>
              </View>


              <Text
                style={{
                  fontSize: scale(12),
                  width: scale(300),
                  marginVertical: scale(5)
                }}
                numberOfLines={1}
              >Report For:
             {filter_type == 0 ? "All Records" :
                  filter_type == 1 ? "Date between " + this.state.start_date + " and " + this.state.end_date :
                    filter_type == 2 ? "Customer name " + display_name :
                        ""
                }
              </Text>







            </View>





            <ScrollView horizontal={true}>
              <FlatList

                ListHeaderComponent={this.renderTitle.bind(this)}
                stickyHeaderIndices={[0]}
                contentContainerStyle={{
                  paddingBottom: scale(5),
                  flexGrow: 1,
                }}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.show_list}

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
                    borderWidth: scale(0.5),
                    borderColor: '#ccc'

                  }}>
                    {this.state.loading == false ? (
                      <Text style={{
                        padding: scale(10),
                        fontSize: scale(12),
                        textAlignVertical: 'center',
                        color: '#ccc'


                      }}>No Data Found..!!</Text>
                    ) : null}
                  </View>
                }
                //pagination

                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.01}
                onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
                onEndReached={this.handleLoadMore.bind(this)}
                onScroll={this._onScroll}
              />

            </ScrollView>









          </View>





        </View>






</ImageBackground>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height //for full screen
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  txt: { fontSize: scale(12), width: scale(300), },


  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    borderWidth: scale(1),
    width: scale(150),
    justifyContent: "center",
    borderRadius: scale(5),
    borderColor: "#ddd",
    marginLeft: scale(5)

  },


  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  inputIOS: {
    fontSize: scale(12),
    paddingVertical: scale(12),
    paddingHorizontal: scale(10),
    color: 'black',
    paddingRight: scale(40),
  },
  inputAndroid: {
    fontSize: scale(12),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    color: 'black',
    paddingRight: scale(40),
  },



});



CustomerPaymentListScreen.defaultProps = {
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
)(CustomerPaymentListScreen);