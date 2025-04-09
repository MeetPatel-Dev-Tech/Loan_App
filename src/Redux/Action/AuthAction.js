import {
  ADD_TO_CART,
  BUSINESS_DETAILS,
  EMPTY_CART,
  otpVerification,
  OTP_SENT,
  PIN_Verify,
  REMOVE_FROM_CART,
  TC,
  UPDATE_BUSINESSDETAILS,
  USER_Verified,
} from '../ReduxConstant';

export const UserVerified = data => {
  console.warn('action is called', data);
  return {
    type: USER_Verified,
    data,
  };
};
export const otpSent = data => {
  console.warn('action is called', data);
  return {
    type: OTP_SENT,
    data,
  };
};
export const otpV = data => {
  console.warn('otp Verify', data);
  return {
    type: otpVerification,
    data,
  };
};
export const PINVerify = data => {
  console.warn('otp Verify', data);
  return {
    type: PIN_Verify,
    data,
  };
};
export const uplodBusinessDetails = data => {
  console.warn('otp Verify', data);
  return {
    type: BUSINESS_DETAILS,
    data,
  };
};
export const uplodupdateBusinessDetails = data => {
  console.warn('otp Verify', data);
  return {
    type: UPDATE_BUSINESSDETAILS,
    data,
  };
};
export const T_C = data => {
  console.warn('T_C', data);
  return {
    type: TC,
    data,
  };
};

export const removeToCart = data => {
  console.warn('action removeToCart', data);
  return {
    type: REMOVE_FROM_CART,
    data,
  };
};

export const emptyCart = () => {
  console.warn('action emptyCart');
  return {
    type: EMPTY_CART,
  };
};
export const otpVerify = () => {
  console.warn('action emptyCart');
  return {
    type: otpVerification,
  };
};
