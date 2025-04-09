import {useContext} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {takeEvery, put, delay} from 'redux-saga/effects';
import {
  BUSINESS_DETAILS,
  DETAILS,
  Dummys,
  loadingfalse,
  lodingtrue,
  LOGIN,
  ON_OTP_VERIFICATION_PROCESS,
  otpVerification,
  OTP_SENT,
  OTP_SENT_CONF,
  PIN_Verify,
  PRODUCT_LIST,
  SEARCH_PRODUCT,
  SET_PRODUCT_LIST,
  TC,
  UPDATE_BUSINESSDETAILS,
  UPDATE_BUSINESSDETAILS_SUBMIT,
  USER_DETAILS,
  USER_Verified,
  WITHOUT_LOGO_BUSINESSDETAILS,
  WITHOUT_LOGO_BUSINESSDETAILS_RESUBMIT,
} from '../ReduxConstant';
import auth from '@react-native-firebase/auth';
import Constant from '../../CommonFiles/Constant';
import * as RootNavigation from '../../Navigation/RootNavigation';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {
  PostApi,
  PostApiImage,
  PostApiImageWithToken,
  postApiWithTocken,
} from '../../Api/Api';
import {
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';

function* UserVerified(phonenumber) {
  console.log('phone number', phonenumber);
  const data = {
    phoneNumber: String(phonenumber.data),
  };
  const response = yield PostApi(Constant.login, data, false);
  console.log('resp', response);
  if (response.status == 200) {
    if (response.message == 'Verify pin') {
      yield put({type: loadingfalse});
      yield RootNavigation.navigate('VerifyPin', {
        phoneNumber: phonenumber.data,
      });
    } else {
      yield put({
        type: OTP_SENT,
        data: {phonenumber: phonenumber.data, ForgotPIN: false},
      });
      // yield put({type: loadingfalse});
      // yield RootNavigation.navigate('OtpVerification', {
      //   phoneNumber: phonenumber.data,
      // });
    }
  } else if (response.status == 500) {
    yield put({
      type: OTP_SENT,
      data: {phoneNumber: phonenumber.data, ForgotPIN: false},
    });
    // yield put({type: loadingfalse});
  } else {
    ErrorToast(response.message);
    yield put({type: loadingfalse});
  }
}
function* otpSent(phonenumber) {
  // yield put({type: lodingtrue});
  console.log('phone number', phonenumber.data);
  console.log('phone number', phonenumber.data.phoneNumber);
  try {
    const confirmation = yield auth().signInWithPhoneNumber(
      // phonenumber.data,
      `+91${String(phonenumber.data.phoneNumber)}`,
      true,
    );
    // console.log('confirmation.', confirmation);
    yield put({type: OTP_SENT_CONF, data: confirmation});
    yield put({type: loadingfalse});
    yield RootNavigation.navigate('OtpVerification', {
      phoneNumber: phonenumber.data.phoneNumber,
      ForgotPIN: phonenumber.data.ForgotPIN,
    });
    // const data = {
    //   phoneNumber: String(phonenumber.data),
    // };
    // const response = yield PostApi(Constant.login, data, false);
    // console.log('resp', response);
    // if (response.status == 200) {
    //   yield put({type: OTP_SENT_CONF, data: confirmation});
    //   yield put({type: loadingfalse});
    //   yield RootNavigation.navigate('OtpVerification', {
    //     phoneNumber: phonenumber.data,
    //   });
    // } else {
    //   ErrorToast(response.message);
    //   yield put({type: loadingfalse});
    // }
  } catch (error) {
    ErrorToast('too many requests please try again later');
    yield put({type: loadingfalse});
  }
}

function* otpVarify(data) {
  console.log('phone number', data);
  console.log('data.verification', data.data.varification);
  console.log('data.otp', data.data.otp);
  try {
    yield data.data.varification.confirm(data.data.otp);
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));

    yield put({type: loadingfalse});

    yield put({
      type: ON_OTP_VERIFICATION_PROCESS,
      data: {
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: data.data.ForgotPIN,
      },
    });
  } catch (error) {
    console.log('Invalid code.', error);
    yield put({type: loadingfalse});
    ErrorToast('Invalid OTP');
  }
}
function* VerificationProcess(data) {
  yield put({type: lodingtrue});
  console.log('phoneNumber..................', data.data.phoneNumber);
  console.log('phoneNumber......6848448.....', data);
  console.log('phoneNumber......68.....', data.data);

  const datas = {
    phoneNumber: data.data.phoneNumber,
    otp: String(1 + 2 + 3 + 4),
    deviceToken: [''],
  };
  const response = yield PostApi(Constant.otpVerification, datas, false);
  console.log('resp', response);
  if (data.data.ForgotPIN == true) {
    if (response.status == 301) {
      // setLoading(false);
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('CreatePIN', {
        isEdit: true,
        deviceToken: response.data,
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: true,
      });
    } else if (response.status == 300) {
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('CreatePIN', {
        isEdit: true,
        deviceToken: response.data,
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: true,
      });
    } else if (response.status == 302) {
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('CreatePIN', {
        isEdit: true,
        deviceToken: response.data,
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: true,
      });
    } else if (response.status == 200) {
      yield put({type: loadingfalse});
      RootNavigation.navigate('CreatePIN', {
        isEdit: true,
        deviceToken: response.data.token,
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: true,
      });
    } else {
      yield put({type: loadingfalse});
      ErrorToast(response.message);
    }
  } else {
    if (response.status == 301) {
      // setLoading(false);
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('BusinessDetails', {
        isEdit: true,
        phoneNumber: data.data.phoneNumber,
        deviceToken: response.data,
        isTerms: false,
      });
    } else if (response.status == 300) {
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('CreatePIN', {
        isEdit: true,
        deviceToken: response.data,
        phoneNumber: data.data.phoneNumber,
        ForgotPIN: false,
      });
    } else if (response.status == 302) {
      yield put({type: loadingfalse});
      SuccessToast(response.message);
      RootNavigation.navigate('TermsAndCondition', {
        isEdit: true,
        deviceToken: response.data,
      });
    } else if (response.status == 200) {
      let userInfo = [];
      userInfo.push(response.data);
      if (Platform.OS === 'android') {
        setLoggedUserDetails(JSON.stringify(userInfo));
      } else {
        setLoggedUserDetails(userInfo);
      }
      yield put({type: USER_DETAILS, data: response.data.data});
      yield delay(500);
      yield put({type: LOGIN});

      yield put({type: loadingfalse});
    } else {
      yield put({type: loadingfalse});
      ErrorToast(response.message);
    }
  }
}
function* PINVerify(data) {
  yield put({type: lodingtrue});
  console.log('phoneNumber', data.data);

  const datas = {
    phoneNumber: data.data.phoneNumber,
    pin: String(data.data.otp),
    deviceToken: [''],
  };
  const response = yield PostApi(Constant.verifypin, datas, false);
  console.log('resp', response);
  if (response.status == 301) {
    // setLoading(false);
    yield put({type: loadingfalse});
    SuccessToast(response.message);
    RootNavigation.navigate('BusinessDetails', {
      isEdit: true,
      phoneNumber: data.data.phoneNumber,
      deviceToken: response.data,
      isTerms: false,
    });
  } else if (response.status == 302) {
    yield put({type: loadingfalse});
    SuccessToast(response.message);
    RootNavigation.navigate('TermsAndCondition', {
      isEdit: true,
      deviceToken: response.data,
    });
  } else if (response.status == 200) {
    let userInfo = [];
    userInfo.push(response.data);
    if (Platform.OS === 'android') {
      setLoggedUserDetails(JSON.stringify(userInfo));
    } else {
      setLoggedUserDetails(userInfo);
    }
    yield put({type: USER_DETAILS, data: response.data.data});
    yield delay(500);
    yield put({type: LOGIN});

    yield put({type: loadingfalse});
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* BusinessDetails(details) {
  console.log('uploadImageUri', details.data.uploadImageUri);
  var data = new FormData();
  data.append('image', {
    uri: details.data.uploadImageUri,
    type: 'image/jpeg',
    name: 'Logo.jpg',
  });
  console.log('FormData', data);
  let responseData = yield PostApiImageWithToken(
    Constant.uploadImage + 'bl',
    data,
    details.data.deviceToken,
  );
  console.log('uploadImage', responseData);
  if (responseData.status == 200) {
    yield put({type: loadingfalse});
    yield put({
      type: DETAILS,
      data: details,
      logo: responseData.data.image,
    });
    //  uploadDetails(responseData.data.image, details);
  } else {
    yield put({type: loadingfalse});
    ErrorToast(responseData.message);
  }
}

function* BusinessDetailsUpdate(details) {
  yield put({type: lodingtrue});
  var data = new FormData();
  data.append('image', {
    uri: details.data.uploadImageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });
  let response = yield PostApiImage(Constant.uploadImage + 'bl', data);
  console.log('response..', response);
  // console.log('response..Image', response.data.image)
  if (response.status == 200) {
    // yield put({ type: loadingfalse })
    yield put({
      type: UPDATE_BUSINESSDETAILS_SUBMIT,
      data: details,
      logo: response.data.image,
    });
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* BusinessDetailsUpdateSubmit(details) {
  console.log('details', details);

  const data = {
    firstName: details.data.data.firstName,
    lastName: details.data.data.lastName,
    businessName: details.data.data.businessName,
    address: details.data.data.address,
    city: details.data.data.city,
    state: details.data.data.state,
    country: details.data.data.country,
    zipped: details.data.data.zipped,
    taluka: details.data.data.taluka,
    district: details.data.data.district,
    email: details.data.data.webAddress,
    businessLogo: details.logo,
    panNumber: details.data.data.panNumber,
    gstNumber: details.data.data.gstNumber,
  };

  const response = yield PostApi(Constant.TermsAndCondition, data, false);
  console.log('response', response);
  if (response.status == 200) {
    // yield put({ type: loadingfalse })
    yield put({type: USER_DETAILS, data: response.data.data});
    SuccessToast(response.message);
    let userInfo = [];
    yield userInfo.push(response.data);
    if (Platform.OS === 'android') {
      setLoggedUserDetails(JSON.stringify(userInfo));
    } else {
      setLoggedUserDetails(userInfo);
    }
    RootNavigation.navigate('ProfileScreen', {});
    yield put({type: loadingfalse});
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* uploadDetails(details) {
  console.log('details', details);

  const data = {
    firstName: details.data.data.firstName,
    lastName: details.data.data.lastName,
    businessName: details.data.data.businessName,
    address: details.data.data.address,
    city: details.data.data.city,
    state: details.data.data.state,
    country: details.data.data.country,
    zipped: details.data.data.zipped,
    taluka: details.data.data.taluka,
    district: details.data.data.district,
    email: details.data.data.webAddress,
    businessLogo: details.logo,
    panNumber: details.data.data.panNumber,
    gstNumber: details.data.data.gstNumber,
  };
  const response = yield postApiWithTocken(
    Constant.register,
    data,
    false,
    details.data.data.deviceToken,
  );
  console.log('response', response);
  if (response.status == 200) {
    SuccessToast(response.message);
    RootNavigation.navigate('TermsAndCondition', {
      isEdit: true,
      deviceToken: details.data.data.deviceToken,
      isTerms: false,
    });

    yield put({type: loadingfalse});
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* WithoutLogoBusinessDetails(details) {
  yield put({type: lodingtrue});

  console.log('details', details);

  const data = {
    firstName: details.firstName,
    lastName: details.lastName,
    businessName: details.businessName,
    address: details.address,
    city: details.city,
    state: details.state,
    country: details.country,
    zipped: details.zipped,
    taluka: details.taluka,
    district: details.district,
    email: details.webAddress,
    panNumber: details.panNumber,
    gstNumber: details.gstNumber,
  };
  const response = yield postApiWithTocken(
    Constant.register,
    data,
    false,
    details.deviceToken,
  );
  console.log('response', response);
  if (response.status == 200) {
    SuccessToast(response.message);
    RootNavigation.navigate('TermsAndCondition', {
      isEdit: true,
      deviceToken: details.deviceToken,
      isTerms: false,
    });

    yield put({type: loadingfalse});
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* WithoutLogoBusinessDetailsResubmit(details) {
  yield put({type: lodingtrue});

  const data = {
    firstName: details.firstName,
    lastName: details.lastName,
    businessName: details.businessName,
    address: details.address,
    city: details.city,
    state: details.state,
    country: details.country,
    zipped: details.zipped,
    taluka: details.taluka,
    district: details.district,
    email: details.webAddress,
    panNumber: details.panNumber,
    gstNumber: details.gstNumber,
  };
  const response = yield PostApi(Constant.TermsAndCondition, data, false);
  console.log('response', response);
  if (response.status == 200) {
    // yield put({ type: loadingfalse })
    yield put({type: USER_DETAILS, data: response.data.data});
    SuccessToast(response.message);
    let userInfo = [];
    yield userInfo.push(response.data);
    if (Platform.OS === 'android') {
      setLoggedUserDetails(JSON.stringify(userInfo));
    } else {
      setLoggedUserDetails(userInfo);
    }
    RootNavigation.navigate('ProfileScreen', {});
    yield put({type: loadingfalse});
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}

function* TER_CON(tocken) {
  console.log('tocken', tocken);
  yield put({type: lodingtrue});

  const data = {
    isTerm: true,
  };
  const response = yield postApiWithTocken(
    Constant.TermsAndCondition,
    data,
    false,
    tocken.data.deviceToken,
  );
  console.log('response', response);
  if (response.status == 200) {
    let userInfo = [];
    yield userInfo.push(response.data);
    if (Platform.OS === 'android') {
      yield setLoggedUserDetails(JSON.stringify(userInfo));
    } else {
      yield setLoggedUserDetails(userInfo);
    }
    yield delay(500);
    yield put({type: loadingfalse});
    yield put({type: USER_DETAILS, data: response.data.data});
    yield put({type: LOGIN});
    // setStoreData(response.data.data);
    // setIsModalVisible(true);
  } else {
    yield put({type: loadingfalse});
    ErrorToast(response.message);
  }
}
function* Dummy(tocken) {
  console.log('ffffffffffff........................');
  console.log('dummy', tocken);
}

function* AuthSaga() {
  yield takeEvery(USER_Verified, UserVerified);
  yield takeEvery(OTP_SENT, otpSent);
  yield takeEvery(otpVerification, otpVarify);
  yield takeEvery(PIN_Verify, PINVerify);
  yield takeEvery(BUSINESS_DETAILS, BusinessDetails);
  yield takeEvery(UPDATE_BUSINESSDETAILS, BusinessDetailsUpdate);
  yield takeEvery(UPDATE_BUSINESSDETAILS_SUBMIT, BusinessDetailsUpdateSubmit);
  yield takeEvery(WITHOUT_LOGO_BUSINESSDETAILS, WithoutLogoBusinessDetails);
  yield takeEvery(
    WITHOUT_LOGO_BUSINESSDETAILS_RESUBMIT,
    WithoutLogoBusinessDetailsResubmit,
  );
  yield takeEvery(DETAILS, uploadDetails);
  yield takeEvery(TC, TER_CON);
  yield takeEvery(Dummys, Dummy);
  yield takeEvery(ON_OTP_VERIFICATION_PROCESS, VerificationProcess);
}

export default AuthSaga;
