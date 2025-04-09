import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {GetApi, PostApi} from '../../Api/Api';
import Moment from 'moment';
import Constant from '../../CommonFiles/Constant';
import EmptyList from '../../Components/EmptyList/EmptyList';
import {ErrorToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import colors from '../../CommonFiles/Colors';

export default function ParticularCustomerCloseLoan({navigation, route}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Active');
  const [netInfo, setNetInfo] = useState('online');

  const [customerLoan, setCustomerLoan] = useState('');

  // useEffect(() => {
  //   getparticularCustomerLoan();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getparticularCustomerLoan();
      // }
    }, []),
  );

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

  const getparticularCustomerLoan = async () => {
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        status: 1,
      };
      const response = await PostApi(
        Constant.customerloanByStatus,
        data,
        false,
      );
      console.log('resp..', response);
      if (response.status == 200) {
        setCustomerLoan(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        //  ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  // const RenderActiveloanData = ({item}) => {
  //   return (
  //     <View>
  //       {/* {item.isClose == 1 && */}
  //       <TouchableOpacity
  //         onPress={() => {
  //           navigation.navigate('LoanDetails', {
  //             item: item,
  //             name: item.customer.firstName + ' ' + item.customer.lastName,
  //             isClose: true,
  //           });
  //         }}
  //         style={{
  //           backgroundColor: 'white',
  //           padding: 10,
  //           borderRadius: 10,
  //           marginTop: 10,
  //           marginBottom: 10,
  //           marginHorizontal: 20,
  //           shadowColor: 'gray',
  //           shadowOffset: {width: 0, height: 1},
  //           shadowOpacity: 1,
  //           shadowRadius: 2,
  //           elevation: 3,
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //         }}>
  //         <View style={{flex: 1}}>
  //           {/* <Text style={{ color: 'black', fontWeight: 'bold' }}>Status</Text> */}
  //           <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //             Loan Id
  //           </Text>
  //           <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //             Customer Name
  //           </Text>
  //           <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
  //             Loan Amount
  //           </Text>
  //         </View>
  //         <View style={{alignItems: 'flex-end'}}>
  //           {/* <Text style={{ color: item.loanStatus == 1 ? '#08C108' : '#E9BD1E' }}>{item.loanStatus == 0 ? 'Pending' : 'Sanction'}</Text> */}
  //           <Text style={{marginTop: 5}}>{loanidFormat(item.loanID, 3)}</Text>
  //           <Text style={{marginTop: 5}}>
  //             {item.customer.firstName} {item.customer.lastName}
  //           </Text>
  //           <Text style={{marginTop: 5}}>{item.loanAmount}</Text>
  //         </View>
  //       </TouchableOpacity>
  //       {/* } */}
  //     </View>
  //   );
  // };

  const RenderActiveloanData = ({item}) => {
    console.log('name', item.customer.firstName);
    return (
      <View>
        {console.log('name2', item.customer.firstName)}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LoanDetails', {
              item: item,
              image: item.customer.image,
              name: item.customer.firstName + ' ' + item.customer.lastName,
              isClose: true,
            });
          }}
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            marginBottom: 10,
            marginHorizontal: 20,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            // flexDirection: 'row',
            // alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Image
                source={{uri: Constant.ShowImage + item.customer.image}}
                style={{height: 50, width: 50, borderRadius: 50}}
              />
            </View>
            <View style={{marginLeft: 10, flex: 1}}>
              <Text
                numberOfLines={2}
                style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
                {item.customer.firstName} {item.customer.lastName}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end', marginLeft: 5}}>
              <Text style={{color: 'gray'}}>
                Loan ID : {loanidFormat(item.loanID, 3)}
              </Text>

              <Text style={{color: 'red'}}>Close Loan</Text>
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {item.loanAmount}
              </Text>
              <Text style={{color: 'gray'}}>Loan Amount</Text>
            </View>
            <View style={{width: '5%', alignItems: 'center'}}>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderColor: '#EBE9CE',
                  flex: 1,
                }}></View>
            </View>
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Moment(item.emiDate).format('DD-MMM')}
              </Text>

              <Text style={{color: 'gray'}}>Date of EMI</Text>
            </View>
          </View>

          {/* <View style={{flex: 1}}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>Status</Text>
            <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
              Loan Id
            </Text>
            <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
              Customer Name
            </Text>
            <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
              Loan Amount
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: item.loanStatus == 1 ? '#08C108' : '#E9BD1E'}}>
              {item.loanStatus == 0 ? 'Pending' : 'Sanction'}
            </Text>
            <Text style={{marginTop: 5}}>{loanidFormat(item.loanID, 3)}</Text>
            <Text style={{marginTop: 5}}>
              {item.customer.firstName} {item.customer.lastName}
            </Text>
            <Text style={{marginTop: 5}}>{item.loanAmount}</Text>
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };

  const loanidFormat = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.bgColor, flex: 1}}>
      {loading == true ? (
        <>
          {/* <View style={{marginHorizontal: 20, marginTop: 10}}>
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
          </View> */}
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
          contentContainerStyle={{
            paddingBottom: 65,
            paddingTop: 10,
            flexGrow: 1,
          }}
        />
      )}
    </SafeAreaView>
  );
}
