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
import {GetApi} from '../../../Api/Api';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Moment from 'moment';
import Constant from '../../../CommonFiles/Constant';
import {Group} from '../../../CommonFiles/SvgFile';
import {ErrorToast} from '../../../ToastMessages/Toast';

export default function EMI(props) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loanDetails, setLoanDetails] = useState('');
  const [EMISchedule, setEMISchedule] = useState('');

  useEffect(() => {
    //   getLoanDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getLoanDetails();
    }, []),
  );

  const getLoanDetails = async () => {
    setLoading(true);
    const response = await GetApi(
      Constant.addLoan + '/' + props.route.params.item.id,
    );
    console.log('response', response);
    if (response.status == 200) {
      setLoanDetails(response.data);
      setLoading(false);
      let markers = [];

      for (let i = 0; i < response.data.loanDuration; i++) {
        console.log('i', i);
        if (i == response.data.loanDuration - 1) {
          markers.push({
            amount: response.data.loanAmount,
            emiAmount: response.data.LEA,
            date: Moment(response.data.emiDate)
              .add(i, 'M')
              .format('DD-MM-YYYY'),
            status: Number(response.data.paidEmi) >= i + 1 ? 'Paid' : 'Due',
          });
        } else if (i == 0) {
          markers.push({
            amount: response.data.loanAmount,
            emiAmount: response.data.emiAmount,
            date: Moment(response.data.emiDate).format('DD-MM-YYYY'),
            status: Number(response.data.paidEmi) >= i + 1 ? 'Paid' : 'Due',
          });
        } else {
          markers.push({
            amount: response.data.loanAmount,
            emiAmount: response.data.emiAmount,
            date: Moment(response.data.emiDate)
              .add(i, 'M')
              .format('DD-MM-YYYY'),
            status: Number(response.data.paidEmi) >= i + 1 ? 'Paid' : 'Due',
          });
        }
      }
      console.log('meet', markers);
      setEMISchedule(markers);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const renderEMISchedualList = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>{index + 1}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>{item.date}</Text>
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text>
            {Constant.ruppy} {item.emiAmount}
          </Text>
        </View>
        <View style={{alignItems: 'center', flex: 1}}>
          <Text
            style={{
              color: item.status == 'Paid' ? 'green' : null,
              fontWeight: 'bold',
            }}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#F2F9FE',
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
      }}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>EMI no.</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>EMI Date</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>EMI Amt</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Status</Text>
        </View>
      </View>
      <FlatList
        data={EMISchedule}
        renderItem={renderEMISchedualList}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{paddingBottom: 65}}
      />
      {/* <View style={{
                padding: 10,
                backgroundColor: 'white', borderRadius: 10, marginTop: 10,
                shadowColor: 'black',
                                          shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                flexDirection: 'row', alignItems: 'center'
            }}>
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ padding: 10, backgroundColor: '#FBF7EB', borderRadius: 10 }}>
                        <Group height={20} width={20} />
                    </View>
                    <View style={{ padding: 10, backgroundColor: '#FBF7EB', borderRadius: 10, marginTop: 5 }}>
                        <Group height={20} width={20} />
                    </View>
                    <View style={{ padding: 10, backgroundColor: '#FBF7EB', borderRadius: 10, marginTop: 5 }}>
                        <Group height={20} width={20} />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Text style={{ padding: 10, color: 'black' }}>Amount</Text>
                    <Text style={{ marginTop: 5, padding: 10, color: 'black' }}>Paid on dated</Text>
                    <Text style={{ marginTop: 5, padding: 10, color: 'black' }}>Payment mode</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ padding: 10 }}>Rs.1,10,000</Text>
                    <Text style={{ marginTop: 5, padding: 10 }}>Rs.20.000</Text>
                    <Text style={{ marginTop: 5, padding: 10 }}>Rs.90.000</Text>
                </View>
            </View> */}
    </View>
  );
}
