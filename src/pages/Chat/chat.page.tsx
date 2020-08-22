import React, {Fragment} from 'react';
import {useParams} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';


// import {IChannel} from '../ChatList/chatlist.page';
import Navigation from '../../components/Navigation/navigation.component';
import Chat from '../../components/Chat/chat.component';
import {StateProps} from '../../redux/root-reducer';

interface ChatPageProps {
    setOutGoingCall: React.Dispatch<React.SetStateAction<{
        channelID: string;
        connectedUserName: string;
    } | undefined>>
}

const ChatPage: React.FC<ReduxProps&ChatPageProps> = ({currentUser, setOutGoingCall}) => {
    const {channelId} = useParams()
    const connectedUserName = currentUser.channels.find((channel) => {
        return channel.channelID===channelId
      }).name

    return (
        <Fragment>
            <Navigation videoCallButton backNavigation pageTitle={connectedUserName} setOutGoingCall={setOutGoingCall} channelId={channelId}/>
            <Chat channelId={channelId} currentUser={currentUser}/>
        </Fragment>
    )

}

const mapStateToProps = (state:StateProps) => ({
    currentUser: state.user.currentUser
})

const connector = connect(mapStateToProps)

type ReduxProps = ConnectedProps<typeof connector>




export default connector(ChatPage);