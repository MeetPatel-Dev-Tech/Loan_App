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
import colors from '../../CommonFiles/Colors';
import CustomButton from '../../Components/CustomButton/CustomButton';

export default function ExistCustomer({navigation}) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Active');

  const data = [
    {
      id: 1,
      LoanId: 123446789,
      CustomerName: 'meet',
      MobileNumber: 9558811128,
      ActiveLoan: 2,
    },
  ];

  const RenderActiveloanData = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          marginBottom: 10,
          marginHorizontal: 20,
          shadowColor: 'gray',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Customer Name
          </Text>
          <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
            Mobile Number
          </Text>
          <Text style={{marginTop: 5, color: 'black', fontWeight: 'bold'}}>
            Active Loan
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={{}}>{item.CustomerName}</Text>
          <Text style={{marginTop: 5}}>{item.MobileNumber}</Text>
          <Text style={{marginTop: 5}}>{item.ActiveLoan}</Text>
        </View>
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
        <View style={{marginTop: 10, flex: 1}}>
          <FlatList
            data={data}
            renderItem={RenderActiveloanData}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={{margin: 20}}>
            <CustomButton
              text="next"
              onPress={() => navigation.navigate('MortageDetails')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
    // <SafeAreaView style={{ backgroundColor: colors.blue, flex: 1 }}>
    //     <View style={{
    //         backgroundColor: '#F9F9FA',
    //         flex: 1, marginTop: 30,
    //         borderTopLeftRadius: 30,
    //         borderTopRightRadius: 30
    //     }}>
    //         <View style={{ backgroundColor: '#F9F9FA', marginTop: 10 }}>
    //             <FlatList
    //                 data={data}
    //                 renderItem={RenderActiveloanData}
    //             />
    //             <View style={{ margin: 20 }}>
    //                 <CustomButton text='next' onPress={() => navigation.navigate('MortageDetails')} />
    //             </View>
    //         </View >
    //     </View>
    // </SafeAreaView>
  );
}
