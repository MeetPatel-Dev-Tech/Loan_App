import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../Screens/LoginScreen/LoginScreen';
import ProfileScreen from '../../Screens/ProfileScreen/ProfileScreen';
import Setting from '../../Screens/Setting/Setting';
import colors from '../../CommonFiles/Colors';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import DrawerMenuIcon from '../../Components/DrawerMenuIcon/DrawerMenuIcon';
import Supplier from '../../Screens/Supplier/Supplier';

export default function SupplierStack({ navigation }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: '500', fontSize: 20, color: 'white' },
                headerStyle: {
                    backgroundColor: colors.blue,
                }
            }}
            initialRouteName="Supplier">

            <Stack.Screen
                name="Supplier"
                component={Supplier}
                options={({ navigation }) => ({
                    title: 'Supplier',
                    headerShown: true,
                    headerLeft: () => <DrawerMenuIcon navigation={navigation} profile={'profile'} />,
                })}
            />

        </Stack.Navigator>
    );
}
