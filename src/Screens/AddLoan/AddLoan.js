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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import NetInfo from '@react-native-community/netinfo';
import Moment from 'moment';
import Constant from '../../CommonFiles/Constant';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import DatePicker from 'react-native-date-picker';
import colors from '../../CommonFiles/Colors';
import {GetApi, PostApi, PostApiImage} from '../../Api/Api';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import CommonStyle from '../../CommonFiles/CommonStyle';

export default function AddLoan({navigation, route}) {
  const [downPaymentAmount, setDownPaymentAmount] = useState('');
  const [noEMI, setNoEMI] = useState('');
  const [processingFees, setProcessingFees] = useState('');
  const [emiDate, setEmiDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [interstRate, setInterstRate] = useState('');
  const [totals, setTotals] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [duration, setDuration] = useState('');
  const [interest, setInterest] = useState('percentage');
  const [emiType, setEmiType] = useState('');
  const [price, setPrice] = useState('');
  const [repaymentCycleList, setRepaymentCycleList] = useState([]);
  const [repaymentCycle, setRepaymentCycle] = useState('');
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
  const [isFocusdropdown2, setIsFocusdropdown2] = useState(false);
  const [EmiAmount, setEmiAmount] = useState('');
  const [EMIdate, setEMIDate] = useState('');
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();

  useEffect(() => {
    getRepaymentCycleList();
  }, []);
  useEffect(() => {
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
  }, []);

  const getRepaymentCycleList = async () => {
    const response = await GetApi(Constant.ManageRepayment);
    console.log('respons', response);
    if (response.status == 200) {
      setRepaymentCycleList(response.data);
    }
  };

  const EMIType = [{name: 'Interest Only'}, {name: 'Interest + Capital'}];

  const total = fees => {
    const processingFees = Number(fees);
    const productAmount = Number(route.params.price);
    const Total = processingFees + productAmount;
    setTotals(Total);
    if (downPaymentAmount.length > 0) {
      setLoanAmount(Total - Number(downPaymentAmount));
    }
  };
  const loanAmounts = fees => {
    const downpyment = Number(fees);
    const productTotalAmount = totals;
    const finalLoanAmount = productTotalAmount - downpyment;

    setLoanAmount(finalLoanAmount);
  };

  const interestFrequency = name => {
    if (name == 'monthly') {
      setTenure('month');
    } else if (name == 'weekly') {
      setTenure('week');
    }
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (downPaymentAmount == '') {
        flag = false;
        errorMsg.push(Message.downPaymentAmount);
      }
      if (Number(downPaymentAmount) > Number(price)) {
        console.log('prc', route.params.price);
        console.log('prc', downPaymentAmount);
        flag = false;
        errorMsg.push(Message.downPaymentAmountp);
      }
      if (processingFees == '') {
        flag = false;
        errorMsg.push(Message.processingFees);
      }

      if (interest == 'percentage') {
        if (interstRate == '') {
          flag = false;
          errorMsg.push(Message.rate);
        }
      }
      if (duration != '') {
        if (interest == 'flat') {
          if (emiType == 'Interest + Capital') {
            if (
              EmiAmount <=
              Number(
                (Number(price) +
                  Number(processingFees) -
                  Number(downPaymentAmount)) /
                  Number(duration),
              )
            ) {
              flag = false;
              errorMsg.push(
                `please enter EMI amt more then ${Number(
                  Math.round(
                    (Number(price) +
                      Number(processingFees) -
                      Number(downPaymentAmount)) /
                      Number(duration),
                  ),
                )} `,
              );
            }
          }
        }
      }
      if (emiType == '') {
        flag = false;
        errorMsg.push(Message.emiType);
      }
      if (duration == '') {
        flag = false;
        errorMsg.push(Message.duration);
      }
      if (EMIdate == '') {
        flag = false;
        errorMsg.push(Message.emiDate);
      }
      if (price == '') {
        flag = false;
        errorMsg.push(Message.price);
      }
      // if (interest == '') {
      //     flag = false;
      //     errorMsg.push(Message.KDogNameEmpty);
      // }
      // if (frequency == '') {
      //     flag = false;
      //     errorMsg.push(Message.KDogNameEmpty);
      // }
      if (flag) {
        if (interest == 'percentage') {
          onsubmit();
        } else {
          fixdSubmit();
        }
        // uploadProductImage();
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

  const onsubmit = () => {
    navigation.navigate('Logic', {
      appliancename: route.params.appliancename,
      brand: route.params.brand,
      model: route.params.model,
      color: route.params.color,
      variant: route.params.variant,
      price: price,
      serialNumber: route.params.serialNumber,
      invoiceImg: route.params.invoiceImg,
      productImg: route.params.productImg,
      id: route.params.id,
      mortgageId: route.params.mortgageId,
      processingFees: processingFees,
      downPaymentAmount: downPaymentAmount,
      interestRate: interstRate,
      duration: duration,
      interestType: emiType,
      emiDate: EMIdate,
      type: interest,
    });
  };
  const fixdSubmit = () => {
    navigation.navigate('Logic2', {
      appliancename: route.params.appliancename,
      brand: route.params.brand,
      model: route.params.model,
      color: route.params.color,
      variant: route.params.variant,
      price: price,
      serialNumber: route.params.serialNumber,
      invoiceImg: route.params.invoiceImg,
      productImg: route.params.productImg,
      id: route.params.id,
      mortgageId: route.params.mortgageId,
      processingFees: processingFees,
      downPaymentAmount: downPaymentAmount,
      //  interestRate: interstRate,
      emiAmount: EmiAmount,
      duration: duration,
      interestType: emiType,
      emiDate: EMIdate,
      type: interest,
    });
  };

  const uploadProductImage = async () => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: route.params.productImg,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'dl', data);
    console.log('response..', response);
    console.log('response..Image', response.data.image);
    if (response.status == 200) {
      setLoading(false);
      UploadInvoiceImage(response.data.image);
    }
  };
  const UploadInvoiceImage = async product => {
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: route.params.invoiceImg,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // data.append('image',
    //     image,
    //     'profile.jpg',
    // );
    let response = await PostApiImage(Constant.uploadImage + 'dl', data);
    console.log('response..', response);
    console.log('response..Image', response.data.image);
    if (response.status == 200) {
      setLoading(false);
      // if (route.params.isEdit == false || route.params.AgainEdit == true) {
      //     onResubmit(response.data.image, Front);
      // } else {
      onSubmitData(response.data.image, product);
      // }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const onSubmitData = async (invoice, product) => {
    const data = {
      customer: route.params.id,
      mortgage: route.params.mortgageId,
      applianceName: route.params.appliancename,
      brand: route.params.brand,
      model: route.params.model,
      color: route.params.color,
      variant: route.params.variant,
      price: Number(route.params.price),
      serialNumber: route.params.serialNumber,
      invoice: invoice,
      product: product,
      totalAmount: 41,
      processingFees: 500,
      downPayment: 456,
      loanAmount: 10,
      emiType: 1,
      emiRate: 1,
      frequencyType: 1,
      emiCount: 1,
      loanDuration: 1,
      repaymentCycle: 'fgdfg',
      repaymentDate: '2022-11-08T06:35:59.871Z',
      repaymentNumber: 5,
      repaymentAmount: 1000,
    };

    const response = await PostApi(Constant.addLoan, data, false);
    console.log('response...', response);
    if (response.status == 200) {
      setLoading(false);
      navigation.navigate('EMICalculation', {
        // isNext: true,
        id: route.params.id,
        mortgageId: route.params.mortgageId,
        loanId: response.data.id,
      });
    } else {
      setLoading(false);
    }
  };

  const verifyedAmount = value => {
    if (
      emiType == 'Interest + Capital' &&
      duration != '' &&
      interest == 'flat'
    ) {
      if (
        Number(value) <=
        Number(
          (Number(price) + Number(processingFees) - Number(downPaymentAmount)) /
            Number(duration),
        )
      ) {
        setError(
          `please enter EMI amt more then ${Number(
            Math.round(
              (Number(price) +
                Number(processingFees) -
                Number(downPaymentAmount)) /
                Number(duration),
            ),
          )}`,
        );
      } else {
        setError('');
      }
    } else {
      setError('');
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
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
            }}>
            <TextInput
              mode="outlined"
              value={price}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setPrice(value.trim());
                } else {
                  setPrice(value.replace(/[^0-9]/, ''));
                }
              }}
              label="Product Price *"
              placeholder="Product Price"
              returnKeyType="next"
              keyboardType="numeric"
              maxLength={8}
              style={{marginTop: 20}}
              ref={RefNo6}
              onSubmitEditing={() => RefNo1.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              mode="outlined"
              value={processingFees}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setProcessingFees(value.trim());
                } else {
                  setProcessingFees(value.replace(/[^0-9]/, '')), total(value);
                }
              }}
              //    onChangeText={value => { setProcessingFees(value), total(value) }}
              onChange={e => setProcessingFees(e)}
              label="Processing fees *"
              placeholder="Processing fees"
              maxLength={8}
              keyboardType="numeric"
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo1}
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={downPaymentAmount}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setDownPaymentAmount(value.trim());
                } else {
                  setDownPaymentAmount(value.replace(/[^0-9]/, '')),
                    loanAmounts(value);
                }
              }}
              //   onChangeText={value => { setDownPaymentAmount(value), loanAmounts(value) }}
              onChange={e => setDownPaymentAmount(e)}
              keyboardType="numeric"
              label="Down Payment Amount *"
              placeholder="Down Payment Amount"
              maxLength={8}
              style={{marginTop: 20}}
              returnKeyType="done"
              ref={RefNo2}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            <View style={{marginTop: 20}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    setInterest('percentage'), setError(''), setInterstRate('');
                  }}>
                  <Fontisto
                    name={
                      interest == 'percentage'
                        ? 'radio-btn-active'
                        : 'radio-btn-passive'
                    }
                    size={20}
                    color={colors.blue}
                  />
                </TouchableOpacity>
                <View style={{}}>
                  <Text style={{fontSize: 18}}>
                    {' '}
                    % ROI <Text style={{color: colors.blue}}>(</Text>
                    <Text style={{color: 'red', fontSize: 14}}>Monthly</Text>
                    <Text style={{color: colors.blue}}>)</Text>
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setInterest('flat'), setEmiAmount('');
                  }}
                  style={{marginLeft: 20}}>
                  <Fontisto
                    name={
                      interest == 'flat'
                        ? 'radio-btn-active'
                        : 'radio-btn-passive'
                    }
                    size={20}
                    color={colors.blue}
                  />
                </TouchableOpacity>
                <View>
                  <Text style={{fontSize: 18}}> Fixed Amt</Text>
                </View>
              </View>
            </View>

            <View style={{}}>
              <Dropdown
                placeholder="EMI type"
                label="EMI type"
                style={{
                  borderColor: isFocusdropdown1 ? colors.blue : 'gray',
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  height: 58,
                  marginTop: 20,
                  //  backgroundColor: '#ECECEC'
                }}
                selectedTextStyle={{color: 'black'}}
                maxHeight={200}
                data={EMIType}
                value={emiType}
                labelField="name"
                valueField="name"
                autoScroll={true}
                onFocus={() => setIsFocusdropdown1(true)}
                onBlur={() => setIsFocusdropdown1(false)}
                onChange={item => {
                  setEmiType(item.name);
                  setError(item.name == 'Interest Only' && '');
                  // interestFrequency(item.name);
                  //   setSelectedDogBreed(item.name);
                  setIsFocusdropdown1(false);
                }}
                renderRightIcon={() => (
                  <Image
                    source={require('../../Assets/Icon/DropDown.png')}
                    style={{height: 20, width: 20}}
                  />
                )}
              />
              <TextInput
                mode="outlined"
                value={duration}
                theme={Constant.theme}
                onChangeText={value => {
                  if (value[0]?.includes(' ')) {
                    setDuration(value.trim());
                  } else {
                    setDuration(value.replace(/[^0-9]/, ''));
                  }
                }}
                //  onChangeText={value => { setDuration(value); }}
                label="Duration *"
                placeholder="Duration"
                keyboardType="numeric"
                maxLength={8}
                style={{marginTop: 20}}
                returnKeyType="next"
                ref={RefNo3}
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={false}
              />

              {interest == 'percentage' ? (
                <TextInput
                  mode="outlined"
                  value={interstRate}
                  theme={Constant.theme}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setInterstRate(value.trim());
                    } else {
                      setInterstRate(value.replace(/[^0-9]/, ''));
                    }
                  }}
                  // onChangeText={value => { setInterstRate(value); }}
                  label="Rate *"
                  keyboardType="numeric"
                  placeholder="Rate"
                  style={{marginTop: 20}}
                  returnKeyType="done"
                  ref={RefNo4}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={false}
                />
              ) : (
                <TextInput
                  mode="outlined"
                  value={EmiAmount}
                  theme={Constant.theme}
                  onChangeText={value => {
                    if (value[0]?.includes(' ')) {
                      setEmiAmount(value.trim());
                    } else {
                      setEmiAmount(value.replace(/[^0-9]/, '')),
                        verifyedAmount(value);
                    }
                  }}
                  //  onChangeText={value => { setEmiAmount(value); verifyedAmount(value) }}
                  label="Emi Amt *"
                  keyboardType="numeric"
                  placeholder="Emi Amt"
                  maxLength={8}
                  style={{marginTop: 20}}
                  returnKeyType="next"
                  ref={RefNo4}
                  onSubmitEditing={() => RefNo5.current.focus()}
                  blurOnSubmit={false}
                />
              )}
              {error != '' && (
                <Text style={{color: 'red'}} key={error}>
                  {error}
                </Text>
              )}

              <TouchableOpacity onPress={() => setOpen(true)}>
                <TextInput
                  mode="outlined"
                  pointerEvents="none"
                  value={
                    EMIdate == ''
                      ? EMIdate
                      : Moment(EMIdate).format('DD-MM-yyyy')
                  }
                  theme={Constant.theme}
                  editable={false}
                  // onChangeText={value => {
                  //   setTenureNo(value);
                  // }}
                  label="EMI date *"
                  placeholder="Repayment Cycle"
                  keyboardType="numeric"
                  style={{marginTop: 20}}
                  returnKeyType="next"
                  ref={RefNo5}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  blurOnSubmit={false}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    // padding: 5,
                    //  backgroundColor: 'red',
                    right: 10,
                  }}>
                  <EvilIcons name="calendar" size={30} color={colors.blue} />
                </View>
              </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={date}
                minimumDate={new Date()}
                mode="date"
                textColor="black"
                onConfirm={date => {
                  setOpen(false);
                  setEMIDate(date);
                  setDate(date);
                  console.log('date', date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />

              {/* <View style={{
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                // height: 58,
                                                          shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, marginTop: 20,
                                borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                            }}>
                                <View style={{ flex: 1, }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>Total Interest</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 20, marginTop: 10 }}>total payble Amount</Text>
                                </View>
                                <View style={{ marginRight: 20, alignItems: 'flex-end' }}>
                                    <Text style={{}}>6</Text>
                                    <Text style={{ marginTop: 10 }}>Rs. 1000</Text>
                                </View>
                            </View> */}
            </View>
            <View style={{marginTop: 20}}>
              {/* <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', }}>Tenure</Text> */}
              {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, marginRight: 20 }}>
                                    <TextInput
                                        mode="outlined"
                                        value={tenureNo}
                                        theme={Constant.theme}
                                        onChangeText={value => { setTenureNo(value); }}
                                        label="Duration"
                                        placeholder="Repayment Cycle"
                                        keyboardType='numeric'
                                        style={{ marginTop: 20 }}
                                        returnKeyType="next"
                                        ref={RefNo1}
                                        onSubmitEditing={() => RefNo2.current.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        mode="outlined"
                                        value={tenure}
                                        theme={Constant.theme}
                                        onChangeText={value => { setTenure(value); }}
                                        label="Duration"
                                        placeholder="Repayment Cycle"
                                        style={{ marginTop: 20 }}
                                        returnKeyType="next"
                                        ref={RefNo1}
                                        onSubmitEditing={() => RefNo2.current.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View> */}
              {/* <Text style={{ fontSize: 16, marginTop: 20, color: 'black', fontWeight: 'bold', }}>Repayment</Text> */}
              {/* <TextInput
                                mode="outlined"
                                value={downPaymentAmount}
                                theme={Constant.theme}
                                onChangeText={value => { setDownPaymentAmount(value); }}
                                label="Repayment Cycle"
                                placeholder="Repayment Cycle"
                                style={{ marginTop: 20 }}
                                returnKeyType="next"
                                ref={RefNo1}
                                onSubmitEditing={() => RefNo2.current.focus()}
                                blurOnSubmit={false}
                            />
                            <Dropdown
                                placeholder="frequency"
                                label="frequency"
                                style={{
                                    borderColor: isFocusdropdown2
                                        ? colors.blue
                                        : 'gray',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    paddingHorizontal: 8,
                                    height: 58,
                                    marginTop: 20,
                                    //  backgroundColor: '#ECECEC'
                                }}
                                // selectedTextStyle={{color: Constant.primaryGreen}}
                                maxHeight={200}
                                data={repaymentCycleList}
                                value={repaymentCycle}
                                labelField="name"
                                valueField="name"
                                autoScroll={true}
                                onFocus={() => setIsFocusdropdown2(true)}
                                onBlur={() => setIsFocusdropdown2(false)}
                                onChange={item => {
                                    setRepaymentCycle(item.name);
                                    //   setSelectedDogBreed(item.name);
                                    setIsFocusdropdown2(false);
                                }}
                                renderRightIcon={() => (
                                    <Image
                                        source={require('../../Assets/Icon/DropDown.png')}
                                    />
                                )}
                            />
                            <View style={{
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                // height: 58,
                                                          shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, marginTop: 20,
                                borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>No. of Repayment</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, marginLeft: 20, marginTop: 10 }}>Repayment Amount</Text>
                                </View>
                                <View style={{ marginRight: 20 }}>
                                    <Text style={{}}>6</Text>
                                    <Text style={{ marginTop: 10 }}>Rs. 1000</Text>
                                </View>
                            </View> */}
            </View>
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                marginTop: 10,
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
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
              <CustomButton
                text="next"
                onPress={() => {
                  onValidate();
                  //  navigation.navigate('EMICalculation')
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
