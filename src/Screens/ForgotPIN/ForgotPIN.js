import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Colors, TextInput} from 'react-native-paper';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import auth from '@react-native-firebase/auth';
// import Spinner from 'react-native-loading-spinner-overlay';
import Constant from '../../CommonFiles/Constant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Logo, LSVCL} from '../../CommonFiles/SvgFile';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import {ErrorToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import CommonStyle from '../../CommonFiles/CommonStyle';
import {otpSent} from '../../Redux/Action/AuthAction';
import {lodingtrue} from '../../Redux/ReduxConstant';

export default function ForgotPIN({navigation, route}) {
  const [mobileNumber, setMobileNumber] = useState(route.params.phoneNumber);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState(true);

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

  const sendOtp = async phoneNumber => {
    if (netInfo == true) {
      setLoading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          phoneNumber,
          true,
        );
        // setConfirm(confirmation);
        navigation.navigate('OtpVerification', {
          phoneNumber: mobileNumber,
          ForgotPIN: true,
          OTPdata: confirmation,
        });
      } catch (error) {
        console.log('Error.', error);
        setLoading(false);
        // setLoading(false);
        ErrorToast('too many requests please try again later');
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
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
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Image
            source={require('../../Assets/Icon/LoginIcon.png')}
            style={{height: 90, width: 90}}
          />
        </View>
        <View style={{flex: 1, marginHorizontal: 20, marginTop: 40}}>
          <Text
            style={{
              marginTop: 0,
              fontSize: 22,
              fontWeight: '800',
              color: '#1B271A',
            }}>
            Forgot Your PIN
          </Text>
          <Text style={{marginTop: 10}}>
            We will send One Time Password on this +91 XXXXX X
            {route.params.phoneNumber.slice(
              route.params.phoneNumber.length - 4,
            )}
          </Text>
          <View style={{marginTop: 40}}>
            <TextInput
              mode="outlined"
              theme={mobileNumber == '' ? Constant.theme : Constant.Focus}
              value={mobileNumber}
              editable={false}
              keyboardType="numeric"
              label="Mobile Number"
              onChangeText={value => {
                setMobileNumber(value);
              }}
              placeholder="Eg: 98523 23565"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}></View>
        </View>
        <View style={{margin: 20}}>
          <View style={{}}>
            {mobileNumber != '' ? (
              <CustomButton
                text="send otp"
                onPress={() => {
                  // sendOtp(`+91${String(mobileNumber)}`);
                  dispatch({type: lodingtrue});
                  dispatch(
                    otpSent({
                      phoneNumber: String(mobileNumber),
                      ForgotPIN: true,
                    }),
                  );
                }}
              />
            ) : (
              <View
                style={[
                  styles.Button,
                  {
                    backgroundColor: '#DAECD9',
                  },
                ]}>
                <Text
                  style={[
                    styles.Buttontext,
                    {
                      color: 'white',
                      fontWeight: 'bold',
                    },
                  ]}>
                  Login
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Button: {
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  Buttontext: {
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
});
