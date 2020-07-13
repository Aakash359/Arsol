import React, { PureComponent } from "react";

import {
  View,
  ActivityIndicator,
  Text,
  Button
} from 'react-native';

import { connect } from "react-redux";
import {Config, Color} from '@common';
const server = Config.SuitCRM;

import { scale } from "react-native-size-matters";
import { CommonActions, StackActions, DrawerActions } from '@react-navigation/native';
//import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
//import SplashScreen from 'react-native-splash-screen'
import { LogoSpinner } from '@components'; 

class LoadingScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
    loading:false
     }

 }

  componentDidMount () {
   // SplashScreen.hide();
 
    const{user_id,network,navigation} = this.props

       if(user_id==""){
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Auth' },
            ],
          })
        )
       }else{
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Main' },
            ],
          })
        )
       }
   
  
        
       }


  

       


  


  



  render() {


 
return (
     <View style={{justifyContent:"center",alignItems:'center',flex:1,
     }}>
   
      <Text style={{color:"#000",fontSize:scale(20),width:scale(250),textAlign:"center"}}
      numberOfLines={2}
      >Welcome Arsol</Text>
   <LogoSpinner loading={this.state.loading} />


     </View>
    );
  }
}







LoadingScreen.defaultProps = {
user_id:''
 }


  const mapStateToProps = (state) => {
    return {
  
  
      user_id: state.user.id,
      network: state.network,
 
  
    };
  };


export default connect(
  mapStateToProps,
  null
)(LoadingScreen);