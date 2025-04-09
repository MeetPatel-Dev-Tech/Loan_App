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

export default function RightHeaderIcon(props) {
  const onPress = () => {
    if (props.instruction == 'not Go Back') {
      props.navigation.navigate('LoginScreen');
    } else {
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
      }
    }
  };

  return (
    <TouchableOpacity
      style={{
        //  backgroundColor: 'gray',
        //  borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: props?.instruction == 'bottom-tab' ? 19 : 3,
        // shadowColor: 'black',
        // shadowOffset: { width: 2, height: 5 },
        // shadowOpacity: 1,
        // shadowRadius: 2,
        // elevation: 3,
        //  padding: 10
      }}
      //   onPress={() => onPress()}
    >
      <Image
        source={require('../../Assets/Image/Notification-new.png')}
        style={{height: 25, width: 25, borderRadius: 10}}
      />
      {/* <AntDesign name='left' size={20} color='white' /> */}
    </TouchableOpacity>
  );
}
