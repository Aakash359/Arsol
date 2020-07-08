import React, { PureComponent } from "react";

import {
  View,
  ActivityIndicator,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Image,TouchableOpacity,  RefreshControl,
} from 'react-native';

import { connect } from "react-redux";
import {Images,Config, Color} from '@common';



import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';
//import Snackbar from 'react-native-snackbar';
const msg = Config.SuitCRM;
import PureChart from 'react-native-pure-chart';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';


class MonthlyInvoiceChartScreen extends PureComponent {


  constructor(props) {
    super(props);
    this.state={
    loading:false,
    chart_list:[],
    refresh:false,
     }

 }

 componentDidMount() {
  
  const { network,user_id,user_type} = this.props;
  if(!network.isConnected){
    Snackbar.show({
      text: msg.noInternet,
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: "red"
    });
  }else{
    this.setState({loading:true},()=>{
      this.hit_chartApi(user_id,user_type)
    })

  }
}



onRefresh() {

  const { network,user_id,user_type} = this.props;
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
        chart_list:[]

      },
      () => {
        this.hit_chartApi(user_id,user_type)
      },
    );
  }

}



hit_chartApi(id,type){
  ArsolApi.MonthlyChart_post_api(id,type)

  .then(responseJson => {
    console.log('MonthlyChart_post_api', responseJson);

    if (responseJson.ok) {
      this.setState({
        loading: false,
        refresh:false
      });

      if (responseJson.data != null) {
        if (responseJson.data.hasOwnProperty('status')) {
        
            if (responseJson.data.status == 'success') {
            if (responseJson.data.hasOwnProperty('message')) {
         
     

                 if(responseJson.data.hasOwnProperty("data")){
                     if(responseJson.data.data.length>0){
                       this.setState({
                  
                        chart_list:[{
                            seriesName: 'test', 
                            data:  responseJson.data.data,
                            color: '#65BC7A'
                          }]
                       })
                       Snackbar.show({
                        text: responseJson.data.message,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: Color.lgreen
                      });
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

  render() {


  

  
 
return (
  <ScrollView style={{ 
    backgroundColor:'#fff'
    }}
    contentContainerStyle={{justifyContent:'center',alignItems:'center',flexGrow:1}}
    contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.refresh}
          />
        }
  >

  

<LogoSpinner loading={this.state.loading} />

{this.state.chart_list.length>0?

  <View style={{paddingHorizontal:scale(15)}}>
     <PureChart 
       data={this.state.chart_list} type='bar'
        style={{height:scale(300)}}
        height={scale(500)}
        defaultColumnWidth={scale(50)} 
        defaultColumnMargin={40}
        numberOfYAxisGuideLine={20}
        backgroundColor="#fff"
        width={'100%'}
        xAxisColor={'black'}
        yAxisColor={'black'}
            xAxisGridLineColor={'back'}
            yAxisGridLineColor={'grey'}
            minValue={0}
            labelColor={'#000'}
            showEvenNumberXaxisLabel={false}
          
       />
     </View>:
    
      <View style={{justifyContent:'center',alignItems:"center"}}>
                  <View style={{  
        width: scale(80), height: scale(80),
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: scale(80) / 2,
        borderWidth: 2,
        borderColor: '#AED581'}}>

                    <Image source={Images.logo} style={{   resizeMode: 'contain',
        width: scale(50),
        height: scale(50),}} />
                  </View>

                  <Text style={{    fontSize: scale(15),
        width: scale(150),
        textAlign: 'center',
        marginTop: scale(5)}}>No Record Found</Text>
                </View>
           
          }
   
     </ScrollView>


    );
  }
}







MonthlyInvoiceChartScreen.defaultProps = {
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
)(MonthlyInvoiceChartScreen);