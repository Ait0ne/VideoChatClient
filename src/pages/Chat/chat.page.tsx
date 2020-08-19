import React, {Fragment} from 'react';
import {useParams} from 'react-router-dom';

// import {IChannel} from '../ChatList/chatlist.page';
import Navigation from '../../components/Navigation/navigation.component';
import Chat from '../../components/Chat/chat.component';




const ChatPage: React.FC = () => {
    const {channelId} = useParams()


    return (
        <Fragment>
            <Navigation videoCallButton backNavigation/>
            <Chat channelId={channelId}/>
        </Fragment>
    )

}




export default ChatPage;