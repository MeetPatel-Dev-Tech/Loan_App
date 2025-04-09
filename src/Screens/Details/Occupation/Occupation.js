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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {Dropdown} from 'react-native-element-dropdown';
import Feather from 'react-native-vector-icons/Feather';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import Message from '../../../CommonFiles/Message';
import {PostApi} from '../../../Api/Api';
import removeEmojis from '../../../Components/RemoveEmojis/RemoveEmojis';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function Occupation({navigation, route}) {
  const [income, setIncome] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [address, setAddress] = useState('');
  const [occupationType, setOccupationType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();

  useEffect(() => {
    if (route.params?.isEdit == false || route.params?.AgainEdit == true) {
      getOccupation();
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

  const getOccupation = () => {
    setCompanyName(
      route.params.data.companyName == null
        ? ''
        : route.params.data.companyName,
    );
    setAddress(
      route.params.data.address == null ? '' : route.params.data.address,
    );
  };

  const occupationTypes = [{name: 'Salaries'}, {name: 'business'}];

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (companyName == '') {
        flag = false;
        errorMsg.push(Message.companyName);
      }
      if (address == '') {
        flag = false;
        errorMsg.push(Message.address);
      }
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
        applicationStatus: 2,
        companyName: companyName,
        address: address,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('Referance', {
          isEdit: true,
          id: route.params.id,
          loanType: route.params.loanType,
        });
        SuccessToast('Occupation Add Successfully');
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
        companyName: companyName,
        address: address,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('CustomerDetails', {
          //    isEdit: true,
          id: route.params.id,
        });
        SuccessToast('Occupation Update Successfully');
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
              value={companyName}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setCompanyName(value.trim());
                } else {
                  // setCompanyName(value.replace(/[^a-zA-Z 0-9]/g, ""))
                  setCompanyName(removeEmojis(value));
                }
              }}
              label="Company Name *"
              placeholder="Company Name"
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
                  // setAddress(value.replace(/[^a-zA-Z 0-9 . ,]/g, ""))
                  setAddress(removeEmojis(value));
                }
              }}
              label="Address *"
              placeholder="Address"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              returnKeyType="next"
              style={{marginTop: 20}}
              ref={RefNo2}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {padding: 20, marginTop: 10, backgroundColor: 'white'},
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
                      navigation.push('Occupation', {
                        isEdit: true,
                        AgainEdit: true,
                        data: route.params.data,
                        id: route.params.id,
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
