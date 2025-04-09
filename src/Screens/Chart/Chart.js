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
import Fontisto from 'react-native-vector-icons/Fontisto';
import Constant from '../../CommonFiles/Constant';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';

export default function Chart({ navigation }) {


    const [downPaymentAmount, setDownPaymentAmount] = useState('');
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
                <KeyboardAwareScrollView style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{
                        flex: 1, marginHorizontal: 20
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            paddingVertical: 10,
                            // height: 58,
                            shadowColor: 'gray',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, marginTop: 20,
                            borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>Product Amount</Text>
                                {/* <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Processing Fees</Text>
                                <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Total</Text> */}
                            </View>
                            <View style={{ marginRight: 20 }}>
                                <Text style={{}}>RS. 10000</Text>
                                {/* <Text style={{}}>RS. 500</Text>
                                <Text style={{ marginTop: 5 }}>RS. 10500</Text> */}
                            </View>
                        </View>
                        <TextInput
                            mode="outlined"
                            value={downPaymentAmount}
                            theme={Constant.theme}
                            onChangeText={value => { setDownPaymentAmount(value); }}
                            label="Processing fees"
                            placeholder="Processing fees"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo1}
                            onSubmitEditing={() => RefNo2.current.focus()}
                            blurOnSubmit={false}
                        />
                        <View style={{
                            backgroundColor: 'white',
                            paddingVertical: 10,
                            // height: 58,
                            shadowColor: 'gray',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, marginTop: 20,
                            borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                        }}>
                            <View style={{ flex: 1 }}>
                                {/* <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>Product Amount</Text> */}
                                {/* <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Processing Fees</Text> */}
                                <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Total</Text>
                            </View>
                            <View style={{ marginRight: 20 }}>
                                {/* <Text style={{}}>RS. 10000</Text> */}
                                {/* <Text style={{}}>RS. 500</Text> */}
                                <Text style={{ marginTop: 5 }}>RS. 10500</Text>
                            </View>
                        </View>
                        <TextInput
                            mode="outlined"
                            value={downPaymentAmount}
                            theme={Constant.theme}
                            onChangeText={value => { setDownPaymentAmount(value); }}
                            label="Down Payment Amount"
                            placeholder="Down Payment Amount"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo1}
                            onSubmitEditing={() => RefNo2.current.focus()}
                            blurOnSubmit={false}
                        />
                        <View style={{
                            backgroundColor: 'white',
                            paddingVertical: 10,
                            // height: 58,
                            shadowColor: 'gray',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, marginTop: 20,
                            borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                        }}>
                            <View style={{ flex: 1 }}>
                                {/* <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Total</Text>
                                <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>DownPayment</Text> */}
                                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>Loan Amount</Text>
                            </View>
                            <View style={{ marginRight: 20 }}>
                                {/* <Text style={{}}>RS. 10500</Text>
                                <Text style={{}}>RS. 2000</Text> */}
                                <Text style={{ marginTop: 5 }}>RS. 8500</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>Interest</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                <View>
                                    <Fontisto name='radio-btn-passive' size={20} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 18 }}> % (Persantage)</Text>
                                </View>
                                <View style={{ marginLeft: 20 }}>
                                    <Fontisto name='radio-btn-passive' size={20} />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 18 }}> Flat Amount</Text>
                                </View>
                            </View>
                            <TextInput
                                mode="outlined"
                                value={downPaymentAmount}
                                theme={Constant.theme}
                                onChangeText={value => { setDownPaymentAmount(value); }}
                                label="Rate"
                                placeholder="Rate"
                                style={{ marginTop: 20 }}
                                returnKeyType="next"
                                ref={RefNo1}
                                onSubmitEditing={() => RefNo2.current.focus()}
                                blurOnSubmit={false}
                            />
                            <TextInput
                                mode="outlined"
                                value={downPaymentAmount}
                                theme={Constant.theme}
                                onChangeText={value => { setDownPaymentAmount(value); }}
                                label="frequency"
                                placeholder="frequency"
                                style={{ marginTop: 20 }}
                                returnKeyType="next"
                                ref={RefNo1}
                                onSubmitEditing={() => RefNo2.current.focus()}
                                blurOnSubmit={false}
                            />

                        </View>
                        <View style={{ marginTop: 20, marginBottom: 30 }}>
                            <Text style={{ fontSize: 16 }}>Tenure</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, marginRight: 20 }}>
                                    <TextInput
                                        mode="outlined"
                                        value={downPaymentAmount}
                                        theme={Constant.theme}
                                        onChangeText={value => { setDownPaymentAmount(value); }}
                                        label="Duration"
                                        placeholder="Repayment Cycle"
                                        style={{ marginTop: 20 }}
                                        returnKeyType="next"
                                        ref={RefNo1}
                                        onSubmitEditing={() => RefNo2.current.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        mode="outlined"
                                        value={downPaymentAmount}
                                        theme={Constant.theme}
                                        onChangeText={value => { setDownPaymentAmount(value); }}
                                        label="Duration"
                                        placeholder="Repayment Cycle"
                                        style={{ marginTop: 20 }}
                                        returnKeyType="next"
                                        ref={RefNo1}
                                        onSubmitEditing={() => RefNo2.current.focus()}
                                        blurOnSubmit={false}
                                    />
                                </View>
                            </View>
                            <Text style={{ fontSize: 16 }}>Repayment</Text>
                            <TextInput
                                mode="outlined"
                                value={downPaymentAmount}
                                theme={Constant.theme}
                                onChangeText={value => { setDownPaymentAmount(value); }}
                                label="Repayment Cycle"
                                placeholder="Repayment Cycle"
                                style={{ marginTop: 20 }}
                                returnKeyType="next"
                                ref={RefNo1}
                                onSubmitEditing={() => RefNo2.current.focus()}
                                blurOnSubmit={false}
                            />
                            <View style={{
                                backgroundColor: 'white',
                                paddingVertical: 10,
                                // height: 58,
                                shadowColor: 'gray',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, marginTop: 20,
                                borderRadius: 10, flexDirection: 'row', alignItems: 'center',
                            }}>
                                <View style={{ flex: 1 }}>
                                    {/* <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>Total</Text>
                                <Text style={{ color: 'black', fontSize: 16, marginLeft: 20 }}>DownPayment</Text> */}
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>No. of Repayment</Text>
                                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16, marginLeft: 20 }}>Repayment Amount</Text>
                                </View>
                                <View style={{ marginRight: 20 }}>
                                    {/* <Text style={{}}>RS. 10500</Text>
                                <Text style={{}}>RS. 2000</Text> */}
                                    <Text style={{ marginTop: 5 }}>6</Text>
                                    <Text style={{ marginTop: 5 }}>Rs. 1000</Text>
                                </View>
                            </View>

                        </View >
                        {/* <TextInput
                            mode="outlined"
                            value={interestRate}
                            theme={Constant.theme}
                            onChangeText={value => { setInterestRate(value); }}
                            label="Interest Rate"
                            placeholder="Interest Rate"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo2}
                            onSubmitEditing={() => RefNo3.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={noEMI}
                            theme={Constant.theme}
                            onChangeText={value => { setNoEMI(value); }}
                            label="No. EMI"
                            placeholder="No. EMI"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo3}
                            onSubmitEditing={() => RefNo4.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={processingFees}
                            theme={Constant.theme}
                            onChangeText={value => { setProcessingFees(value); }}
                            label="Processing Fees"
                            placeholder="Processing Fees"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo4}
                            onSubmitEditing={() => RefNo5.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={emiDate}
                            theme={Constant.theme}
                            onChangeText={value => { setEmiDate(value); }}
                            label="Emi Date"
                            placeholder="Emi Date"
                            style={{ marginTop: 20 }}
                            returnKeyType='done'
                            ref={RefNo5}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={false}
                        /> */}
                        {/* <View>
                            <Text style={{ marginTop: 20, fontWeight: 'bold', color: 'black', fontSize: 18 }}>Summary</Text>
                        </View>
                        <View style={{
                            backgroundColor: 'white',
                            padding: 10,
                                                      shadowColor:'gray',
                    shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, marginTop: 20,
                            borderRadius: 10,
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                            </View>
                        </View> */}
                    </View >
                    {/* <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 20 }}>
                            <CustomBorderButton text='Cancel' onPress={() => { navigation.goBack() }} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomButton text='next' onPress={() => { navigation.navigate('EMICalculation') }} />
                        </View>
                    </View> */}
                </KeyboardAwareScrollView >
            </View >
        </SafeAreaView >
    );
}
