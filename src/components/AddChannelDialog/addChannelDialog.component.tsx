import React, { Fragment, useState, useEffect, Dispatch } from 'react';
import {Dialog, DialogContent, DialogActions, DialogTitle, TextField, Button} from '@material-ui/core';
import {Chat} from '@material-ui/icons';
import {useHistory} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';

import {StateProps} from '../../redux/root-reducer';
import {setCurrentUser} from '../../redux/user/user.actions';
import {IUser} from '../../redux/user/user.types';
import {IChannel} from '../../pages/ChatList/chatlist.page'


import {socket} from '../../App';


import { CustomFab } from './addChannelDialog.styles';



const AddChannelDialog: React.FC<ReduxProps> = ({currentUser, setCurrentUser}) => {
    const [addChannelDialogShown, setAddChannelDialogShown] = useState(false)
    const [userName, setUserName] = useState('')
    const history = useHistory()

    const toggleChannelDialog = () => {
        setAddChannelDialogShown(!addChannelDialogShown)
    }

    const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserName(event.currentTarget.value)
    }

    useEffect(()=> {
        socket.on('channelCreated', (channel: IChannel, user:IUser)=> {
            setCurrentUser(user)
            setTimeout(() => {
                history.push(`/chat/${channel._id}`)
            }, 50);
        })
        socket.on('channelAlreadyExists', (channelID:string) => {
            history.push(`/chat/${channelID}`)
        })
        socket.on('channelCreationFailed', () => {
            alert('User not found')
        })
        return () => {
            socket.removeListener('channelCreated')
            socket.removeListener('channelCreationFailed')
            socket.removeListener('channelAlreadyExists')
        }
    }, [history, currentUser, setCurrentUser])


    const handleClick = () => {
        if (userName==='') {
            alert("Username field can't be empty")
        } else {
            socket.emit('createChannel', {username: userName})
        }
    }

    return (
        <Fragment>
            <CustomFab onClick={toggleChannelDialog} color='primary'>
                <Chat fontSize='large'/>
            </CustomFab>
            <Dialog
            open={addChannelDialogShown}
            onClose={toggleChannelDialog}
            >
                <DialogTitle>
                    Add Contact
                </DialogTitle>
                <DialogContent>
                    <TextField onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClick} color='primary'>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
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





export default connector(AddChannelDialog);