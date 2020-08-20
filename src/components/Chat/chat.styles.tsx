import styled from 'styled-components';
import {ArrowUpward} from '@material-ui/icons';

import {FlexContainer} from '../../styles/styles';


export const ChatContainer = styled.div`
width:100%;
height: calc(100% - 59px);
background-size: cover;
background-position: center;
`

export const ChatInputContainer = styled(FlexContainer)`
flex-direction: row;
height: 60px;
/* position: fixed;
bottom:0; */
width: 100%;
`
export const ChatBodyContainer = styled(FlexContainer)`
height: calc(100% - 60px);
overflow-y:scroll;
justify-content:flex-start;
flex-direction: column-reverse;
padding:5px;
`

export const CustomArrowUp = styled(ArrowUpward)`
position: absolute;
bottom: 30px;
right: 10px;
font-weight: bold;
`


// export const CustomTextField = styled(TextField)`
// border: none;
// &:after {
//     border-bottom: none;
// }
// `

export const CustomTextField = styled.textarea`
width: 100%;
height: 100%;
border: none;
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
padding: 10px 40px 10px 20px;
font-size: 1rem;
`
interface ChatMessageProps {
    userMessage: boolean
}

export const ChatMessageContainer = styled(FlexContainer)<ChatMessageProps>`
    display:block;
    /* flex-direction: row;
    flex-wrap: wrap; */
    min-width: 30%;
    max-width: 80%;
    padding: 3px 10px;
    align-self: ${props => props.userMessage? 'flex-end': 'flex-start'};
    background-color: ${props => props.userMessage? '#DCF8C6': 'white'};
    margin: 5px;
    justify-content: space-between;
    border-radius: 10px;
    position:relative;
    >span {
        font-size: 0.6rem;
        color: rgba(0,0,0,0.7);
        float: right;       
    }
    >p {
        display: flex;
        flex-wrap: wrap;
        padding: 2px;
        word-break: break-all;
        margin: 0;
        width:100%;
    }
`