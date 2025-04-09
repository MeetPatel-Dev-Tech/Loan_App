import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions, StatusBar,
    Keyboard, Alert, Platform
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import ProgressLoader from 'rn-progress-loader';
import auth from '@react-native-firebase/auth';
import CommonStyle from '../../CommonFiles/CommonStyle';
import { ErrorToast, SuccessToast } from '../../ToastMessages/Toast';
import Message from '../../CommonFiles/Message';
import LinearGradient from 'react-native-linear-gradient';
import Constant from '../../CommonFiles/Constant';
import { PostApi } from '../../Api/Api';
import { getLoggedUserDetails, setLoggedUserDetails } from '../../Utils/CommonUtils';
import { CredentialsContext } from '../../Components/Context/CredentialsContext';
import colors from '../../CommonFiles/Colors';

export default function OtpVerificationScreen({ navigation }) {
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [fcmToken, setFcmToken] = useState('');
    const [OtpNo1, setOtpNo1] = useState('');
    const [OtpNo2, setOtpNo2] = useState('');
    const [OtpNo3, setOtpNo3] = useState('');
    const [OtpNo4, setOtpNo4] = useState('');
    const [OtpNo5, setOtpNo5] = useState('');
    const [OtpNo6, setOtpNo6] = useState('');
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext)
    const [redirectFrom, setRedirectFrom] = useState(route.params?.from ?? '')
    const [netInfo, setNetInfo] = useState('online');
    const [otp, setOtp] = useState('');
    const [recall, setRecall] = useState(false);
    const [reSendOTPs, setReSendOTPs] = useState(false);

    const OtpNo1Ref = useRef();
    const OtpNo2Ref = useRef();
    const OtpNo3Ref = useRef();
    const OtpNo4Ref = useRef();
    const OtpNo5Ref = useRef();
    const OtpNo6Ref = useRef();



    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

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

    const onAuthStateChanged = (user) => {
        console.log('usersss', user);
        // const unsubscribe = navigation.addListener('focus', () => {
        if (Platform.OS == 'android') {

            console.log('recall', recall);

            if ((user != null) && (recall == false) && route.params.number != '') {
                setOtpNo1('*');
                setOtpNo2('*');
                setOtpNo3('*');
                setOtpNo4('*');
                setOtpNo5('*');
                setOtpNo6('*');
                setRecall(true);
                setTimeout(() => {
                    onVerifyOtp();
                    auth()
                        .signOut()
                        .then(() => console.log('User signed out!'))
                }, 1500);
            }
        }
        // });
        // return unsubscribe;



    }





    const onChange = ({ name, value }) => {
        if (name == 'otpNo1') {
            setOtpNo1(value);
        } else if (name == 'otpNo2') {
            setOtpNo2(value);
        } else if (name == 'otpNo3') {
            setOtpNo3(value);
        } else if (name == 'otpNo4') {
            setOtpNo4(value);
        } else if (name == 'otpNo5') {
            setOtpNo5(value);
        } else if (name == 'otpNo6') {
            setOtpNo6(value);
        }

        // if (name == 'otpNo1' && value != '') {
        //   // setOtpNo1(value);
        //   OtpNo2Ref.current.focus();
        // } else if (name == 'otpNo2' && value != '') {
        //   // setOtpNo2(value);
        //   OtpNo3Ref.current.focus();
        // } else if (name == 'otpNo3' && value != '') {
        //   // setOtpNo3(value);
        //   OtpNo4Ref.current.focus();
        // } else if (name == 'otpNo4' && value != '') {
        //   setOtpNo4(value);
        //   OtpNo5Ref.current.focus();
        // } else if (name == 'otpNo5' && value != '') {
        //   // setOtpNo5(value);
        //   OtpNo6Ref.current.focus();
        // } else if (name == 'otpNo6' && value != '') {
        //   // setOtpNo6(value);
        //   OtpNo6Ref.current.blur();
        // }
    };

    const onValidate = () => {
        if (netInfo == 'online') {
            const rejex = /^[0-9]+$/;
            if (
                OtpNo1 == '' &&
                OtpNo2 == '' &&
                OtpNo3 == '' &&
                OtpNo4 == '' &&
                OtpNo5 == '' &&
                OtpNo6 == ''
            ) {
                ErrorToast(Message.KOTPEmpty);
            } else if (
                OtpNo1 == '' ||
                OtpNo2 == '' ||
                OtpNo3 == '' ||
                OtpNo4 == '' ||
                OtpNo5 == '' ||
                OtpNo6 == ''
            ) {
                ErrorToast(Message.KOTPInvalid);
            }
            else {
                if (
                    rejex.test(OtpNo1) &&
                    rejex.test(OtpNo2) &&
                    rejex.test(OtpNo3) &&
                    rejex.test(OtpNo4) &&
                    rejex.test(OtpNo5) &&
                    rejex.test(OtpNo6)
                ) {
                    if (reSendOTPs == true) {
                        onReOTPVerification();
                    } else {
                        onOTPVerification();
                    }
                } else {
                    ErrorToast(Message.KOTPInvalid)
                }
            }
        } else {
            ErrorToast(Message.KCheckInternetConnection);
        }
    };


    const onOTPVerification = async () => {
        // console.log('data', route.params.data, 'f')
        setLoading(true);
        console.log('otp', Number(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6))
        try {
            await route.params.data.confirm(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6);
            console.log('success');
            onVerifyOtp();
            auth()
                .signOut()
                .then(() => console.log('User signed out!'));
        } catch (error) {
            console.log('Invalid code.');
            ErrorToast('Invalid OTP.');
            setLoading(false);
            // auth()
            //     .signOut()
            //     .then(() => console.log('User signed out!'));
        }
    }

    const onVerifyOtp = async () => {
        setLoading(true);
        if (netInfo == 'online') {
            const data = {
                phoneNumber: route.params.number,
                otp: String(1 + 2 + 3 + 4),
            };
            console.log('Data', data);
            const response = await PostApi(Constant.customerOTPVerify, data, false);
            console.log('resp', response);
            if (response.status == 201) {
                setLoading(false);
                SuccessToast(response.message);
                // navigation.navigate('AddCustomer', {
                //     isEdit: true,
                //     number: route.params.number,
                // })
                navigation.navigate('PersonalDetails', {
                    isEdit: true,
                    number: route.params.number,
                })
            } else {
                setLoading(false);
                ErrorToast(response.message);
            }
        } else {
            setLoading(false);
            ErrorToast(Message.KCheckInternetConnection);
        }
    }

    const reSendOTP = async (phoneNumber) => {
        setLoading(true);
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
            setConfirm(confirmation);
            console.log('msg', confirmation);
            setLoading(false);
            SuccessToast('OTP sent successfully')
        } catch (error) {
            console.log('Error.', error);
            setLoading(false);
            ErrorToast('too many requests please try again later');
        }
    }

    const onReOTPVerification = async () => {
        setLoading(true);
        try {
            await confirm.confirm(OtpNo1 + OtpNo2 + OtpNo3 + OtpNo4 + OtpNo5 + OtpNo6);
            console.log('success');
            setLoading(false);
            onVerifyOtp();
            auth()
                .signOut()
                .then(() => console.log('User signed out!'));
        } catch (error) {
            console.log('Invalid code.');
            setLoading(false);
            ErrorToast('Invalid OTP');
            // auth()
            //     .signOut()
            //     .then(() => console.log('User signed out!'));
        }
    }



    return (
        <SafeAreaView style={{ backgroundColor: colors.blue, flex: 1 }}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.blue} />
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            {/* <LinearGradient colors={['#FFFFFF', '#C5EFFF']}
                style={{ flex: 0.8, alignItems: 'center', }}>
                <Image source={require('../../Assets/Image/Otp.png')}
                    style={{ height: '100%', width: '100%' }}
                />
            </LinearGradient> */}
            <View style={{
                flex: 1, backgroundColor: 'white',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
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
                        <View style={{ marginTop: 20, marginHorizontal: 30, }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black', textAlign: 'center' }}>
                                Otp Verification
                            </Text>
                            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 20, color: '#525E60' }}>
                                Please enter the 6 Digit code sent to you at +91 XXXXX X
                                {route.params.number.slice(
                                    route.params.number.length - 4,
                                )}
                            </Text>
                            <View
                                style={{
                                    marginTop: 30,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <TextInput
                                    value={OtpNo1}
                                    ref={OtpNo1Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo1', value });
                                    }}
                                    onChangeText={OtpNo1 => {
                                        if (OtpNo1[0]?.includes(' ')) {
                                            setOtpNo1(OtpNo1.trim());
                                        } else {
                                            setOtpNo1(OtpNo1.replace(/[^0-9]/, ''));
                                            if (OtpNo1 != '') {
                                                OtpNo2Ref.current.focus();
                                            }
                                        }

                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    activeOutlineColor="black"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo1Ref.current.focus()
                                            : OtpNo2Ref.current.focus();
                                    }}
                                    // onSubmitEditing={() => OtpNo2Ref.current.focus()}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />

                                <TextInput
                                    value={OtpNo2}
                                    ref={OtpNo2Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo2', value });
                                    }}
                                    onChangeText={value => {
                                        if (value[0]?.includes(' ')) {
                                            setOtpNo2(OtpNo1.trim());
                                        } else {
                                            setOtpNo2(value.replace(/[^0-9]/, ''));
                                            if (value != '') {
                                                OtpNo3Ref.current.focus();
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    // onSubmitEditing={() => OtpNo3Ref.current.focus()}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo1Ref.current.focus()
                                            : OtpNo3Ref.current.focus();
                                    }}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />

                                <TextInput
                                    value={OtpNo3}
                                    ref={OtpNo3Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo3', value });
                                    }}
                                    onChangeText={value => {
                                        if (value[0]?.includes(' ')) {
                                            setOtpNo3(OtpNo1.trim());
                                        } else {
                                            setOtpNo3(value.replace(/[^0-9]/, ''));
                                            if (value != '') {
                                                OtpNo4Ref.current.focus();
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    // onSubmitEditing={() => OtpNo4Ref.current.focus()}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo2Ref.current.focus()
                                            : OtpNo4Ref.current.focus();
                                    }}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />

                                <TextInput
                                    value={OtpNo4}
                                    ref={OtpNo4Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo4', value });
                                    }}
                                    onChangeText={value => {
                                        if (value[0]?.includes(' ')) {
                                            setOtpNo4(OtpNo1.trim());
                                        } else {
                                            setOtpNo4(value.replace(/[^0-9]/, ''));
                                            if (value != '') {
                                                OtpNo5Ref.current.focus();
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    // onSubmitEditing={() => Keyboard.dismiss()}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo3Ref.current.focus()
                                            : OtpNo5Ref.current.focus();
                                    }}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />
                                <TextInput
                                    value={OtpNo5}
                                    ref={OtpNo5Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo5', value });
                                    }}
                                    onChangeText={value => {
                                        if (value[0]?.includes(' ')) {
                                            setOtpNo5(OtpNo1.trim());
                                        } else {
                                            setOtpNo5(value.replace(/[^0-9]/, ''));
                                            if (value != '') {
                                                OtpNo6Ref.current.focus();
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    // onSubmitEditing={() => Keyboard.dismiss()}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo4Ref.current.focus()
                                            : OtpNo6Ref.current.focus();
                                    }}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />

                                <TextInput
                                    value={OtpNo6}
                                    ref={OtpNo6Ref}
                                    onChange={value => {
                                        onChange({ name: 'otpNo6', value });
                                    }}
                                    onChangeText={value => {
                                        if (value[0]?.includes(' ')) {
                                            setOtpNo6(OtpNo1.trim());
                                        } else {
                                            setOtpNo6(value.replace(/[^0-9]/, ''));
                                            if (value != '') {
                                                Keyboard.dismiss();
                                            }
                                        }
                                    }}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    // onSubmitEditing={() => Keyboard.dismiss()}
                                    onKeyPress={({ nativeEvent }) => {
                                        nativeEvent.key === 'Backspace'
                                            ? OtpNo5Ref.current.focus()
                                            : OtpNo6Ref.current.focus();
                                    }}
                                    // textAlign='center'
                                    // placeholder='-'
                                    // placeholderTextColor={'black'}
                                    style={{
                                        textAlign: 'center',
                                        color: 'black',
                                        height: 50,
                                        width: 50,
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}>
                            <Text style={{ fontSize: 14, color: 'black' }}>
                                Didn't receive OTP?
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setReSendOTPs(true);
                                    setOtpNo1('');
                                    setOtpNo2('');
                                    setOtpNo3('');
                                    setOtpNo4('');
                                    setOtpNo5('');
                                    setOtpNo6('');
                                    reSendOTP(`+91${String(route.params.phoneNumber)}`);
                                }}
                                style={{}}>
                                <Text style={{ color: colors.blue }}>  RESEND OTP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginTop: 30, marginBottom: 20, marginHorizontal: 20, }}>
                        <CustomButton text="verify otp"
                            onPress={() => onValidate()}
                        />
                    </View>


                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
}
