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
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {GetApi} from '../../../Api/Api';
import Constant from '../../../CommonFiles/Constant';
import {Group} from '../../../CommonFiles/SvgFile';

export default function Statement(props) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loanDetails, setLoanDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active');

  useEffect(() => {
    //   getLoanDetails()
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
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
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
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          marginTop: 10,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={{padding: 10, color: '#727A80', fontWeight: '500'}}>
            Repayable Loan Amount
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              color: '#727A80',
              fontWeight: '500',
            }}>
            Repayment
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              color: '#727A80',
              fontWeight: '500',
            }}>
            Outstandig
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              color: '#727A80',
              fontWeight: '500',
            }}>
            Paid EMIs
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              color: '#727A80',
              fontWeight: '500',
            }}>
            Remaining EMIs
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{padding: 10, fontWeight: 'bold', color: 'black'}}>
            {Constant.ruppy} {loanDetails.TRA}
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {Constant.ruppy}{' '}
            {Number(loanDetails.TRA) - Number(loanDetails.outstandingAmt)}
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {Constant.ruppy} {loanDetails.outstandingAmt}
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {loanDetails.paidEmi}
          </Text>
          <Text
            style={{
              marginTop: 5,
              padding: 10,
              fontWeight: 'bold',
              color: 'black',
            }}>
            {Number(loanDetails.loanDuration) - Number(loanDetails.paidEmi)}
          </Text>
        </View>
      </View>
    </View>
  );
}
