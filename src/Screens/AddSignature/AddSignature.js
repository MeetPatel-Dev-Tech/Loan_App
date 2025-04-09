import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import SignatureScreen from 'react-native-signature-canvas';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {ArrowIcon} from '../../CommonFiles/SvgFile';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import NetInfo from '@react-native-community/netinfo';
import colors from '../../CommonFiles/Colors';
import {PostApi} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {
  CommonUtilsObj,
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Message from '../../CommonFiles/Message';
import CommonStyle from '../../CommonFiles/CommonStyle';

export default function AddSignature({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureCapture, setSignatureCapture] = useState('');
  const [netInfo, setNetInfo] = useState('online');

  // useEffect(() => {
  //     getSignature();
  // }, []);

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
          getSignature();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  const getSignature = () => {
    if (CommonUtilsObj.UserDetails[0].data.signature == null) {
      setIsModalVisible(true);
    } else {
      setSignatureCapture(
        Constant.ShowImage + CommonUtilsObj.UserDetails[0].data.signature,
      );
    }
  };

  const ref = useRef();

  const handleOK = signature => {
    if (netInfo == 'online') {
      console.log('sign', signature);
      setSignatureCapture(signature);
      addSign(signature);
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  console.log('signature', CommonUtilsObj.UserDetails[0]);

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log('end');
    ref.current.readSignature();
    setIsModalVisible(false);
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const data = [
    {id: 1, name: 'Add Signature'},
    {id: 2, name: 'Penlty'},
  ];

  const addSign = async signature => {
    setLoading(true);
    const data = {
      data: signature,
    };
    const response = await PostApi(Constant.base64Image, data, false);
    // console.log('response', response.data.image)
    // let signature_image = [];
    // signature_image.push(CommonUtilsObj.UserDetails[0]);
    // signature_image.push({ signature: response.data.image });
    // console.log('signature', signature_image)
    if (response.status == 200) {
      setLoading(false);
      onSubmitData(response.data.image);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onSubmitData = async signature => {
    const data = {
      signature: signature,
    };
    const response = await PostApi(Constant.TermsAndCondition, data, false);
    console.log('response', response);
    if (response.status == 200) {
      setLoading(false);
      SuccessToast('Signature Add Successfully');
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
    } else {
      setLoading(false);
      ErrorToast(response.message);
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
        <View style={{flex: 1}}>
          {/* <View style={{alignItems: 'center', marginTop: 20}}>
            <Image
              source={require('../../Assets/Icon/Signature.png')}
              style={{height: 45, width: 45, tintColor: colors.blue}}
            />
            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Your Signature
            </Text>
          </View> */}
          <View
            style={{
              height: 100,
              //  paddingHorizontal: 20, paddingVertical: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowColor: 'black',
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {signatureCapture != '' && (
              <Image
                resizeMode={'contain'}
                style={{width: 200, height: 80}}
                source={{uri: signatureCapture}}
              />
            )}
          </View>
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
          <View style={{}}>
            <CustomButton
              text="change"
              onPress={() => setIsModalVisible(true)}
            />
          </View>
          {/* <View style={{ flex: 1 }}>
                        <CustomButton text='save' onPress={() => navigation.goBack()} />
                    </View> */}
        </View>
      </View>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        //  animationOut='slideOutDown'
        // swipeDirection='down'
        onSwipeComplete={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              paddingHorizontal: 30,
              paddingTop: 10,
              paddingBottom: 20,
            }}>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Image
                source={require('../../Assets/Icon/Signature.png')}
                style={{height: 45, width: 45, tintColor: colors.blue}}
              />
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                Add Signature
              </Text>
              <Text style={{marginTop: 10}}>Please enter your Signature</Text>
              <View
                style={{
                  height: 200,
                  width: '100%',
                  borderWidth: 1,
                  marginTop: 20,
                  borderRadius: 10,
                  backgroundColor: colors.primaryBlueBackground,
                }}>
                <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="clear"
                  onPress={() => handleClear()}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton text="submit" onPress={() => handleConfirm()} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
