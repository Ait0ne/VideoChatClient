import React, {Fragment, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';
import {socket} from '../../App';

// import {IChannel} from '../ChatList/chatlist.page';
import Navigation from '../../components/Navigation/navigation.component';
import Chat from '../../components/Chat/chat.component';
import VideoChat from '../../components/VideoChat/video-chat.component';
import {StateProps} from '../../redux/root-reducer';


const ChatPage: React.FC<ReduxProps> = ({currentUser}) => {
    const {channelId} = useParams()
    const [videoChatShown, setVideoChatShown] = useState(false)
    const [incomingCall, setIncomingCall] = useState<{incomingOffer:RTCSessionDescriptionInit, incomingChannelID:string} |undefined>()

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

    const toggleVideoChat = () => {
        setVideoChatShown(!videoChatShown)
    }



    

    return (
        <Fragment>
            <Navigation videoCallButton backNavigation toggleVideoChat={toggleVideoChat}/>
            <Chat channelId={channelId} currentUser={currentUser}/>
            {
                videoChatShown?
                <VideoChat 
                toggleVideoChat={toggleVideoChat} 
                channelID={channelId} userId={currentUser._id} 
                incomingCall={incomingCall} 
                setIncomingCall={setIncomingCall}
                connectedUserName={currentUser.channels.find((channel) => {
                    return channel.channelID===channelId
                }).name}
                />
                : null
            }
        </Fragment>
    )

}

const mapStateToProps = (state:StateProps) => ({
    currentUser: state.user.currentUser
})

const connector = connect(mapStateToProps)

type ReduxProps = ConnectedProps<typeof connector>




export default connector(ChatPage);