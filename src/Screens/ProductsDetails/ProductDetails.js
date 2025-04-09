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
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import Constant from '../../CommonFiles/Constant';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import {Upload} from '../../CommonFiles/SvgFile';
import CustomButton from '../../Components/CustomButton/CustomButton';
import colors from '../../CommonFiles/Colors';
import Message from '../../CommonFiles/Message';
import {PostApi, PostApiImage} from '../../Api/Api';
import {ErrorToast} from '../../ToastMessages/Toast';
import removeEmojis from '../../Components/RemoveEmojis/RemoveEmojis';
import CommonStyle from '../../CommonFiles/CommonStyle';

export default function ProductDetails({navigation, route}) {
  const [price, setPrice] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [netValue, setNetValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOption, setModalOption] = useState('');
  const [uploadImageUri, setUploadImageuri] = useState('');
  const [uploadImageUri2, setUploadImageuri2] = useState('');
  const [select, setSelect] = useState('');
  const [appliance, setAppliance] = useState('');
  const [brands, setBrands] = useState('');
  const [models, setModels] = useState('');
  const [coloor, setColoor] = useState('');
  const [variants, setVariants] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
  const [isFocusdropdown2, setIsFocusdropdown2] = useState(false);
  const [isFocusdropdown3, setIsFocusdropdown3] = useState(false);
  const [isFocusdropdown4, setIsFocusdropdown4] = useState(false);
  const [isFocusdropdown5, setIsFocusdropdown5] = useState(false);

  const [netInfo, setNetInfo] = useState('online');

  const RefNo1 = useRef();
  const RefNo2 = useRef();
  const RefNo3 = useRef();
  const RefNo4 = useRef();
  const RefNo5 = useRef();
  const RefNo6 = useRef();

  const brand = [{name: 'apple'}, {name: 'samsung'}, {name: 'mi'}];
  const model = [{name: 'iphone 11'}, {name: 'iphone 12'}, {name: 'iphone 13'}];
  const variant = [{name: '64GB'}, {name: '128GB'}, {name: '256GB'}];
  const appliancename = [{name: 'tablate'}, {name: 'mobile'}, {name: 'laptop'}];
  const colorrr = [
    {name: 'red'},
    {name: 'blue'},
    {name: 'white'},
    {name: 'midnight'},
  ];

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

  const Opencamera = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('user cancle image picker');
      } else if (response.error) {
        console.log('imagepicker error:', response.error);
      } else if (response.customButton) {
        console.log('user taped custom button: ', response.customButton);
      } else {
        console.log('fddggg', response.assets[0]);
        if (response.assets[0].fileSize < 20971520) {
          const source = {uri: 'data:image/jpeg;base64,' + response.base64};
          if (select == 'Invoice') {
            setUploadImageuri(response.assets[0].uri);
            setModalOption('');
          } else {
            setUploadImageuri2(response.assets[0].uri);
            setModalOption('');
          }
        } else {
          ErrorToast(Message.KImageSize);
        }
      }
    });
  };

  const Opengallary = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: false,
      maxWidth: 500,
      maxHeight: 500,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('user cancle image picker');
      } else if (response.error) {
        console.log('imagepicker error:', response.error);
      } else if (response.customButton) {
        console.log('user taped custom button: ', response.customButton);
      } else {
        console.log('kjnjjn', response.assets[0].uri);
        if (response.assets[0].type != 'image/gif') {
          if (response.assets[0].fileSize < 20971520) {
            const source = {uri: 'data:image/jpeg;base64,' + response.base64};
            if (select == 'Invoice') {
              setUploadImageuri(response.assets[0].uri);
              setModalOption('');
            } else {
              setUploadImageuri2(response.assets[0].uri);
              setModalOption('');
            }
          } else {
            ErrorToast(Message.KImageSize);
          }
        } else {
          ErrorToast(Message.KInvalidFormate);
        }
      }
    });
  };

  const onValidate = () => {
    if (netInfo == 'online') {
      var flag = true;
      var errorMsg = [];
      if (appliance == '') {
        flag = false;
        errorMsg.push(Message.applianceName);
      }
      if (brands == '') {
        flag = false;
        errorMsg.push(Message.brand);
      }
      if (models == '') {
        flag = false;
        errorMsg.push(Message.model);
      }
      if (coloor == '') {
        flag = false;
        errorMsg.push(Message.color);
      }
      if (variants == '') {
        flag = false;
        errorMsg.push(Message.variant);
      }
      // if (price == '') {
      //     flag = false;
      //     errorMsg.push(Message.price);
      // }
      if (serialNumber == '') {
        flag = false;
        errorMsg.push(Message.serialNumber);
      }
      // if (uploadImageUri == '') {
      //     flag = false;
      //     errorMsg.push(Message.productImage);
      // }
      // if (uploadImageUri2 == '') {
      //     flag = false;
      //     errorMsg.push(Message.invoiceImage);
      // }
      if (flag) {
        // onSubmitData();
        moveNext();
        // uploadProductImage();
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

  const moveNext = () => {
    navigation.navigate('AddLoan', {
      appliancename: appliance,
      brand: brands,
      model: models,
      color: coloor,
      variant: variants,
      //  price: price,
      serialNumber: serialNumber,
      invoiceImg: uploadImageUri2,
      productImg: uploadImageUri,
      id: route.params.id,
      mortgageId: route.params.mortgageId,
    });
  };

  // const uploadProductImage = async () => {
  //     setLoading(true);
  //     var data = new FormData();
  //     data.append('image', {
  //         uri: uploadImageUri,
  //         type: 'image/jpeg',
  //         name: 'profile.jpg',
  //     });
  //     // data.append('image',
  //     //     image,
  //     //     'profile.jpg',
  //     // );
  //     let response = await PostApiImage((Constant.uploadImage + 'aadhar'), data);
  //     console.log('response..', response)
  //     console.log('response..Image', response.data.image)
  //     if (response.status == 200) {
  //         setLoading(false);
  //         UploadInvoiceImage(response.data.image)
  //     }
  // }
  // const UploadInvoiceImage = async (product) => {
  //     setLoading(true);
  //     var data = new FormData();
  //     data.append('image', {
  //         uri: uploadImageUri2,
  //         type: 'image/jpeg',
  //         name: 'profile.jpg',
  //     });
  //     // data.append('image',
  //     //     image,
  //     //     'profile.jpg',
  //     // );
  //     let response = await PostApiImage((Constant.uploadImage + 'aadhar'), data);
  //     console.log('response..', response)
  //     console.log('response..Image', response.data.image)
  //     if (response.status == 200) {
  //         setLoading(false);
  //         // if (route.params.isEdit == false || route.params.AgainEdit == true) {
  //         //     onResubmit(response.data.image, Front);
  //         // } else {
  //         onSubmitData(response.data.image, product);
  //         // }
  //     } else {
  //         setLoading(false);
  //         ErrorToast(response.message)
  //     }
  // }

  // const onSubmitData = async (invoice, product) => {
  //     const data = {
  //         id: route.params.id,
  //         applianceName: appliance,
  //         brand: brands,
  //         model: models,
  //         color: coloor,
  //         variant: variants,
  //         price: price,
  //         serialNumber: "fgdfg",
  //         invoice: invoice,
  //         product: product,
  //     }

  //     const response = await PostApi(Constant.addLoan, data, false)
  //     console.log('response...', response)
  //     if (response.status == 200) {
  //         setLoading(false);
  //         navigation.navigate('AddLoan', {
  //             // isNext: true,
  //             id: route.params.id
  //         })
  //     } else {
  //         setLoading(false)
  //     }
  // }

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
          //   marginTop: 10,
          //   borderTopLeftRadius: 30,
          //   borderTopRightRadius: 30,
        }}>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, marginHorizontal: 20}}>
            {/* <Dropdown
                            placeholder="Appliance Name"
                            label="name"
                            style={{
                                borderColor: isFocusdropdown1
                                    ? Constant.primaryGreen
                                    : 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                height: 58,
                                marginTop: 20,
                                //  backgroundColor: '#ECECEC'
                            }}
                            // selectedTextStyle={{color: Constant.primaryGreen}}
                            maxHeight={200}
                            data={appliancename}
                            value={appliance}
                            labelField="name"
                            valueField="name"
                            autoScroll={true}
                            onFocus={() => setIsFocusdropdown1(true)}
                            onBlur={() => setIsFocusdropdown1(false)}
                            onChange={item => {
                                setAppliance(item.name);
                                //   setSelectedDogBreed(item.name);
                                setIsFocusdropdown1(false);
                            }}
                            renderRightIcon={() => (
                                <Image
                                    source={require('../../Assets/Icon/DropDown.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            )}
                        />
                        <Dropdown
                            placeholder="Brand"
                            label="Brand"
                            style={{
                                borderColor: isFocusdropdown2
                                    ? Constant.primaryGreen
                                    : 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                height: 58,
                                marginTop: 20,
                                //  backgroundColor: '#ECECEC'
                            }}
                            // selectedTextStyle={{color: Constant.primaryGreen}}
                            maxHeight={200}
                            data={brand}
                            value={brands}
                            labelField="name"
                            valueField="name"
                            autoScroll={true}
                            onFocus={() => setIsFocusdropdown2(true)}
                            onBlur={() => setIsFocusdropdown2(false)}
                            onChange={item => {
                                setBrands(item.name);
                                //   setSelectedDogBreed(item.name);
                                setIsFocusdropdown2(false);
                            }}
                            renderRightIcon={() => (
                                <Image
                                    source={require('../../Assets/Icon/DropDown.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            )}
                        />
                        <Dropdown
                            placeholder="Model"
                            label="Model"
                            style={{
                                borderColor: isFocusdropdown3
                                    ? Constant.primaryGreen
                                    : 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                height: 58,
                                marginTop: 20,
                                //  backgroundColor: '#ECECEC'
                            }}
                            // selectedTextStyle={{color: Constant.primaryGreen}}
                            maxHeight={200}
                            data={model}
                            value={models}
                            labelField="name"
                            valueField="name"
                            autoScroll={true}
                            onFocus={() => setIsFocusdropdown3(true)}
                            onBlur={() => setIsFocusdropdown3(false)}
                            onChange={item => {
                                setModels(item.name);
                                //   setSelectedDogBreed(item.name);
                                setIsFocusdropdown3(false);
                            }}
                            renderRightIcon={() => (
                                <Image
                                    source={require('../../Assets/Icon/DropDown.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            )}
                        />
                        <Dropdown
                            placeholder="Color"
                            label="Color"
                            style={{
                                borderColor: isFocusdropdown4
                                    ? Constant.primaryGreen
                                    : 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                height: 58,
                                marginTop: 20,
                                //  backgroundColor: '#ECECEC'
                            }}
                            // selectedTextStyle={{color: Constant.primaryGreen}}
                            maxHeight={200}
                            data={colorrr}
                            value={coloor}
                            labelField="name"
                            valueField="name"
                            autoScroll={true}
                            onFocus={() => setIsFocusdropdown4(true)}
                            onBlur={() => setIsFocusdropdown4(false)}
                            onChange={item => {
                                setColoor(item.name);
                                //   setSelectedDogBreed(item.name);
                                setIsFocusdropdown4(false);
                            }}
                            renderRightIcon={() => (
                                <Image
                                    source={require('../../Assets/Icon/DropDown.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            )}
                        />
                        <Dropdown
                            placeholder="Variant"
                            label="Variant *"
                            style={{
                                borderColor: isFocusdropdown5
                                    ? colors.blue
                                    : 'gray',
                                borderWidth: 1,
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                height: 58,
                                marginTop: 20,
                                //  backgroundColor: '#ECECEC'
                            }}
                            // selectedTextStyle={{color: Constant.primaryGreen}}
                            maxHeight={200}
                            data={variant}
                            value={variants}
                            labelField="name"
                            valueField="name"
                            autoScroll={true}
                            onFocus={() => setIsFocusdropdown5(true)}
                            onBlur={() => setIsFocusdropdown5(false)}
                            onChange={item => {
                                setVariants(item.name);
                                //   setSelectedDogBreed(item.name);
                                setIsFocusdropdown5(false);
                            }}
                            renderRightIcon={() => (
                                <Image
                                    source={require('../../Assets/Icon/DropDown.png')}
                                    style={{ height: 20, width: 20 }}
                                />
                            )}
                        /> */}
            {/* <TextInput
                            mode="outlined"
                            value={price}
                            theme={Constant.theme}
                            onChangeText={value => { setPrice(value); }}
                            label="Price *"
                            placeholder="Price"
                            returnKeyType="next"
                            keyboardType='numeric'
                            style={{ marginTop: 20 }}
                            ref={RefNo1}
                            onSubmitEditing={() => RefNo2.current.focus()}
                            blurOnSubmit={false}
                        /> */}
            <TextInput
              mode="outlined"
              value={appliance}
              theme={Constant.theme}
              onChangeText={value => {
                if (value.includes(' ')) {
                  setAppliance(value.trim());
                } else {
                  setAppliance(value.replace(/[^a-zA-Z 0-9 ]/g, ''));
                }
              }}
              label="Appliance Name *"
              placeholder="Appliance Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo1}
              returnKeyType="next"
              onSubmitEditing={() => RefNo2.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              mode="outlined"
              value={brands}
              theme={Constant.theme}
              onChangeText={value => {
                if (value.includes(' ')) {
                  setBrands(value.trim());
                } else {
                  setBrands(value.replace(/[^a-zA-Z 0-9 ]/g, ''));
                }
              }}
              label="Brand Name *"
              placeholder="Brand Name"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              returnKeyType="next"
              onSubmitEditing={() => RefNo3.current.focus()}
              ref={RefNo2}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={models}
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setModels(value.trim());
                } else {
                  setModels(value.replace(/[^a-zA-Z 0-9 ]/g, ''));
                }
              }}
              label="Model *"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              placeholder="Model"
              style={{marginTop: 20}}
              ref={RefNo3}
              returnKeyType="next"
              onSubmitEditing={() => RefNo4.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={coloor}
              theme={Constant.theme}
              onChangeText={value => {
                if (value.includes(' ')) {
                  setColoor(value.trim());
                } else {
                  setColoor(value.replace(/[^a-zA-Z 0-9 ]/g, ''));
                }
              }}
              label="Color *"
              placeholder="Color"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo4}
              returnKeyType="next"
              onSubmitEditing={() => RefNo5.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              mode="outlined"
              value={variants}
              autoCapitalize="characters"
              theme={Constant.theme}
              onChangeText={value => {
                if (value[0]?.includes(' ')) {
                  setVariants(value.trim());
                } else {
                  setVariants(value.replace(/[^a-zA-Z 0-9 ]/g, ''));
                }
              }}
              label="variant *"
              placeholder="variant"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              style={{marginTop: 20}}
              ref={RefNo5}
              returnKeyType="next"
              onSubmitEditing={() => RefNo6.current.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              mode="outlined"
              value={serialNumber.replace(/[^\w\s]/gi, '')}
              autoCapitalize="characters"
              theme={Constant.theme}
              onChangeText={value => {
                if (value.includes(' ')) {
                  setSerialNumber(value.trim());
                } else {
                  setSerialNumber(value.toUpperCase());
                }
              }}
              label="Serial Number *"
              placeholder="Serial Number"
              keyboardType={
                Platform.OS == 'ios' ? 'ascii-capable' : 'visible-password'
              }
              returnKeyType="done"
              style={{marginTop: 20}}
              ref={RefNo6}
              onSubmitEditing={() => Keyboard.dismiss()}
              blurOnSubmit={false}
            />
            {uploadImageUri == '' ? (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true), setSelect('Invoice');
                }}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  //  paddingVertical: 20,
                  height: 150,
                  borderRadius: 10,
                  borderColor: colors.blue,
                }}>
                <Upload height={90} width={90} />
                <Text>Upload Product Image</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  //  borderStyle: 'dashed',
                  borderWidth: 1,
                  marginTop: 20,
                  backgroundColor: '#EDFBFE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 150,
                  borderRadius: 10,
                  //   borderColor: colors.blue
                }}
                onPress={() => {
                  setIsModalVisible(true), setSelect('Invoice');
                }}>
                <Image
                  resizeMode="contain"
                  style={{height: 148, width: '100%'}}
                  source={{uri: uploadImageUri}}
                />
              </TouchableOpacity>
            )}
            {uploadImageUri2 == '' ? (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(true), setSelect('Product');
                }}
                style={{
                  borderStyle: 'dashed',
                  borderWidth: 2,
                  marginTop: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  //  paddingVertical: 20,
                  height: 150,
                  borderRadius: 10,
                  borderColor: colors.blue,
                }}>
                <Upload height={90} width={90} />
                <Text>Upload Invoice Image</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  //  borderStyle: 'dashed',
                  borderWidth: 1,
                  marginTop: 20,
                  backgroundColor: '#EDFBFE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 150,
                  borderRadius: 10,
                  //   borderColor: colors.blue
                }}
                onPress={() => {
                  setIsModalVisible(true), setSelect('Product');
                }}>
                <Image
                  resizeMode="contain"
                  style={{height: 148, width: '100%'}}
                  source={{uri: uploadImageUri2}}
                />
              </TouchableOpacity>
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
            <View style={{flex: 1}}>
              <CustomButton
                text="next"
                onPress={() => {
                  onValidate();
                  //   navigation.navigate('AddLoan')
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>

      <Modal
        isVisible={isModalVisible}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        transparent={true}
        backdropOpacity={0.5}
        onModalHide={() => {
          console.log('opetion', modalOption);
          if (modalOption == 1) {
            Opengallary();
          } else if (modalOption == 2) {
            Opencamera();
          }
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              paddingBottom: 10,
              borderRadius: 10,
            }}>
            {/* <View style={{ paddingVertical: 10, borderBottomWidth: 0.4 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14 }}>{userDetails.firstName} {userDetails.lastName}</Text>
                        </View> */}
            <TouchableOpacity
              onPress={() => {
                setModalOption(1);
                setIsModalVisible(false);
              }}
              style={{paddingVertical: 10, borderBottomWidth: 0.4}}>
              <Text
                style={{textAlign: 'center', fontSize: 18, color: colors.blue}}>
                Choose From Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalOption(2);
                setIsModalVisible(false);
              }}
              style={{paddingTop: 10}}>
              <Text
                style={{textAlign: 'center', fontSize: 18, color: colors.blue}}>
                Take From Camera
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalOption('');
              setIsModalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              paddingVertical: 10,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: 'black',
                fontWeight: 'bold',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
