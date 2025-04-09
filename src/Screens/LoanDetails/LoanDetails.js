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
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import Modal from 'react-native-modal';
import Moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import Details from './Screens/Details';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import EMI from './Screens/EMI';
import Statement from './Screens/Statement';
import NetInfo from '@react-native-community/netinfo';
import {Group} from '../../CommonFiles/SvgFile';
import {Colors, TextInput} from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Constant from '../../CommonFiles/Constant';
import {FadeIn} from 'react-native-reanimated';
import colors from '../../CommonFiles/Colors';
import {GetApi} from '../../Api/Api';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';

export default function LoanDetails({navigation, route}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [selectedTab, setSelectedTab] = useState('Details');
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [isCloseLoanModalVisible, setIsCloseLoanModalVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const renderTabs = () => {
    if (selectedTab === 'Details')
      return <Details navigation={navigation} route={route} />;
    else if (selectedTab === 'Statemnt') return <Statement route={route} />;
    else if (selectedTab === 'EMI Schedule') return <EMI route={route} />;
    else return;
  };

  const payEmiCalculation = () => {
    console.log(
      'ggg',
      route.params.item.emiType,
      route.params.item.LEA,
      route.params.item.paidEmi,
    );
    if (route.params.item.emiType == 0) {
      if (route.params.item.paidEmi === route.params.item.loanDuration - 1) {
        console.log('ggggggggggg');
        navigation.navigate('CreditEMI', {
          loanId: route.params.item.id,
          EMIAmount: route.params.item.LEA,
        });
      } else {
        navigation.navigate('CreditEMI', {
          loanId: route.params.item.id,
          EMIAmount: route.params.item.emiAmount,
        });
      }
    } else {
      navigation.navigate('CreditEMI', {
        loanId: route.params.item.id,
        EMIAmount: route.params.item.emiAmount,
      });
    }
  };

  const CreditEMI = () => {
    if (netInfo == 'online') {
      navigation.navigate('CreditEMI', {
        loanId: route.params.item.id,
      });
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };
  const CloseLoans = () => {
    if (netInfo == 'online') {
      navigation.navigate('CloseLoans', {
        loanId: route.params.item.id,
        EMIAmount: route.params.item.emiAmount,
      });
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const loanidFormat = (nr, n, str) => {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
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
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            marginTop: 20,
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Image
                source={{
                  uri: Constant.ShowImage + route.params.image,
                }}
                style={{height: 50, width: 50, borderRadius: 50}}
              />
            </View>
            <View style={{marginLeft: 10, flex: 1}}>
              <Text
                numberOfLines={1}
                style={{fontWeight: 'bold', color: 'black', fontSize: 16}}>
                {route.params.name}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end', marginLeft: 5}}>
              <Text style={{color: 'gray'}}>
                Loan ID : {loanidFormat(route.params.item.loanID, 3)}
              </Text>
              {Moment(route.params.item.nextemiDate).format('DD-MM-YYYY') <=
                Moment().format('DD-MM-YYYY') && (
                <Text style={{color: 'red'}}>
                  {Moment().diff(
                    Moment(route.params.item.nextemiDate).format('YYYY-MM-DD'),
                    'days',
                  )}{' '}
                  days Due
                </Text>
              )}
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                {Constant.ruppy} {route.params.item.loanAmount}
              </Text>
              <Text style={{color: 'gray'}}>Loan Amount</Text>
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
                {Moment(route.params.item.nextemiDate).format('DD-MMM-YY')}
              </Text>

              <Text style={{color: 'gray'}}>Date of EMI</Text>
            </View>
          </View>

          {/* <View style={{flex: 1}}>
            <Text>Loan Id</Text>
            <Text style={{marginTop: 5}}>Customer Name</Text>
            <Text style={{marginTop: 5}}>Loan Amount</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{}}>{loanidFormat(route.params.item.loanID, 3)}</Text>
            <Text style={{marginTop: 5}}>{route.params.name}</Text>
            <Text style={{marginTop: 5}}>{route.params.item.loanAmount}</Text>
          </View> */}
        </View>
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            marginHorizontal: 20,
            padding: 7,
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('Details');
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: selectedTab == 'Details' ? colors.blue : 'white',
              padding: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: selectedTab == 'Details' ? 'white' : '#A1A6AA',
                fontWeight: selectedTab == 'Details' ? 'bold' : '500',
              }}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('Statemnt');
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor:
                selectedTab == 'Statemnt' ? colors.blue : 'white',
              padding: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: selectedTab == 'Statemnt' ? 'white' : '#A1A6AA',
                fontWeight: selectedTab == 'Statemnt' ? 'bold' : '500',
              }}>
              Statement
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab('EMI Schedule');
            }}
            style={{
              flex: 1,
              backgroundColor:
                selectedTab == 'EMI Schedule' ? colors.blue : 'white',
              padding: 10,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: selectedTab == 'EMI Schedule' ? 'white' : '#A1A6AA',
                fontWeight: selectedTab == 'EMI Schedule' ? 'bold' : '500',
              }}>
              EMI Schedule
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>{renderTabs()}</View>
        {route.params.isClose == false && (
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1, marginRight: 20}}>
              <CustomBorderButton
                text="Forclose loan"
                onPress={() => CloseLoans()}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomButton text="Credit EMIs" onPress={() => CreditEMI()} />
            </View>
          </View>
        )}
        {/* {route.params.isClose == false && isModalVisible == false && (
          // <TouchableOpacity onPress={() => { setIsOptionVisible(!isOptionVisible) }}
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(true);
            }}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              padding: 15,
              backgroundColor: colors.blue,
              borderRadius: 40,
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
            }}>
            <Entypo name="dots-three-vertical" size={20} color="white" />
          </TouchableOpacity>
        )} */}

        <Modal
          isVisible={isModalVisible}
          animationIn="flipInX"
          animationOut="flipOutX"
          transparent={true}
          backdropOpacity={0.5}
          style={{
            position: 'absolute',
            bottom: Platform.OS == 'android' ? 0 : 25,
            right: 0,
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(!isModalVisible);
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              padding: 15,
              backgroundColor: colors.blue,
              borderRadius: 40,
              shadowColor: 'black',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
            }}>
            <Entypo name="dots-three-vertical" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              CreditEMI();
              setIsModalVisible(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              bottom: 65,
              right: 0,
            }}>
            <View
              style={{
                backgroundColor: colors.blue,
                borderRadius: 10,
                padding: 15,
                width: '50%',
                flex: 1,
              }}>
              <Text style={{color: 'white', fontSize: 20}}>Credit EMIs</Text>
            </View>
            {/* <View style={{
                        shadowColor: 'black',
                        backgroundColor: colors.blue,
                                                  shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3, padding: 15, borderRadius: 40, marginLeft: 20
                    }}>
                        <Group height={20} width={20} />
                    </View> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              CloseLoans();
              setIsModalVisible(false);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              bottom: 130,
              right: 0,
            }}>
            <View
              style={{
                backgroundColor: colors.blue,
                borderRadius: 10,
                padding: 15,
                width: '50%',
                flex: 1,
              }}>
              <Text style={{color: 'white', fontSize: 20}}>Forclose loan</Text>
            </View>
            {/* <View style={{
                        shadowColor: 'black',
                        backgroundColor: colors.blue,
                                                  shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3, padding: 15, borderRadius: 40, marginLeft: 20
                    }}>
                        <Group height={20} width={20} />
                    </View> */}
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
