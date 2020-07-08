import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    Animated,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { Images } from '@common';


export default class Panel extends Component {

    constructor(props) {
        super(props);

        this.icons = {
    
            up: Images.uparrow,
            down: Images.downarow,
        };

        this.state = {
            
            item_type: props.item_type,
            item_quant: props.item_quant,
            item_desc: props.item_desc,
            expanded: props.expanded,
            animationValue: new Animated.Value(scale(90)),
        };
    }

    toggle() {

        if (this.state.expanded == true) {
         
            Animated.spring(
            
                this.state.animationValue,
                {
                    toValue: scale(280),
                },
            ).start(this.setState({ expanded: false }));
        } else {
          
            Animated.spring(

                this.state.animationValue,
                {
                    toValue: scale(90),
                },
            ).start(this.setState({ expanded: true }));
        }
    }


    render() {
        let icon = this.icons['up'];

        if (this.state.expanded) {
            icon = this.icons['down']; 
        }
        const { item_type, item_quant, item_desc } = this.state;
    
        return (
            <Animated.View
                style={{ height: this.state.animationValue, overflow: 'hidden' }}>
                <View style={{ padding: scale(7) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '80%' }}>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{fontSize: scale(15), fontWeight: 'bold'}}
                                    numberOfLines={1}
                                >Item Type: </Text>
                                 <Text style={{
                                     color : '#5D6D7E',
                                    fontSize: scale(15),
                                }}
                                numberOfLines={1}>
                                {item_type}
                            </Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{fontSize: scale(15), fontWeight: 'bold'}}
                                    numberOfLines={1}
                                >Item Quantity: </Text>
                              <Text
                                style={{
                                    color : '#5D6D7E',
                                    fontSize: scale(15),
                                }}
                                numberOfLines={1}>
                                {item_quant}
                            </Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{fontSize: scale(15), fontWeight: 'bold'}}
                                    numberOfLines={1}
                                >Item Description: </Text>
                                 <Text style={{
                                     color : '#5D6D7E',
                                    fontSize: scale(15),
                                }}
                                numberOfLines={1}>
                                {item_desc}
                            </Text>
                            </View>
                           
                        </View>

                        <TouchableHighlight
                            onPress={this.toggle.bind(this)}
                            underlayColor="#f1f1f1">
                            <Image style={styles.buttonImage} source={icon}></Image>
                        </TouchableHighlight>

                    </View>
                </View>

                <View style={{ padding: scale(7) }}>{this.props.children}</View>
            </Animated.View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },

    title: {
        color: '#2a2f43',
        fontWeight: 'bold',
    },
    button: {
        //  backgroundColor:"red"
    },
    buttonImage: {
        width: scale(20),
        height: scale(20),
    },
});
