import {StyleSheet, Platform} from 'react-native';
import Constant from '../CommonFiles/Constant';

const CommonStyle = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: 'white',
  },
  BottomSheetImageSelectionContainer: {
    width: Constant.width,
    paddingHorizontal: 20,
    marginLeft: -20,
    height: 250,
    bottom: -280,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: 'white',
  },
  BottomSheetImageSelectionOptionContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: Constant.primaryGreen,
  },
  icon21: {
    height: 21,
    width: 21,
  },
  activeMenuIconStyle: {
    height: (Constant.width / 100) * 7.3,
    width: (Constant.width / 100) * 7.3,
    marginRight: 10,
    // marginLeft: 20,
    tintColor: Constant.primaryGreen,
  },
  AddIconStyle: {
    height: (Constant.width / 100) * 12,
    width: (Constant.width / 100) * 12,
  },
  HeaderIconStyle: {
    height: (Constant.width / 100) * 14,
    width: (Constant.width / 100) * 14,
    // marginLeft:-5
  },
  HeaderProfileStyle: {
    height: (Constant.width / 100) * 8,
    width: (Constant.width / 100) * 8,
  },
  menuIconStyle: {
    height: (Constant.width / 100) * 7.3,
    width: (Constant.width / 100) * 7.3,
    marginRight: 10,
    tintColor: Constant.gray,
    // marginLeft: 20,
  },
  menuText: {
    marginTop: 8,
    marginBottom: 8,
    color: 'black',
    // fontSize: menuFontSize,
    // fontFamily: Constant.KThemeFontRegular,
    marginLeft: 5,
    flex: 0.9,
  },
  closeIconStyle: {
    height: (Constant.width / 100) * 11,
    width: (Constant.width / 100) * 11,
    marginHorizontal: 10,
  },
  imageShadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 5,
    backgroundColor: Constant.white,
    borderRadius: Platform.OS === 'android' ? 5 : 10,
  },
  iconsShadow: {
    height: 35,
    width: 35,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowcss: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  modalOptionIcon: {marginRight: 10},
  otpContainerStyle: {
    textAlign: 'center',
    color: 'black',
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default CommonStyle;
