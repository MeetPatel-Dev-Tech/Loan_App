// import {createStore} from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';
import { authData } from './Reducer/ActionReducer';
import rootReducer from './RootReducer';
import rootSaga from './Saga';

// const store = createStore(rootReducer);
const sagaMiddleware = createSagaMiddleware();
const Store = configureStore({
    reducer: rootReducer,
    middleware: () => [sagaMiddleware]
});

sagaMiddleware.run(rootSaga);

export default Store;