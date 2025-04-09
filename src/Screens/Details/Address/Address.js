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
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Constant from '../../../CommonFiles/Constant';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import colors from '../../../CommonFiles/Colors';
import {GetApi, PostApi} from '../../../Api/Api';
import Message from '../../../CommonFiles/Message';
import {ErrorToast, SuccessToast} from '../../../ToastMessages/Toast';
import removeEmojis from '../../../Components/RemoveEmojis/RemoveEmojis';
import CommonStyle from '../../../CommonFiles/CommonStyle';

export default function Address({navigation, route}) {
  const [addressLine1, setAddressLine1] = useState('');
  // const [addressLine2, setAddressLine2] = useState('');
  //   const [area, setArea] = useState('');
  //  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [landmark, setLandmark] = useState('');
  const [taluka, setTaluka] = useState('');
  const [distric, setDistric] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipped, setZipped] = useState('');
  const [cityName, setCityName] = useState([]);
  const [country, setCountry] = useState('');
  const [netInfo, setNetInfo] = useState('online');
  const [error, setError] = useState('');
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();

  useEffect(() => {
    if (route.params.isEdit == false || route.params.AgainEdit == true) {
      getAddress();
      getLocations(route.params.data.zipped);
    }
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
    }, []),
  );

  const getAddress = () => {
    setZipped(route.params.data.zipped);
    setAddressLine1(route.params.data.addressLine1);
    setCity(route.params.data.city == null ? '' : route.params.data.city);
    setCountry(
      route.params.data.country == null ? '' : route.params.data.country,
    );
    setState(route.params.data.state == null ? '' : route.params.data.state);
    setLandmark(
      route.params.data.landMark == null ? '' : route.params.data.landMark,
    );
    setTaluka(route.params.data.taluka == null ? '' : route.params.data.taluka);
    setDistric(
      route.params.data.district == null ? '' : route.params.data.district,
    );
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (addressLine1 == '') {
        flag = false;
        errorMsg.push(Message.address);
      }
      if (city == '') {
        flag = false;
        errorMsg.push(Message.city);
      }
      if (zipped == '') {
        flag = false;
        errorMsg.push(Message.zipped);
      }
      if (state == '') {
        flag = false;
        errorMsg.push(Message.state);
      }
      if (country == '') {
        flag = false;
        errorMsg.push(Message.country);
      }
      if (taluka == '') {
        flag = false;
        errorMsg.push(Message.taluka);
      }
      if (distric == '') {
        flag = false;
        errorMsg.push(Message.district);
      }
      if (landmark == '') {
        flag = false;
        errorMsg.push(Message.landmark);
      }
      if (flag) {
        if (route.params.isEdit == false || route.params.AgainEdit == true) {
          onResubmit();
        } else {
          onSubmitData();
        }
      } else {
        var errMsg = '';
        if (errorMsg.length > 2) {
          errMsg = Message.KRequiredFiledsEmpty;
        } else {
          if (errorMsg.length == 2) {
            errMsg = errorMsg[0] + ', ' + errorMsg[1];
          } else {
            errMsg = errorMsg[0];
          }
        }
        ErrorToast(errMsg);
      }
    } else {
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const onSubmitData = async () => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        applicationStatus: 1,
        addressLine1: addressLine1,
        city: city,
        state: state,
        country: country,
        zipped: String(zipped),
        landMark: landmark,
        taluka: taluka == '' ? null : taluka,
        district: distric == '' ? null : distric,
      };
      // let apiData = ''
      // if (addressLine2 == '') {
      //     apiData = {
      //         ...data
      //     }
      // } else {
      //     apiData = {
      //         ...data, addressLine2: addressLine2
      //     }
      // }

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('Occupation', {
          isEdit: true,
          id: route.params.id,
          loanType: route.params.loanType,
        });
        SuccessToast('Address Add Successfully');
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  const onResubmit = async () => {
    setLoading(true);
    if (netInfo == 'online') {
      const data = {
        id: route.params.id,
        addressLine1: addressLine1,
        city: city,
        state: state,
        country: country,
        zipped: String(zipped),
        landMark: landmark,
        taluka: taluka == '' ? null : taluka,
        district: distric == '' ? null : distric,
      };

      const response = await PostApi(Constant.Customers, data, true);
      console.log('response...', response);
      if (response.status == 200) {
        setLoading(false);
        navigation.navigate('CustomerDetails', {
          //    isEdit: true,
          id: route.params.id,
        });
        SuccessToast('Address Update Successfully');
      } else {
        setLoading(false);
        ErrorToast(response.message);
      }
    } else {
      setLoading(false);
      ErrorToast(Message.KCheckInternetConnection);
    }
  };

  // const getLocation = async (value) => {
  //     if (value.length == 6) {
  //         let response = await GetApi(
  //             `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${Constant.KGoogleMapAPIKey}`,
  //         );
  //         console.log('ResLocation---------------', JSON.stringify(response.results[0]));
  //         // console.log('ResLocation---------------', response.results[0].geometry.location);
  //         // console.log('ResLocation---------------', response.results[0].geometry.location);
  //         // console.log('ResLocation---------------', response.results[0].address_components.length);
  //         if (response.status == 'OK') {
  //             setCity(response.results[0].address_components[1].long_name)
  //             setState(response.results[0].address_components[response.results[0].address_components.length - 2].long_name)
  //             setCountry(response.results[0].address_components[response.results[0].address_components.length - 1].long_name)
  //             // getAddress(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng)
  //         }
  //     } else {
  //         setCity('');
  //         setState('');
  //         setCountry('');
  //     }

  // }

  const getLocation = async value => {
    if (value.length == 6) {
      let response = await GetApi(
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${Number(value)}&key=${Constant.KGoogleMapAPIKey}`,
        `http://postalpincode.in/api/pincode/${value}`,
        // `https://api.worldpostallocations.com/pincode?postalcode=560094&countrycode=IN`,
      );
      console.log('ResLocation---------------', response);
      if (response.Status == 'Success') {
        setCityName(response.PostOffice);
        setError('');
      } else {
        setCityName([]);
        setError(response.Message);
        setCountry('');
        setCity('');
        setState('');
        setTaluka('');
        setDistric('');
      }
    } else {
      setCity('');
      setState('');
      setCountry('');
      setCityName([]);
      setState('');
      setTaluka('');
      setDistric('');
    }
  };
  const getLocations = async value => {
    if (value.length == 6) {
      let response = await GetApi(
        // `https://maps.googleapis.com/maps/api/geocode/json?address=${Number(value)}&key=${Constant.KGoogleMapAPIKey}`,
        `http://postalpincode.in/api/pincode/${value}`,
        // `https://api.worldpostallocations.com/pincode?postalcode=560094&countrycode=IN`,
      );
      console.log('ResLocation---------------', response);
      if (response.Status == 'Success') {
        setCityName(response.PostOffice);
        setError('');
      } else {
        // setCityName([]);
        // setError(response.Message);
        // setCountry('');
        // setCity('');
        // setState('');
        // setTaluka('');
        // setDistric('');
      }
    } else {
      // setCity('');
      // setState('');
      // setCountry('');
      // setCityName([]);
      // setState('');
      // setTaluka('');
      // setDistric('');
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TextInput
                mode="outlined"
                value={zipped}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setZipped(value.trim());
                  } else {
                    setZipped(value.replace(/[^0-9 ]/g, ''));
                    getLocation(value);
                  }
                }}
                label="Pin Code *"
                placeholder="Pin Code"
                maxLength={6}
                keyboardType="numeric"
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo2}
                onSubmitEditing={() => RefNo3.current.focus()}
                blurOnSubmit={false}
              />
              {route.params.isEdit == false ? (
                <TextInput
                  mode="outlined"
                  value={city}
                  editable={false}
                  theme={Constant.disableTheme}
                  onChangeText={value => {
                    if (value.includes(' ')) {
                      setTaluka(value.trim());
                    } else {
                      setTaluka(value.replace(/[^a-zA-Z ]/g, ''));
                    }
                  }}
                  label="City *"
                  placeholder="City"
                  style={{flex: 1}}
                  returnKeyType="next"
                  ref={RefNo3}
                  onSubmitEditing={() => RefNo4.current.focus()}
                  blurOnSubmit={false}
                />
              ) : (
                <View style={{marginTop: 6, flex: 1}}>
                  <Dropdown
                    placeholder="City"
                    label="City"
                    style={{
                      borderColor: isFocusdropdown1 ? colors.blue : 'gray',
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 8,
                      minHeight: 58,
                      backgroundColor: 'white',
                    }}
                    selectedTextStyle={{color: 'black'}}
                    maxHeight={200}
                    data={cityName}
                    value={city}
                    labelField="Name"
                    valueField="Name"
                    autoScroll={true}
                    onFocus={() => setIsFocusdropdown1(true)}
                    onBlur={() => setIsFocusdropdown1(false)}
                    onChange={item => {
                      setCity(item.Name);
                      setState(item.State);
                      setTaluka(item.Taluk);
                      setDistric(item.District);
                      setCountry(item.Country);

                      setIsFocusdropdown1(false);
                    }}
                    renderRightIcon={() => (
                      <Image
                        source={require('../../../Assets/Icon/DropDown.png')}
                        style={{height: 20, width: 20}}
                      />
                    )}
                  />
                </View>
              )}
            </View>
            {error != '' && <Text style={{color: 'red'}}>{error}</Text>}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: error == '' ? 20 : 4,
              }}>
              <TextInput
                mode="outlined"
                value={taluka}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setTaluka(value.trim());
                  } else {
                    setTaluka(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="Taluka *"
                placeholder="Taluka"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo3}
                onSubmitEditing={() => RefNo4.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                mode="outlined"
                value={distric}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setDistric(value.trim());
                  } else {
                    setDistric(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="District *"
                placeholder="District"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1}}
                returnKeyType="next"
                ref={RefNo4}
                onSubmitEditing={() => RefNo5.current.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TextInput
                mode="outlined"
                value={state}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setState(value.trim());
                  } else {
                    setState(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="State *"
                placeholder="State"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                style={{flex: 1, marginRight: 20}}
                returnKeyType="next"
                ref={RefNo4}
                onSubmitEditing={() => RefNo5.current.focus()}
                blurOnSubmit={false}
              />
              <TextInput
                mode="outlined"
                value={country}
                editable={route.params?.isEdit == false ? false : true}
                theme={
                  route.params?.isEdit == false
                    ? Constant.disableTheme
                    : Constant.theme
                }
                onChangeText={value => {
                  if (value.includes(' ')) {
                    setCountry(value.trim());
                  } else {
                    setCountry(value.replace(/[^a-zA-Z ]/g, ''));
                  }
                }}
                label="Country *"
                keyboardType={
                  Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
                }
                placeholder="Country"
                style={{flex: 1}}
                returnKeyType="next"
                ref={RefNo5}
                onSubmitEditing={() => RefNo6.current.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* <TextInput
                            mode="outlined"
                            value={zipped}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setZipped(value); getLocation(value) }}
                            label="Pin Code *"
                            placeholder="Pin Code"
                            maxLength={6}
                            keyboardType="numeric"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo1}
                            onSubmitEditing={() => RefNo2.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={city}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setCity(value); }}
                            label="City *"
                            placeholder="City"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo2}
                            onSubmitEditing={() => RefNo3.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={state}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setState(value); }}
                            label="State *"
                            placeholder="State"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo3}
                            onSubmitEditing={() => RefNo4.current.focus()}
                            blurOnSubmit={false}
                        />

                        <TextInput
                            mode="outlined"
                            value={country}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setCountry(value); }}
                            label="Country *"
                            placeholder="Country"
                            style={{ marginTop: 20 }}
                            returnKeyType="next"
                            ref={RefNo4}
                            onSubmitEditing={() => RefNo5.current.focus()}
                            blurOnSubmit={false}
                        /> */}
            <TextInput
              mode="outlined"
              value={landmark}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setLandmark(value.trim());
                } else {
                  // setLandmark(value.replace(/[^a-zA-Z 0-9 . ,]/g, ""))
                  setLandmark(removeEmojis(value));
                }
              }}
              label="LandMark *"
              placeholder="LandMark"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              returnKeyType="next"
              ref={RefNo5}
              onSubmitEditing={() => RefNo6.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={addressLine1}
              editable={route.params?.isEdit == false ? false : true}
              theme={
                route.params?.isEdit == false
                  ? Constant.disableTheme
                  : Constant.theme
              }
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setAddressLine1(value.trim());
                } else {
                  // setAddressLine1(value.replace(/[^a-zA-Z 0-9 . ,]/g, ""))
                  setAddressLine1(removeEmojis(value));
                }
              }}
              label="Address Line1 *"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              placeholder="Address Line1"
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo6}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            {/* <TextInput
                            mode="outlined"
                            value={addressLine2}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setAddressLine2(value); }}
                            label="Address Line2"
                            placeholder="Address Line2"
                            returnKeyType="next"
                            style={{ marginTop: 20 }}
                            ref={RefNo2}
                            onSubmitEditing={() => RefNo3.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={area}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setArea(value); }}
                            label="Area"
                            placeholder="Area"
                            returnKeyType="next"
                            style={{ marginTop: 20 }}
                            ref={RefNo3}
                            onSubmitEditing={() => RefNo4.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={zipped}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setZipped(value); }}
                            label="Pin Code"
                            placeholder="Pin Code"
                            keyboardType='numeric'
                            returnKeyType="next"
                            style={{ marginTop: 20 }}
                            ref={RefNo4}
                            onSubmitEditing={() => RefNo5.current.focus()}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            mode="outlined"
                            value={address}
                            editable={route.params?.isEdit == false ? false : true}
                            theme={route.params?.isEdit == false ? Constant.disableTheme : Constant.theme}
                            onChangeText={value => { setAddress(value); }}
                            label="Address"
                            placeholder="Address"
                            returnKeyType='done'
                            style={{ marginTop: 20, height: 100 }}
                            ref={RefNo5}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            blurOnSubmit={false}
                        /> */}
          </View>
          <View
            style={[
              CommonStyle.shadowcss,
              {marginTop: 10, padding: 20, backgroundColor: 'white'},
            ]}>
            {route.params?.isEdit == true ? (
              route.params?.AgainEdit == true ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, marginRight: 20}}>
                    <CustomBorderButton
                      text="cancel"
                      onPress={() =>
                        navigation.navigate('CustomerDetails', {
                          id: route.params.id,
                        })
                      }
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton text="Save" onPress={() => onValidate()} />
                  </View>
                </View>
              ) : (
                <CustomButton
                  text="next"
                  onPress={() => {
                    onValidate();
                  }}
                />
              )
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1, marginRight: 20}}>
                  <CustomBorderButton
                    text="cancel"
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CustomButton
                    text="Edit"
                    onPress={() => {
                      navigation.push('Address', {
                        isEdit: true,
                        AgainEdit: true,
                        data: route.params.data,
                        id: route.params.id,
                      });
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
