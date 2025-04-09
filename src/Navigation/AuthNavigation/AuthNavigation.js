import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../Screens/LoginScreen/LoginScreen';
import OtpVerification from '../../Screens/OtpVerification/OtpVerification';
import SignUpScreen from '../../Screens/BusinessDetails/BusinessDetails';
import TermsAnsConditionDetails from '../../Screens/TermsAndCondition/TermsAndConditionDetails';
import TermsAndCondition from '../../Screens/TermsAndCondition/TermsAndCondition';
import AppNavigation from '../AppNavigation/AppNavigation';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import BusinessDetails from '../../Screens/BusinessDetails/BusinessDetails';
import BottomTabNavigation from '../BottomTabNavigation/BottomTabNavigation';
import BottomStack from '../Bottom-Stack/Bottom-Stack';
import colors from '../../CommonFiles/Colors';
import CreatePIN from '../../Screens/CreatePin/CreatePin';
import ForgotPIN from '../../Screens/ForgotPIN/ForgotPIN';
import VerifyPIN from '../../Screens/VerifyPIN/VerifyPIN';

export default function AuthNavigation({navigation}) {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: {fontWeight: '500', fontSize: 18, color: 'white'},
        headerStyle: {
          backgroundColor: colors.blue,
        },
      }}
      initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={({navigation}) => ({
          title: 'Login',
          headerShown: false,
          // headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          headerStyle: {backgroundColor: colors.primaryBlueBackground},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={({navigation}) => ({
          title: 'Business Details',
          headerShown: true,
          //   headerStyle: {backgroundColor: colors.blue},
          headerLeft: () => (
            <LeftHeaderIcon
              navigation={navigation}
              instruction={'not Go Back'}
            />
          ),
        })}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          headerLeft: () => (
            <LeftHeaderIcon
              navigation={navigation}
              instruction={'not Go Back'}
            />
          ),
        })}
      />
      <Stack.Screen
        name="TermsAnsConditionDetails"
        component={TermsAnsConditionDetails}
        options={({navigation}) => ({
          title: 'Terms & Condition',
          headerTitleStyle: {fontWeight: '500', fontSize: 18, color: 'black'},
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CreatePIN"
        component={CreatePIN}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          headerStyle: {backgroundColor: colors.white},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ForgotPin"
        component={ForgotPIN}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          headerStyle: {backgroundColor: colors.white},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="VerifyPin"
        component={VerifyPIN}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          headerStyle: {backgroundColor: colors.white},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AppNavigation"
        component={AppNavigation}
        options={({navigation}) => ({
          title: 'AppNavigation',
          headerShown: false,
          //    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="BottomStack"
        component={BottomStack}
        options={({navigation}) => ({
          title: 'AppNavigation',
          headerShown: false,
          //    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
