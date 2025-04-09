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
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Moment from 'moment';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import {useNetInfo} from '@react-native-community/netinfo';
import Constant from '../../CommonFiles/Constant';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {useSelector, useDispatch} from 'react-redux';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import removeEmojis from '../../Components/RemoveEmojis/RemoveEmojis';
import EmptyList from '../../Components/EmptyList/EmptyList';
import {PostApi} from '../../Api/Api';
import {
  INTERNET_AVAILABLE,
  INTERNET_NOT_AVAILABLE,
  lodingtrue,
} from '../../Redux/ReduxConstant';

export default function NextEMIdateLoan({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [yourName, setYourName] = useState('');
  const [email, setEmail] = useState('');
  const [customerLoan, setCustomerLoan] = useState('');
  const [netInfo, setNetInfo] = useState('online');
  const [comment, setComment] = useState('');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();

  const result = useSelector(state => state);
  const dispatch = useDispatch();
  console.log('result', result);

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getallcustomerLoan();
  //         InternetConnection();
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
          getallcustomerLoan();
        } else {
          setNetInfo('offline');
          ErrorToast(Message.KCheckInternetConnection);
        }
      });
    }, []),
  );

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getallcustomerLoan();
  //     }, [])
  // )

  const getallcustomerLoan = async () => {
    if (netInfo == 'online') {
      setLoading(true);
      console.log('other scren data.....');
      const data = {
        date: Moment().add(1, 'd').format('YYYY-MM-DD'),
      };
      const response = await PostApi(Constant.loanToday, data, false);
      console.log('response', response);
      if (response.status == 200) {
        setCustomerLoan(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const renderColor = date => {
    if (
      Moment(date).format('DD-MM-YYYY') ===
      Moment().add(0, 'd').format('DD-MM-YYYY')
    ) {
      console.log('ds', date, Moment(date).add(1, 'd'));
      return 'green';
    } else if (
      Moment(date).format('DD-MM-YYYY') >=
      Moment().add(0, 'd').format('DD-MM-YYYY')
    ) {
    }
  };

  const loanidFormat = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  };

  // const RenderActiveloanData = ({item}) => {
  //   return (
  //     <View>
  //       {/* {item.isClose == 0 && */}
  //       <TouchableOpacity
  //         onPress={() => {
  //           navigation.navigate('LoanDetails', {
  //             item: item,
  //             name:
  //               item.customer[0].firstName + ' ' + item.customer[0].lastName,
  //             isClose: false,
  //           });
  //         }}
  //         style={{
  //           backgroundColor: 'white',
  //           padding: 10,
  //           borderRadius: 10,
  //           marginTop: 10,
  //           marginBottom: 10,
  //           marginHorizontal: 20,
  //           shadowColor: 'black',
  //           shadowColor: 'gray',
  //           shadowOffset: {width: 0, height: 1},
  //           shadowOpacity: 1,
  //           shadowRadius: 2,
  //           elevation: 3,
  //         }}>
  //         {Moment(item.nextemiDate).format('DD') != Moment().format('DD') && (
  //           <Text style={{color: 'red'}}>
  //             {Moment().diff(
  //               Moment(item.nextemiDate).format('YYYY-MM-DD'),
  //               'days',
  //             )}{' '}
  //             days Due
  //           </Text>
  //         )}
  //         <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //           <View style={{flex: 1}}>
  //             <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //               Loan Id
  //             </Text>
  //             <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //               Customer Name
  //             </Text>
  //             <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //               EMI No.
  //             </Text>
  //             <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //               EMI Amount
  //             </Text>
  //           </View>
  //           <View style={{alignItems: 'flex-end'}}>
  //             <Text style={{marginTop: 5}}>{loanidFormat(item.loanID, 3)}</Text>
  //             <Text style={{marginTop: 5}}>
  //               {item.customer[0].firstName} {item.customer[0].lastName}
  //             </Text>
  //             <Text style={{marginTop: 5}}>{item.paidEmi + 1}</Text>
  //             <Text style={{marginTop: 5}}>
  //               {item.paidEmi == item.loanDuration - 1
  //                 ? item.LEA
  //                 : item.emiAmount}
  //             </Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       {/* } */}
  //     </View>
  //   );
  // };
  const RenderActiveloanData = ({item}) => {
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
              {Moment(item.nextemiDate).format('DD') !=
                Moment().format('DD') && (
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
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
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
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
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
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.blue, flex: 1}}>
      {/* <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            /> */}
      {/* <LinearGradient colors={[colors.blue, '#00BFFF']} style={{ flex: 1 }}> */}
      {/* <StatusBar translucent={true} backgroundColor={'transparent'} /> */}
      {/* </LinearGradient > */}
      <StatusBar barStyle="dark-content" backgroundColor={colors.blue} />
      {/* <View style={{ paddingBottom: 20, paddingTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}>Welcome to Loan App</Text>
            </View> */}
      {/* <LinearGradient
        colors={['#009FFD', colors.blue, '#06BCFB']}
        style={[StyleSheet.absoluteFill]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}> */}
      <View
        style={{
          backgroundColor: colors.bgColor,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        {loading == true ? (
          <>
            <View style={{marginHorizontal: 20, marginTop: 20}}>
              <SkeletonPlaceholder
                borderRadius={10}
                // highlightColor={colors.blue}
                speed={1000}>
                <View
                  style={{
                    width: '100%',
                    height: 135,
                    borderWidth: 1,
                    borderColor: '#E1E9EE',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '35%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '20%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '38%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '25%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '50%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '15%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '60%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '10%'}}></View>
                  </View>
                </View>
              </SkeletonPlaceholder>
            </View>
            <View style={{marginHorizontal: 20, marginTop: 20}}>
              <SkeletonPlaceholder
                borderRadius={10}
                // highlightColor={colors.blue}
                speed={1000}>
                <View
                  style={{
                    width: '100%',
                    height: 135,
                    borderWidth: 1,
                    borderColor: '#E1E9EE',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginTop: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '35%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '20%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '38%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '25%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '50%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '15%'}}></View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View
                      style={{
                        height: 20,
                        width: '40%',
                        marginRight: '60%',
                        flex: 1,
                      }}></View>
                    <View style={{height: 20, width: '10%'}}></View>
                  </View>
                </View>
              </SkeletonPlaceholder>
            </View>
          </>
        ) : (
          <FlatList
            data={customerLoan}
            renderItem={RenderActiveloanData}
            ListEmptyComponent={EmptyList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingVertical: 10, flexGrow: 1}}
          />
        )}
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
}
