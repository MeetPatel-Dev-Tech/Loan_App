import React, {useRef, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, Image, Easing, Animated, SafeAreaView} from 'react-native';
import Ms from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import HomeScreen from '../../Screens/HomeScreen/HomeScreen';
import ProfileScreen from '../../Screens/ProfileScreen/ProfileScreen';
import Chart from '../../Screens/Chart/Chart';
import MyCustomer from '../../Screens/MyCustomers/MyCustomer';
import colors from '../../CommonFiles/Colors';
import {Charts, Customers, Homes, Profiles} from '../../CommonFiles/SvgFile';
import Loan from '../../Screens/Loan/Loan';
import BottomStack from '../Bottom-Stack/Bottom-Stack';
import DrawerMenuIcon from '../../Components/DrawerMenuIcon/DrawerMenuIcon';
import GradientHeader from '../../Screens/GradiantHeader';
import RightHeaderIcon from '../../Components/RightHeader/RightHeaderIcon';

function BottomTabNavigation({navigation}) {
  const Tab = createBottomTabNavigator();
  const Viewref = useRef(null);
  const Viewref1 = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  };
  //  const [animation, setanimation] = useState('swing')
  useEffect(() => {
    // <Animatable.View animation="rotate" duration={2000}>
    //     <Ms name='home' />
    // </Animatable.View>
  }, [HomeScreen]);
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        headerTitleStyle: {fontWeight: '500', fontSize: 20, color: 'white'},
        headerStyle: {backgroundColor: colors.blue},
        tabBarStyle: {
          backgroundColor: 'white', // colors.blue,
          // borderTopRightRadius: 20,
          // borderTopLeftRadius: 20,
          //   position: 'absolute',
          //   bottom: 5,
          //    marginHorizontal: 10,
          zIndex: 1,
        },
        headerTransparent: false,
      }}
      initialRouteName="HomeScreen">
      <Tab.Screen
        name="Welcome To Loan App"
        component={HomeScreen}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* <Feather
                  name="home"
                  size={20}
                  color={focused ? 'black' : 'white'}
                />
                <Text style={{color: focused ? 'black' : 'white'}}>Home</Text> */}
                {/* <Entypo name='home' size={30} color='white' /> */}

                <View
                  style={{
                    position: 'absolute',
                    width: '50%',
                    borderTopWidth: focused ? 1 : 0,
                    borderTopColor: colors.blue,
                    top: 0,
                  }}></View>

                <Image
                  source={
                    focused
                      ? require('../../Assets/Image/Home-Fill.png')
                      : require('../../Assets/Image/Home-outline.png')
                  }
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: focused ? colors.blue : null,
                  }}
                />
              </>
            );
          },
          // headerLeft: () => <DrawerMenuIcon navigation={navigation} />,
          headerShown: true,
          headerRight: () => (
            <RightHeaderIcon
              navigation={navigation}
              instruction={'bottom-tab'}
            />
          ),
          //   tabBarBackground: () => <GradientHeader />,
        }}></Tab.Screen>
      <Tab.Screen
        name="Loan"
        component={Loan}
        initialParams={{ExistCustomer: false}}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* <Charts height={30} width={30} /> */}
                {/* <Image
                  source={require('../../Assets/Icon/LoNs.png')}
                  resizeMode="contain"
                  style={{
                    height: 20,
                    width: 20,
                    tintColor: focused ? 'black' : 'white',
                  }}
                />
                <Text style={{color: focused ? 'black' : 'white'}}>Loan</Text> */}

                <View
                  style={{
                    position: 'absolute',
                    width: '50%',
                    borderTopWidth: focused ? 1 : 0,
                    borderTopColor: colors.blue,
                    top: 0,
                  }}></View>

                <Image
                  source={
                    focused
                      ? require('../../Assets/Image/Allloan-fill.png')
                      : require('../../Assets/Image/Aallloan-outline.png')
                  }
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: focused ? colors.blue : null,
                  }}
                />
              </>
              // <AntDesign name='barchart' size={30} color='white' />
            );
          },
          // headerLeft: () => <DrawerMenuIcon navigation={navigation} />,
          headerShown: true,
          headerRight: () => (
            <RightHeaderIcon
              navigation={navigation}
              instruction={'bottom-tab'}
            />
          ),
          //   tabBarBackground: () => <GradientHeader />,
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            // Do something with the `navigation` object
            navigation.navigate('Loan', {
              ExistCustomer: false,
            });
          },
        })}></Tab.Screen>
      <Tab.Screen
        name="MyCustomer"
        component={MyCustomer}
        options={{
          title: '',
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* <Customers height={30} width={30} /> */}
                {/* <Feather
                  name="users"
                  size={20}
                  color={focused ? 'black' : 'white'}
                />
                <Text style={{color: focused ? 'black' : 'white'}}>
                  Customers
                </Text> */}
                <View
                  style={{
                    position: 'absolute',
                    width: '50%',
                    borderTopWidth: focused ? 1 : 0,
                    borderTopColor: colors.blue,
                    top: 0,
                  }}></View>

                <Image
                  source={
                    focused
                      ? require('../../Assets/Image/AllCustomer-fill.png')
                      : require('../../Assets/Image/AllCustomer-outline.png')
                  }
                  style={{
                    height: 28,
                    width: 28,
                    tintColor: focused ? colors.blue : null,
                  }}
                />
              </>
              // <AntDesign name='barchart' size={30} color='white' />
            );
          },
          // headerLeft: () => <DrawerMenuIcon navigation={navigation} />,
          headerShown: true,
          headerRight: () => (
            <RightHeaderIcon
              navigation={navigation}
              instruction={'bottom-tab'}
            />
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="BottomStack"
        component={BottomStack}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <>
                {/* <Profiles height={30} width={30} /> */}
                {/* <EvilIcons
                  name="user"
                  size={30}
                  color={focused ? 'black' : 'white'}
                />
                <Text style={{color: focused ? 'black' : 'white'}}>
                  Profile
                </Text> */}
                <View
                  style={{
                    position: 'absolute',
                    width: '50%',
                    borderTopWidth: focused ? 1 : 0,
                    borderTopColor: colors.blue,
                    top: 0,
                  }}></View>
                <Image
                  source={
                    focused
                      ? require('../../Assets/Image/Profile-fill.png')
                      : require('../../Assets/Image/Profile-outline.png')
                  }
                  style={{
                    height: 28,
                    width: 28,
                    tintColor: focused ? colors.blue : null,
                  }}
                />
              </>
              // <Entypo name='user' size={30} color='white' />
            );
          },
          headerShown: false,
        }}
        listeners={({navigation}) => ({
          tabPress: e => {
            // Do something with the `navigation` object
            navigation.navigate('BottomStack', {
              ExistCustomer: false,
            });
          },
        })}></Tab.Screen>

      {/* 
            <Tab.Screen name='About' component={AboutScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            // <Image source={require('../../../Assets/Icon/IconProfile.png')}
                            //     style={{ height: 30, width: 30 }}
                            // />
                            <Profile height={30} width={30} />
                        )
                    }
                }}></Tab.Screen> */}
      {/* <Tab.Screen name='AppStackNavigation' component={AppStackNavigation}> */}

      {/* </Tab.Screen> */}
    </Tab.Navigator>
  );
}
export default BottomTabNavigation;
