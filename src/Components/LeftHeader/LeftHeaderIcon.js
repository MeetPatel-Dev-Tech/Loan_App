import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function LeftHeaderIcon(props) {

    const onPress = () => {
        if (props.instruction == 'not Go Back') {
            props.navigation.navigate('LoginScreen')
        } else {
            if (props.navigation.canGoBack()) {
                props.navigation.goBack();
            }
        }
    }

    return (
        <TouchableOpacity
            style={{
                //  backgroundColor: 'gray',
                //  borderRadius: 10,
                justifyContent: 'center', alignItems: 'center', marginLeft: 4
                // shadowColor: 'black',
                // shadowOffset: { width: 2, height: 5 },
                // shadowOpacity: 1,
                // shadowRadius: 2,
                // elevation: 3,
                //  padding: 10
            }}
            onPress={() => onPress()}>
            <Image
                source={require('../../Assets/Icon/BackIcon.png')}
                style={{ height: 40, width: 40, borderRadius: 10 }}
            />
            {/* <AntDesign name='left' size={20} color='white' /> */}
        </TouchableOpacity>
    );
}
