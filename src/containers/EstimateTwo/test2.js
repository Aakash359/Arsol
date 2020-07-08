import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  UIManager,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
const {height} = Dimensions.get('window');
import {connect} from 'react-redux';
import {Images, Color, Config} from '@common';
import {scale} from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner} from '@components';
const msg = Config.SuitCRM;
import {validate_email} from '../../Omni';
import {
  CommonActions,
  StackActions,
  DrawerActions,
} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RadioGroup} from 'react-native-btr';
import moment from 'moment';
import SlidingUpPanel from 'rn-sliding-up-panel';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class EstimateTwoScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addItem: false,
      editModal: false,

      selectItem_list: [],
      selectItem_value: '',

      show_list: [
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
        {
          item_type: 'Goods',
          item_quant: '4',
          item_desc: 'item1',
          item_unit: 'Kg',
          item_rate: '2000',
          code: 'test01',
          item_gst: '12',
          item_disc: '40%',
          item_amt: '4000',
        },
      ],

      item_list: [],

      sgst_rs: 0,
      cgst_rs: 0,
      igst_rs: 0,
      sub_total: 0,
      currency: '',
      extra_rs: 0,
      total: 0,

      edit_index: null,
      des: '',
      qty: '',
      rate: '',
      hsn_sac_code:'',
      discount: '',

    };
  }

  componentDidMount() {
    const {network} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      } else {
        this.setState({loading: true}, () => {
          this.hit_SelectItemApi();
        });
      }
    });
  }

  hit_SelectItemApi() {
    const {network, user_id, user_type} = this.props;

    if (network.isConnected) {
      ArsolApi.SelectItem_api(user_id, user_type)

        .then(responseJson => {
          console.log('SelectItem_api', responseJson);

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
                        selectItem_list: responseJson.data.data,
                      });
                    }
                  }
                } else if (responseJson.data.status == 'failed') {
                  alert(responseJson.data.message);
                } else {
                  Snackbar.show({
                    text: msg.servErr,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'red',
                  });
                }
              } else {
                Snackbar.show({
                  text: msg.servErr,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'red',
                });
              }
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            }
          } else {
            if (responseJson.problem == 'NETWORK_ERROR') {
              Snackbar.show({
                text: msg.netError,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen,
              });
              this.setState({
                loading: false,
              });
            } else if (responseJson.problem == 'TIMEOUT_ERROR') {
              Snackbar.show({
                text: msg.serTimErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: Color.lgreen,
              });
              this.setState({
                loading: false,
              });
            } else {
              Snackbar.show({
                text: msg.servErr,
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
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

  setAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeIn,
        springDamping: 0.7,
      },
    });
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.easeIn,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.7,
      },
    });
  };

  addNewItem = () => {
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.addItem}
        onRequestClose={() => {
          this.setState({addItem: false});
        }}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
            }}>
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  padding: scale(10),
                  borderRadius: scale(5),
                  alignItems: 'center',
                }}>
                <View style={{width: scale(200)}}>
                  <Text style={styles.txt_h}>Item Type</Text>
                </View>

                <View style={styles.userInput}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Item Type',
                      value: '',
                      color: 'black',
                      fontSize: scale(12),
                      fontWeight: 'bold',
                    }}
                    items={[
                      {label: 'Goods', value: 'Goods'},
                      {label: 'Service', value: 'Service'},
                    ]}
                    onValueChange={value => {
                      this.setState({item_type: value});
                    }}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>Name</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={name => this.setState({name})}
                    value={this.state.name}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>Unit</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>

                <View style={styles.userInput}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Unit',
                      value: '',
                      color: 'black',
                      fontSize: scale(12),
                      fontWeight: 'bold',
                    }}
                    items={[
                      {label: 'Box', value: 'Box'},
                      {label: 'CM', value: 'CM'},
                    ]}
                    onValueChange={value => {
                      this.setState({unit: value});
                    }}
                    value={this.state.unit}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>Rate (Rs.)</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>

                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={rate => this.setState({rate})}
                    value={this.state.rate}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>HSN Code</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>

                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={hsn_code => this.setState({hsn_code})}
                    value={this.state.hsn_code}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>GST (%)</Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>

                <View style={styles.userInput}>
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Gst',
                      value: '',
                      color: 'black',
                      fontSize: scale(12),
                      fontWeight: 'bold',
                    }}
                    items={[
                      {label: 'Box', value: 'Box'},
                      {label: 'CM', value: 'CM'},
                    ]}
                    onValueChange={value => {
                      this.setState({gst: value});
                    }}
                    value={this.state.gst}
                  />
                </View>

                <View style={{flexDirection: 'row', width: scale(200)}}>
                  <Text style={styles.txt_h}>Description </Text>
                  <Text style={{color: 'red', fontSize: scale(12)}}>*</Text>
                </View>

                <View style={styles.userInputTC}>
                  <TextInput
                    style={styles.inputTC}
                    placeholder={'(Maximum 150 characters)'}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    numberOfLines={1}
                    multiline={true}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={des => this.setState({des})}
                    value={this.state.des}
                    maxLength={150}
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
                      this.setState({addItem: false});
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: scale(15),
                        textAlign: 'center',
                      }}>
                      {' '}
                      Cancel{' '}
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
                      this.setState({addItem: false});
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

    const{item_list}=this.state

      this.setState(() => {
        return {
          editModal: true, 
          edit_index: index,
          des:item_list[index].item_des,
          qty:item_list[index].item_qun,
          rate:item_list[index].item_rate,
          hsn_sac_code:item_list[index].code,
          discounts:item_list[index].item_discountamount,
        }
      })
  }

  savePress(){
    const {des, qty, rate,hsn_sac_code, discount } = this.state;
    
    if(des.trim()==''){
      alert('Enter Description')
    }else
    if(qty.trim()==''){
      alert('Enter Quantity')
    }else if (isNaN(qty)){
      alert('Quantity Invalid')
    }else if (qty<1){
     alert('Quantity greater than zero') 
    }if(rate.trim()==''){
      alert('Enter Rate')
    }else if (isNaN(rate)){
      alert('Quantity Rate')
    }else if (rate<1){
     alert('Rate greater than zero') 
    }if(hsn_sac_code.trim()==''){
      alert('Enter HSN/SAC')
    }if(!discount.trim()==''){
      if (isNaN(qty)){
        alert('Discount Invalid')
      }else if (qty<1){
        alert('Discount greater than zero') 
       }else{

        this.updateList()
        
         
       }
    }else {

      this.updateList()
     
    }
    

  }

  updateList(){
    const {des, qty, rate,hsn_sac_code, 
           discount,edit_index,item_list,
           sgst_rs,cgst_rs,igst_rs,sub_total, } = this.state;
    const {reg_state, customer_state} = this.props;

    const newArray = [...item_list];
    var gst =newArray[edit_index].item_gst
   
    var disAmount = (parseFloat(rate) / 100) * parseFloat(discount==''?0:discount);
    var rate_after_gst = parseFloat(rate) - parseFloat(disAmount);
    
    var gstAmount = (rate_after_gst / 100) * parseInt(gst);
    var amount = Math.round(parseFloat(qty) * parseFloat(rate_after_gst));

    newArray[edit_index].item_des=des
    newArray[edit_index].item_qun=qty
    newArray[edit_index].item_rate=rate
    newArray[edit_index].code=hsn_sac_code
    newArray[edit_index].item_discount=discount
    newArray[edit_index].item_amt=amount.toString()
    newArray[edit_index].item_gstamount=gstAmount.toString()
    newArray[edit_index].item_discountamount=disAmount.toString()
      


    var half_sgst_rst,half_cgst_rs,full_gst,full_amt

    half_sgst_rst=reg_state == customer_state? 
        sgst_rs - Math.round( parseFloat(item_list[edit_index].item_gstamount)/ 2) + Math.round( gstAmount/ 2): 0
    half_cgst_rs=reg_state == customer_state? 
    cgst_rs - Math.round( parseFloat(item_list[edit_index].item_gstamount)/ 2) + Math.round( gstAmount/ 2): 0     
   
    full_gst=reg_state != customer_state? 
    igst_rs - parseFloat(item_list[edit_index].item_gstamount) + Math.round( gstAmount): 0
  
    full_amt=sub_total - parseFloat(item_list[edit_index].item_amt)+ amount

    alert(item_list[edit_index].item_amt)


   this.setState(() => {
    return {
      item_list:newArray,
      editModal:false,
      edit_index: null,
      des:'',
      qty:'',
      rate:'',
      hsn_sac_code:'',
      discounts:'',
      sgst_rs:half_sgst_rst,
      cgst_rs:half_cgst_rs,
      igst_rs:full_gst,
      sub_total:full_amt
      
    }})


   

    }

  

  editNewItem = () => {
    const {des, qty, rate,hsn_sac_code, discount } = this.state;
    return (
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.editModal}
        onRequestClose={() => {
          this.setState({editModal: false});
        }}>
        <View style={{flex: 1}}>
          <ScrollView
            style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: scale(5),
            }}>
            <View>
              <View
                style={{
                  backgroundColor: 'white',
                  width: '90%',
                  padding: scale(10),
                  borderRadius: scale(5),
                  alignItems: 'center',
                }}>
                <Text style={styles.txt_h}>Item Description</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={des => this.setState({des})}
                    value={des}
                  />
                </View>

                <Text style={styles.txt_h}>Quantity</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={qty => this.setState({qty})}
                    value={qty}
                    keyboardType='number-pad'
                  />
                </View>

                <Text style={styles.txt_h}>Rate</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={rate => this.setState({rate})}
                    value={rate}
                    keyboardType='number-pad'
                  />
                </View>

                <Text style={styles.txt_h}>HSN/SAC Code</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={hsn_sac_code => this.setState({hsn_sac_code})}
                    value={hsn_sac_code}
                  />
                </View>

                <Text style={styles.txt_h}>Discount</Text>
                <View style={styles.userInput}>
                  <TextInput
                    style={styles.input}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={discount => this.setState({discount})}
                    value={discount}
                    keyboardType='number-pad'
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
                        editModal: false, 
                        edit_index: null,
                        des:'',
                        qty:'',
                        rate:'',
                        hsn_sac_code:'',
                        discounts:''});
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
                      this.savePress()
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

  render_FlatList_header = () => {
    const {selectItem_list, selectItem_value} = this.state;
    var header_View = (
      <View style={styles.header_footer_style}>
        <View
          style={{
            width: '60%',
            borderWidth: scale(1),
            height: scale(30),
            justifyContent: 'center',
            borderRadius: scale(5),
          }}>
          <RNPickerSelect
            placeholder={{
              label: 'Select Item',
              value: '',
              color: 'black',
              fontSize: scale(12),
              fontWeight: 'bold',
            }}
            style={{
              inputIOS: styles.inputIOS,
              inputAndroid: styles.inputAndroid,
            }}
            items={selectItem_list}
            onValueChange={selectItem_value =>
              this.setState({selectItem_value})
            }
            value={selectItem_value}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#335E61',
            width: scale(50),
            height: scale(30),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scale(5),
            margin: scale(5),
          }}
          onPress={() => {
            this.addSelectItem();
          }}>
          <Text style={{fontSize: scale(12), color: '#fff'}}>Add</Text>
        </TouchableOpacity>
      </View>
    );

    return header_View;
  };

  renderNext = () => {
    const {igst_rs, sgst_rs, cgst_rs, sub_total, extra_rs} = this.state;
    const {currency_type} = this.props;
    var t1 = sgst_rs + cgst_rs;
    var t2 = t1 + igst_rs;
    var t3 = t2 + extra_rs;
    var final_total = t3 + sub_total;
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
            <Text style={{fontSize: scale(12)}}>View Details</Text>

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
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
              Total {currency_type}{' '}
            </Text>
            <Text
              style={{fontSize: scale(12), fontWeight: 'bold', color: 'green'}}>
              {final_total}
            </Text>
          </View>

          <TouchableOpacity 
          onPress={() => alert('pending')}
         disabled={sub_total!=0 ?false:true}
          >
            <View
              style={{
                width: '90%',
                height: scale(60),
                backgroundColor: sub_total!=0 ?'#3498DB':'#ddd',
                justifyContent: 'center',
                alignItems: 'center',
                height: scale(40),
                alignSelf: 'center',
                borderRadius: scale(7),
                marginTop: scale(10),
              }}>
              <Text style={styles.textStyle}>Next</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );

    return footer_View;
  };
  renderSlidingUpPanel = () => {
    const {igst_rs, sgst_rs, cgst_rs, sub_total, extra_rs, total} = this.state;
    const {currency_type} = this.props;
    var t1 = sgst_rs + cgst_rs;
    var t2 = t1 + igst_rs;
    var t3 = t2 + extra_rs;
    var final_total = t3 + sub_total;

    var footer_View = (
      <SlidingUpPanel ref={c => (this._panel = c)}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: scale(360),
              backgroundColor: '#fff',
              marginTop: '86%',
              width: '95%',
              alignSelf: 'center',
              borderTopLeftRadius: scale(7),
              borderTopRightRadius: scale(7),
              padding: scale(10),
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                height: scale(40),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: scale(14),
                  color: 'grey',
                  fontWeight: 'bold',
                }}>
                CHOOSE ANY EXTRA COST
              </Text>

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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                SGST (Rs.)
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
                  style={{fontSize: scale(12)}}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  // onChangeText={ sgst_rs => this.setState({sgst_rs})}
                  value={sgst_rs.toString()}
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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                CGST (Rs.)
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
                  style={{fontSize: scale(12)}}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  value={cgst_rs.toString()}
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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                IGST (Rs.)
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
                  style={{fontSize: scale(12)}}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  value={igst_rs.toString()}
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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                Sub Total
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
                  style={{fontSize: scale(12)}}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  value={sub_total.toString()}
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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                Extra Charge
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
                  style={{fontSize: scale(12)}}
                  autoCorrect={false}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  placeholderTextColor="grey"
                  underlineColorAndroid="transparent"
                  onChangeText={extra_rs => {
                    if (extra_rs.trim() == '') {
                      this.setState({extra_rs: 0});
                    } else if (isNaN(extra_rs)) {
                      this.setState({extra_rs: 0});
                    } else {
                      this.setState({extra_rs: parseInt(extra_rs)});
                    }
                  }}
                  value={extra_rs}
                  keyboardType="number-pad"
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
              <Text style={{fontSize: scale(12), fontWeight: 'bold'}}>
                Total
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: scale(200),
                }}>
                <View
                  style={{
                    height: scale(35),
                    backgroundColor: '#ddd',
                    borderColor: 'grey',
                    borderWidth: scale(1),
                    width: scale(90),
                    borderRadius: scale(5),
                  }}>
                  <TextInput
                    style={{fontSize: scale(12)}}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    onChangeText={currency_type =>
                      this.setState({currency_type})
                    }
                    value={currency_type}
                    editable={false}
                  />
                </View>

                <View
                  style={{
                    height: scale(35),
                    backgroundColor: '#ddd',
                    borderColor: 'grey',
                    borderWidth: scale(1),
                    width: scale(90),
                    borderRadius: scale(5),
                  }}>
                  <TextInput
                    style={{fontSize: scale(12)}}
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    returnKeyType={'next'}
                    placeholderTextColor="grey"
                    underlineColorAndroid="transparent"
                    value={final_total.toString()}
                    editable={false}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity 
            onPress={() => this._panel.hide()}
              
               disabled={sub_total!=0 ?false:true}
            >
              <View
                style={{
                  width: '90%',
                  height: scale(60),
                  backgroundColor: sub_total!=0 ?'#3498DB':'#ddd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: scale(40),
                  alignSelf: 'center',
                  borderRadius: scale(7),
                  marginTop: scale(15),
                }}>
                <Text style={styles.textStyle}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SlidingUpPanel>
    );

    return footer_View;
  };

  addSelectItem() {
    const {
      selectItem_value,
      selectItem_list,
      item_list,
      sgst_rs,
      cgst_rs,
      igst_rs,
      sub_total,

      extra_rs,
    } = this.state;
    const {reg_state, customer_state} = this.props;

    if (selectItem_value == '') {
      alert('Select item');
    } else {
      for (var key in selectItem_list) {
        if (selectItem_list[key].value == selectItem_value) {
          var rate = selectItem_list[key].rate;
          var gst = selectItem_list[key].gst;
          var disAmount = (parseFloat(rate) / 100) * 0;
          var rate_after_gst = parseFloat(rate) - parseFloat(disAmount);
          var gstAmount = (rate_after_gst / 100) * parseInt(gst);
          var amount = Math.round(1 * parseFloat(rate_after_gst));

          var add_row = {
            item_type: selectItem_list[key].item_type,
            item_des: selectItem_list[key].item_des,
            item_qun: '1',
            item_unit: selectItem_list[key].unit,
            item_rate: rate,
            code: selectItem_list[key].hsn_sacCode,
            item_gst: gst,
            item_discount: '0',
            item_amt: amount.toString(),
            item_name: selectItem_list[key].label,
            item_gstamount: gstAmount.toString(),
            item_discountamount: disAmount.toString(),
          };

          this.setAnimation();

          this.setState(() => {
            return {
              item_list: [...item_list, add_row],
              selectItem_value: '',
              sgst_rs:
                reg_state == customer_state
                  ? sgst_rs + Math.round(gstAmount / 2)
                  : 0,
              cgst_rs:
                reg_state == customer_state
                  ? cgst_rs + Math.round(gstAmount / 2)
                  : 0,
              igst_rs:
                reg_state != customer_state
                  ? igst_rs + Math.round(gstAmount)
                  : 0,
              sub_total: sub_total + amount,
            };
          });
        }
      }
    }
  }


  deleteItem(index) {
    const {item_list, sgst_rs, cgst_rs, igst_rs, sub_total} = this.state;
    const {reg_state, customer_state} = this.props;
    const newArray = [...item_list];
    this.setAnimation();
    const gstAmount = item_list[index].item_gstamount;
    const amount = item_list[index].item_amt;
    newArray.splice(index, 1);
    this.setState(() => {
      return {
        item_list: newArray,
        sgst_rs:
          reg_state == customer_state
            ? sgst_rs - Math.round(parseInt(gstAmount) / 2)
            : 0,
        cgst_rs:
          reg_state == customer_state
            ? cgst_rs - Math.round(parseInt(gstAmount) / 2)
            : 0,
        igst_rs:
          reg_state != customer_state
            ? igst_rs - Math.round(parseInt(gstAmount))
            : 0,
        sub_total: sub_total - parseInt(amount),
      };
    });
  }

  renderFlatList(rowData, index) {
    console.log(rowData);
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: scale(10),
          justifyContent: 'space-between',
        }}
        key={index}>
        <View style={{width: '80%'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Item Type:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.item_type}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Item Description:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.item_des}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Quantity:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.item_qun}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Unit:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.item_unit}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Rate:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.item_rate}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              HSN/SAC Code:
            </Text>
            <Text style={styles.txt} numberOfLines={1}>
              {rowData.item.code}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              GST (%):
            </Text>
            <Text style={styles.txt} numberOfLines={3}>
              {rowData.item.item_gst}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Discount (%):
            </Text>
            <Text style={styles.txt} numberOfLines={3}>
              {rowData.item.item_discount}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.txth} numberOfLines={1}>
              Amount:
            </Text>
            <Text style={styles.txt} numberOfLines={3}>
              {rowData.item.item_amt}
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
              this.editItem(rowData.index);
            }}>
            <Text style={{fontSize: scale(12), color: '#fff'}}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              width: scale(50),
              height: scale(30),
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: scale(5),
              margin: scale(5),
            }}
            onPress={() => {
              this.deleteItem(rowData.index);
            }}>
            <Text style={{fontSize: scale(12), color: '#fff'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    const {item_list} = this.state;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          leftButtonTitle={'Select Item'}
          height={scale(44)}
          leftButtonTitleColor={Color.black}
          leftButtonIcon={Images.back}
          backgroundColor={Color.headerTintColor}
          onLeftButtonPress={() => {
            this.props.navigation.goBack();
          }}
          SearchButtonIcon={Images.plus}
          onSearchButtonPressHandle={() => {
            this.setState({addItem: true, ed_id: ''});
          }}
        />
        <LogoSpinner loading={this.state.loading} />
        {this.addNewItem()}
        {this.editNewItem()}

        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingBottom: scale(5)}}
          data={item_list}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.render_FlatList_header}
          stickyHeaderIndices={[0]}
          bounces={false}
          extraData={this.state}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={item => this.renderFlatList(item)}
          ListEmptyComponent={
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: Platform.OS === 'iOS' ? 20 : 0,
  },

  FlatList_Item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },

  header_footer_style: {
    width: '100%',
    height: scale(45),

    backgroundColor: '#fff',
    borderTopWidth: scale(1),
    borderBottomWidth: scale(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: scale(21),
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
  txt: {fontSize: scale(12), width: scale(150)},
  txth: {fontSize: scale(12), fontWeight: 'bold'},
  userInput: {
    height: scale(40),
    backgroundColor: 'white',
    marginBottom: scale(5),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
    borderRadius: scale(5),
  },
  txt_h: {
    fontSize: scale(12),
    color: '#000',
    fontWeight: 'bold',
    width: scale(200),
    textAlign: 'left',
  },
  input: {
    color: '#000',
    marginLeft: scale(5),
    width: '73%',
    fontSize: scale(12),
  },
});

EstimateTwoScreen.defaultProps = {
  user_id: '',
  user_type: '',
  network: '',
  customer_state: '',
  currency_type: '',
  reg_state: '',
};

const mapStateToProps = state => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,
    customer_state: state.estData.new_estimate.customer_state,
    currency_type: state.estData.new_estimate.currency_type,
    reg_state: state.estData.new_estimate.reg_state,
  };
};

export default connect(
  mapStateToProps,
  null,
)(EstimateTwoScreen);
