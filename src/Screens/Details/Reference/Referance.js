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
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Feather from 'react-native-vector-icons/Feather';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import {PostApi} from '../../../Api/Api';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import Message from '../../../CommonFiles/Message';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function Referance({navigation, route}) {
  const [firstName, setFirstName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();
  const RefNo7 = useRef();

  useEffect(() => {
    if (route.params.isEdit == false || route.params.AgainEdit == true) {
      getReferance();
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

  const getReferance = () => {
    setFirstName(
      route.params.data.reffirstName == null
        ? ''
        : route.params.data.reffirstName,
    );
    setLastName(
      route.params.data.reflastName == null
        ? ''
        : route.params.data.reflastName,
    );
    setMobileNumber(
      route.params.data.refnumber == null ? '' : route.params.data.refnumber,
    );
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
      if (mobileNumber == '') {
        flag = false;
        errorMsg.push(Message.mobileNumber);
      } else if (mobileNumber.length != 10) {
        flag = false;
        errorMsg.push(Message.vmobileNumber);
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
        errorMsg.push(Message.vmo);
      }
      // }
      // if (email == '') {
      //     flag = false;
      //     errorMsg.push(Message.email);
      // }
      // if (relation == '') {
      //     flag = false;
      //     errorMsg.push(Message.relation);
      // } if (address == '') {
      //     flag = false;
      //     errorMsg.push(Message.address);
      // }
      if (flag) {
        if (route.params.isEdit == false || route.params.AgainEdit == true) {
          onResubmit();
        } else {
          onSubmitData();
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

  const onSubmitData = async () => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        applicationStatus: 3,
        reffirstName: firstName,
        reflastName: lastName,
        refnumber: String(mobileNumber),
      };
      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('NoDocument', {
          isEdit: true,
          id: route.params.id,
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
  const onResubmit = async () => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        reffirstName: firstName,
        reflastName: lastName == '' ? null : lastName,
        refnumber: String(mobileNumber),
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('CustomerDetails', {
          id: route.params.id,
        });
        SuccessToast('Reference Update Successfully');
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
              placeholder="Last Name *"
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
              value={mobileNumber}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                setMobileNumber(value.replace(/[^0-9]/, ''));
              }}
              label="Mobile Number *"
              placeholder="Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo3}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    {/* <CustomBorderButton text='Skip' onPress={() => navigation.navigate('AadharCardDoc', {
                                            isEdit: true,
                                            id: route.params.id
                                        })} /> */}
                    <CustomBorderButton
                      text="Skip"
                      onPress={() =>
                        navigation.navigate('NoDocument', {
                          isEdit: true,
                          id: route.params.id,
                          loanType: route.params.loanType,
                        })
                      }
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton
                      text="next"
                      onPress={() => {
                        onValidate();
                      }}
                    />
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
                      navigation.push('Referance', {
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
    </SafeAreaView>
  );
}
