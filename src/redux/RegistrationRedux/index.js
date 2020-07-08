const types = {
    REG_RESET: 'REG_RESET',
    REG_DATA: 'REG_DATA',
    CHECKSUM_RESET:'CHECKSUM_RESET',
    CHECKSUM_DATA:'CHECKSUM_RESET'
  };
  
  export const actions = {
    reg_reset:()=> {
      return {type: types.REG_RESET};
    },
    res_data(reg) {
      return {type: types.REG_DATA,reg};
    },

  };
  
  const initialState = {
    fname:"",
    lname:"",
    email:"",
    pan_no:"",
    gst_no:"",
    org_name:"",
    currency:"",
    constitution:"",
    bank_name:"",
    ac_name:"",
    ac_number:"",
    ifsc_code:"",

};
  
  export const reducer = (state = initialState, action) => {
    const {type, reg} = action;
  
    switch (type) {
      case types.REG_RESET:
        return Object.assign({}, initialState);
  
      case types.REG_DATA:
        return Object.assign({}, state, {
          
          fname:reg.fname,
          lname:reg.lname,
          email:reg.email,
          pan_no:reg.pan_no,
          gst_no:reg.gst_no,
          org_name:reg.org_name,
          currency:reg.currency,
          constitution:reg.constitution,
          bank_name:reg.bank_name,
          ac_name:reg.ac_name,
          ac_number:reg.ac_number,
          ifsc_code:reg.ifsc_code,

          
        });
  
      default:
        return state;
    }
  };
  