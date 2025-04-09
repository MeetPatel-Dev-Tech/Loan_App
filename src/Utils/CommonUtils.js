// import Geolocation from 'react-native-geolocation-service';
import { Platform } from 'react-native';
import userDefaults from 'react-native-user-defaults';
import DefaultPreference from 'react-native-default-preference';
import Constant from '../CommonFiles/Constant';


// const myHeaders = new Headers();
// myHeaders.append("Accept", "*/*");
// myHeaders.append("Content-Type", "application/json");

let userToken = '';
let customHeaders = {
    Accept: '*/*',
    'Content-Type': 'application/json',
};
let headerURLEncoded = {
    // Accept: '*/*',
    // 'Content-Type': 'multipart/form-data',
};

const userInformation = new Headers();

let CommonUtilsObj = () => {
    UserDetails = '';
    customHeaders = JSON.parse(customHeaders);
    headerURLEncoded = JSON.parse(headerURLEncoded);
};


// const getToken = async () => {
//     try {
//         const token = await messaging().getToken();
//         if (token) return token;
//     } catch (error) {
//         console.log(error);
//     }
// };



const setLoggedUserDetails = data => {
    // CommonUtilsObj.userLoginState = Constant.KLogin;
    console.log('<--------- setLoggedUserDetails ---------->', data);
    if (Platform.OS === 'android') {
        DefaultPreference.set(Constant.KUserDetailsKey, data)
            .then(data => getLoggedUserDetails())
            .catch(function (err) {
                console.log(err);
            });
    } else {
        userDefaults
            .set(Constant.KUserDetailsKey, data)
            .then(data => getLoggedUserDetails())
            .catch(function (err) {
                console.log(err);
            });
    }
};

const getLoggedUserDetails = () => {
    console.log('Calling getLoggedEmployeDetails from CommonUtils....');

    if (Platform.OS === 'android') {
        return DefaultPreference.get(Constant.KUserDetailsKey)
            .then(function (data) {
                let obj = JSON.parse(data);
                console.log('User details -> ', JSON.stringify(obj));
                if (obj != '') {
                    CommonUtilsObj.UserDetails = obj;
                }
                if (obj[0].token != undefined) {
                    CommonUtilsObj.userToken = obj[0].token; //obj.token;
                    CommonUtilsObj.customHeaders = {
                        Accept: 'application/json',
                        'Content-Type': 'application/json', //"multipart/form-data",
                        Authorization: obj[0].token,
                    };
                    customHeaders = { ...customHeaders, Authorization: obj[0].token };
                    headerURLEncoded = { ...headerURLEncoded, Authorization: obj[0].token };
                }
                let Data = obj[0];
                return Data
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        return userDefaults
            .get(Constant.KUserDetailsKey)
            .then(data => {
                let obj = JSON.parse(data);
                console.log('User details -> ', JSON.stringify(obj));
                if (obj != '') {
                    CommonUtilsObj.UserDetails = obj;
                }
                if (obj[0].token != undefined) {
                    CommonUtilsObj.userToken = obj[0].token; //obj.token;
                    CommonUtilsObj.customHeaders = {
                        Accept: 'application/json',
                        'Content-Type': 'application/json', //"multipart/form-data",
                        Authorization: obj[0].token,
                    };
                    customHeaders = { ...customHeaders, Authorization: obj[0].token };
                    headerURLEncoded = { ...headerURLEncoded, Authorization: obj[0].token };
                }
                let Data = obj[0];
                return Data
            })
            .catch(function (err) {
                console.log('Errir: ', err);
                //return undefined;
            });
    }
};

export {
    //   getFCMToken,
    //  myHeaders,
    userInformation,
    CommonUtilsObj,
    setLoggedUserDetails,
    getLoggedUserDetails,
    // getLiveLocation,
    userToken,
    customHeaders,
    headerURLEncoded,
};