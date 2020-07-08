import React, {Component} from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import {scale} from 'react-native-size-matters';

export default class RegistrationHeader extends Component {

 render() {
const {step1,step2,step3} = this.props;

    return (
        <View style={{height:scale(70),backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
      <View style={{flexDirection:"row",
        borderRadius:5,
        height:scale(40),
        width:'90%',
        borderWidth:1,
        justifyContent:'space-around',
        borderColor:'#ddd',
        marginTop:scale(3)
        }}>

<View style={{
backgroundColor:step1?"#1C77BA":"#fff",
width:scale(100),
justifyContent:'center',
alignItems:'center',
borderRadius:scale(5),
margin:scale(2)

}}>

<Text style={{color:step1?"#fff":"#000"
,fontSize:scale(15)
 }}>Step 1</Text>
</View>

<View style={{backgroundColor:step2?"#1C77BA":"#fff",
width:scale(100),
justifyContent:'center',
alignItems:'center',
borderRadius:scale(5),
margin:scale(2)

}}>

<Text style={{color:step2?"#fff":"#000"
,fontSize:scale(15)
 }}>Step 2</Text>
</View>

<View style={{backgroundColor:step3?"#1C77BA":"#fff",
width:scale(100),
justifyContent:'center',
alignItems:'center',
borderRadius:scale(5),
margin:scale(2)

}}>

<Text style={{color:step3?"#fff":"#000"
,fontSize:scale(15)
 }}>Step 3</Text>
</View>
    


        </View>

        </View>
     
    );
  }
}

let styles = StyleSheet.create({

});
