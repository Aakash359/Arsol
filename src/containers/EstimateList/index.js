import React, { PureComponent } from "react";

import {
  View, Switch,

  Text, Modal, ScrollView, TextInput,Dimensions,ImageBackground,Keyboard,
  StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator, TouchableHighlight
} from 'react-native';

import { connect } from "react-redux";
import { Config, Color, Images } from '@common';


import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import { NavigationBar } from '@components';


import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';



class EstimateListScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      page: 0,
      show_list: [],
      display_name: '',
      invoice_number: '',
      ch_all: false,
      ch_invoice: true,
      ch_invoice_no: false,
      ch_display_name: false,

      start_date: moment(new Date()).format('DD/MM/YYYY'),
      end_date: moment(new Date()).format('DD/MM/YYYY'),
      filter_type:1,
      focus:false

      

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
        display_name: '',
        invoice_number: '',
        ch_all: false,
        ch_invoice: true,
        ch_invoice_no: false,
        ch_display_name: false,

        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        filter_type: 1
      
      
      }, () => {



        this.hit_estimateListApi()

      })
    }

  })


  }


  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true,
            refresh: false,
            load_more: false,
            onEndReachedCalledDuringMomentum: true,
            page: 0,
            show_list: [],
            display_name: '',
            invoice_number: '',
            ch_all: false,
            ch_invoice: true,
            ch_invoice_no: false,
            ch_display_name: false,

            start_date: moment(new Date()).format('DD/MM/YYYY'),
            end_date: moment(new Date()).format('DD/MM/YYYY'),
            filter_type: 1


          }, () => {



            this.hit_estimateListApi()

          })
        }
      }
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
    if (val == 0) {
      this.setState({
        ch_all: true,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus: false,
      })
    } else if (val == 1) {
      this.setState({
        ch_all: false,
        ch_invoice: true,
        ch_invoice_no: false,
        ch_display_name: false,
        display_name: '',
        invoice_number: '',
        focus: false,

      })
    }
    else if (val == 2) {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: true,
        ch_display_name: false,
        display_name: '',

        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus: false,
      })
    }
    else if (val == 3) {
      this.setState({
        ch_all: false,
        ch_invoice: false,
        ch_invoice_no: false,
        ch_display_name: true,

        invoice_number: '',
        start_date: moment(new Date()).format('DD/MM/YYYY'),
        end_date: moment(new Date()).format('DD/MM/YYYY'),
        focus: false,
      })
    }
  }


  //refresh
  onRefresh() {
    Keyboard.dismiss()
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
    this.setState({ filter_type: filter_type })
    ArsolApi.EstimateDetails_api(user_id, user_type,
      filter_type,
      start_date,
      end_date,
      invoice_number,
      display_name,
      page
    )

      .then(responseJson => {
        console.log('EstimateDetails_api', responseJson);

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
                        load_more: responseJson.data.load_more,
                        
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
        >{rowData.item.es_no}</Text>
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
        >{rowData.item.es_type}</Text>
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
        >{rowData.item.es_dis_name}</Text>
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
        >{rowData.item.es_date}</Text>
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
        >{rowData.item.total_amount}</Text>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1),
          color: rowData.item.convert == "1" ?'green':'red'
        }}
          numberOfLines={2}
        >{rowData.item.convert == "1" ? "Converted" : "Not Converted"}</Text>
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
              this.props.navigation.navigate('EstimateOne', {
                EditId: rowData.item.es_id
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
    if (!this.state.load_more) return (
      <View style={{ marginBottom: scale(100), }} />
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
          width: scale(150),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Estimate List</Text>

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
        >Estimate Number</Text>

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
        >Estimate Type</Text>
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
        >Contact Display Name</Text>
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
        >Estimate Date</Text>
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
        >Total Amount</Text>
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
        >Converted to Invoice</Text>
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
    const { focus,ch_display_name, ch_invoice, ch_invoice_no, ch_all, invoice_number, display_name, filter_type} = this.state;

   
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
          style={{padding:scale(5),
          backgroundColor:'#f1f3f6'
         }}
          >
            
              <View style={{
                flexDirection: 'row',
                marginVertical:scale(5),
                alignItems:"center"
               
             }}>
                <Text style={{ fontSize: scale(12),
                fontWeight:'bold',
                width:scale(50)
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
                      backgroundColor: ch_all?Color.headerTintColor:'#ccc',
                     
                      borderRadius: scale(5),
                      color: ch_all ? '#fff' : '#000',
                      marginLeft:scale(5)
}}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(0)}}
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
                      backgroundColor: ch_invoice?Color.headerTintColor:'#ccc',
                      color: ch_invoice ? '#fff' : '#000',
                      maxWidth: scale(100),
                      borderRadius: scale(5),
                      marginLeft:scale(5)

                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(1) }}

                  >Estimate Date</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text
                    style={{
                      padding: scale(5),
                      borderColor: '#000',
                      borderWidth: scale(1),

                      textAlign: 'center',

                      fontSize: scale(10),
                      backgroundColor: ch_invoice_no ? Color.headerTintColor : '#ccc',
                      color: ch_invoice_no ? '#fff' : '#000',
                      maxWidth: scale(100),
                      borderRadius: scale(5),
                      marginLeft: scale(5)
                      
                    }}
                    numberOfLines={1}
                    onPress={() => { this._checkbox_fun(2) }}
                  >Estimate Number</Text>
                </TouchableOpacity>
               

              </View>

              <TouchableOpacity>
                <Text
                  style={{
                    padding: scale(5),
                    borderColor: '#000',
                    borderWidth: scale(1),

                    textAlign: 'center',

                    fontSize: scale(10),
                    backgroundColor: ch_display_name ? Color.headerTintColor : '#ccc',
                    color: ch_display_name ? '#fff' : '#000',
                    width:scale(150),
                    borderRadius:scale(5)

                  }}
                  numberOfLines={1}
                  onPress={() => { this._checkbox_fun(3) }}
                >Contact Display Name</Text>
              </TouchableOpacity>

              <View style={{flexDirection:'row',
              marginTop:scale(5),
          
              alignItems:"center"
              }}>

                {
                  ch_invoice ?
                    <View style={{flexDirection:"row",}}>
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
                        style={{ width: scale(100),marginLeft:scale(5) }}
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

                {
                  ch_invoice_no ?
                      <View style={[styles.userInput,
                      {
                        borderColor:
                          focus ?
                            Color.headerTintColor
                            :
                            '#000',
                      }
                      ]}>
                      <TextInput
                        placeholder='Number'
                        style={styles.input}
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        underlineColorAndroid="transparent"
                        onChangeText={invoice_number => this.setState({ invoice_number })}
                        value={invoice_number}
                          returnKeyLabel={'search'}
                          returnKeyType={'search'}
                          onSubmitEditing={() => {

                            this.onRefresh()

                          }}


                          onBlur={() => {
                            this.setState({ focus: false })
                          }}

                          onFocus={() => {
                            this.setState({ focus: true })
                          }}
                        
                      />
                    </View> : null
                }

                {ch_display_name ?
                    <View style={[styles.userInput,
                    {
                      borderColor:
                        focus ?
                          Color.headerTintColor
                          :
                          '#000',
                    }
                    ]}>
                    <TextInput
                      placeholder='Name'
                      style={styles.input}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      underlineColorAndroid="transparent"
                      onChangeText={display_name => this.setState({ display_name })}
                      value={display_name}
                        returnKeyLabel={'search'}
                        returnKeyType={'search'}
                        onSubmitEditing={() => {

                          this.onRefresh()

                        }}


                        onBlur={() => {
                          this.setState({ focus: false })
                        }}

                        onFocus={() => {
                          this.setState({ focus: true })
                        }}
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
                    marginLeft:scale(10),
                    height:scale(40),
                    textAlignVertical:"center",
                    minWidth:scale(60)
                  }}
                    numberOfLines={1}
                  >Search</Text>
                </TouchableOpacity>
              </View>


              <Text
              style={{fontSize:scale(12),
              width:scale(300),
              marginVertical:scale(5)
             }}
             numberOfLines={1}
              >Report For:
             {filter_type == 0 ? "All Records" :
                  filter_type == 1 ? "Date between " + this.state.start_date + " and " + this.state.end_date :
                    filter_type == 2 ? "Estimate number " + invoice_number :
                      filter_type == 3 ? "Customer name " + display_name :
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
    width: scale(100),
    justifyContent: "center",
    borderRadius: scale(5),
    borderColor: "#ddd",
    marginLeft:scale(5)

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
 


});



EstimateListScreen.defaultProps = {
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
)(EstimateListScreen);