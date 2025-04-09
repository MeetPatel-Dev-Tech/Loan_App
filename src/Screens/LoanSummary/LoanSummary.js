import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import ProgressLoader from 'rn-progress-loader';
import Moment from 'moment';
import Modal from 'react-native-modal';
import SignatureScreen from 'react-native-signature-canvas';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {Colors, TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import {GetApi, PostApiImage} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {CommonUtilsObj} from '../../Utils/CommonUtils';
import CommonStyle from '../../CommonFiles/CommonStyle';
// var RNFS = require('react-native-fs');

export default function LoanSummary({navigation, route}) {
  const [downPaymentAmount, setDownPaymentAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [noEMI, setNoEMI] = useState('');
  const [processingFees, setProcessingFees] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [mortgageDetails, setMortgageDetails] = useState('');
  const [loanDetails, setLoanDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signatureCapture, setSignatureCapture] = useState('');

  const ref = useRef();

  const images = require('../../Assets/Icon/LoanP.png');

  useEffect(() => {
    getCustomerDetails();
    getLoanDetails();
    getMortgageDetails();
  }, []);

  const getCustomerDetails = async () => {
    const respons = await GetApi(Constant.Customers + '/' + route.params.id);
    console.log('responseCustomer', respons);
    if (respons.status == 200) {
      setCustomerDetails(respons.data);
    }
  };
  const getLoanDetails = async () => {
    const respons = await GetApi(Constant.addLoan + '/' + route.params.loanId);
    console.log('responseLoan', respons);
    if (respons.status == 200) {
      setLoanDetails(respons.data);
    }
  };
  const getMortgageDetails = async () => {
    const respons = await GetApi(
      Constant.addMortgage + '/' + route.params.mortgageId,
    );
    console.log('responseMortgage', respons);
    if (respons.status == 200) {
      setMortgageDetails(respons.data);
    }
  };

  console.log('con', 5 < 9);

  const handleOK = signature => {
    console.log('sign', signature);
    setSignatureCapture(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log('end');
    ref.current.readSignature();
    setIsModalVisible(false);
  };

  let officerSignature =
    CommonUtilsObj.UserDetails[0].data.signature != null ? (
      <div class="col-6">
        <img
          class=" img-fluid  "
          style="height: 200px;background-size: cover ; width: 100%; "
          src="${CommonUtilsObj.UserDetails[0].data.signature == null ? '' : Constant.ShowImage + CommonUtilsObj.UserDetails[0].data.signature}"
          alt=""
        />
      </div>
    ) : (
      ''
    );
  let customerSignature =
    signatureCapture != null ? (
      <div class="col-6">
        <img
          class=" img-fluid  "
          style="height: 200px;background-size: cover ; width: 100%; "
          src="${signatureCapture==null?images:signatureCapture}"
          alt=""
        />
      </div>
    ) : (
      ''
    );

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const DownloadFile = () => {
    RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then(contents => {
        // log the file contents
        console.log(contents);
      })
      .catch(err => {
        console.log(err.message, err.code);
      });
  };
  const create = async file => {
    RNFS.downloadFile({
      fromUrl: file,
      toFile: `${RNFS.DocumentDirectoryPath}/Loan.pdf`,
    }).promise.then(r => {
      console.log('r', r);
      //  this.setState({ isDone: true })
    });
  };

  const onCheck = () => {
    // if (customerDetails.aadharNumber != null && customerDetails.pancard == null && customerDetails.drivingLicense == null) {
    //     PDFAadharGenrater()
    // } else if (customerDetails.aadharNumber == null && customerDetails.pancard != null && customerDetails.drivingLicense == null) {
    //     PDFPancardGenreter()
    // } else if (customerDetails.aadharNumber == null && customerDetails.pancard == null && customerDetails.drivingLicense != null) {
    //     PDFDLGenreter()
    // } else if (customerDetails.aadharNumber != null && customerDetails.pancard != null && customerDetails.drivingLicense == null) {
    //     PDFAdhar_PanGenreter()
    // } else if (customerDetails.aadharNumber != null && customerDetails.pancard == null && customerDetails.drivingLicense != null) {
    //     PDFAdhar_DL()
    // } else if (customerDetails.aadharNumber == null && customerDetails.pancard != null && customerDetails.drivingLicense != null) {
    //     PDFPan_DL()
    // } else {
    onPressPDFGenrater();
    // }
  };

  const onPressPDFGenrater = async () => {
    setLoading(true);
    let options = {
      html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title></title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
                    rel="stylesheet">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
                    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
            
                <style>
                    
                    body {
                        font-family: 'Roboto', sans-serif;
                    }
                </style>
            
            <body style="padding-top: 30px; padding-left: 43px; padding-right: 43px; background-color: #f9f9fa; ">
            
                <div class="header" style="padding-bottom: 20px;">
                    <div style=" float: left;">
            
                        <div style=" float: left;
                        width: 60px;
                        height: 60px;
                          "><img src="data:image/png;base64,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"
                                alt="Red dot">
                        </div>
                    </div>
                    <div class="header-subtitle text-align-end" style="font-weight:
                                400;
                                font-size: 14px;
                                line-height: 18px;
                                text-align: end;
                                line-height: 20px;
                                color: #2d21d6;">
                        TVS CREDIT SERVICES LIMITED
                    </div>
                    <div class="header-subtitle text-align-end" style="font-weight:
                                400;
                                font-size: 14px;
                                line-height: 18px;
                                text-align: end;
                                line-height: 20px;
                                text-decoration: underline;
                                color:  #2d21d6;">
                        BY HIRENSINH
                    </div>
                </div>
                <div class="bottom-line" style="border-bottom: 1px solid #000;
                margin-top: 10px;
                clear: both;
                margin-bottom: 14px; width: 100%;">
                </div>
               
            
                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                <tr>
                <td style="background-color:#0090FF  ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">     Personal Details</td>
            </tr>
            <tr>
                <td>First Name</td>
                <td style="color: #8E9197;">${
                  customerDetails.firstName == null
                    ? '-'
                    : customerDetails.firstName
                }</td>
    
            </tr>
            <tr>
                <td>Middle Name</td>
                <td style="color: #8E9197;">${
                  customerDetails.middleName == null
                    ? '-'
                    : customerDetails.middleName
                }</td>
    
            </tr>
            <tr>
                <td>Last Name</td>
                <td style="color: #8E9197;">${
                  customerDetails.lastName == null
                    ? '-'
                    : customerDetails.lastName
                }</td>
    
            </tr>
            <tr>
                <td>Mobile Number</td>
                <td style="color: #8E9197;">${
                  customerDetails.number == null ? '-' : customerDetails.number
                }</td>
    
            </tr>
            <tr>
                <td>Alternet Number</td>
                <td style="color: #8E9197;">${
                  customerDetails.altnumber == null
                    ? '-'
                    : customerDetails.altnumber
                }</td>
    
            </tr>
    
            <tr>
            <td>Email</td>
            <td style="color: #8E9197;">${
              customerDetails.email == null
                ? '-'
                : customerDetails.email == null
            }</td>

            </tr> 
            <tr>
                <td>Date of Birth</td>
                <td style="color: #8E9197 ;">${
                  customerDetails.dob == null
                    ? '-'
                    : Moment(customerDetails.dob).format('DD-MM-YYYY')
                }</td>
    
            </tr>
                  
                </table>
            
                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF  ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Address</td>
                    </tr>
                    <tr>
                        <td>Pin Code</td>
                        <td style="color: #8E9197;">${
                          customerDetails.zipped == null
                            ? '-'
                            : customerDetails.zipped
                        }</td>
            
                    </tr>
                    <tr>
                        <td>City</td>
                        <td style="color: #8E9197;">${
                          customerDetails.city == null
                            ? '-'
                            : customerDetails.city
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Taluka</td>
                        <td style="color: #8E9197;">${
                          customerDetails.taluka == null
                            ? '-'
                            : customerDetails.taluka
                        }</td>
            
                    </tr>
                    <tr>
                        <td>District</td>
                        <td style="color: #8E9197;">${
                          customerDetails.district == null
                            ? '-'
                            : customerDetails.district
                        }</td>
            
                    </tr>
                    <tr>
                        <td>State</td>
                        <td style="color: #8E9197;">${
                          customerDetails.state == null
                            ? '-'
                            : customerDetails.state
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Country</td>
                        <td style="color: #8E9197;">${
                          customerDetails.country == null
                            ? '-'
                            : customerDetails.country
                        }</td>
            
                    </tr>
                    <tr>
                        <td>LandMark</td>
                        <td style="color: #8E9197;">${
                          customerDetails.landMark == null
                            ? '-'
                            : customerDetails.landMark
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Address Line1</td>
                        <td style="color: #8E9197;">${
                          customerDetails.addressLine1 == null
                            ? '-'
                            : customerDetails.addressLine1
                        }</td>
            
                    </tr>
                  
                </table>
            
                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF   ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Occupation</td>
                    </tr>
                    <tr>
                        <td>Company Name</td>
                        <td style="color: #8E9197;">${
                          customerDetails.companyName == null
                            ? '-'
                            : customerDetails.companyName
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Address</td>
                        <td style="color: #8E9197;">${
                          customerDetails.address == null
                            ? '-'
                            : customerDetails.address
                        }</td>
            
                    </tr>
                </table>


                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF  ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Reference</td>
                    </tr>
                    <tr>
                    <td>First Name</td>
                    <td style="color: #8E9197;">${
                      customerDetails.reffirstName == null
                        ? '-'
                        : customerDetails.reffirstName
                    }</td>
        
                   </tr>
                    <tr>
                        <td>Last Name</td>
                        <td style="color: #8E9197;">${
                          customerDetails.reflastName == null
                            ? '-'
                            : customerDetails.reflastName
                        }</td>

                    </tr>
                    <tr>
                        <td>Number</td>
                        <td style="color: #8E9197;">${
                          customerDetails.refnumber == null
                            ? '-'
                            : customerDetails.refnumber
                        }</td>

                    </tr>
                </table>
            
                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF  ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Document</td>
                    </tr>
                   
                </table>
              
                <table style="width: 100%;  border:1px solid black;">
                <tr>
                 <td>Aadhar Number</td>
                 <td style="color: #8E9197;">${
                   customerDetails.aadharNumber == null
                     ? '-'
                     : customerDetails.aadharNumber
                 }</td>
                </tr>
                   
                </table>


                <div class="row "  style="margin-top: 10px; clear: both; align-items: flex-start;">
                    <div class="col-6">
                        <p style="color: black; font-size: 18px; font-weight: bold "> AadharFront Image</p>
                    </div>
                    <div class="col-6">
                      <p style="color: black;  font-size: 18px; font-weight: bold "> AadharBack Image</p>
                    </div>
                
                    <div class="col-6">
                        <img class=" img-fluid  " style="height: 170px;background-size: cover ; width: 100%; " src="${
                          Constant.ShowImage + customerDetails.aadharFront
                        }" alt="">
            
                    </div>
                    <div class="col-6">
                    <img class=" img-fluid  " style="height: 170px;background-size: cover ; width: 100%; " src="${
                      Constant.ShowImage + customerDetails.aadharFront
                    }" alt="">
        
                </div>
                </div>

                
                  <table style="width: 100%;  border:1px solid black;  margin-top: 20px;">
                    <tr>
                    <td>PanCard Number : ${
                      customerDetails.pancard == null
                        ? '-'
                        : customerDetails.pancard
                    }</td>
                    <td>DrivingLicence Number : ${
                      customerDetails.drivingLicense == null
                        ? '-'
                        : customerDetails.drivingLicense
                    }</td>
                    </tr>
                 </table>


                 <div class="row " style="margin-top: 20px;">
                 <div class="col-6">
                     <img class=" img-fluid  " style="height: 170px;background-size: cover ; width: 100%; " src="${
                       Constant.ShowImage + customerDetails.pancardimage
                     }" alt="">
         
                 </div>
                 <div class="col-6">
                     <img class=" img-fluid  " style="height: 170px;background-size: cover ; width: 100%; " src="${
                       Constant.ShowImage + customerDetails.drivingLicenseimage
                     }" alt="">
         
                 </div>
             </div>
                 
         </div>
            
               
            
         <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
            <tr>
                <td style="background-color:#0090FF   ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Mortgage</td>
            </tr>
            <tr>
                <td>Account Holder Name</td>
                <td style="color: #8E9197;">${
                  mortgageDetails.accountHoldername
                }</td>
    
            </tr>
            <tr>
                <td>Cheque Number</td>
                <td style="color: #8E9197 ;">${
                  mortgageDetails.checkNumber == null
                    ? '-'
                    : mortgageDetails.checkNumber
                }</td>
    
            </tr>
            <tr>
                <td>Bank Name</td>
                <td style="color: #8E9197;">${mortgageDetails.bankName}</td>
    
            </tr>
            <tr>
                <td>Account Number</td>
                <td style="color: #8E9197;">${
                  mortgageDetails.accountNumber == null
                    ? '-'
                    : mortgageDetails.accountNumber
                }</td>
    
            </tr>
                </table>
            
                <div class="row w-100% pt-4">
                        <div class="col-6">
                            <img class=" img-fluid  " style="height: 200px;background-size: cover ; width: 100%; " src="${
                              Constant.ShowImage + mortgageDetails.image
                            }" alt="">
                        </div>
                        <div class="col-6">
                          
                        </div>
            
                </div>
            
                <table style="width: 100%;  border:1px solid black;  margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF   ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Product Details</td>
                    </tr>
                    <tr>
                        <td>Product</td>
                        <td style="color: #8E9197;">${
                          loanDetails.applianceName
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Brand</td>
                        <td style="color: #8E9197;">${loanDetails.brand}</td>
            
                    </tr>
                    <tr>
                        <td>Model</td>
                        <td style="color: #8E9197;">${loanDetails.model}</td>
            
                    </tr>
                    <tr>
                        <td>Color</td>
                        <td style="color: #8E9197 ;">${loanDetails.color}</td>
            
                    </tr>
                    <tr>
                        <td>Variant</td>
                        <td style="color: #8E9197 ;">${loanDetails.variant}</td>
            
                    </tr>
                    <tr>
                        <td>SerialNumber</td>
                        <td style="color: #8E9197 ;">${
                          loanDetails.serialNumber
                        }</td>
            
                    </tr>
                </table>
                <div class="row "  style="margin-top: 10px; clear: both; align-items: flex-start;">
                    <div class="col-6">
                        <p style="color: black; font-size: 18px; font-weight: bold "> Product Image</p>
                    </div>
                    <div class="col-6">
                      <p style="color: black;  font-size: 18px; font-weight: bold ">  Invoice Image</p>
                    </div>
                
                    <div class="col-6">
                    <img class=" img-fluid  " style="height: 200px;background-size: cover ; width: 100%; " src="${
                      Constant.ShowImage + loanDetails.product
                    }" alt="" />
                
                    </div>
                   <div class="col-6">
                   <img class=" img-fluid  " style="height: 200px;background-size: cover ; width: 100%; " src="${
                     Constant.ShowImage + loanDetails.invoice
                   }" alt="">
                   </div>
                </div>

                
                <table style="width: 100%;  border:1px solid black;   margin-top: 30px;">
                    <tr>
                        <td style="background-color:#0090FF   ; font-size: 18px; ; color: white; font-weight: bold; padding: 4px;" colspan="4">Summary</td>
                    </tr>
                    <tr>
                        <td>Product Price</td>
                        <td style="color: #8E9197;">₹ ${loanDetails.price}</td>
            
                    </tr>
                    <tr>
                        <td>Processing Fees </td>
                        <td style="color: #8E9197;">₹ ${
                          loanDetails.processingFees
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Total Amt</td>
                        <td style="color: #8E9197;">₹ ${
                          Number(loanDetails.price) +
                          Number(loanDetails.processingFees)
                        }}</td>
            
                    </tr>
                    <tr>
                        <td>Down Payment </td>
                        <td style="color: #8E9197;">₹ ${
                          loanDetails.downPayment
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Loan Amt</td>
                        <td style="color: #8E9197;">₹ ${
                          loanDetails.loanAmount
                        }</td>
            
                    </tr>
                    <tr>
                        <td>Duration</td>
                        <td style="color: #8E9197;">${
                          loanDetails.loanDuration
                        } months</td>
            
                    </tr>
                    <tr>
                        <td>Interest Rate</td>
                        <td style="color: #8E9197;">${
                          loanDetails.emiRate
                        } %</td>
            
                    </tr>
                    <tr>
                        <td>Monthly Interest Amt</td>
                        <td style="color: #8E9197;">₹ ${loanDetails.MIA}</td>
            
                    </tr>
                    <tr>
                        <td>Total Interest Amt</td>
                        <td style="color: #8E9197;">₹ ${loanDetails.TIA}</td>
            
                    </tr>
                    <tr>
                        <td>Total Repayable Amt</td>
                        <td style="color: #8E9197;">₹ ${loanDetails.TRA}</td>
            
                    </tr>
                    <tr>
                        <td>EMI Date</td>
                        <td style="color: #8E9197;">${Moment(
                          loanDetails.emiDate,
                        ).format('DD-MM-yyyy')}</td>
            
                    </tr>
                    <tr>
                        <td>EMI Type</td>
                        <td style="color: #8E9197;">${
                          loanDetails.emiType == 0
                            ? 'Interest Only'
                            : 'Interest + Capital'
                        }</td>
            
                    </tr>
                    <tr>
                        <td>EMI Amt</td>
                        <td style="color: #8E9197;">${
                          loanDetails.emiAmount
                        }</td>
            
                    </tr>
                <tr>
                    <td>Last EMI Amt</td>
                    <td style="color: #8E9197;">₹ ${loanDetails.LEA}</td>

                </tr>
            
                </table>
            
            
                
            
            
               
                <div class="row "  style="margin-top: 10px; clear: both; align-items: flex-start;">
                    <div class="col-6">
                        <p style="color: black; font-size: 18px; font-weight: bold ">  Cutomer Signature</p>
                    </div>
                    <div class="col-6">
                      <p style="color: black; font-size: 18px; font-weight: bold ">  Loan Officer  Signature </p>
                    </div>
                
                    <div class="col-6">
                    <img class=" img-fluid  " style="height: 100px;background-size: cover ;  width: 100%; " src="${
                      signatureCapture == ''
                        ? require('../../Assets/Icon/Add.png')
                        : signatureCapture
                    }" alt="" />
                
                    </div>
                   <div class="col-6">
                   <img class=" img-fluid  " style="height: 100px;background-size: cover ; width: 100%; " src="${
                     CommonUtilsObj.UserDetails[0].data.signature == null
                       ? images
                       : Constant.ShowImage +
                         CommonUtilsObj.UserDetails[0].data.signature
                   }" alt="">
                   </div>
                </div>
            
                
               
               
                
                
            
               
            </head>
            
            <style>
                table {
                    width: 300px;
                    text-align: start;
                    padding-top: 50px;
                  
                }
                table, th, td {
                    border: solid 1px #DDD;
                    border-collapse: collapse;
                    padding: 2px 3px;
                    text-align: start;
                    align-items: center;
                    width: 50%;
                }
            </style>
            
            
            </html> `,
      fileName: 'Loan',
      directory: 'vnd.andoid.document/directory',
      //  directory: `${RNFS.DocumentDirectoryPath}/Loan.pdf`,
    };

    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
    console.log('gg', file);
    //  alert(file.filePath);
    setLoading(false);
    Alert.alert(
      'PDF Successfully Generate',
      'Path:' + file.filePath,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            // RNFS.copyFile(file.filePath, `${RNFS.DocumentDirectoryPath}/Loan.pdf`)
            //     .then(result => {
            //         console.log('file copied:', result);
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     });
          },
        },
        {
          text: 'Open',
          onPress: () => {
            openFile(file.filePath);
            navigation.navigate('BottomTabNavigation');
          },
        },
      ],
      {cancelable: true},
    );
  };

  const openFile = filepath => {
    const path = filepath; // absolute-path-to-my-local-file.
    FileViewer.open(path)
      .then(() => {
        // success
      })
      .catch(error => {
        console.log(error);
      });
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
      <View
        style={{
          backgroundColor: colors.bgColor,
          flex: 1,
          // marginTop: 10,
          // borderTopLeftRadius: 30,
          // borderTopRightRadius: 30,
        }}>
        <ScrollView style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Personal Details
          </Text>
          <View
            style={{
              // height: 45,
              padding: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowColor: 'black',
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>customerName : </Text>
              <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                MobileNumber :{' '}
              </Text>
              {customerDetails.altnumber != null && (
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  AlternetNumber :{' '}
                </Text>
              )}
              {customerDetails.email != null && (
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>Email : </Text>
              )}
              {customerDetails.dob != null && (
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>Dob : </Text>
              )}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{}}>
                {customerDetails.firstName} {customerDetails.middleName}{' '}
                {customerDetails.lastName}
              </Text>
              <Text style={{marginTop: 5}}>{customerDetails.number}</Text>
              {customerDetails.altnumber != null && (
                <Text style={{marginTop: 5}}>{customerDetails.altnumber}</Text>
              )}
              {customerDetails.email != null && (
                <Text style={{marginTop: 5}}>{customerDetails.email}</Text>
              )}
              {customerDetails.dob != null && (
                <Text style={{marginTop: 5}}>
                  {Moment(customerDetails.dob).format('DD-MM-YYYY')}
                </Text>
              )}
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Address
          </Text>
          <View
            style={{
              //   height: 45,
              padding: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>Pincode :</Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>City :</Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>Taluka :</Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  District :
                </Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>State :</Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  Country :
                </Text>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  LandMark :
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={{}}>{customerDetails.zipped}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.city}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.taluka}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.district}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.state}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.country}</Text>
                <Text style={{marginTop: 5}}>{customerDetails.landMark}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{}}>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  Address :
                </Text>
              </View>
              <View style={{alignItems: 'flex-end', flex: 1}}>
                <Text style={{marginTop: 5}}>
                  {customerDetails.addressLine1}
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Occupation
          </Text>
          <View
            style={{
              //   height: 45,
              padding: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              flex: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <Text style={{fontWeight: 'bold'}}>companyName :</Text>
                {/* <Text style={{ marginTop: 5, fontWeight: 'bold' }}>Address:</Text> */}
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text>{customerDetails.companyName}</Text>
                {/* <Text style={{ marginTop: 5 }}>{customerDetails.address}</Text> */}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{}}>
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  Address :
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text style={{marginTop: 5}}>{customerDetails.address}</Text>
              </View>
            </View>
          </View>

          {customerDetails.reffirstName !== null && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontWeight: 'bold',
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                Reference
              </Text>

              <View
                style={{
                  //  height: 45,
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 1,
                  marginTop: 20,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>reffirstName :</Text>
                  <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                    reflastName :
                  </Text>
                  <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                    refnumber :
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text>{customerDetails.reffirstName}</Text>
                  <Text style={{marginTop: 5}}>
                    {customerDetails.reflastName}
                  </Text>
                  <Text style={{marginTop: 5}}>
                    {customerDetails.refnumber}
                  </Text>
                </View>
              </View>
            </>
          )}

          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Documents
          </Text>
          {customerDetails.aadharNumber != null && (
            <>
              <View
                style={{
                  //   height: 45,
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 1,
                  marginTop: 20,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Aadhar No. :</Text>
                </View>
                <View>
                  <Text style={{}}>{customerDetails.aadharNumber}</Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  //   borderColor: colo₹ blue
                }}>
                <Image
                  resizeMode="stretch"
                  style={{height: 100, width: '100%', borderRadius: 5}}
                  source={{
                    uri: Constant.ShowImage + customerDetails.aadharFront,
                  }}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  //   borderColor: colo₹ blue
                }}>
                <Image
                  resizeMode="stretch"
                  style={{height: 100, width: '100%', borderRadius: 5}}
                  source={{
                    uri: Constant.ShowImage + customerDetails.aadharBack,
                  }}
                  //   source={require('../../Assets/Icon/Add.png')}
                />
              </View>
            </>
          )}
          {customerDetails.pancard != null && (
            <>
              <View
                style={{
                  //   height: 45,
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 1,
                  marginTop: 20,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Pan No. :</Text>
                </View>
                <View>
                  <Text style={{}}>{customerDetails.pancard}</Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  //   borderColor: colo₹ blue
                }}>
                <Image
                  resizeMode="stretch"
                  style={{height: 100, width: '100%', borderRadius: 5}}
                  source={{
                    uri: Constant.ShowImage + customerDetails.pancardimage,
                  }}
                />
              </View>
            </>
          )}
          {customerDetails.drivingLicense != null && (
            <>
              <View
                style={{
                  //   height: 45,
                  padding: 10,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 1,
                  marginTop: 20,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>DrivingLicence No. :</Text>
                </View>
                <View>
                  <Text style={{}}>{customerDetails.drivingLicense}</Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 100,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  //   borderColor: colo₹ blue
                }}>
                <Image
                  resizeMode="stretch"
                  style={{height: 100, width: '100%', borderRadius: 5}}
                  source={{
                    uri:
                      Constant.ShowImage + customerDetails.drivingLicenseimage,
                  }}
                />
              </View>
            </>
          )}

          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Mortgage
          </Text>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <Text style={{fontWeight: 'bold'}}>Account Holder Name :</Text>
              {mortgageDetails.checkNumber != null && (
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  Cheque Number :
                </Text>
              )}
              <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                Bank Name :
              </Text>
              {mortgageDetails.accountNumber != null && (
                <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                  Account Number :
                </Text>
              )}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={{}}>{mortgageDetails.accountHoldername}</Text>
              {mortgageDetails.checkNumber != null && (
                <Text style={{marginTop: 5}}>
                  {mortgageDetails.checkNumber}
                </Text>
              )}
              <Text style={{marginTop: 5}}>{mortgageDetails.bankName}</Text>
              {mortgageDetails.accountNumber != null && (
                <Text style={{marginTop: 5}}>
                  {mortgageDetails.accountNumber}
                </Text>
              )}
            </View>

            {/* <View>
                            <Text style={{ marginTop: -24, fontWeight: 'bold', }}>₹ {mortgageDetails.netValue}</Text>
                        </View> */}
          </View>
          <View
            style={{
              backgroundColor: 'gray',
              borderRadius: 5,
              marginTop: 20,
              marginHorizontal: 20,
            }}>
            <Image
              source={{uri: Constant.ShowImage + mortgageDetails.image}}
              style={{height: 100, borderRadius: 5}}
              resizeMode="stretch"
            />
          </View>

          {loanDetails.loanType == 0 && (
            <>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontWeight: 'bold',
                  marginLeft: 20,
                  marginTop: 20,
                }}>
                Product Details
              </Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  shadowColor: 'gray',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 1,
                  marginTop: 20,
                  borderRadius: 5,
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View style={{flex: 1}}>
                  <Text style={{fontWeight: 'bold'}}>Product :</Text>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    Brand :
                  </Text>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    Model :
                  </Text>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    Color :
                  </Text>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    Variant :
                  </Text>
                  <Text style={{fontWeight: 'bold', marginTop: 10}}>
                    SerialNumber :
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text>{loanDetails.applianceName}</Text>
                  <Text style={{marginTop: 10}}>{loanDetails.brand}</Text>
                  <Text style={{marginTop: 10}}>{loanDetails.model}</Text>
                  <Text style={{marginTop: 10}}>{loanDetails.color}</Text>
                  <Text style={{marginTop: 10}}>{loanDetails.variant}</Text>
                  <Text style={{marginTop: 10}}>
                    {loanDetails.serialNumber}
                  </Text>
                </View>
              </View>
            </>
          )}
          {(loanDetails.product != null || loanDetails.invoice != null) && (
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {loanDetails.product != null && (
                <View style={{flex: 1, marginRight: 20}}>
                  <Image
                    source={{uri: Constant.ShowImage + loanDetails.product}}
                    style={{height: 80, width: '100%', borderRadius: 10}}
                    resizeMode="stretch"
                  />
                </View>
              )}
              {loanDetails.invoice != null && (
                <View style={{flex: 1}}>
                  <Image
                    source={{uri: Constant.ShowImage + loanDetails.invoice}}
                    style={{height: 80, width: '100%', borderRadius: 10}}
                    resizeMode="stretch"
                  />
                </View>
              )}
            </View>
          )}

          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Summary
          </Text>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 10,
              marginHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{flex: 1}}>
                {loanDetails.price != null && (
                  <Text style={{fontWeight: 'bold'}}>Product Price</Text>
                )}
                <Text
                  style={{
                    marginTop: loanDetails.price != null ? 20 : 0,
                    fontWeight: 'bold',
                  }}>
                  Processing Fees
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    fontWeight: 'bold',
                    paddingVertical: 10,
                  }}>
                  Total Amt
                </Text>
                {loanDetails.downPayment != null && (
                  <Text style={{marginTop: 10, fontWeight: 'bold'}}>
                    Down Payment
                  </Text>
                )}
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Loan Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Duration (Month)
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Interest Rate
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Monthly Interest Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Total Interest Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  Total Repayable Amt
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  EMI Date
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                  EMI Type
                </Text>
                <Text style={{marginTop: 20, fontWeight: 'bold'}}>EMI Amt</Text>
                {loanDetails.emiType == 0 && (
                  <Text style={{marginTop: 20, fontWeight: 'bold'}}>
                    Last EMI Amt
                  </Text>
                )}
              </View>
              <View style={{alignItems: 'flex-end'}}>
                {loanDetails.price != null && (
                  <Text>₹ {loanDetails.price}</Text>
                )}
                <Text style={{marginTop: loanDetails.price != null ? 20 : 0}}>
                  ₹ {loanDetails.processingFees}
                </Text>
                <Text
                  style={{
                    marginTop: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                  }}>
                  ₹{' '}
                  {Number(loanDetails.price) +
                    Number(loanDetails.processingFees)}
                </Text>
                {loanDetails.downPayment != null && (
                  <Text style={{marginTop: 10}}>
                    ₹ {loanDetails.downPayment}
                  </Text>
                )}
                <Text style={{marginTop: 20}}>₹ {loanDetails.loanAmount}</Text>
                <Text style={{marginTop: 20}}>{loanDetails.loanDuration}</Text>
                <Text style={{marginTop: 20}}>{loanDetails.emiRate}%</Text>
                <Text style={{marginTop: 20}}>₹ {loanDetails.MIA}</Text>
                <Text style={{marginTop: 20}}>₹ {loanDetails.TIA}</Text>
                <Text style={{marginTop: 20}}>₹ {loanDetails.TRA}</Text>
                <Text style={{marginTop: 20}}>
                  {Moment(loanDetails.emiDate).format('DD-MM-yyyy')}
                </Text>
                <Text style={{marginTop: 20}}>
                  {loanDetails.emiType == 0
                    ? 'Interest Only'
                    : 'Interest + Capital'}
                </Text>
                {loanDetails.emiType == 0 ? (
                  <Text style={{marginTop: 20}}>₹ {loanDetails.emiAmount}</Text>
                ) : (
                  <Text style={{marginTop: 20}}>₹ {loanDetails.emiAmount}</Text>
                )}
                {loanDetails.emiType == 0 && (
                  <Text style={{marginTop: 20}}>₹ {loanDetails.LEA}</Text>
                )}
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Loan Officer Signature
          </Text>
          <View
            style={{
              height: 100,
              //  paddingHorizontal: 20, paddingVertical: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowColor: 'black',
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {CommonUtilsObj.UserDetails[0].data.signature != null && (
              <Image
                resizeMode={'contain'}
                style={{width: 200, height: 80}}
                source={{
                  uri:
                    Constant.ShowImage +
                    CommonUtilsObj.UserDetails[0].data.signature,
                }}
              />
            )}
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 20,
              marginTop: 20,
            }}>
            Cutomer Signature
          </Text>
          <View
            style={{
              height: 100,
              //  paddingHorizontal: 20, paddingVertical: 10,
              backgroundColor: 'white',
              shadowColor: 'gray',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 1,
              marginTop: 20,
              borderRadius: 5,
              marginHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {signatureCapture != '' && (
              <Image
                resizeMode={'contain'}
                style={{width: 200, height: 80}}
                source={{uri: signatureCapture}}
              />
            )}
          </View>

          <View
            style={[
              CommonStyle.shadowcss,
              {
                padding: 20,
                marginTop: 10,
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}>
            <View style={{flex: 1, marginRight: 20}}>
              <CustomBorderButton
                text="Esign From"
                onPress={() => {
                  setIsModalVisible(true);
                }}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomButton
                text="generate pdf"
                onPress={() => {
                  {
                    onCheck();
                  }
                }}
              />
            </View>
          </View>
          {/* <Image
                        resizeMode={"contain"}
                        style={{ width: 200, height: 114 }}
                        source={{ uri: signatureCapture }}
                    /> */}
        </ScrollView>
      </View>

      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        //  animationOut='slideOutDown'
        //  swipeDirection='down'
        //  onSwipeComplete={() => setIsModalVisible(false)}
        onBackdropPress={() => setIsModalVisible(false)}>
        <View
          style={{
            justifyContent: 'flex-end',
            flex: 1,
            marginBottom: -20,
            marginHorizontal: -20,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingHorizontal: 30,
              paddingTop: 10,
              paddingBottom: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{height: 2, width: 40, backgroundColor: 'gray'}}></View>
              <View
                style={{
                  height: 2,
                  width: 40,
                  backgroundColor: 'gray',
                  marginTop: 2,
                }}></View>
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
                Digital Signature
              </Text>
              <View
                style={{
                  height: 300,
                  width: '100%',
                  borderWidth: 1,
                  marginTop: 20,
                  borderRadius: 10,
                }}>
                <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <View style={{flex: 1, marginRight: 20}}>
                <CustomBorderButton
                  text="clear"
                  onPress={() => handleClear()}
                />
              </View>
              <View style={{flex: 1}}>
                <CustomButton text="submit" onPress={() => handleConfirm()} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
