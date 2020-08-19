export const SET_CURRENT_USER = 'SET_CURRENT_USER'

export interface IUser  {
    _id: any,
    email: string,
    channels: any[]
}

export interface ISetUserAction {
    type: typeof SET_CURRENT_USER,
    payload: IUser | null
}

export interface UserStateProps {
    currentUser: IUser
}