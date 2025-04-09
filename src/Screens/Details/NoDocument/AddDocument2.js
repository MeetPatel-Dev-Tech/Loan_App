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
  FlatList,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import {Upload} from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import {GetApi, PostApi, PostApiImage} from '../../../Api/Api';
import Message from '../../../CommonFiles/Message';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function AddDocument2({navigation, route}) {
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [zipped, setZipped] = useState('');
  const [select, setSelect] = useState('');
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [uploadImageUri2, setUploadImageuri2] = useState('');
  const [uploadPanImage, setUploadPanImage] = useState('');
  const [uploadDrivingImage, setUploadDrivingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
  const [documents, setDocuments] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  // const [panNumber, setPanNumber] = useState('');

  const listDocument = [
    {name: 'AadharCard'},
    {name: 'PanCard'},
    {name: 'DrivingLicence'},
  ];

  const RefNo1 = useRef();
  const RefNo2 = useRef();

  useEffect(() => {
    if (route.params.isEdit == false || route.params.AgainEdit == true) {
      getAddharCard();
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

  const getAddharCard = () => {
    setAadharNumber(
      route.params.data.aadharNumber == null
        ? ''
        : route.params.data.aadharNumber,
    );
    setUploadImageuri(
      route.params.data.aadharFront == null
        ? ''
        : Constant.ShowImage + route.params.data.aadharFront,
    );
    setUploadImageuri2(
      route.params.data.aadharBack == null
        ? ''
        : Constant.ShowImage + route.params.data.aadharBack,
    );
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
          if (documents == 'AadharCard') {
            if (select == 'Front') {
              setUploadImageuri(response.assets[0].uri);
              setModalOption('');
            } else {
              setUploadImageuri2(response.assets[0].uri);
              setModalOption('');
            }
          } else if (documents == 'PanCard') {
            setUploadPanImage(response.assets[0].uri);
            setModalOption('');
          } else if (documents == 'DrivingLicence') {
            setUploadDrivingImage(response.assets[0].uri);
            setModalOption('');
          }
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
            if (documents == 'AadharCard') {
              if (select == 'Front') {
                setUploadImageuri(response.assets[0].uri);
                setModalOption('');
              } else {
                setUploadImageuri2(response.assets[0].uri);
                setModalOption('');
              }
            } else if (documents == 'PanCard') {
              setUploadPanImage(response.assets[0].uri);
              setModalOption('');
            } else if (documents == 'DrivingLicence') {
              setUploadDrivingImage(response.assets[0].uri);
              setModalOption('');
            }
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
      if (documents == '') {
        flag = false;
        errorMsg.push(Message.selectdoc);
      }
      if (documents == 'AadharCard') {
        if (aadharNumber == '') {
          flag = false;
          errorMsg.push(Message.aadahrNumber);
        } else if (aadharNumber.length != 14) {
          flag = false;
          errorMsg.push(Message.aadahrvNumber);
        }
        if (uploadImageUri == '') {
          flag = false;
          errorMsg.push(Message.aadharFront);
        }
        if (uploadImageUri2 == '') {
          flag = false;
          errorMsg.push(Message.aadharBack);
        }
      } else if (documents == 'PanCard') {
        if (panNumber == '') {
          flag = false;
          errorMsg.push(Message.pancards);
        } else if (panNumber.length != 10) {
          flag = false;
          errorMsg.push(Message.panNumbers);
        }
        if (uploadPanImage == '') {
          flag = false;
          errorMsg.push(Message.pancard);
        }
      } else if (documents == 'DrivingLicence') {
        if (drivingLicense == '') {
          flag = false;
          errorMsg.push(Message.drivingLicenseNumber);
        } else if (drivingLicense.length != 15) {
          flag = false;
          errorMsg.push(Message.drivingvLicenseNumber);
        }
        if (uploadDrivingImage == '') {
          flag = false;
          errorMsg.push(Message.drivingLicense);
        }
      }
      if (flag) {
        if (documents == 'AadharCard') {
          UploadFrontImage();
        } else if (documents == 'PanCard') {
          UploadPanImage();
        } else if (documents == 'DrivingLicence') {
          uploadDrivingImages();
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

  const UploadFrontImage = async () => {
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
    let response = await PostApiImage(Constant.uploadImage + 'aadhar', data);
    console.log('response..', response);
    //  console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      UploadBackImage(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };
  const UploadBackImage = async Front => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadImageUri2,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'aadhar', data);
    console.log('response..', response);
    // console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      onAadharSubmit(response.data.image, Front);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onAadharSubmit = async (Back, Front) => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        applicationStatus: 4,
        aadharNumber: aadharNumber,
        aadharFront: Front,
        aadharBack: Back,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('ShowDocument', {
          id: route.params.id,
          loanType: route.params.loanType,
        });
        SuccessToast('AadharCard Add Successfully');
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
      setLoading(false);
    }
  };

  const UploadPanImage = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadPanImage,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'dl', data);
    console.log('response..', response);
    // console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      onPanSubmit(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onPanSubmit = async panImage => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        applicationStatus: 4,
        pancard: panNumber,
        pancardimage: panImage,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('ShowDocument', {
          //   isNext: true,
          id: route.params.id,
          loanType: route.params.loanType,
        });
        SuccessToast('PanCard Add Successfully');
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const uploadDrivingImages = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: uploadDrivingImage,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'dl', data);
    console.log('response..', response);
    // console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      onDrivingUpload(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onDrivingUpload = async DrivingImage => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        applicationStatus: 4,
        drivingLicense: drivingLicense,
        drivingLicenseimage: DrivingImage,
      };
      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('ShowDocument', {
          //  isNext: true,
          id: route.params.id,
          loanType: route.params.loanType,
        });
        SuccessToast('Driving Licence Update Successfully');
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const renderKeybordType = () => {
    if (panNumber.length < 5) {
      return 'default';
    } else if (panNumber.length > 5 && panNumber.length < 8) {
      return 'numeric';
    } else if (panNumber.length == 9) {
      return 'default';
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
            <View style={{marginTop: 20}}>
              <Dropdown
                placeholder="Documents"
                label="Documents"
                style={{
                  borderColor: isFocusdropdown1 ? colors.blue : 'gray',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  height: 58,
                  marginTop: 20,
                  //  backgroundColor: '#ECECEC'
                }}
                // selectedTextStyle={{color: Constant.primaryGreen}}
                maxHeight={200}
                data={listDocument}
                value={documents}
                labelField="name"
                valueField="name"
                autoScroll={true}
                onFocus={() => setIsFocusdropdown1(true)}
                onBlur={() => setIsFocusdropdown1(false)}
                onChange={item => {
                  setDocuments(item.name);
                  setIsFocusdropdown1(false);
                }}
                renderRightIcon={() => (
                  <Image
                    source={require('../../../Assets/Icon/DropDown.png')}
                    style={{height: 20, width: 20}}
                  />
                )}
              />
            </View>

            {documents == 'AadharCard' && (
              <>
                <TextInput
                  mode="outlined"
                  value={aadharNumber}
                  editable={route.params?.isEdit == false ? false : true}
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  onChangeText={value => {
                    let formattedText = value.split(' ').join('');
                    if (formattedText.length > 0) {
                      formattedText = formattedText
                        .match(new RegExp('.{1,4}', 'g'))
                        .join(' ');
                    }
                    if (value[0]?.includes(' ')) {
                      setAadharNumber(formattedText.trim());
                    } else {
                      setAadharNumber(formattedText.replace(/[^0-9 \s]/, ''));
                      // setAadharNumber(value.replace(/[^0-9]/, '').replace(/(\d{4})/g, '$1 '))
                    }
                  }}
                  label="Aadhar Number *"
                  placeholder="Aadhar Number"
                  returnKeyType="done"
                  keyboardType="numeric"
                  maxLength={14}
                  style={{marginTop: 20}}
                  ref={RefNo1}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={false}
                />
                <Text
                  style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                  Aadhar Front
                </Text>

                <>
                  {uploadImageUri == '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsModalVisible(true), setSelect('Front');
                      }}
                      style={{
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        //  paddingVertical: 20,
                        height: 110,
                        borderRadius: 10,
                        borderColor: colors.blue,
                      }}>
                      <Upload height={70} width={70} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        //  borderStyle: 'dashed',
                        borderWidth: 1,
                        marginTop: 20,
                        backgroundColor: '#EDFBFE',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 110,
                        borderRadius: 10,
                        //   borderColor: colors.blue
                      }}
                      onPress={() => {
                        setIsModalVisible(true), setSelect('Front');
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 108, width: '100%'}}
                        source={{uri: uploadImageUri}}
                      />
                    </TouchableOpacity>
                  )}
                  <Text
                    style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                    Aadhar Back
                  </Text>
                  {uploadImageUri2 == '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsModalVisible(true), setSelect('Back');
                      }}
                      style={{
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        //  paddingVertical: 20,
                        height: 110,
                        borderRadius: 10,
                        borderColor: colors.blue,
                      }}>
                      <Upload height={70} width={70} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        //  borderStyle: 'dashed',
                        borderWidth: 1,
                        marginTop: 20,
                        backgroundColor: '#EDFBFE',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 110,
                        borderRadius: 10,
                        //   borderColor: colors.blue
                      }}
                      onPress={() => {
                        setIsModalVisible(true), setSelect('Back');
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 108, width: '100%'}}
                        source={{uri: uploadImageUri2}}
                      />
                    </TouchableOpacity>
                  )}
                </>
              </>
            )}

            {documents == 'PanCard' && (
              <>
                <TextInput
                  mode="outlined"
                  value={panNumber.replace(/[^\w\s]/gi, '')}
                  editable={route.params?.isEdit == false ? false : true}
                  autoCapitalize="characters"
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  onChangeText={value => {
                    if (value.includes(' ')) {
                      setPanNumber(value.trim());
                    } else {
                      setPanNumber(value.toUpperCase());
                    }
                  }}
                  label="PanCard Number *"
                  placeholder="PanCard Number"
                  maxLength={10}
                  //   keyboardType={renderType()}
                  returnKeyType="done"
                  keyboardType={renderKeybordType()}
                  style={{marginTop: 20}}
                  ref={RefNo1}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={false}
                />
                {uploadPanImage == '' ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(true);
                    }}
                    style={{
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      marginTop: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      //  paddingVertical: 20,
                      height: 110,
                      borderRadius: 10,
                      borderColor: colors.blue,
                    }}>
                    <Upload height={70} width={70} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      //  borderStyle: 'dashed',
                      borderWidth: 1,
                      marginTop: 20,
                      backgroundColor: '#EDFBFE',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 110,
                      borderRadius: 10,
                      //   borderColor: colors.blue
                    }}
                    onPress={() => {
                      setIsModalVisible(true);
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 108, width: '100%'}}
                      source={{uri: uploadPanImage}}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}

            {documents == 'DrivingLicence' && (
              <>
                <TextInput
                  mode="outlined"
                  value={drivingLicense.replace(/[^\w\s]/gi, '')}
                  autoCapitalize="characters"
                  editable={route.params?.isEdit == false ? false : true}
                  theme={
                    route.params?.isEdit == false
                      ? Constant.disableTheme
                      : Constant.theme
                  }
                  onChangeText={value => {
                    if (value.includes(' ')) {
                      setDrivingLicense(value.trim());
                    } else {
                      setDrivingLicense(value.toUpperCase());
                    }
                  }}
                  label="DrivingLicence Number *"
                  placeholder="DrivingLicence Number"
                  returnKeyType="done"
                  maxLength={15}
                  style={{marginTop: 20}}
                  ref={RefNo1}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={false}
                />
                <>
                  {uploadDrivingImage == '' ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsModalVisible(true);
                      }}
                      style={{
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        marginTop: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        //  paddingVertical: 20,
                        height: 110,
                        borderRadius: 10,
                        borderColor: colors.blue,
                      }}>
                      <Upload height={70} width={70} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        //  borderStyle: 'dashed',
                        borderWidth: 1,
                        marginTop: 20,
                        backgroundColor: '#EDFBFE',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 110,
                        borderRadius: 10,
                        //   borderColor: colors.blue
                      }}
                      onPress={() => {
                        setIsModalVisible(true);
                      }}>
                      <Image
                        resizeMode="contain"
                        style={{height: 108, width: '100%'}}
                        source={{uri: uploadDrivingImage}}
                      />
                    </TouchableOpacity>
                  )}
                </>
              </>
            )}
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
            <CustomButton text="save" onPress={() => onValidate()} />
          </View>
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
