import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';


import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import RegistrationOneScreen from './RegistrationOneScreen';
import RegistrationTwoScreen from './RegistrationTwoScreen';
import RegistrationThreeScreen from './RegistrationThreeScreen';
import HomeScreen from './HomeScreen';
import ItemDetailsScreen from './ItemDetailsScreen';
import CustomerDetailsScreen from './CustomerDetailsScreen';
import UserDetailsScreen from './UserDetailsScreen';
import UserRolesScreen from './UserRolesScreen';
import CustomerScreen from './CustomerScreen';
import InvoiceListScreen from './InvoiceListScreen';
import EstimateListScreen from './EstimateListScreen';
import CreditNoteListScreen from './CreditNoteListScreen';
import MonthlyInvoiceChartScreen from './MonthlyInvoiceChartScreen';
import CustomerPaymentListScreen from './CustomerPaymentListScreen';
import InvoiceReportScreen from './InvoiceReportScreen';
import InvoiceReportDetailScreen from './InvoiceReportDetailScreen';
import ArReportScreen from './ArReportScreen';
import GstReportScreen from './GstReportScreen';
import CustomerLedgerScreen from './CustomerLedgerScreen';

import EstimateOneScreen from './EstimateOneScreen';
import EstimateTwoScreen from './EstimateTwoScreen';
import EstimateThreeScreen from './EstimateThreeScreen';

import ContactOneScreen from './ContactOneScreen';
import ContactTwoScreen from './ContactTwoScreen';
import ContactThreeScreen from './ContactThreeScreen';

import InvoiceOneScreen from './InvoiceOneScreen';
import InvoiceTwoScreen from './InvoiceTwoScreen';
import InvoiceThreeScreen from './InvoiceThreeScreen';



import CreditNoteOneScreen from './CreditNoteOneScreen';
import CreditNoteTwoScreen from './CreditNoteTwoScreen';
import CreditNoteThreeScreen from './CreditNoteThreeScreen';

//navigation Drawer
import SideMenuScreen from './SideMenuScreen';

import CustomerPayOneScreen from './CustomerPayOneScreen';
import CustomerPayTwoScreen from './CustomerPayTwoScreen';
import CustomerPayThreeScreen from './CustomerPayThreeScreen';

import BankDetailsScreen from './BankDetailsScreen';
import ManageSubscriptionScreen from './ManageSubscriptionScreen';
import EditCompanyScreen from './EditCompanyScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import PayTMScreen from './PayTMScreen';

const Stack = createStackNavigator();
const ConnectStack = createStackNavigator();
const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();
const Drawer = createDrawerNavigator();


function LoginStackScreen() {
  return (
    <LoginStack.Navigator initialRouteName="Login" headerMode="none">
      <LoginStack.Screen name="Login" component={LoginScreen} />
      <LoginStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <LoginStack.Screen name="RegistrationOne" component={RegistrationOneScreen} />
      <LoginStack.Screen name="RegistrationTwo" component={RegistrationTwoScreen} />
      <LoginStack.Screen name="RegistrationThree" component={RegistrationThreeScreen} />
      <LoginStack.Screen name="PayTM" component={PayTMScreen} />
      <LoginStack.Screen name="Main" component={MyDrawerScreen} />
    </LoginStack.Navigator>
  );
}
 
function MainStackScreen() {
  return (
    <MainStack.Navigator initialRouteName="Dashboard" headerMode="none">
      <MainStack.Screen name="Auth" component={LoginStackScreen} />
      <MainStack.Screen name="Dashboard" component={HomeScreen} />
      <MainStack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      <MainStack.Screen name="CustomerDetails" component={CustomerDetailsScreen} />
      <MainStack.Screen name="UserDetails" component={UserDetailsScreen} />
      <MainStack.Screen name="UserRoles" component={UserRolesScreen} />
      <MainStack.Screen name="Customer" component={CustomerScreen} />
      <MainStack.Screen name="InvoiceList" component={InvoiceListScreen} />
      <MainStack.Screen name="EstimateList" component={EstimateListScreen} />
      <MainStack.Screen name="CreditNoteList" component={CreditNoteListScreen} />
      <MainStack.Screen name="MonthlyInvoiceChart" component={MonthlyInvoiceChartScreen} />
      <MainStack.Screen name="CustomerPaymentList" component={CustomerPaymentListScreen} />
      <MainStack.Screen name="InvoiceReport" component={InvoiceReportScreen} /> 
      <MainStack.Screen name = "InvoiceReportDetail" component = {InvoiceReportDetailScreen}/>
      <MainStack.Screen name="ArReport" component={ArReportScreen} />
      <MainStack.Screen name="GstReport" component={GstReportScreen} />
      <MainStack.Screen name="CustomerLedger" component={CustomerLedgerScreen} />
      
      <MainStack.Screen name = "EstimateOne" component = {EstimateOneScreen}/>
      <MainStack.Screen name = "EstimateTwo" component = {EstimateTwoScreen}/>
      <MainStack.Screen name = "EstimateThree" component = {EstimateThreeScreen}/>

      <MainStack.Screen name = "ContactOne" component = {ContactOneScreen}/>
      <MainStack.Screen name = "ContactTwo" component = {ContactTwoScreen}/>
      <MainStack.Screen name = "ContactThree" component = {ContactThreeScreen}/>

      <MainStack.Screen name = "InvoiceOne" component = {InvoiceOneScreen}/>
      <MainStack.Screen name = "InvoiceTwo" component = {InvoiceTwoScreen}/>
      <MainStack.Screen name = "InvoiceThree" component = {InvoiceThreeScreen}/>


      <MainStack.Screen name = "CreditNoteOne" component = {CreditNoteOneScreen}/>
      <MainStack.Screen name = "CreditNoteTwo" component = {CreditNoteTwoScreen}/>
      <MainStack.Screen name = "CreditNoteThree" component = {CreditNoteThreeScreen}/>

      <MainStack.Screen name = "CustomerPayOne" component = {CustomerPayOneScreen}/>
      <MainStack.Screen name = "CustomerPayTwo" component = {CustomerPayTwoScreen}/>
      <MainStack.Screen name = "CustomerPayThree" component = {CustomerPayThreeScreen}/>

      <MainStack.Screen name = "BankDetails" component = {BankDetailsScreen}/>
      <MainStack.Screen name = "ManageSubscription" component = {ManageSubscriptionScreen}/>
      <MainStack.Screen name = "ChangePassword" component = {ChangePasswordScreen}/>
      <MainStack.Screen name = "EditCompany" component = {EditCompanyScreen}/>
  
    </MainStack.Navigator>
  );
}

function MyDrawerScreen() {
  return (
    <Drawer.Navigator
      initialRouteName="Root"
      drawerContent={props => <SideMenuScreen {...props} />}>
      <Drawer.Screen
        name="Root"
        component={MainStackScreen}
        options={{gestureEnabled: true}}
      />
    </Drawer.Navigator>
  );
}

// gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

export default () => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={state => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);

        if (previousRouteName !== currentRouteName) {
          console.log(
            'previousRouteName',
            previousRouteName,
            'currentRouteName',
            currentRouteName,
          );
          global.previousRouteName = previousRouteName;
          global.currentRouteName = currentRouteName;
          // The line below uses the @react-native-firebase/analytics tracker
          // Change this line to use another Mobile analytics SDK
          //    analytics().setCurrentScreen(currentRouteName, currentRouteName);
        }

        // Save the current route name for later comparision
        routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator initialRouteName="Loading" headerMode="none">
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Auth" component={LoginStackScreen} />
        <Stack.Screen name="Main" component={MyDrawerScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
