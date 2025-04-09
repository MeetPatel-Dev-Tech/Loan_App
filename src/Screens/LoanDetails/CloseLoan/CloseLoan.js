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
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import Entypo from 'react-native-vector-icons/Entypo';
import NetInfo from '@react-native-community/netinfo';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Constant from '../../../CommonFiles/Constant';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import colors from '../../../CommonFiles/Colors';
import {GetApi, PostApi} from '../../../Api/Api';
import Message from '../../../CommonFiles/Message';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import removeEmojis from '../../../Components/RemoveEmojis/RemoveEmojis';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function CloseLoan({navigation, route}) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPayableAmount, setTotalPayableAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [isCloseLoanModalVisible, setIsCloseLoanModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getLoanDetails()
  //     }, [])
  // )

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
          getLoanDetails();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  const getLoanDetails = async () => {
    setLoading(true);
    const response = await GetApi(Constant.addLoan + '/' + route.params.loanId);
    console.log('response', response);
    if (response.status == 200) {
      const total =
        Number(response.data.outstandingAmt) -
        Number(response.data.loanDuration - response.data.paidEmi) *
          response.data.MIA;

      console.log('number', total);

      setAmount(
        Number(response.data.outstandingAmt) -
          Number(response.data.loanDuration - response.data.paidEmi) *
            response.data.MIA,
      );
      setLoading(false);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (totalPayableAmount == '') {
        flag = false;
        errorMsg.push(Message.amount);
      }
      if (totalPayableAmount != amount) {
        flag = false;
        errorMsg.push('Please Check Amount');
      }
      // if (remainingBalance == '') {
      //     flag = false;
      //     errorMsg.push(Message.KDogNameEmpty);
      // }
      if (flag) {
        onSubmitData();
        //  UploadFrontImage();
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
        loan: route.params.loanId,
        //  latePaymentcharge: Number(latePaymentCharges),
        totalPayableamount: Number(totalPayableAmount),
        paymentMode: paymentMode == '' ? null : paymentMode,
        remark: remarks == '' ? null : remarks,
        isclose: true,
      };
      const response = await PostApi(Constant.creditEMI, data, false);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        setIsCloseLoanModalVisible(true);
        // SuccessToast('Congratulations Your Loan Successfully Closed');
        // navigation.navigate('BottomTabNavigation');
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
          <View style={{marginHorizontal: 20, flex: 1}}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 10,
                shadowColor: 'gray',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                marginTop: 20,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>
                Outstanding Loan Amount
              </Text>
              <Text>RS. {amount}</Text>
            </View>
            <TextInput
              mode="outlined"
              value={totalPayableAmount}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setTotalPayableAmount(value.trim());
                } else {
                  setTotalPayableAmount(value.replace(/[^0-9]/, ''));
                }
              }}
              //    onChangeText={value => { setTotalPayableAmount(value); }}
              label="Total Payable Amount *"
              placeholder="Total Payable Amount"
              style={{marginTop: 20}}
              keyboardType="numeric"
              returnKeyType="next"
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={paymentMode}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setPaymentMode(value.trim());
                } else {
                  setPaymentMode(removeEmojis(value));
                }
              }}
              //    onChangeText={value => { setPaymentMode(value); }}
              label="Payment Mode"
              placeholder="Payment Mode"
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo2}
              onSubmitEditing={() => RefNo3.current.focus()}
              blurOnSubmit={false}
            />
            <View style={{marginTop: 20}}>
              <TextInput
                mode="outlined"
                value={remarks}
                theme={Constant.theme}
                onChangeText={value => {
                  if (value[0]?.includes(' ')) {
                    setRemarks(value.trim());
                  } else {
                    setRemarks(value);
                  }
                }}
                // onChangeText={value => { setRemarks(value); }}
                label="Remarks"
                placeholder="Remarks"
                style={{
                  textAlignVertical: 'top',
                  paddingVertical: 0,
                  height: 100,
                }}
                // returnKeyType='done'
                ref={RefNo3}
                multiline={true}
                numberOfLines={5}
                // onSubmitEditing={() => Keyboard.dismiss()}
                // blurOnSubmit={false}
              />
            </View>
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
              },
            ]}>
            <View style={{flex: 1, marginRight: 20}}>
              <CustomBorderButton
                text="Cancel"
                onPress={() => {
                  navigation.goBack();
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomButton text="add" onPress={() => onValidate()} />
            </View>
          </View>
          {/* <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 20 }}>
                            <CustomBorderButton text='Cancel' onPress={() => { navigation.goBack() }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomButton text='add' onPress={() => onValidate()} />
                        </View>
                    </View> */}
        </KeyboardAwareScrollView>
      </View>
      <Modal
        isVisible={isCloseLoanModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View
          style={{
            justifyContent: 'center',
            // alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              paddingVertical: 20,
              borderRadius: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../../Assets/Image/Success.png')}
                style={{height: 50, width: 50}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 16,
                }}>
                Congratulations Your Loan Successfully Closed.
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 16,
                }}>
                {Constant.ruppy} {totalPayableAmount}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <CustomButton
                text="done"
                onPress={() => {
                  setIsCloseLoanModalVisible(false);
                  navigation.navigate('BottomTabNavigation');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
