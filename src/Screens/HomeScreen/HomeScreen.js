import React, {useState, useEffect} from 'react';
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
import Moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {GetApi, PostApi} from '../../Api/Api';
import colors from '../../CommonFiles/Colors';
import Constant from '../../CommonFiles/Constant';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import {
  INTERNET_AVAILABLE,
  INTERNET_NOT_AVAILABLE,
} from '../../Redux/ReduxConstant';
import EmptyList from '../../Components/EmptyList/EmptyList';
import {CommonUtilsObj} from '../../Utils/CommonUtils';

export default function HomeScreen({navigation}) {
  const [totalLoanAmt, setTotalLoanAmt] = useState(0);
  const [totalRepaybleAmount, setTotalRepaybleAmount] = useState(0);
  const [totalOutstandings, setTotalOutstandings] = useState(0);
  const [totalLoanLength, setTotalLoanLength] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [dueLength, setdueLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [customerLoan, setCustomerLoan] = useState('');

  // useEffect(() => {
  //     // if (props.route.params.customer == true) {
  //     //     getparticularCustomerLoan()
  //     // } else {
  //     getLocation()
  //     // }
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
          // dispatch({type: INTERNET_AVAILABLE});
        } else {
          setNetInfo('offline');
          // dispatch({type: INTERNET_NOT_AVAILABLE});
        }
      });
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
          // dispatch({type: INTERNET_AVAILABLE});
          // getallcustomerLoan();
          // getAllloan();
        } else {
          setNetInfo('offline');
          ErrorToast(Message.KCheckInternetConnection);
          // dispatch({type: INTERNET_NOT_AVAILABLE});
        }
      });
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      getallcustomerLoan();
      getAllloan();
    }, []),
  );

  let a = [];
  let b = a;

  console.log('skjjjjjjjjjjjjjjjj......//,,', a === b);
  console.log('skjjjjjjjjjjjjjjjj......//,,', a == b);

  useEffect(() => {
    navigation.setOptions({
      // backgroundColor: 'pink',
      //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
      headerLeft: () => (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
          <Image
            source={require('../../Assets/Image/logo.png')}
            style={{height: 40, width: 40}}
          />
          <Text
            style={{
              fontWeight: '500',
              fontSize: 20,
              color: 'white',
              marginLeft: 5,
            }}>
            {CommonUtilsObj.UserDetails[0].data.businessName}
          </Text>
        </View>
      ),
    });
  }, []);

  const result = useSelector(state => state);
  const dispatch = useDispatch();
  // console.log('result', result);

  const getAllloan = async () => {
    const response = await GetApi(Constant.LoanbyStatus + 0);
    console.log('response............', response.data);
    setTotalLoanLength(response.data.length);
    if (response.status == 200) {
      if (response.data != '') {
        let outstandingAmt = 0;
        let loanamount = 0;
        let RepayableAmt = 0;
        for (let num of response.data) {
          outstandingAmt = outstandingAmt + num.outstandingAmt;
          setTotalOutstandings(outstandingAmt);
          loanamount = loanamount + num.loanAmount;
          setTotalLoanAmt(loanamount);
          RepayableAmt = RepayableAmt + num.TRA;
          setTotalRepaybleAmount(RepayableAmt);
        }
        console.log('outstandingAmt', outstandingAmt);
        console.log('loanAmount', loanamount);
        console.log('length', response.data.length);
      } else {
        setTotalOutstandings(0);
        setTotalLoanAmt(0);
        setTotalRepaybleAmount(0);
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const loanidFormat = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  };

  const getallcustomerLoan = async () => {
    if (netInfo == 'online') {
      // setLoading(true);
      const data = {
        date: Moment().add(1, 'd').format('YYYY-MM-DD'),
      };
      const response = await PostApi(Constant.loanToday, data, false);
      console.log('response for due', response);
      if (response.status == 200) {
        setCustomerLoan(response.data);
        setdueLength(response.data.length);
        if (response.data != '') {
          setLoading(false);
          let due = 0;
          let dueamount = 0;
          for (let num of response.data) {
            dueamount =
              dueamount +
              (num.paidEmi == num.loanDuration - 1 ? num.LEA : num.emiAmount);
            setTotalDue(dueamount);
          }
          console.log('dueamount', dueamount);
          console.log('dueLength', response.data.length);
          // console.log('loanAmount', loanamount)
          // console.log('length', response.data.length)
        } else {
          setTotalDue(0);
        }
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const RenderActiveloanData = ({item, index}) => {
    if (index < 3) {
      return (
        <View>
          {/* {item.isClose == 0 && */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoanDetails', {
                item: item,
                image: item.customer[0].image,
                name:
                  item.customer[0].firstName + ' ' + item.customer[0].lastName,
                isClose: false,
              });
            }}
            style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              marginTop: 10,
              marginBottom: 10,
              marginHorizontal: 20,
              shadowColor: 'black',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Image
                  source={{uri: Constant.ShowImage + item.customer[0].image}}
                  style={{height: 50, width: 50, borderRadius: 50}}
                />
              </View>
              <View style={{marginLeft: 10, flex: 1}}>
                <Text
                  numberOfLines={1}
                  style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
                  {item.customer[0].firstName} {item.customer[0].lastName}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end', marginLeft: 5}}>
                <Text style={{color: 'gray'}}>
                  Loan ID : {loanidFormat(item.loanID, 3)}
                </Text>
                {Moment(item.nextemiDate).format('DD-MM-YYYY') !=
                  Moment().format('DD-MM-YYYY') && (
                  <Text style={{color: 'red'}}>
                    {Moment().diff(
                      Moment(item.nextemiDate).format('YYYY-MM-DD'),
                      'days',
                    )}{' '}
                    days Due
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                  {Constant.ruppy}{' '}
                  {item.paidEmi == item.loanDuration - 1
                    ? item.LEA
                    : item.emiAmount}
                </Text>
                <Text style={{color: 'gray'}}>EMI Amount</Text>
              </View>
              <View style={{width: '1%'}}>
                <View
                  style={{
                    borderLeftWidth: 1,
                    borderColor: '#EBE9CE',
                    flex: 1,
                  }}></View>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                  {item.paidEmi + 1}
                </Text>

                <Text style={{color: 'gray'}}>EMI No.</Text>
              </View>
            </View>

            {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
                  Loan Id
                </Text>
                <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
                  Customer Name
                </Text>
                <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
                  EMI No.
                </Text>
                <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
                  EMI Amount
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{marginTop: 5}}>{loanidFormat(item.loanID, 3)}</Text>
                <Text style={{marginTop: 5}}>
                  {item.customer[0].firstName} {item.customer[0].lastName}
                </Text>
                <Text style={{marginTop: 5}}>{item.paidEmi + 1}</Text>
                <Text style={{marginTop: 5}}>
                  {item.paidEmi == item.loanDuration - 1
                    ? item.LEA
                    : item.emiAmount}
                </Text>
              </View>
            </View> */}
          </TouchableOpacity>
          {/* } */}
        </View>
      );
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
          backgroundColor: '#F2F9FE',
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NextEMIdateLoan');
          }}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 20,
            backgroundColor: '#F6FBF7',
            marginTop: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#EBE9CE',
            // shadowColor: 'gray',
            // shadowOffset: {width: 0, height: 1},
            // shadowOpacity: 1,
            // shadowRadius: 2,
            // elevation: 3,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {totalDue}
              </Text>
              <Text style={{color: 'gray'}}>Due Amount</Text>
            </View>
            <View style={{width: '1%'}}>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: '#EBE9CE',
                  flex: 1,
                }}></View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {dueLength}
              </Text>

              <Text style={{color: 'gray'}}>Total Due</Text>
            </View>
          </View>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16}}>Due Amount</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
                {totalDue}
              </Text>
            </View>
          </View> */}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Loan', {
              ExistCustomer: false,
            });
          }}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: '#E6F4FF',
            marginTop: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#CDE9FE',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                // borderBottomWidth: 1,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {totalLoanLength}
              </Text>
              <Text style={{color: 'gray'}}>Active Loans</Text>
            </View>
            <View style={{width: '10%', alignItems: 'center'}}>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: '#CDE9FE',
                  flex: 1,
                }}></View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {totalLoanAmt}
              </Text>

              <Text style={{color: 'gray'}}>Loan Amount</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <View
              style={{
                flex: 1,
                borderTopWidth: 1,
                borderColor: '#CDE9FE',
              }}></View>
            <View style={{width: '10%', alignItems: 'center'}}>
              <View
                style={{
                  // borderLeftWidth: 1,
                  borderColor: '#CDE9FE',
                  flex: 1,
                }}></View>
            </View>
            <View
              style={{
                flex: 1,
                flex: 1,
                borderTopWidth: 1,
                borderColor: '#CDE9FE',
              }}></View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                // borderBottomWidth: 1,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {totalRepaybleAmount}
              </Text>
              <Text style={{color: 'gray'}}>Repayable Amount</Text>
            </View>
            <View style={{width: '10%', alignItems: 'center'}}>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: '#CDE9FE',
                  flex: 1,
                }}></View>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {totalOutstandings}
              </Text>

              <Text style={{color: 'gray'}}>Outstanding Amount</Text>
            </View>
          </View>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={{marginTop: 5, fontSize: 16}}>Loan Amount</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                {totalLoanAmt}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={{marginTop: 5, fontSize: 16}}>Repayable Amount</Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                {totalRepaybleAmount}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <Text style={{marginTop: 5, fontSize: 16}}>
                Outstanding Amount
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                {totalOutstandings}
              </Text>
            </View>
          </View> */}
        </TouchableOpacity>
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>
              Due
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('NextEMIdateLoan')}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
                color: colors.blue,
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={customerLoan}
            renderItem={RenderActiveloanData}
            ListEmptyComponent={EmptyList}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 5,
              paddingBottom: 10,
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
