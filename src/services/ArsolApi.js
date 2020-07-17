import {
  login_post,
  dashboard_post,
  ItemDetails_post,
  CustomerDetails_post,
  UserDetails_post,
  UserRole_post,
  GstList_post,
  UnitList_post,
  UpdateRole_post,
  MonthlyChart_post,
  AddItem_post,
  EstimateDetails_post,
  InvoiceDetails_post,
  Currency_get,
  Constitution_get,
  Country_get,
  Subscription_post,
  CreditNoteDetails_post,
  CustomerPaymentList_post,
  InvoiceReports_post,
  Registration_post,
  BankDetails_post,
  StateDetails_post,
  Customer_Ledger_post,
  LanguageList_get,
  checkTransactionStatus_post,
  Newcustomer_post,
  ForgotPassword_post,
  ChangePassword_post,
  NewEstimate_post,
  CompanyName_post,
  EstimateNo_post,
  InvoiceNo_post,
  NewInvoice_post,
  AddSalesPerson_post,
  SalesPerson_post,
  SelectItem_post,
  AddBank_post,
  NewEstimateInfo_post,
  CompanyInfo_post,
  CustomerInfo_post,
  RegistrationUpdate_post,
  NewInvoiceInfo_post,
  CreditInvoiceNo_post,
  CreditNo_post,
  CreditNoteInvoiceInfo_post,
  NewCreditNote_post,
  CancelCreditNote_post,
  ARReports_post,
  GstReports_post,
  BankNameList_post,
  CustomerPayment_post,
  ReceivePayment_post,
  CustomerPaymentInfo_post,
  ManageSubscription_post,
  AddUser_post,
  Reprint_post,
  SubscriptionPlanPayment_post
} from './../Omni';


const ArsolApi = {
  login_api: async (email, pass) => {
    let body = new FormData();
    body.append('username', email);
    body.append('password', pass);

    return await login_post(body);
  },

  dashboard_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await dashboard_post(body);
  },

  ItemDetails_api: async (id, type, page) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('page', page);
    return await ItemDetails_post(body);
  },
  CustomerDetails_api: async (id, type, page) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('page', page);
    return await CustomerDetails_post(body);
  },
  UserDetails_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await UserDetails_post(body);
  },
  UserRole_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await UserRole_post(body);
  },
  GstList_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await GstList_post(body);
  },
  UnitList_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await UnitList_post(body);
  },
  UpdateRole_api: async (
    user_id,
    user_type,
    edit_id,
    roles_data
  ) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('id', edit_id);
    body.append('roll_list', JSON.stringify(roles_data));


    return await UpdateRole_post(body);
  },
  MonthlyChart_post_api: async (id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);

    return await MonthlyChart_post(body);
  },

  AddItem_post_api: async (
    id,
    type,
    item_type,
    name,
    unit,
    rate,
    hsn_sac_code,
    gst,
    desc,
    edit_id,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('item_type', item_type);
    body.append('name', name);
    body.append('unit', unit);
    body.append('rate', rate);
    body.append('hsn_sac_code', hsn_sac_code);
    body.append('gst', gst);
    body.append('desc', desc);
    body.append('edit_id', edit_id);
    return await AddItem_post(body);
  },
  EstimateDetails_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    invoice_number,
    display_name,
    page,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('invoice_number', invoice_number);
    body.append('display_name', display_name);
    body.append('page', page);

    return await EstimateDetails_post(body);
  },
  InvoiceDetails_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    invoice_number,
    display_name,
    page,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('invoice_number', invoice_number);
    body.append('display_name', display_name);
    body.append('page', page);

    return await InvoiceDetails_post(body);
  },

  CreditNoteDetails_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    invoice_number,
    display_name,
    page,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('invoice_number', invoice_number);
    body.append('display_name', display_name);
    body.append('page', page);

    return await CreditNoteDetails_post(body);
  },

  CustomerPaymentList_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    display_name,
    page,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('display_name', display_name);
    body.append('page', page);

    return await CustomerPaymentList_post(body);
  },

  InvoiceReports_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    invoice_number,
    display_name,
    page,
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('invoice_number', invoice_number);
    body.append('display_name', display_name);
    body.append('page', page);

    return await InvoiceReports_post(body);
  },

  Currency_api: async () => {
    return await Currency_get();
  },

  Constitution_api: async () => {
    return await Constitution_get();
  },

  Country_api: async () => {
    return await Country_get();
  },

  Subscription_api: async (email) => {
    let body = new FormData();
  
    body.append('email', email);

    return await Subscription_post(body);
  },

  Registration_api: async (
    fname,
    lname,
    email,
    pan_no,
    gst_no,
    org_name,
    org_tag_name,
    currency,
    constitution,
    bank_name,
    ac_name,
    ac_number,
    ifsc_code,
    reg_no,
    primary_contact_no,
    secondary_contact_no,
    country,
    address,
    street,
    state,
    city,
    zipcode,
    subscription_plan,
    term_con,
    time_zone,
    company_code,
    initial_invoice_no,
    image_data,
    image_name,
  ) => {
    var form = new FormData();
    form.append('fname', fname);
    form.append('lname', lname);
    form.append('email', email);
    form.append('pan_no', pan_no);
    form.append('gst_no', gst_no);
    form.append('org_name', org_name);
    form.append('org_tag_name', org_tag_name);
    form.append('currency', currency);
    form.append('constitution', constitution);
    form.append('bank_name', bank_name);
    form.append('ac_name', ac_name);
    form.append('ac_number', ac_number);
    form.append('ifsc_code', ifsc_code);
    form.append('reg_no', reg_no);
    form.append('primary_contact_no', primary_contact_no);
    form.append('secondary_contact_no', secondary_contact_no);
    form.append('country', country);
    form.append('address', address);
    form.append('street', street);
    form.append('state', state);
    form.append('city', city);
    form.append('zipcode', zipcode);
    form.append('subscription_plan', subscription_plan);
    form.append('term_con', term_con);
    form.append('time_zone', time_zone);
    form.append('company_code', company_code);
    form.append('initial_invoice_no', initial_invoice_no);
    form.append('image_data', image_data);
    form.append('image_name', image_name);

    console.log('form', JSON.stringify(form));

    return await Registration_post(form);
  },

  BankDetails_api: async (id, type, page) => {
    var form = new FormData();
    form.append('user_id', id);
    form.append('user_type', type);
    form.append('page', page);

    return await BankDetails_post(form);
  },
  StateDetails_api: async country => {
    var form = new FormData();
    form.append('country', country);

    return await StateDetails_post(form);
  },

  Customer_Ledger_post_api: async (
    id,
    type,
    cust_id,
    start_date,
    end_date,
  ) => {
    var form = new FormData();
    form.append('user_id', id);
    form.append('user_type', type);
    form.append('cust_id', cust_id);
    form.append('start_date', start_date);
    form.append('end_date', end_date);

    return await Customer_Ledger_post(form);
  },
  LanguageList_api: async () => {
    return await LanguageList_get();
  },
  checkTransactionStatus_api: async (orderid, custid) => {
    let body = new FormData();
    body.append('orderid', orderid);
    body.append('custid', custid);
    return await checkTransactionStatus_post(body);
  },
  Newcustomer_api: async (user_id, user_type, edit_id, done, dtwo, remark) => {
    const {
      primary_contact,
      fname,
      lname,
      company_name,
      display_name,
      contact_email,
      gst_no,
      phone,
      mobile,
      website,
      currency,
      pay_term,
      language,
      facebook,
      twitter,
    } = done;

    const {
      country,
      address,
      city,
      state_bill,
      zipcode,
      phone_add,
      fax,
      sp_country,
      sp_address,
      sp_city,
      sp_state,
      sp_zipcode,
      sp_phone_add,
      sp_fax,
    } = dtwo;

    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('edit_id', edit_id);

    body.append('primary_contact', primary_contact);
    body.append('fname', fname);
    body.append('lname', lname);
    body.append('company_name', company_name);
    body.append('display_name', display_name);
    body.append('contact_email', contact_email);
    body.append('gst_no', gst_no);
    body.append('phone', phone);
    body.append('mobile', mobile);
    body.append('website', website);
    body.append('currency', currency);
    body.append('pay_term', pay_term);
    body.append('language', language);
    body.append('facebook', facebook);
    body.append('twitter', twitter);
    body.append('country', country);
    body.append('address', address);
    body.append('city', city);
    body.append('state', state_bill);
    body.append('zipcode', zipcode);
    body.append('phone_add', phone_add);
    body.append('fax', fax);
    body.append('sp_country', sp_country);
    body.append('sp_address', sp_address);
    body.append('sp_city', sp_city);
    body.append('sp_state', sp_state);
    body.append('sp_zipcode', sp_zipcode);
    body.append('sp_phone_add', sp_phone_add);
    body.append('sp_fax', sp_fax);
    body.append('remark', remark);

    return await Newcustomer_post(body);
  },
  ForgotPassword_api: async email => {
    let body = new FormData();
    body.append('email', email);

    return await ForgotPassword_post(body);
  },
  ChangePassword_api: async (
    user_id,
    user_type,
    old_password,
    new_password,
  ) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('new_password', new_password);
    body.append('old_password', old_password);
    return await ChangePassword_post(body);
  },

  NewEstimate_api: async (
    user_id,
    user_type,
    new_estimate,
    estimate_two,
    customer_name,
    tc,
    email,
    sendEmail,
    sub,
    body,
  ) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('edit_id', new_estimate.edit_id);

    form_data.append('template', new_estimate.template);
    form_data.append('customer_id', new_estimate.customer_id);
    form_data.append('est_no', new_estimate.est_no);

    form_data.append('order', new_estimate.order);
    form_data.append('est_date', new_estimate.est_date);
    form_data.append('terms', new_estimate.terms);
    form_data.append('due_date', new_estimate.due_date);
    form_data.append('sales_person_id', new_estimate.sales_person_id);
    form_data.append('project_code', new_estimate.project_code);

    form_data.append('item_list', estimate_two.item_list);
    form_data.append('sub_total', estimate_two.sub_total);
    form_data.append('sgst_amount', estimate_two.sgst);
    form_data.append('sgst_percentage', estimate_two.sgst_percentage);
    form_data.append('cgst_amount', estimate_two.cgst);
    form_data.append('cgst_percentage', estimate_two.cgst_percentage);
    form_data.append('extr_charge', estimate_two.extr_charge);
    form_data.append('igst_amount', estimate_two.igst);
    form_data.append('igst_percentage', estimate_two.igst_percentage);
    form_data.append('total', estimate_two.total);
    form_data.append('currency', estimate_two.currency);

    form_data.append('customer_notes', customer_name);
    form_data.append('term_conditions', tc);
    form_data.append('email', email);
    form_data.append('sub', sub);
    form_data.append('body', body);
    form_data.append('email_check', sendEmail == true ? '1' : '0');

    return await NewEstimate_post(form_data);
  },

  CompanyName_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await CompanyName_post(form_data);
  },

  EstimateNo_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await EstimateNo_post(form_data);
  },

  AddSalesPerson_api: async (user_id, user_type, name, email) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('name', name);
    form_data.append('email', email);

    return await AddSalesPerson_post(form_data);
  },
  CreditInvoiceNo_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await CreditInvoiceNo_post(form_data);
  },

  SalesPerson_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await SalesPerson_post(form_data);
  },

  SelectItem_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await SelectItem_post(form_data);
  },

  AddBank_api: async (
    user_id,
    user_type,
    bank_name,
    account_name,
    account_no,
    ifsc_code,
    edit_id,
  ) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('bank_name', bank_name);
    form_data.append('account_name', account_name);
    form_data.append('account_no', account_no);
    form_data.append('ifsc_code', ifsc_code);
    form_data.append('edit_id', edit_id);

    return await AddBank_post(form_data);
  },

  NewEstimateInfo_api: async (user_id, user_type, estimate_id) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('estimate_id', estimate_id);

    return await NewEstimateInfo_post(form_data);
  },

  NewInvoiceInfo_api: async (user_id, user_type, invoice_id) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('invoice_id', invoice_id);

    return await NewInvoiceInfo_post(form_data);
  },

  CompanyInfo_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    return await CompanyInfo_post(form_data);
  },

  CustomerInfo_api: async (user_id, user_type, contact_id) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('contact_id', contact_id);

    return await CustomerInfo_post(form_data);
  },
  RegistrationUpdate_api: async (
    user_id,
    user_type,
    gst_no,
    org_tag,
    currency_value,
    constitution_value,
    pan_card,
    regst_no,
    primary_no,
    secondary_no,
    country_value,
    address,
    street,
    state_value,
    city,
    zipcode,
    termsandcon,
    image_path,
    image_name,
  ) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    form_data.append('gst_no', gst_no);
    form_data.append('pan_no', pan_card);
    form_data.append('currency', currency_value);
    form_data.append('constitution', constitution_value);
    form_data.append('reg_no', regst_no);
    form_data.append('primary_contact_no', primary_no);
    form_data.append('secondary_contact_no', secondary_no);
    form_data.append('country', country_value);
    form_data.append('address', address);
    form_data.append('street', street);
    form_data.append('state', state_value);
    form_data.append('city', city);
    form_data.append('zipcode', zipcode);
    form_data.append('term_con', termsandcon);
    form_data.append('org_tag_name', org_tag);
    form_data.append(
      'image_data',
      image_name == 'Default image' ? '' : image_path,
    );
    form_data.append(
      'image_name',
      image_name == 'Default image' ? '' : image_name,
    );

 

    return await RegistrationUpdate_post(form_data);
  },
  InvoiceNo_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await InvoiceNo_post(form_data);
  },

  NewInvoice_api: async (
    user_id,
    user_type,
    new_estimate,
    estimate_two,
    customer_name,
    tc,
    email,
    sendEmail,
    sub,
    body,
  ) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('edit_id', new_estimate.edit_id);

    form_data.append('template', new_estimate.template);
    form_data.append('customer_id', new_estimate.customer_id);
    form_data.append('inv_no', new_estimate.est_no);

    form_data.append('order', new_estimate.order);
    form_data.append('inv_date', new_estimate.est_date);
    form_data.append('terms', new_estimate.terms);
    form_data.append('due_date', new_estimate.due_date);
    form_data.append('sales_person_id', new_estimate.sales_person_id);
    form_data.append('project_code', new_estimate.project_code);

    form_data.append('item_list', estimate_two.item_list);
    form_data.append('sub_total', estimate_two.sub_total);
    form_data.append('sgst_amount', estimate_two.sgst);
    form_data.append('sgst_percentage', estimate_two.sgst_percentage);
    form_data.append('cgst_amount', estimate_two.cgst);
    form_data.append('cgst_percentage', estimate_two.cgst_percentage);
    form_data.append('extr_charge', estimate_two.extr_charge);
    form_data.append('igst_amount', estimate_two.igst);
    form_data.append('igst_percentage', estimate_two.igst_percentage);
    form_data.append('total', estimate_two.total);
    form_data.append('currency', estimate_two.currency);

    form_data.append('customer_notes', customer_name);
    form_data.append('term_conditions', tc);
    form_data.append('email', email);
    form_data.append('sub', sub);
    form_data.append('body', body);
    form_data.append('email_check', sendEmail == true ? '1' : '0');

    return await NewInvoice_post(form_data);
  },

  CreditNo_api: async (user_id, user_type) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);

    return await CreditNo_post(form_data);
  },
  CreditNoteInvoiceInfo_api: async (user_id, user_type,invoice_id,edit_id) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('invoice_id', invoice_id);
    form_data.append('edit_id',edit_id);

    return await CreditNoteInvoiceInfo_post(form_data);
  },

  NewCreditNote_api: async (
    user_id,
    user_type,
    new_estimate,
    estimate_two,
    customer_name,
    tc,
   ) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('edit_id', new_estimate.edit_id);

  
    form_data.append('inv_no', new_estimate.edit_id!=''?'':new_estimate.inv_no);
    form_data.append('credit_no', new_estimate.credit_no);
    
    form_data.append('order', new_estimate.order);
    form_data.append('credit_date', new_estimate.credit_date);
    form_data.append('sales_person', new_estimate.sales_person);

    form_data.append('item_list', estimate_two.item_list);
    form_data.append('sub_total', estimate_two.sub_total);
    form_data.append('sgst_amount', estimate_two.sgst);
    form_data.append('sgst_percentage', estimate_two.sgst_percentage);
    form_data.append('cgst_amount', estimate_two.cgst);
    form_data.append('cgst_percentage', estimate_two.cgst_percentage);
    form_data.append('extr_charge', estimate_two.extr_charge);
    form_data.append('igst_amount', estimate_two.igst);
    form_data.append('igst_percentage', estimate_two.igst_percentage);
    form_data.append('total', estimate_two.total);
  

    form_data.append('customer_notes', customer_name);
    form_data.append('term_conditions', tc);

       console.log('formdata',form_data)
    return await NewCreditNote_post(form_data);
  },

  CancelCreditNote_api: async (user_id, user_type,cn_id) => {
    let form_data = new FormData();
    form_data.append('user_id', user_id);
    form_data.append('user_type', user_type);
    form_data.append('cn_id', cn_id);

    return await CancelCreditNote_post(form_data);
  },
  ARReports_api: async (
    id,
    type,
    customer_type,
    filter_type,
    start_date,
    end_date,
    display_name,
    as_on,
    page,
  
 
  ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('customer_type', 'customer_'+customer_type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('display_name', display_name);
    body.append('as_on', as_on);
    body.append('page', page);

    return await ARReports_post(body);
  },
  GstReports_api: async (
    id,
    type,
    filter_type,
    start_date,
    end_date,
    page,
    ) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
    body.append('filter_type', filter_type);
    body.append('start_date', start_date);
    body.append('end_date', end_date);
    body.append('page', page);

    return await GstReports_post(body);
  },

  BankNameList_api : async(id, type) => {
    let body = new FormData();
    body.append('user_id', id);
    body.append('user_type', type);
  
    return await BankNameList_post( body);
  
  },
  
  CustomerPayment_api : async(user_id, user_type, company_id, date) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('company_id', company_id);
    body.append('date', date);
  
    return await CustomerPayment_post(body);
  },

  

  ReceivePayment_api : async(
     user_id,
     user_type, 
     bank_id,
     mode_of_payment,
     utr_cheque,
     invoice_list,
     is_advance,
     total_amt,
     amt_receive,
     tds_amt,
     round_off,
     balance,
     adv_account,
     rec_date,
     company_id,
     edit_id,
     ) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('bank_id', bank_id);
    body.append('mode_of_payment', mode_of_payment);
    body.append('utr_cheque', utr_cheque);
    body.append('invoice_list', invoice_list);
    body.append('is_advance', is_advance);
    body.append('total_amt', total_amt);
    body.append('amt_receive', amt_receive);
    body.append('tds_amt', tds_amt);
    body.append('round_off', round_off);
    body.append('balance', balance);
    body.append('edit_id', edit_id);
    body.append('adv_account', adv_account);
    body.append('rec_date', rec_date);
    body.append('company_id', company_id);


  
    return await ReceivePayment_post(body);
  },

  CustomerPaymentInfo_api: async (user_id, user_type, edit_id) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('edit_id', edit_id);
     return await CustomerPaymentInfo_post(body);
  },

  ManageSubscription_api: async (user_id, user_type) => {

    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);

    return await ManageSubscription_post(body);
  },

   AddUser_post_api: async (user_id,user_type,fname,lname,u_type,email_id,password,edit_id)=>{
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
     body.append('f_name', fname);
     body.append('l_name', lname);
     body.append('type_user', u_type);
    body.append('email_id', email_id);
    body.append('password', password);
    body.append('edit_id', edit_id);

    return await AddUser_post(body);
    
  },

   Reprint_post_api: async (user_id,user_type,invoice_id)=>{
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('invoice_id', invoice_id);
   

    return await Reprint_post(body);
    
  },

  SubscriptionPlanPayment_api: async (user_id, user_type, plan_id) => {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('user_type', user_type);
    body.append('plan_id', plan_id);

    return await SubscriptionPlanPayment_post(body);

  },

};

export default ArsolApi;
