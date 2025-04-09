import {
  INTERNET_AVAILABLE,
  INTERNET_NOT_AVAILABLE,
  loadingfalse,
  lodingtrue,
  LOGIN,
  LOGOUT,
  OTP_SENT,
  OTP_SENT_CONF,
  SET_PRODUCT_LIST,
  USER_DETAILS,
  USER_LOGGED_OUT,
} from '../ReduxConstant';

const LoaderinitialState = {
  loading: false,
};
const initialState = false;

export const authData = (data = [], action) => {
  switch (action.type) {
    case OTP_SENT_CONF:
      console.log('OTP SENT......', action);
      return [action.data];
    default:
      return data;
  }
};
export const Loader = (state = LoaderinitialState, action) => {
  switch (action.type) {
    case loadingfalse:
      console.log('OTP SENT......', action);
      return {
        ...state,
        loading: false,
      };
    case lodingtrue:
      console.log('OTP SENT......', action);
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
export const userDetails = (state = [], action) => {
  switch (action.type) {
    case USER_DETAILS:
      console.log('USER_DETAILS......', action);
      return [action.data];
    case USER_LOGGED_OUT:
      console.log('USER_LOGGED_OUT......', action);
      return [];
    default:
      return state;
  }
};
export const isLogin = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      console.log('LOGIN......', action);
      return true;
    case LOGOUT:
      console.log('LOGOUT......', action);
      return false;

    default:
      return state;
  }
};
export const isInternet = (state = true, action) => {
  switch (action.type) {
    case INTERNET_AVAILABLE:
      console.log('INTERNET_AVAILABLE......', action);
      return true;
    case INTERNET_NOT_AVAILABLE:
      console.log('INTERNET_NOT_AVAILABLE......', action);
      return false;

    default:
      return state;
  }
};
