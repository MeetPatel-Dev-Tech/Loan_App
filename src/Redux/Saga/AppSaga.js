import { useContext } from 'react';
import {
    View,
    Text, Keyboard, ScrollView,
    Image,
    SafeAreaView, StatusBar,
    Dimensions, KeyboardAvoidingView, Platform
} from 'react-native';
import { takeEvery, put } from 'redux-saga/effects'
import { BUSINESS_DETAILS, DETAILS, loadingfalse, lodingtrue, LOGIN, otpVerification, OTP_SENT, OTP_SENT_CONF, PRODUCT_LIST, SEARCH_PRODUCT, SET_PRODUCT_LIST, TC, USER_DETAILS } from '../ReduxConstant';
import auth from '@react-native-firebase/auth';
import Constant from '../../CommonFiles/Constant';
import * as RootNavigation from '../../Navigation/RootNavigation';
import { ErrorToast, SuccessToast } from '../../ToastMessages/Toast';
import { PostApi, PostApiImageWithToken, postApiWithTocken } from '../../Api/Api';
import { setLoggedUserDetails } from '../../Utils/CommonUtils';
import { CredentialsContext } from '../../Components/Context/CredentialsContext';


function* AppSaga() {

}

export default AppSaga;