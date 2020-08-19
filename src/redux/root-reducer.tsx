import { combineReducers } from 'redux';
import userReducer from './user/user.reducer';
import {UserStateProps} from './user/user.types';

export interface StateProps {
    user: UserStateProps
}



const rootReducer = combineReducers({
    user: userReducer
});

export default rootReducer;