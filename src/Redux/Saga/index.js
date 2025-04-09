import { all } from 'redux-saga/effects';
import AppSaga from './AppSaga';
import AuthSaga from './AuthSaga';

export default function* rootSaga() {
    yield all([AuthSaga(), AppSaga()]);
}