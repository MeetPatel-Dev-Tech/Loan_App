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
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import Entypo from 'react-native-vector-icons/Entypo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TextInput} from 'react-native-paper';
import {Colors, FAB, Portal, Provider} from 'react-native-paper';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import ActiveLoan from './ActiveLoan';
import CloseLoan from './CloseLoan';
import colors from '../../CommonFiles/Colors';
import Constant from '../../CommonFiles/Constant';
import {GetApi, PostApi} from '../../Api/Api';
import {CommonUtilsObj} from '../../Utils/CommonUtils';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import {ErrorToast} from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';

export default function Loan({navigation, route}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active');
  const [state, setState] = React.useState({open: false});
  const [loanName, setLoanName] = React.useState('');
  const [loanImage, setLoanImage] = React.useState('');
  const [netInfo, setNetInfo] = useState('online');
  const [addLoanModalVisible, setAddLoanModalVisible] = React.useState(false);

  const onStateChange = ({open}) => setState({open});

  const {open} = state;

  // useFocusEffect(
  //   React.useCallback(() => {
  //     renderTabs();
  //   }, []),
  // );

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

  const renderTabs = () => {
    if (selectedTab === 'Active')
      return <ActiveLoan navigation={navigation} route={route} />;
    else if (selectedTab === 'Close')
      return <CloseLoan navigation={navigation} route={route} />;
    else return;
  };

  const onPressEvent = loanType => {
    if (route.params?.ExistCustomer == true) {
      findMortgage(loanType);
    } else {
      // navigation.navigate('AadharVerify', {
      //   isEdit: true,
      //   loanType: loanType,
      // });
      setAddLoanModalVisible(true);
    }
  };

  const onPress = () => {
    if (netInfo == 'online') {
      if (mobileNumber == '') {
        ErrorToast('Please Enter Mobile No.');
      } else if (mobileNumber.length != 10) {
        ErrorToast(Message.KMobileInvalid);
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
        ErrorToast(Message.vmo);
      } else {
        onsubmit();
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const onsubmit = async () => {
    setLoading(true);
    const data = {
      number: mobileNumber,
    };
    const response = await PostApi(Constant.customerVerify, data, false);
    console.log('response', response);
    if (response.status == 200) {
      setMobileNumber('');
      setAddLoanModalVisible(false);
      if (response.message == 'Customer Alredy Exists!') {
        if (response.data.applicationStatus == 0) {
          setLoading(false);
          navigation.navigate('Address', {
            id: response.data.id,
            isEdit: true,
            loanType: loanName,
          });
        } else if (response.data.applicationStatus == 1) {
          setLoading(false);
          navigation.navigate('Occupation', {
            id: response.data.id,
            isEdit: true,
            loanType: loanName,
          });
        } else if (response.data.applicationStatus == 2) {
          setLoading(false);
          navigation.navigate('Referance', {
            id: response.data.id,
            isEdit: true,
            loanType: loanName,
          });
        } else if (response.data.applicationStatus == 3) {
          setLoading(false);
          navigation.navigate('NoDocument', {
            id: response.data.id,
            isEdit: true,
            loanType: loanName,
          });
        } else if (response.data.applicationStatus == 4) {
          setLoading(false);
          findMortgages(response.data.id);
        }
      } else {
        // sendOtp(`+91${String(mobileNumber)}`);
        // navigation.navigate('OtpVerificationScreen', {
        //     number: String(mobileNumber)
        // });
        setLoading(false);
        navigation.navigate('PersonalDetails', {
          isEdit: true,
          number: String(mobileNumber),
          loanType: loanName,
          checkNumber: true,
        });
      }
      // setLoading(false);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const findMortgages = async id => {
    const response = await GetApi(Constant.getMortgagebyCustomerid + id);
    console.log('response', response.data.length);
    if (response.status == 200) {
      if (response.data.length == 0) {
        navigation.navigate('Mortage', {
          isEdit: true,
          id: id,
          loanType: loanName,
        });
      } else {
        if (loanName == 'Gold Loan') {
          navigation.navigate('GoldLoanGage', {
            id: id,
            loanType: loanName,
          });
        } else {
          navigation.navigate('MortageDetails', {
            id: id,
            loanType: loanName,
            isEdit: false,
          });
        }
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const findMortgage = async loanType => {
    console.log('loantype', loanType);
    const response = await GetApi(
      Constant.getMortgagebyCustomerid + route.params.id,
    );
    console.log('response', response.data.length);
    if (response.status == 200) {
      if (response.data.length == 0) {
        navigation.navigate('Mortage', {
          isEdit: true,
          id: route.params.id,
          loanType: loanType,
        });
      } else {
        navigation.navigate('MortageDetails', {
          id: route.params.id,
          loanType: loanType,
          isEdit: false,
        });
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  console.log('route', route.params);

  const MyTabBar = ({state, descriptors, navigation, position}) => {
    return (
      <View style={{alignItems: 'center', marginTop: 10}}>
        <View
          style={{
            // flexDirection: 'row',
            alignItems: 'center',
            // width: '80%',
            marginHorizontal: 20,
            height: 55,
            justifyContent: 'center',
            backgroundColor: 'white',
            flexDirection: 'row',
            paddingHorizontal: 5,
            //   paddingVertical: 5,
            borderRadius: 10,
          }}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                navigation.navigate({name: route.name, merge: true});
              }
            };

            const onLongPress = () => {
              console.log('djjkjkdjk');
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const inputRange = state.routes.map((_, i) => i);
            const opacity = position.interpolate({
              inputRange,
              outputRange: inputRange.map(i => (i === index ? 1 : 0)),
            });

            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: isFocused ? colors.blue : null,
                  padding: isFocused ? 10 : 0,
                  borderRadius: isFocused ? 7 : 0,
                  width: '90%',
                }}>
                <Text
                  style={{
                    color: isFocused ? 'white' : 'black',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const Tab = createMaterialTopTabNavigator();

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
        {/* <View
          style={{
            backgroundColor: 'white',
            marginHorizontal: 20,
            // padding: 15,
            flexDirection: 'row',
            marginTop: 20,
            borderRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('Active');
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: selectedTab == 'Active' ? '#DCE0E8' : 'white',
              padding: 15,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
            }}>
            <Text style={{color: '#525E60'}}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('Close');
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: selectedTab == 'Close' ? '#DCE0E8' : 'white',
              padding: 15,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View> */}
        {/* <View style={{flex: 1}}>{renderTabs()}</View> */}

        <Tab.Navigator
          initialRouteName="Active"
          style={{backgroundColor: colors.bgColor}}
          tabBar={props => <MyTabBar {...props} />}>
          <Tab.Screen
            name="Active"
            component={ActiveLoan}
            // options={({navigation}) => ({
            //   tabBarLabel: 'Active',
            // })}
          />
          <Tab.Screen
            name="Close"
            component={CloseLoan}
            options={({navigation}) => ({
              // tabBarItemStyle:{}
            })}
          />
        </Tab.Navigator>

        <FAB.Group
          fabStyle={{backgroundColor: colors.blue}}
          open={open}
          visible
          icon={props => <Entypo {...props} name={open ? 'cross' : 'plus'} />}
          actions={[
            // {icon: 'plus', onPress: () => console.log('Pressed add')},
            // {
            //   labelStyle: {backgroundColor: colors.blue},
            //   style: {backgroundColor: colors.blue},
            //   icon: 'star',
            //   label: 'Star',
            //   onPress: () => console.log('Pressed star'),
            // },
            {
              icon: props => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    {...props}
                    source={require('../../Assets/Image/Appliances.png')}
                    style={{
                      height: 30,
                      width: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      tintColor: colors.blue,
                    }}
                  />
                </View>
              ),
              label: 'Appliances Loan',
              onPress: () => {
                onPressEvent('Appliances Loan'),
                  setLoanName('Appliances Loan'),
                  setLoanImage(require('../../Assets/Image/Appliances.png'));
              },
            },
            {
              icon: props => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    {...props}
                    source={require('../../Assets/Image/Personal.png')}
                    style={{
                      height: 30,
                      width: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      tintColor: colors.blue,
                    }}
                  />
                </View>
              ),
              label: 'Personal Loan',
              onPress: () => {
                onPressEvent('Personal Loan'),
                  setLoanName('Personal Loan'),
                  setLoanImage(require('../../Assets/Image/Personal.png'));
              },
            },
            {
              icon: props => (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    {...props}
                    source={require('../../Assets/Image/Gold.png')}
                    style={{
                      height: 30,
                      width: 30,
                      alignItems: 'center',
                      justifyContent: 'center',
                      tintColor: colors.blue,
                    }}
                  />
                </View>
              ),
              label: 'Gold Loan',
              onPress: () => {
                // onPressEvent('Personal Loan'),
                onPressEvent('Gold Loan'),
                  setLoanName('Gold Loan'),
                  setLoanImage(require('../../Assets/Image/Gold.png'));

                // setLoanName('Gold Loan'),
                //   navigation.navigate('GoldLoanGage', {
                //     id: route.params.id,
                //     loanType: 'Gold Loan',
                //   });
              },
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />

        {/* <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: Dimensions.get('window').width / 2 - 75,
            padding: 10,
            backgroundColor: colors.blue,
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 10,
          }}>
          <View style={{}}>
            <Image
              source={require('../../Assets/Image/Loan-1.png')}
              style={{height: 25, width: 25, tintColor: 'white'}}
            />
          </View>
          <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Add a Loan</Text>
          </View>
          <View style={{}}>
            <Entypo name="chevron-up" size={25} color="white" />
          </View>
        </View> */}
      </View>

      <Modal
        isVisible={addLoanModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut">
        <View
          style={{
            justifyContent: 'center',
            // alignItems: 'center',
            flex: 1,
          }}>
          {/* <KeyboardAwareScrollView
            style={{flex: 1}}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}> */}
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              paddingVertical: 20,
              borderRadius: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={loanImage}
                style={{height: 50, width: 50, tintColor: colors.blue}}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'black',
                  fontSize: 16,
                  marginTop: 5,
                }}>
                {loanName}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 5,
                }}>
                Please enter customer phone number
              </Text>
            </View>
            <TextInput
              mode="outlined"
              keyboardType="numeric"
              maxLength={10}
              theme={Constant.theme}
              value={mobileNumber}
              label="Mobile Number"
              onChangeText={value => {
                setMobileNumber(value.replace(/[^0-9]/, ''));
              }}
              placeholder="Mobile Number" //AddCustomer  ExistCustomer
              style={{marginTop: 10}}
            />
            <View
              style={{
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="cancel"
                  onPress={() => {
                    setAddLoanModalVisible(false), setMobileNumber('');
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  text="next"
                  onPress={() => {
                    onPress();
                  }}
                />
              </View>
            </View>
          </View>
          {/* </KeyboardAwareScrollView> */}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
