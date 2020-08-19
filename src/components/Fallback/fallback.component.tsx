import React from 'react';
import {FlexContainer} from '../../styles/styles';

const Fallback: React.FC = () => {
    return (
        <FlexContainer>
            <span>...Loading</span>
        </FlexContainer>
    )
}

export default Fallback;