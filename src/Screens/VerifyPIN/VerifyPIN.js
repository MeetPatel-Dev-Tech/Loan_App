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
  Vibration,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useSelector, useDispatch} from 'react-redux';
// import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import colors from '../../CommonFiles/Colors';
// import {Logo, Settigss} from '../../CommonFiles/SvgFile';
// import {PostApi} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {
  getFCMToken,
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
// import SmsRetriever from 'react-native-sms-retriever';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {PINVerify} from '../../Redux/Action/AuthAction';

export default function VerifyPIN({navigation}) {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [OtpNo1, setOtpNo1] = useState('');
  const [OtpNo2, setOtpNo2] = useState('');
  const [OtpNo3, setOtpNo3] = useState('');
  const [OtpNo4, setOtpNo4] = useState('');
  const [OtpNo5, setOtpNo5] = useState('');
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  const [redirectFrom, setRedirectFrom] = useState(route.params?.from ?? '');
  const [netInfo, setNetInfo] = useState(true);

  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [recall, setRecall] = useState(false);
  const [reSendOTPs, setReSendOTPs] = useState(false);
  const {storedata, setStoreData} = useContext(CredentialsContext);
  const [isResetPinModalVisible, setIsResetPinModalVisible] = useState(false);
  const [wrongPIN, setWrongPIN] = useState(false);
  const [wrongPINCount, setWrongPINCount] = useState(3);

  const [isSecurePin, setIsSecurePin] = useState(true);

  const OtpNo1Ref = useRef();
  const OtpNo2Ref = useRef();
  const OtpNo3Ref = useRef();
  const OtpNo4Ref = useRef();
  const OtpNo5Ref = useRef();

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
          // getFcmToken();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo(false);
        }
      });
    }, []),
  );

  const getFcmToken = async () => {
    let Token = await getFCMToken();
    console.log('fcmTocken------->', Token);
    setFcmToken(Token);
  };

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
          // verifyPIN();
          dispatch(
            PINVerify({
              otp: OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4,
              phoneNumber: route.params.phoneNumber,
            }),
          );
        } else {
          ErrorToast(Message.KPINInvalid);
        }
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const verifyPIN = async () => {
    setLoading(true);
    const data = {
      userId: route.params?.userData.userId,
      pin: String(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4),
      deviceToken: fcmToken,
    };
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      {/* <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            /> */}
      {/* <Spinner
        visible={loading}
        textContent={'Loading...'}
        color="black"
        animation="fade"
        textStyle={{color: 'black'}}
      /> */}
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
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
            <View style={{marginTop: 20, marginHorizontal: 30}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: 'black',
                  //   textAlign: 'center',
                }}>
                Hello,
                {/* {route.params?.userData.firstName}{' '}
                {route.params?.userData.lastName} */}
              </Text>
              <Text style={{marginTop: 5}}>
                {/* {route.params.phoneNumber} */}
                XXXXX X
                {route.params.phoneNumber.slice(
                  route.params.phoneNumber.length - 4,
                )}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  //   textAlign: 'center',
                  marginTop: 5,
                  color: '#525E60',
                }}>
                Please enter the 4 digit pin to login.
                {/* {route.params.phoneNumber.slice(
                  route.params.phoneNumber.length - 4,
                )} */}
              </Text>
              <Text style={{marginTop: 50, textAlign: 'center'}}>
                Verify 4-digit Security PIN
              </Text>
              <View
                style={{
                  marginTop: 15,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
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
                  style={{
                    textAlign: 'center',
                    color: wrongPIN == true ? 'red' : 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderColor: wrongPIN == true ? 'red' : 'black',
                    borderRadius: 5,
                    backgroundColor:
                      OtpNo1 != ''
                        ? wrongPIN == true
                          ? '#FEF8F8'
                          : '#F5FAF5'
                        : 'white',
                    // opacity: wrongPIN == true ? 0.2 : null,
                  }}
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
                  style={{
                    textAlign: 'center',
                    color: wrongPIN == true ? 'red' : 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderColor: wrongPIN == true ? 'red' : 'black',
                    borderRadius: 5,
                    backgroundColor:
                      OtpNo2 != ''
                        ? wrongPIN == true
                          ? '#FEF8F8'
                          : '#F5FAF5'
                        : 'white',
                    // opacity: wrongPIN == true ? 0.2 : null,
                  }}
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
                  style={{
                    textAlign: 'center',
                    color: wrongPIN == true ? 'red' : 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderColor: wrongPIN == true ? 'red' : 'black',
                    borderRadius: 5,
                    backgroundColor:
                      OtpNo3 != ''
                        ? wrongPIN == true
                          ? '#FEF8F8'
                          : '#F5FAF5'
                        : 'white',
                    // opacity: wrongPIN == true ? 0.2 : null,
                  }}
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
                  style={{
                    textAlign: 'center',
                    color: wrongPIN == true ? 'red' : 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderColor: wrongPIN == true ? 'red' : 'black',
                    borderRadius: 5,
                    backgroundColor:
                      OtpNo4 != ''
                        ? wrongPIN == true
                          ? '#FEF8F8'
                          : '#F5FAF5'
                        : 'white',
                    // opacity: wrongPIN == true ? 0.2 : null,
                  }}
                />

                <TouchableOpacity
                  onPress={() => {
                    setIsSecurePin(!isSecurePin);
                  }}
                  style={{justifyContent: 'center'}}>
                  <Ionicons
                    name={isSecurePin ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {wrongPIN == true && (
              <Text
                style={{color: '#ED7D7D', textAlign: 'center', marginTop: 15}}>
                Wrong PIN. {wrongPINCount} attempts remaining
              </Text>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPin', {
                  // userId: route.params?.userData.userId,
                  ForgotPIN: true,
                  phoneNumber: route.params.phoneNumber,
                });
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.blue,
                  marginTop: 15,
                  fontWeight: '700',
                }}>
                Forgot PIN?
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 30, marginBottom: 20, marginHorizontal: 20}}>
            <CustomButton
              text="Verify & Proceed"
              onPress={() => onValidate()}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>

      <Modal
        isVisible={isResetPinModalVisible}
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
                source={require('../../Assets/Icon/ResetPin.png')}
                style={{height: 80, width: 80}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 18,
                  fontWeight: '700',
                  marginTop: 30,
                }}>
                Reset PIN
              </Text>
              <Text style={{textAlign: 'center', marginTop: 20}}>
                You have exceeded maximum attempt. Please reset your pin to
                continue.
              </Text>
            </View>
            <View style={{marginTop: 20}}>
              <CustomButton
                text="ok"
                onPress={() => {
                  setIsResetPinModalVisible(false);
                  navigation.navigate('ForgotPin', {
                    // phoneNumber: route.params.phoneNumber,
                    // userId: route.params?.userData.userId,
                    phoneNumber: '1234567890',
                  });
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
