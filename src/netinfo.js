
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
const [netInfo, setNetInfo] = useState('');


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
                //  ErrorToast(Message.KCheckInternetConnection);
                setNetInfo('offline');
            }
        });
    }, [])
)

// Theme.MaterialComponents.Light.NoActionBar

