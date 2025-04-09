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
  TouchableOpacity,
} from 'react-native';
import {Colors, TextInput} from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import ProgressLoader from 'rn-progress-loader';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Message from '../../CommonFiles/Message';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import colors from '../../CommonFiles/Colors';
import {postApiWithTocken} from '../../Api/Api';
import {
  getLoggedUserDetails,
  setLoggedUserDetails,
} from '../../Utils/CommonUtils';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import {T_C} from '../../Redux/Action/AuthAction';

export default function TermsAndCondition({navigation, route}) {
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  const [storeData, setStoreData] = useState('');
  const [isTerms, setIsTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  useEffect(() => {
    navigation.addListener('focus', () => {
      console.log('hijijkjj', route.params.isTerms);
      setIsTerms(route.params.isTerms);
    });
  }, [route.params]);

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
        backgroundColor: colors.primaryBlueBackground,
      },
      // backgroundColor: 'pink',
      //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
      headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
    });
  }, []);

  const dispatch = useDispatch();
  const result = useSelector(state => state.userDetails);
  console.log('res...', result);

  console.log('isTerms', isTerms);

  const onValidate = async () => {
    if (netInfo == 'online') {
      if (isTerms == true) {
        dispatch(T_C({deviceToken: route.params.deviceToken}));
        // setLoading(true);
        // const data = {
        //     isTerm: true
        // }
        // const response = await postApiWithTocken(Constant.TermsAndCondition, data, false, route.params.deviceToken)
        // console.log('response', response)
        // if (response.status == 200) {
        //     setLoading(false);
        //     let userInfo = [];
        //     userInfo.push(response.data);
        //     if (Platform.OS === 'android') {
        //         setLoggedUserDetails(JSON.stringify(userInfo));
        //     } else {
        //         setLoggedUserDetails(userInfo);
        //     }
        //     await getLoggedUserDetails();
        //     //  setLoginState(Constant.KLogin);
        //     // setTimeout(() => {
        //     //   setLoading(false);
        //     //   setStoredCredentials(response.data.data);
        //     // }, 3000);
        //     setStoreData(response.data.data);
        //     setIsModalVisible(true);
        //     //  SuccessToast('user create successfully');
        // } else {
        //     setLoading(false);
        //     ErrorToast(response.message);
        // }
        // // navigation.navigate('TermsAnsConditionDetails', {
        // //     data: true,
        // //     deviceToken: route.params.deviceToken
        // // })
      } else {
        ErrorToast('please select terms button');
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
          flex: 0.8,
          alignItems: 'center',
          backgroundColor: colors.primaryBlueBackground,
        }}>
        <Image
          source={require('../../Assets/Image/Terms-Condition.png')}
          style={{height: '100%', width: '100%'}}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1}}>
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
                Terms & Condition
              </Text>
              <Text
                style={{marginTop: 20, textAlign: 'center', color: '#525E60'}}>
                By Selecting "I Agree" below, I have Review and agree to the
                Terms and Condition and the Privacy Policy
              </Text>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('TermsAnsConditionDetails', {
                      data: true,
                      deviceToken: route.params.deviceToken,
                    })
                  }>
                  {/* <MaterialCommunityIcons
                    name={
                      isTerms == true ? 'radiobox-marked' : 'radiobox-blank'
                    }
                    size={30}
                    color={colors.blue}
                  /> */}
                  <Ionicons
                    name={
                      isTerms == true ? 'checkbox-outline' : 'square-outline'
                    }
                    size={30}
                    color={isTerms == true ? colors.blue : colors.gray}
                  />
                </TouchableOpacity>
                <Text style={{marginLeft: 10}}>
                  I Agree to Terms & Conditions
                </Text>
              </View>
            </View>
          </View>
          {isTerms == true && (
            <View
              style={{marginHorizontal: 30, marginBottom: 20, marginTop: 20}}>
              <CustomButton
                text="Create account"
                onPress={() => onValidate()}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}>
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
              paddingTop: 30,
              paddingBottom: 10,
            }}>
            <View
              style={{
                backgroundColor: '#F6F9FF',
                shadowColor: 'gray',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 20,
              }}>
              <View style={{margin: 20, alignItems: 'center'}}>
                <Image
                  source={require('../../Assets/Image/Congratulation.png')}
                  style={{width: 200, height: 150}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                    marginTop: 20,
                  }}>
                  Congratulation
                </Text>
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  By Selecting "I Agree" below, I have Review and agree to the
                  Terms and Condition and the Privacy Policy
                </Text>
                <View style={{marginTop: 20}}>
                  <CustomButton
                    text="Back To Home"
                    onPress={() => {
                      //  navigation.navigate('AppNavigation'),
                      setStoredCredentials(storeData);
                      setIsModalVisible(false);
                      SuccessToast('user create successfully');
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
