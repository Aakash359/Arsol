import React, { PureComponent } from 'react';
import {
  View, Button, Text, TextInput, FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { connect } from "react-redux";
import { Images, Color, } from '@common';
import { scale } from 'react-native-size-matters';
import { NavigationBar, LogoSpinner } from '@components';
import ArsolApi from '@services/ArsolApi';
import Snackbar from 'react-native-snackbar';
import Checkbox from 'react-native-modest-checkbox'
import SlidingUpPanel from 'rn-sliding-up-panel';



class CustomerPayTwoScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,

      total_amount: '0',
      amount_recvd: '0',
      tds_amount: '0',
      round_of: '0',
      balance: '0',
      adv_account: '0',


      item_list: [],
      editListModal: false,
      edit_index: null,
      advCheck : false,
      selectInvoice : false

    }
  }




  componentDidMount() {
    const { network, comp_id, date } = this.props;


    if (!network.isConnected) {
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    } else {

      this.setState({ loading: true }, () => {
        this.hit_CustomerPaymentApi(comp_id, date)
      })


    }
  }


  hit_CustomerPaymentApi(company_id, date) {
    const { network, user_id, user_type } = this.props

    if (network.isConnected) {
      ArsolApi.CustomerPayment_api(
        user_id,
        user_type,
        company_id,
        date
      )

        .then(responseJson => {
          console.log('CustomerPayment_api', responseJson);

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
                        item_list: responseJson.data.data
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




  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#607D8B',
        }}
      />
    );
  };


  renderSlidingUpPanel() {
    const { total_amount, amount_recvd, tds_amount, round_of, balance, adv_account } = this.state;

    var footer_View = (
      <SlidingUpPanel ref={c => (this._panel = c)}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,

              backgroundColor: '#fff',

              width: '95%',
              alignSelf: 'center',

              padding: scale(10),
              borderTopEndRadius: scale(7),
              borderTopStartRadius: scale(7)
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>

              <View>
                <Checkbox
                  label='Advance/On Account'
                  checked={this.state.advCheck}
                  onChange={(checked) => this.addAdvance(checked)}
                />
              </View>

              <TouchableOpacity onPress={() => this._panel.hide()}>
                <Image
                  source={Images.interface}
                  style={{
                    resizeMode: 'contain',
                    width: scale(25),
                    height: scale(25),
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                Total Amount
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#ddd',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  //onChangeText={ total_amount => this.setState({total_amount})}
                  value={total_amount}
                  editable={false}
                />
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                Amount Received
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#ddd',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  // onChangeText={ amount_recvd => this.setState({amount_recvd})}
                  value={amount_recvd}
                  editable={false}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                TDS Amount
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#ddd',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  // onChangeText={ tds_amount => this.setState({tds_amount})}
                  value={tds_amount}
                  editable={false}
                />
              </View>
            </View>
            <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                Round Of
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#ddd',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  // onChangeText={ round_of => this.setState({round_of})}
                  value={round_of}
                  editable={false}
                />
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                Balance
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#ddd',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  // onChangeText={ balance => this.setState({balance})}
                  value={balance}
                  keyboardType="number-pad"
                  editable={false}
                />
              </View>
            </View>

            {
              this.state.advCheck ? 
              <View
              style={{
                width: '100%',
                height: scale(60),
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
                Adv./On Account
                 </Text>
              <View
                style={{
                  height: scale(35),
                  backgroundColor: '#fff',
                  borderColor: 'grey',
                  borderWidth: scale(1),
                  width: scale(200),
                  borderRadius: scale(5),
                }}>
                <TextInput
                  style={{ fontSize: scale(12) }}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={adv_account => this.setState({ adv_account })}
                  value={adv_account}
                  keyboardType="number-pad"
                />
              </View>
            </View>

              : null 
            }

            

            <TouchableOpacity
            //onPress={() => { this.nextPress()}}
            >
              <View
                style={{
                  width: '90%',
                  height: scale(60),
                  backgroundColor: '#3498DB',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: scale(40),
                  alignSelf: 'center',
                  borderRadius: scale(7),
                  marginTop: scale(10),
                }}>
                <Text style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontSize: scale(15),
                }}>Receive Payment</Text>
              </View>
            </TouchableOpacity>


          </View>
        </View>
      </SlidingUpPanel>
    );

    return footer_View;

  }

  addAdvance(val){
    if(val.label=="Advance/On Account"){
      this.setState({advCheck:val.checked,})
  }
}




  renderFlatList(rowData, index) {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: scale(10),
          justifyContent: 'space-between'
        }}
        key={index}>

        <Checkbox
          label=''
          checked={this.state.selectInvoice}
          onChange={(checked) => console.log('checked')}
        />

        <View style={{ width: '70%' }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Invoice Number:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.inv_number}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Invoice Type:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.inv_type}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Contact Display Name:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.customer_name}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Invoice Date:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.inv_date}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Total Amount:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.total_amt}
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.txth} numberOfLines={1}>
              Opening Balance:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.opening_balance}
            </Text>
          </View>
        </View>

        <View>
          <TouchableOpacity
            style={{
              backgroundColor: '#FFB200',
              width: scale(50),
              height: scale(30),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: scale(5),
              margin: scale(5),
            }}
            onPress={() => {
              this.editItem(rowData.index)
            }}>
            <Text style={{ fontSize: scale(12), color: '#fff' }}>Edit</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }



  editItemModal = () => {
    const { amount_recvd, tds_amount, round_of } = this.state;
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.editListModal}
        onRequestClose={() => {
          this.setState({ editListModal: false });
        }}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
            }}
            keyboardShouldPersistTaps="handled">
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  padding: scale(10),
                  borderRadius: scale(5),
                  alignItems: 'center',
                }}>
                <Text style={styles.txt_h}>Amount Received</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={amount_recvd => this.setState({ amount_recvd })}
                    value={amount_recvd}
                    keyboardType="number-pad"
                  />
                </View>

                <Text style={styles.txt_h}>TDS</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={tds_amount => this.setState({ tds_amount })}
                    value={tds_amount}
                    keyboardType="number-pad"
                  />
                </View>

                <Text style={styles.txt_h}>Round of</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={round_of => this.setState({ round_of })}
                    value={round_of}
                    keyboardType="number-pad"
                  />
                </View>


                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: scale(100),
                      height: scale(40),
                      padding: scale(10),
                      backgroundColor: '#3D8EE1',
                      borderRadius: scale(8),
                      margin: scale(5),
                    }}
                    onPress={() => {
                      this.setState({
                        editListModal: false,
                        edit_index: null,
                        amount_recvd: '',
                        tds_amount: '',
                        round_of: ''

                      });
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: scale(15),
                        textAlign: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      width: scale(100),
                      height: scale(40),
                      padding: scale(10),
                      backgroundColor: '#3D8EE1',
                      borderRadius: scale(8),
                      margin: scale(5),
                    }}
                    onPress={() => {
                      this.savePress();
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: scale(15),
                        textAlign: 'center',
                      }}>
                      {' '}
                      Save{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };


  editItem(index) {
    const { amount_recvd, tds_amount, round_of } = this.state;

    this.setState(() => {
      return {
        editListModal: true,
        edit_index: index,
        amount_recvd: amount_recvd,
        tds_amount: tds_amount,
        round_of: round_of,
      };
    });
  }


  renderNext = () => {
    var footer_View = (
      <View>
        <View
          style={{
            width: '94%',
            alignSelf: 'center',

            borderTopWidth: 0.8,
            borderLeftWidth: 0.8,
            borderRightWidth: 0.8,
            borderTopLeftRadius: scale(7),
            borderTopRightRadius: scale(7),
            borderColor: '#ddd',
            padding: scale(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: scale(12) }}>View Details</Text>

            <TouchableOpacity onPress={() => this._panel.show()}>
              <Image
                source={Images.arrows}
                style={{
                  resizeMode: 'contain',
                  width: scale(25),
                  height: scale(25),
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>
              Total Amount : 
            </Text>
            <Text
              style={{ fontSize: scale(12), fontWeight: 'bold', color: 'green' }}> {this.state.total_amount}
            </Text>
          </View>

          <TouchableOpacity
          //onPress={() => { this.nextPress()}}
          >
            <View
              style={{
                width: '90%',
                height: scale(60),
                backgroundColor: '#3498DB',
                justifyContent: 'center',
                alignItems: 'center',
                height: scale(40),
                alignSelf: 'center',
                borderRadius: scale(7),
                marginTop: scale(10),
              }}>
              <Text style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: scale(15),
              }}>Receive Payment</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );

    return footer_View;
  };

  render() {
    const { item_list } = this.state;
    return (



      <View style={{ flex: 1 }}>
        <NavigationBar
          leftButtonTitle={'Customer Payment'}
          height={scale(44)}
          leftButtonTitleColor={Color.black}
          leftButtonIcon={Images.back}
          backgroundColor={Color.headerTintColor}
          onLeftButtonPress={() => {
            this.props.navigation.goBack();
          }}
        />
        <LogoSpinner loading={this.state.loading} />

        {this.editItemModal()}


        <FlatList
          contentContainerStyle={{ flexGrow: 1, paddingBottom: scale(5) }}
          data={item_list}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderFlatList(item)}
          ListEmptyComponent={
            <View
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {this.state.loading == false ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#ddd',
                      width: scale(80),
                      height: scale(80),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: scale(80) / 2,
                      borderWidth: 2,
                      borderColor: '#AED581',
                    }}>
                    <Image
                      source={Images.logo}
                      style={{
                        resizeMode: 'contain',
                        width: scale(50),
                        height: scale(50),
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: scale(15),
                      width: scale(150),
                      textAlign: 'center',
                      marginTop: scale(5),
                    }}>
                    No Record Found
                  </Text>
                </View>
              ) : null}
            </View>
          }
          onEndReachedThreshold={0.01}
        />

        {item_list.length > 0 ? this.renderNext() : null}
        {this.renderSlidingUpPanel()}


      </View>



    )
  }
}



const styles = StyleSheet.create({
  txt: { fontSize: scale(12), width: scale(150) },
  txth: { fontSize: scale(12), fontWeight: 'bold' },
  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    width: scale(200),
    textAlign: 'left',
  },
  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
  },

})

CustomerPayTwoScreen.defaultProps = {
  session: [],
  user_id: '',
  user_type: '',
}


const mapStateToProps = (state) => {
  return {

    session: state.user.session_id,
    network: state.network,
    user_id: state.user.id,
    user_type: state.user.type,


  };
};





export default connect(
  mapStateToProps,
  null
)(CustomerPayTwoScreen);
