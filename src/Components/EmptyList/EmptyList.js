import React, {useRef} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

const EmptyList = () => {
  const ref = useRef();
  // React.useEffect(() => {
  //   if (ref.current) {
  //     ref.current?.play();
  //   }
  // }, [ref.current]);
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <LottieView
        source={require('../../Assets/Icon/no-properties-yet.json')}
        // ref={ref}
        autoPlay={true}
        loop={false}
        style={{height: '70%', width: '70%', alignItems: 'center'}}
      />
      {/* <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        No records to display
      </Text> */}
    </View>
  );
};

export default EmptyList;
