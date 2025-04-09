import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {RootSiblingParent} from 'react-native-root-siblings';
import SplashScreen from 'react-native-splash-screen';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {CredentialsContext} from './src/Components/Context/CredentialsContext';
import auth from '@react-native-firebase/auth';
import {Provider} from 'react-redux';
import {getLoggedUserDetails} from './src/Utils/CommonUtils';
import NavigationController from './src/Navigation/NavigationControler';
import {navigationRef} from './src/Navigation/RootNavigation';
import Store from './src/Redux/Store';
import {USER_DETAILS} from './src/Redux/ReduxConstant';
// import Store from './src/Redux';

const App = () => {
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    getLoginStatus();
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 3000);
  }, []);

  const [storedCredentials, setStoredCredentials] = useState('');
  const [storedata, setStoreData] = useState('');
  const [header, setHeader] = useState(false);
  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  function onAuthStateChanged(user) {
    console.log('user', user);
    // setStoreData(user);
  }

  // if (initializing) return null;

  const getLoginStatus = async () => {
    let Data = await getLoggedUserDetails();
    // dispatch({ type: USER_DETAILS, data: Data != undefined ? Data.data : null })
    // setStoredCredentials(Data != undefined ? Data.data : null);
    console.log('Data', Data);
  };

  return (
    <Provider store={Store}>
      <CredentialsContext.Provider
        value={{
          storedCredentials,
          setStoredCredentials,
          storedata,
          setStoreData,
          header,
          setHeader,
        }}>
        <RootSiblingParent>
          <NavigationContainer ref={navigationRef}>
            <NavigationController />
          </NavigationContainer>
        </RootSiblingParent>
      </CredentialsContext.Provider>
    </Provider>
  );
};

export default App;
