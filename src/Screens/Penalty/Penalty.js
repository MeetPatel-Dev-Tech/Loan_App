import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text, Keyboard, ScrollView,
    Image,
    SafeAreaView, StatusBar,
    Dimensions, KeyboardAvoidingView, TouchableOpacity, FlatList
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import SignatureScreen from "react-native-signature-canvas";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Colors, TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { ArrowIcon } from '../../CommonFiles/SvgFile';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Constant from '../../CommonFiles/Constant';
import colors from '../../CommonFiles/Colors';

export default function Penlty({ navigation }) {


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [latePaymentCharges, setlatePaymentCharges] = useState('');
    const [gracePeriod, setGracePeriod] = useState('');
    const [interest, setInterest] = useState('');

    const data = [
        { id: 1, name: 'Add Signature' },
        { id: 2, name: 'Penlty' },
    ]



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
                    <View style={{ marginTop: 10, marginHorizontal: 20, flex: 1 }}>
                        <TextInput
                            mode="outlined"
                            value={latePaymentCharges}
                            theme={Constant.theme}
                            keyboardType="numeric"
                            onChangeText={value => { setlatePaymentCharges(value); }}
                            label="Late Payment Charges"
                            placeholder="Late Payment Charges"
                            returnKeyType="next"
                            style={{ marginTop: 20 }}
                            ref={RefNo1}
                            onSubmitEditing={() => RefNo2.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={gracePeriod}
                            theme={Constant.theme}
                            keyboardType="numeric"
                            onChangeText={value => { setGracePeriod(value); }}
                            label="Grace Period (days)"
                            placeholder="Grace Period"
                            returnKeyType="next"
                            style={{ marginTop: 20 }}
                            ref={RefNo2}
                            onSubmitEditing={() => RefNo3.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={interest}
                            theme={Constant.theme}
                            keyboardType="numeric"
                            onChangeText={value => { setInterest(value); }}
                            label="Interest (%)"
                            placeholder="Interest"
                            returnKeyType='done'
                            style={{ marginTop: 20 }}
                            ref={RefNo3}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={false}
                        />
                    </View>
                    <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 20 }}>
                            <CustomBorderButton text='cancel' />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomButton text='save' />
                        </View>
                    </View>
                </KeyboardAwareScrollView>

            </View>
        </SafeAreaView >
    );
}
