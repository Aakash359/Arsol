import React, { PureComponent } from "react";

import {
  View, Keyboard, TouchableHighlight, Animated, LayoutAnimation,

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
      this.setState({ loading: true, ed_id: "" }, () => {
        this.hit_itemDetailApi()
        this.hit_unit_listApi()
        this.hit_gst_listApi()
      })
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
      this.setState({ loading: true, addItem: false, ed_id: "" }, () => {
        this.hit_addItemApi(user_id, user_type, item_type,
          name,
          unit,
          rate,
          hsn_sac_code,
          gst,
          des,
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
        >{rowData.item.item_name}</Text>

        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() => { this.GetItem(rowData.item.item_id, rowData.index) }}
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
        >  HSN/SAC Code:{rowData.item.hsn_sac_code}</Text>

        <Text style={styles.txt}
          numberOfLines={1}
        >  Type:{rowData.item.item_type}</Text>
        <Text style={styles.txt}
          numberOfLines={3}
        >  Description:{rowData.item.item_des}</Text>


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
          >unit:{rowData.item.item_unit}</Text>

          <Text style={styles.txt}
            numberOfLines={1}
          >rate:{rowData.item.item_rate}</Text>

          <Text style={styles.txt}
            numberOfLines={1}
          >gst%:{rowData.item.item_gst}</Text>



        </View>


      </View>






    )
  }

  //additem
  _addItemRender() {
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

                <View style={{ width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>Item Type</Text>
                </View>

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


                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>Name</Text>
                  <Text style={styles.required}>*</Text>
                </View>

                <View style={styles.userInput}>

                  <TextInput
                    style={styles.input}

                    autoCorrect={false}
                    autoCapitalize={'none'}

                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={name => this.setState({ name })}
                    value={this.state.name}
                  />
                </View>


                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>Unit</Text>
                  <Text style={styles.required}>*</Text>
                </View>

                <View style={styles.userInput}>

                  <RNPickerSelect
                    placeholder={{
                      label: "Select Unit",
                      value: "",

                    }}
                    items={this.state.unit_list}
                    onValueChange={(unit) => {
                      this.setState({ unit })
                      console.log(unit)
                    }}
                    value={this.state.unit}
                  />

                </View>



                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>Rate (Rs.)</Text>
                  <Text style={styles.required}>*</Text>
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



                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>{this.state.item_type == "Goods" ? "HSN Code" : "SAC Code"}</Text>
                  <Text style={styles.required}>*</Text>
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






                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>GST (%)</Text>
                  <Text style={styles.required}>*</Text>
                </View>


                <View style={styles.userInput}>

                  <RNPickerSelect
                    placeholder={{
                      label: "Select Gst",
                      value: "",

                    }}
                    items={this.state.gst_list}
                    onValueChange={(value) => { this.setState({ gst: value }) }}
                    value={this.state.gst}
                  />

                </View>


                <View style={{ flexDirection: 'row', width: scale(200), textAlign: 'left' }}>
                  <Text style={styles.txt_h}>Description</Text>
                  <Text style={styles.required}>*</Text>
                </View>

                <View style={styles.userInputTC}>

                  <TextInput
                    style={styles.inputTC}
                    placeholder={'(Maximum 150 characters)'}
                    autoCorrect={false}
                    autoCapitalize={'none'}

                    numberOfLines={1}
                    multiline={true}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={des => this.setState({ des })}
                    value={this.state.des}
                    maxLength={150}
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
                      this._addItem_fun()
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
        }}>Item Details</Text>

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
          //pagination

          ListFooterComponent={this.renderFooter.bind(this)}
          onEndReachedThreshold={0.01}
          onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
          onEndReached={this.handleLoadMore.bind(this)}
          onScroll={this._onScroll}
        />



        {this._addItemRender()}

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
    borderColor: '#0070c6',
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
    fontWeight: 'bold'

  },

  required: {
    fontSize: scale(12),
    color: 'red'
  },

  userInputTC: {
    height: scale(100),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: '#0070c6',
    borderWidth: scale(1),
    width: scale(200),
  },

  inputTC: {
    color: '#000',
    fontSize: scale(12)
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