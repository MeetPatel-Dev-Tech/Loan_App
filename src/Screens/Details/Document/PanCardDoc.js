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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import {Upload} from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import Message from '../../../CommonFiles/Message';
import {PostApi, PostApiImage} from '../../../Api/Api';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function PanCardDoc({navigation, route}) {
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [zipped, setZipped] = useState('');
  const [select, setSelect] = useState('');
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

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
          //  ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  const getAddharCard = () => {
    setPanNumber(
      route.params.data.pancard == null ? '' : route.params.data.pancard,
    );
    setUploadImageuri(
      route.params.data.pancardimage == null
        ? ''
        : Constant.ShowImage + route.params.data.pancardimage,
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
      if (panNumber == '') {
        flag = false;
        errorMsg.push(Message.pancards);
      }
      if (uploadImageUri == '') {
        flag = false;
        errorMsg.push(Message.pancard);
      }
      if (flag) {
        // onSubmitData();
        UploadPanImage();
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

  const UploadPanImage = async () => {
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
    let response = await PostApiImage(Constant.uploadImage + 'dl', data);
    console.log('response..', response);
    // console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      if (route.params.isEdit == false || route.params.AgainEdit == true) {
        onResubmit(response.data.image);
      } else {
        onSubmitData(response.data.image);
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onSubmitData = async panImage => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        // applicationStatus: 6,
        pancard: panNumber,
        pancardimage: panImage,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('DrivingLicenceDocument', {
          //   isNext: true,
          id: route.params.id,
          isEdit: true,
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
  const onResubmit = async panImage => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        // applicationStatus: 6,
        pancard: panNumber,
        pancardimage: panImage,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('Document', {
          id: route.params.id,
          isNext: true,
        });
        SuccessToast('PanCard Update Successfully');
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
      return 'numeric';
    } else if (panNumber.length > 5 && panNumber.length < 8) {
      return 'default';
    } else if (panNumber.length == 9) {
      return 'numeric';
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
          //   marginTop: 10,
          //   borderTopLeftRadius: 30,
          //   borderTopRightRadius: 30,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            <TextInput
              mode="outlined"
              value={panNumber}
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
                  setPanNumber(value.toUpperCase().replace(/[^\w\s]/gi, ''));
                }
              }}
              label="PanCard Number *"
              placeholder="PanCard Number"
              keyboardType={renderKeybordType()}
              maxLength={10}
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo1}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            {route.params.isEdit == true ? (
              <>
                {uploadImageUri == '' ? (
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
                      source={{uri: uploadImageUri}}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {uploadImageUri == '' ? (
                  <View
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
                  </View>
                ) : (
                  <View
                    style={{
                      //  borderStyle: 'dashed',
                      borderWidth: 1,
                      marginTop: 20,
                      backgroundColor: '#ECECEC',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 110,
                      borderRadius: 10,
                      //   borderColor: colors.blue
                    }}>
                    <Image
                      resizeMode="contain"
                      style={{height: 108, width: '100%'}}
                      source={{uri: uploadImageUri}}
                    />
                  </View>
                )}
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
            {route.params?.isEdit == true ? (
              route.params?.AgainEdit == true ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomBorderButton
                      text="cancel"
                      onPress={() =>
                        navigation.navigate('Document', {
                          id: route.params.id,
                          isNext: true,
                        })
                      }
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton text="Save" onPress={() => onValidate()} />
                  </View>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomBorderButton
                      text="skip"
                      onPress={() =>
                        navigation.navigate('DrivingLicenceDocument', {
                          isEdit: true,
                          id: route.params.id,
                        })
                      }
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton text="next" onPress={() => onValidate()} />
                  </View>
                </View>
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
                      navigation.push('PanCardDoc', {
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
