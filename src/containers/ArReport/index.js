import React, { PureComponent } from "react";

import {
  View, Dimensions, TouchableHighlight, TouchableWithoutFeedback, Animated,

  Text,Modal,ScrollView,TextInput,
  StyleSheet,FlatList,TouchableOpacity,Alert,RefreshControl,Image,ActivityIndicator
} from 'react-native';
//test
import { connect } from "react-redux";
import {Config, Color,Images} from '@common';
const server = Config.SuitCRM;

import { scale } from "react-native-size-matters";
import { StackActions } from '@react-navigation/native';

const msg = Config.SuitCRM;
import {NavigationBar} from '@components';


import Checkbox from 'react-native-modest-checkbox'
import DatePicker from 'react-native-datepicker';
import ArsolApi from '@services/ArsolApi';
import { LogoSpinner } from '@components';
import Snackbar from 'react-native-snackbar';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import moment from 'moment';
import XLSX from 'xlsx';
import { writeFile,appendFile,
        DownloadDirectoryPath,DocumentDirectoryPath } from 'react-native-fs';
//const DDP = DownloadDirectoryPath + "/";
const DDP = DocumentDirectoryPath + "/";
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import BalanceTabScreen from '../../navigation/BalanceTabScreen';
import SummaryTabScreen from '../../navigation/SummaryTabScreen';
import AgingTabScreen from '../../navigation/AgingTabScreen';
import { TabView, TabBar } from 'react-native-tab-view';


class ArReportScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Balance', },
        { key: 'second', title: 'Summary', },
        { key: 'third', title: 'Aging', },


      ],
    }
  }

  _handleIndexChange = index => this.setState({ index });

  renderScene = ({ route }) => {

    const { navigation } = this.props
    switch (route.key) {
      case 'first':
        return <BalanceTabScreen
          navigation={navigation}
          />;

      case 'second':
        return <SummaryTabScreen
          navigation={navigation}
          />

      case 'third':
        return <AgingTabScreen
          navigation={navigation}
         />


      default:
        return null;
    }
  };
  renderHeader() {
    return (

      <View style={{
        backgroundColor: Color.bgColor,
        justifyContent:"center"
      }}>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={'#ddd'}
          onPress={() =>
            this.props.navigation.toggleDrawer()}
          style={{
            width: scale(35), height: scale(35),
            alignItems: "center",
            justifyContent: 'center',
            backgroundColor: Color.headerTintColor
          }}
        >
          <Image source={Images.menu}
            style={{
              width: scale(20),
              height: scale(20),
            }} />
        </TouchableHighlight>
       
          <Text style={{
            fontSize: scale(18),
            color: '#000',
            position:"absolute",
            alignSelf:"center"

          }}
            numberOfLines={1}
          >AR Report</Text>

       

      </View>
      
    )
  }
  renderLabel = ({ route, focused, color }) => {
    return (
      <View>
        <Text
          style={[focused ? styles.activeTabTextColor : styles.tabTextColor]}
        >
          {route.title}
        </Text>
      </View>
    )
  }
  render() {

    const {navigation} = this.props

    return (
      <View style={styles.container}>
       

        {this.renderHeader()}

       

       
        <TabView
          lazy
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={(props) =>

            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: Color.headerTintColor }}
              style={styles.tabBar2}
              renderLabel={this.renderLabel}
            />
          }
      
        />
      </View>

    );
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  activeTabTextColor: {
    color: Color.headerTintColor,
    fontWeight: "bold",
    fontSize: scale(15),
    textTransform: 'uppercase',
    width: scale(100),
    textAlign: "center"
  },
  tabTextColor: {
    color: 'grey',
    fontSize: scale(15),
    textTransform: 'uppercase',
    width: scale(100),
    textAlign: "center"

  },
  tabView: {
    height: scale(1),
    
  },
  tabBar2: {
    backgroundColor: Color.bgColor,

  }

     
 });








ArReportScreen.defaultProps = {
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
)(ArReportScreen);