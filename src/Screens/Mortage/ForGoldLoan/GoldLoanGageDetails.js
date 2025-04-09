import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  // Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {Image} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import colors from '../../../CommonFiles/Colors';
import {GetApi} from '../../../Api/Api';
import Constant from '../../../CommonFiles/Constant';
import Message from '../../../CommonFiles/Message';
import {ErrorToast} from '../../../ToastMessages/Toast';
import EmptyList from '../../../Components/EmptyList/EmptyList';

export default function GoldLoanGageDetails({navigation, route}) {
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [zipped, setZipped] = useState('');
  const [select, setSelect] = useState('');
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [mortagageDetails, setMortagageDetails] = useState('');
  const [selectedMortagageDetails, setSelectedMortagageDetails] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();

  // useEffect(() => {
  //     getMortgageDetails()
  // }, []);

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
          //   getMortgageDetails();
        } else {
          //  ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
    }, []),
  );

  const data = [
    {
      id: 1,
      maatelType: 'Gold',
      jewelry: 'Chain',
      purity: '24 crt',
      NetValue: 500,
      valuation: 50000,
    },
  ];

  const getMortgageDetails = async () => {
    const response = await GetApi(
      Constant.getMortgagebyCustomerid + route.params.id,
    );
    console.log('response', response.data);
    if (response.status == 200) {
      setMortagageDetails(response.data);
      if (response.data.length > 0) {
        setSelectedMortagageDetails(response.data[0].id);
      }
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  console.log('sddddd', selectedMortagageDetails);

  const onValidate = () => {
    // if (netInfo == 'online') {
    //   var flag = true;
    //   var errorMsg = [];
    //   if (selectedMortagageDetails == '') {
    //     flag = false;
    //     errorMsg.push(Message.mortgageDetails);
    //   }
    //   if (flag) {
    //     onSubmit();
    //   } else {
    //     var errMsg = '';
    //     if (errorMsg.length > 2) {
    //       errMsg = Message.KRequiredFiledsEmpty;
    //     } else {
    //       if (errorMsg.length == 2) {
    //         errMsg = errorMsg[0] + ', ' + errorMsg[1];
    //       } else {
    //         errMsg = errorMsg[0];
    //       }
    //     }
    //     ErrorToast(errMsg);
    //   }
    // } else {
    //   ErrorToast(Message.KCheckInternetConnection);
    // }
    navigation.navigate('AddPersonalLoan', {
      id: route.params.id,
      // mortgageId: selectedMortagageDetails,
    });
  };

  const onSubmit = () => {
    navigation.navigate('ProductDetails', {
      id: route.params.id,
      mortgageId: selectedMortagageDetails,
    });
  };

  const renderMortageDetails = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 10,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.maatelType}
            </Text>
            <Text>MatelType</Text>
          </View>
          <View style={{width: '1%'}}>
            <View
              style={{borderLeftWidth: 1, borderColor: 'gray', flex: 1}}></View>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.jewelry}
            </Text>
            <Text>Jewelry</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 10,
            marginTop: 10,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.purity}
            </Text>
            <Text>Purity</Text>
          </View>
          <View style={{width: '1%'}}>
            <View
              style={{borderLeftWidth: 1, borderColor: 'gray', flex: 1}}></View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.NetValue}
            </Text>
            <Text>netWeight</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 10,
            marginTop: 10,
          }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.valuation}
            </Text>
            <Text>Valuation</Text>
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <Image
            source={{uri: Constant.ShowImage + item.image}}
            style={{
              width: '100%',
              aspectRatio: 135 / 76,
              borderRadius: 10,
              alignItems: 'center',
            }}
            resizeMode="stretch"
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedCardIndex(index), setSelectedMortagageDetails(item.id);
          }}
          style={{position: 'absolute', top: -10, right: -10}}>
          <MaterialCommunityIcons
            name={
              selectedCardIndex === index ? 'radiobox-marked' : 'radiobox-blank'
            }
            size={30}
            color={colors.blue}
          />
        </TouchableOpacity>
      </View>
    );
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
          backgroundColor: '#F9F9FA',
          flex: 1,
          marginTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <View style={{flex: 1, marginTop: 10}}>
          <FlatList
            data={data}
            renderItem={renderMortageDetails}
            ListEmptyComponent={EmptyList}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexGrow: 1}}
          />
        </View>
        <View style={{marginHorizontal: 20, marginBottom: 20, marginTop: 10}}>
          <CustomButton
            text="next"
            onPress={() => {
              onValidate();
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddMortgage2', {
              isEdit: true,
              id: route.params.id,
            });
          }}
          style={{
            position: 'absolute',
            bottom: 90,
            right: 20,
            padding: 10,
            backgroundColor: colors.blue,
            borderRadius: 40,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
          }}>
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
