import React, {useRef, useEffect} from 'react';

import {VideoChatContainer} from './video-chat.styles';
import {socket} from '../../App';


interface VideoChatProps {
    toggleVideoChat: () => void,
    userId: string,
    channelID: string,
    incomingCall?: {
        incomingOffer: RTCSessionDescriptionInit,
        incomingChannelID: string
    }
} 
const {RTCPeerConnection, RTCSessionDescription} = window
const peerConnection = new RTCPeerConnection({iceServers: [{urls:'stun:stun.l.google.com:19302'}]})

const VideoChat: React.FC<VideoChatProps> = ({toggleVideoChat, userId, channelID, incomingCall}) => {
    const localVideo = useRef<HTMLVideoElement>(null)
    const remoteVideo = useRef<HTMLVideoElement>(null)
    
    
    useEffect(() => {
        if (incomingCall) {
            const onIncomingCall = async () => {
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(incomingCall.incomingOffer)
                );
                const answer = await peerConnection.createAnswer()
                await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
                socket.emit("makeAnswer", answer, channelID)
            }
            onIncomingCall()
            console.log('offer',incomingCall.incomingOffer)
        } else {
            const callUser = async (channelId:string) => {
                const offer = await peerConnection.createOffer()
                await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
                socket.emit("callUser", offer, channelID)
            }
            callUser(channelID)

            socket.on('answerMade', async (answer:RTCSessionDescriptionInit, channelID:string)=> {
                console.log('answer', answer)
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            })
        }

        return () => {
            socket.removeListener('answerMade')
        }
    }, [incomingCall, channelID])
    
    
    useEffect(() => {
        peerConnection.ontrack = (event:RTCTrackEvent) => {
            console.log('hefsddf', event)
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = event.streams[0]
            }
        }
        
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(stream => {
            console.log('stream', stream)
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }
            stream.getTracks().forEach(track => {
                console.log('track',track)
                peerConnection.addTrack(track, stream)
            })
        })
        .catch(err => console.log(err))
    }, [])

    return (
        <VideoChatContainer>
            <video ref={remoteVideo} autoPlay></video>
            <video muted ref={localVideo} autoPlay></video>
        </VideoChatContainer>
    )
}

export default VideoChat;
