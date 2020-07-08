import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ListView,
    StatusBar,
    TextInput,
    Image,
    Text
} from 'react-native';


import { scale } from 'react-native-size-matters';

import {  Images } from '@common';





export default class ValidateTextInput extends Component {

    static propTypes = {
      
        autoFocus: PropTypes.bool,
       
        placeholder: PropTypes.string,
        returnKeyType:PropTypes.string,
        
        
       
        onChange: PropTypes.func,
        valueInput: PropTypes.string,
      
        onSubmitEditing:PropTypes.func,
        onChangeTextInput:PropTypes.func

       
    }

    static defaultProps = {
        autoFocus: false,
       
    }

    constructor(props) {
        super(props)
        this.state = {
            errorText: "",
            valueInput: "",
            focus: this.props.autoFocus,
            icEye: Images.eyeclose,
            isPassword: true
        }
    }

  

   

    componentDidMount() {

    }

    onFocus() {
        this.setState({
            focus: true
        })
    }

    onBlur() {
        this.setState({
            focus: false
        })
    }

    getRef = (ref) => {
        if (this.props.getRef)
            this.props.getRef(ref)
    }

    changePwdType = () => {
        const { isPassword } = this.state;
        // set new state value
        this.setState({
            icEye: isPassword ? Images.eye : Images.eyeclose,
            isPassword: !isPassword,
        });

    };

    render() {
        const { icEye, isPassword } = this.state;
        return (
            
                <View
                    style={{
                        borderColor:
                            this.state.focus ?
                                "#53ADEC"
                                :
                                '#ccc',
                        backgroundColor: this.state.focus ?
                            "#E7F0FF"
                            :
                            '#fff',        
                        height: scale(45),
                        width: '95%',
                        borderWidth: this.state.focus ?
                          scale(1)
                            :
                            scale(.5),
                        flexDirection:'row',
                        alignItems:"center" ,
                        justifyContent:'space-between',
                        padding:scale(5),
                        borderRadius:(8),
                        marginTop:scale(5),
                        marginBottom:scale(10) 
                    }}
                >
                   

                    <TextInput
                        ref={this.getRef}
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={isPassword}
                        value={this.props.valueInput}
                        underlineColorAndroid='transparent'
                        autoFocus={this.props.autoFocus}
                        returnKeyType={this.props.returnKeyType}
                        onBlur={() => this.onBlur()}
                        onFocus={() => this.onFocus()}
                     
                        placeholder={this.props.placeholder}
                        onSubmitEditing={this.props.onSubmitEditing}
                        placeholderTextColor='gray'
                        style={{
                            color: '#000',
                            height: scale(40),
                            fontSize: scale(14),
                            width: '80%',
                            backgroundColor: 'transparent',
                        }} 
                        onChange={this.props.onChange}
                        onChangeText={(text) => {
                           this.props.onChangeTextInput(text)
                        }} 
                     
                    />

                   <TouchableOpacity
                    onPress={this.changePwdType}>
                       <Image
                           source={icEye}
                           style={{height:scale(25),width:scale(25)}}
                       />
                   </TouchableOpacity>

                   
                   
                </View>

                
         
        )
    }
}

const styles = StyleSheet.create({
  
})

