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
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import DatePicker from 'react-native-date-picker';
import Moment from 'moment';
import auth from '@react-native-firebase/auth';
import {Upload} from '../../../CommonFiles/SvgFile';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import Message from '../../../CommonFiles/Message';
import {GetApi, PostApi, PostApiImage, PutAPI} from '../../../Api/Api';
import removeEmojis from '../../../Components/RemoveEmojis/RemoveEmojis';
import {sub} from 'react-native-reanimated';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function PersonalDetails({navigation, route}) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [moNumber, setMoNumber] = useState('');
  const [alternetNumber, setAlternetNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOTPModalVisible, setIsOTPModalVisible] = useState(false);
  const [date, setDate] = useState(new Date(Moment().subtract(18, 'years')));
  const [open, setOpen] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [textVisible, setTextVisible] = useState(route.params?.checkNumber);
  const [confirmation, setConfirmation] = useState('');
  const [numberVerify, setNumberVerify] = useState(false);

  const [OtpNo1, setOtpNo1] = useState('');
  const [OtpNo2, setOtpNo2] = useState('');
  const [OtpNo3, setOtpNo3] = useState('');
  const [OtpNo4, setOtpNo4] = useState('');
  const [OtpNo5, setOtpNo5] = useState('');
  const [OtpNo6, setOtpNo6] = useState('');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();

  const OtpNo1Ref = useRef();
  const OtpNo2Ref = useRef();
  const OtpNo3Ref = useRef();
  const OtpNo4Ref = useRef();
  const OtpNo5Ref = useRef();
  const OtpNo6Ref = useRef();

  useEffect(() => {
    if (route.params.isEdit == false || route.params.AgainEdit == true) {
      getPersonalDetails();
      console.log('dob', route.params.data.dob);
    } else {
      setMoNumber(route.params.number);
    }
  }, []);

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

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onAuthStateChanged = user => {
    console.log('usersss', user);
    // const unsubscribe = navigation.addListener('focus', () => {
    if (Platform.OS == 'android') {
      if (user != null) {
        setOtpNo1('*');
        setOtpNo2('*');
        setOtpNo3('*');
        setOtpNo4('*');
        setOtpNo5('*');
        setOtpNo6('*');
        setIsOTPModalVisible(false);
        setNumberVerify(true);
        setTextVisible(false);
        setTimeout(() => {
          //   onVerifyOtp();
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        }, 1500);
      }
    }
    // });
    // return unsubscribe;
  };
  const onValidates = () => {
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
          // if (reSendOTPs == true) {
          //     onReOTPVerification();
          // } else {
          onOTPVerification();
          // }
        } else {
          ErrorToast(Message.KOTPInvalid);
        }
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const getPersonalDetails = () => {
    setDate(
      route.params.data.dob == null
        ? new Date()
        : new Date(route.params.data.dob),
    );
    setFirstName(route.params.data.firstName);
    setMiddleName(
      route.params.data.middleName == null ? '' : route.params.data.middleName,
    );
    setMoNumber(route.params.data.number);
    setAlternetNumber(
      route.params.data.altnumber == null ? '' : route.params.data.altnumber,
    );
    setLastName(route.params.data.lastName);
    setEmail(route.params.data.email == null ? '' : route.params.data.email);
    setDateOfBirth(route.params.data.dob == null ? '' : route.params.data.dob);
    setUploadImageuri(Constant.ShowImage + route.params.data.image);
  };

  const Opencamera = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('user cancle image picker');
      } else if (response.error) {
        console.log('imagepicker error:', response.error);
      } else if (response.customButton) {
        console.log('user taped custom button: ', response.customButton);
      } else {
        console.log('fddggg', response.assets[0]);
        if (response.assets[0].fileSize < 20971520) {
          const source = {uri: 'data:image/jpeg;base64,' + response.base64};
          setUploadImageuri(response.assets[0].uri);
          setModalOption('');
        } else {
          ErrorToast(Message.KImageSize);
        }
      }
    });
  };

  const Opengallary = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('user cancle image picker');
      } else if (response.error) {
        console.log('imagepicker error:', response.error);
      } else if (response.customButton) {
        console.log('user taped custom button: ', response.customButton);
      } else {
        console.log('kjnjjn', response.assets[0].uri);
        if (response.assets[0].type != 'image/gif') {
          if (response.assets[0].fileSize < 20971520) {
            const source = {uri: 'data:image/jpeg;base64,' + response.base64};
            setUploadImageuri(response.assets[0].uri);
            setModalOption('');
          } else {
            ErrorToast(Message.KImageSize);
          }
        } else {
          ErrorToast(Message.KInvalidFormate);
        }
      }
    });
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (firstName == '') {
        flag = false;
        errorMsg.push(Message.firstName);
      }
      if (lastName == '') {
        flag = false;
        errorMsg.push(Message.lastName);
      }
      if (moNumber == '') {
        flag = false;
        errorMsg.push(Message.mobileNumber);
      }
      if (email != '') {
        if (Constant.KEmailRegex.test(email) === false) {
          errorMsg.push(Message.emails);
          flag = false;
        }
      }
      if (moNumber.length != 10) {
        flag = false;
        errorMsg.push(Message.vmobileNumber);
      }
      if (alternetNumber != '') {
        if (alternetNumber.length != 10) {
          (flag = false), errorMsg.push(Message.vatrmobileNumber);
        } else if (
          alternetNumber == Number(0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0)
        ) {
          flag = false;
          errorMsg.push(Message.KMobileInvalid);
        } else if (
          alternetNumber[0] == 0 ||
          alternetNumber[0] == 5 ||
          alternetNumber[0] == 4 ||
          alternetNumber[0] == 1 ||
          alternetNumber[0] == 2 ||
          alternetNumber[0] == 3
        ) {
          console.log('m', alternetNumber[0]);
          flag = false;
          errorMsg.push(Message.vmo);
        }
      }
      // if (email == '') {
      //     flag = false;
      //     errorMsg.push(Message.email);
      // }
      // if (dateOfBirth == '') {
      //     flag = false;
      //     errorMsg.push(Message.dob);
      // }
      if (uploadImageUri == '') {
        flag = false;
        errorMsg.push(Message.image);
      }
      if (flag) {
        // onSubmitData();
        UploadImage();
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
    }
  };

  const UploadImage = async () => {
    console.log('uploadImageUri', uploadImageUri);
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadImageUri,
      type: 'image/jpeg',

      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'customer', data);
    console.log('response..', response);
    if (response.status == 200) {
      setLoading(false);
      if (route.params.isEdit == false || route.params.AgainEdit == true) {
        onAgainSubmit(response.data.image);
      } else {
        onSubmitData(response.data.image);
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onAgainSubmit = async image => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        //  applicationStatus: 1,
        firstName: firstName,
        middleName: middleName == '' ? null : middleName,
        lastName: lastName,
        email: email == '' ? null : email,
        //    number: String(moNumber),
        dob: dateOfBirth == '' ? null : dateOfBirth,
        altnumber: alternetNumber == '' ? null : alternetNumber,
        image: image,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response.data);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast('Personal Details Update Successfully');
        navigation.navigate('CustomerDetails', {
          id: route.params.id,
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
  const onSubmitData = async image => {
    if (netInfo == 'online') {
      const data = {
        number: route.params.number,
        firstName: firstName,
        middleName: middleName == '' ? null : middleName,
        lastName: lastName,
        email: email == '' ? null : email,
        dob: dateOfBirth == '' ? null : dateOfBirth,
        image: image,
        altnumber: alternetNumber == '' ? null : alternetNumber,
      };

      const response = await PostApi(Constant.Customers, data, false);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast(response.message);
        navigation.navigate('Address', {
          isEdit: true,
          id: response.data.id,
          loanType: route.params.loanType,
        });
      } else if (response.message == 'Customer Alredy Exists!') {
        uploadPhoto(response.data.id);
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const uploadPhoto = async id => {
    console.log('uploadImageUri', uploadImageUri);
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadImageUri,
      type: 'image/jpeg',

      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'customer', data);
    console.log('response..', response);
    if (response.status == 200) {
      sub(response.data.image, id);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const sub = async (image, id) => {
    if (netInfo == 'online') {
      const data = {
        id: id,
        //  applicationStatus: 1,
        firstName: firstName,
        middleName: middleName == '' ? null : middleName,
        lastName: lastName,
        email: email == '' ? null : email,
        //    number: String(moNumber),
        dob: dateOfBirth == '' ? null : dateOfBirth,
        altnumber: alternetNumber == '' ? null : alternetNumber,
        image: image,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response.data);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast('Personal Details Update Successfully');
        navigation.navigate('Address', {
          id: id,
          isEdit: true,
          loanType: route.params.loanType,
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
      setConfirmation(confirmation);
      setIsOTPModalVisible(true);
      //   onOTPVerification(confirmation);
      setLoading(false);
    } catch (error) {
      console.log('Error.');
      setLoading(false);
      ErrorToast('too many requests please try again later');
    }
  };

  const onOTPVerification = async () => {
    // console.log('data', route.params.data, 'f')
    setLoading(true);
    console.log(
      'otp',
      Number(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6),
    );
    try {
      await confirmation.confirm(
        OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6,
      );
      console.log('success');
      // onVerifyOtp();
      setLoading(false);
      setNumberVerify(true);
      setIsOTPModalVisible(false);
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } catch (error) {
      console.log('Invalid code.');
      ErrorToast('Invalid OTP.');
      setLoading(false);
      // auth()
      //     .signOut()
      //     .then(() => console.log('User signed out!'));
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
          backgroundColor: colors.bgColor,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            {route.params.isEdit == true ? (
              <View style={{alignItems: 'center'}}>
                {uploadImageUri == '' ? (
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    style={{
                      marginTop: 20,
                    }}>
                    <Image
                      source={require('../../../Assets/Image/uploadprofile.png')}
                      style={{height: 100, width: 100}}
                    />
                    {/* <Upload height={70} width={70} />
                    <Text>Upload Profile Picture</Text> */}
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      marginTop: 20,
                      //   borderColor: colors.blue
                    }}
                    // onPress={() => setIsModalVisible(true)}
                  >
                    <Image
                      resizeMode="contain"
                      style={{height: 100, width: 100, borderRadius: 10}}
                      source={{uri: uploadImageUri}}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'white',
                        padding: 11.5,
                        borderTopLeftRadius: 7,
                      }}></View>
                    <TouchableOpacity
                      onPress={() => setIsModalVisible(true)}
                      style={{
                        position: 'absolute',
                        bottom: -10,
                        right: -10,
                        backgroundColor: colors.blue,
                        padding: 5,
                        borderRadius: 5,
                      }}>
                      <Image
                        source={require('../../../Assets/Image/Edit.png')}
                        style={{height: 20, width: 20, tintColor: 'white'}}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={{alignItems: 'center'}}>
                {uploadImageUri == '' ? (
                  <View
                    style={{
                      marginTop: 20,
                    }}>
                    <Image
                      source={require('../../../Assets/Image/uploadprofile.png')}
                      style={{height: 100, width: 100}}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      //  borderStyle: 'dashed',
                      marginTop: 20,
                      alignItems: 'center',
                      //   borderColor: colors.blue
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 100, width: 100, borderRadius: 10}}
                      source={{uri: uploadImageUri}}
                    />
                  </View>
                )}
              </View>
            )}
            <TextInput
              mode="outlined"
              value={firstName}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setFirstName(value.trim());
                } else {
                  setFirstName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="First Name *"
              placeholder="First Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={middleName}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setMiddleName(value.trim());
                } else {
                  setMiddleName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Middle Name"
              placeholder="Middle Name"
              returnKeyType="next"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo2}
              onSubmitEditing={() => RefNo3.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={lastName}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setLastName(value.trim());
                } else {
                  setLastName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Last Name *"
              placeholder="Last Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo3}
              onSubmitEditing={() => RefNo6.current.focus()}
              blurOnSubmit={false}
            />
            <View>
              <TextInput
                mode="outlined"
                value={moNumber}
                editable={false}
                theme={Constant.disableTheme}
                onChangeText={value => {
                  setMoNumber(value);
                }}
                label="Mo. Number"
                placeholder="Mo. Number"
                maxLength={10}
                keyboardType="numeric"
                returnKeyType="next"
                style={{marginTop: 20}}
                //  ref={RefNo6}
                //  onSubmitEditing={() => RefNo4.current.focus()}
                blurOnSubmit={false}
              />
              {numberVerify == true && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    // padding: 5,
                    //  backgroundColor: 'red',
                    right: 10,
                  }}>
                  <MaterialIcons
                    name="done"
                    size={30}
                    color={colors.primaryGreen}
                  />
                </View>
              )}
            </View>
            {textVisible == true && (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View>
                  <Text>would you like to verify customer mo no.</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      sendOtp(`+91${String(route.params.number)}`);
                    }}
                    style={
                      {
                        // backgroundColor: colors.blue,
                        // padding: 5,
                        // borderRadius: 10,
                      }
                    }>
                    <Text
                      style={{
                        color: colors.blue,
                        fontSize: 18,
                        fontWeight: 'bold',
                      }}>
                      YES
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <TextInput
              mode="outlined"
              value={alternetNumber}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                setAlternetNumber(value.replace(/[^0-9]/, ''));
              }}
              label="Alternet Number"
              placeholder="Alternet Number"
              maxLength={10}
              keyboardType="numeric"
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo6}
              onSubmitEditing={() => RefNo4.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={email}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setEmail(value.trim());
                } else {
                  setEmail(removeEmojis(value));
                }
              }}
              label="Email"
              placeholder="Email"
              keyboardType="email-address"
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo4}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            {/* <TextInput
                            mode="outlined"
                            value={dateOfBirth}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setDateOfBirth(value); }}
                            label="Date of Birth"
                            placeholder="Date of Birth"
                            returnKeyType='done'
                            style={{ marginTop: 20 }}
                            ref={RefNo5}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={false}
                        /> */}
            {route.params?.isEdit == false ? (
              <View>
                <TextInput
                  mode="outlined"
                  value={
                    dateOfBirth == ''
                      ? ''
                      : Moment(dateOfBirth).format('DD-MM-yyyy')
                  }
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  editable={false}
                  onChangeText={value => {
                    setDateOfBirth(value);
                  }}
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  keyboardType="numeric"
                  style={{marginTop: 20}}
                  returnKeyType="next"
                  ref={RefNo1}
                  onSubmitEditing={() => RefNo2.current.focus()}
                  blurOnSubmit={false}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setOpen(true);
                }}>
                <TextInput
                  mode="outlined"
                  pointerEvents="none"
                  value={
                    dateOfBirth == ''
                      ? ''
                      : Moment(dateOfBirth).format('DD-MM-yyyy')
                  }
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  editable={false}
                  onChangeText={value => {
                    setDateOfBirth(value);
                  }}
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  keyboardType="numeric"
                  style={{marginTop: 20}}
                  returnKeyType="next"
                  ref={RefNo1}
                  onSubmitEditing={() => RefNo2.current.focus()}
                  blurOnSubmit={false}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    // padding: 5,
                    //  backgroundColor: 'red',
                    right: 10,
                  }}>
                  <EvilIcons name="calendar" size={30} color={colors.blue} />
                </View>
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={() => setOpen(true)}>
                            <TextInput
                                mode="outlined"
                                value={dateOfBirth == '' ? '' : Moment(dateOfBirth).format('DD-MM-yyyy')}
                                theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                                editable={false}
                                onChangeText={value => { setDateOfBirth(value); }}
                                label="Date of Birth"
                                placeholder="Date of Birth"
                                keyboardType='numeric'
                                style={{ marginTop: 20 }}
                                returnKeyType="next"
                                ref={RefNo1}
                                onSubmitEditing={() => RefNo2.current.focus()}
                                blurOnSubmit={false}
                            />
                        </TouchableOpacity> */}
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              textColor="black"
              //  maximumDate={Moment().subtract(18, "years")}
              maximumDate={new Date(Moment().subtract(18, 'years'))}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
                setDateOfBirth(date);
                console.log('date', date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                marginTop: 10,
                backgroundColor: 'white',
              },
            ]}>
            {route.params?.isEdit == true ? (
              route.params?.AgainEdit == true ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomBorderButton
                      text="cancel"
                      onPress={() =>
                        navigation.navigate('CustomerDetails', {
                          id: route.params.id,
                        })
                      }
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton text="Save" onPress={() => onValidate()} />
                  </View>
                </View>
              ) : (
                <CustomButton
                  text="next"
                  onPress={() => {
                    onValidate();
                  }}
                />
              )
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, marginRight: 20}}>
                  <CustomBorderButton
                    text="cancel"
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CustomButton
                    text="Edit"
                    onPress={() => {
                      navigation.push('PersonalDetails', {
                        isEdit: true,
                        AgainEdit: true,
                        id: route.params.id,
                        data: route.params.data,
                      });
                    }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* <Modal
            isVisible={isOTPModalVisible}
            onBackdropPress={() => {
              //   setIsModalVisible(false),
              //     setIsModalVisibles(false),
              //     LayoutAnimation.configureNext({
              //       duration: 250,
              //       create: {type: 'linear', property: 'opacity'},
              //       update: {type: 'linear', springDamping: 1},
              //       delete: {type: 'linear', property: 'opacity'},
              //     });
            }}
            swipeDirection="down"
            // onSwipeComplete={() => {
            //   setIsModalVisible(false),
            //     setIsModalVisibles(false),
            //     LayoutAnimation.configureNext({
            //       duration: 250,
            //       create: {type: 'linear', property: 'opacity'},
            //       update: {type: 'linear', springDamping: 1},
            //       delete: {type: 'linear', property: 'opacity'},
            //     });
            // }}
          >
            <View
              style={{
                justifyContent: 'flex-end',
                flex: 1,
                marginBottom: -20,
                marginHorizontal: -20,
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  paddingHorizontal: 30,
                  paddingTop: 15,
                  paddingBottom: 10,
                }}>
                <View style={{alignItems: 'center'}}>
                  <View
                    style={{
                      height: 2,
                      width: 40,
                      backgroundColor: 'gray',
                    }}></View>
                  <View
                    style={{
                      height: 2,
                      width: 40,
                      backgroundColor: 'gray',
                      marginTop: 2,
                    }}></View>
                </View>

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
                      textAlign: 'center',
                      color: 'black',
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderRadius: 5,
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
                      textAlign: 'center',
                      color: 'black',
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderRadius: 5,
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
                      textAlign: 'center',
                      color: 'black',
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderRadius: 5,
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
                      textAlign: 'center',
                      color: 'black',
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderRadius: 5,
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
                      textAlign: 'center',
                      color: 'black',
                      height: 50,
                      width: 50,
                      borderWidth: 1,
                      borderRadius: 5,
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
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                    marginBottom: 20,
                  }}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomButton
                      text={'verify'}
                      onPress={() => onValidates()}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton
                      text={'cancel'}
                      onPress={() => {
                        setIsOTPModalVisible(false);
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Modal> */}
        </KeyboardAwareScrollView>
      </View>

      <Modal
        isVisible={isModalVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        transparent={true}
        backdropOpacity={0.5}
        onModalHide={() => {
          console.log('opetion', modalOption);
          if (modalOption == 1) {
            Opengallary();
          } else if (modalOption == 2) {
            Opencamera();
          }
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 10,
              borderRadius: 10,
            }}>
            {/* <View style={{ paddingVertical: 10, borderBottomWidth: 0.4 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14 }}>{userDetails.firstName} {userDetails.lastName}</Text>
                        </View> */}
            <TouchableOpacity
              onPress={() => {
                setModalOption(1);
                setIsModalVisible(false);
              }}
              style={{paddingVertical: 10, borderBottomWidth: 0.4}}>
              <Text
                style={{textAlign: 'center', fontSize: 18, color: colors.blue}}>
                Choose From Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalOption(2);
                setIsModalVisible(false);
              }}
              style={{paddingTop: 10}}>
              <Text
                style={{textAlign: 'center', fontSize: 18, color: colors.blue}}>
                Take From Camera
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalOption('');
              setIsModalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isOTPModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        // onSwipeComplete={() => {
        //   setIsModalVisible(false),
        //     setIsModalVisibles(false),
        //     LayoutAnimation.configureNext({
        //       duration: 250,
        //       create: {type: 'linear', property: 'opacity'},
        //       update: {type: 'linear', springDamping: 1},
        //       delete: {type: 'linear', property: 'opacity'},
        //     });
        // }}
      >
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              // borderTopLeftRadius: 40,
              // borderTopRightRadius: 40,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingTop: 15,
              paddingBottom: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              {/* <View
                style={{
                  height: 2,
                  width: 40,
                  backgroundColor: 'gray',
                }}></View>
              <View
                style={{
                  height: 2,
                  width: 40,
                  backgroundColor: 'gray',
                  marginTop: 2,
                }}></View> */}
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
                Verify OTP
              </Text>

              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'gray',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 5,
                }}>
                Please enter the 6 Digit code sent to you at +91 XXXXX X
                {moNumber?.slice(moNumber?.length - 4)}
              </Text>
            </View>
            <View
              style={{
                marginTop: 30,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                // flex: 1,
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo1 != '' ? '#F2F9FE' : 'white',
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo2 != '' ? '#F2F9FE' : 'white',
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo3 != '' ? '#F2F9FE' : 'white',
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo4 != '' ? '#F2F9FE' : 'white',
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo5 != '' ? '#F2F9FE' : 'white',
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
                  height: 45,
                  width: 45,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: OtpNo6 != '' ? '#F2F9FE' : 'white',
                  borderColor: OtpNo6 != '' ? colors.blue : null,
                }}
              />
            </View>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  marginTop: 15,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{fontSize: 14, color: 'black', textAlign: 'center'}}>
                  Didn't receive OTP?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // setReSendOTPs(true);
                    setOtpNo1('');
                    setOtpNo2('');
                    setOtpNo3('');
                    setOtpNo4('');
                    setOtpNo5('');
                    setOtpNo6('');
                    sendOtp(`+91${String(moNumber)}`);
                  }}
                  style={{}}>
                  <Text style={{color: colors.blue, fontWeight: 'bold'}}>
                    {' '}
                    RESEND OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 10,
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomButton text={'verify'} onPress={() => onValidates()} />
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  text={'cancel'}
                  onPress={() => {
                    setOtpNo1('');
                    setOtpNo2('');
                    setOtpNo3('');
                    setOtpNo4('');
                    setOtpNo5('');
                    setOtpNo6('');
                    setIsOTPModalVisible(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
