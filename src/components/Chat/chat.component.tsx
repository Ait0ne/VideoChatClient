import React, {useState} from 'react';
import background from '../../assets/chat-background.jpg'
import moment from 'moment';


import {ChatContainer, CustomTextField, ChatInputContainer, ChatBodyContainer, CustomArrowUp, ChatMessageContainer} from './chat.styles';
import {IUser} from '../../redux/user/user.types';


interface ChatProps {
    messages: IMessage[],
    sendMessage: (text:string) => void,
    currentUser: IUser
}


export interface IMessage {
    userId: string
    text: string,
    createdAt: Date,
    _id?: string
}



const Chat:React.FC<ChatProps> = ({messages, sendMessage, currentUser}) => {

    const [messageText, setMessageText] = useState('')


    const handleChange =(event:React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.currentTarget.value)
    }

    const handleClick = () => {
        if (messageText.length>0) {
            sendMessage(messageText)
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
                    }).map((message, i) => <ChatMessage key={i} message={message}/>)
                }
            </ChatBodyContainer>
            <ChatInputContainer>
                <CustomTextField placeholder='...type your message here' value={messageText} onChange={handleChange} onKeyPress={handleKeyPress}/>
                <CustomArrowUp onClick={handleClick} color='primary'/>
            </ChatInputContainer>
        </ChatContainer>
    )
}

export default Chat;