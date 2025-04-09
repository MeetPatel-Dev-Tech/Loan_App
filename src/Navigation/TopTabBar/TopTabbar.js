import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ActiveLoan from '../../Screens/Loan/ActiveLoan';
import CloseLoan from '../../Screens/Loan/CloseLoan';
import colors from '../../CommonFiles/Colors';

const Tab = createMaterialTopTabNavigator();

const MyTabBar = ({state, descriptors, navigation, position}) => {
  return (
    <View style={{alignItems: 'center', marginTop: 10}}>
      <View
        style={{
          // flexDirection: 'row',
          alignItems: 'center',
          width: '80%',
          height: 55,
          justifyContent: 'center',
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingHorizontal: 5,
          //   paddingVertical: 5,
          borderRadius: 10,
        }}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({name: route.name, merge: true});
            }
          };

          const onLongPress = () => {
            console.log('djjkjkdjk');
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return (
            <TouchableOpacity
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: isFocused ? colors.blue : null,
                padding: isFocused ? 10 : 0,
                borderRadius: isFocused ? 7 : 0,
                width: '90%',
              }}>
              <Text
                style={{
                  color: isFocused ? 'white' : 'black',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const LoanTabBar = params => {
  console.log('ExistCustomer', params);
  return (
    <Tab.Navigator
      initialRouteName="Active"
      style={{backgroundColor: colors.bgColor}}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Active"
        key={params.ExistCustomer}
        initialParams={{ExistCustomer: params.ExistCustomer, id: params.id}}
        component={ActiveLoan}
        // options={({navigation}) => ({
        //   tabBarLabel: 'Active',
        // })}
      />
      <Tab.Screen
        name="Close"
        component={CloseLoan}
        options={({navigation}) => ({
          // tabBarItemStyle:{}
        })}
      />
    </Tab.Navigator>
  );
};

export {LoanTabBar};
