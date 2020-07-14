import React, { PureComponent } from "react";

import {
  View, Keyboard, TouchableHighlight, Dimensions, ImageBackground,

  Text, Modal, ScrollView, TextInput,
  StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl, Image, ActivityIndicator
} from 'react-native';

import { connect } from "react-redux";
import { Images, Config, Color } from '@common';

import { NavigationBar } from '@components';
import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;

import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

class ItemDetailsScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      refresh: false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      addItem: false,
      page: 0,
      show_list: [],

      item_type: "Goods",
      name: "",
      unit: '',
      rate: "",
      hsn_sac_code: "",
      gst: "",
      des: "",
      ed_id: '',

      unit_list: [],
      gst_list: [],


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
      this.setState({
        loading: true, refresh: false,
        load_more: false,
        onEndReachedCalledDuringMomentum: true,
        addItem: false,
        page: 0,
        show_list: [],

        item_type: "Goods",
        name: "",
        unit: '',
        rate: "",
        hsn_sac_code: "",
        gst: "",
        des: "",
        ed_id: '',

        unit_list: [],
        gst_list: [],}, () => {
        this.hit_itemDetailApi()
        this.hit_unit_listApi()
        this.hit_gst_listApi()
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true, refresh: false,
            load_more: false,
            onEndReachedCalledDuringMomentum: true,
            addItem: false,
            page: 0,
            show_list: [],

            item_type: "Goods",
            name: "",
            unit: '',
            rate: "",
            hsn_sac_code: "",
            gst: "",
            des: "",
            ed_id: '',

            unit_list: [],
            gst_list: [],
          }, () => {
            this.hit_itemDetailApi()
            this.hit_unit_listApi()
            this.hit_gst_listApi()
          })
        }
      }
    }
  }

  //add
  _addItem_fun() {
    const { item_type,
      name,
      unit,
      rate,
      hsn_sac_code,
      gst,
      des,
      ed_id

    } = this.state

    const { user_id, user_type, network } = this.props
    Keyboard.dismiss()
    if (name == "") {
      alert("Enter Name")
    } else if (unit == "") {
      alert("Select Unit")
    } else if (rate == "") {
      alert("Enter Rate")
    } else if (hsn_sac_code == "") {

      if (item_type == "Goods") {
        alert("Enter Hsn Code")
      } else {
        alert("Enter Sac Code")
      }

    } else if (gst == "") {
      alert("Select Gst")
    } else if (des == "") {
      alert("Enter Description")
    } else if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {
      this.setState({ loading: true, addItem: false }, () => {
        this.hit_addItemApi(user_id, user_type, item_type,
          name.replace(/  +/g, ' '),
          unit,
          rate,
          hsn_sac_code.replace(/  +/g, ' '),
          gst,
          des.replace(/  +/g, ' '),
          ed_id
        )

      })
    }

  }

  hit_addItemApi(user_id, user_type, item_type,
    name,
    unit,
    rate,
    hsn_sac_code,
    gst,
    des, ed_id) {
    ArsolApi.AddItem_post_api(user_id, user_type, item_type,
      name,
      unit,
      rate,
      hsn_sac_code,
      gst,
      des, ed_id)

      .then(responseJson => {
        console.log('AddItem_post_api', responseJson);

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
                        item_type: "Goods",
                        name: "",
                        unit: '',
                        rate: "",
                        hsn_sac_code: "",
                        gst: "",
                        des: "",
                        ed_id:''
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

  hit_gst_listApi() {
    const { user_id, user_type } = this.props
    const { page } = this.state
    ArsolApi.GstList_api(user_id, user_type, page)

      .then(responseJson => {
        console.log('GstList_api', responseJson);

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
                      this.setState({
                        gst_list: responseJson.data.data,
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

  hit_unit_listApi() {
    const { user_id, user_type } = this.props
    const { page } = this.state
    ArsolApi.UnitList_api(user_id, user_type, page)

      .then(responseJson => {
        console.log('UnitList_api', responseJson);

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
                      this.setState({
                        unit_list: responseJson.data.data,
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

  hit_itemDetailApi() {
    const { user_id, user_type } = this.props
    const { page } = this.state
    ArsolApi.ItemDetails_api(user_id, user_type, page)

      .then(responseJson => {
        console.log('ItemDetails_api', responseJson);

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
          this.hit_itemDetailApi();
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
            this.hit_itemDetailApi();
          },
        );
      }
    }
  };
  //footer
  renderFooter = () => {
    if (!this.state.load_more) return (
      <View style={{ marginBottom: scale(100), }}/>
    )
    
    return (
      <View style={{
        marginBottom: scale(100),
        justifyContent: 'flex-start',
        alignItems: 'flex-start',}}>
        <ActivityIndicator size="small" color="#ddd" />
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




  GetItem(item, i) {
    const { show_list } = this.state

    this.setState({
      item_type: show_list[i].item_type,
      name: show_list[i].item_name,
      unit: show_list[i].unit_id,
      rate: show_list[i].item_rate,
      hsn_sac_code: show_list[i].hsn_sac_code,
      gst: show_list[i].gst_id,
      des: show_list[i].item_des,
      addItem: true,
      ed_id: item
    }) 





  }

  
  _addItemRender() {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.addItem}
        onRequestClose={() => {
          this.setState({ addItem: false });
        }}>




        <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            alignItems: "center",
            padding: scale(5)
          }}
          keyboardShouldPersistTaps="handled"
        >


          <View style={{
            backgroundColor: "#fff",
            margin: scale(15),
            width: "95%",
            borderRadius: scale(5),
            padding: scale(20)
          }}>

            <Text style={{
              fontSize: scale(18),
              fontWeight: 'bold',
              marginBottom: scale(10)
            }}>{this.state.ed_id == "" ? "Add New Item" : "Update Item"}</Text>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
            }}
            >

              <Text style={styles.txt_h}>Item Type</Text>
              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{}}
                  items={[
                    { label: 'Goods', value: 'Goods' },
                    { label: 'Service', value: 'Service' },

                  ]}
                  onValueChange={(value) => {
                    this.setState({ item_type: value })
                    console.log(value)
                  }}
                  value={this.state.item_type}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Name</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  underlineColorAndroid="transparent"
                  onChangeText={name => this.setState({ name })}
                  value={this.state.name}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Unit</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Unit",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',
                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.unit_list}
                  onValueChange={(unit) => {
                    this.setState({ unit })
                    console.log(unit)
                  }}
                  value={this.state.unit}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Rate (Rs.)</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}

                  autoCorrect={false}
                  autoCapitalize={'none'}
                  keyboardType={'number-pad'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={rate => this.setState({ rate })}
                  value={this.state.rate}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>{this.state.item_type == "Goods" ? "HSN Code" : "SAC Code"}</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <TextInput
                  style={styles.input}

                  autoCorrect={false}
                  autoCapitalize={'none'}

                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={hsn_sac_code => this.setState({ hsn_sac_code })}
                  value={this.state.hsn_sac_code}
                />

              </View>


            </View>


            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>GST (%)</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInput}>

                <RNPickerSelect
                  placeholder={{
                    label: "Select Gst",
                    value: "",
                    color: 'black',
                    fontSize: scale(12),
                    fontWeight: 'bold',

                  }}
                  style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                  items={this.state.gst_list}
                  onValueChange={(value) => { this.setState({ gst: value }) }}
                  value={this.state.gst}
                />

              </View>


            </View>

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between", alignItems: "center",
              marginTop: scale(10)
            }}
            >

              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.txt_h}>Description</Text>
                <Text style={{
                  color: 'red', fontSize: scale(15),
                  textAlignVertical: "center"
                }}> *</Text>
              </View>


              <View style={styles.userInputTC}>

                <TextInput
                  style={styles.inputTC}
                  placeholder={'(Maximum 150 characters)'}

                  autoCorrect={false}
                  autoCapitalize={'none'}

                  numberOfLines={1}
                  multiline={true}
                  placeholderTextColor="#ddd"
                  underlineColorAndroid="transparent"
                  onChangeText={des => this.setState({ des })}
                  value={this.state.des}
                  maxLength={150}
                />
              </View>


            </View>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: scale(20),

            }}>
              <TouchableOpacity

                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: Color.btn,
                  borderRadius: scale(5),
                  alignItems: "center",
                  justifyContent: "center"
                }}

                onPress={() => {
                  this._addItem_fun()
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: scale(15),

                }}>{this.state.ed_id==""?"Save":"Update"}</Text>
              </TouchableOpacity>

              <TouchableOpacity

                style={{
                  width: scale(90),
                  height: scale(30),
                  padding: scale(10),
                  backgroundColor: '#ddd',
                  borderRadius: scale(5),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: scale(20)

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
                    ed_id:""
                  });
                }}


              >
                <Text style={{
                  color: '#fff',
                  fontSize: scale(15),
                  textAlign: 'center'
                }}>Cancel</Text>
              </TouchableOpacity>

            </View>










          </View>
        </ScrollView>



      </Modal>
    )
  }

  







  renderHeader() {
    return (
      <View
        style={{
           backgroundColor: Color.bgColor,
           borderRadius: scale(5),
          justifyContent: "center",
          alignItems:"center",
          padding: scale(10),
          width:scale(150),
          alignSelf:'center'}}
      >
         <Text style={{
         fontSize: scale(18),
          color: '#000',
         
        }}
        numberOfLines={1}
        >Item Details</Text>

      </View>
    )
  }


  renderTitle(){
    return(
      <View style={{flexDirection: 'row',
         
        borderWidth: scale(0.5),
        borderColor: '#ccc',
          backgroundColor:'#fff'
          }}>
        <Text style={{
          padding: scale(10),
          width: scale(100),
          fontWeight:'bold',
          fontSize:scale(12),
          textAlign:'center',
          textAlignVertical:'center',
          borderColor:'#ddd',
          borderRightWidth:scale(1)
         }}
        numberOfLines={2}
        >Item Type</Text>
       
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
        >Item Name</Text>
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
        >Item Unit</Text>
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
        >Item Rate</Text>
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
        >Item Description</Text>
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
        >{rowData.item.item_type}</Text>
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
        >{rowData.item.item_name}</Text>
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
        >{rowData.item.item_unit}</Text>
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
        >{rowData.item.item_rate}</Text>
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
        >{rowData.item.item_des}</Text>
        <View
          style={{
            padding: scale(10),
            width: scale(100),
            alignItems:"center",
            justifyContent:"center"
           }}
        >

        <TouchableOpacity
        style={{
        backgroundColor:Color.btn,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:scale(5),
        height:scale(30),
        width:scale(40),
     

        }}
            onPress={() => { this.GetItem(rowData.item.item_id, rowData.index) }}
        >
          <Text style={{color:"#fff",fontSize:scale(10)}}>Edit</Text>
        </TouchableOpacity>

        </View>




      </View>






    )
  }
 
  render() {


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
            height:'70%'
        }}
        
        >
        <View style={{
            borderWidth:1,
            height: '100%',
            borderColor:'#ccc',
            borderRadius:scale(5),
            paddingBottom:scale(5)
          
        }}>
            <TouchableOpacity style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent:"flex-end",
              padding:scale(10),
          
              width:'100%',
              
            }}

              onPress={() => {
                this.setState({ addItem: true, ed_id: "" })
              }}
            
            >
              <Image source={Images.add}
                style={{
                  height: scale(20),
                  width: scale(20)
                }}
              />
              <Text
                style={styles.txt2}
                numberOfLines={1}
              >  Add New Item</Text>
            </TouchableOpacity>

         
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
                  //  ItemSeparatorComponent={this.FlatListItemSeparator}
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


       



        {this._addItemRender()}

 
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

  userInput: {
    height: scale(42),
    backgroundColor: 'white',
    borderWidth: scale(1),
    width: scale(200),
    justifyContent: "center",
    borderRadius: scale(5),
    borderColor: "#ddd"

  },

  input: {



    fontSize: scale(12)
  },

  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'left'
  },


  userInputTC: {
    height: scale(60),
    borderRadius: scale(5),
    borderColor: '#ddd',
    borderWidth: scale(1),
    width: scale(200),
  },

  inputTC: {
    color: '#000',
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




ItemDetailsScreen.defaultProps = {
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
)(ItemDetailsScreen);