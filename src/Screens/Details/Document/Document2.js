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
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import colors from '../../../CommonFiles/Colors';
import {ArrowIcon} from '../../../CommonFiles/SvgFile';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import {GetApi} from '../../../Api/Api';
import Constant from '../../../CommonFiles/Constant';
import {ErrorToast} from '../../../ToastMessages/Toast';

export default function Document2({navigation, route}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signatureCapture, setSignatureCapture] = useState('');
  const [customers, setCustomers] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // if (props.route.params?.customer == true) {
      getCustomer();
      // } else {
      //     getallcustomerLoan();
      // }
    }, []),
  );

  const getCustomer = async () => {
    const response = await GetApi(Constant.Customers + '/' + route.params.id);
    console.log('res', response);
    if (response.status == 200) {
      setCustomers(response.data);
    } else {
      ErrorToast(response.message);
    }
  };

  const ref = useRef();

  const handleOK = signature => {
    console.log('sign', signature);
    setSignatureCapture(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log('end');
    ref.current.readSignature();
    setIsModalVisible(false);
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const data = [
    {id: 1, name: 'Aadhar Card'},
    {id: 2, name: 'Pan Card'},
    {id: 3, name: 'Driving Licences'},
  ];

  const pressEvent = name => {
    if (name == 'Aadhar Card') {
      if (customers.aadharFront == null) {
        console.log('fff', customers.aadharFront);
        return navigation.navigate('AadharCardDoc2', {
          isEdit: true,
          id: route.params.id,
          preview: true,
        });
      } else {
        return navigation.navigate('AadharCardDoc2', {
          isEdit: false,
          id: route.params.id,
          data: customers,
          preview: true,
        });
      }
    } else if (name == 'Pan Card') {
      if (customers.pancard == null) {
        return navigation.navigate('PanCardDoc2', {
          AgainEdit: true,
          isEdit: true,
          id: route.params.id,
          data: customers,
          priview: true,
        });
      } else {
        return navigation.navigate('PanCardDoc2', {
          isEdit: false,
          id: route.params.id,
          data: customers,
          priview: true,
        });
      }
    } else if (name == 'Driving Licences') {
      if (customers.drivingLicense == null) {
        return navigation.navigate('DrivingLicenceDocument2', {
          AgainEdit: true,
          isEdit: true,
          id: route.params.id,
          data: customers,
          priview: true,
        });
      } else {
        return navigation.navigate('DrivingLicenceDocument2', {
          isEdit: false,
          id: route.params.id,
          data: customers,
          priview: true,
        });
      }
    }
  };
  // const pressEvent = (name) => {
  //     if (name == 'Aadhar Card') {
  //         if (route.params.isEdit == true) {
  //             return navigation.navigate('AadharCardDoc',
  //                 {
  //                     isEdit: true,
  //                     id: route.params.id
  //                 })
  //         } else {
  //             if (route.params.data.aadharFront == null) {
  //                 return navigation.navigate('AadharCardDoc',
  //                     {
  //                         isEdit: true,
  //                         AgainEdit: true,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             } else {
  //                 return navigation.navigate('AadharCardDoc',
  //                     {
  //                         isEdit: false,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             }

  //         }

  //     } else if (name == 'Pan Card') {
  //         if (route.params.isEdit == true) {
  //             return navigation.navigate('PanCardDoc',
  //                 {
  //                     isEdit: true,
  //                     id: route.params.id
  //                 })
  //         } else {
  //             if (route.params.data.pancard == null) {
  //                 return navigation.navigate('PanCardDoc',
  //                     {
  //                         isEdit: true,
  //                         AgainEdit: true,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             } else {
  //                 return navigation.navigate('PanCardDoc',
  //                     {
  //                         isEdit: false,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             }

  //         }
  //     } else if (name == 'Driving Licences') {
  //         if (route.params.isEdit == true) {
  //             return navigation.navigate('DrivingLicenceDocument',
  //                 {
  //                     isEdit: true,
  //                     id: route.params.id
  //                 })
  //         } else {
  //             if (route.params.data.drivingLicenceimage == null) {
  //                 return navigation.navigate('DrivingLicenceDocument',
  //                     {
  //                         isEdit: true,
  //                         AgainEdit: true,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             } else {
  //                 return navigation.navigate('DrivingLicenceDocument',
  //                     {
  //                         isEdit: false,
  //                         id: route.params.id,
  //                         data: route.params.data
  //                     })
  //             }

  //         }
  //     }
  // }

  const renderSettingDetails = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => pressEvent(item.name)}
        style={{
          backgroundColor: 'white',
          padding: 20,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          marginTop: 10,
          marginBottom: 10,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 20,
        }}>
        <Text style={{flex: 1, color: 'black', fontWeight: 'bold'}}>
          {item.name}
        </Text>
        <View
          style={{
            backgroundColor: '#F3F3F3',
            padding: 5,
            borderRadius: 5,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
          }}>
          <ArrowIcon height={10} width={10} />
        </View>
      </TouchableOpacity>
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
          backgroundColor: colors.bgColor,
          flex: 1,
          //   marginTop: 10,
          //   borderTopLeftRadius: 30,
          //   borderTopRightRadius: 30,
        }}>
        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            data={data}
            renderItem={renderSettingDetails}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
