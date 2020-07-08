import React, { PureComponent } from "react";

import {
  View,

  Text, Modal, ScrollView, TextInput,
  StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Config, Color, Images } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import { NavigationBar } from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
class InvoiceListScreen extends PureComponent {


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
      display_name: '',
      invoice_number: '',
      ch_all: true,
      ch_invoice: false,
      ch_invoice_no: false,
      ch_display_name: false,
      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),
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



        this.hit_estimateListApi()

      })
    }
  }

  filter_fun() {

    const { ch_all, ch_invoice, ch_invoice_no, ch_display_name } = this.state
    if (ch_all) {
      return 0
    } else if (ch_invoice) {
      return 1
    } else if (ch_invoice_no) {
      return 2
    } else if (ch_display_name) {
      return 3
    } else {
      return 0
    }
  }

  _checkbox_fun(val) {
    if (val.label == "All") {
      this.setState({
        ch_all: true,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    } else if (val.label == "Invoice Date") {
      this.setState({
        ch_all: false,
        ch_invoice: true,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',

      })
    }
    else if (val.label == "Invoice Number") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: true,
        ch_display_name: false,
        display_name: '',

        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }
    else if (val.label == "Contact Display Name") {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: true,

        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
      })
    }
  }

  _filterRender() {
    const { ch_display_name, ch_invoice, ch_invoice_no, ch_all } = this.state;
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
                    label='Invoice Date'
                    checked={ch_invoice}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  {
                    ch_invoice ?
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
                    label='Invoice Number'
                    checked={ch_invoice_no}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}
                  />
                  {
                    ch_invoice_no ?
                      <View style={styles.userInput}>
                        <TextInput
                          placeholder='Number'
                          style={styles.input}
                          autoCorrect={false}
                          autoCapitalize={'none'}
                          underlineColorAndroid="transparent"
                          onChangeText={invoice_number => this.setState({ invoice_number })}
                          value={this.state.invoice_number}
                        />
                      </View> : null
                  }

                  <Checkbox
                    label='Contact Display Name'
                    checked={ch_display_name}
                    onChange={(checked) => this._checkbox_fun(checked)}
                    labelStyle={{ fontSize: scale(15), }}
                    checkboxStyle={{ width: scale(30), height: scale(30) }}

                  />
                  {ch_display_name ?
                    <View style={styles.userInput}>
                      <TextInput
                        placeholder='Name'
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        underlineColorAndroid="transparent"
                        onChangeText={display_name => this.setState({ display_name })}
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
          this.hit_estimateListApi();
        },
      );
    }

  }

  hit_estimateListApi() {
    const { user_id, user_type } = this.props
    const { page, start_date, end_date, invoice_number, display_name } = this.state
    var filter_type = this.filter_fun()
    ArsolApi.InvoiceDetails_api(user_id, user_type,
      filter_type,
      start_date,
      end_date,
      invoice_number,
      display_name,
      page
    )

      .then(responseJson => {
        console.log('InvoiceDetails_api', responseJson);

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
            this.hit_estimateListApi();
          },
        );
      }
    }
  };




  _renderListItem(rowData) {
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
        >{rowData.item.in_no}</Text>

        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() => { this.props.navigation.navigate('InvoiceOne', {
            EditId: rowData.item.in_id
          }) }}
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
        >  Invoice Type: {rowData.item.in_type}</Text>
        <Text style={styles.txt}
          numberOfLines={1}
        >  Contact Display Name: {rowData.item.in_dis_name}</Text>
        <Text style={styles.txt}
          numberOfLines={1}
        >  Invoice Date: {rowData.item.in_date}</Text>
         <Text style={styles.txt}
          numberOfLines={1}
        >  Total Amount: {rowData.item.total_amount}</Text>


        {/* <View style={{
          borderRadius: scale(3),
          borderColor: '#73C6B6',
          padding: scale(5),
          borderWidth: scale(1),
          borderRadius: scale(10),
          marginTop: scale(5),
         
        }}>


          <Text style={styles.txt}
            numberOfLines={1}
          >Converted To Invoice: {rowData.item.convert == "1" ? "Converted" : "Not Converted"}</Text>

        </View> */}


      </View>






    )
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

  //footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
    return (
      <View style={{ marginBottom: scale(100), }}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };



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

      <View style={{justifyContent:'center', alignContent:'center'}}>
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
        }}>Invoice List</Text>

        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() => {  this.setState({ filter: true }) }}
          style = {{position: "absolute", marginLeft: scale(280),  width: scale(40), height: scale(40),
          alignItems: "center",
          justifyContent: 'center',
          borderRadius: scale(20)}}
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



    return (
      <View style={{
        justifyContent: "center", flex: 1,
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

      </View>
    );
  }
}


const styles = StyleSheet.create({

  txt: { fontSize: scale(12), width: scale(300), },
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




});




InvoiceListScreen.defaultProps = {
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
)(InvoiceListScreen);