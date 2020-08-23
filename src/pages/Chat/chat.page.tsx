import React, {Fragment, useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';


// import {IChannel} from '../ChatList/chatlist.page';
import Navigation from '../../components/Navigation/navigation.component';
import Chat, {IMessage} from '../../components/Chat/chat.component';
import {StateProps} from '../../redux/root-reducer';
import {socket} from '../../App';


interface ChatPageProps {
    setOutGoingCall: React.Dispatch<React.SetStateAction<{
        channelID: string;
        connectedUserName: string;
    } | undefined>>
}

const ChatPage: React.FC<ReduxProps&ChatPageProps> = ({currentUser, setOutGoingCall}) => {
    const {channelId} = useParams()
    const [connectedUserName, setConnectedUserName] = useState('')
    const [messages, setMessages] = useState<IMessage[]>([])
    const [newMessage, setNewMessage] = useState<{message:IMessage, channelID:string}|undefined>()

    useEffect(() => {
        const token = window.localStorage.getItem('token')
        socket.emit('joinChannel', token, channelId, currentUser._id )
    }, [channelId, currentUser])

    useEffect(() => {
        if (newMessage) {
            const m = newMessage.message
            setNewMessage(undefined)
            setMessages([...messages, m])
        }
    }, [newMessage, messages])

    useEffect(() => {
        socket.on('messages', (messages:IMessage[], name:string) => {
            setConnectedUserName(name)
            setMessages(messages)
        })
        socket.on('unauthorized', (err:any) => {
            console.log(err)
        })
        socket.on('newMessage', ({message, channelID}: {message: IMessage, channelID:string}) => {
            setNewMessage({message, channelID})
            socket.emit('messageRead', {channelID, userID: currentUser._id})
        })
        return () => {
            socket.removeListener('messages')
            socket.removeListener('newMessage')
            socket.removeListener('unauthorized')
            socket.emit('leave', currentUser._id)
        }
    }, [currentUser])

    const sendMessage = (text:string) => {
        const newMessage:IMessage = {
            userId: currentUser._id,
            text: text,
            createdAt: new Date()
        }    
        socket.emit('addMessage', {message: newMessage, channelId })
        setMessages([...messages, newMessage])
    }

    return (
        <Fragment>
            <Navigation videoCallButton backNavigation pageTitle={connectedUserName} setOutGoingCall={setOutGoingCall} channelId={channelId}/>
            <Chat currentUser={currentUser} messages={messages} sendMessage={sendMessage}/>
        </Fragment>
    )

}

const mapStateToProps = (state:StateProps) => ({
    currentUser: state.user.currentUser
})

const connector = connect(mapStateToProps)

type ReduxProps = ConnectedProps<typeof connector>




export default connector(ChatPage);