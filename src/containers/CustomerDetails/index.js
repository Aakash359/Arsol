import React, { PureComponent } from "react";

import {
  View, ScrollView, ImageBackground, Dimensions,

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
import email from 'react-native-email';
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
    this._subscribe = this.props.navigation.addListener('focus', () => {
      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red"
        });
      } else {
        this.setState({
          loading: true,
           refresh: false,
          load_more: false,
          onEndReachedCalledDuringMomentum: true,
          show_list: []}, () => {
          this.hit_customerDetailApi()
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
            show_list: []
          }, () => {
            this.hit_customerDetailApi()
          })
        }
      }
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

 


  handleEmail = (email_id) => {
    const to = [email_id] // string or array of email addresses
    email(to, {
      // Optional additional arguments
      //   cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
      // bcc: 'mee@mee.com', // string or array of email addresses
      //  subject: 'Show how to use',
      // body: 'Some body right here'
    }).catch(console.error)
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
      <TouchableOpacity
        onPress={() => { 
          this.props.navigation.navigate('Customer',
           { Cust_id: rowData.item.customer_id }) 
           }}>
          <Text style={{
            padding: scale(10),
            width: scale(120),
            fontSize: scale(12),
            textAlign: 'center',
            textAlignVertical: 'center',
            borderColor: '#ddd',
            borderRightWidth: scale(1)
          }}
            numberOfLines={2}
          >{rowData.item.company_name}</Text>
      </TouchableOpacity>
   
        <Text style={{
          padding: scale(10),
          width: scale(120),
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >{rowData.item.customer_name}</Text>
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
        >{rowData.item.display_name}</Text>
        <TouchableOpacity onPress={this.handleEmail.bind(this, rowData.item.email_id)}>

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
          >{rowData.item.email_id}</Text>
        </TouchableOpacity>
        
       
        <View
          style={{
            padding: scale(10),
            width: scale(100),
            alignItems: "center",
            justifyContent: "center",
            borderColor: '#ddd',
            borderRightWidth: scale(1)
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: Color.btn,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              minHeight: scale(30),
              maxHeight: scale(45),
              width: scale(40),


            }}
    onPress={() => { this.props.navigation.navigate("ContactOne", { Edit_Id: rowData.item.customer_id }) }}
        >
            <Text style={{ color: "#fff", fontSize: scale(10) }}>Edit</Text>
          </TouchableOpacity>

        </View>

        <View
          style={{
            padding: scale(10),
            width: scale(150),
            alignItems: "center",
            justifyContent: "center"
          }}
        >

          <TouchableOpacity
            style={{
              backgroundColor: Color.headerTintColor,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: scale(5),
              width: scale(100),
              minHeight:scale(30),
              maxHeight:scale(45)


            }}
           // onPress={() => { this.props.navigation.navigate("ContactOne", { Edit_Id: rowData.item.customer_id }) }}
          >
            <Text style={{ color: "#fff",
             fontSize: scale(10),
            textAlignVertical:'center',
            textAlign:'center' }}>Create Invoice</Text>
          </TouchableOpacity>

        </View>




      </View>






    )
  }





  renderHeader() {
    return (
      <View
        style={{
          backgroundColor: Color.bgColor,
          borderRadius: scale(5),
          justifyContent: "center",
          alignItems: "center",
          padding: scale(10),
          width: scale(170),
          alignSelf: 'center'
        }}
      >
        <Text style={{
          fontSize: scale(18),
          color: '#000',

        }}
          numberOfLines={1}
        >Customer Details</Text>

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
          width: scale(120),
          fontWeight: 'bold',
          fontSize: scale(12),
          textAlign: 'center',
          textAlignVertical: 'center',
          borderColor: '#ddd',
          borderRightWidth: scale(1)
        }}
          numberOfLines={2}
        >Company Name</Text>

        <Text style={{

          padding: scale(10),
          width: scale(120),
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
        >Display Name</Text>
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
        >Email Id</Text>
      
        <Text style={{

          padding: scale(10),
          width: scale(100),
          fontWeight: 'bold',
          fontSize: scale(12),
          borderColor: '#ddd',
          borderRightWidth: scale(1)

        }}
          numberOfLines={2}
        ></Text>
        <Text style={{

          padding: scale(10),
          width: scale(150),
          fontWeight: 'bold',
          fontSize: scale(12),

        }}
          numberOfLines={2}
        ></Text>


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
            <TouchableOpacity style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: scale(10),

              width: '100%',

            }}

              onPress={() => {
                this.props.navigation.navigate("ContactOne")
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
              >  Add New Customer</Text>
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