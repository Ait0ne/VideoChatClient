import React from 'react';
import {CircularProgress} from '@material-ui/core'

import {FallbackContainer} from './fallback.styles';

const Fallback: React.FC = () => {
    return (
        <FallbackContainer>
            <CircularProgress color='primary' />
        </FallbackContainer>
    )
}

export default Fallback;