import styled from 'styled-components';
import {FlexContainer} from '../../styles/styles';

export const AuthPageContainer = styled(FlexContainer)`
width: 100%;
height: 100%;
overflow: hidden;
position: relative;
`

export const AuthMainContainer = styled(FlexContainer)`
width: 100%;
height:100%;
justify-content: flex-end;
background-position: center;
background-size: cover;
padding: 60px 20px;
> span {
    margin-top: 10px;
    color: white;
    >span {
        color: #5b9b37;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
    }
}
`


