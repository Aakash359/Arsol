const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN_SUCCESS',
  REMEMBER:'REMEMBER'
};

export const actions = {
  login: user => {
    return {type: types.LOGIN, user};
  },
  logout() {
    return {type: types.LOGOUT};
  },
  remember(checked,username,password) {
    return { type: types.REMEMBER ,checked,username,password};
  },
};

const initialState = {
  "id": "",
  "type": "",
  "Name": "",
  "image": "",
  "rolelist":"",
  "ch_remember":false,
   email: '',
   pass: '',

};

export const reducer = (state = initialState, action) => {
  const { type, user, checked,username,password} = action;

  switch (type) {
    case types.LOGOUT:
      return Object.assign({}, state, {
        "id": "",
        "type": "",
        "Name": "",
        "image": "",
        "rolelist": "",
      });

    case types.LOGIN:
      return Object.assign({}, state, {
        "id": user.id,
        "type": user.type,
        "Name": user.Name,
        "image":user.image,
        "rolelist": user.rolelist
      });

    case types.REMEMBER:

      //alert('test', username)
      return Object.assign({}, state, {
     
        ch_remember: checked,
         email: username,
         pass: password,
        
      });  

    default:
      return state;
  }
};
