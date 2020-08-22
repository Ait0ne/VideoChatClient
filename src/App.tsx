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
import VideoChat from './components/VideoChat/video-chat.component';

import AuthPage from './pages/Auth/auth.page';
import ChatListPage from './pages/ChatList/chatlist.page';
import ChatPage from './pages/Chat/chat.page';
//

export const socket = io(API_URL)

const App: React.FC<ReduxProps> = ({setCurrentUser, currentUser}) => {
  const [loading, setLoading] = useState(true)

  const [videoChatShown, setVideoChatShown] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{incomingOffer:RTCSessionDescriptionInit, incomingChannelID:string} |undefined>()
  const [outgoingCall, setOutGoingCall] = useState<{channelID: string, connectedUserName:string}|undefined>()


  useEffect(() => {
      socket.on('incomingCall', (offer: RTCSessionDescriptionInit, ID:string)=>
          {
              console.log('incoming')
              setIncomingCall({incomingOffer: offer, incomingChannelID: ID})
          }
      )
      return () => {
          socket.removeListener('incomingCall')
      }
  }, [])

  useEffect(() => {
      if (incomingCall) {
          setVideoChatShown(true)
      }
  }, [incomingCall])

  useEffect(()=> {
    if (outgoingCall) {
      setVideoChatShown(true)
    }
  }, [outgoingCall])

  const toggleVideoChat = () => {
      setVideoChatShown(!videoChatShown)
  }



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
            render={() => !currentUser? (<Redirect to='/'/>): (<ChatPage setOutGoingCall={setOutGoingCall}/>)}/>
          </Switch>
        }
        {
          videoChatShown&&currentUser?
          <VideoChat  
          toggleVideoChat={toggleVideoChat} 
          setIncomingCall={setIncomingCall} 
          incomingCall={incomingCall} 
          userId={currentUser._id}
          channelID={incomingCall? incomingCall.incomingChannelID : outgoingCall? outgoingCall.channelID : ''}
          setOutGoingCall={setOutGoingCall}
          connectedUserName={
            incomingCall? 
            currentUser.channels.find((channel) => {
              return channel.channelID===incomingCall.incomingChannelID
            }).name
            :
            outgoingCall?.connectedUserName
          }
          />
          : null
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
