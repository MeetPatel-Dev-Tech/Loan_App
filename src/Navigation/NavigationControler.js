import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
  Text,
} from 'react-native';
import {CredentialsContext} from '../Components/Context/CredentialsContext';
import SplashScreen from 'react-native-splash-screen';
import {useSelector, useDispatch} from 'react-redux';
import AppNavigation from './AppNavigation/AppNavigation';
import AuthNavigation from './AuthNavigation/AuthNavigation';
import DrawerNavigation from './DrawerNavigation/DrawerNavigation';
import {getLoggedUserDetails} from '../Utils/CommonUtils';
import {LOGIN, LOGOUT, USER_DETAILS} from '../Redux/ReduxConstant';

const NavigationController = () => {
  const result = useSelector(state => state);

  const dispatch = useDispatch();

  console.log('ressss', result);

  useEffect(() => {
    getLoginStatus();
    // setTimeout(() => {
    //     SplashScreen.hide();
    // }, 3000);
  }, []);

  const getLoginStatus = async () => {
    let Data = await getLoggedUserDetails();
    console.log('Data.....', Data);
    if (Data != undefined) {
      dispatch({type: USER_DETAILS, data: Data.data});
      dispatch({type: LOGIN});
    } else {
      dispatch({type: USER_DETAILS, data: null});
      dispatch({type: LOGOUT});
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 100);

    // setStoredCredentials(Data != undefined ? Data.data : null);

    console.log('Data', Data);
  };

  const [userData, setUserData] = useState('');
  const [userLoginState, setUserLoginState] = useState('');

  return <>{result.isLogin == true ? <AppNavigation /> : <AuthNavigation />}</>;
};

export default NavigationController;
