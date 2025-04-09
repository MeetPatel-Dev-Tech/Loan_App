import { combineReducers } from 'redux'
import { authData, Loader, userDetails, isLogin, isInternet } from './Reducer/ActionReducer'
export default combineReducers({
    authData, Loader, userDetails, isLogin, isInternet
})