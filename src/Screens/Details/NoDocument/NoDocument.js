import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import colors from '../../../CommonFiles/Colors';

export default function NoDocument({navigation, route}) {
  const [loading, setLoading] = useState(false);

  const RefNo1 = useRef();
  const RefNo2 = useRef();

  return (
    <SafeAreaView style={{backgroundColor: colors.blue, flex: 1}}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      <StatusBar barStyle="dark-content" backgroundColor={colors.blue} />
      {/* <View style={{ paddingBottom: 20, paddingTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}>Welcome to Loan App</Text>
            </View> */}
      <LinearGradient
        colors={['#F9F9FA', '#C5EFFF']}
        style={{
          backgroundColor: colors.bgColor,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <View style={{flex: 1, marginTop: 40}}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('../../../Assets/Image/AddDocument.png')}
              style={{height: 200, width: '80%', marginTop: 50}}
              resizeMode="contain"
            />
            <Text style={{marginTop: 10}}>Please upload a Document </Text>
          </View>
        </View>
        <View style={{margin: 20, justifyContent: 'flex-end'}}>
          <CustomButton
            text="add Document"
            onPress={() =>
              navigation.navigate('AddDocument', {
                id: route.params.id,
                loanType: route.params.loanType,
              })
            }
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
