import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import colors from '../../CommonFiles/Colors';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import LeftHeaderIcon from '../../Components/LeftHeader/LeftHeaderIcon';

export default function TermsAnsConditionDetails({navigation, route}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      // headerShadowVisible: false,
      headerStyle: {
        backgroundColor: colors.primaryBlueBackground,
      },
      // backgroundColor: 'pink',
      //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
      headerLeft: () => <LeftHeaderIcon navigation={navigation} />,
    });
  }, []);

  return (
    <SafeAreaView
      style={{backgroundColor: colors.primaryBlueBackground, flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primaryBlueBackground}
      />
      {/* <LinearGradient colors={['#FFFFFF', '#EFFBFF']} style={{flex: 1}}> */}
      <View style={{marginTop: 20, marginHorizontal: 20, flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>Last Update : 01-08-2020</Text>
        <Text style={{marginTop: 10}}>
          Please read these terms & condition, carefully before using our
          service.
        </Text>
        <Text style={{fontWeight: 'bold', marginTop: 20}}>
          1. Condition Of Use
        </Text>
        <Text style={{marginTop: 5}}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit.
        </Text>
        <Text style={{fontWeight: 'bold', marginTop: 10}}>
          2. Condition Of Use
        </Text>
        <Text style={{marginTop: 5}}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit.
        </Text>
      </View>
      {route.params?.data == true && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginHorizontal: 20,
          }}>
          <View style={{flex: 1, marginRight: 20}}>
            <CustomBorderButton
              text="Cancel"
              onPress={() => {
                navigation.navigate('TermsAndCondition', {
                  isTerms: false,
                  deviceToken: route.params.deviceToken,
                });
              }}
            />
          </View>
          <View style={{flex: 1}}>
            <CustomButton
              text="Accept"
              onPress={() => {
                navigation.navigate('TermsAndCondition', {
                  isTerms: true,
                  deviceToken: route.params.deviceToken,
                });
              }}
            />
          </View>
        </View>
      )}
      {/* </LinearGradient> */}

      <Modal
        isVisible={isModalVisible}
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
              paddingTop: 30,
              paddingBottom: 10,
            }}>
            <View
              style={{
                backgroundColor: '#F6F9FF',
                shadowColor: 'gray',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 20,
              }}>
              <View style={{margin: 20, alignItems: 'center'}}>
                <Image
                  source={require('../../Assets/Image/Congratulation.png')}
                  style={{width: 200, height: 150}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'black',
                    marginTop: 20,
                  }}>
                  Congratulation
                </Text>
                <Text style={{textAlign: 'center', marginTop: 20}}>
                  By Selecting "I Agree" below, I have Review and agree to the
                  Terms and Condition and the Privacy Policy
                </Text>
                <View style={{marginTop: 20}}>
                  <CustomButton
                    text="Back To Home"
                    onPress={() => {
                      navigation.navigate('AppNavigation'),
                        setIsModalVisible(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
