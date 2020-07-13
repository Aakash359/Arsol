import React, { PureComponent } from "react";

import {
  View,
  ActivityIndicator,
  Keyboard,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image, TouchableOpacity, RefreshControl, Modal, TextInput,
  Dimensions, TouchableHighlight
} from 'react-native';

import { NavigationBar } from '@components';
import { connect } from "react-redux";
import { Images, Config, Color } from '@common';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import { scale, s } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
const msg = Config.SuitCRM;
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';
import RNPrint from 'react-native-print';


class InvoiceReportDetailScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state={
      loading:false,
      refresh:false,
      load_more: false,
      onEndReachedCalledDuringMomentum: true,
      page:0,
      show_list:[],
      filter:false,
      display_name:'',
      invoice_number:'',
      ch_all:true,
      ch_invoice:false,
      ch_invoice_no:false,
      ch_display_name:false,
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),

    }
  }


  async printHTML(html_content) {
    await RNPrint.print({
      html: html_content
    })
  }

 componentDidMount() {
  const { network} = this.props;


  if(!network.isConnected){
    Snackbar.show({
      text: msg.noInternet,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "red"
    });
  }else{
    this.setState({
      loading: true, refresh: false,
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
      end_date: moment(new Date()).format('DD/MM/YYYY'),},()=>{
   
      this.hit_invoicereportsApi()
   
    })}
  }

  componentDidUpdate(prevProps) {
    if (this.props.network.isConnected != prevProps.network.isConnected) {
      if (this.props.network.isConnected) {
        if (this.props.navigation.isFocused()) {
          this.setState({
            loading: true, refresh: false,
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
          }, () => {

            this.hit_invoicereportsApi()

          })
        }
      }
    }
  }

  renderTableHeader() {
  
    var header =["Invoice Date",
    "Invoice Number",
    "Customer Name",
    "Customer GSTIN",
    "Taxable Value",
    "IGST",
    "CGST",
    "SGST",
    "Total Invoice Value (INR)"
           ]
    
    return header.map((key, index) => {
       return (`<th>${key}</th>`)

    })
 }

  renderTableData() {
  return this.state.show_list.map((student, index) => {
     const { in_date, in_no, in_dis_name, in_gst,in_taxable ,
      in_igst,in_cgst,in_sgst,total_amount} = student //destructuring

  
     return (
       `<tr key=${index}>
           <td>${in_date}</td>
           <td>${in_no}</td>
           <td>${in_dis_name}</td>
           <td>${in_gst}</td>
           <td>${in_taxable}</td>
           <td>${in_igst}</td>
           <td>${in_cgst}</td>
           <td>${in_sgst}</td>
           <td>${total_amount}</td>
        </tr>`
     )
  })
}


   footer
  renderFooter = () => {
    if (!this.state.load_more) return <View style={{ marginBottom: scale(100), }}></View>;
     return (
      <View style={{marginTop: scale(10),}}>
        <ActivityIndicator size="large" color="#ddd" />
      </View>
    );
  };

   //refresh
   onRefresh() {
    const {network} = this.props
    if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else{
      this.setState(
        {
          refresh: true,
          load_more:false,
          page: 0,
          show_list: [],
        },
        () => {
          this.hit_invoicereportsApi();
        },
      );
    }
   
  }
 


   hit_invoicereportsApi(){
    const {user_id,user_type} = this.props
    const {page,start_date,end_date,invoice_number,display_name} = this.state
    var filter_type = this.filter_fun()
    ArsolApi.InvoiceReports_api(user_id,user_type,
      filter_type,
      start_date,
      end_date,
      invoice_number,
      display_name,
      page
      )

    .then(responseJson => {
      console.log('InvoiceReports_api', responseJson);

      if (responseJson.ok) {
        this.setState({
          loading: false,
          refresh:false
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

                 if(responseJson.data.hasOwnProperty("data")){
                       if(responseJson.data.data.length>0){
                         this.setState({
                          show_list:[...this.state.show_list, ...responseJson.data.data],
                          load_more:responseJson.data.load_more
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
            refresh:false
          });
        } else if (responseJson.problem == 'TIMEOUT_ERROR') {
          Snackbar.show({
            text: msg.serTimErr,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          });
          this.setState({
            loading: false,
            refresh:false
          });
        } else {
          Snackbar.show({
            text: msg.servErr,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: "red"
          });
          this.setState({
            loading: false,
            refresh:false
          });
        }
      }
    })
    .catch(error => {
      console.error(error);
      this.setState({
        loading: false,
        refresh:false
      });
    });
  }

  filter_fun(){
  
    const {ch_all,ch_invoice,ch_invoice_no,ch_display_name} = this.state

     if(ch_all){
       return 0
     }else if(ch_invoice){
       return 1
     }else if(ch_invoice_no){
       return 2
     }else if(ch_display_name){
       return 3
     }else{
       return 0
     }
}

 _checkbox_fun(val){
   if(val.label=="All"){
     this.setState({
      ch_all:true,
      ch_invoice:false,
      ch_invoice_no:false,
      ch_display_name:false,
      display_name:'',
      invoice_number:'',
      start_date:moment(new Date()).format('DD/MM/YYYY'),
      end_date:moment(new Date()).format('DD/MM/YYYY'),
     })
   }else if(val.label=="Invoice Date"){
    this.setState({
      ch_all:false,
      ch_invoice:true,
      ch_invoice_no:false,
      ch_display_name:false,
      display_name:'',
      invoice_number:'',

     })}
     else if(val.label=="Invoice Number"){
      this.setState({
        ch_all:false,
        ch_invoice:false,
        ch_invoice_no:true,
        ch_display_name:false,
        display_name:'',
   
        start_date:moment(new Date()).format('DD/MM/YYYY'),
        end_date:moment(new Date()).format('DD/MM/YYYY'),
       })}
       else if(val.label=="Customer Name"){
        this.setState({
          ch_all:false,
          ch_invoice:false,
          ch_invoice_no:false,
          ch_display_name:true,
        
          invoice_number:'',
          start_date:moment(new Date()).format('DD/MM/YYYY'),
          end_date:moment(new Date()).format('DD/MM/YYYY'),
         })
    }
 }

 _filterRender(){
   const {ch_display_name,ch_invoice,ch_invoice_no,ch_all} = this.state;
  return(
    <Modal
    transparent={true}
    animationType={'slide'}
    visible={this.state.filter}
    onRequestClose={() => {
      this.setState({filter: false});
    }}>
   <View style={{flex:1}}>

 
      
   <ScrollView style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
     contentContainerStyle={{flexGrow : 1,
      justifyContent : 'center',
      alignItems: "center",
      padding:scale(5)}}
      enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
     >


    <View>


      <View style={{
                backgroundColor: 'white',
              borderRadius: scale(5),
              width:scale(250),
               
      }}>
  <View style={{height:scale(40),
  justifyContent:'center',alignItems:'center'}}>
  <Text style={{fontSize:scale(15),color:"#00B5FF",fontWeight:'500'}}
  numberOfLines={1}
  >Filter Search Result</Text>
  </View>
       
 <View style={{height:scale(2),backgroundColor:"#00B5FF",}}/>

 <View style={{padding:scale(5)}}>
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
  ch_invoice?
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
          onDateChange={(date) => {this.setState({start_date: date})}}
        
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
          onDateChange={(date) => {this.setState({end_date: date})}}
        
        />
</View>
:null
}


 <Checkbox
          label='Invoice Number'
          checked={ch_invoice_no}
          onChange={(checked) => this._checkbox_fun(checked)}
          labelStyle={{ fontSize: scale(15), }}
          checkboxStyle={{ width: scale(30), height: scale(30) }}
        />
         {
          ch_invoice_no?
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
</View>   :null
        }
      
 <Checkbox
          label='Customer Name'
          checked={ch_display_name}
          onChange={(checked) => this._checkbox_fun(checked)}
          labelStyle={{ fontSize: scale(15), }}
          checkboxStyle={{ width: scale(30), height: scale(30) }}
        
        /> 
        {ch_display_name?
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
</View>  :null
        }
 </View>


                 


<TouchableOpacity
onPress={()=>{this.setState({filter:false},()=>{
  this.onRefresh()
})}}
>
<View style={{backgroundColor:"#00B5FF",height:scale(40),alignItems:"center",
justifyContent:'center',
borderRadius: scale(4),

}}>
    <Text style={{fontSize:scale(18),color:"#fff",fontWeight:'bold'}}
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

 _onMomentumScrollBegin = () => this.setState({
    onEndReachedCalledDuringMomentum: false});
  //loadmore
  handleLoadMore = () => {
    const {load_more, page} = this.state;
    const {network} = this.props;

    if(!network.isConnected){
      Snackbar.show({
        text: msg.noInternet,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red"
      });
    }else if (!this.state.onEndReachedCalledDuringMomentum) {
      if (load_more) {
        this.setState(
          {
            page: page + 10,
            onEndReachedCalledDuringMomentum: true,
          },
          () => {
            this.hit_invoicereportsApi();
          },
        );
      }
    }
  };

 GetItem(id){
    alert(id)
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
          }}>Invoice Report Detail</Text>

         
        </View>

      </View>

    )
  }

 
    render() {
    const { in_dis_name}= this.state;

    // console.log(rowData)
    
    return (  
       <View style={{
  flex: 1,
    backgroundColor: "#fff"
     
     }} 
     >
    {this.renderHeader()}
       <ScrollView 
     style={{flex:1, margin: scale(15)}}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={

        <RefreshControl
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refresh}
        />
      }
      onEndReachedThreshold={1}
      onMomentumScrollBegin={() => this._onMomentumScrollBegin()}
      onMomentumScrollEnd={this.handleLoadMore.bind(this)} 
       > 

                 <View style={{ marginTop: scale(5) }}>

                 <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Customer Name</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                           
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Number</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                           
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>


                    <View style={{ marginTop: scale(5) }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Date</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>



                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                      alignItems:"center"
                              
                                    
                                      }}>

               <DatePicker
                            style={{ width: scale(305), marginTop: scale(5) }}
                            // date={est_date}
                            placeholder="Select Date"
                            mode="date"
                           // format="DD/MM/YYYY"
                           format="MM/DD/YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            // minDate={max_date}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right:0  
                                
                                },
                                dateInput: {
                                    //marginLeft: scale(36),
                                    height: scale(30),
                                    borderColor:'transparent',
                                   
                                 
                             
                                    

                                },
                                placeholderText: {
                                    color: '#565656'
                                }
                            }}

                            minuteInterval={10}
                            // onDateChange={(est_date) => { this.est_datePress(est_date)}}
                            // value={est_date}
                        />

                                      </View>

                    </View>

                    <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Customer GSTIN</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Taxable Value</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                      
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>IGST</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>


                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>CGST</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>
                
                <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>SGST</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>



             <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Total Invoice Value</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      borderColor:"#0070c6",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                               
                                editable={false}
                            />   
                         
                        

                                          

                        </View>
</View>


         {this.renderFooter()}
         </ScrollView>

         
      </View>  
    );  
  }  
}  


InvoiceReportDetailScreen.defaultProps = {
  user_id: '',
  user_type:''
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
)(InvoiceReportDetailScreen);