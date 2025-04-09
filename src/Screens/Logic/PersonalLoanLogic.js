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
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import {PostApi, PostApiImage} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {ErrorToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import CommonStyle from '../../CommonFiles/CommonStyle';

export default function PersonalLoanLogic({navigation, route}) {
  const [loanAmount, setLoanAmount] = useState(
    Number(route.params.loanAmount),
    // Number(route.params.downPaymentAmount),
  );
  const [monthIntrest, setMonthIntrest] = useState(
    Number(
      Math.round(
        (Number(loanAmount) * Number(route.params.interestRate)) / Number(100),
      ),
    ),
  );
  // const [monthIntrest, setMonthIntrest] = useState(Number((Number(loanAmount) * Number(route.params.interestRate)) / Number(100)))
  const [totalIntrest, setTotalIntrest] = useState(
    Number(
      Math.round(Number(monthIntrest) * Number(route.params.duration)),
    ).toFixed(0),
  );
  const [totalRepayableAmount, setTotalRepayableAmount] = useState(
    Number(Math.round(Number(loanAmount) + Number(totalIntrest))),
    //  - Number(route.params.advanceInt),
  );
  const [emiAmount, setEmiAmount] = useState(
    route.params.interestType == 'Interest Only'
      ? Number(Math.round(monthIntrest))
      : Number(
          Math.round(
            Number(
              Number(Number(loanAmount) + Number(totalIntrest)),
              //- Number(route.params.advanceInt),
            ) / Number(route.params.duration),
          ),
        ).toFixed(2),
  );
  const [lastEMIAmount, setLastEMIAmount] = useState(
    route.params.interestType == 'Interest Only'
      ? Number(
          Math.round(
            Number(Number(loanAmount) + Number(monthIntrest)),
            //- Number(route.params.advanceInt),
          ),
        ).toFixed(2)
      : Number(
          Math.round(
            Number(
              Number(Number(loanAmount) + Number(totalIntrest)),
              // -  Number(route.params.advanceInt),
            ) / Number(route.params.duration),
          ),
        ).toFixed(2),
  );
  const [netDisbursalAmount, setNetDisbursalAmount] = useState(
    Number(route.params.loanAmount) - Number(route.params.processingFees),
  );
  const [emiDate, setEmiDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Active');
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  console.log(
    'tia',
    Number(Math.round(Number(monthIntrest) * Number(route.params.duration))),
  );

  useEffect(() => {
    Logics();
    console.log('...', lastEMIAmount);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const Logics = () => {
    const loanAmounts =
      Number(route.params.loanAmount) + Number(route.params.processingFees);
    // Number(route.params.downPaymentAmount);
    setLoanAmount(loanAmounts);

    // const Monthlyinteest = (Number(loanAmount) * Number(route.params.interestRate)) / Number(100);
    // //   setMonthIntrest(Monthlyinteest);

    // const totalintrest = Number(Monthlyinteest) * Number(route.params.duration);
    // setTotalIntrest(totalintrest);
  };

  const onCheck = () => {
    if (route.params.productImg == '' && route.params.invoiceImg == '') {
    }
  };

  const uploadProductImage = async () => {
    if (netInfo == 'online') {
      setLoading(true);
      if (route.params.productImg == '') {
        UploadInvoiceImage('');
      } else {
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
        // console.log('response..Image', response.data.image)
        if (response.status == 200) {
          setLoading(false);
          UploadInvoiceImage(response.data.image);
        } else {
          setLoading(false);
          ErrorToast(response.message);
        }
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };
  const UploadInvoiceImage = async product => {
    setLoading(true);
    if (route.params.invoiceImg == '') {
      onSubmitData('', product);
    } else {
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
      // console.log('response..Image', response.data.image)
      if (response.status == 200) {
        setLoading(false);
        onSubmitData(response.data.image, product);
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    }
  };

  const onSubmitData = async () => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        customer: route.params.id,
        mortgage: route.params.mortgageId,
        loanType: route.params.loanType == 'Gold Loan' ? 2 : 1,
        applianceName: null,
        brand: null,
        model: null,
        color: null,
        variant: null,
        price: null,
        serialNumber: null,
        invoice: null,
        product: null,
        processingFees: Number(route.params.processingFees),
        emiAmount: Number(emiAmount),
        downPayment: null,
        loanAmount: Number(loanAmount),
        emiType: route.params.interestType == 'Interest Only' ? 0 : 1,
        emiRate: Number(route.params.interestRate),
        emiDate: route.params.emiDate,
        loanDuration: Number(route.params.duration),
        MIA: Number(monthIntrest),
        TIA: Number(totalIntrest),
        TRA: Number(totalRepayableAmount),
        LEA: Number(lastEMIAmount),
        nextemiDate: route.params.emiDate,
        NetDisbursalAmount: netDisbursalAmount,
      };
      const response = await PostApi(Constant.addLoan, data, false);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        update(response.data.id);
        // navigation.navigate('LoanSummary', {
        //     // isNext: true,

        //     id: route.params.id,
        //     mortgageId: route.params.mortgageId,
        //     loanId: response.data.id
        // })
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const update = async id => {
    data = {
      id: id,
      loanStatus: 1,
    };
    const response = await PostApi(Constant.addLoan, data, true);
    console.log('resposssssssss', response);
    if (response.status == 200) {
      navigation.navigate('LoanSummary', {
        id: route.params.id,
        mortgageId: route.params.mortgageId,
        loanId: response.data.id,
        loanType: route.params.loanType,
      });
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
          // marginTop: 20,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        {/* {loading == false && */}
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20, marginTop: 40}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>Loan Amount</Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Processing Fees
                </Text>
                {/* <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Advance Int
                </Text> */}
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    paddingVertical: 10,
                  }}>
                  Net Disbursal Amount
                </Text>
                {/* <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                  Down Payment
                </Text> */}
                {/* <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Loan Amt
                </Text> */}
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Duration (Month)
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Interest Rate
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Monthly Interest Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Total Interest Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Total Repayable Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  EMI Date
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  EMI Type
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>EMI Amt</Text>
                {route.params.interestType == 'Interest Only' && (
                  <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                    Last EMI Amt
                  </Text>
                )}
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text>₹ {route.params.loanAmount}</Text>
                <Text style={{marginTop: 20}}>
                  ₹ {route.params.processingFees}
                </Text>
                {/* <Text style={{marginTop: 20}}>₹ {route.params.advanceInt}</Text> */}
                <Text
                  style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}>
                  ₹{' '}
                  {/* {
                    Number(route.params.loanAmount) -
                      Number(route.params.processingFees)
                    // route.params.advanceInt
                  } */}
                  {netDisbursalAmount}
                </Text>
                {/* <Text style={{marginTop: 10}}>
                  ₹ {route.params.downPaymentAmount}
                </Text> */}
                {/* <Text style={{marginTop: 20}}>₹ {loanAmount}</Text> */}
                <Text style={{marginTop: 20}}>
                  {Number(route.params.duration)}
                </Text>
                <Text style={{marginTop: 20}}>
                  {Number(route.params.interestRate)}%
                </Text>
                <Text style={{marginTop: 20}}>₹ {monthIntrest}</Text>
                <Text style={{marginTop: 20}}>
                  ₹ {Number(monthIntrest) * Number(route.params.duration)}
                </Text>
                <Text style={{marginTop: 20}}>₹ {totalRepayableAmount}</Text>
                <Text style={{marginTop: 20}}>
                  {Moment(route.params.emiDate).format('DD-MM-yyyy')}
                </Text>
                <Text style={{marginTop: 20}}>{route.params.interestType}</Text>
                {route.params.interestType == 'Interest Only' ? (
                  <Text style={{marginTop: 20}}>₹ {emiAmount}</Text>
                ) : (
                  <Text style={{marginTop: 20}}>₹ {emiAmount}</Text>
                )}
                {route.params.interestType == 'Interest Only' && (
                  <Text style={{marginTop: 20}}>₹ {lastEMIAmount}</Text>
                )}
              </View>
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
                  // uploadProductImage();
                  onSubmitData();
                  // navigation.navigate('LoanSummary', {
                  //     id: route.params.id,
                  //     mortgageId: route.params.mortgageId,
                  //     loanId: route.params.loanId
                  // })
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* } */}
      </View>
    </SafeAreaView>
  );
}
