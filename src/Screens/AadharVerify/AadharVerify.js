import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  Animated,
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
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Constant from '../../CommonFiles/Constant';
import colors from '../../CommonFiles/Colors';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {GetApi, PostApi} from '../../Api/Api';
import Message from '../../CommonFiles/Message';

export default function AadharVerify({navigation, route}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [zipped, setZipped] = useState('');
  const [select, setSelect] = useState('');
  const [netInfo, setNetInfo] = useState('online');
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const RefNo1 = useRef();
  const RefNo2 = useRef();

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

  const onPressEvent = () => {
    if (netInfo == 'online') {
      if (mobileNumber == '') {
        ErrorToast('Please Enter Mobile No.');
      } else if (mobileNumber.length != 10) {
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
      } else {
        onsubmit();
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const findMortgage = async id => {
    const response = await GetApi(Constant.getMortgagebyCustomerid + id);
    console.log('response', response.data.length);
    if (response.status == 200) {
      if (response.data.length == 0) {
        navigation.navigate('Mortage', {
          isEdit: true,
          id: id,
          loanType: route.params.loanType,
        });
      } else {
        navigation.navigate('MortageDetails', {
          id: id,
          loanType: route.params.loanType,
        });
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onsubmit = async () => {
    setLoading(true);
    const data = {
      number: mobileNumber,
    };
    const response = await PostApi(Constant.customerVerify, data, false);
    console.log('response', response);
    if (response.status == 200) {
      if (response.message == 'Customer Alredy Exists!') {
        if (response.data.applicationStatus == 0) {
          setLoading(false);
          navigation.navigate('Address', {
            id: response.data.id,
            isEdit: true,
          });
        } else if (response.data.applicationStatus == 1) {
          setLoading(false);
          navigation.navigate('Occupation', {
            id: response.data.id,
            isEdit: true,
          });
        } else if (response.data.applicationStatus == 2) {
          setLoading(false);
          navigation.navigate('Referance', {
            id: response.data.id,
            isEdit: true,
          });
        } else if (response.data.applicationStatus == 3) {
          setLoading(false);
          navigation.navigate('NoDocument', {
            id: response.data.id,
            isEdit: true,
          });
        } else if (response.data.applicationStatus == 4) {
          setLoading(false);
          findMortgage(response.data.id);
        }
      } else {
        // sendOtp(`+91${String(mobileNumber)}`);
        // navigation.navigate('OtpVerificationScreen', {
        //     number: String(mobileNumber)
        // });
        setLoading(false);
        navigation.navigate('PersonalDetails', {
          isEdit: true,
          number: String(mobileNumber),
        });
      }
      // setLoading(false);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const sendOtp = async phoneNumber => {
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        phoneNumber,
        true,
      );
      //   setConfirm(confirmation);
      console.log('msgs', confirmation.confirmationResultConfirm);
      console.log('msg', confirmation);
      SuccessToast('otp sent successfully');
      navigation.navigate('OtpVerificationScreen', {
        number: String(mobileNumber),
        data: confirmation,
      });
      setLoading(false);
    } catch (error) {
      console.log('Error.');
      setLoading(false);
      ErrorToast('too many requests please try again later');
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
      <LinearGradient
        colors={['#F9F9FA', '#C5EFFF']}
        style={{
          backgroundColor: '#F9F9FA',
          flex: 1,
          marginTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        {/* <View style={{ flex: 0.7, marginTop: 40 }}>
                    <View
                        style={{ alignItems: 'center', }}>
                        <Image source={require('../../Assets/Image/Aadhar2.png')}
                            style={{ height: '95%', width: '80%' }}
                            resizeMode='contain'
                        />
                    </View>
                </View> */}
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <KeyboardAwareScrollView
            style={{flex: 1}}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <View style={{flex: 1, marginHorizontal: 20}}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  marginTop: 20,
                  textAlign: 'center',
                }}>
                Please enter customer phone number
              </Text>
              <TextInput
                mode="outlined"
                keyboardType="numeric"
                maxLength={10}
                theme={Constant.theme}
                value={mobileNumber}
                label="Mobile Number"
                onChangeText={value => {
                  setMobileNumber(value.replace(/[^0-9]/, ''));
                }}
                placeholder="Mobile Number" //AddCustomer  ExistCustomer
                style={{marginTop: 20}}
              />
            </View>
            <View style={{margin: 20}}>
              <CustomButton text="next" onPress={() => onPressEvent()} />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
