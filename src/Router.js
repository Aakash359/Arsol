/**
 * Created by InspireUI on 19/02/2017.
 *
 * @format
 */

import React from "react";
import { View,Text, StatusBar, SafeAreaView } from "react-native";
import Navigation from "@navigation";
import { connect } from "react-redux";
import {Color,Config} from '@common';
import { scale } from "react-native-size-matters";



class Router extends React.PureComponent {
  
  constructor(props) {
    super(props);
   }

 componentDidMount(){
   
}

 

  render() {
    
    return (
      <>
     <StatusBar 
     backgroundColor={Color.headerTintColor} 
     barStyle='light-content'
    
      />
      <SafeAreaView 
      style={{ backgroundColor: Color.headerTintColor,
               flex:1}}>
        <View style={{height:scale(5),
        backgroundColor:Color.bgColor}}/>       
        <Navigation/>
          <Text style={{
            
            backgroundColor: Color.bgColor,
            fontSize:scale(10),
            width:'100%',
            color:'#fff',
            paddingLeft:scale(10)
         
          }}
          numberOfLines={1}
          
           > {'\u00A9'} ARSOL, 2020-2021</Text> 
     </SafeAreaView>
    </>
       );
    }
  }

  const mapStateToProps = state => {
    return {
     // session_id: state.user.session_id,
     // network: state.network,
    };
  };

export default connect(mapStateToProps)(Router);
