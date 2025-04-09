import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text, Keyboard, ScrollView,
    Image,
    SafeAreaView, StatusBar,
    Dimensions, KeyboardAvoidingView, TouchableOpacity
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Colors, TextInput } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import { RotateInUpLeft } from 'react-native-reanimated';
import { GetApi } from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';

export default function EMICalculation({ navigation, route }) {

    useEffect(() => {
        LoanDetails();
    }, []);


    const [loanDetails, setLoanDetails] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [noEMI, setNoEMI] = useState('');
    const [processingFees, setProcessingFees] = useState('');
    const [emiDate, setEmiDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Active');


    const RefNo1 = useRef();
    const RefNo2 = useRef();
    const RefNo3 = useRef();
    const RefNo4 = useRef();
    const RefNo5 = useRef();

    const LoanDetails = async () => {
        const response = await GetApi(Constant.addLoan + '/' + route.params.loanId)
        console.log('response', response)
        if (response.status == 200) {
            setLoanDetails(response.data)
        }
    }


    return (
        <SafeAreaView style={{ backgroundColor: colors.blue, flex: 1 }}>
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            <StatusBar barStyle='dark-content' backgroundColor={colors.blue} />
            {/* <View style={{ paddingBottom: 20, paddingTop: 5 }}>
                <Text style={{ textAlign: 'center', fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' }}>Welcome to Loan App</Text>
            </View> */}
            <View style={{
                backgroundColor: '#F9F9FA',
                flex: 1, marginTop: 10,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <View style={{ flex: 1, marginHorizontal: 20, marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Product Price</Text>
                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Down Payment</Text>
                        </View>
                        <View>
                            <Text>Rs. {loanDetails.processingFees}</Text>
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
                            <Text style={{ marginTop: 20 }}>Rs. {loanDetails.processingFees}</Text>
                        </View>
                    </View>
                    <View style={{ borderWidth: 0.5, marginTop: 10 }}></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold' }}>Total</Text>
                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Total EMIs</Text>
                            <Text style={{ marginTop: 20, fontWeight: 'bold' }}>EMI ammount
                                <Text style={{ fontWeight: 'normal' }}>(deducton every 7th)</Text>
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text>Rs. 50,000</Text>
                            <Text style={{ marginTop: 20 }}>5</Text>
                            <Text style={{ marginTop: 20 }}>Rs. 10,000</Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 20 }}>
                        <CustomBorderButton text='Cancel' onPress={() => { navigation.goBack() }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomButton text='next' onPress={() => {
                            navigation.navigate('LoanSummary', {
                                id: route.params.id,
                                mortgageId: route.params.mortgageId,
                                loanId: route.params.loanId
                            })
                        }} />
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}
