import {create} from 'apisauce';
import {Config} from '@common';
const server = Config.SuitCRM;
var baseURL= server.arsolurl
var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
//var pass_val = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;
var phone_val = /^\d{10}$/;
var pan_val = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

var gst_val = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}?$/;
var ifsc_val = /[A-Z|a-z]{4}[0][a-zA-Z0-9]{6}$/;
var invoice_val = /^\d{3}$/;

var zip_val = /^\d{6}$/;
var pass_val = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export const zip_no = no => {
  var valid = zip_val.test(no);
  if (!valid) return false;
  return true;
};

export const invoice_no = no => {
  var valid = invoice_val.test(no);
  if (!valid) return false;
  return true;
};

export const ifsc_no = no => {
  var valid = ifsc_val.test(no);
  if (!valid) return false;
  return true;
};

export const gest_no = no => {
  var valid = gst_val.test(no);
  if (!valid) return false;
  return true;
};

export const pan_no = no => {
  var valid = pan_val.test(no);
  if (!valid) return false;
  return true;
};

export const phone_no = phone => {
  var valid = phone_val.test(phone);
  if (!valid) return false;
  return true;
};

export const validate_pass = pass => {
  var valid = pass_val.test(pass);
  if (!valid) return false;
  return true;
};

export const validate_email = email => {
  if (!email) return false;

  if (email.length > 254) return false;

  var valid = tester.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split('@');
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split('.');
  if (
    domainParts.some(function(part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
};

// define the api
const api = create({
  baseURL: baseURL,
  headers: {
    Accept: 'multipart/form-data',
  },
});

//1
export let login_post = ( body) =>
  api.post('/LoginUser/UserLogin', body).then(response => response);
//2
export let dashboard_post = ( body) =>
  api.post('/LoginUser/DashBoard', body).then(response => response);
//3
export let ItemDetails_post = ( body) =>
  api.post('/LoginUser/ItemDetails', body).then(response => response);
//4
export let CustomerDetails_post = ( body) =>
  api.post('/Customer/CustomerDetails', body).then(response => response);
//5
export let UserDetails_post = ( body) =>
  api.post('/User/UserDetails', body).then(response => response);
//6
export let UserRole_post = ( body) =>
  api.post('/User/UserRole', body).then(response => response);
//7
export let GstList_post = ( body) =>
  api.post('/Customer/GstList', body).then(response => response);
//8
export let UnitList_post = ( body) =>
  api.post('/Customer/UnitList', body).then(response => response);
//9
export let UpdateRole_post = ( body) =>
  api.post('/User/UpdateRole', body).then(response => response);
//10
export let MonthlyChart_post = ( body) =>
  api.post('/User/MonthlyChart', body).then(response => response);
//11
export let AddItem_post = ( body) =>
  api.post('/Customer/AddItem', body).then(response => response);
//12
export let EstimateDetails_post = ( body) =>
  api.post('/LoginUser/EstimateDetails', body).then(response => response);
//13
export let InvoiceDetails_post = ( body) =>
  api.post('/LoginUser/InvoiceDetails', body).then(response => response);
//14
export let InvoiceReports_post = ( body) =>
  api.post('/LoginUser/InvoiceReports', body).then(response => response);
//15
export let Currency_get = () =>
  api.get('/Customer/CurrencyList').then(response => response);
//16
export let Constitution_get = () =>
  api.get('/Customer/ConstitutionList').then(response => response);
//17
export let Country_get = () =>
  api.get('/Customer/CountryList').then(response => response);

// export let Subscription_get = () =>
//   api.get('/Customer/SubscriptionList').then(response => response);
//18
export let Subscription_post = ( body) =>
  api.post('/Customer/SubscriptionList', body).then(response => response);
//19
export let CreditNoteDetails_post = ( body) =>
  api.post('/LoginUser/CreditNoteDetails', body).then(response => response);
//20
export let CustomerPaymentList_post = ( body) =>
  api
    .post('/Customer/CustomerPaymentList', body)
    .then(response => response);
//21
export let Registration_post = ( body) =>
  api.post('/User/Registration', body).then(response => response);
//22
export let BankDetails_post = ( body) =>
  api.post('/Customer/BankDetails', body).then(response => response);
//23
export let StateDetails_post = ( body) =>
  api.post('/Customer/StateDetails', body).then(response => response);
//24
export let Customer_Ledger_post = ( body) =>
  api.post('/Customer/Customer_Ledger', body).then(response => response);
//25
export let LanguageList_get = () =>
  api.get('/Customer/LanguageList').then(response => response);
//26
export let checkTransactionStatus_post = ( body) =>
  api.post('/User/checkTransactionStatus', body).then(response => response);
//27
export let Newcustomer_post = ( body) =>
  api.post('/Customer/Newcustomer ', body).then(response => response);
//28
export let ForgotPassword_post = ( body) =>
  api.post('/LoginUser/ForgotPassword', body).then(response => response);
//29
export let ChangePassword_post = ( body) =>
  api.post('/LoginUser/ChangePassword', body).then(response => response);
//30
export let NewEstimate_post = ( body) =>
  api.post('/Customer/NewEstimate', body).then(response => response);
//31
export let CompanyName_post = ( body) =>
  api.post('/Customer/CompanyName', body).then(response => response);
//32
export let EstimateNo_post = ( body) =>
  api.post('/Customer/EstimateNo', body).then(response => response);
//33
export let InvoiceNo_post = ( body) =>
  api.post('/Customer/InvoiceNo', body).then(response => response);  

  
//34
export let AddSalesPerson_post = ( body) =>
  api.post('/Customer/AddSalesPerson', body).then(response => response);
//35
export let SalesPerson_post = ( body) =>
  api.post('/Customer/SalesPerson', body).then(response => response);
//36
export let SelectItem_post = ( body) =>
  api.post('/Customer/SelectItem', body).then(response => response);
//37
  export let AddBank_post = ( body) =>
  api.post('/Customer/AddBank', body).then(response => response);
//38
  export let NewEstimateInfo_post = ( body) =>
  api.post('/Customer/NewEstimateInfo', body).then(response => response);
//39
  export let NewInvoiceInfo_post = ( body) =>
  api.post('/Customer/NewInvoiceInfo', body).then(response => response);
//40
  export let CompanyInfo_post = ( body) =>
  api.post('/User/CompanyInfo', body).then(response => response);
//41
  export let CustomerInfo_post = ( body) =>
  api.post('/Customer/CustomerInfo', body).then(response => response);
//42
  export let RegistrationUpdate_post = ( body) =>
  api.post('/User/RegistrationUpdate', body).then(response => response);
//43
  export let NewInvoice_post = ( body) =>
  api.post('/Customer/NewInvoice', body).then(response => response);
//44
  export let CreditNo_post = ( body) =>
  api.post('/Customer/CreditNo', body).then(response => response);
//45
  export let CreditInvoiceNo_post = ( body) =>
  api.post('/Customer/CreditInvoiceNo', body).then(response => response);
//46
  export let CreditNoteInvoiceInfo_post = ( body) =>
  api.post('/Customer/CreditNoteInvoiceInfo', body).then(response => response);

//47  
  export let NewCreditNote_post = ( body) =>
  api.post('/Customer/NewCreditNote', body).then(response => response);
//48  
  export let CancelCreditNote_post = ( body) =>
  api.post('/Customer/CancelCreditNote', body).then(response => response);
//49
  export let ARReports_post = ( body) =>
  api.post('/LoginUser/ARReports', body).then(response => response);
//50  
  export let GstReports_post = ( body) =>
  api.post('/LoginUser/GstReports', body).then(response => response);
//51
  export let BankNameList_post = (body) => 
  api.post('/Customer/BankNamelist', body).then(response => response)
//52
  export let CustomerPayment_post = (body) =>
  api.post('/Customer/CustomerPayment', body).then(response => response)
//53
  export let ReceivePayment_post = (body) =>
  api.post('/Customer/ReceivePayment', body).then(response => response)
//54
export let CustomerPaymentInfo_post = (body) =>
   api.post('/Customer/CustomerPaymentInfo', body).then(response => response)
 //55
export let ManageSubscription_post = (body) =>
api.post('/Customer/ManageSubscription', body).then(response => response) 
 //56
export let AddUser_post = ( body) =>
   api.post('User/SaveUser', body).then(response => response);
  //57
  export let Reprint_post = ( body) =>
   api.post('Customer/RePrintPdfInvoice', body).then(response => response);