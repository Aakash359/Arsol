import React, { PureComponent } from "react";
import {
  View, TouchableHighlight,

  Text, Modal, ScrollView, TextInput,
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
      filter: false,


      ch_all: true,
      ch_receive_date: false,
      ch_customer_name: false,

      display_name: '',
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),

      customer_list: []
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



        this.hit_customer_paymentListApi(),
          this.hit_CompanyNameApi()

      })
    }
  }

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
    if (val.label == "All") {
      this.setState({
        ch_all: true,
        ch_receive_date: false,
        ch_customer_name: false,
        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),


      })
    } else if (val.label == "Receive Date") {
      this.setState({
        ch_all: false,
        ch_receive_date: true,
        ch_customer_name: false,
        display_name: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }

    else if (val.label == "Customer Name") {
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
  _filterRender() {
    const { ch_customer_name, ch_receive_date, ch_all, customer_list } = this.state;
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.filter}
        onRequestClose={() => {
          this.setState({ filter: false });
        }}>
        <View style={{ flex: 1 }}>



          <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: "center",
              padding: scale(5)
            }}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >


            <View>


              <View style={{
                backgroundColor: 'white',
                borderRadius: scale(5),
                width: scale(250),

              }}>
                <View style={{
                  height: scale(40),
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <Text style={{ fontSize: scale(15), color: "#00B5FF", fontWeight: '500' }}
                    numberOfLines={1}
                  >Filter Search Result</Text>
                </View>

                <View style={{ height: scale(2), backgroundColor: "#00B5FF", }} />

                <View style={{ padding: scale(5) }}>
                  <Checkbox
                    label='All'
                    checked={ch_all}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  <Checkbox
                    label='Receive Date'
                    checked={ch_receive_date}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  {
                    ch_receive_date ?
                      <View>
                        <DatePicker
                          style={{ width: scale(200), marginTop: scale(10) }}
                          date={this.state.start_date}
                          placeholder="Select Start Date"
                          mode={'date'}
                          format="DD/MM/YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: scale(0),
                              top: scale(4),
                              marginLeft: scale(0)
                            },
                            dateInput: {
                              marginLeft: scale(36),

                            },
                            placeholderText: {
                              color: '#565656'
                            }
                          }}
                          minuteInterval={10}
                          onDateChange={(date) => { this.setState({ start_date: date }) }}

                        />
                        <DatePicker
                          style={{ width: scale(200), marginTop: scale(10) }}
                          date={this.state.end_date}
                          placeholder="Select End Date"
                          mode={'date'}
                          format="DD/MM/YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          showIcon={false}
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: scale(0),
                              top: scale(4),
                              marginLeft: scale(0)
                            },
                            dateInput: {
                              marginLeft: scale(36),

                            },
                            placeholderText: {
                              color: '#565656'
                            }
                          }}
                          minuteInterval={10}
                          onDateChange={(date) => { this.setState({ end_date: date }) }}

                        />
                      </View>
                      : null
                  }




                  <Checkbox
                    label='Customer Name'
                    checked={ch_customer_name}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
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
                </View>





                <TouchableOpacity
                  onPress={() => {
                    this.setState({ filter: false }, () => {
                      this.onRefresh()
                    })
                  }}
                >
                  <View style={{
                    backgroundColor: "#00B5FF", height: scale(40), alignItems: "center",
                    justifyContent: 'center',
                    borderRadius: scale(4),

                  }}>
                    <Text style={{ fontSize: scale(18), color: "#fff", fontWeight: 'bold' }}
                      numberOfLines={1}
                    >Apply</Text>
                  </View>
                </TouchableOpacity>








              </View>



            </View>
          </ScrollView>
        </View>

      </Modal>
    )
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
            refresh: false
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

        <Text style={styles.txt}
          numberOfLines={1}>
          Invoice Date:{rowData.item.inv_date}
        </Text>


        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() => {
            this.props.navigation.navigate('CustomerPayOne', {
              EditId: rowData.item.in_id
            })

          }}
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
          numberOfLines={1}>
          Invoice Number:{rowData.item.in_no}

        </Text>


        <Text style={styles.txt}
          numberOfLines={1}>
          Receive Date:{rowData.item.rec_date}

        </Text>

        <Text style={styles.txt}
          numberOfLines={1}>
          Customer Name:{rowData.item.cust_name}

        </Text>


        <Text style={styles.txt}
          numberOfLines={1}
        >Total Amount (INR):{rowData.item.total_amt}

        </Text>

        <Text style={styles.txt}
          numberOfLines={1}>
          Opening Balance:{rowData.item.open_balance}

        </Text>



        <Text style={styles.txt}
          numberOfLines={1}>
          Amount Received:{rowData.item.amt_rec}

        </Text>

        <Text style={styles.txt}
          numberOfLines={1}>

          TDS:{rowData.item.tds}
        </Text>



        <Text style={styles.txt}
          numberOfLines={1}>
          Round Off:{rowData.item.round_of}

        </Text>

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
            numberOfLines={1}>
            Closing Balance:{rowData.item.close_balance}

          </Text>



          <View style={{ marginLeft: scale(-20) }}>
            <Text style={styles.txt}
              numberOfLines={1}>
              Bank Name:{rowData.item.bank_name}
            </Text>
          </View>




        </View>

      </View>






    )
  }


  //footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
    return (
      <View style={{ marginBottom: scale(100), }}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };

  renderNext() {
    const { show_list } = this.state


    var footer_View = (
      <View style={{ backgroundColor: 'transparent' }}>
        <View
          style={{
            width: '94%',
            alignSelf: 'center',

            borderTopWidth: 0.8,
            borderLeftWidth: 0.8,
            borderRightWidth: 0.8,
            borderTopLeftRadius: scale(7),
            borderTopRightRadius: scale(7),
            borderColor: 'grey',
            padding: scale(3),


          }}>
          <Text style={{ fontSize: scale(12), color: '#000', fontWeight: '700' }}>
            Total :  </Text>

          <View style={{ marginLeft: scale(20) }}>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Total Amount:{show_list.reduce((prev, next) =>
                prev + parseInt(next.total_amt), 0)} </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Opening Balance:{show_list.reduce((prev, next) =>
                prev + parseInt(next.open_balance), 0)}
            </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Amount Received:{show_list.reduce((prev, next) =>
                prev + parseInt(next.amt_rec), 0)} </Text>

            <Text style={{ fontSize: scale(12), color: '#000' }}>
              TDS:{show_list.reduce((prev, next) =>
                prev + parseInt(next.tds), 0)}
            </Text>
            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Round Off:{show_list.reduce((prev, next) =>
                prev + parseInt(next.round_of), 0)}
            </Text>

            <Text style={{ fontSize: scale(12), color: '#000' }}>
              Closing Balance:{show_list.reduce((prev, next) =>
                prev + parseInt(next.close_balance), 0)}
            </Text>

          </View>








        </View>
      </View>
    );
    return footer_View;
  }

  //header
  //header
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

        <View style={{ justifyContent: 'center', alignContent: 'center' }}>
          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => this.props.navigation.goBack()}
            style={{
              width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.backwhite} style={{
              width: scale(30), height: scale(30),


            }} />

          </TouchableHighlight>

          <Text style={{
            position: "absolute",
            alignSelf: "center",
            fontSize: scale(18),
            color: "#fff",
            fontWeight: 'bold'
          }}>Customer Payment List</Text>

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => { this.setState({ filter: true }) }}
            style={{
              position: "absolute", marginLeft: scale(280), width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
              borderRadius: scale(20)
            }}
          >

            <Image source={Images.filterw} style={{
              width: scale(30), height: scale(30),


            }} />

          </TouchableHighlight>
        </View>

      </View>

    )
  }

  render() {
    const { show_list } = this.state


    return (
      <View style={{
        flex: 1,
        backgroundColor: "#fff"
      }}>

        <LogoSpinner loading={this.state.loading} />

        {this._filterRender()}
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={this.renderHeader.bind(this)}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: scale(5), flexGrow: 1 }}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.show_list}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={(item) => this._renderListItem(item)}
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

        {show_list.length > 0 ? this.renderNext() : null}

      </View>
    );
  }
}



const styles = StyleSheet.create({

  txt: { fontSize: scale(12), width: scale(150), },
  txth: { fontSize: scale(12), fontWeight: 'bold' },

  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(180),
    marginLeft: scale(30)
  },

  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12)
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