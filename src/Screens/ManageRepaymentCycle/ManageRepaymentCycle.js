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
import SignatureScreen from 'react-native-signature-canvas';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {ArrowIcon} from '../../CommonFiles/SvgFile';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Constant from '../../CommonFiles/Constant';
import colors from '../../CommonFiles/Colors';
import Message from '../../CommonFiles/Message';
import {ErrorToast} from '../../ToastMessages/Toast';
import {GetApi, PostApi} from '../../Api/Api';

export default function ManageRepaymentCycle({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  const [days, setDays] = useState('');
  const [repaymentList, setRepaymentList] = useState('');
  const [interest, setInterest] = useState('');

  const data = [
    {id: 1, name: 'Monthly', days: 10},
    {id: 2, name: 'yearly', days: 5},
    {id: 3, name: 'Weekly', days: 10},
    {id: 4, name: '6 Month', days: 25},
    {id: 5, name: '9 Month', days: 34},
    {id: 6, name: 'Monthly', days: 10},
  ];

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();

  useEffect(() => {
    getAllManageRepayment();
  }, []);

  const getAllManageRepayment = async () => {
    setLoading(true);
    const response = await GetApi(Constant.ManageRepayment);
    console.log('response', response);
    if (response.status == 200) {
      setRepaymentList(response.data);
      setLoading(false);
    } else {
      ErrorToast(response.message);
    }
  };

  const onValidate = () => {
    var flag = true;
    var errorMsg = [];
    if (names == '') {
      flag = false;
      errorMsg.push(Message.KDogNameEmpty);
    }
    if (days == '') {
      flag = false;
      errorMsg.push(Message.KDogNameEmpty);
    }
    if (flag) {
      // onSubmitData();
      onSubmit();
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
  };

  const onSubmit = async () => {
    setLoading(true);
    const data = {
      name: names,
      days: days,
    };
    const response = await PostApi(Constant.ManageRepayment, data, false);
    console.log('respons..', response);
    if (response.status == 200) {
      setIsModalVisible(false);
      setLoading(false);
      getAllManageRepayment();
    } else {
      ErrorToast(response.message);
    }
  };

  const renderRepaymentList = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
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
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          Names :
          <Text style={{fontWeight: 'normal', color: 'gray'}}>
            {' '}
            {item.name}
          </Text>
        </Text>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          Days :{' '}
          <Text style={{fontWeight: 'normal', color: 'gray'}}>
            {' '}
            {item.days}
          </Text>
        </Text>
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
        {/* <KeyboardAwareScrollView style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}> */}
        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            data={repaymentList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderRepaymentList}
          />
        </View>
        <View style={{margin: 20, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, marginRight: 20}}>
            <CustomBorderButton text="cancel" />
          </View>
          <View style={{flex: 1}}>
            <CustomButton text="save" />
          </View>
        </View>
        {/* </KeyboardAwareScrollView> */}
      </View>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        //  animationOut='slideOutDown'
        swipeDirection="down"
        onSwipeComplete={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            marginBottom: -20,
            marginHorizontal: -20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingHorizontal: 30,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{height: 2, width: 40, backgroundColor: 'gray'}}></View>
              <View
                style={{
                  height: 2,
                  width: 40,
                  backgroundColor: 'gray',
                  marginTop: 2,
                }}></View>
            </View>
            <KeyboardAvoidingView style={{}}>
              <TextInput
                mode="outlined"
                value={names}
                theme={Constant.theme}
                onChangeText={value => {
                  setNames(value);
                }}
                label="Names"
                placeholder="Names"
                returnKeyType="next"
                style={{marginTop: 20}}
                ref={RefNo1}
                onSubmitEditing={() => RefNo2.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                mode="outlined"
                value={days}
                theme={Constant.theme}
                onChangeText={value => {
                  setDays(value);
                }}
                label="Days"
                placeholder="Days"
                keyboardType="numeric"
                returnKeyType="done"
                style={{marginTop: 20}}
                ref={RefNo2}
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={false}
              />
            </KeyboardAvoidingView>
            <View
              style={{
                marginVertical: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton text="cancel" />
              </View>
              <View style={{flex: 1}}>
                <CustomButton text="save" onPress={() => onValidate()} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          setIsModalVisible(true);
        }}
        style={{
          position: 'absolute',
          bottom: 85,
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
    </SafeAreaView>
  );
}
