import React from 'react';
import {useHistory} from 'react-router-dom';
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    Typography
}
from '@material-ui/core';
import moment from 'moment';

import {ChannelListContainer, CustomBadge, CustomList, CustomListItemText, CustomAccountCircle} from './channel-list.styles';
import {IChannel} from '../../pages/ChatList/chatlist.page';

export interface ChannelListProps{
    channels: IChannel[],
    userID: string
}

const ChannelList:React.FC<ChannelListProps> = ({channels, userID}) => {
    const history = useHistory()

    const handleJoinChannel = (channelID:string) => {
        history.push(`/chat/${channelID}`)
    }
    
    const ChannelItem = ({channel}: {channel: IChannel}) => {
        const isThereANewMessage = channel.newMessages instanceof Map ? channel.newMessages.get(userID): channel.newMessages[userID]
        return (
            <ListItem onClick={() => handleJoinChannel(channel._id)} className={isThereANewMessage? 'new-message-list-item' : ''}>
                <ListItemAvatar>
                    <Avatar>
                        <CustomAccountCircle/>
                    </Avatar>
                </ListItemAvatar>
                <CustomListItemText
                primary={channel.name}
                secondary={channel.lastMessage.text}
                />
                {
                    isThereANewMessage?
                    <CustomBadge color='primary' variant='dot'/>
                    :null
                }
                <ListItemSecondaryAction>
                    <Typography>
                        {moment(channel.lastMessage.createdAt).local().format('D/M/YY')}
                    </Typography>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
    
    return (
        <ChannelListContainer>
            <CustomList>
            {
                channels.sort((a, b) => {
                    return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
                }).map((channel, i) => {
                    if (channel.lastMessage) {
                        return <ChannelItem key={i} channel={channel} />
                    } return null
                })
            }
            </CustomList>
        </ChannelListContainer>
    )
}



export default ChannelList;