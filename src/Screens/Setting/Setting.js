import React, {useState, useEffect, useRef, useContext} from 'react';
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
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import SignatureScreen from 'react-native-signature-canvas';
import userDefaults from 'react-native-user-defaults';
import DefaultPreference from 'react-native-default-preference';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {ArrowIcon} from '../../CommonFiles/SvgFile';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import Constant from '../../CommonFiles/Constant';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import {GetApi} from '../../Api/Api';
import {
  loadingfalse,
  lodingtrue,
  LOGOUT,
  USER_LOGGED_OUT,
} from '../../Redux/ReduxConstant';

export default function Setting({navigation}) {
  const result = useSelector(state => state);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureCapture, setSignatureCapture] = useState('');
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);

  const ref = useRef();

  const handleOK = signature => {
    console.log('sign', signature);
    setSignatureCapture(signature);
  };

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
    // { id: 2, name: 'Penlty' },
    // { id: 3, name: 'Manage Repayment Cycle' },
    {id: 4, name: 'Delete Account'},
  ];

  const pressEvent = name => {
    if (name == 'Add Signature') {
      return navigation.navigate('AddSignature');
    } else if (name == 'Penlty') {
      return navigation.navigate('Penlty');
    } else if (name == 'Delete Account') {
      return setIsModalVisible(true);
    } else if (name == 'Manage Repayment Cycle') {
      return navigation.navigate('ManageRepaymentCycle');
    } else if (name == 'Setting') {
      return navigation.navigate('Setting');
    }
  };

  const renderSettingDetails = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => pressEvent(item.name)}
        style={{
          backgroundColor: 'white',
          padding: 20,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>
          {item.name}
        </Text>
        <View
          style={{
            backgroundColor: '#F3F3F3',
            padding: 5,
            borderRadius: 5,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 0.5},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
          }}>
          <ArrowIcon height={10} width={10} />
        </View>
      </TouchableOpacity>
    );
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

  return (
    <SafeAreaView style={{backgroundColor: colors.blue, flex: 1}}>
      <ProgressLoader
        visible={result.Loader.loading}
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
          backgroundColor: '#F9F9FA',
          flex: 1,
          marginTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View style={{marginTop: 10}}>
          <FlatList
            data={data}
            renderItem={renderSettingDetails}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
        swipeDirection="down"
        onSwipeComplete={() => {
          setIsModalVisible(false);
        }}>
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
                style={{height: 2, width: 40, backgroundColor: 'gray'}}></View>
              <View
                style={{
                  height: 2,
                  width: 40,
                  backgroundColor: 'gray',
                  marginTop: 2,
                }}></View>
            </View>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 10,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                Delete Account
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                marginTop: 30,
                fontSize: 16,
                marginHorizontal: 30,
              }}>
              Are you sure you want delete this account?
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
                  onPress={() => setIsModalVisible(false)}
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
