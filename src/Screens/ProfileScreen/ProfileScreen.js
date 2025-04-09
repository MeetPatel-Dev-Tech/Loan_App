import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  // Image,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Image,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
// import {Image} from 'react-native-elements';
import userDefaults from 'react-native-user-defaults';
import DefaultPreference from 'react-native-default-preference';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import {
  ArrowIcon,
  Bd,
  Help,
  LogOuts,
  Settigss,
  Tc,
} from '../../CommonFiles/SvgFile';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import Constant from '../../CommonFiles/Constant';
import {
  CommonUtilsObj,
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import {GetApi, PostApi, PostApiImage} from '../../Api/Api';
import NetInfo from '@react-native-community/netinfo';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import {
  loadingfalse,
  lodingtrue,
  LOGOUT,
  USER_DETAILS,
  USER_LOGGED_OUT,
} from '../../Redux/ReduxConstant';

export default function ProfileScreen({navigation}) {
  const result = useSelector(state => state);
  const dispatch = useDispatch();
  console.log('profile-result', result);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibles, setIsModalVisibles] = useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState(
    result.userDetails[0].image == null ||
      result.userDetails[0].image == 'default.png'
      ? ''
      : Constant.ShowImage + result.userDetails[0].image,
  );
  // const [uploadImageUri, setUploadImageuri] = useState(
  //   CommonUtilsObj.UserDetails[0].data.image == null ||
  //     CommonUtilsObj.UserDetails[0].data.image == 'default.png'
  //     ? ''
  //     : Constant.ShowImage + CommonUtilsObj.UserDetails[0].data.image,
  // );
  const [netInfo, setNetInfo] = useState(true);
  const [totalLoanAmt, setTotalLoanAmt] = useState(0);
  const [totalCloseLoanAmt, setTotalCloseLoanAmt] = useState(0);
  const [name, setName] = useState(
    CommonUtilsObj.UserDetails[0].data.firstName +
      ' ' +
      CommonUtilsObj.UserDetails[0].data.lastName,
  );
  const [visible, setVisible] = useState(false);
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  const {header, setHeader} = useContext(CredentialsContext);
  const [userDetails, setUserDetails] = useState(result.userDetails[0]);

  const data = [
    {
      id: 1,
      name: 'Business Details',
      image: require('../../Assets/Icon/Business.png'),
    },
    {
      id: 2,
      name: 'Signature',
      image: require('../../Assets/Icon/Signature.png'),
    },
    {
      id: 3,
      name: 'Terms & Conditions',
      image: require('../../Assets/Icon/TermsCon.png'),
    },
    {id: 4, name: 'Help', image: require('../../Assets/Icon/Business.png')},
    {
      id: 5,
      name: 'Delete Account',
      image: require('../../Assets/Icon/Delete.png'),
    },
    {id: 6, name: 'Log Out', image: require('../../Assets/Icon/LogOut.png')},
  ];

  // useEffect(() => {
  //     getProfile();
  //     console.log('ff', CommonUtilsObj.UserDetails[0])
  // }, []);

  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useFocusEffect(
    React.useCallback(() => {
      // getProfile();
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo(true);
        } else {
          setNetInfo('offline');
        }
      });
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          setNetInfo(true);
          getProfile();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerLeft: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: -1,
            }}>
            <Image
              source={require('../../Assets/Image/logo.png')}
              style={{height: 40, width: 40}}
            />
            <Text
              style={{
                fontWeight: '500',
                fontSize: 20,
                color: 'white',
                marginLeft: 5,
              }}>
              {CommonUtilsObj.UserDetails[0].data.businessName}
            </Text>
          </View>
        ),
      });
    }, [userDetails]),
  );

  useFocusEffect(
    React.useCallback(() => {
      getallcustomerLoan();
      getallcustomerCloseLoan();
    }, []),
  );

  const getallcustomerLoan = async () => {
    if (netInfo == true) {
      const response = await GetApi(Constant.LoanbyStatus + 0);
      console.log('response66666666666666666666666', response);
      if (response.status == 200) {
        if (response.data != '') {
          let TotalLoanAmount = 0;
          for (let num of response.data) {
            TotalLoanAmount = TotalLoanAmount + num.loanAmount;
            setTotalLoanAmt(TotalLoanAmount);
          }
          console.log('outstandingAmt', TotalLoanAmount);
        } else {
          setTotalLoanAmt(0);
        }
      } else {
        setLoading(false);
        //  ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const getallcustomerCloseLoan = async () => {
    if (netInfo == true) {
      const response = await GetApi(Constant.LoanbyStatus + 1);
      console.log('response', response);
      if (response.status == 200) {
        if (response.data != '') {
          let CloseLoanAmt = 0;
          for (let num of response.data) {
            CloseLoanAmt = CloseLoanAmt + num.loanAmount;
            setTotalCloseLoanAmt(CloseLoanAmt);
          }
          console.log('outstandingAmt', CloseLoanAmt);
        } else {
          setTotalCloseLoanAmt(0);
        }
      } else {
        setLoading(false);
        //   ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //         <Image
  //           source={require('../../Assets/Image/logo.png')}
  //           style={{height: 40, width: 40}}
  //         />
  //         <Text
  //           style={{
  //             fontWeight: '500',
  //             fontSize: 20,
  //             color: 'white',
  //             marginLeft: 5,
  //           }}>
  //           {CommonUtilsObj.UserDetails[0].data.businessName}
  //         </Text>
  //       </View>
  //     ),
  //   });
  // }, []);

  const getProfile = async () => {
    if (netInfo == true) {
      const response = await GetApi(Constant.getprofile);
      console.log('response..', response);
      if (response.status == 200) {
        setName(response.data.firstName + ' ' + response.data.lastName);
        setUploadImageuri(
          response.data.image == null || response.data.image == 'default.png'
            ? ''
            : Constant.ShowImage + response.data.image,
        );
        setUserDetails(response.data);
      } else {
        setLoading(false);
        //  ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const pressEvent = name => {
    if (name == 'Business Details') {
      return navigation.navigate('BusinessDetailss', {
        isEdit: false,
      });
    } else if (name == 'Terms & Conditions') {
      return navigation.navigate('TermsAnsConditionDetailss');
    } else if (name == 'Delete Account') {
      return setIsDeleteAccountModalVisible(true);
    } else if (name == 'Log Out') {
      return (
        // setHeader(true),
        setIsModalVisible(true)
        // LayoutAnimation.configureNext({
        //   duration: 150,
        //   create: {
        //     type: 'linear',
        //     property: 'opacity',
        //     onAnimationDidFail: onAnimationDidEnd(),
        //   },
        //   update: {
        //     type: 'linear',
        //     springDamping: 0.4,
        //     onAnimationDidFail: onAnimationDidEnd(),
        //   },
        //   delete: {
        //     type: 'linear',
        //     property: 'scaleXY',
        //     onAnimationDidFail: onAnimationDidEnd(),
        //   },
        // }),
        // setIsModalVisibles(true)
      );
    } else if (name == 'Help') {
      return navigation.navigate('Help');
    } else if (name == 'Signature') {
      return navigation.navigate('AddSignature');
    }
  };

  const onAnimationDidEnd = () => {
    console.log('end');
    setIsModalVisible(true);
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
        console.log(
          'fileSize.........................',
          response.assets[0].fileSize,
        );
        if (response.assets[0].fileSize < 20971520) {
          const source = {uri: 'data:image/jpeg;base64,' + response.base64};
          // setUploadImageuri(response.assets[0].uri);
          UploadImage(response.assets[0].uri);
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
        console.log('uri', response.assets[0].uri);
        console.log('fileSize..................', response.assets[0].fileSize);
        if (response.assets[0].type != 'image/gif') {
          if (response.assets[0].fileSize < 20971520) {
            const source = {uri: 'data:image/jpeg;base64,' + response.base64};
            // setUploadImageuri(response.assets[0].uri);
            UploadImage(response.assets[0].uri);
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

  const renderColor = name => {
    if (name == 'Business Details') {
      return '#FBF7EB';
    } else if (name == 'Setting') {
      return '#F8EFFF';
    } else if (name == 'Terms & Conditions') {
      return '#EDFBFE';
    } else if (name == 'Help') {
      return '#F8EFFF';
    } else if (name == 'Log Out') {
      return '#F1FDF3';
    }
  };

  const renderCustomerDetails = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => pressEvent(item.name)}
        style={{
          // backgroundColor: 'white',
          // paddingHorizontal: 5,
          paddingVertical: 15,
          // shadowColor: 'gray',
          // shadowOffset: {width: 0, height: 1},
          // shadowOpacity: 1,
          // shadowRadius: 2,
          // elevation: 3,
          borderBottomWidth: item.name == 'Log Out' ? 0 : 0.5,
          borderColor: colors.blue,
          marginVertical: 3,
          // borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <View
          style={{
            marginRight: 10,
            backgroundColor: '#E6F4FF',
            padding: 7,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 0.5},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 2,
            borderRadius: 5,
          }}>
          <Image
            source={item.image}
            style={{height: 22, width: 22, tintColor: colors.blue}}
          />
        </View>
        <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>
          {item.name}
        </Text>
        <View
          style={
            {
              // backgroundColor: '#F3F3F3',
              // padding: 5,
              // borderRadius: 5,
              // shadowColor: 'gray',
              // shadowOffset: {width: 0, height: 0.5},
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 3,
            }
          }>
          <ArrowIcon height={15} width={15} />
        </View>
      </TouchableOpacity>
    );
  };

  const onLogoutPress = () => {
    dispatch({type: lodingtrue});
    if (Platform.OS === 'android') {
      DefaultPreference.clear(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            dispatch({type: loadingfalse});
            // setStoredCredentials(null);
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            setHeader(false);
            SuccessToast('Logout successfully');
            console.log('clear data...');
          }, 1000);
        })
        .catch(function (err) {
          console.log(err);
          ErrorToast(err);
        });
    } else {
      userDefaults
        .remove(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            dispatch({type: loadingfalse});
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            setHeader(false);
            SuccessToast('Logout successfully');
            console.log('clear data...');
          }, 500);
        })
        .catch(function (err) {
          console.log(err);
          ErrorToast(err);
        });
    }
  };

  const UploadImage = async image => {
    if (netInfo == true) {
      dispatch({type: lodingtrue});
      var data = new FormData();
      data.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
      // data.append('image',
      //     image,
      //     'profile.jpg',
      // );
      let response = await PostApiImage(Constant.uploadImage + 'user', data);
      console.log('response..', response);
      if (response.status == 200) {
        dispatch({type: loadingfalse});
        setUploadImageuri(image);
        uploadProfile(response.data.image);
      } else {
        dispatch({type: loadingfalse});
        ErrorToast(response.message);
      }
    } else {
      dispatch({type: loadingfalse});
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const uploadProfile = async Profile => {
    const data = {
      image: Profile,
    };
    const response = await PostApi(Constant.TermsAndCondition, data, false);
    console.log('response2', response.data.data.image);
    if (response.status == 200) {
      setLoading(false);
      SuccessToast('profile image successfully update');
      // getProfile();
      //  setUploadImageuri(Constant.ShowImage + response.data.data.image);
      let userInfo = [];
      userInfo.push(response.data);
      if (Platform.OS === 'android') {
        setLoggedUserDetails(JSON.stringify(userInfo));
      } else {
        setLoggedUserDetails(userInfo);
      }
      // setStoredCredentials(response.data.data);
      dispatch({type: USER_DETAILS, data: response.data.data});

      //  setLoginState(Constant.KLogin);
      setTimeout(() => {
        getLoggedUserDetails();
      }, 200);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onDeletePress = async () => {
    dispatch({type: lodingtrue});
    const response = await GetApi(Constant.Delete);
    console.log('delete', response);
    if (response.status == 200) {
      DataClear(response.message);
    } else {
      dispatch({type: lodingtrue});
      ErrorToast(response.message);
    }
  };

  const DataClear = msg => {
    if (Platform.OS === 'android') {
      DefaultPreference.clear(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            SuccessToast(msg);
            dispatch({type: loadingfalse});
            // setStoredCredentials(null);
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            console.log('clear data...');
          }, 1000);
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      userDefaults
        .remove(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            SuccessToast(msg);
            dispatch({type: loadingfalse});
            // setStoredCredentials(null);
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            console.log('clear data...');
          }, 500);
        })
        .catch(function (err) {
          console.log(err);
          dispatch({type: loadingfalse});
          ErrorToast(err);
        });
    }
  };

  const animatedValue = new Animated.Value(0);

  const fadeIn = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: isModalVisibles == false ? colors.blue : 'black',
        flex: 1,
      }}>
      <ProgressLoader
        visible={result.Loader.loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      <StatusBar
        key={isModalVisibles}
        barStyle="default"
        backgroundColor={isModalVisibles == false ? colors.blue : 'black'}
      />
      {/* <View style={{ paddingBottom: 20, paddingTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}>Welcome to Loan App</Text>
            </View> */}
      <View
        style={{
          backgroundColor: colors.primaryBlueBackground,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
          // transform: scale(0.75),
        }}>
        <View
          style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
          <View style={{height: 80, width: 80}}>
            <Image
              source={
                uploadImageUri == ''
                  ? require('../../Assets/Image/profile.png')
                  : {uri: uploadImageUri}
              }
              style={{height: 80, width: 80, borderRadius: 10}}
              // PlaceholderContent={<ActivityIndicator />}
            />
            <TouchableOpacity
              onPress={() => {
                setVisible(true);
              }}
              style={{position: 'absolute', bottom: -0, right: -0}}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: 14.5,
                  width: 14.5,
                  borderTopStartRadius: 20,
                }}></View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setVisible(true);
              }}
              style={{position: 'absolute', bottom: -13, right: -13}}>
              {/* <View
                style={{
                  backgroundColor: 'white',
                  padding: 2,
                  borderRadius: 20,
                }}> */}
              <Image
                source={require('../../Assets/Icon/Add.png')}
                style={{height: 25, width: 25}}
              />
              {/* </View> */}
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginLeft: 15,
            }}>
            <Text
              numberOfLines={2}
              style={{
                // marginTop: 20,
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
                // textAlign: 'center',
              }}>
              {name}
            </Text>
            <Text style={{marginTop: 5}}>{userDetails.businessName}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 10,
            marginHorizontal: 20,
            marginTop: 20,
            alignItems: 'center',
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: colors.gray2}}>
              Total loan amount
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 20,
                color: 'black',
                fontWeight: 'bold',
                // textAlign: 'center',
              }}>
              {Constant.ruppy} {totalLoanAmt}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderLeftWidth: 0.5,
              paddingLeft: 5,
              alignItems: 'center',
            }}>
            {/* alignItems: 'center' */}
            <Text style={{fontSize: 12, color: colors.gray2}}>
              Total close loan amount
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 20,
                color: 'black',
                fontWeight: 'bold',
                // textAlign: 'center',
              }}>
              {Constant.ruppy} {totalCloseLoanAmt}
            </Text>
          </View>
        </View>
        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderCustomerDetails}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
          setIsModalVisible(false);
          // setIsModalVisibles(false)
          // LayoutAnimation.configureNext({
          //   duration: 250,
          //   create: {type: 'linear', property: 'opacity'},
          //   update: {type: 'linear', springDamping: 1},
          //   delete: {type: 'linear', property: 'opacity'},
          // });
        }}
        swipeDirection="down"
        onSwipeComplete={() => {
          setIsModalVisible(false);
          // setIsModalVisibles(false)
          // LayoutAnimation.configureNext({
          //   duration: 250,
          //   create: {type: 'linear', property: 'opacity'},
          //   update: {type: 'linear', springDamping: 1},
          //   delete: {type: 'linear', property: 'opacity'},
          // });
        }}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 30,
              paddingTop: 15,
              paddingBottom: 10,
            }}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Image
                source={require('../../Assets/Icon/LogOut.png')}
                style={{height: 50, width: 50, tintColor: colors.blue}}
              />
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                Logout Account
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 30,
                fontSize: 16,
                marginHorizontal: 30,
              }}>
              Are you sure You want Logout this account?
            </Text>
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="no"
                  onPress={() => {
                    setIsModalVisible(false);
                    // LayoutAnimation.configureNext({
                    //   duration: 300,
                    //   create: {type: 'linear', property: 'opacity'},
                    //   update: {type: 'linear', springDamping: 1},
                    //   delete: {type: 'linear', property: 'opacity'},
                    // }),
                    // setHeader(false),
                    // setIsModalVisibles(false);
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  text="yes"
                  onPress={() => {
                    onLogoutPress();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={visible}
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
                setVisible(false);
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
                setVisible(false);
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
              setVisible(false);
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
        isVisible={isDeleteAccountModalVisible}
        onBackdropPress={() => setIsDeleteAccountModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => {
          setIsDeleteAccountModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 30,
              paddingTop: 15,
              paddingBottom: 10,
            }}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Image
                source={require('../../Assets/Icon/Delete.png')}
                style={{height: 50, width: 50, tintColor: colors.blue}}
              />
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 10,
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'black',
                }}>
                Delete Account
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginTop: 30,
                fontSize: 16,
                marginHorizontal: 30,
              }}>
              Are you sure you want delete your account?
            </Text>
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 40,
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="no"
                  onPress={() => setIsDeleteAccountModalVisible(false)}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  text="yes"
                  onPress={() => {
                    onDeletePress();
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
