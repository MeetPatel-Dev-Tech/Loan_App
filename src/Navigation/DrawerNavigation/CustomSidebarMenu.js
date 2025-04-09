import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import userDefaults from 'react-native-user-defaults';
import {useSelector, useDispatch} from 'react-redux';
import DefaultPreference from 'react-native-default-preference';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image';
import ProgressLoader from 'rn-progress-loader';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Constant from '../../CommonFiles/Constant';
import {CommonUtilsObj} from '../../Utils/CommonUtils';
import {LogOuts} from '../../CommonFiles/SvgFile';
import {GetApi} from '../../Api/Api';
import {CredentialsContext} from '../../Components/Context/CredentialsContext';
import {ErrorToast, SuccessToast} from '../../ToastMessages/Toast';
import {
  loadingfalse,
  lodingtrue,
  LOGOUT,
  USER_LOGGED_OUT,
} from '../../Redux/ReduxConstant';

const CustomSidebarMenu = props => {
  const navigation = useNavigation();

  const result = useSelector(state => state);
  const dispatch = useDispatch();

  console.log('fgggg', result.userDetails[0]);

  const [selectedIndex, setSelectedIndex] = useState(1);
  const {storedCredentials, setStoredCredentials} =
    useContext(CredentialsContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    result.userDetails.firstName + ' ' + result.userDetails.lastName,
  );
  const [netInfo, setNetInfo] = useState(true);

  // console.log('props', props);
  // console.log('props', CommonUtilsObj.UserDetails[0].data.firstName);

  console.log('storedCredentials..', storedCredentials);

  const onLogoutPress = () => {
    Alert.alert(
      Constant.KAppTitle,
      'Are you sure, you want to logout?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            GetLogout();
          },
        },
      ],
      {cancelable: false},
    );
  };
  const GetLogout = () => {
    dispatch({type: lodingtrue});
    if (Platform.OS === 'android') {
      DefaultPreference.clear(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            dispatch({type: loadingfalse});
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            SuccessToast('Logout successfully');
            console.log('clear data...');
          }, 1000);
        })
        .catch(function (err) {
          console.log(err);
          dispatch({type: loadingfalse});
          ErrorToast(err);
        });
    } else {
      userDefaults
        .remove(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            dispatch({type: loadingfalse});
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            SuccessToast('Logout successfully');
            console.log('clear data...');
          }, 500);
        })
        .catch(function (err) {
          console.log(err);
          ErrorToast(err);
          dispatch({type: loadingfalse});
        });
    }
  };

  // const GetLogout = () => {
  //     setLoading(true);
  //     if (Platform.OS === 'android') {
  //         DefaultPreference.clear(Constant.KUserDetailsKey)
  //             .then(data => {
  //                 setTimeout(() => {
  //                     setLoading(false);
  //                     setStoredCredentials(null)
  //                     SuccessToast('Logout successfully');
  //                     console.log('clear data...')
  //                 }, 1000);
  //             })
  //             .catch(function (err) {
  //                 console.log(err);
  //             });
  //     } else {
  //         userDefaults
  //             .remove(Constant.KUserDetailsKey)
  //             .then(data => {
  //                 setTimeout(() => {
  //                     setLoading(false);
  //                     setStoredCredentials(null)
  //                     SuccessToast('Logout successfully');
  //                     console.log('clear data...')
  //                 }, 500);
  //             });
  //     }
  // }

  const onDeletePress = async () => {
    Alert.alert(
      Constant.KAppTitle,
      'Are you sure, you want to Delete Account ?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            GetDelete();
          },
        },
      ],
      {cancelable: false},
    );
  };

  const GetDelete = async () => {
    dispatch({type: lodingtrue});
    const response = await GetApi(Constant.Delete);
    console.log('delete', response);
    if (response.status == 200) {
      DataClear(response.message);
    } else {
      setLoading(false);
      ErrorToast(response.message);
    }
  };

  const DataClear = msg => {
    if (Platform.OS === 'android') {
      DefaultPreference.clear(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            SuccessToast(msg);
            dispatch({type: loadingfalse});
            // setStoredCredentials(null);
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            console.log('clear data...');
          }, 1000);
        })
        .catch(function (err) {
          console.log(err);
          dispatch({type: loadingfalse});
        });
    } else {
      userDefaults
        .remove(Constant.KUserDetailsKey)
        .then(data => {
          setTimeout(() => {
            SuccessToast(msg);
            dispatch({type: loadingfalse});
            // setStoredCredentials(null);
            dispatch({type: LOGOUT});
            dispatch({type: USER_LOGGED_OUT});
            console.log('clear data...');
          }, 500);
        })
        .catch(function (err) {
          console.log(err);
          dispatch({type: loadingfalse});
          ErrorToast(err);
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ProgressLoader
        visible={result.Loader.loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          marginTop: 20,
          alignItems: 'center',
          borderBottomWidth: 1,
          paddingBottom: 15,
        }}
        onPress={() => {
          props.navigation.closeDrawer();
          props.navigation.navigate('BottomStack');
        }}>
        <View
          style={{
            width: (Constant.width / 100) * 20,
            height: (Constant.width / 100) * 20,
            backgroundColor: Constant.secondaryGray,
            // marginRight: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            // marginLeft: 15
          }}>
          <FastImage
            source={
              result.userDetails[0].image == null ||
              result.userDetails[0].image == 'default.png'
                ? require('../../Assets/Image/profile.png')
                : {
                    uri: Constant.ShowImage + result.userDetails[0].image,
                    headers: {Authorization: 'someAuthToken'},
                    priority: FastImage.priority.high,
                    catch: FastImage.cacheControl.cacheOnly,
                  }
            }
            // resizeMode='contain'
            style={{
              height: (Constant.width / 100) * 20,
              width: (Constant.width / 100) * 20,
              borderRadius: 5,
            }}
          />
        </View>
        <View style={{marginTop: 10}}>
          <Text numberOfLines={1} style={{fontWeight: 'bold', color: 'black'}}>
            {result.userDetails[0].firstName +
              ' ' +
              result.userDetails[0].lastName}
          </Text>
        </View>
      </TouchableOpacity>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 10,
        }}>
        <DrawerItemList {...props} />
        <DrawerItem
          //  icon={({ focused }) => <Image source={require('../../Assets/Icon/LoNs.png')}
          //     style={{ height: 25, width: 25, tintColor: focused ? colors.blue : 'gray', marginRight: -25 }}
          //     resizeMode='contain'
          // />}
          icon={({focused}) => (
            <AntDesign
              name="delete"
              size={25}
              style={{marginRight: -24, marginLeft: -1}}
            />
          )}
          label="Delete Account"
          onPress={() => onDeletePress()}
        />
      </DrawerContentScrollView>
      <View style={{borderTopWidth: 1}}>
        <TouchableOpacity
          onPress={() => onLogoutPress()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 20,
            marginHorizontal: 20,
          }}>
          <View>
            <LogOuts height={25} width={25} />
          </View>
          <View style={{marginLeft: 10}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomSidebarMenu;
