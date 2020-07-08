const types = {
  CON_RESET: 'CON_RESET',
  CON_DATA: 'CON_DATA',
  CON_TWO: 'CON_TWO',
  CON_INFO:'CON_INFO'
};

export const actions = {
  con_reset: () => {
    return {type: types.CON_RESET};
  },
  con_data(contact) {
    return {type: types.CON_DATA, contact};
  },
  con_two(contact) {
    return {type: types.CON_TWO, contact};
  },
  con_info(contact) {
    return {type: types.CON_INFO, contact};
  },
};

const initialState = {
  new_contact: '',
  contact_two:'',
  contact_info: ''
};

export const reducer = (state = initialState, action) => {
  const {type, contact} = action;

  switch (type) {
    case types.CON_RESET:
      return Object.assign({}, initialState);

    case types.CON_DATA:
      return Object.assign({}, state, {
        new_contact: contact,
      });

      case types.CON_TWO:
        return Object.assign({}, state, {
          contact_two: contact,
        });

        case types.CON_INFO:
          return Object.assign({}, state, {
            contact_info: contact,
          });

    default:
      return state;
  }
};
