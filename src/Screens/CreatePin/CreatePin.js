import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {useSelector, useDispatch} from 'react-redux';
import Message from '../../CommonFiles/Message';
// import {CredentialsContext} from '../../Components/Context/CredentialsContext';

// import Spinner from 'react-native-loading-spinner-overlay';
import colors from '../../CommonFiles/Colors';
// import {Logo, Settigss} from '../../CommonFiles/SvgFile';
import CommonStyle from '../../CommonFiles/CommonStyle';
import {PostApi, postApiWithTocken} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {loadingfalse, lodingtrue} from '../../Redux/ReduxConstant';
import Loader from '../Loader/Loader';
// import SmsRetriever from 'react-native-sms-retriever';

export default function CreatePIN({navigation}) {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [OtpNo1, setOtpNo1] = useState('');
  const [OtpNo2, setOtpNo2] = useState('');
  const [OtpNo3, setOtpNo3] = useState('');
  const [OtpNo4, setOtpNo4] = useState('');
  const [isSecurePin, setIsSecurePin] = useState(true);

  const [netInfo, setNetInfo] = useState(true);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const OtpNo1Ref = useRef();
  const OtpNo2Ref = useRef();
  const OtpNo3Ref = useRef();
  const OtpNo4Ref = useRef();

  const result = useSelector(state => state);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo(true);
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

  const onChange = ({name, value}) => {
    if (name == 'otpNo1') {
      setOtpNo1(value);
    } else if (name == 'otpNo2') {
      setOtpNo2(value);
    } else if (name == 'otpNo3') {
      setOtpNo3(value);
    } else if (name == 'otpNo4') {
      setOtpNo4(value);
    }
  };

  const onValidate = () => {
    if (netInfo == true) {
      const rejex = /^[0-9]+$/;
      if (OtpNo1 == '' && OtpNo2 == '' && OtpNo3 == '' && OtpNo4 == '') {
        ErrorToast(Message.KPINEmpty);
      } else if (OtpNo1 == '' || OtpNo2 == '' || OtpNo3 == '' || OtpNo4 == '') {
        ErrorToast(Message.KPINInvalid);
      } else {
        if (
          rejex.test(OtpNo1) &&
          rejex.test(OtpNo2) &&
          rejex.test(OtpNo3) &&
          rejex.test(OtpNo4)
        ) {
          onSubmitData();
        } else {
          ErrorToast(Message.KPINInvalid);
        }
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const onSubmitData = async () => {
    // navigation.navigate('ForgotPin', {phoneNumber: '1234567890'});
    dispatch({type: lodingtrue});
    const data = {
      pin: String(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4),
    };

    const response = await postApiWithTocken(
      Constant.assignpin,
      data,
      false,
      route.params.deviceToken,
    );
    console.log('response', response);
    console.log('route.params.ForgotPIN', route.params.ForgotPIN);
    dispatch({type: loadingfalse});

    if (route.params.ForgotPIN == true) {
      if (response.status == 301) {
        navigation.navigate('LoginScreen');
        SuccessToast('Pin set successfully');
      } else if (response.status == 300) {
        navigation.navigate('LoginScreen');
        SuccessToast('Pin set successfully');
      } else if (response.status == 302) {
        navigation.navigate('LoginScreen');
        SuccessToast('Pin set successfully');
      } else if (response.status == 200) {
        navigation.navigate('LoginScreen');
        SuccessToast('Pin set successfully');
      } else {
        ErrorToast(response.message);
      }
    } else {
      if (response.status == 301) {
        SuccessToast(response.message);
        navigation.navigate('BusinessDetails', {
          isEdit: true,
          phoneNumber: route.params.phoneNumber,
          deviceToken: route.params.deviceToken,
          isTerms: false,
        });
      } else if (response.status == 300) {
        SuccessToast(response.message);
        navigation.navigate('CreatePIN', {
          isEdit: true,
          phoneNumber: route.params.phoneNumber,
          deviceToken: route.params.deviceToken,
        });
      } else if (response.status == 302) {
        SuccessToast(response.message);
        navigation.navigate('TermsAndCondition', {
          isEdit: true,
          // phoneNumber: route.params.phoneNumber,
          deviceToken: route.params.deviceToken,
        });
      } else if (response.status == 200) {
      } else {
        ErrorToast(response.message);
      }
    }
  };

  return (
    <SafeAreaView style={CommonStyle.SafeAreaView}>
      {/* <Spinner
        visible={loading}
        textContent={'Loading...'}
        color="black"
        animation="fade"
        textStyle={{color: 'black'}}
      /> */}

      <Loader />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
            <View style={{alignItems: 'center', marginTop: 40}}>
              <Image
                source={require('../../Assets/Icon/LoginIcon.png')}
                style={{height: 90, width: 90}}
              />
            </View>
            <View style={{marginTop: 30, marginHorizontal: 30}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: 'black',
                }}>
                Set a New PIN
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  //   textAlign: 'center',
                  marginTop: 5,
                  color: '#525E60',
                }}>
                Please set the 4 digit pin to login.
                {/* {route.params.phoneNumber.slice(
                  route.params.phoneNumber.length - 4,
                )} */}
              </Text>
              <View
                style={{
                  marginTop: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}>
                <TextInput
                  value={OtpNo1}
                  ref={OtpNo1Ref}
                  onChange={value => {
                    onChange({name: 'otpNo1', value});
                  }}
                  onChangeText={OtpNo1 => {
                    if (OtpNo1[0]?.includes(' ')) {
                      setOtpNo1(OtpNo1.trim());
                    } else {
                      setOtpNo1(OtpNo1.replace(/[^0-9]/, ''));
                      if (OtpNo1 != '') {
                        OtpNo2Ref.current.focus();
                      }
                    }
                  }}
                  secureTextEntry={isSecurePin}
                  keyboardType="numeric"
                  maxLength={1}
                  activeOutlineColor="black"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo1Ref.current.focus()
                      : OtpNo2Ref.current.focus();
                  }}
                  // onSubmitEditing={() => OtpNo2Ref.current.focus()}
                  style={[
                    CommonStyle.otpContainerStyle,
                    {
                      borderColor: OtpNo1 != '' ? colors.blue : colors.black,
                      backgroundColor:
                        OtpNo1 != '' ? colors.primaryBlueBackground : 'white',
                    },
                  ]}
                />

                <TextInput
                  value={OtpNo2}
                  ref={OtpNo2Ref}
                  onChange={value => {
                    onChange({name: 'otpNo2', value});
                  }}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setOtpNo2(OtpNo1.trim());
                    } else {
                      setOtpNo2(value.replace(/[^0-9]/, ''));
                      if (value != '') {
                        OtpNo3Ref.current.focus();
                      }
                    }
                  }}
                  secureTextEntry={isSecurePin}
                  keyboardType="numeric"
                  maxLength={1}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  // onSubmitEditing={() => OtpNo3Ref.current.focus()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo1Ref.current.focus()
                      : OtpNo3Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={[
                    CommonStyle.otpContainerStyle,
                    {
                      borderColor: OtpNo2 != '' ? colors.blue : colors.black,
                      backgroundColor:
                        OtpNo2 != '' ? colors.primaryBlueBackground : 'white',
                    },
                  ]}
                />

                <TextInput
                  value={OtpNo3}
                  ref={OtpNo3Ref}
                  onChange={value => {
                    onChange({name: 'otpNo3', value});
                  }}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setOtpNo3(OtpNo1.trim());
                    } else {
                      setOtpNo3(value.replace(/[^0-9]/, ''));
                      if (value != '') {
                        OtpNo4Ref.current.focus();
                      }
                    }
                  }}
                  secureTextEntry={isSecurePin}
                  keyboardType="numeric"
                  maxLength={1}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  // onSubmitEditing={() => OtpNo4Ref.current.focus()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo2Ref.current.focus()
                      : OtpNo4Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={[
                    CommonStyle.otpContainerStyle,
                    {
                      borderColor: OtpNo3 != '' ? colors.blue : colors.black,
                      backgroundColor:
                        OtpNo3 != '' ? colors.primaryBlueBackground : 'white',
                    },
                  ]}
                />

                <TextInput
                  value={OtpNo4}
                  ref={OtpNo4Ref}
                  onChange={value => {
                    onChange({name: 'otpNo4', value});
                  }}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setOtpNo4(OtpNo1.trim());
                    } else {
                      setOtpNo4(value.replace(/[^0-9]/, ''));
                      if (value != '') {
                        Keyboard.dismiss();
                      }
                    }
                  }}
                  secureTextEntry={isSecurePin}
                  keyboardType="numeric"
                  maxLength={1}
                  // onSubmitEditing={() => Keyboard.dismiss()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo3Ref.current.focus()
                      : OtpNo4Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={[
                    CommonStyle.otpContainerStyle,
                    {
                      borderColor: OtpNo4 != '' ? colors.blue : colors.black,
                      backgroundColor:
                        OtpNo4 != '' ? colors.primaryBlueBackground : 'white',
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsSecurePin(!isSecurePin);
                  }}>
                  <Ionicons
                    name={isSecurePin ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{marginTop: 30, marginBottom: 20, marginHorizontal: 20}}>
            <CustomButton text="confirm" onPress={() => onValidate()} />
          </View>
        </KeyboardAwareScrollView>
      </View>

      <Modal
        isVisible={isSuccessModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View
          style={{
            justifyContent: 'center',
            // alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              paddingVertical: 20,
              borderRadius: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../Assets/Icon/SuccessfullySetPin.png')}
                style={{height: 80, width: 80}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 18,
                  fontWeight: '700',
                  marginTop: 40,
                }}>
                ~~ Congratulations ~~
              </Text>
              <Text style={{textAlign: 'center', marginTop: 10}}>
                Account created successfully, it takes 24 hours to approved by
                admin.
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              <CustomButton
                text="done"
                onPress={() => {
                  setIsSuccessModalVisible(false);
                  navigation.navigate('LoginScreen');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
