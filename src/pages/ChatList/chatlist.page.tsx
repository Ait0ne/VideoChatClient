import React, {useState,  useEffect, Dispatch} from 'react';
import {connect, ConnectedProps } from 'react-redux';

import {
    ChatListContainer,
} from './chatlist.styles';

import {IUser} from '../../redux/user/user.types';
import {setCurrentUser} from '../../redux/user/user.actions';
import {IMessage} from '../../components/Chat/chat.component';
import {socket} from '../../App';
import AddChannelDialog from '../../components/AddChannelDialog/addChannelDialog.component';
import {StateProps} from '../../redux/root-reducer';
import ChannelList from '../../components/ChannelList/channel-list.component';
import Navigation from '../../components/Navigation/navigation.component';



export interface IChannel {
    _id: string,
    lastMessage: {
        userId: string,
        text: string,
        createdAt: Date
    },
    newMessages: any,
    name: string
}




const ChatListPage: React.FC<ReduxProps> = ({currentUser, setCurrentUser}) => {
    const [channels, setChannels] = useState<IChannel[]>([])
    const [newMessage, setNewMessage] = useState<{message:IMessage, channelID:string}|undefined>()
    const [newChannel, setNewChannel] = useState<IChannel | undefined>()

    
        
    
    useEffect(() => {
        const token = window.localStorage.getItem('token')
        socket.emit('join', token)

        socket.on('newMessage', ({message, channelID}: {message: IMessage, channelID:string}) => {
            console.log('newMessage')
            setNewMessage({message, channelID})
        })
    
    
        socket.on('channels', (channels:any[])=> {
            console.log(channels)
            setChannels(channels)
        })
    
        socket.on('newChannel', (channel: IChannel, user: IUser) => {
            setCurrentUser(user)
            socket.emit('joinNewChannel', channel._id)
            setNewChannel(channel)
        })



        return () => {
            socket.removeListener('newMessage')
            socket.removeListener('channels')
            socket.removeListener('newChannel')
            socket.emit('leave', currentUser._id)
            
        }
    }, [currentUser, setCurrentUser])


    useEffect(() => {
        if (newChannel) {
            const c:IChannel = newChannel
            setNewChannel(undefined)
            setChannels([...channels, c])
        }
    }, [newChannel, channels])

    useEffect(() => {
        if (newMessage) {
            const newChannels = [...channels]
            const newMessageChannelIndex = newChannels.findIndex((channel) => {
                console.log(channel._id === newMessage.channelID)
                return channel._id === newMessage.channelID
            })
            newChannels[newMessageChannelIndex].lastMessage = newMessage.message
            if (newChannels[newMessageChannelIndex].newMessages) {
                newChannels[newMessageChannelIndex].newMessages[currentUser._id] = true 
            } else {
                const newMessages = new Map()
                newMessages.set(currentUser._id, true)
                newChannels[newMessageChannelIndex].newMessages = newMessages
            }
            setChannels(newChannels)
            setNewMessage(undefined)
        }
    }, [newMessage, channels, currentUser])
    
    return (
        <ChatListContainer>
            <Navigation />
            {
                console.log(channels)
            }
            <AddChannelDialog />
            <ChannelList channels={channels.filter((channel) => channel.lastMessage)} userID={currentUser._id}/>
        </ChatListContainer>
    )
}

const mapStateToProps = (state:StateProps) => ({
    currentUser: state.user.currentUser
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setCurrentUser: (user:IUser|null) => dispatch(setCurrentUser(user))
    })


const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>


export default connector(ChatListPage);