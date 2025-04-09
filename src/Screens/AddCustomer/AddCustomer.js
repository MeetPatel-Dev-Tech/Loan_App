import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text, Keyboard, ScrollView,
    Image,
    SafeAreaView, StatusBar,
    Dimensions, KeyboardAvoidingView, TouchableOpacity, FlatList
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';

export default function AddCustomer({ navigation, route }) {


    const [panNumber, setPanNumber] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [annualIncome, setAnnualIncome] = useState('');
    const [zipped, setZipped] = useState('');
    const [select, setSelect] = useState('');
    const [modalOption, setModalOption] = useState('');
    const [uploadImageUri, setUploadImageuri] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const RefNo1 = useRef();
    const RefNo2 = useRef();


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
            <LinearGradient colors={['#F9F9FA', '#C5EFFF']}
                style={{
                    backgroundColor: '#F9F9FA',
                    flex: 1, marginTop: 10,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30
                }}>
                <View style={{ flex: 0.7, marginTop: 10 }}>
                    <View
                        style={{ alignItems: 'center', }}>
                        <Image source={require('../../Assets/Image/AddCustomer.png')}
                            style={{ height: '100%', width: '80%' }}
                            resizeMode='contain'
                        />
                    </View>
                </View>
                <View style={{ backgroundColor: 'white', flex: 0.5, borderTopLeftRadius: 40, borderTopRightRadius: 40 }}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, color: 'black', marginTop: 40, textAlign: 'center' }}>Look's Like New Customer</Text>
                    </View>
                    <View style={{ marginHorizontal: 20, marginBottom: 40 }}>
                        <CustomButton text='Add Customer' onPress={() => navigation.navigate('PersonalDetails', {
                            isEdit: true,
                            number: route.params.number
                        })} />
                    </View>
                </View>

            </LinearGradient>

        </SafeAreaView >
    );
}
