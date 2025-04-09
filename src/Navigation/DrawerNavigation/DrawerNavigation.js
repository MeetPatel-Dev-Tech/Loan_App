import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from '../AppNavigation/AppNavigation';
import { color } from 'react-native-reanimated';
import colors from '../../CommonFiles/Colors';
import CustomSidebarMenu from './CustomSidebarMenu';
import HomeScreen from '../../Screens/HomeScreen/HomeScreen';
import Supplier from '../../Screens/Supplier/Supplier';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import DrawerMenuIcon from '../../Components/DrawerMenuIcon/DrawerMenuIcon';
import SupplierStack from '../SupplierStack/SupplierStack';

export default function DrawerNavigation({ navigation }) {
    const Drawer = createDrawerNavigator();
    return (
        // <NavigationContainer>
        <Drawer.Navigator
            useLegacyImplementation={true}
            initialRouteName="AppNavigation"
            screenOptions={{
                headerTitleAlign: 'center',
                drawerType: 'front',
                //  headerShown: false,
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: '500', fontSize: 20, color: 'white' },
                headerStyle: {
                    backgroundColor: colors.blue,
                },
            }}
            drawerContent={props => <CustomSidebarMenu {...props} />}>
            {/* <DrawerItem
                label="Help"
                onPress={() => Linking.openURL('https://mywebsite.com/help')}
            /> */}
            <Drawer.Screen
                name="Loans"
                component={AppNavigation}
                options={{
                    headerShown: false,
                    drawerLabel: 'Loans',
                    drawerActiveTintColor: colors.blue,
                    drawerIcon: ({ focused }) => (
                        <Image
                            source={require('../../Assets/Icon/LoNs.png')}
                            style={{
                                height: 25,
                                width: 25,
                                tintColor: focused ? colors.blue : 'gray',
                                marginRight: -25,
                            }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            <Drawer.Screen
                name="SupplierStack"
                component={SupplierStack}
                options={{
                    headerShown: false,
                    drawerLabel: 'Spplier',
                    drawerActiveTintColor: colors.blue,
                    drawerIcon: ({ focused }) => (
                        <Image
                            source={require('../../Assets/Icon/LoNs.png')}
                            style={{
                                height: 25,
                                width: 25,
                                tintColor: focused ? colors.blue : 'gray',
                                marginRight: -25,
                            }}
                            resizeMode="contain"
                        />
                    ),
                    headerLeft: () => <DrawerMenuIcon navigation={navigation} />,
                }}
            />
        </Drawer.Navigator>
        // </NavigationContainer>
    );
}
