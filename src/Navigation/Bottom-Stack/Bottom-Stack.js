import React, {useState, useEffect, useRef, useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../../Screens/LoginScreen/LoginScreen';
import ProfileScreen from '../../Screens/ProfileScreen/ProfileScreen';
import Setting from '../../Screens/Setting/Setting';
import colors from '../../CommonFiles/Colors';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
// import PersonalDetails from '../../Screens/Details/PersonalDetails/PersonalDetails';
// import AppNavigation from '../AppNavigation/AppNavigation';
import DrawerMenuIcon from '../../Components/DrawerMenuIcon/DrawerMenuIcon';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import RightHeaderIcon from '../../Components/RightHeader/RightHeaderIcon';

export default function BottomStack({navigation}) {
  const {header, setHeader} = useContext(CredentialsContext);
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: {fontWeight: '500', fontSize: 20, color: 'white'},
        headerStyle: {
          backgroundColor: colors.blue,
        },
      }}
      initialRouteName="ProfileScreen">
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={({navigation}) => ({
          title: '',
          headerShown: true,
          // headerShown: header == false ? true : false,
          headerLeft: () => (
            <DrawerMenuIcon navigation={navigation} profile={'profile'} />
          ),
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={({navigation}) => ({
          title: 'Setting',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      {/* <Stack.Screen
                name="PersonalDetails"
                component={PersonalDetails}
                options={({ navigation }) => ({
                    title: 'Personal Details',
                    headerShown: true,
                    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
                })}
            /> */}
      {/* <Stack.Screen
                name="AppNavigation"
                component={AppNavigation}
                options={({ navigation }) => ({
                    title: 'Personal Details',
                    headerShown: true,
                    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
                })}
            /> */}
    </Stack.Navigator>
  );
}
