import React, { Fragment, useState, useEffect } from 'react';
import {Dialog, DialogContent, DialogActions, DialogTitle, TextField, Button} from '@material-ui/core';
import {Chat} from '@material-ui/icons';
import {useHistory} from 'react-router-dom';

import {socket} from '../../App';


import { CustomFab } from './addChannelDialog.styles';



const AddChannelDialog: React.FC = () => {
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
        socket.on('channelCreated', (channelID:string)=> {
            console.log(channelID)
            history.push(`/chat/${channelID}`)
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
    }, [history])


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

export default AddChannelDialog;