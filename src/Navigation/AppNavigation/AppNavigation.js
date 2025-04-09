import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../Screens/HomeScreen/HomeScreen';
import Loan from '../../Screens/Loan/Loan';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';
import LoanDetails from '../../Screens/LoanDetails/LoanDetails';
import CreditEMI from '../../Screens/LoanDetails/CreditEMI/CreditEMI';
import CloseLoan from '../../Screens/LoanDetails/CloseLoan/CloseLoan';
import AddLoan from '../../Screens/AddLoan/AddLoan';
import MyCustomer from '../../Screens/MyCustomers/MyCustomer';
import CustomerDetails from '../../Screens/CustomerDetails/CustomerDetails';
import BottomTabNavigation from '../BottomTabNavigation/BottomTabNavigation';
import BusinessDetails from '../../Screens/BusinessDetails/BusinessDetails';
import TermsAnsConditionDetails from '../../Screens/TermsAndCondition/TermsAndConditionDetails';
import Help from '../../Screens/Help/Help';
import Setting from '../../Screens/Setting/Setting';
import Address from '../../Screens/Details/Address/Address';
import Document from '../../Screens/Details/Document/Document';
import Occupation from '../../Screens/Details/Occupation/Occupation';
import PersonalDetails from '../../Screens/Details/PersonalDetails/PersonalDetails';
import Referance from '../../Screens/Details/Reference/Referance';
import DrivingLicenceDocument from '../../Screens/Details/Document/DrivinglicenceDocument';
import Mortage from '../../Screens/Mortage/Mortage';
import AddMortage from '../../Screens/Mortage/AddMortage';
import MortageDetails from '../../Screens/Mortage/MortageDetails';
import ProductDetails from '../../Screens/ProductsDetails/ProductDetails';
import EMICalculation from '../../Screens/EMICalculation/EMICalculation';
import LoanSummary from '../../Screens/LoanSummary/LoanSummary';
import AadharVerify from '../../Screens/AadharVerify/AadharVerify';
import AddCustomer from '../../Screens/AddCustomer/AddCustomer';
import ExistCustomer from '../../Screens/ExistCustomer/ExistCustomer';
import Penlty from '../../Screens/Penalty/Penalty';
import AddSignature from '../../Screens/AddSignature/AddSignature';
import colors from '../../CommonFiles/Colors';
import ManageRepaymentCycle from '../../Screens/ManageRepaymentCycle/ManageRepaymentCycle';
import AadharCardDoc from '../../Screens/Details/Document/AadharCardDoc';
import PanCardDoc from '../../Screens/Details/Document/PanCardDoc';
import Logic from '../../Screens/Logic/Logic';
import Document2 from '../../Screens/Details/Document/Document2';
import BottomStack from '../Bottom-Stack/Bottom-Stack';
import OtpVerificationScreen from '../../Screens/AadharVerify/OtpVerificationScreen';
import Logic2 from '../../Screens/Logic/Logic2';
import NoDocument from '../../Screens/Details/NoDocument/NoDocument';
import AddDocument from '../../Screens/Details/NoDocument/AddDocument';
import ShowDocument from '../../Screens/Details/NoDocument/ShowDocument';
import AddDocument2 from '../../Screens/Details/NoDocument/AddDocument2';
import AddMortgage2 from '../../Screens/Mortage/AddMortgage2';
import NextEMIdateLoan from '../../Screens/NextEMIdateLoan/NextEMIdateLoan';
import GradientHeader from '../../Screens/GradiantHeader';
import GoldLoanGage from '../../Screens/Mortage/ForGoldLoan/GoldLoanGage';
import GoldLoanGageDetails from '../../Screens/Mortage/ForGoldLoan/GoldLoanGageDetails';
import AddPersonalLoan from '../../Screens/AddLoan/AddPersonaLoan';
import PersonalLoanLogic from '../../Screens/Logic/PersonalLoanLogic';
import PersonalLoanLogic2 from '../../Screens/Logic/PersonalLoanLogic2';
import ParticularCustomerLoan from '../../Screens/ParticularCustomerLoan/ParticularCustomerLoan';
import UpdateMortgage from '../../Screens/Mortage/UpdateMortgage';
import GoldLoanGage2 from '../../Screens/Mortage/ForGoldLoan/GoldLoanGage2';
import RightHeaderIcon from '../../Components/RightHeader/RightHeaderIcon';

export default function AppNavigation({navigation}) {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: {fontWeight: '500', fontSize: 20, color: 'white'},
        headerStyle: {
          // backgroundColor: 'transparent',
          backgroundColor: colors.blue,
        },
      }}
      initialRouteName="BottomTabNavigation">
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={({navigation}) => ({
          title: 'Welcome to Loan App',
          headerShown: false,
          //    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
        })}
      />
      {/* <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={({ navigation }) => ({
                    title: 'Welcome to Loan App',
                    headerShown: false,
                    //    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
                })}
            /> */}
      {/* <Stack.Screen
                name="Loan"
                component={Loan}
                options={({ navigation }) => ({
                    title: 'Loans',
                    headerShown: true,
                    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
                })}
            /> */}
      <Stack.Screen
        name="LoanDetails"
        component={LoanDetails}
        options={({navigation}) => ({
          title: 'Loan Details',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CreditEMI"
        component={CreditEMI}
        options={({navigation}) => ({
          title: 'Credit EMIs',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CloseLoans"
        component={CloseLoan}
        options={({navigation}) => ({
          title: 'Close Loan',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddLoan"
        component={AddLoan}
        options={({navigation}) => ({
          title: 'Add Loan',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddPersonalLoan"
        component={AddPersonalLoan}
        options={({navigation}) => ({
          title: 'Add Loan',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="MyCustomer"
        component={MyCustomer}
        options={({navigation}) => ({
          title: 'My Customer',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="CustomerDetails"
        component={CustomerDetails}
        options={({navigation}) => ({
          title: 'Customer Details',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Help"
        component={Help}
        options={({navigation}) => ({
          title: 'Help',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={({navigation}) => ({
          title: 'Setting',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={({navigation}) => ({
          title: 'Address',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Document"
        component={Document}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Document2"
        component={Document2}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="NoDocument"
        component={NoDocument}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="AddDocument"
        component={AddDocument}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />

      <Stack.Screen
        name="ShowDocument"
        component={ShowDocument}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddDocument2"
        component={AddDocument2}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="DrivingLicenceDocument"
        component={DrivingLicenceDocument}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="DrivingLicenceDocument2"
        component={DrivingLicenceDocument}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Occupation"
        component={Occupation}
        options={({navigation}) => ({
          title: 'Occupation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PersonalDetails"
        component={PersonalDetails}
        options={({navigation}) => ({
          title: 'Personal Details',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Referance"
        component={Referance}
        options={({navigation}) => ({
          title: 'Reference',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Mortage"
        component={Mortage}
        options={({navigation}) => ({
          title: 'Mortgage',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="MortageDetails"
        component={MortageDetails}
        options={({navigation}) => ({
          title: 'Mortgage',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddMortage"
        component={AddMortage}
        options={({navigation}) => ({
          title: 'Add Mortgage',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddMortgage2"
        component={AddMortgage2}
        options={({navigation}) => ({
          title: 'Add Mortgage',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="UpdateMortgage"
        component={UpdateMortgage}
        options={({navigation}) => ({
          title: 'Edit Mortgage',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="GoldLoanGage"
        component={GoldLoanGage}
        options={({navigation}) => ({
          title: 'Add Gold',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="GoldLoanGage2"
        component={GoldLoanGage2}
        options={({navigation}) => ({
          title: 'Add Gold',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="GoldLoanGageDetails"
        component={GoldLoanGageDetails}
        options={({navigation}) => ({
          title: 'Gold Details',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={({navigation}) => ({
          title: 'Product Details',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Logic"
        component={Logic}
        options={({navigation}) => ({
          title: 'EMI Calculation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Logic2"
        component={Logic2}
        options={({navigation}) => ({
          title: 'EMI Calculation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PersonalLoanLogic"
        component={PersonalLoanLogic}
        options={({navigation}) => ({
          title: 'EMI Calculation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PersonalLoanLogic2"
        component={PersonalLoanLogic2}
        options={({navigation}) => ({
          title: 'EMI Calculation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="EMICalculation"
        component={EMICalculation}
        options={({navigation}) => ({
          title: 'EMI Calculation',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="LoanSummary"
        component={LoanSummary}
        options={({navigation}) => ({
          title: 'Loan Summary',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AadharVerify"
        component={AadharVerify}
        options={({navigation}) => ({
          title: 'Loan',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomer}
        options={({navigation}) => ({
          title: 'Loan',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ExistCustomer"
        component={ExistCustomer}
        options={({navigation}) => ({
          title: 'Loans',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="Penlty"
        component={Penlty}
        options={({navigation}) => ({
          title: 'Penlty',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AddSignature"
        component={AddSignature}
        options={({navigation}) => ({
          title: 'Add Signature',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ManageRepaymentCycle"
        component={ManageRepaymentCycle}
        options={({navigation}) => ({
          title: 'Manage Repayment Cycle',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PanCardDoc"
        component={PanCardDoc}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PanCardDoc2"
        component={PanCardDoc}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AadharCardDoc"
        component={AadharCardDoc}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="AadharCardDoc2"
        component={AadharCardDoc}
        options={({navigation}) => ({
          title: 'Document',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="NextEMIdateLoan"
        component={NextEMIdateLoan}
        options={({navigation}) => ({
          title: 'Loan List',
          headerShown: true,
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,

          //   headerBackground: () => <GradientHeader />,
        })}
      />
      <Stack.Screen
        name="BusinessDetailss"
        component={BusinessDetails}
        options={({navigation}) => ({
          title: 'Business Details',
          headerShown: true,
          headerStyle: {backgroundColor: null},
          headerTitleStyle: {fontWeight: '500', fontSize: 18},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="TermsAnsConditionDetailss"
        component={TermsAnsConditionDetails}
        options={({navigation}) => ({
          title: 'Terms & Condition',
          headerShown: true,
          headerStyle: {backgroundColor: null},
          headerTitleStyle: {fontWeight: '500', fontSize: 18},
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="OtpVerificationScreen"
        component={OtpVerificationScreen}
        options={({navigation}) => ({
          title: 'Otp Verification',
          headerShown: true,
          //  headerStyle: { backgroundColor: null },
          //  headerTitleStyle: { fontWeight: '500', fontSize: 18 },
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="ParticularCustomerLoan"
        component={ParticularCustomerLoan}
        options={({navigation, route}) => ({
          title: route.params.name + '’s' + ' ' + 'Loan',
          headerShown: true,
          //  headerStyle: { backgroundColor: null },
          //  headerTitleStyle: { fontWeight: '500', fontSize: 18 },
          headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
          headerRight: () => <RightHeaderIcon navigation={navigation} />,
        })}
      />
      {/* <Stack.Screen
                name="BottomStack"
                component={BottomStack}
                options={({ navigation }) => ({
                    title: 'Business Details',
                    headerShown: true,
                    headerStyle: { backgroundColor: null },
                    headerTitleStyle: { fontWeight: '500', fontSize: 18 },
                    headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
                })}
            /> */}
    </Stack.Navigator>
  );
}
