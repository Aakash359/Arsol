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
  Keyboard,
  TouchableHighlight
} from 'react-native';
const {height} = Dimensions.get('window');
import {connect} from 'react-redux';
import {Images, Color, Config} from '@common';
import {scale} from 'react-native-size-matters';
import Snackbar from 'react-native-snackbar';
import CardView from 'react-native-cardview';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import {LogoSpinner} from '@components';
const msg = Config.SuitCRM;

import SlidingUpPanel from 'rn-sliding-up-panel';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class CreditNoteTwoScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addItem: false,
      editModal: false,

      selectItem_list: [],
      selectItem_value: '',

      item_list: [],

      sgst_rs: 0,
      cgst_rs: 0,
      igst_rs: 0,
      sub_total: [],

      currency: '',
      extra_rs: 0,

      edit_index: null,
      des: '',
      qty: '',
      rate: '',
      hsn_sac_code: '',
      discount: '',

      unit_list: [],
      gst_list: [],

      add_item_type: 'Goods',
      add_name: '',
      add_unit: '',
      add_rate: '',
      add_hsn_sac_code: '',
      add_gst: '',
      add_des: '',
      add_ed_id: '',
    };
  }

 

  componentDidMount() {
    const {network,edit_id,estimate_info,reg_state,customer_state} = this.props;
    this._subscribe = this.props.navigation.addListener('focus', () => {
      if (!network.isConnected) {
        Snackbar.show({
          text: msg.noInternet,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      } else {
         
         
          
           var jsonObj =  estimate_info.item_list
           console.log(jsonObj)

           var msub=[],mitem=[];
          
           for(var key in jsonObj){

                 msub.push({
                  amt: parseInt(jsonObj[key].item_amt),
                  sgst: reg_state == customer_state ? Math.round(parseInt(jsonObj[key].item_gstamount) / 2) : 0,
                  cgst: reg_state == customer_state ? Math.round(parseInt(jsonObj[key].item_gstamount) / 2) : 0,
                  igst: reg_state != customer_state ? Math.round(parseInt(jsonObj[key].item_gstamount)) : 0,
                  gst_per:parseInt(jsonObj[key].item_gst)
                })

                mitem.push(jsonObj[key])


        }

        this.setState({
          sub_total:msub,
          item_list:mitem,
          extra_rs:parseInt(estimate_info.extra_charge)
        })  



           

        
         



     
      }
    });
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



  editItem(index) {
    const {item_list} = this.state;

    this.setState(() => {
      return {
        editModal: true,
        edit_index: index,
        des: item_list[index].item_des,
        qty: item_list[index].item_qun,
        rate: item_list[index].item_rate,
        hsn_sac_code: item_list[index].code,
        discounts: item_list[index].item_discountamount,
      };
    });
  }

  savePress() {
    const {des, qty, rate, hsn_sac_code, discount} = this.state;

    if (des.trim() == '') {
      alert('Enter Description');
    } else if (hsn_sac_code.trim() == '') {
      alert('Enter HSN/SAC');
    } else {
      var q = 1.0;
      var r = 1.0;
      var d = 0.0;

      if (!isNaN(qty)) {
        if (qty > 0) {
         
          q = qty;
        }
      }

      if (!isNaN(rate)) {
        if (rate > 0) {
          r = rate;
        }
      }

      if (!isNaN(discount)) {
        if (discount > 0) {
          d = discount;
        }
      }

      this.updateList(q, r, d);
    }
  }

  updateList(q, r, d) {
    const {des, hsn_sac_code, edit_index, item_list, sub_total} = this.state;
    const {reg_state, customer_state} = this.props;

    const newArray = [...item_list];
    const newArray2 = [...sub_total];

    var gst = newArray[edit_index].item_gst;

    var disAmount = (parseFloat(r) / 100) * parseFloat(d);
    var rate_after_gst = parseFloat(r) - parseFloat(disAmount);
    var gstAmount = (rate_after_gst / 100) * parseInt(gst);

    var amount = Math.round(parseFloat(q) * parseFloat(rate_after_gst));

    var gstAmountQty = Math.round(parseFloat(q) * gstAmount);
  


    newArray[edit_index].item_des = des;
    newArray[edit_index].item_qun = q;
    newArray[edit_index].item_rate = r;
    newArray[edit_index].code = hsn_sac_code;
    newArray[edit_index].item_discount = d;
    newArray[edit_index].item_amt = amount.toString();
    newArray[edit_index].item_gstamount = gstAmountQty.toString();
    newArray[edit_index].item_discountamount = disAmount.toString();

    newArray2[edit_index].amt = amount;
    newArray2[edit_index].gst_per = parseInt(gst);


    (newArray2[edit_index].sgst =
      reg_state == customer_state ? Math.round(gstAmountQty / 2) : 0),

      (newArray2[edit_index].cgst =
        reg_state == customer_state ? Math.round(gstAmountQty / 2) : 0),

      (newArray2[edit_index].igst =
        reg_state != customer_state ? Math.round(gstAmountQty) : 0);

    this.setState(() => {
      return {
        item_list: newArray,
        editModal: false,
        edit_index: null,
        des: '',
        qty: '',
        rate: '',
        hsn_sac_code: '',
        discounts: '',
        sub_total: newArray2,
      };
    });
  }

  editNewItem = () => {
    const {des, qty, rate, hsn_sac_code, discount} = this.state;
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
                    keyboardType="number-pad"
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
                    keyboardType="number-pad"
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
                        editModal: false,
                        edit_index: null,
                        des: '',
                        qty: '',
                        rate: '',
                        hsn_sac_code: '',
                        discounts: '',
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

 

  nextPress(){
    const{item_list,sub_total,extra_rs}=this.state;
 
    const {currency_type,customer_state,reg_state} = this.props;

    const total = sub_total.reduce((prev, next) => prev + next.amt, 0);
    const sgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const cgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const igst_rs = sub_total.reduce((prev, next) => prev + next.igst, 0);

    const total_gst = sub_total.reduce((prev, next) => prev + next.gst_per, 0);
        var igst_percentage =  total_gst/item_list.length

    var t1 = sgst_rs + cgst_rs;
    var t2 = t1 + igst_rs;
    var t3 = t2 + total;
    var final_total = t3 + extra_rs;


      let details ={
        item_list:JSON.stringify(item_list),
        sgst:sgst_rs,
        sgst_percentage: reg_state == customer_state ? igst_percentage / 2 : 0,
        sub_total:total,
        cgst:cgst_rs,
        cgst_percentage:reg_state == customer_state ? igst_percentage / 2 : 0,
        extr_charge:extra_rs,
        igst:igst_rs,
        igst_percentage:reg_state != customer_state ? igst_percentage : 0,
        total:final_total,
        currency:currency_type
       }
  
            this.props.est_two(details)
            this.props.navigation.navigate('CreditNoteThree')
  }

  renderNext = () => {
    const {sub_total, extra_rs} = this.state;
    const {currency_type} = this.props;

    const total = sub_total.reduce((prev, next) => prev + next.amt, 0);
    const sgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const cgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const igst_rs = sub_total.reduce((prev, next) => prev + next.igst, 0);

    var t1 = sgst_rs + cgst_rs;
    var t2 = t1 + igst_rs;
    var t3 = t2 + total;
    var final_total = t3 + extra_rs;

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
              {final_total.toString()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => { this.nextPress()}}
            disabled={total != 0 ? false : true}>
            <View
              style={{
                width: scale(100),
                height: scale(40),
                backgroundColor: sub_total != 0 ? '#ff8f00' : '#ddd',
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
    const {sub_total, extra_rs} = this.state;
    const {currency_type} = this.props;

    const total = sub_total.reduce((prev, next) => prev + next.amt, 0);
    const sgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const cgst_rs = sub_total.reduce((prev, next) => prev + next.cgst, 0);
    const igst_rs = sub_total.reduce((prev, next) => prev + next.igst, 0);

    var t1 = sgst_rs + cgst_rs;
    var t2 = t1 + igst_rs;
    var t3 = t2 + total;
    var final_total = t3 + extra_rs;

    var footer_View = (
      <SlidingUpPanel ref={c => (this._panel = c)}>
        <View style={{flex: 1}}>
          <View
            style={{
              position:'absolute',
              bottom:0,
            
              backgroundColor: '#fff',
             
              width: '95%',
              alignSelf: 'center',
              
              padding: scale(10),
              borderTopEndRadius:scale(7),
              borderTopStartRadius:scale(7)
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
                  value={total.toString()}
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
                  value={extra_rs.toString()}
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
             onPress={() => { this.nextPress()}}
          
              disabled={total != 0 ? false : true}>
              <View
                style={{
                  width: scale(100),
                  height: scale(40),
                  backgroundColor: sub_total != 0 ? '#ff8f00' : '#ddd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: scale(40),
                  alignSelf: 'center',
                  borderRadius: scale(10),
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

  

  deleteItem(index) {
    const {item_list, sub_total} = this.state;

    const newArray = [...item_list];
    const newArray2 = [...sub_total];
    this.setAnimation();

    newArray.splice(index, 1);
    newArray2.splice(index, 1);

    this.setState(() => {
      return {
        item_list: newArray,
        sub_total: newArray2,
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
      <View style={{flex: 1, backgroundColor: "white",
           }}>

           <View>
        

          <TouchableHighlight
            activeOpacity={1}
            underlayColor={'#ddd'}
            onPress={() => this.props.navigation.goBack()}
            style={{
              width: scale(40), height: scale(40),
              alignItems: "center",
              justifyContent: 'center',
             
            }}
          >
        <View style={{height:scale(40),width:scale(40),backgroundColor:'#ff8f00'}}>
            <Image source={Images.backwhite} style={{
              width: scale(30), height: scale(30),alignSelf:"center",marginTop:scale(5)


            }} />
       </View>
          </TouchableHighlight>

          

        </View>

      <View style={{marginLeft:scale(80),
            width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
        <Text style={{ alignSelf:"center", marginTop:scale(7), fontSize: scale(18), fontWeight: 'bold' }}>
              {this.state.edit_id ? "Edit Estimate" :"New Estimate"}
              </Text>

        </View>
      
        {/* <NavigationBar
          leftButtonTitle={'Selected Item'}
          height={scale(44)}
          leftButtonTitleColor={Color.black}
          leftButtonIcon={Images.back}
          backgroundColor={Color.headerTintColor}
          onLeftButtonPress={() => {
            this.props.navigation.goBack();
          }}
        //   SearchButtonIcon={Images.plus}
        //   onSearchButtonPressHandle={() => {
        //     this.setState({addItem: true, ed_id: ''});
        //   }}
        /> */}
        <LogoSpinner loading={this.state.loading} />
       
        {this.editNewItem()}
      <CardView
                margin={scale(10)}
                height={350}
                width={330}
                padding={20}
                flex={1}
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={20}
                marginLeft={15}
                color={'red'}
                >
        <FlatList
          contentContainerStyle={{flexGrow: 1, paddingBottom: scale(5)}}
          data={item_list}
          keyExtractor={(item, index) => index.toString()}
     
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
  </CardView>
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
  userInputTC: {
    height: scale(100),
    backgroundColor: 'white',
    marginBottom: scale(15),
    borderColor: 'grey',
    borderWidth: scale(1),
    width: scale(200),
  },
});

CreditNoteTwoScreen.defaultProps = {
  user_id: '',
  edit_id:'',
  user_type: '',
  network: '',
  customer_state: '',
  currency_type: '',
  reg_state: '',
  estimate_info:'',
};

const mapStateToProps = state => {
  return {
    user_id: state.user.id,
    user_type: state.user.type,
    network: state.network,

    edit_id: state.estData.new_estimate.edit_id,
    customer_state: state.estData.new_estimate.customer_state,
    currency_type: state.estData.new_estimate.currency_type,
    reg_state: state.estData.new_estimate.reg_state,
    estimate_info: state.estData.estimate_info
  };
};



const mapDispatchToProps = dispatch => {
const {actions} = require('@redux/NewEstimateRedux');

return {
  est_two: conData => dispatch(actions.est_two(conData)),
  est_reset: () => dispatch(actions.est_reset()),
};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreditNoteTwoScreen);