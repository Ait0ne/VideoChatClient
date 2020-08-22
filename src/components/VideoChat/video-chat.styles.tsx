import styled from 'styled-components';
import {Avatar} from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle';

import {FlexContainer} from '../../styles/styles';

export const VideoChatContainer = styled(FlexContainer)`
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
z-index: 1200;
justify-content: flex-start;
background-color: #455A64;
>video {
    object-fit:cover;
    &:nth-of-type(1) {
        width:100%;
        height: 100%;
    }
    &:nth-of-type(2) {
        position: absolute;
        top: 20px;
        right: 20px;
        height: 20%;
        width: 20%; 
    }
}

`

export const CallHeaderContainer = styled(FlexContainer)`
align-items: flex-start;
margin: 60px 0px;
padding: 10px 25px;
font-size: 1.2rem;
width: 100%;
height: 20vh;
color: white;
>span:nth-of-type(1) {
    font-size: 1.8rem;
}
`

export const ConnectedUserAvatar = styled(Avatar)`
width: 200px!important;
height: 200px!important;
`

export const CustomAccountCircle = styled(AccountCircle)`
font-size: 240px!important;
`

export const VideoChatActionButtons = styled(FlexContainer)`
margin-top: 50px;
flex-direction: row;
justify-content: space-around;
width: 100%;
position: absolute;
z-index: 1;
bottom: 10vh;
>button {
    height: 60px;
    width: 60px;
    border-radius: 50%;
    color: white;
    border: none;
    &:nth-of-type(1) {
        background-color: red;
    }
    &:nth-of-type(2) {
        background-color: #5b9b37;
    }
    
}
`