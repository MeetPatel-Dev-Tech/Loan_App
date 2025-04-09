import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import Constant from '../../CommonFiles/Constant';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import removeEmojis from '../../Components/RemoveEmojis/RemoveEmojis';

export default function Help({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [yourName, setYourName] = useState('');
  const [email, setEmail] = useState('');
  const [netInfo, setNetInfo] = useState(true);
  const [comment, setComment] = useState('');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();

  useFocusEffect(
    React.useCallback(() => {
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo(true);
          console.log('mmmmm');
        } else {
          setNetInfo(false);
        }
      });
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          setNetInfo(true);
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo(false);
        }
      });
    }, []),
  );

  const onValidate = () => {
    if (netInfo == true) {
      var flag = true;
      var errorMsg = [];
      if (yourName == '') {
        flag = false;
        errorMsg.push(Message.yourName);
      }
      if (email == '') {
        flag = false;
        errorMsg.push(Message.email);
      } else if (Constant.KEmailRegex.test(email) === false) {
        errorMsg.push(Message.emails);
        flag = false;
      }
      if (comment == '') {
        flag = false;
        errorMsg.push(Message.commnet);
      }
      if (flag) {
        navigation.goBack();
      } else {
        var errMsg = '';
        if (errorMsg.length > 2) {
          errMsg = Message.KRequiredFiledsEmpty;
        } else {
          if (errorMsg.length == 2) {
            errMsg = errorMsg[0] + ', ' + errorMsg[1];
          } else {
            errMsg = errorMsg[0];
          }
        }
        ErrorToast(errMsg);
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
      setNetInfo(false);
    }
  };

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
      <View
        style={{
          backgroundColor: colors.primaryBlueBackground,
          flex: 1,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20, flex: 1}}>
            <View style={{alignItems: 'center', marginTop: 40}}>
              {/* <AntDesign name='customerservice' size={100} color={colors.blue} /> */}
              <Image
                source={require('../../Assets/Image/Helps.png')}
                style={{
                  height: Constant.width / 1.7,
                  width: Constant.width / 1.7,
                }}
                resizeMode="contain"
              />
            </View>
            <TextInput
              mode="outlined"
              value={yourName}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setYourName(value.trim());
                } else {
                  setYourName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Your Name *"
              placeholder="Your Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={email}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setEmail(value.trim());
                } else {
                  setEmail(removeEmojis(value));
                }
              }}
              label="Email *"
              placeholder="Email"
              keyboardType="email-address"
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo2}
              onSubmitEditing={() => RefNo3.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={comment}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setComment(value.trim());
                } else {
                  setComment(value);
                }
              }}
              label="Comment *"
              placeholder="Comment"
              style={{marginTop: 20, height: 100}}
              // returnKeyType='done'
              ref={RefNo3}
              multiline={true}
              numberOfLines={5}
              // blurOnSubmit={true}
            />
          </View>
          <View style={{margin: 20}}>
            <CustomButton text="send" onPress={() => onValidate()} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
