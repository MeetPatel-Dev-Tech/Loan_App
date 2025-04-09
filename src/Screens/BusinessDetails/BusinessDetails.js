import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Colors, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import ProgressLoader from 'rn-progress-loader';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import Message from '../../CommonFiles/Message';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  GetApi,
  PostApi,
  PostApiImage,
  PostApiImageWithToken,
  postApiWithTocken,
} from '../../Api/Api';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import colors from '../../CommonFiles/Colors';
import {Upload} from '../../CommonFiles/SvgFile';
import {
  CommonUtilsObj,
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import removeEmojis from '../../Components/RemoveEmojis/RemoveEmojis';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import {
  uplodBusinessDetails,
  uplodupdateBusinessDetails,
} from '../../Redux/Action/AuthAction';
import {
  lodingtrue,
  WITHOUT_LOGO_BUSINESSDETAILS,
  WITHOUT_LOGO_BUSINESSDETAILS_RESUBMIT,
} from '../../Redux/ReduxConstant';

export default function BusinessDetails({navigation, route}) {
  const result = useSelector(state => state);
  const dispatch = useDispatch();

  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState([]);
  const [state, setState] = useState('');
  const [zipped, setZipped] = useState('');
  const [country, setCountry] = useState('');
  const [taluka, setTaluka] = useState('');
  const [distric, setDistric] = useState('');
  const [webAddress, setWebAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [modalOption, setModalOption] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [error, setError] = useState('');
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  // const [personalDetails, setPersonalDetails] = useState({
  //     firstName: '',
  //     lastName: ''
  // });
  // const { firstName, lastName } = personalDetails;

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();
  const RefNo7 = useRef();
  const RefNo8 = useRef();
  const RefNo9 = useRef();
  const RefNo10 = useRef();
  const RefNo11 = useRef();

  useEffect(() => {
    if (route.params?.isEdit == false || route.params?.AgainEdit == true) {
      getBusinessDetails();
      getLocations(CommonUtilsObj.UserDetails[0].data.zipped);
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
    navigation.setOptions({
      // headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.blue,
      },
      // backgroundColor: 'pink',
      //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
      headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
    });
  }, []);

  // const onChange = obj => {
  //     const name = obj._dispatchInstances.memoizedProps.name;
  //     const value = obj.nativeEvent.text;
  //     setPersonalDetails({ ...personalDetails, [name]: removeEmojis(value) });
  //     console.log('name', name, value);
  //     const spaceValidation = /\s/g.test(value[0])

  //     if (name == 'firstName') {
  //         if (!value.replace(/\s/g, '').length) {
  //             setPersonalDetails({ ...personalDetails, [name]: value.trim() });
  //         }
  //         if (spaceValidation) {
  //             setPersonalDetails({ ...personalDetails, [name]: value.trim() });
  //         }
  //     }
  //     if (name == 'lastName') {
  //         if (!value.replace(/\s/g, '').length) {
  //             setPersonalDetails({ ...personalDetails, [name]: value.trim() });
  //         }
  //         if (spaceValidation) {
  //             setPersonalDetails({ ...personalDetails, [name]: value.trim() });
  //         }
  //     }
  // };

  const getBusinessDetails = () => {
    console.log('details', result.userDetails[0]);
    setFirstName(result.userDetails[0].firstName);
    setLastName(result.userDetails[0].lastName);
    setBusinessName(result.userDetails[0].businessName);
    setAddress(result.userDetails[0].address);
    setCity(
      result.userDetails[0].city == null ? '' : result.userDetails[0].city,
    );
    setZipped(result.userDetails[0].zipped);
    setTaluka(
      result.userDetails[0].taluka == null ? '' : result.userDetails[0].taluka,
    );
    setDistric(
      result.userDetails[0].district == null
        ? ''
        : result.userDetails[0].district,
    );
    setCountry(
      result.userDetails[0].country == null
        ? ''
        : result.userDetails[0].country,
    );
    setState(
      result.userDetails[0].state == null ? '' : result.userDetails[0].state,
    );
    setWebAddress(
      result.userDetails[0].email == null ? '' : result.userDetails[0].email,
    );
    setPanNumber(
      result.userDetails[0].panNumber == null
        ? ''
        : result.userDetails[0].panNumber,
    );
    setGstNumber(
      result.userDetails[0].gstNumber == null
        ? ''
        : result.userDetails[0].gstNumber,
    );
    setUploadImageuri(
      result.userDetails[0].businessLogo == null
        ? ''
        : Constant.ShowImage + result.userDetails[0].businessLogo,
    );
  };
  // const getBusinessDetails = () => {
  //     console.log('details', CommonUtilsObj.UserDetails[0]);
  //     console.log('country', CommonUtilsObj.UserDetails[0].data.country);
  //     setFirstName(CommonUtilsObj.UserDetails[0].data.firstName);
  //     setLastName(CommonUtilsObj.UserDetails[0].data.lastName);
  //     setBusinessName(CommonUtilsObj.UserDetails[0].data.businessName);
  //     setAddress(CommonUtilsObj.UserDetails[0].data.address);
  //     setCity(CommonUtilsObj.UserDetails[0].data.city == null ? '' : CommonUtilsObj.UserDetails[0].data.city);
  //     setZipped(CommonUtilsObj.UserDetails[0].data.zipped);
  //     setTaluka(CommonUtilsObj.UserDetails[0].data.taluka == null ? '' : CommonUtilsObj.UserDetails[0].data.taluka);
  //     setDistric(CommonUtilsObj.UserDetails[0].data.district == null ? '' : CommonUtilsObj.UserDetails[0].data.district);
  //     setCountry(CommonUtilsObj.UserDetails[0].data.country == null ? '' : CommonUtilsObj.UserDetails[0].data.country);
  //     setState(CommonUtilsObj.UserDetails[0].data.state == null ? '' : CommonUtilsObj.UserDetails[0].data.state);
  //     setWebAddress(CommonUtilsObj.UserDetails[0].data.email == null ? '' : CommonUtilsObj.UserDetails[0].data.email);
  //     setPanNumber(CommonUtilsObj.UserDetails[0].data.panNumber == null ? '' : CommonUtilsObj.UserDetails[0].data.panNumber);
  //     setGstNumber(CommonUtilsObj.UserDetails[0].data.gstNumber == null ? '' : CommonUtilsObj.UserDetails[0].data.gstNumber);
  //     setUploadImageuri(CommonUtilsObj.UserDetails[0].data.businessLogo == null ? '' : Constant.ShowImage + CommonUtilsObj.UserDetails[0].data.businessLogo);

  // }

  // const regex = new RegExp("^[a-zA-Z]+$");

  const onPressEvent = () => {
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
      if (businessName == '') {
        flag = false;
        errorMsg.push(Message.businessName);
      }
      if (address == '') {
        flag = false;
        errorMsg.push(Message.address);
      }
      if (city == '') {
        flag = false;
        errorMsg.push(Message.city);
      }
      if (state == '') {
        flag = false;
        errorMsg.push(Message.state);
      }
      if (zipped == '') {
        flag = false;
        errorMsg.push(Message.zipped);
      }
      if (taluka == '') {
        flag = false;
        errorMsg.push(Message.taluka);
      }
      if (distric == '') {
        flag = false;
        errorMsg.push(Message.district);
      }
      if (country == '') {
        flag = false;
        errorMsg.push(Message.country);
      }
      if (panNumber != '' && panNumber.length != 10) {
        flag = false;
        errorMsg.push(Message.pancNumber);
      }
      if (gstNumber != '' && gstNumber.length != 15) {
        flag = false;
        errorMsg.push(Message.gstcNumber);
      }
      // if (panNumber == '') {
      //     flag = false;
      //     errorMsg.push(Message.panNumber);
      // }
      // if (gstNumber == '') {
      //     flag = false;
      //     errorMsg.push(Message.gstNumber);
      // }
      // if (uploadImageUri == '') {
      //     flag = false;
      //     errorMsg.push(Message.businessLogo);
      // }
      if (flag) {
        //   onSubmitData();
        if (route.params?.isEdit == false || route.params?.AgainEdit == true) {
          if (uploadImageUri != '') {
            // getUploadBusinessLogo();
            dispatch(
              uplodupdateBusinessDetails({
                firstName: firstName,
                lastName: lastName,
                businessName: businessName,
                address: address,
                city: city,
                state: state,
                country: country,
                zipped: zipped,
                taluka: taluka,
                district: distric,
                webAddress: webAddress,
                panNumber: panNumber,
                gstNumber: gstNumber,
                uploadImageUri: uploadImageUri,
              }),
            );
          } else {
            // onReSubmitData()
            dispatch({
              type: WITHOUT_LOGO_BUSINESSDETAILS_RESUBMIT,
              firstName: firstName,
              lastName: lastName,
              businessName: businessName,
              address: address,
              city: city,
              state: state,
              country: country,
              zipped: zipped,
              taluka: taluka,
              district: distric,
              deviceToken: route.params.deviceToken,
              webAddress: webAddress,
              panNumber: panNumber,
              gstNumber: gstNumber,
            });
          }
        } else {
          if (uploadImageUri != '') {
            dispatch({type: lodingtrue});
            // onUploadLogo();
            dispatch(
              uplodBusinessDetails({
                firstName: firstName,
                lastName: lastName,
                businessName: businessName,
                address: address,
                city: city,
                state: state,
                country: country,
                zipped: zipped,
                taluka: taluka,
                district: distric,
                deviceToken: route.params.deviceToken,
                webAddress: webAddress,
                panNumber: panNumber,
                gstNumber: gstNumber,
                uploadImageUri: uploadImageUri,
              }),
            );
          } else {
            // onSubmitData()
            dispatch({
              type: WITHOUT_LOGO_BUSINESSDETAILS,
              firstName: firstName,
              lastName: lastName,
              businessName: businessName,
              address: address,
              city: city,
              state: state,
              country: country,
              zipped: zipped,
              taluka: taluka,
              district: distric,
              deviceToken: route.params.deviceToken,
              webAddress: webAddress,
              panNumber: panNumber,
              gstNumber: gstNumber,
            });
          }
        }
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

  const onUploadLogo = async () => {
    console.log('uploadImageUri', uploadImageUri);
    setLoading(result.Loader.loading);
    var data = new FormData();
    data.append('image', {
      uri: uploadImageUri,
      type: 'image/jpeg',
      name: 'Logo.jpg',
    });
    console.log('FormData', data);
    let responseData = await PostApiImageWithToken(
      Constant.uploadImage + 'bl',
      data,
      route.params.deviceToken,
    );
    console.log('uploadImage', responseData);
    if (responseData.status == 200) {
      setLoading(false);
      onSubmitData(responseData.data.image);
    } else {
      setLoading(false);
      ErrorToast(responseData.message);
    }
  };

  const getUploadBusinessLogo = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadImageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    let response = await PostApiImage(Constant.uploadImage + 'bl', data);
    console.log('response..', response);
    // console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      onReSubmitData(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onSubmitData = async image => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        firstName: firstName,
        lastName: lastName,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        country: country,
        zipped: zipped,
        taluka: taluka == '' ? null : taluka,
        district: distric == '' ? null : distric,
        //  image: null,
        //  email: webAddress == '' ? null : webAddress,
        //  businessLogo: image,
        // panNumber: panNumber == '' ? null : panNumber,
        //  gstNumber: gstNumber == '' ? null : gstNumber
      };

      let apiData = '';

      if (webAddress != '') {
        console.log('gggggg', webAddress);
        apiData = {
          ...data,
          email: webAddress,
        };
      } else if (webAddress == '') {
        apiData = {
          ...data,
        };
      }
      if (uploadImageUri != '') {
        console.log('hhhhhhhhhh');
        apiData = {
          ...apiData,
          businessLogo: image,
        };
      }
      if (panNumber != '') {
        apiData = {
          ...apiData,
          panNumber: panNumber,
        };
      }
      if (gstNumber != '') {
        apiData = {
          ...apiData,
          gstNumber: gstNumber,
        };
      }

      console.log('apidata', apiData);

      const response = await postApiWithTocken(
        Constant.register,
        apiData,
        false,
        route.params.deviceToken,
      );
      console.log('response', response);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast(response.message);
        navigation.navigate('TermsAndCondition', {
          isEdit: true,
          deviceToken: route.params.deviceToken,
          isTerms: false,
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
  const onReSubmitData = async businessLogo => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        firstName: firstName,
        lastName: lastName,
        businessName: businessName,
        address: address,
        city: city,
        state: state,
        country: country,
        zipped: zipped,
        email: webAddress == '' ? null : webAddress,
        //  businessLogo: businessLogo,
        //  image: 'image',
        panNumber: panNumber == '' ? null : panNumber,
        gstNumber: gstNumber == '' ? null : gstNumber,
        taluka: taluka == '' ? null : taluka,
        district: distric == '' ? null : distric,
      };
      let apiData = '';
      if (uploadImageUri != '') {
        console.log('hhhhhhhhhh');
        apiData = {
          ...data,
          businessLogo: businessLogo,
        };
      } else {
        apiData = {
          ...data,
        };
      }
      // if (panNumber != '') {
      //     apiData = {
      //         ...apiData,
      //         panNumber: panNumber,
      //     }
      // } if (gstNumber != '') {
      //     apiData = {
      //         ...apiData,
      //         gstNumber: gstNumber,
      //     }
      // }

      console.log('apidata', apiData);
      const response = await PostApi(
        Constant.TermsAndCondition,
        apiData,
        false,
      );
      console.log('response', response);
      if (response.status == 200) {
        setLoading(false);
        SuccessToast(response.message);
        let userInfo = [];
        userInfo.push(response.data);
        if (Platform.OS === 'android') {
          setLoggedUserDetails(JSON.stringify(userInfo));
        } else {
          setLoggedUserDetails(userInfo);
        }
        setStoredCredentials(response.data.data);
        //  setLoginState(Constant.KLogin);
        setTimeout(() => {
          getLoggedUserDetails();
        }, 200);
        navigation.navigate('ProfileScreen', {});
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
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

  const getLocation = async value => {
    if (value.length == 6) {
      let response = await GetApi(
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${Number(value)}&key=${Constant.KGoogleMapAPIKey}`,
        `http://postalpincode.in/api/pincode/${value}`,
        // `https://api.worldpostallocations.com/pincode?postalcode=560094&countrycode=IN`,
      );
      console.log('ResLocation---------------', response);
      if (response.Status == 'Success') {
        setCityName(response.PostOffice);
        setError('');
      } else {
        setCityName([]);
        setError(response.Message);
        setCountry('');
        setCity('');
        setState('');
        setTaluka('');
        setDistric('');
      }
    } else {
      setCityName([]);
      setCountry('');
      setCity('');
      setState('');
      setTaluka('');
      setDistric('');
    }
  };
  const getLocations = async value => {
    if (value.length == 6) {
      let response = await GetApi(
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${Number(value)}&key=${Constant.KGoogleMapAPIKey}`,
        `http://postalpincode.in/api/pincode/${value}`,
        // `https://api.worldpostallocations.com/pincode?postalcode=560094&countrycode=IN`,
      );
      console.log('ResLocation---------------', response);
      if (response.Status == 'Success') {
        setCityName(response.PostOffice);
        setError('');
      } else {
        //  setCityName([]);
        setError(response.Message);
        //  setCountry('');
        //   setCity('');
        //   setState('');
        //   setTaluka('')
      }
    } else {
      //   setCity('');
      //  setState('');
      //  setCountry('');
    }
  };

  const getAddress = async (latitude, longitude) => {
    console.log('latitude', latitude, longitude);
    let response = await GetApi(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constant.KGoogleMapAPIKey}`,
    );
    //   console.log('ResLocation---------------', JSON.stringify(response));
    console.log(
      'ResLocation---------------',
      JSON.stringify(response.results[0]),
    );
    if (response.status == 'OK') {
      //   setPunchInAddress((response.results[0].formatted_address))
    }
  };

  const renderKeybordType = () => {
    if (gstNumber.length < 2) {
      return 'numeric';
    } else if (gstNumber.length > 2 && gstNumber.length < 6) {
      return 'default';
    } else if (gstNumber.length > 6 && gstNumber.length < 9) {
      return 'numeric';
    } else if (gstNumber.length > 9 && gstNumber.length < 12) {
      return 'default';
    } else if (gstNumber.length > 12 && gstNumber.length < 16) {
      return 'numeric';
    }
  };

  const renderKeybordTypep = () => {
    if (panNumber.length < 5) {
      return 'default';
    } else if (panNumber.length > 5 && panNumber.length < 8) {
      return 'numeric';
    } else if (panNumber.length == 9) {
      return 'default';
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.blue}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.blue} />
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      <View
        style={{
          flex: 1,
          // marginTop: 10,
          backgroundColor: colors.bgColor,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20, marginTop: 15, flex: 1}}>
            <View style={{alignItems: 'center'}}>
              {route.params.isEdit == true ? (
                <>
                  {uploadImageUri == '' ? (
                    <TouchableOpacity
                      onPress={() => setIsModalVisible(true)}
                      style={{
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 100,
                        width: 100,
                        borderRadius: 10,
                        backgroundColor: '#E8E9EA',
                        overflow: 'hidden',
                      }}>
                      <Image
                        style={{
                          height: 35,
                          width: 35,
                          tintColor: colors.gray,
                        }}
                        source={require('../../Assets/Icon/Upload.png')}
                      />
                      <Text
                        style={{marginTop: 5, fontSize: 12, color: 'black'}}>
                        Upload
                      </Text>
                      <Text style={{fontSize: 12, color: 'black'}}>
                        Business Logo
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        marginTop: 10,
                        alignItems: 'center',
                        height: 100,
                        width: 100,
                      }}
                      onPress={() => setIsModalVisible(true)}>
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 10,
                        }}
                        source={{uri: uploadImageUri}}
                      />
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <>
                  {uploadImageUri == '' ? null : ( // </TouchableOpacity> //     <Upload height={70} width={70} /> //     <Text style={{ fontSize: 16, color: 'black' }}>Upload Business Logo</Text> //     }}> //         borderColor: colors.blue //         borderRadius: 10, //         height: 100, width: '100%', //         //  paddingVertical: 20, //         alignItems: 'center', justifyContent: 'center', //         marginTop: 20, //         borderWidth: 2, //         borderStyle: 'dashed', //     style={{ // <TouchableOpacity onPress={() => setIsModalVisible(true)}
                    <View
                      style={{
                        //  borderStyle: 'dashed',
                        // borderWidth: 1,
                        marginTop: 10,
                        alignItems: 'center',
                        height: 100,
                        width: 100,
                      }}>
                      <Image
                        style={{
                          height: 100,
                          width: 100,
                          borderRadius: 10,
                        }}
                        source={{uri: uploadImageUri}}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
            <TextInput
              mode="outlined"
              value={firstName}
              // value={firstName}
              //   keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
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
              //  onChange={text => onChange({ text })}
              label="First Name *"
              placeholder="First Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              returnKeyType="next"
              ref={RefNo10}
              onSubmitEditing={() => RefNo11.current.focus()}
              blurOnSubmit={false}
              style={{marginTop: 15}}
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
              // onChange={value => onChange(value)}
              label="Last Name *"
              placeholder="Last Name"
              returnKeyType="next"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo11}
              onSubmitEditing={() => RefNo1.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={businessName}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setBusinessName(value.trim());
                } else {
                  setBusinessName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Business Name *"
              placeholder="Business Name"
              returnKeyType="next"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TextInput
                mode="outlined"
                value={zipped}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setZipped(value.trim());
                  } else {
                    setZipped(value.replace(/[^0-9 ]/g, ''));
                    getLocation(value);
                  }
                }}
                label="Pin Code *"
                placeholder="Pin Code"
                maxLength={6}
                keyboardType="numeric"
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo2}
                onSubmitEditing={() => RefNo3.current.focus()}
                blurOnSubmit={false}
              />
              {route.params.isEdit == false ? (
                <TextInput
                  mode="outlined"
                  value={city}
                  editable={route.params?.isEdit == false ? false : true}
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  onChangeText={value => {
                    if (value.includes(' ')) {
                      setDistric(value.trim());
                    } else {
                      setDistric(value.replace(/[^a-zA-Z ]/g, ''));
                    }
                  }}
                  label="City *"
                  placeholder="City"
                  style={{flex: 1}}
                  returnKeyType="next"
                  keyboardType={
                    Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                  }
                  ref={RefNo4}
                  onSubmitEditing={() => RefNo5.current.focus()}
                  blurOnSubmit={false}
                />
              ) : (
                <View style={{marginTop: 6, flex: 1}}>
                  <Dropdown
                    placeholder="City"
                    label="City"
                    style={{
                      borderColor: isFocusdropdown1 ? colors.blue : 'gray',
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 8,
                      height: 58,

                      backgroundColor: 'white',
                    }}
                    selectedTextStyle={{color: 'black'}}
                    maxHeight={200}
                    data={cityName}
                    value={city}
                    labelField="Name"
                    valueField="Name"
                    autoScroll={true}
                    onFocus={() => setIsFocusdropdown1(true)}
                    onBlur={() => setIsFocusdropdown1(false)}
                    onChange={item => {
                      setCity(item.Name);
                      setState(item.State);
                      setTaluka(item.Taluk);
                      setDistric(item.District);
                      setCountry(item.Country);

                      setIsFocusdropdown1(false);
                    }}
                    renderRightIcon={() => (
                      <Image
                        source={require('../../Assets/Icon/DropDown.png')}
                        style={{height: 20, width: 20}}
                      />
                    )}
                  />
                </View>
              )}
            </View>
            {error != '' && <Text style={{color: 'red'}}>{error}</Text>}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: error == '' ? 20 : 4,
              }}>
              <TextInput
                mode="outlined"
                value={taluka}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setTaluka(value.trim());
                  } else {
                    setTaluka(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="Taluka *"
                placeholder="Taluka"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo3}
                onSubmitEditing={() => RefNo4.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                mode="outlined"
                value={distric}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setDistric(value.trim());
                  } else {
                    setDistric(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="District *"
                placeholder="District"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1}}
                returnKeyType="next"
                ref={RefNo4}
                onSubmitEditing={() => RefNo5.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TextInput
                mode="outlined"
                value={state}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setState(value.trim());
                  } else {
                    setState(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="State *"
                placeholder="State"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo4}
                onSubmitEditing={() => RefNo5.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                mode="outlined"
                value={country}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setCountry(value.trim());
                  } else {
                    setCountry(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="Country *"
                placeholder="Country"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1}}
                returnKeyType="next"
                ref={RefNo5}
                onSubmitEditing={() => RefNo6.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <TextInput
              mode="outlined"
              value={address}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setAddress(value.trim());
                } else {
                  setAddress(removeEmojis(value));
                }
              }}
              label="Address *"
              placeholder="Address"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo6}
              //  maxHeight={100}
              //  multiline
              numberOfLines={2}
              onSubmitEditing={() => RefNo7.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={webAddress}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setWebAddress(value.trim());
                } else {
                  setWebAddress(removeEmojis(value));
                }
              }}
              label="Web Address"
              placeholder="Web Address"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo7}
              onSubmitEditing={() => RefNo8.current.focus()}
              blurOnSubmit={false}
            />
            {/* <TextInput
                            mode="outlined"
                            value={phone}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setPhone(value); }}
                            label="Phone"
                            placeholder="Phone"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo8}
                            onSubmitEditing={() => RefNo9.current.focus()}
                            blurOnSubmit={false}
                        /> */}
            <TextInput
              mode="outlined"
              value={panNumber}
              autoCapitalize="characters"
              keyboardType={renderKeybordTypep()}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value.includes(' ')) {
                  setPanNumber(value.trim());
                } else {
                  setPanNumber(
                    value.toUpperCase().replace(/[^a-zA-Z 0-9 ]/g, ''),
                  );
                }
              }}
              label="Pan Number"
              placeholder="Pan Number"
              maxLength={10}
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo8}
              onSubmitEditing={() => RefNo9.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={gstNumber}
              autoCapitalize="characters"
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value.includes(' ')) {
                  setGstNumber(value.trim());
                } else {
                  setGstNumber(
                    value.toUpperCase().replace(/[^a-zA-Z 0-9 ]/g, ''),
                  );
                }
              }}
              label="GST Number"
              placeholder="GST Number"
              //   keyboardType={renderKeybordType()}
              maxLength={15}
              style={{marginTop: 20}}
              returnKeyType="done"
              ref={RefNo9}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
          </View>
          <View style={{margin: 20}}>
            {route.params?.isEdit == true ? (
              route.params?.AgainEdit == true ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomBorderButton
                      text="cancel"
                      onPress={() => navigation.navigate('ProfileScreen')}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton text="Save" onPress={() => onPressEvent()} />
                  </View>
                </View>
              ) : (
                <CustomButton
                  text="save"
                  onPress={() => {
                    onPressEvent();
                    // navigation.navigate('TermsAndCondition', {
                    //     isEdit: true
                    // })
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
                      navigation.push('BusinessDetailss', {
                        isEdit: true,
                        AgainEdit: true,
                      });
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          {/* <View style={{ marginBottom: 20, marginTop: 20, marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 20 }}>
                            <CustomBorderButton text='cancel' />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomButton text={route.params?.isEdit == true ? 'edit' : 'add'} onPress={() => navigation.navigate('TermsAndCondition')} />
                        </View>
                    </View> */}
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
    </SafeAreaView>
  );
}
