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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Constant from '../../CommonFiles/Constant';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import {Upload} from '../../CommonFiles/SvgFile';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import Message from '../../CommonFiles/Message';
import {PostApi, PostApiImage} from '../../Api/Api';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import CommonStyle from '../../CommonFiles/CommonStyle';

export default function AddMortage({navigation, route}) {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [checkNumber, setcheckNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [netValue, setNetValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();

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
      if (accountHolderName == '') {
        flag = false;
        errorMsg.push(Message.accountHolderName);
      }
      if (checkNumber != '') {
        if (checkNumber.length != 6) {
          flag = false;
          errorMsg.push(Message.checkNumbers);
        }
      }

      if (bankName == '') {
        flag = false;
        errorMsg.push(Message.bankName);
      }
      if (accountNumber == '') {
        flag = false;
        errorMsg.push(Message.accountNumber);
      } else if (accountNumber.length < 14) {
        lag = false;
        errorMsg.push(Message.accountNumbers);
      }
      if (uploadImageUri == '') {
        flag = false;
        errorMsg.push(Message.checkImage);
      }
      if (flag) {
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
    //  console.log('response..Image', response.data.image)
    if (response.status == 200) {
      setLoading(false);
      onSubmitData(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onSubmitData = async checkImage => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        accountHoldername: accountHolderName,
        checkNumber: checkNumber == '' ? null : String(checkNumber),
        bankName: bankName,
        accountNumber: String(accountNumber),
        //  netValue: String('4'),
        image: checkImage,
        customer: route.params.id,
      };

      const response = await PostApi(Constant.addMortgage, data, false);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('MortageDetails', {
          id: route.params.id,
          loanType: route.params.loanType,
          isEdit: false,
        });
        SuccessToast(response.message);
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
            <TextInput
              mode="outlined"
              value={accountHolderName}
              theme={Constant.theme}
              // autoCapitalize='characters'
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setAccountHolderName(value.trim());
                } else {
                  setAccountHolderName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Account Holder Name *"
              placeholder="Account Holder Name"
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={checkNumber}
              autoCapitalize="characters"
              keyboardType="numeric"
              maxLength={6}
              theme={Constant.theme}
              onChangeText={value => {
                if (value.includes(' ')) {
                  setcheckNumber(value.trim());
                } else {
                  setcheckNumber(value.replace(/[^0-9]/, ''));
                }
              }}
              label="Cheque Number"
              placeholder="Cheque Number"
              //   keyboardType='numeric'
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo2}
              onSubmitEditing={() => RefNo3.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={bankName}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setBankName(value.trim());
                } else {
                  setBankName(value.replace(/[^a-zA-Z ]/g, ''));
                }
              }}
              label="Bank Name *"
              placeholder="Bank Name"
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo3}
              onSubmitEditing={() => RefNo4.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={accountNumber}
              theme={Constant.theme}
              maxLength={16}
              onChangeText={value => {
                if (value?.includes(' ')) {
                  setAccountNumber(value.trim());
                } else {
                  setAccountNumber(value.replace(/[^0-9]/, ''));
                }
              }}
              label="Account Number *"
              placeholder="Account Number"
              keyboardType="numeric"
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo4}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            {/* <TextInput
                            mode="outlined"
                            value={netValue}
                            theme={Constant.theme}
                            onChangeText={value => {
                                if (value?.includes(' ')) {
                                    setNetValue(value.trim())
                                }
                                else {
                                    setNetValue(value);
                                }
                            }}
                            label="Net Value *"
                            placeholder="Net Value"
                            returnKeyType='done'
                            keyboardType='numeric'
                            style={{ marginTop: 20 }}
                            ref={RefNo5}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={false}
                        /> */}
            {uploadImageUri == '' ? (
              <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
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
                <Text style={{color: 'black', fontSize: 16}}>
                  Upload Cheque image here
                </Text>
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
                onPress={() => setIsModalVisible(true)}>
                <Image
                  resizeMode="contain"
                  style={{height: 110, width: '100%'}}
                  source={{uri: uploadImageUri}}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                marginTop: 10,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <View style={{flex: 1, marginRight: 20}}>
              <CustomBorderButton text="cancel" />
            </View>
            <View style={{flex: 1}}>
              <CustomButton
                text="add"
                onPress={() => {
                  onValidate();
                }}
              />
            </View>
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
