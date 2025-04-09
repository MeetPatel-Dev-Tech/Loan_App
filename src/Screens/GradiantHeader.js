import { Image, StyleSheet, View, Text } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../CommonFiles/Colors';


const GradientHeader = props => {
    console.log('props', props)
    return (
        <LinearGradient colors={['#009FFD', 'black']}
            style={[StyleSheet.absoluteFill, { height: 80 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <View style={{ backgroundColor: '#eee' }}>

            </View>
        </LinearGradient>
    )
};

export default GradientHeader;