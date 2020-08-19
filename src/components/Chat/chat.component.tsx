import React, {useState, useEffect} from 'react';
import background from '../../assets/chat-background.jpg'
import moment from 'moment';
import {connect, ConnectedProps} from 'react-redux';

import {StateProps} from '../../redux/root-reducer';
import {socket} from '../../App';
import {ChatContainer, CustomTextField, ChatInputContainer, ChatBodyContainer, CustomArrowUp, ChatMessageContainer} from './chat.styles';



interface ChatProps {
    channelId:string
}


export interface IMessage {
    userId: string
    text: string,
    createdAt: Date,
    _id?: string
}



const Chat:React.FC<ChatProps&ReduxProps> = ({channelId, currentUser}) => {

    const [messageText, setMessageText] = useState('')
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
        socket.on('messages', (messages:IMessage[]) => {
            console.log(messages)
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

    const handleChange =(event:React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.currentTarget.value)
    }

    const handleClick = () => {
        if (messageText.length>0) {
            const newMessage:IMessage = {
                userId: currentUser._id,
                text: messageText,
                createdAt: new Date()
            }    
            socket.emit('addMessage', {message: newMessage, channelId })
            setMessages([...messages, newMessage])
            setMessageText('')
        }
    }



    const ChatMessage = ({message}: {message:IMessage}) => {
        return (
            <ChatMessageContainer userMessage={message.userId===currentUser._id}>
                <p>{message.text}</p>
                <span>{moment(message.createdAt).format('HH:mm')}</span>
            </ChatMessageContainer>
        )
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key==='Enter') {
            event.preventDefault()
            handleClick()
        }
    }

    return (
        <ChatContainer style={{backgroundImage:`url(${background})`}}>
            <ChatBodyContainer>
                {
                    messages.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    }).map((message) => <ChatMessage key={message._id} message={message}/>)
                }
            </ChatBodyContainer>
            <ChatInputContainer>
                <CustomTextField placeholder='...type your message here' value={messageText} onChange={handleChange} onKeyPress={handleKeyPress}/>
                <CustomArrowUp onClick={handleClick} color='primary'/>
            </ChatInputContainer>
        </ChatContainer>
    )
}

const mapStateToProps = (state:StateProps) => ({
    currentUser: state.user.currentUser
})

const connector = connect(mapStateToProps)

type ReduxProps = ConnectedProps<typeof connector>



export default connector(Chat);