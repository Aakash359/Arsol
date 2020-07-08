const types = {
    EST_RESET: 'EST_RESET',
    EST_DATA: 'EST_DATA',
    EST_TWO: 'EST_TWO',
    EST_INFO:'EST_INFO'
  };
  
  export const actions = {
    est_reset: () => {
      return {type: types.EST_RESET};
    },
    est_data(estimate) {
      return {type: types.EST_DATA, estimate};
    },
    est_two(estimate) {
      return {type: types.EST_TWO, estimate};
    },
    est_info(estimate) {
      return {type: types.EST_INFO, estimate};
    },
 
  };
  
  const initialState = {
    new_estimate: '',
    estimate_two:'',
    estimate_info:''
     };
  
  export const reducer = (state = initialState, action) => {
    const {type, estimate} = action;
  
    switch (type) {
      case types.EST_RESET:
        return Object.assign({}, initialState);
  
      case types.EST_DATA:
        return Object.assign({}, state, {
          new_estimate: estimate,
        });
  
        case types.EST_TWO:
          return Object.assign({}, state, {
            estimate_two: estimate,
          });

          case types.EST_INFO:
          return Object.assign({}, state, {
            estimate_info: estimate,
          });  
  
      default:
        return state;
    }
  };
  