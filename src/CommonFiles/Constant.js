import {Dimensions, Platform} from 'react-native';

const KBaseURL = 'http://45.80.152.23:4574/';
const user = KBaseURL + 'user/';

const headerFormData = {
  Accept: '*/*',
  'Content-Type': 'application/json',
};
const headerURLEncoded = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
  // Authorization: 'Bearer ',
};

const headerJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

class Constant {
  static KGoogleMapAPIKey = 'AIzaSyCw_5YoOp78lvq1Dgfri-TnDjRSf1cguf0';

  static headerFormData = headerFormData;
  static headerURLEncoded = headerURLEncoded;
  static headerJSON = headerJSON;

  // for UploadImage
  static uploadImage = user + 'image/';
  static base64Image = user + 'image64';
  static ShowImage = KBaseURL + 'getfiles/';

  // for Login
  static login = user + 'otpsend';

  // for Delete
  static Delete = user + 'deleteaccount';

  // for OTP verification
  static otpVerification = user + 'otpverify';

  // for PIN verification
  static verifypin = user + 'verifypin';

  // for assignpin verification
  static assignpin = user + 'assignpin';

  // for Register
  static register = user + 'register';

  // for GetProfile
  static getprofile = user + 'getprofile';

  // for Terms & Condition
  static TermsAndCondition = user + 'updateprofile';

  // for Customer verify
  static customerVerify = user + 'customerverify';
  static customerOTPVerify = user + 'customerotpverify';

  // for Customers
  static Customers = user + 'customer'; // POST or PUT or GET or DELETE all in one

  // for mortgage
  static addMortgage = user + 'mortgage';
  static getMortgagebyCustomerid = user + 'mortgagegetbycusid/';

  // for Addloan
  static addLoan = user + 'loan';
  static LoanbyCustomer = user + 'loanbycustomer/';
  static LoanbyStatus = user + 'loangetbystatus/';
  static customerloanByStatus = user + 'loangetbystatuscustomer';
  static loanToday = user + 'loantoday';

  // for ManageRepayment
  static ManageRepayment = user + 'repayment';

  // for Credit EMI
  static creditEMI = user + 'creditemi';

  static KUserDetailsKey = 'userDetails';
  static KLoginStatusKey = 'LoginStatus';
  static KLogin = 'Login';
  static KLogout = 'Logout';
  static KClientSecretKey = 'ClientSecret';
  static KTrue = true;
  static KFalse = false;
  static KSuccessCode = 200;
  static KErrorCode = 401;

  static width = Dimensions.get('window').width;
  static height = Dimensions.get('window').height;

  static theme = {
    roundness: 10,
    colors: {
      background: 'white',
      primary: '#0090FF',
      // underlineColor: Constant.textColor4,
    },
  };
  static disableTheme = {
    roundness: 10,
    colors: {
      background: '#ECECEC',
      primary: '#47CA6C',
      // underlineColor: Constant.textColor4,
    },
  };

  static KSpecialCharRegex = /[`~<>;':"/[\]|{}()=+!?@#$%^=&*/_]/;

  static KNumberRegex = /^[A-Za-z\s]+$/;
  static KEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  static KPasswordRegex = /^(?=.*\d)(?=.*[aA-zZ]).{6,20}$/;
  static KCurrency = '$';
  static ruppy = '₹';
}

export default Constant;
