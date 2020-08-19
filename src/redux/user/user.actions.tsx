import {SET_CURRENT_USER, IUser, ISetUserAction} from './user.types';

export const setCurrentUser = (user:IUser|null):ISetUserAction => ({
    type: SET_CURRENT_USER,
    payload: user  
}) 