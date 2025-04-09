import { loadingfalse, lodingtrue, LOGIN, LOGOUT, OTP_SENT, OTP_SENT_CONF, SET_PRODUCT_LIST, USER_DETAILS, USER_LOGGED_OUT } from "../ReduxConstant"

const LoaderinitialState = {
    loading: false,
};
const initialState = false;


// export const authData = (data = [], action) => {
//     switch (action.type) {
//         case OTP_SENT_CONF:
//             console.warn("OTP SENT......", action)
//             return [action.data]
//         default:
//             return data
//     }
// }
// export const Loader = (state = LoaderinitialState, action) => {
//     switch (action.type) {
//         case loadingfalse:
//             console.warn("OTP SENT......", action)
//             return {
//                 ...state,
//                 loading: false
//             }
//         case lodingtrue:
//             console.warn("OTP SENT......", action)
//             return {
//                 ...state,
//                 loading: true
//             }
//         default:
//             return state
//     }
// }
// export const userDetails = (state = [], action) => {
//     switch (action.type) {
//         case USER_DETAILS:
//             console.warn("USER_DETAILS......", action)
//             return [action.data]
//         case USER_LOGGED_OUT:
//             console.warn("USER_LOGGED_OUT......", action)
//             return []
//         default:
//             return state
//     }
// }
// export const isLogin = (state = initialState, action) => {
//     switch (action.type) {
//         case LOGIN:
//             console.warn("LOGIN......", action)
//             return true
//         case LOGOUT:
//             console.warn("LOGOUT......", action)
//             return false

//         default:
//             return state
//     }
// }