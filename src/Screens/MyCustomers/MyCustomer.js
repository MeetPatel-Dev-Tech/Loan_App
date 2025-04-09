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
  Linking,
  Alert,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Constant from '../../CommonFiles/Constant';
import {FlatList} from 'react-native-gesture-handler';
import colors from '../../CommonFiles/Colors';
import {GetApi} from '../../Api/Api';
import EmptyList from '../../Components/EmptyList/EmptyList';
import {ErrorToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import {CommonUtilsObj} from '../../Utils/CommonUtils';

export default function MyCustomer({navigation}) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [myCustomers, setMyCustomers] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  const [netInfo, setNetInfo] = useState('online');
  useFocusEffect(
    React.useCallback(() => {
      NetInfo.addEventListener(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
        } else {
          setNetInfo('offline');
          ErrorToast(Message.KCheckInternetConnection);
        }
      });
      NetInfo.fetch().then(state => {
        console.log('state.isConnected2', state.isConnected);
        if (state.isConnected == true) {
          setNetInfo('online');
          getMyCustomers();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

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

  // useEffect(() => {
  //     getMyCustomers();
  // }, []);

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getMyCustomers()
  //     }, [])
  // )

  const getMyCustomers = async () => {
    // setLoading(true);
    if (netInfo == 'online') {
      const response = await GetApi(Constant.Customers);
      console.log('response...........data', response);
      console.log('response...........datakk', response.data[0]?.loan?.length);
      if (response.status == 200) {
        setMyCustomers(response.data);
        setCustomerSearch(response.data);

        const map1 = response.data.map(x =>
          [x.firstName, x.lastName].join(' '),
        );
        console.log('map', map1);
        // setCustomerSearch(map1);
        //   setMyCustomers(response.data, { name: map1 });
        //   setCustomerSearch(response.data, { name: map1 });

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

  const data = [
    {id: 1, CustomerName: 'meet', MoNo: 9558811128, ActiveLoan: 2},
    {id: 2, CustomerName: 'hiren', MoNo: 9558811128, ActiveLoan: 2},
    {id: 3, CustomerName: 'arpit', MoNo: 9558811128, ActiveLoan: 2},
    {id: 4, CustomerName: 'tejas', MoNo: 9558811128, ActiveLoan: 2},
    {id: 5, CustomerName: 'tejas', MoNo: 9558811128, ActiveLoan: 2},
    {id: 6, CustomerName: 'tejas', MoNo: 9558811128, ActiveLoan: 2},
    {id: 7, CustomerName: 'tejas', MoNo: 9558811128, ActiveLoan: 2},
  ];

  const onCheckStatus = item => {
    // navigation.navigate('CustomerDetails', {
    //     id: item.id
    // })

    console.log('dd', item);

    if (item.applicationStatus == 0) {
      navigation.navigate('Address', {
        id: item.id,
        isEdit: true,
      });
    } else if (item.applicationStatus == 1) {
      navigation.navigate('Occupation', {
        id: item.id,
        isEdit: true,
      });
    } else if (item.applicationStatus == 2) {
      navigation.navigate('Referance', {
        id: item.id,
        isEdit: true,
      });
    } else if (item.applicationStatus == 3) {
      navigation.navigate('NoDocument', {
        id: item.id,
        isEdit: true,
      });
    } else if (item.applicationStatus == 4) {
      navigation.navigate('CustomerDetails', {
        id: item.id,
      });
    }
  };

  const filter = loan => {
    //  console.log('loan', loan)
    const arry = [];
    for (let i = 0; i < loan.length; i++) {
      console.log('i', i, loan[i].isClose);
      if (loan[i].isClose == 0) {
        arry.push(loan[i].isClose);
      }
    }
    console.log('arry', arry);
    return arry.length;
  };

  const oncallPress = number => {
    let phoneNumber = number;

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber)
      .then(supported => {
        if (!supported) {
          Alert.alert('Phone number is not available');
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch(err => console.log('err', err));
  };

  const renderLoanDetails = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('CustomerDetails', {
          //     id: item.id
          // })
          onCheckStatus(item);
        }}
        style={{
          backgroundColor: 'white',
          padding: 15,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 10,
          marginHorizontal: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <Image
              source={{uri: Constant.ShowImage + item.image}}
              style={{height: 50, width: 50, borderRadius: 50}}
            />
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text
              numberOfLines={1}
              style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
              {item.firstName} {item.lastName}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end', marginLeft: 5}}>
            {/* <Text style={{color: 'gray'}}>
                Loan ID : {loanidFormat(item.loanID, 3)}
              </Text> */}
            <TouchableOpacity
              onPress={() => oncallPress(item.number)}
              style={{
                padding: 10,
                borderRadius: 30,
                backgroundColor: '#F2F9FE',
                borderWidth: 1,
                borderColor: '#CDE9FE',
              }}>
              <Image
                source={require('../../Assets/Image/Call.png')}
                style={{height: 20, width: 20, tintColor: colors.blue}}
              />
            </TouchableOpacity>

            {/* <Text
                style={{color: item.loanStatus == 1 ? '#08C108' : '#E9BD1E'}}>
                {item.loanStatus == 0 ? 'Pending' : 'Sanction'}
              </Text> */}
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
              {filter(item.loan)}
            </Text>
            <Text style={{color: 'gray'}}>Active Loan</Text>
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
              {item.number}
            </Text>

            <Text style={{color: 'gray'}}>Mobile Number</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearch = e => {
    if (netInfo == 'online') {
      setMyCustomers(
        customerSearch.filter(x => {
          console.log('gg', x);
          if (
            JSON.stringify(x.firstName + ' ' + x.lastName)
              .toLowerCase()
              .includes(e.toLowerCase())
          ) {
            return x;
          }
        }),
      );
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            marginHorizontal: 20,
          }}>
          <TextInput
            mode="outlined"
            value={search}
            theme={Constant.theme}
            onChangeText={value => {
              setSearch(value), handleSearch(value);
            }}
            label="Search"
            placeholder="Search"
            style={{flex: 1, marginRight: 10}}
          />
          <View
            style={{
              // padding: 10,
              backgroundColor: colors.blue,
              borderRadius: 10,
              height: 57,
              width: 57,
              marginTop: 5,
            }}>
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <AntDesign name="search1" size={25} color="white" />
            </View>
          </View>
        </View>
        <KeyboardAvoidingView style={{flex: 1}}>
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
              data={myCustomers}
              renderItem={renderLoanDetails}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingVertical: 10, flexGrow: 1}}
              ListEmptyComponent={EmptyList}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}
