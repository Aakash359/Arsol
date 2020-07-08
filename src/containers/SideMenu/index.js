import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,TouchableHighlight,
  Image,
  Alert,
  StyleSheet,Modal,ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Images, Config, Color } from '@common';
import { scale } from 'react-native-size-matters';
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';


class SideMenuScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      create_vb:false,
      list_vb:false,
      reports:false,
      option_status:false
    };

   
  }

  create(){
    const {create_vb} = this.state

    if(create_vb){
      this.setState({create_vb:false,list_vb:false,
        reports:false})
    }else{
      this.setState({create_vb:true,list_vb:false,
        reports:false})
    }
  }

  list(){
    const {list_vb} = this.state

    if(list_vb){
      this.setState({create_vb:false,list_vb:false,
        reports:false})
    }else{
      this.setState({create_vb:false,list_vb:true,
        reports:false})
    }
  }

  reports_fun(){
    const {reports} = this.state

    if(reports){
      this.setState({create_vb:false,list_vb:false,
        reports:false})
    }else{
      this.setState({create_vb:false,list_vb:false,
        reports:true})
    }
  }

  //option
  _OptionRender(){
    return (
      <Modal
      transparent={true}
      animationType={'slide'}
      visible={this.state.option_status}
      onRequestClose={() => {
        this.setState({option_status: false});
      }}>
        <View style={{ flex: 1, 
                       backgroundColor: 'rgba(0,0,0,0.5)',
                      alignItems:'center',
                      justifyContent:'center'
                       }}>

        <View style={{
       
        width: '80%',
        height:'34%',
        borderTopEndRadius:scale(90),
        borderBottomStartRadius:scale(90),
        borderWidth:scale(1),
        borderColor:'#ddd',
     
            padding:scale(10),
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 9,
            },
            shadowOpacity: 0.48,
            shadowRadius: 11.95,

            elevation: 20,
            
            backgroundColor: "#fff",
       }}>
       <View style={{flexDirection:'row',
       justifyContent:"space-between",
       
       width:'90%'}}>
              <Text style={{
                fontSize: scale(18),
                fontWeight: "bold",
                marginLeft: scale(10),
                textAlignVertical:'center'

              }}>Option</Text>

              <TouchableHighlight
                activeOpacity={1}
                underlayColor={'#ddd'}
                onPress={() => { this.setState({ option_status: false })}}
                style={{
                  width: scale(40), height: scale(40),



                  alignItems: "center",
                  justifyContent: 'center',
                  borderRadius: scale(20)
                }}
              >

                <Image source={Images.close} style={{
                  width: scale(20), height: scale(20),


                }} />

              </TouchableHighlight>
       </View>


         <TouchableOpacity
              style={{
                padding: scale(5),
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderTopEndRadius: scale(15),
                borderBottomStartRadius: scale(15),
            
                backgroundColor: "#fff",
                width:scale(150),
                alignItems:"center",
                justifyContent:"center",
                marginTop:scale(10),
                marginLeft:scale(5)
                }}
              onPress={() => {
                this.setState({ option_status: false }, () => {
                  this.props.navigation.navigate('EditCompany')
                })
              }}
         >
           <Text style={{fontSize:scale(12)}}>Edit Company Details</Text>
         </TouchableOpacity> 

            <TouchableOpacity
              style={{
                padding: scale(5),
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderTopEndRadius: scale(15),
                borderBottomStartRadius: scale(15),
             //   borderRadius: scale(15),
                backgroundColor: "#fff",
                width: scale(150),
                alignItems: "center",
                justifyContent: "center",
                marginTop:scale(10),
                marginLeft:scale(30)
              }}
              onPress={() => {
                this.setState({ option_status: false }, () => {
                  this.props.navigation.navigate('ChangePassword')
                })
              }}
            >
              <Text style={{ fontSize: scale(12) }}>Change Password</Text>
            </TouchableOpacity>  

            <TouchableOpacity
              style={{
                padding: scale(5),
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderTopEndRadius: scale(15),
                borderBottomStartRadius: scale(15),
               // borderRadius: scale(15),
                backgroundColor: "#fff",
                width: scale(150),
                alignItems: "center",
                justifyContent: "center",
                marginTop: scale(10),
                marginLeft: scale(60)
              }}
              onPress={() => {
                this.setState({ option_status: false }, () => {
                  this.props.navigation.navigate('BankDetails')
                })
              }}
            >
              <Text style={{ fontSize: scale(12) }}>Bank Details</Text>
            </TouchableOpacity>  

            <TouchableOpacity
              style={{
                padding: scale(5),
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 9,
                },
                shadowOpacity: 0.48,
                shadowRadius: 11.95,

                elevation: 20,
                borderTopEndRadius: scale(15),
                borderBottomStartRadius: scale(15),
                backgroundColor: "#fff",
                width: scale(150),
                alignItems: "center",
                justifyContent: "center",
                marginTop: scale(10),
                marginLeft: scale(100)
              }}
              onPress={() => {
                this.setState({ option_status: false }, () => {
                  this.props.navigation.navigate('ManageSubscription')
                })
              }}
            >
              <Text style={{ fontSize: scale(12) }}>Manage Subscription</Text>
            </TouchableOpacity>      

         




        </View>
        </View>
    
    </Modal>
    )
  }



  render() {
 

   const {create_vb,list_vb,reports} = this.state;
    return (
      <ScrollView

      >
      <View >

        {this._OptionRender()}


        <View style={{
          height: scale(120),
          alignItems:"center",
          marginBottom:scale(15),
          backgroundColor: "white",
         
           }}>

         <View style={{marginTop: scale(15),}}>
          <Text style={{
               color: "#000",
              fontSize: scale(12),

            }}>ABC</Text>
          </View>
           <TouchableOpacity style={{
            marginTop:scale(5),
            width: scale(110), 
            height: scale(33),
            borderRadius: scale(20),
            borderWidth: scale(2),
            borderColor: '#ff6f00',
            flexDirection: "row",
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf:"center"
          }}
            underlayColor={'grey'}
            onPress={() => { this.setState({ option_status: true }) }}
          >


            <Image source={Images.options}
              style={{ height: scale(18), width: scale(18) }}
              resizeMode={'contain'}
            />

            <Text style={{
              fontSize: scale(12),
              color: "#6A6C6F",
              width: scale(50),
              textAlign: "center"
            }}
              numberOfLines={1}
            >Option</Text>


          </TouchableOpacity>

      
         

       <View style={{
            width: scale(90),
            height: scale(120),
            position: "absolute",
            bottom: -90,
            alignItems:"center"
       }}>

            <Image
              source={{ uri: this.props.user_image }}
              style={{
                width: scale(90),
                height: scale(90), 

                borderRadius: scale(10)
              }}

            >
            </Image>

            

          
       </View>                
         


          </View>
       <View style={{marginTop:scale(70)}}>
          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate('Dashboard') }}
           
          >
          
          <LinearGradient style={styles.linearGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
        
        <View style={styles.CircleView}>
          <View style={styles.CircleStyle}/>
          
             <Image style={styles.pic}
              source={Images.meter}
            />
            <Text style={styles.txt}
              numberOfLines={1}
            >DASHBOARD </Text>

            </View>

              </LinearGradient>

       </TouchableOpacity>

       <TouchableOpacity
            onPress={() => { this.props.navigation.navigate('ItemDetails') }}
          >

                  <LinearGradient style={styles.linearGradient}
              start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >

             <View style={styles.CircleView}>
        <View style={styles.CircleStyle}/>
          
              
                <Image style={styles.pic}
                  source={Images.transport}
                />
                <Text style={styles.txt}
                  numberOfLines={1}
                >ITEM DETAILS </Text>

                </View>

                  </LinearGradient>

        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => { this.props.navigation.navigate('CustomerDetails') }}
          >


                  <LinearGradient style={styles.linearGradient}
              start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
            
             <View style={styles.CircleView}>
          <View style={styles.CircleStyle}/>
          
              
                <Image style={styles.pic}
                  source={Images.care}
                />
                <Text style={styles.txt}
                  numberOfLines={1}
                >CUSTOMER DETAILS</Text>

                </View>

                  </LinearGradient>

         </TouchableOpacity>

             <TouchableOpacity
            onPress={() => { this.create() }}
          >
               <LinearGradient style={styles.linearGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
        
        <View style={styles.CircleView}>
        <View style={styles.CircleStyle}/>
          
          
             <Image style={styles.pic}
              source={Images.create}
            />

                  <View style={{flexDirection:"row" , }}>
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >CREATE </Text>

                  </View>

                  <Image source={
                      create_vb ? Images.downarrow :
                        Images.whitearrow
                    }
                     style={styles.ArrowStyle}
                      resizeMode={'contain'}
                    />
                    </View>

              </LinearGradient>
        </TouchableOpacity>

        {
            create_vb ?
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderBottomWidth: 1,


                  }}
                  onPress={() => { this.props.navigation.navigate('EstimateOne') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Estimate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('InvoiceOne') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('CreditNoteOne') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Credit Note</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('CustomerPayOne') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Customer Payment</Text>
                </TouchableOpacity>

              </View> : null

          }

          <TouchableOpacity
            onPress={() => { this.list() }}
          >

               <LinearGradient style={styles.linearGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
        
        <View style={styles.CircleView}>
          <View style={styles.CircleStyle}/>
          
          
             <Image style={styles.pic}
              source={Images.line}
            />
            <View style={{flexDirection:"row" , }}>
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >LIST </Text>

                  </View>

                  <Image source={
                           list_vb ? Images.downarrow :
                           Images.whitearrow
                          }
                             style={{ marginLeft:scale(135),marginTop:scale(14),height: scale(15), width: scale(20), marginEnd: scale(10) }}
                            resizeMode={'contain'}
                          />
            </View>

              </LinearGradient>


          </TouchableOpacity>


          {
            list_vb ?
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('EstimateList') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Estimate List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",

                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('InvoiceList') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Invoice List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",

                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('CreditNoteList') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Credit Note List</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",

                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('CustomerPaymentList') }}

                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Customer Payment List</Text>
                </TouchableOpacity>

              </View> : null

          }

         <TouchableOpacity
            onPress={() => { this.reports_fun() }}
          >
               <LinearGradient style={styles.linearGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
        
       <View style={styles.CircleView}>
         <View style={styles.CircleStyle}/>
          
          
             <Image style={styles.pic}
              source={Images.user}
            />
            <View style={{flexDirection:"row" , }}>
            <Text style={styles.txt}
              numberOfLines={1}
            >REPORTS </Text>

            </View>

            <Image source={
                            reports ? Images.downarrow :
                              Images.whitearrow
                          }
                            style={styles.ArrowStyle}
                            resizeMode={'contain'}
                          />
            </View>


              </LinearGradient>
     </TouchableOpacity>


          {
            reports ?
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",
                    borderTopWidth: 1,
                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('InvoiceReport') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Invoice Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",

                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('ArReport') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    AR Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#EAEAEA",

                    borderBottomWidth: 1
                  }}
                  onPress={() => { this.props.navigation.navigate('GstReport') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    GST Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ backgroundColor: "#fff" }}
                  onPress={() => { this.props.navigation.navigate('CustomerLedger') }}
                >
                  <Text style={styles.sub_txt}
                    numberOfLines={1}
                  >
                    Customer Ledger</Text>
                </TouchableOpacity>

              </View> : null

          }

       <TouchableOpacity
          onPress={() => { this.props.navigation.navigate('UserDetails') }}
           >
                      <LinearGradient style={styles.linearGradient}
                start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
              
              <View style={styles.CircleView}>
         <View style={styles.CircleStyle}/>
          
                
                    <Image style={styles.pic}
                    source={Images.user}
                  />
                  <Text style={styles.txt}
                    numberOfLines={1}
                  >USER DETAILS </Text>

                  </View>

                    </LinearGradient>

         </TouchableOpacity>

         <TouchableOpacity
          onPress={() => { this.props.navigation.navigate('UserRoles') }}
           >

                <LinearGradient style={styles.linearGradient}
            start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
          
          <View style={styles.CircleView}>
          <View style={styles.CircleStyle}/>
          
            
              <Image style={styles.pic}
                source={Images.role}
              />
              <Text style={styles.txt}
                numberOfLines={1}
              >USER ROLES </Text>

              </View>

                </LinearGradient>

        </TouchableOpacity>

         <TouchableOpacity onPress={() => { 
              
              Alert.alert(
                "Logout",
                "Are you sure want?",
                [
                  {
                    text: "No, please!",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes, Logout!", onPress: () => {
                    this.props.navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          { name: 'Auth' },
                        ],
                      })
                    )
                  }}
                ],
                { cancelable: false }
              );


             }}>
              <LinearGradient style={styles.linearGradient}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#ffa726', '#ff8f00', '#ff6f00']} >
        
         <View style={styles.CircleView}>
         <View style={styles.CircleStyle}/>
          
          
             <Image style={styles.pic}
              source={Images.logout}
            />
            <Text style={styles.txt}
              numberOfLines={1}
            >LOGOUT </Text>

            </View>

              </LinearGradient>

               </TouchableOpacity>
              
         </View>
         </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  CircleView:{
    marginLeft:scale(-9),
    marginTop:scale(-3),
    flexDirection:"row"
    
  },
  CircleStyle:{
    height:scale(40),
    width:scale(40),
    backgroundColor:"#aeea00",
    borderRadius:scale(22),

  },
  ArrowStyle:{
    marginLeft:scale(115),
    marginTop: scale(13),  
    height: scale(15), 
    width: scale(15),

  },
  linearGradient: {
    marginLeft:scale(25),
    borderRadius: 5,
    marginTop:scale(20),
    width:scale(240),
    height:scale(35),
   },
   pic:{
    height: scale(25),
    width: scale(25),
    marginLeft:scale(-32),
    marginTop:scale(8)
   },
  txt:{
  textAlign:"center",
  marginTop:scale(9),
  fontSize:scale(15),
  marginLeft:scale(10),
  fontWeight:'bold',
  color:"white",

  },

 sub_txt:{height:scale(30),
  fontSize:scale(12),
 
  color:"grey",
  textAlignVertical:"center",
  marginLeft:scale(30)},
 
  btnoption:{backgroundColor:"#ddd",padding:scale(5),borderRadius:scale(5),margin:scale(5)} ,

  txtstyle:{fontSize:scale(15),width:scale(200)}

})



const mapStateToProps = (state) => {
  return {

    user_id: state.user.id,
    user_type: state.user.type,
    user_name: state.user.Name,
    user_image:state.user.image,
    network: state.network

  };
};


export default connect(mapStateToProps, undefined, null)(SideMenuScreen);