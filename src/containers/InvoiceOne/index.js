import React, { PureComponent } from "react";
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
    TouchableHighlight
} from 'react-native';
import CardView from 'react-native-cardview';
import { connect } from "react-redux";
import { Images, Color,Config } from '@common';
import { scale } from "react-native-size-matters";
import Snackbar from 'react-native-snackbar';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import {NavigationBar} from '@components';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
const msg = Config.SuitCRM;
import {validate_email} from '../../Omni';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { RadioGroup } from 'react-native-btr';
import moment from 'moment';



class InvoiceOneScreen extends PureComponent {


    constructor(props) {
        super(props);
        this.state = {
            loading: false,
         
     

            addSales: 'false',
            name: '',
            email: '',

          

            radioButtons: [
                {
                  label: 'Goods & Service',
                  value: 'Goods & Service',
                  checked: true,
                  color: '#000',
                 
                  flexDirection: 'row',
                  size: scale(5)
         
                },
         
                {
                  label: 'Service',
                  value: 'Service',
                  checked: false,
                  color: '#000',
                 
                  flexDirection: 'row',
                  size: scale(5)
         
                },
         
              
         
              ],

              customer_list:[],
              customer_value:'',
              sales_list:[],
              sales_value:'',
              term_list:[
                { label: 'Net 15', value: 'Net 15' },
                { label: 'Net 30', value: 'Net 30' },
                { label: 'Net 45', value: 'Net 45' },
                { label: 'Net 60', value: 'Net 60' },
                { label: 'Due end of the month', value: 'Due end of the month' },
                { label: 'Due end of next month', value: 'Due end of next month' },
                { label: 'Due on Receipt', value: 'Due on Receipt' },
                { label: 'Custom', value: 'Custom' },
            
               
            ],
              terms_value:'Due on Receipt',

              estimate_no:'',
              reg_state:'',
              max_date:moment(new Date()).format('MM/DD/YYYY'),

              order_no:'',
              project_code:'',

              est_date:moment(new Date()).format('MM/DD/YYYY'),
              due_date:moment(new Date()).format('MM/DD/YYYY'),
              min_due_date:moment(new Date()).format('MM/DD/YYYY'),

              edit_id:''
         
         


        }
     

    }

    componentDidMount() {
        const { network,est_reset,EditId} = this.props;
        this._subscribe = this.props.navigation.addListener('focus', () => {
          est_reset()
        
          if(!network.isConnected){
            Snackbar.show({
              text: msg.noInternet,
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: "red"
            });
          }else{

            if(EditId!="NO-ID"){
           //   alert(EditId)
              this.setState({
                   edit_id:EditId,
                   loading:true},()=>
                   {
                     this.hit_invoiceInfoApi(EditId)
                   })
               }      

              this.setState({loading:true},()=>{
                this.hit_CompanyNameApi(),
                this.hit_SalesPersonApi(),
                this.hit_InvoiceNoApi()
              })
            }
           
        })
       
        }

        hit_invoiceInfoApi(edit_id){
          const {user_id,user_type} = this.props
               ArsolApi.NewInvoiceInfo_api(user_id,user_type,edit_id)
      
          .then(responseJson => {
            console.log('NewInvoiceInfo_api', responseJson);
      
            if (responseJson.ok) {
              this.setState({
                loading: false,
        
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

                              this.props.est_info(responseJson.data.data[0])
                               
                              if(responseJson.data.data[0].template!='Service'){
                                this.state.radioButtons[0].checked=true
                                this.state.radioButtons[1].checked=false
                              }else{
                                this.state.radioButtons[0].checked=false
                                this.state.radioButtons[1].checked=true
                              }
                            
                       

                            

                            this.setState(() => ({
                         
                              customer_value:responseJson.data.data[0].customer_id,
                              estimate_no:responseJson.data.data[0].inv_no,
                              order_no:responseJson.data.data[0].oredr, 
                              est_date:moment(responseJson.data.data[0].inv_date,'DD/MM/YYYY').format('MM/DD/YYYY'),
                              terms_value:responseJson.data.data[0].terms,
                              due_date:moment(responseJson.data.data[0].due_date,'DD/MM/YYYY').format('MM/DD/YYYY'),
                              sales_value:responseJson.data.data[0].sales_person,
                              project_code:responseJson.data.data[0].project_code,
                                 }))       

                                

                           
                             
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

        hit_InvoiceNoApi(){
            const{network,user_id,user_type}=this.props
            if(network.isConnected){
                ArsolApi.InvoiceNo_api(  
                    user_id,
                    user_type,
                 )
        
                .then(responseJson => {
                  console.log('InvoiceNo_api', responseJson);
            
                  if (responseJson.ok) {
                    this.setState({
                      loading: false,
                      });
            
                    if (responseJson.data != null) {
                      if (responseJson.data.hasOwnProperty('status')) {
                      
                          if (responseJson.data.status == 'success') {
                           
                            if(responseJson.data.hasOwnProperty('data')){

                                this.setState ({
                                    estimate_no: responseJson.data.data[0].invoice_no,
                                    reg_state:responseJson.data.data[0].reg_state,
                                    max_date:   moment(responseJson.data.data[0].max_date,'DD/MM/YYYY').format('MM/DD/YYYY'),
                               })
                   

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

        hit_CompanyNameApi(){
            const{network,user_id,user_type}=this.props
            if(network.isConnected){
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
                           
                            if(responseJson.data.hasOwnProperty('data')){
                              if(responseJson.data.data.length>0){
                                this.setState ({
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

        hit_SalesPersonApi(){
            const{network,user_id,user_type}=this.props
            if(network.isConnected){
                ArsolApi.SalesPerson_api(  
                    user_id,
                    user_type,
                 )
        
                .then(responseJson => {
                  console.log('SalesPerson_api', responseJson);
            
                  if (responseJson.ok) {
                    this.setState({
                      loading: false,
                      });
            
                    if (responseJson.data != null) {
                      if (responseJson.data.hasOwnProperty('status')) {
                      
                          if (responseJson.data.status == 'success') {
                           
                            if(responseJson.data.hasOwnProperty('data')){
                             
                              this.setState(({
                                sales_list:responseJson.data.data
                             }))
                              

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

        hit_AddSalesPersonApi(){
            const{network,user_id,user_type}=this.props
            const{name,email}=this.state
            if(network.isConnected){
                this.setState({loading:true})
                ArsolApi.AddSalesPerson_api(  
                    user_id,
                    user_type,
                    name,
                    email
                 )
        
                .then(responseJson => {
                  console.log('AddSalesPerson_api', responseJson);
            
                  if (responseJson.ok) {
                    this.setState({
                      loading: false,
                      });
            
                    if (responseJson.data != null) {
                      if (responseJson.data.hasOwnProperty('status')) {
                      
                          if (responseJson.data.status == 'success') {
                           
                            if(responseJson.data.hasOwnProperty('data')){
                             
                             this.setState({
                                 loading:true,
                                 sales_value:'',
                                 sales_list:[]
                             },()=>{this.hit_SalesPersonApi()})
                              
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
            }else{
                Snackbar.show({
                    text: msg.noInternet,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: "red"
                  });
            }
        }


    nextPress(){
      const{customer_value,sales_value,terms_value,radioButtons,estimate_no,reg_state,order_no,
        project_code,est_date,due_date,customer_list,edit_id}=this.state;
  


        if(customer_value==''){
          Snackbar.show({
            text: 'Select Customer Name',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          })
        }else
        if(terms_value==''){
          Snackbar.show({
            text: 'Select Terms',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: Color.lgreen
          })
        }
        else {
        var currency_type ,customer_state,email,custom_name
          for(var key in customer_list){
            if(customer_value==customer_list[key].value){
              customer_state=customer_list[key].state
              currency_type=customer_list[key].currency
              email=customer_list[key].email
              custom_name=customer_list[key].label
            }
          }
          let selectedItem = radioButtons.find(e => e.checked == true);
          selectedItem = selectedItem ? selectedItem.value : this.state.radioButtons[0].value;
           console.log("selected type",selectedItem)

     let details ={
       edit_id:edit_id,
      template:selectedItem,
      customer_id:customer_value,
      est_no:estimate_no,
      order:order_no,
      est_date:est_date,
      terms:terms_value,
      due_date:due_date,
      sales_person_id:sales_value,
      project_code:project_code,

      customer_state:customer_state,
      currency_type:currency_type,
      reg_state:reg_state,
      email:email,
      custom_name:custom_name


     }



          this.props.est_data(details)
          this.props.navigation.navigate('InvoiceTwo')
        }
    }

  


  


    addNewItem = () => {
        const{name,email}=this.state
        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                visible={this.state.addSales}
                onRequestClose={() => {
                    this.setState({ addSales: false });
                }}>
                <View style={{ flex: 1, }}>



                    <ScrollView style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            alignItems: "center",
                            padding: scale(5),

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

                                <View>
                                    <Text style={{ textAlign: 'center', paddingBottom: scale(20), fontSize: scale(15), fontWeight: 'bold' }}>Manage Sales Persons</Text>
                                </View>


                                <Text style={styles.txt_h}>Name</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        returnKeyType={'next'}
                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={name => this.setState({ name })}
                                        value={name}
                                    />
                                </View>


                                <Text style={styles.txt_h}>Email</Text>
                                <View style={styles.userInput}>

                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        autoCapitalize={'none'}
                                        returnKeyType={'next'}
                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        onChangeText={email => this.setState({ email })}
                                        value={email}
                                        keyboardType='email-address'
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
                                            this.setState({ addSales: false });
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
                                            if(name.trim()==""){
                                                alert("Enter Name")
                                            }else if(email.trim()==""){
                                                alert("Enter Email")
                                            }else if(validate_email(email) === false){
                                                alert("Email Invalid")
                                            }else{
                                                this.setState({ addSales: false },()=>{
                                                    this.hit_AddSalesPersonApi()
                                                });
                                            }
                                          
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

    term_Drop(terms_value){
     
  
      const {due_date,est_date} = this.state
      var start_date= new Date(moment(est_date,'MM/DD/YYYY').format('YYYY-MM-DD[T]HH:mm:ss'));
      var end_date= new Date(moment(due_date,'MM/DD/YYYY').format('YYYY-MM-DD[T]HH:mm:ss'));
      
     
      if(terms_value=="Net 15"){
        start_date = moment(start_date).add(15, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 30"){
        start_date = moment(start_date).add(30, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 45"){
        start_date = moment(start_date).add(45, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 60"){
        start_date = moment(start_date).add(60, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Due end of the month"){
        start_date = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 0);
        start_date = moment(start_date).format('MM/DD/YYYY');
      }else if(terms_value=="Due end of next month"){
        start_date = new Date(start_date.getFullYear(), start_date.getMonth() + 2, 0);
        start_date = moment(start_date).format('MM/DD/YYYY');
      }else if(terms_value=="Due on Receipt"){
        start_date = this.state.est_date
      }if(terms_value=='Custom'){
        
        if(start_date > end_date){
     
          start_date = est_date
        }else{
          
          start_date = due_date
        }
      }

   
      this.setState({terms_value:terms_value,
                     due_date:start_date,
                     min_due_date:est_date
                     })
    }

  

    est_datePress(est_date){
 
      const {due_date,terms_value} = this.state
      var start_date= new Date(moment(est_date,'MM/DD/YYYY').format('YYYY-MM-DD[T]HH:mm:ss'));
      var end_date= new Date(moment(due_date,'MM/DD/YYYY').format('YYYY-MM-DD[T]HH:mm:ss'));
   
      
      if(terms_value=="Net 15"){
        start_date = moment(start_date).add(15, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 30"){
        start_date = moment(start_date).add(30, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 45"){
        start_date = moment(start_date).add(45, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Net 60"){
        start_date = moment(start_date).add(60, 'day').format('MM/DD/YYYY');
      }else if(terms_value=="Due end of the month"){
        start_date = new Date(start_date.getFullYear(), start_date.getMonth() + 1, 0);
        start_date = moment(start_date).format('MM/DD/YYYY');
      }else if(terms_value=="Due end of next month"){
        start_date = new Date(start_date.getFullYear(), start_date.getMonth() + 2, 0);
        start_date = moment(start_date).format('MM/DD/YYYY');
      }else if(terms_value=="Due on Receipt"){
        start_date = this.state.est_date
      }if(terms_value=='Custom'){
        
        if(start_date > end_date){
     
          start_date = est_date
        }else{
          
          start_date = due_date
        }
      }
      
      

           this.setState({
             est_date:est_date,
             due_date:start_date,
             min_due_date:est_date
           })
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
 

    render() {
      
      
      const{customer_list,customer_value,sales_list,sales_value,terms_value,term_list,radioButtons,
          max_date,estimate_no,reg_state,order_no,project_code,est_date,due_date,min_due_date}=this.state;
        return (
          <View style={{ justifyContent: "center", flex: 1,
           }}>


        
  
  
  
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
  
              <View style={{height:scale(40),width:scale(40),backgroundColor:'#ff8f00'}}>
                  <Image source={Images.menu} style={{
                    width: scale(30), height: scale(30),alignSelf:"center",marginTop:scale(5)


                  }} />
             </View>
  
            </TouchableHighlight>
      <View style={{marginLeft:scale(80),marginTop:scale(25),
            width:scale(190),height:scale(40),borderRadius:scale(4), backgroundColor:'#aeea00'}}>
            <Text style={{
              position: "absolute",
              alignSelf: "center",
              fontSize: scale(18),
              color: "black",
              fontWeight: 'bold',
              marginTop:scale(7),
            }}>{this.state.edit_id ? "Edit Invoice" : "New Invoice"}</Text>
  
          </View>
  


     <LogoSpinner loading={this.state.loading} />


             <CardView
                margin={scale(10)}
                style={{backgroundColor:'#eceff1'}}
                width={330}
                padding={20}
                flex={1}
                cardElevation={2}
                cardMaxElevation={2}
                cornerRadius={20}
                marginLeft={15}
                
                >

                 <KeyboardAwareScrollView
                 keyboardShouldPersistTaps="handled"
                > 
            <View>

                <View style={{ margin: scale(15) }}>

                     <View style={{ flexDirection: 'row',alignItems:'center' }}>
                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Type</Text>
                        <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                     </View>
                           <View style={{ marginLeft:scale(-10)}} >
                              <RadioGroup
                                    color='#0277BD'
                                    labelStyle={{ fontSize: scale(12), }}
                                    radioButtons={radioButtons}
                                    onPress={(radioButtons) =>{
                                      console.log(radioButtons)
                                      
                                      this.setState({ radioButtons })} }
                                    style={{ flexDirection:'row',marginLeft:scale(10)}}
                                  />
                    </View>
           

             <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Customer Name</Text>
                             <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                      flexDirection:"row",
                                      alignItems:'center',
                                      justifyContent:"space-evenly"
                                      }}>

                           <View   style={{
                                    width: '70%',
                                   
                                }}>
                        
                                 <RNPickerSelect
                             placeholder={{
                                    label: "Select Customer",
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
                            onValueChange={(customer_value) => this.setState({customer_value})}
                            value={customer_value}
                        />
                         
                           </View>           
                         
                         
                         <View style={{flexDirection:"row"}}>
                         <TouchableOpacity
                                onPress={() => {this.props.navigation.navigate("ContactOne")}}
                            >
                                <Image source={Images.plusblue} style={{ width: scale(25), height: scale(25), marginLeft : scale(5) }} />
                            </TouchableOpacity>


                            {
                      customer_value != '' ?

                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate("ContactOne", { Edit_Id: customer_value })
                          }}
                        >
                          <Image source={Images.edit}
                            style={{ width: scale(25), height: scale(25), marginLeft: scale(5) }} />
                        </TouchableOpacity>

                        : null
                    }

                         </View>

                                          

                        </View>

                      

                    </View>

                    <View style={{ marginTop: scale(5) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Number</Text>
                            <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7),
                                    color:'#000'
                                }}
                                placeholder={'Invoice Number'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="#000"
                                underlineColorAndroid="transparent"
                                value={estimate_no}
                                editable={false}
                            />   
                         
                        

                                          

                        </View>

                     

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Order #</Text>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7)
                                }}
                                placeholder={'Order Number'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"
                                onChangeText={order_no => this.setState({ order_no })}
                                value={order_no}
                                keyboardType='number-pad'
                            />   
                         
                        

                                          

                        </View>
                        

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Invoice Date</Text>
                             <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                        </View>



                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                      alignItems:"center"
                              
                                    
                                      }}>

             <DatePicker
                            style={{ width: scale(305), marginTop: scale(5) }}
                            date={est_date}
                            placeholder="Select Date"
                            mode="date"
                           // format="DD/MM/YYYY"
                           format="MM/DD/YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            minDate={max_date}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right:25
                                
                                },
                                dateInput: {
                                    marginLeft:scale(-120),
                                    height: scale(30),
                                    borderColor:'transparent',
                                   
                                 
                             
                                    

                                },
                                placeholderText: {
                                    color: '#565656'
                                }
                            }}

                            minuteInterval={10}
                            onDateChange={(est_date) => { this.est_datePress(est_date)}}
                            value={est_date}
                        />

                                      </View>

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Terms</Text>
                            <Text style={{ color: 'red', fontSize: scale(12), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                         <RNPickerSelect
                                placeholder={{
                                    label: "Select Terms",
                                    value: "",
                                    color: 'black',
                                    fontSize: scale(12),
                                    fontWeight: 'bold',
                                }}
                                items={term_list}
                                style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                                onValueChange={(terms_value) =>{this.term_Drop(terms_value) }}
                                value={terms_value}
                            />   
                         
                        

                                          

                        </View>

                       


                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Due Date</Text>
                             <Text style={{ color: '#dd2c00',fontWeight: 'bold',fontSize: scale(15), }}>*</Text>
                        </View>

                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                      alignItems:"center"
                              
                                    
          }}>

                   <DatePicker
                            style={{ width: scale(305), marginTop: scale(5) }}
                            date={due_date}
                            placeholder="Select Date"
                            mode="date"
                            format="MM/DD/YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            minDate={min_due_date}
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right:25 
                                
                                },
                                dateInput: {
                                    marginLeft:scale(-120),
                                    
                                    height: scale(30),
                                   
                               },
                                placeholderText: {
                                  color: '#565656'  
                                }
                            }}

                            minuteInterval={10}
                            onDateChange={(due_date) => { this.setState({due_date}) }}
                            value={due_date}
                            disabled={terms_value=="custom"?false:true}
                        />

                                      </View>


                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Sales Person</Text>


                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                      flexDirection:"row",
                                      alignItems:'center',
                                      justifyContent:'space-between'
                                      
                                      }}>

                            <View   style={{
                                    width: '85%',
                                   
                                }}>
                           <RNPickerSelect
                                placeholder={{
                                    label: "Select Sales Person",
                                    value: "",
                                    color: 'black',
                                    fontSize: scale(12),
                                    fontWeight: 'bold',
                                }}
                                style={{
                    inputIOS: styles.inputIOS,
                    inputAndroid: styles.inputAndroid,
                  }}
                                items={sales_list}
                                onValueChange={(sales_value) => this.setState({sales_value})}
                                value={sales_value}
                            /> 
                           </View> 
                         
                    
                         <TouchableOpacity
                                onPress={() => this.setState({ addSales: true })}
                                style={{marginRight:scale(10)}}

                            >
                                <Image source={Images.plusblue} style={{ width: scale(25), height: scale(25), marginLeft: scale(5) }} />
                            </TouchableOpacity>
                
                    
                   

                   
                         

                                          

                        </View>

                

                    </View>

                    <View style={{ marginTop: scale(5) }}>

                        <Text style={{ fontSize: scale(12), fontWeight: 'bold' }}>Project Code</Text>
                        <View style={{borderWidth:1,
                                      height:scale(45),
                                      borderRadius:scale(5),
                                      backgroundColor:"white",
                                      borderColor:"#bdbdbd",
                                      marginTop:scale(3),
                                   
                              
                                    
                                      }}>
                          <TextInput
                                style={{
                                    width: '70%',
                                    fontSize: scale(12),
                                    marginStart:scale(7)
                                }}
                                placeholder={'Project Code'}
                                autoCorrect={false}
                                autoCapitalize={'none'}
                                returnKeyType={'next'}
                                placeholderTextColor="grey"
                                underlineColorAndroid="transparent"
                               onChangeText={project_code => this.setState({ project_code })}
                               value={project_code}
                            />   
                         
                        

                                          

                        </View>
                        

                    </View>

                </View>



                
 
            </View>
            </KeyboardAwareScrollView> 

             </CardView>

                      <View
                            style={{
                                marginTop: scale(30),
                                marginBottom: scale(10),
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                            <TouchableOpacity
                                onPress={() => { this.nextPress() }}
                                style={{
                                    
                                    width: scale(100),
                                    height: scale(40),
                                    borderRadius: scale(10),
                                    backgroundColor: '#ff8f00',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={styles.txt_log}
                                    numberOfLines={1}
                                >Next</Text>
                            </TouchableOpacity>

                        </View>

                        <Text style={{color:'grey',marginBottom:scale(30),
          textAlign:'center'}}> © ARSOL 2020-2021</Text>


                        {this.addNewItem()}

</View>

        );
    }
}




const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: scale(5)
        
    },
    radioText: {
        marginRight: scale(10),
        fontSize: scale(12),
        color: '#5D6D7E',
        fontWeight: 'bold'
    },
    radioCircle: {
        height: scale(15),
        width: scale(15),
        borderRadius: scale(10),
        borderWidth: scale(1),
        borderColor: '#3498DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: scale(15),
        height: scale(15),
        borderRadius: scale(30),
        backgroundColor: '#3498DB',
    },
    txt: { fontSize: scale(15), width: scale(150), },
    txth: { fontSize: scale(15), fontWeight: 'bold' },

    txt_h: {
        fontSize: scale(12),
        color: '#000',
        fontWeight: 'bold',
        width: scale(200),
        textAlign: 'left'
    },

    userInput: {
        height: scale(40),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
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



    userInputTC: {
        height: scale(100),
        backgroundColor: 'white',
        marginBottom: scale(15),
        borderColor: 'grey',
        borderWidth: scale(1),
        width: scale(200),
    },

    inputTC: {
        color: '#000',
        fontSize: scale(12)
    },
    txt_log: {
        fontSize: scale(12),
        color: 'white',
        fontWeight: 'bold',
        width: scale(100),
        textAlign: 'center'
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


InvoiceOneScreen.defaultProps = {
    user_id: '',
    user_type:'',
    network:""
}


const mapStateToProps = (state) => {
    return {

        user_id: state.user.id,
        user_type: state.user.type,
        network: state.network,

    };
};

const mapDispatchToProps = dispatch => {
  const {actions} = require('@redux/NewEstimateRedux');

  return {
    est_data: conData => dispatch(actions.est_data(conData)),
    est_info: conData => dispatch(actions.est_info(conData)),
    est_reset: () => dispatch(actions.est_reset()),
  };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceOneScreen);