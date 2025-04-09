import React, { useState, useEffect } from 'react';
import {
    View,
    Text, Keyboard, ScrollView,
    Image,
    SafeAreaView, StatusBar,
    Dimensions, KeyboardAvoidingView
} from 'react-native';
import { Colors, TextInput } from 'react-native-paper';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ProgressLoader from 'rn-progress-loader';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Message from '../../CommonFiles/Message';
import { ErrorToast, SuccessToast } from '../../ToastMessages/Toast';
import { PostApi } from '../../Api/Api';
import { cond } from 'react-native-reanimated';

export default function LoginScreen({ navigation }) {


    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [netInfo, setNetInfo] = useState('online');
    const [confirm, setConfirm] = useState(null);

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
                } else {
                    ErrorToast(Message.KCheckInternetConnection);
                    setNetInfo('offline');
                }
            });
        }, [])
    )

    const onValidate = () => {
        console.log('mobileNumber.length', mobileNumber.length);
        var flag = true;

        if (mobileNumber == '') {
            flag = false;
            ErrorToast(Message.KMobileEmpty);
        } else if (mobileNumber.length !== 10) {
            flag = false;
            ErrorToast(Message.KMobileInvalid);
        } else if (mobileNumber[0] == (0) || mobileNumber[0] == (5) || mobileNumber[0] == (4)
            || mobileNumber[0] == (1) || mobileNumber[0] == (2) || mobileNumber[0] == (3)) {
            console.log('m', mobileNumber[0])
            flag = false
            ErrorToast(Message.vmo);
        }
        if (mobileNumber == Number(0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0 + 0)) {
            flag = false
            ErrorToast(Message.KMobileInvalid);
        }


        if (flag) {
            sendOtp(`91${mobileNumber}`);
        }
    };

    const sendOtp = () => {
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
        console.log('msg', confirmation)
        if (confirm != null) {
            onSubmitLoginCredentials();
        }
    }

    const onSubmitLoginCredentials = async () => {
        setLoading(true);
        if (netInfo == 'online') {
            const data = {
                phoneNumber: String(mobileNumber),
            };
            const response = await PostApi(Constant.login, data, false);
            console.log('resp', response);
            if (response.status == 200) {
                setLoading(false);
                SuccessToast(response.message);
                navigation.navigate('OtpVerification', {
                    phoneNumber: mobileNumber,
                    data: confirm
                });
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            ErrorToast(Message.KCheckInternetConnection);
        }
    }









    return (
        <SafeAreaView style={{ backgroundColor: '#C5EFFF', flex: 1 }}>
            <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            <LinearGradient colors={['#FFFFFF', '#C5EFFF']}
                style={{ flex: 0.8, alignItems: 'center', }}>
                <Image source={require('../../Assets/Image/Login.png')}
                    style={{ height: '100%', width: '100%' }}
                />
            </LinearGradient>
            <View style={{
                flex: 1, backgroundColor: 'white',
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40
            }}>
                <KeyboardAwareScrollView style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Image source={require('../../Assets/Image/Pan.png')}
                                style={{ height: 100, width: 100 }}
                            />
                        </View>
                        <View style={{ marginHorizontal: 30, marginTop: 20, flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', textAlign: 'center' }}>Login to Loan App</Text>
                            <Text style={{ marginTop: 20, textAlign: 'center', color: '#525E60' }}>
                                We provide you all kind of loan and provide you best money of your product
                            </Text>
                            <View style={{ marginTop: 20 }}>
                                <TextInput
                                    name="mobileNumber"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    maxLength={10}
                                    theme={Constant.theme}
                                    value={mobileNumber}
                                    label="Mobile Number"
                                    onChangeText={value => {
                                        setMobileNumber(value.replace(/[^0-9]/, '')), value.length == 10 && Keyboard.dismiss();
                                    }}
                                    placeholder="Enter Your Mobile Number"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 30, marginBottom: 20, marginTop: 20 }}>
                        <CustomButton text='login' onPress={() => onValidate()} />
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView >
    );
}
