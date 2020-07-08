/** @format */

import {persistCombineReducers} from 'redux-persist';


import {reducer as UserRedux} from './UserRedux';
import {reducer as RegistrationRedux} from './RegistrationRedux';
import {reducer as NewContactRedux} from './NewContactRedux';
import {reducer as NewEstimateRedux} from './NewEstimateRedux';
import {reducer as network} from 'react-native-offline';

import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['network'],

};

export default persistCombineReducers(persistConfig, {
  user: UserRedux,
  regData: RegistrationRedux,
  conData: NewContactRedux,
  estData: NewEstimateRedux,
  network: network,

});
