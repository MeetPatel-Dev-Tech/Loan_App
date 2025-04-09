import React from 'react';
import { View, Image, TouchableOpacity, Text, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';

const DrawerMenuIcon = props => {
    return (
        // <View style={{flexDirection: 'row'}}> </View>
        <TouchableOpacity style={{
            marginLeft: props.profile == 'profile' ? 4 : 20
        }}
            onPress={() => {
                props.navigation.openDrawer();
                Keyboard.dismiss();
            }}>
            {/* <View style={{ backgroundColor: 'white', borderRadius: 5, }}> */}
            <View style={{}}>
                {/* <Ionicons name='reorder-three' size={33} /> */}
                <Image source={require('../../Assets/Icon/MenuI.png')}
                    style={{ height: 38, width: 38, borderRadius: 10 }}
                // resizeMode='contain'
                />
            </View>
            {/* </View> */}
        </TouchableOpacity>
    );
};

const menuStyle = {
    height: (Constant.width / 100) * 14.5,
    width: (Constant.width / 100) * 14.5,
};

export default DrawerMenuIcon;
