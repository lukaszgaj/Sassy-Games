import {combineReducers} from 'redux';
import {authReducer} from './Reducers/Auth/authReducer';
import {infoReducer} from './Reducers/Info/infoReducer';
import {modalReducer} from './Reducers/Modals/modalReducer';
import {RootState} from './RootState';

export const rootReducer = combineReducers<RootState>({
   authState: authReducer,
   infoState: infoReducer,
   modalState: modalReducer,
});