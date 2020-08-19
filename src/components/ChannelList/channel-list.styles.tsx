import styled from 'styled-components';
import {Badge, List,ListItemText} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

export const ChannelListContainer = styled.div`
width:100%;
height: calc(100vh - 56px);
`

export const CustomBadge = styled(Badge)`
position:absolute!important;
right: 30%;
`

export const CustomList = styled(List)`
padding: 0px!important;
cursor: pointer;
`
export const CustomListItemText = styled(ListItemText)`
border-bottom: solid 1px rgba(0,0,0,0.1);
padding-right: 5px;
> p {
    font-size: 0.8rem;
} 
`

export const CustomAccountCircle = styled(AccountCircle)`
font-size: 55px!important;
`
