import styled from 'styled-components';
import {motion} from 'framer-motion';

interface FlexProps {
    direction?: string
}

export const FlexContainer = styled(motion.div)<FlexProps>`
display: flex;
flex-direction: ${props => props.direction? props.direction: 'column'};
align-items: center;
justify-content: center;
`

interface CustomButtonProps {
    color?: string;
    shadow?: boolean;
    size?: string;
}

export const CustomButton = styled(motion.button)<CustomButtonProps>`
width: ${props => props.size === 'lg' ? '220px' : '160px'};
height: ${props => props.size === 'lg' ? '60px' : '40px'};
border: none;
border-radius: 25px;
color: #5b9b37;
font-size: 1.1rem;
font-weight: bold;
text-transform: uppercase;
background-color: ${props => props.color? props.color: 'white'};
box-shadow: ${props => props.shadow ? `0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)` : 'none'}; 
&:focus {
    outline:none;
}
`