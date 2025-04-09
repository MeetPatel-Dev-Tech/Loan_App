import React, {useState, useEffect, useContext} from 'react';
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
} from 'react-native';
import {Colors, TextInput} from 'react-native-paper';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Message from '../../CommonFiles/Message';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {PostApi} from '../../Api/Api';
import colors from '../../CommonFiles/Colors';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import {otpSent, UserVerified} from '../../Redux/Action/AuthAction';
import {loadingfalse, lodingtrue} from '../../Redux/ReduxConstant';
import Loader from '../Loader/Loader';

export default function LoginScreen({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [confirm, setConfirm] = useState(null);
  const {storedata, setStoreData} = useContext(CredentialsContext);

  const result = useSelector(state => state);
  const dispatch = useDispatch();
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

  const onValidate = () => {
    console.log('mobileNumber.length', mobileNumber.length);
    var flag = true;
    if (netInfo == 'offline') {
      flag = false;
      ErrorToast(Message.KCheckInternetConnection);
    } else if (mobileNumber == '') {
      flag = false;
      ErrorToast(Message.KMobileEmpty);
    } else if (mobileNumber.length !== 10) {
      flag = false;
      ErrorToast(Message.KMobileInvalid);
    } else if (
      mobileNumber[0] == 0 ||
      mobileNumber[0] == 5 ||
      mobileNumber[0] == 4 ||
      mobileNumber[0] == 1 ||
      mobileNumber[0] == 2 ||
      mobileNumber[0] == 3
    ) {
      console.log('m', mobileNumber[0]);
      flag = false;
      ErrorToast(Message.vmo);
    }
    // if (mobileNumber == Number(0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0)) {
    //     flag = false
    //     ErrorToast(Message.KMobileInvalid);
    // }

    if (flag) {
      // sendOtp(`+91${String(mobileNumber)}`);
      //  dispatch(otpSent(`+91${String(mobileNumber)}`));
      dispatch(UserVerified(String(mobileNumber)));
      dispatch({type: lodingtrue});
    }
  };

  const sendOtp = async phoneNumber => {
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        phoneNumber,
        true,
      );
      setConfirm(confirmation);
      console.log('msg', confirmation);
      // if (confirm != null) {
      onSubmitLoginCredentials(confirmation);
      setLoading(false);
    } catch (error) {
      console.log('Error.', error);
      setLoading(false);
      ErrorToast('too many requests please try again later');
    }
  };

  const onSubmitLoginCredentials = async confirmation => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        phoneNumber: String(mobileNumber),
      };
      const response = await PostApi(Constant.login, data, false);
      console.log('resp', response);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast(response.message);
        navigation.navigate('OtpVerification', {
          phoneNumber: mobileNumber,
          data: confirmation,
        });
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };
  return (
    <SafeAreaView
      style={{backgroundColor: colors.primaryBlueBackground, flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primaryBlueBackground}
      />
      <Loader />

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
            <View style={{marginHorizontal: 30, marginTop: 20, flex: 1}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 20,
                  color: 'black',
                  textAlign: 'center',
                }}>
                Login to Loan App
              </Text>
              <Text
                style={{
                  marginTop: 20,
                  textAlign: 'center',
                  color: '#525E60',
                }}>
                We provide you all kind of loan and provide you best money of
                your product
              </Text>
              <View style={{marginTop: 20}}>
                <TextInput
                  name="mobileNumber"
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={10}
                  theme={Constant.theme}
                  value={mobileNumber}
                  label="Mobile Number"
                  onChangeText={value => {
                    setMobileNumber(value.replace(/[^0-9]/, '')),
                      value.length == 10 && Keyboard.dismiss();
                  }}
                  placeholder="Enter Your Mobile Number"
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: 'white',
          }}>
          <View
            style={{
              marginHorizontal: 30,
              marginBottom: 20,
              marginTop: 20,
            }}>
            <CustomButton text="login" onPress={() => onValidate()} />
            {/* onValidate() */}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
