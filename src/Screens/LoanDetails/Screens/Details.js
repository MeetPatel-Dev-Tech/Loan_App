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
import Moment from 'moment';
import NetInfo from '@react-native-community/netinfo';
import {GetApi} from '../../../Api/Api';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Constant from '../../../CommonFiles/Constant';
import {Group} from '../../../CommonFiles/SvgFile';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';

export default function Details(props) {
  const [loanDetails, setLoanDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active');
  const [netInfo, setNetInfo] = useState('online');

  useEffect(() => {
    // getLoanDetails()
  }, []);

  // useFocusEffect(
  //     React.useCallback(() => {
  //         getLoanDetails();
  //     }, [])
  // )

  useFocusEffect(
    React.useCallback(() => {
      // NetInfo.addEventListener(state => {
      //     if (state.isConnected == true) {
      //         setNetInfo('online');
      //     } else {
      //         setNetInfo('offline');
      //     }
      // });
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          setNetInfo('online');
          getLoanDetails();
        } else {
          ErrorToast(Message.KCheckInternetConnection);
          setNetInfo('offline');
        }
      });
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: '#F2F9FE',
        flex: 1,
        marginTop: 2,
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
      {/* <View
        style={{
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 10,
          marginTop: 10,
          shadowColor: 'black',
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 0.5,
        }}>
        <View style={{justifyContent: 'center'}}>
          <View
            style={{padding: 10, backgroundColor: '#FBF7EB', borderRadius: 10}}>
            <Group height={20} width={20} />
          </View>
          <View
            style={{
              padding: 10,
              backgroundColor: '#FBF7EB',
              borderRadius: 10,
              marginTop: 5,
            }}>
            <Group height={20} width={20} />
          </View>
          <View
            style={{
              padding: 10,
              backgroundColor: '#FBF7EB',
              borderRadius: 10,
              marginTop: 5,
            }}>
            <Group height={20} width={20} />
          </View>
          <View
            style={{
              padding: 10,
              backgroundColor: '#FBF7EB',
              borderRadius: 10,
              marginTop: 5,
            }}>
            <Group height={20} width={20} />
          </View>
          <View
            style={{
              padding: 10,
              backgroundColor: '#FBF7EB',
              borderRadius: 10,
              marginTop: 5,
            }}>
            <Group height={20} width={20} />
          </View>
        </View>
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text style={{padding: 10, color: 'black'}}>Loan Amount</Text>
          <Text style={{marginTop: 5, padding: 10, color: 'black'}}>
            Down Payment
          </Text>
          <Text style={{marginTop: 5, padding: 10, color: 'black'}}>
            Interest Rate
          </Text>
          <Text style={{marginTop: 5, padding: 10, color: 'black'}}>
            Processing Fees
          </Text>
          <Text style={{marginTop: 5, padding: 10, color: 'black'}}>
            Emi Date
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{padding: 10}}>{loanDetails.loanAmount}</Text>
          <Text style={{marginTop: 5, padding: 10}}>
            {loanDetails.downPayment}
          </Text>
          <Text style={{marginTop: 5, padding: 10}}>{loanDetails.emiRate}</Text>
          <Text style={{marginTop: 5, padding: 10}}>
            {loanDetails.processingFees}
          </Text>
          <Text style={{marginTop: 5, padding: 10}}>
            {Moment(loanDetails.nextemiDate).format('DD-MM-YYYY')}
          </Text>
        </View>
      </View> */}
      <View>
        {/* <Text
          style={{
            fontSize: 16,
            color: 'black',
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          Summary
        </Text> */}
      </View>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 1,
          marginTop: 20,
          borderRadius: 10,
          marginBottom: 20,
          marginHorizontal: 0.5,
        }}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              {loanDetails.price != null && (
                <Text style={{fontWeight: 'bold'}}>Product Price</Text>
              )}
              <Text
                style={{
                  marginTop: loanDetails.price != null ? 20 : 0,
                  fontWeight: '500',
                  color: '#727A80',
                }}>
                Processing Fees
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  fontWeight: '500',
                  color: '#727A80',
                  paddingVertical: 10,
                }}>
                Total Amt
              </Text>
              {loanDetails.downPayment != null && (
                <Text
                  style={{marginTop: 10, fontWeight: '500', color: '#727A80'}}>
                  Down Payment
                </Text>
              )}
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Loan Amt
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Duration (Month)
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Interest Rate
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Monthly Interest Amt
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Total Interest Amt
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                Total Repayable Amt
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                EMI Date
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                EMI Type
              </Text>
              <Text
                style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                EMI Amt
              </Text>
              {loanDetails.emiType == 0 && (
                <Text
                  style={{marginTop: 20, fontWeight: '500', color: '#727A80'}}>
                  Last EMI Amt
                </Text>
              )}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              {loanDetails.price != null && <Text>₹ {loanDetails.price}</Text>}
              <Text
                style={{
                  marginTop: loanDetails.price != null ? 20 : 0,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                ₹ {loanDetails.processingFees}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#EBE9CE',
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                ₹{' '}
                {Number(loanDetails.price) + Number(loanDetails.processingFees)}
              </Text>
              {loanDetails.downPayment != null && (
                <Text
                  style={{marginTop: 10, color: 'black', fontWeight: 'bold'}}>
                  ₹ {loanDetails.downPayment}
                </Text>
              )}
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                ₹ {loanDetails.loanAmount}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                {loanDetails.loanDuration}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                {loanDetails.emiRate}%
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                ₹ {loanDetails.MIA}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                ₹ {loanDetails.TIA}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                ₹ {loanDetails.TRA}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                {Moment(loanDetails.emiDate).format('DD-MM-yyyy')}
              </Text>
              <Text style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                {loanDetails.emiType == 0
                  ? 'Interest Only'
                  : 'Interest + Capital'}
              </Text>
              {loanDetails.emiType == 0 ? (
                <Text
                  style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                  ₹ {loanDetails.emiAmount}
                </Text>
              ) : (
                <Text
                  style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                  ₹ {loanDetails.emiAmount}
                </Text>
              )}
              {loanDetails.emiType == 0 && (
                <Text
                  style={{marginTop: 20, color: 'black', fontWeight: 'bold'}}>
                  ₹ {loanDetails.LEA}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>Valuation</Text>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Down Payment</Text>
                    </View>
                    <View>
                        <Text>Rs. 50,000</Text>
                        <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                    </View>
                </View>
                <View style={{ borderWidth: 0.5, marginTop: 10 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>Loan Amount</Text>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Interest</Text>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>processingFees</Text>
                    </View>
                    <View>
                        <Text>Rs. 50,000</Text>
                        <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                        <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                    </View>
                </View>
                <View style={{ borderWidth: 0.5, marginTop: 10 }}></View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>Loan Amount</Text>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Interest</Text>
                        <Text style={{ marginTop: 20, fontWeight: 'bold' }}>processingFees</Text>
                    </View>
                    <View>
                        <Text>Rs. 50,000</Text>
                        <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                        <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                    </View>
                </View> */}
      </View>
    </ScrollView>
  );
}
