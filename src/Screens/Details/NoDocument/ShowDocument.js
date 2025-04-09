import React, {useState, useEffect, useRef} from 'react';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import {Upload} from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import Message from '../../../CommonFiles/Message';
import {GetApi, PostApi, PostApiImage} from '../../../Api/Api';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function ShowDocument({navigation, route}) {
  const [loading, setLoading] = useState(false);
  const [netInfo, setNetInfo] = useState('online');
  const [document, setDocument] = useState('');

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
    }, []),
  );
  useFocusEffect(
    React.useCallback(() => {
      getDocument();
    }, []),
  );

  const getDocument = async () => {
    const response = await GetApi(Constant.Customers + '/' + route.params.id);
    console.log('res', response);
    if (response.status == 200) {
      setDocument(response.data);
    } else {
      ErrorToast(response.message);
      setLoading(false);
    }
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
          backgroundColor: colors.bgColor,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            {document.aadharNumber != null && (
              <View style={{marginTop: 20}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
                  Aadhar Card
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    shadowColor: 'gray',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 1,
                    marginTop: 10,
                    borderRadius: 10,
                  }}>
                  <View style={{}}>
                    <Text style={{}}>{document.aadharNumber}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        marginRight: 20,
                        //  marginTop: 10,
                        // flexDirection: 'row',
                        //  flexWrap: 'wrap',
                        //  height: undefined
                      }}>
                      <Image
                        source={{
                          uri: Constant.ShowImage + document.aadharFront,
                        }}
                        style={{
                          width: '100%',
                          aspectRatio: 1,
                          flex: 1,
                          borderRadius: 10,
                        }}
                        resizeMode="stretch"
                      />
                    </View>
                    <View
                      style={{
                        flex: 1,
                        //    flexDirection: 'row',
                        //    flexWrap: 'wrap',
                        //    height: undefined,
                      }}>
                      <Image
                        source={{uri: Constant.ShowImage + document.aadharBack}}
                        style={{
                          width: '100%',
                          aspectRatio: 1,
                          borderRadius: 10,
                        }}
                        resizeMode="stretch"
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
            {document.pancard != null && (
              <View style={{marginTop: 20}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
                  Pan Card
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    shadowColor: 'gray',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 1,
                    marginTop: 10,
                    borderRadius: 10,
                  }}>
                  <View style={{}}>
                    <Text>{document.pancard}</Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      height: undefined,
                    }}>
                    <Image
                      source={{uri: Constant.ShowImage + document.pancardimage}}
                      style={{
                        height: 100,
                        width: '100%',
                        borderRadius: 10,
                        aspectRatio: 135 / 76,
                      }}
                      resizeMode="stretch"
                    />
                  </View>
                </View>
              </View>
            )}
            {document.drivingLicense != null && (
              <View style={{marginTop: 20}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 18}}>
                  Driving Licence
                </Text>
                <View
                  style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    shadowColor: 'gray',
                    shadowOffset: {width: 0, height: 1},
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 1,
                    marginTop: 10,
                    borderRadius: 10,
                  }}>
                  <View style={{}}>
                    <Text>{document.drivingLicense}</Text>
                  </View>
                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      height: undefined,
                    }}>
                    <Image
                      source={{
                        uri: Constant.ShowImage + document.drivingLicenseimage,
                      }}
                      style={{
                        height: 50,
                        width: '100%',
                        borderRadius: 10,
                        aspectRatio: 135 / 76,
                      }}
                      resizeMode="stretch"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                marginTop: 10,
                backgroundColor: 'white',
              },
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="add document"
                  onPress={() => {
                    navigation.navigate('AddDocument2', {
                      id: route.params.id,
                      loanType: route.params.loanType,
                    });
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton
                  text="next"
                  onPress={() =>
                    navigation.navigate('Mortage', {
                      id: route.params.id,
                      loanType: route.params.loanType,
                    })
                  }
                />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddDocument2', {
              id: route.params.id,
              loanType: route.params.loanType,
            });
          }}
          style={{
            position: 'absolute',
            bottom: 90,
            right: 20,
            padding: 10,
            backgroundColor: colors.blue,
            borderRadius: 40,
            shadowColor: 'gray',
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
          }}>
          <Feather name="plus" size={30} color="white" />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}
