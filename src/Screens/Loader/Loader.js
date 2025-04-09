import ProgressLoader from 'rn-progress-loader';
import { useSelector, useDispatch } from 'react-redux'

export default function Loader() {

    const result = useSelector((state) => state);
    return (
        <ProgressLoader
            visible={result.Loader.loading}
            isModal={true}
            isHUD={true}
            hudColor={'#fff'}
            height={200}
            width={200}
            color={'#000'}
        />
    )
}