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
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {ArrowIcon} from '../../CommonFiles/SvgFile';
import colors from '../../CommonFiles/Colors';
import Constant from '../../CommonFiles/Constant';
import {GetApi, PostApi} from '../../Api/Api';

export default function CustomerDetails({navigation, route}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [customerData, setCustomerData] = useState('');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState('');
  const [activeLoan, setActiveLoan] = useState('');
  const [closeLoan, setCloseLoan] = useState('');

  const data = [
    {id: 0, name: 'Loan', image: require('../../Assets/Image/Loan-1.png')},
    {
      id: 1,
      name: 'Personal Details',
      image: require('../../Assets/Image/User.png'),
    },
    {id: 2, name: 'Address', image: require('../../Assets/Image/Location.png')},
    {
      id: 3,
      name: 'Occupation',
      image: require('../../Assets/Image/business.png'),
    },
    {
      id: 4,
      name: 'Reference',
      image: require('../../Assets/Image/Reference.png'),
    },
    {
      id: 5,
      name: 'Document',
      image: require('../../Assets/Image/Document.png'),
    },
    {
      id: 6,
      name: 'Mortgage',
      image: require('../../Assets/Image/Mortgage.png'),
    },
  ];

  console.log('customerDetails', route.params.id);

  // useEffect(() => {
  //     getCustomerByid();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getparticularCustomerCloseLoan();
      getparticularCustomerActiveLoan();
      getCustomerByid();
    }, []),
  );

  const getparticularCustomerActiveLoan = async () => {
    // if (netInfo == true) {
    const data = {
      id: route.params.id,
      status: 0,
    };
    const response = await PostApi(Constant.customerloanByStatus, data, false);
    console.log('resp..', response);
    if (response.status == 200) {
      console.log('idjdjdjdjj.........', response.data.length);

      setActiveLoan(response.data.length);
      for (let i = 0; i < response.data.length; i++) {
        console.log('i', response.data.length);

        // if (loan[i].isClose == 0) {
        //   arry.push(loan[i].isClose);
        // }
      }
      //   console.log('arry', arry);
    } else {
      setLoading(false);
      //   ErrorToast(response.message);
    }
    // } else {
    //   setLoading(false);
    //   ErrorToast(Message.KCheckInternetConnection);
    // }
  };

  const getparticularCustomerCloseLoan = async () => {
    // if (netInfo == 'online') {
    const data = {
      id: route.params.id,
      status: 1,
    };
    const response = await PostApi(Constant.customerloanByStatus, data, false);
    console.log('resp..', response);
    if (response.status == 200) {
      setCloseLoan(response.data.length);
      setLoading(false);
    } else {
      setLoading(false);
      //  ErrorToast(response.message);
    }
    // } else {
    //   setLoading(false);
    //   ErrorToast(Message.KCheckInternetConnection);
    // }
  };

  const getCustomerByid = async () => {
    setLoading(true);
    const response = await GetApi(Constant.Customers + '/' + route.params.id);
    console.log('response', response);
    if (response.status == 200) {
      setCustomerData(response.data);
      setUserProfile(response.data.image);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const pressEvent = name => {
    if (name == 'Loan') {
      return navigation.navigate('ParticularCustomerLoan', {
        isEdit: true,
        ExistCustomer: true,
        //  customer: true,
        id: route.params.id,
        name: firstName + ' ' + lastName,
      });
    } else if (name == 'Personal Details') {
      return navigation.navigate('PersonalDetails', {
        isEdit: false,
        id: route.params.id,
        data: customerData,
        checkNumber: false,
      });

      // return navigation.navigate('BottomStack', {
      //     screen: 'PersonalDetails',
      //     params: {
      //         isEdit: false,
      //         id: route.params.id,
      //         data: customerData
      //     },
      // });
    } else if (name == 'Address') {
      return navigation.navigate('Address', {
        isEdit: false,
        id: route.params.id,
        data: customerData,
      });
    } else if (name == 'Occupation') {
      return navigation.navigate('Occupation', {
        isEdit: false,
        id: route.params.id,
        data: customerData,
      });
    } else if (name == 'Reference') {
      if (customerData.reffirstName == null) {
        return navigation.navigate('Referance', {
          isEdit: true,
          AgainEdit: true,
          id: route.params.id,
          data: customerData,
        });
      } else {
        return navigation.navigate('Referance', {
          isEdit: false,
          id: route.params.id,
          data: customerData,
        });
      }
    } else if (name == 'Document') {
      return navigation.navigate('Document', {
        isEdit: false,
        id: route.params.id,
        data: customerData,
        preview: true,
      });
    } else if (name == 'Mortgage') {
      return findMortgage();
    }
  };

  const renderProfileItem = ({item, index}) => {
    if (profile?.userTypeId != 1 && item.name == 'Super Admin') {
      return null;
    } else if (profile?.userTypeId >= 3 && item.name == 'Manage My Sabha') {
      return null;
    } else {
      return (
        <View
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            marginHorizontal: 20,
            borderBottomWidth: item.name == 'Logout' ? 0 : 1,
            borderBottomColor: 'gray',
          }}>
          <TouchableOpacity
            onPress={() => onPressEvent(item.name, index)}
            style={{
              backgroundColor: 'white',
              // padding: 15,
              flexDirection: 'row',
              alignItems: 'center',
              // marginTop: 10,
              // marginBottom: 10,
            }}>
            <View
              style={{
                backgroundColor: '#FCF7FF',
                // padding: 5,
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginRight: 10,
              }}>
              <Image source={item.image} style={{height: 40, width: 40}} />
            </View>
            <View
              style={{
                flex: 1,
              }}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 14}}>
                {item.name}
              </Text>
            </View>
            <View
              style={{
                transform: [
                  {rotate: selectedIndex == index ? '90deg' : '0deg'},
                ],
              }}>
              <ArrorIcon height={15} width={15} />
            </View>
          </TouchableOpacity>
          {selectedIndex == index && (
            <>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SabhaList');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <View style={{flex: 1, marginLeft: 50}}>
                  <Text style={{fontWeight: '700'}}>Manage Sabhas</Text>
                </View>
                <View>
                  <ArrorIcon height={15} width={15} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageNGC');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <View style={{flex: 1, marginLeft: 50}}>
                  <Text style={{fontWeight: '700'}}>
                    Manage North Gujarat Committee
                  </Text>
                </View>
                <View>
                  <ArrorIcon height={15} width={15} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageDesignation');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <View style={{flex: 1, marginLeft: 50}}>
                  <Text style={{fontWeight: '700'}}>Manage Designation</Text>
                </View>
                <View>
                  <ArrorIcon height={15} width={15} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageSuperAdmin', {});
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <View style={{flex: 1, marginLeft: 50}}>
                  <Text style={{fontWeight: '700'}}>Manage Super Admin</Text>
                </View>
                <View>
                  <ArrorIcon height={15} width={15} />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    }
  };

  const renderCustomerDetails = ({item}) => {
    return (
      <View
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          marginHorizontal: 20,
          borderBottomWidth: item.name == 'Mortgage' ? 0 : 1,
          borderBottomColor: 'gray',
        }}>
        <TouchableOpacity
          onPress={() => pressEvent(item.name)}
          style={{
            // backgroundColor: 'white',
            // padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            // marginTop: 10,
            // marginBottom: 10,
          }}>
          <View
            style={{
              backgroundColor: '#E6F4FF',
              padding: 5,
              // padding: 5,
              //   height: 40,
              //   width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              marginRight: 10,
            }}>
            <Image
              source={item.image}
              style={{height: 30, width: 30, tintColor: colors.blue}}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 14}}>
              {item.name}
            </Text>
          </View>
          <View>
            <ArrowIcon height={15} width={15} />
          </View>
        </TouchableOpacity>
      </View>

      //   <TouchableOpacity
      //     onPress={() => pressEvent(item.name)}
      //     style={{
      //       backgroundColor: 'white',
      //       padding: 20,
      //       shadowColor: 'gray',
      //       shadowOffset: {width: 0, height: 1},
      //       shadowOpacity: 1,
      //       shadowRadius: 2,
      //       elevation: 3,
      //       marginTop: 10,
      //       marginBottom: 10,
      //       borderRadius: 10,
      //       flexDirection: 'row',
      //       alignItems: 'center',
      //       marginHorizontal: 20,
      //     }}>
      //     <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>
      //       {item.name}
      //     </Text>
      //     <View
      //       style={{
      //         backgroundColor: '#F3F3F3',
      //         padding: 5,
      //         borderRadius: 5,
      //         shadowColor: 'gray',
      //         shadowOffset: {width: 0, height: 1},
      //         shadowOpacity: 1,
      //         shadowRadius: 2,
      //         elevation: 3,
      //       }}>
      //       <ArrowIcon height={10} width={10} />
      //     </View>
      //   </TouchableOpacity>
    );
  };

  const findMortgage = async loanType => {
    console.log('loantype', loanType);
    const response = await GetApi(
      Constant.getMortgagebyCustomerid + route.params.id,
    );
    console.log('response', response.data.length);
    if (response.status == 200) {
      if (response.data.length == 0) {
        navigation.navigate('AddMortgage2', {
          isEdit: true,
          id: route.params.id,
        });
      } else {
        navigation.navigate('MortageDetails', {
          id: route.params.id,
          loanType: loanType,
          isEdit: true,
        });
      }
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
          //   marginTop: 10,
          //   borderTopLeftRadius: 30,
          //   borderTopRightRadius: 30,
        }}>
        <View
          style={{
            marginTop: 20,
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View>
            <Image
              source={{uri: Constant.ShowImage + userProfile}}
              style={{height: 70, width: 70, borderRadius: 10}}
            />
          </View>
          <View
            style={{
              marginLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
                marginBottom: 5,
              }}>
              {firstName} {lastName}
            </Text>
            <Text>{customerData.number}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            backgroundColor: 'white',
            marginHorizontal: 20,
            borderRadius: 10,
            padding: 5,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
              {activeLoan}
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
              {closeLoan}
            </Text>

            <Text style={{color: 'gray'}}>Close Loan</Text>
          </View>
        </View>

        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderCustomerDetails}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
