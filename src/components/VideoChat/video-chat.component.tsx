import React from 'react';

import {VideoChatContainer} from './video-chat.styles';

const VideoChat: React.FC = () => {
    return (
        <VideoChatContainer>
            <video autoPlay></video>
        </VideoChatContainer>
    )
}

export default VideoChat;
