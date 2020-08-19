import React, {useEffect, Dispatch, Fragment, useState} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import axios from 'axios';
import {connect, ConnectedProps} from 'react-redux';
import io from 'socket.io-client';

import Fallback from './components/Fallback/fallback.component';
import {IUser} from './redux/user/user.types';
import {setCurrentUser} from './redux/user/user.actions';
import {API_URL} from './config';
import {StateProps} from './redux/root-reducer';


import AuthPage from './pages/Auth/auth.page';
import ChatListPage from './pages/ChatList/chatlist.page';
import ChatPage from './pages/Chat/chat.page';
//

export const socket = io(API_URL)

const App: React.FC<ReduxProps> = ({setCurrentUser, currentUser}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
        axios.post(`${API_URL}login`, {} , {
            headers: {"Authorization": token}
        } )
        .then(response => {
            if (response.data.user) {
                setCurrentUser(response.data.user)
                setLoading(false)
            }
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
    return () => {
      socket.removeAllListeners()
    }
}, [setCurrentUser])

  return (
    <Fragment>
        {
          loading?
          <Fallback/>
          :
          <Switch>
            <Route exact path='/' render={() => currentUser? (<Redirect to='/chatlist'/>): (<AuthPage/>)}/>
            <Route exact path='/chatlist' render={() => !currentUser? (<Redirect to='/'/>): (<ChatListPage/>)}/>
            <Route 
            exact 
            path='/chat/:channelId' 
            component={ChatPage}/>
          </Switch>
        }
    </Fragment>
  );
}

const mapStateToProps = (state:StateProps) => ({
  currentUser: state.user.currentUser
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setCurrentUser: (user:IUser|null) => dispatch(setCurrentUser(user))
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(App);
