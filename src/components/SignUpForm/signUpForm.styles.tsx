import styled from 'styled-components';
import { FlexContainer} from '../../styles/styles';

interface SignUpFormContainerProps {
    height: number
}


export const SignUpFormContainer = styled(FlexContainer)<SignUpFormContainerProps>`
position: absolute;
bottom: 0;
height: ${props => props.height*0.45}px;
width: 100%;
>div {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: ${props => `calc(${0.45*props.height-15}px)`};
    background-color: white;
    border: 1px solid rgba(0,0,0,0.2);
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
>form {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    >input {
        border: 1px solid rgba(0,0,0,0.2);
        border-radius: 15px;
        width: 60%;
        height: 30px;
        margin-bottom: 10px;
        padding: 5px 15px;
        font-size: 0.9rem;
    }
}


`