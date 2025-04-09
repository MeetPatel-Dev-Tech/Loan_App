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
import CustomButton from '../../Components/CustomButton/CustomButton';
// import {
//     getHash,
//     startOtpListener,
//     useOtpVerify, requestHint, RNOtpVerify, getOtp
// } from 'react-native-otp-verify';
import NetInfo from '@react-native-community/netinfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import ProgressLoader from 'rn-progress-loader';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import CommonStyle from '../../CommonFiles/CommonStyle';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Constant from '../../CommonFiles/Constant';
import {PostApi} from '../../Api/Api';
import {
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import colors from '../../CommonFiles/Colors';
import {Settigss} from '../../CommonFiles/SvgFile';
import {otpV} from '../../Redux/Action/AuthAction';
import {
  loadingfalse,
  lodingtrue,
  ON_OTP_VERIFICATION_PROCESS,
} from '../../Redux/ReduxConstant';
import Loader from '../Loader/Loader';
// import SmsRetriever from 'react-native-sms-retriever';

export default function OtpVerification({navigation}) {
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [OtpNo1, setOtpNo1] = useState('');
  const [OtpNo2, setOtpNo2] = useState('');
  const [OtpNo3, setOtpNo3] = useState('');
  const [OtpNo4, setOtpNo4] = useState('');
  const [OtpNo5, setOtpNo5] = useState('');
  const [OtpNo6, setOtpNo6] = useState('');
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  const [redirectFrom, setRedirectFrom] = useState(route.params?.from ?? '');
  const [netInfo, setNetInfo] = useState('online');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [recall, setRecall] = useState(false);
  const [reSendOTPs, setReSendOTPs] = useState(false);
  const {storedata, setStoreData} = useContext(CredentialsContext);

  const OtpNo1Ref = useRef();
  const OtpNo2Ref = useRef();
  const OtpNo3Ref = useRef();
  const OtpNo4Ref = useRef();
  const OtpNo5Ref = useRef();
  const OtpNo6Ref = useRef();

  useFocusEffect(
    React.useCallback(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []),
  );

  const result = useSelector(state => state);
  const dispatch = useDispatch();
  // console.log('result', result);

  const onAuthStateChanged = user => {
    console.log('usersss', user);
    // const unsubscribe = navigation.addListener('focus', () => {
    console.log('recall', recall);
    if (Platform.OS == 'android') {
      if (user != null && recall == false && route.params.phoneNumber != '') {
        console.log('OtpNo1', OtpNo1);
        if (OtpNo1 == '') {
          setOtpNo1('*');
          setOtpNo2('*');
          setOtpNo3('*');
          setOtpNo4('*');
          setOtpNo5('*');
          setOtpNo6('*');
          setRecall(true);
          // onVerifyOtp();
          dispatch({
            type: ON_OTP_VERIFICATION_PROCESS,
            data: {
              phoneNumber: route.params.phoneNumber,
              ForgotPIN: route.params?.ForgotPIN,
            },
          });
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        }
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
        } else {
          setNetInfo('offline');
        }
      });
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  const check = () => {
    console.log('stored', storedata);
    if (storedata != '') {
      setOtpNo1('*');
      setOtpNo2('*');
      setOtpNo3('*');
      setOtpNo4('*');
      setOtpNo5('*');
      setOtpNo6('*');
      setTimeout(() => {
        onVerifyOtp();
        auth()
          .signOut()
          .then(() => console.log('User signed out!'))
          .catch(e => console.log(e));
      }, 1000);
    }
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
    } else if (name == 'otpNo5') {
      setOtpNo5(value);
    } else if (name == 'otpNo6') {
      setOtpNo6(value);
    }

    // if (name == 'otpNo1' && value != '') {
    //   // setOtpNo1(value);
    //   OtpNo2Ref.current.focus();
    // } else if (name == 'otpNo2' && value != '') {
    //   // setOtpNo2(value);
    //   OtpNo3Ref.current.focus();
    // } else if (name == 'otpNo3' && value != '') {
    //   // setOtpNo3(value);
    //   OtpNo4Ref.current.focus();
    // } else if (name == 'otpNo4' && value != '') {
    //   setOtpNo4(value);
    //   OtpNo5Ref.current.focus();
    // } else if (name == 'otpNo5' && value != '') {
    //   // setOtpNo5(value);
    //   OtpNo6Ref.current.focus();
    // } else if (name == 'otpNo6' && value != '') {
    //   // setOtpNo6(value);
    //   OtpNo6Ref.current.blur();
    // }
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      const rejex = /^[0-9]+$/;
      if (
        OtpNo1 == '' &&
        OtpNo2 == '' &&
        OtpNo3 == '' &&
        OtpNo4 == '' &&
        OtpNo5 == '' &&
        OtpNo6 == ''
      ) {
        ErrorToast(Message.KOTPEmpty);
      } else if (
        OtpNo1 == '' ||
        OtpNo2 == '' ||
        OtpNo3 == '' ||
        OtpNo4 == '' ||
        OtpNo5 == '' ||
        OtpNo6 == ''
      ) {
        ErrorToast(Message.KOTPInvalid);
      } else {
        if (
          rejex.test(OtpNo1) &&
          rejex.test(OtpNo2) &&
          rejex.test(OtpNo3) &&
          rejex.test(OtpNo4) &&
          rejex.test(OtpNo5) &&
          rejex.test(OtpNo6)
        ) {
          //  onVerifyOtp()
          if (reSendOTPs == true) {
            dispatch({type: lodingtrue});
            dispatch(
              otpV({
                otp: OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6,
                varification: confirm,
                phoneNumber: route.params.phoneNumber,
                ForgotPIN: route.params?.ForgotPIN,
              }),
            );
          } else {
            // onOTPVerification();
            dispatch({type: lodingtrue});
            dispatch(
              otpV({
                otp: OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6,
                varification: result.authData[0],
                phoneNumber: route.params.phoneNumber,
                ForgotPIN: route.params?.ForgotPIN,
              }),
            );
          }
        } else {
          ErrorToast(Message.KOTPInvalid);
        }
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const onOTPVerification = async () => {
    setLoading(true);
    console.log('data', route.params.data, 'f');
    console.log(
      'otp',
      Number(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6),
    );
    try {
      await result.authData[0].confirm(
        OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6,
      );
      setLoading(false);
      onVerifyOtp();
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } catch (error) {
      console.log('Invalid code.', error);
      setLoading(false);
      ErrorToast('Invalid OTP');
    }
  };

  const onVerifyOtp = async () => {
    setLoading(result.Loader.loading);
    if (netInfo == 'online') {
      const data = {
        phoneNumber: route.params.phoneNumber,
        otp: String(1 + 2 + 3 + 4),
        deviceToken: [''],
      };
      console.log('Data', data);
      const response = await PostApi(Constant.otpVerification, data, false);
      console.log('resp', response);
      if (response.status == 301) {
        setLoading(false);
        SuccessToast(response.message);
        navigation.navigate('BusinessDetails', {
          isEdit: true,
          phoneNumber: route.params.phoneNumber,
          deviceToken: response.data,
          isTerms: false,
        });
      } else if (response.status == 302) {
        setLoading(false);
        SuccessToast(response.message);
        navigation.navigate('TermsAndCondition', {
          isEdit: true,
          deviceToken: response.data,
        });
      } else if (response.status == 200) {
        let userInfo = [];
        userInfo.push(response.data);
        if (Platform.OS === 'android') {
          setLoggedUserDetails(JSON.stringify(userInfo));
        } else {
          setLoggedUserDetails(userInfo);
        }

        //  setLoginState(Constant.KLogin);
        setTimeout(() => {
          getLoggedUserDetails();
        }, 200);

        setTimeout(() => {
          setLoading(false);
          setStoredCredentials(response.data.data);
          // navigation.navigate('DrawerNavigation');
        }, 300);
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const reSendOTP = async phoneNumber => {
    dispatch({type: lodingtrue});
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        phoneNumber,
        true,
      );
      setConfirm(confirmation);
      console.log('msg', confirmation);
      dispatch({type: loadingfalse});
      SuccessToast('OTP sent successfully');
    } catch (error) {
      console.log('Error.', error);
      dispatch({type: loadingfalse});
      ErrorToast('too many requests please try again later');
    }
  };

  const onReOTPVerification = async () => {
    setLoading(true);
    try {
      await confirm.confirm(
        OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6,
      );
      console.log('success');
      setLoading(false);
      onVerifyOtp();
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } catch (error) {
      console.log('Invalid code.');
      setLoading(false);
      ErrorToast('Invalid OTP');
      // auth()
      //     .signOut()
      //     .then(() => console.log('User signed out!'));
    }
  };

  return (
    <SafeAreaView
      style={{backgroundColor: colors.primaryBlueBackground, flex: 1}}>
      {/* <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' /> */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primaryBlueBackground}
      />
      {/* <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            /> */}
      <Loader />
      {/* <LinearGradient colors={['#FFFFFF', '#C5EFFF']}
                style={{ flex: 0.8, alignItems: 'center', }}>
                <Image source={require('../../Assets/Image/Otp.png')}
                    style={{ height: '100%', width: '100%' }}
                />
            </LinearGradient> */}

      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.primaryBlueBackground,
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            <Image
              source={require('../../Assets/Image/LoginIntro.png')}
              style={{
                height: Constant.width / 1.6,
                width: Constant.width / 1.6,
              }}
              // resizeMode="contain"
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}>
            <View style={{alignItems: 'center', marginTop: 20}}>
              <Image
                source={require('../../Assets/Icon/LoginIcon.png')}
                style={{height: 80, width: 80}}
              />
            </View>
            <View style={{marginTop: 20, marginHorizontal: 30}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: 'black',
                  textAlign: 'center',
                }}>
                Otp Verification
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  textAlign: 'center',
                  marginTop: 20,
                  color: '#525E60',
                }}>
                Please enter the 6 Digit code sent to you at +91 XXXXX X
                {route.params.phoneNumber.slice(
                  route.params.phoneNumber.length - 4,
                )}
              </Text>
              <View
                style={{
                  marginTop: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
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
                    marginRight: 3,
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo1 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo1 != '' ? colors.blue : null,
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
                    marginRight: 3,
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo2 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo2 != '' ? colors.blue : null,
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
                    marginRight: 3,
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo3 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo3 != '' ? colors.blue : null,
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
                        OtpNo5Ref.current.focus();
                      }
                    }
                  }}
                  keyboardType="numeric"
                  returnKeyType="next"
                  maxLength={1}
                  // onSubmitEditing={() => Keyboard.dismiss()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo3Ref.current.focus()
                      : OtpNo5Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={{
                    marginRight: 3,
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo4 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo4 != '' ? colors.blue : null,
                  }}
                />
                <TextInput
                  value={OtpNo5}
                  ref={OtpNo5Ref}
                  onChange={value => {
                    onChange({name: 'otpNo5', value});
                  }}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setOtpNo5(OtpNo1.trim());
                    } else {
                      setOtpNo5(value.replace(/[^0-9]/, ''));
                      if (value != '') {
                        OtpNo6Ref.current.focus();
                      }
                    }
                  }}
                  keyboardType="numeric"
                  returnKeyType="next"
                  maxLength={1}
                  // onSubmitEditing={() => Keyboard.dismiss()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo4Ref.current.focus()
                      : OtpNo6Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={{
                    marginRight: 3,
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo5 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo5 != '' ? colors.blue : null,
                  }}
                />

                <TextInput
                  value={OtpNo6}
                  ref={OtpNo6Ref}
                  onChange={value => {
                    onChange({name: 'otpNo6', value});
                  }}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setOtpNo6(OtpNo1.trim());
                    } else {
                      setOtpNo6(value.replace(/[^0-9]/, ''));
                      if (value != '') {
                        Keyboard.dismiss();
                      }
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  // onSubmitEditing={() => Keyboard.dismiss()}
                  onKeyPress={({nativeEvent}) => {
                    nativeEvent.key === 'Backspace'
                      ? OtpNo5Ref.current.focus()
                      : OtpNo6Ref.current.focus();
                  }}
                  // textAlign='center'
                  // placeholder='-'
                  // placeholderTextColor={'black'}
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    height: 50,
                    width: 50,
                    borderWidth: 1,
                    borderRadius: 5,
                    backgroundColor: OtpNo6 != '' ? '#F5FAF5' : 'white',
                    borderColor: OtpNo6 != '' ? colors.blue : null,
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 18,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 14, color: 'black'}}>
                  Didn't receive OTP?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setReSendOTPs(true);
                    setOtpNo1('');
                    setOtpNo2('');
                    setOtpNo3('');
                    setOtpNo4('');
                    setOtpNo5('');
                    setOtpNo6('');
                    reSendOTP(`+91${String(route.params.phoneNumber)}`);
                  }}
                  style={{}}>
                  <Text style={{color: colors.blue}}> RESEND OTP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{backgroundColor: 'white'}}>
          <View style={{marginTop: 30, marginBottom: 20, marginHorizontal: 20}}>
            <CustomButton text="login" onPress={() => onValidate()} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Modal,
//   TouchableOpacity,
//   TextInput,
//   Platform,
// } from 'react-native';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
// import {SimpleAnimation} from 'react-native-simple-animations';
// import {BlurView} from '@react-native-community/blur';
// import LinearGradient from 'react-native-linear-gradient';
// import NetInfo from '@react-native-community/netinfo';
// import ProgressLoader from 'rn-progress-loader';
// import EventBus from 'react-native-event-bus';
// import {StackActions, CommonActions} from '@react-navigation/native';

// import CustomStyle from '../CommonFiles/CustomStyles';
// import Constant from '../CommonFiles/Constant';
// import APIManagerObj from '../CommonFiles/APIManager';
// import CommonUtilsObj from '../CommonFiles/CommonUtils';
// import Message from '../CommonFiles/Message';

// import {Button} from '../CommonComponents/Button';

// class OTPVerificationSignup extends React.Component {
//   constructor(props) {
//     super(props);
//     const {navigation} = this.props;

//     this.state = {
//       submitModalShow: false,
//       otpNo1: '',
//       otpNo2: '',
//       otpNo3: '',
//       otpNo4: '',
//       connectionStatus: '',
//       visible: false,
//       mobile: this.props.route.params?.mobile ?? '',
//       phoneCode: this.props.route.params?.phoneCode ?? '',
//       registerParams: this.props.route.params?.registerParams ?? '',
//       isChef: this.props.route.params?.isChef ?? false,
//     };
//     this.otpNo1 = React.createRef();
//     this.otpNo2 = React.createRef();
//     this.otpNo3 = React.createRef();
//     this.otpNo4 = React.createRef();
//   }

//   componentDidMount() {
//     NetInfo.addEventListener((state) => {
//       if (state.isConnecnlited === true) {
//         this.setState({connectionStatus: 'One'});
//       } else {
//         this.setState({connectionStatus: 'Offline'});
//       }
//     });
//     NetInfo.fetch().then((state) => {
//       if (state.isConnected === true) {
//         this.setState({connectionStatus: 'Online'});
//       } else {
//         this.setState({connectionStatus: 'Offline'});
//       }
//     });
//   }

//   onChangeSetVal = (obj) => {
//     const refs = obj._dispatchInstances.memoizedProps.ref;
//     const value = obj.nativeEvent.text;
//     this.setState({[refs]: value});

//     if (refs == 'otpNo1' && value != '') {
//       this.otpNo2.current.focus();
//     } else if (refs == 'otpNo2' && value != '') {
//       this.otpNo3.current.focus();
//     } else if (refs == 'otpNo3' && value != '') {
//       this.otpNo4.current.focus();
//     } else if (refs == 'otpNo4' && value != '') {
//       this.otpNo4.current.blur();
//     }
//   };

//   onValidate = () => {
//     if (
//       this.state.otpNo1 == '' &&
//       this.state.otpNo2 == '' &&
//       this.state.otpNo3 == '' &&
//       this.state.otpNo4 == ''
//     ) {
//       CommonUtilsObj.showErrorToast(Message.KOTPEmpty);
//     } else if (
//       this.state.otpNo1 == '' ||
//       this.state.otpNo2 == '' ||
//       this.state.otpNo3 == '' ||
//       this.state.otpNo4 == ''
//     ) {
//       CommonUtilsObj.showErrorToast(Message.KOTPInvalid);
//     } else {
//       this.onVerifyOtp();
//     }
//   };

//   async onResendOtp() {
//     if (this.state.connectionStatus == 'Online') {
//       this.setState({visible: true});
//       var data = {
//         phoneCode: this.state.phoneCode,
//         mobileNumber: this.state.mobile,
//       };
//       console.log(data);

//       let responseData = await APIManagerObj.callApiWithData(
//         Constant.KSendOTPURL,
//         data,
//       );
//       console.log('json response ....' + JSON.stringify(responseData));

//       if (responseData.status == Constant.KTrue) {
//         this.setState({
//           visible: false,
//         });

//         setTimeout(() => {
//           CommonUtilsObj.showSuccessToast(responseData.message);
//         }, 200);
//       } else {
//         this.setState({
//           visible: false,
//         });
//         setTimeout(() => {
//           CommonUtilsObj.handleAPIResponseError(responseData);
//         }, 200);
//       }
//     } else {
//       CommonUtilsObj.showErrorToast(Constant.KCheckInternetConnection);
//     }
//   }

//   async onVerifyOtp() {
//     if (this.state.connectionStatus == 'Online') {
//       this.setState({visible: true});
//       var data = {
//         phoneCode: this.state.phoneCode,
//         mobileNumber: this.state.mobile,
//         code: Number(
//           this.state.otpNo1 +
//             this.state.otpNo2 +
//             this.state.otpNo3 +
//             this.state.otpNo4,
//         ),
//       };
//       console.log(data);

//       let responseData = await APIManagerObj.callApiWithData(
//         Constant.KVerifyOTPURL,
//         data,
//       );
//       console.log(
//         'onVerifyOtp json response ....' + JSON.stringify(responseData),
//       );
//       this.setState({
//         visible: false,
//       });
//       if (responseData.status == Constant.KTrue) {
//         this.setState({
//           visible: false,
//         });

//         setTimeout(() => {
//           CommonUtilsObj.showSuccessToast(responseData.message);
//         }, 200);

//         setTimeout(() => {
//           this.onSignUp();
//         }, 300);
//       } else {
//         this.setState({
//           visible: false,
//         });

//         setTimeout(() => {
//           CommonUtilsObj.handleAPIResponseError(responseData);
//         }, 200);
//       }
//     } else {
//       CommonUtilsObj.showErrorToast(Constant.KCheckInternetConnection);
//     }
//   }

//   async onSignUp() {
//     this.setState({
//       visible: false,
//     });
//     if (this.state.connectionStatus === 'Online') {
//       let responseData = await APIManagerObj.callApiWithData(
//         Constant.KSignUpURL,
//         this.state.registerParams,
//       );

//       this.setState({
//         visible: false,
//       });
//       if (responseData.status == Constant.KTrue) {
//         if (Platform.OS === 'android') {
//           CommonUtilsObj.setLoggedUserDetails(JSON.stringify(responseData));
//         } else {
//           CommonUtilsObj.setLoggedUserDetails(responseData);
//         }

//         CommonUtilsObj.userType = responseData.data.user.userTypeId;

//         setTimeout(() => {
//           this.setState({
//             visible: false,
//           });
//           CommonUtilsObj.getLoggedUserDetails();
//         }, 200);

//         setTimeout(() => {
//           this.setState({
//             visible: false,
//           });
//           // if (responseData.data.user.userTypeId == '1') {
//           //     CommonUtilsObj.showSuccessToast(responseData.message);
//           //     const navigateAction = StackActions.reset({
//           //         index: 0,
//           //         actions: [CommonActions.navigate({ routeName: "ChefIntro"})],
//           //     });
//           //     this.props.navigation.dispatch(navigateAction);
//           // }
//           // else {
//           CommonUtilsObj.showSuccessToast(responseData.message);
//           this.setState({
//             submitModalShow: true,
//             visible: false,
//           });
//           // }
//         }, 1000);
//       } else {
//         this.setState({
//           visible: false,
//         });
//         setTimeout(() => {
//           CommonUtilsObj.handleAPIResponseError(responseData);
//         }, 200);
//       }
//     } else {
//       this.setState({
//         visible: false,
//       });
//       CommonUtilsObj.showErrorToast(Constant.KCheckInternetConnection);
//     }
//   }

//   render() {
//     const {mobile} = this.props.route.params;

//     return (
//       <>
//         <View style={CustomStyle.progressViewConatiner}>
//           <ProgressLoader
//             visible={this.state.visible}
//             isModal={true}
//             isHUD={true}
//             hudColor={'#fff'}
//             height={200}
//             width={200}
//             color={'#000'}
//           />
//         </View>

//         <KeyboardAwareScrollView
//           contentContainerStyle={{
//             flexGrow: 1,
//             justifyContent: 'center',
//             backgroundColor: '#fff',
//           }}>
//           <View
//             style={[
//               CustomStyle.forgotPasswordCont,
//               {width: '80%', paddingHorizontal: 0, alignSelf: 'center'},
//             ]}>
//             <SimpleAnimation
//               movementType={'slide'}
//               style={{alignItems: 'center'}}
//               delay={200}
//               direction={'down'}
//               distance={200}
//               duration={1200}>
//               <Text style={CustomStyle.forgotPasswordTxt}>Enter Code</Text>
//               <Text style={CustomStyle.forgotPasswordParaTxt}>
//                 Please enter the code sent to {'\n'} {this.state.phoneCode}{' '}
//                 {mobile} to verify your number
//               </Text>
//             </SimpleAnimation>

//             <SimpleAnimation
//               movementType={'slide'}
//               style={{alignItems: 'center'}}
//               delay={200}
//               direction={'up'}
//               distance={200}
//               duration={1200}>
//               <View style={CustomStyle.OtpVerificationInputCont}>
//                 <View style={CustomStyle.OtpVerificationSubInput}>
//                   <TextInput
//                     name="otpNo1"
//                     ref={this.otpNo1}
//                     maxLength={1}
//                     keyboardType="number-pad"
//                     style={CustomStyle.OtpVerificationInput}
//                     onChange={this.onChangeSetVal}
//                     onChangeText={(otpNo1) => {
//                       this.setState({otpNo1});
//                       if (otpNo1 != '') {
//                         this.otpNo2.current.focus();
//                       }
//                     }}
//                     onKeyPress={({nativeEvent}) => {
//                       nativeEvent.key === 'Backspace'
//                         ? this.otpNo1.current.focus()
//                         : this.otpNo2.current.focus();
//                     }}
//                   />
//                 </View>
//                 <View style={CustomStyle.OtpVerificationSubInput}>
//                   <TextInput
//                     name="otpNo2"
//                     ref={this.otpNo2}
//                     maxLength={1}
//                     keyboardType="number-pad"
//                     style={CustomStyle.OtpVerificationInput}
//                     onChange={this.onChangeSetVal}
//                     onChangeText={(otpNo2) => {
//                       this.setState({otpNo2});
//                       if (otpNo2 != '') {
//                         this.otpNo3.current.focus();
//                       }
//                     }}
//                     onKeyPress={({nativeEvent}) => {
//                       nativeEvent.key === 'Backspace'
//                         ? this.otpNo1.current.focus()
//                         : this.otpNo3.current.focus();
//                     }}
//                   />
//                 </View>
//                 <View style={CustomStyle.OtpVerificationSubInput}>
//                   <TextInput
//                     name="otpNo3"
//                     ref={this.otpNo3}
//                     maxLength={1}
//                     keyboardType="number-pad"
//                     style={CustomStyle.OtpVerificationInput}
//                     onChange={this.onChangeSetVal}
//                     onChangeText={(otpNo3) => {
//                       this.setState({otpNo3});
//                       if (otpNo3 != '') {
//                         this.otpNo4.current.focus();
//                       }
//                     }}
//                     onKeyPress={({nativeEvent}) => {
//                       nativeEvent.key === 'Backspace'
//                         ? this.otpNo2.current.focus()
//                         : this.otpNo4.current.focus();
//                     }}
//                   />
//                 </View>
//                 <View style={CustomStyle.OtpVerificationSubInput}>
//                   <TextInput
//                     name="otpNo4"
//                     ref={this.otpNo4}
//                     maxLength={1}
//                     keyboardType="number-pad"
//                     style={CustomStyle.OtpVerificationInput}
//                     onChange={this.onChangeSetVal}
//                     onChangeText={(otpNo4) => {
//                       this.setState({otpNo4});
//                       if (otpNo4 != '') {
//                         this.otpNo4.current.blur();
//                       }
//                     }}
//                     onKeyPress={({nativeEvent}) => {
//                       nativeEvent.key === 'Backspace'
//                         ? this.otpNo3.current.focus()
//                         : this.otpNo4.current.blur();
//                     }}
//                   />
//                 </View>
//               </View>
//               <View style={CustomStyle.resendCodeBtn}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.onResendOtp();
//                   }}
//                   activeOpacity={0.7}>
//                   <Text style={CustomStyle.resendCodeTxt}>Resend Code</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text
//                 style={[
//                   CustomStyle.forgotPasswordParaTxt,
//                   {marginTop: (Constant.width / 100) * 13},
//                 ]}>
//                 Code is valid till next 3 minute
//               </Text>
//               <View style={{marginTop: 40}}>
//                 <Button
//                   onPress={() => {
//                     this.onValidate();
//                   }}
//                   btnName={'Submit'}
//                 />
//               </View>
//             </SimpleAnimation>
//           </View>
//         </KeyboardAwareScrollView>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={this.state.submitModalShow}>
//           <BlurView
//             style={CustomStyle.popupBlurView}
//             blurType="light"
//             blurAmount={5}
//             reducedTransparencyFallbackColor="white"
//           />

//           <LinearGradient
//             colors={[Constant.backgroundColor, '#fff']}
//             start={{x: 0, y: 0}}
//             end={{x: 0, y: 1}}
//             style={styles.congratulationsModal}>
//             <View style={styles.congratulationsModalTxtCont}>
//               <Text style={CustomStyle.termsConditionsTxt}>
//                 Congratulations!
//               </Text>
//               <Text
//                 style={[
//                   CustomStyle.termsParaTxt,
//                   {textAlign: 'center', marginVertical: 10},
//                 ]}>
//                 Your mobile number has been verified successfully
//               </Text>
//               <View style={styles.continueBtnCont}>
//                 <Button
//                   onPress={() => {
//                     this.setState({submitModalShow: false, visible: false});
//                     CommonUtilsObj.setLoginState(Constant.KLogin);
//                     EventBus.getInstance().fireEvent(
//                       'LoginStatusChangedEvent',
//                       {},
//                     );
//                   }}
//                   btnName={'Continue'}
//                 />
//               </View>
//             </View>
//           </LinearGradient>
//         </Modal>
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   congratulationsModal: {
//     marginTop: Constant.height < 650 ? '55%' : '60%',
//     marginHorizontal: '20%',
//     // height: '30%',
//     // width: '80%',
//     alignSelf: 'center',
//     justifyContent: 'center',
//     // flex: .5,
//     paddingTop: 15,
//     paddingHorizontal: '10%',
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 2,
//   },
//   congratulationsModalTxtCont: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   continueBtnCont: {
//     marginTop: 15,
//     marginBottom: 15,
//   },
// });

// export default OTPVerificationSignup;
