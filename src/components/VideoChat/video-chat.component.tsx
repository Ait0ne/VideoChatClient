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
const peerConnection = new RTCPeerConnection()

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
        } else {
            const callUser = async (channelId:string) => {
                const offer = await peerConnection.createOffer()
                await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
                socket.emit("callUser", offer, channelID)
            }
            callUser(channelID)

            socket.on('answerMade', async (answer:RTCSessionDescriptionInit, channelID:string)=> {
                console.log('answer')
                await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
            })
        }

        return () => {
            socket.removeListener('answerMade')
        }
    }, [incomingCall, channelID])



    useEffect(() => {
        // navigator.mediaDevices.getUserMedia({ video: true, audio: true}, stream => {
        //     if (localVideo.current) {
        //         localVideo.current.srcObject = stream;
        //     }
        //     stream.getTracks().forEach(track => peerConnection.addTrack(track, stream))
        // },  error => {
        //     console.log(error)
        // })
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(stream => {
            console.log('stream', stream)
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })
        })
        .catch(err => console.log(err))
        peerConnection.ontrack = ({streams: [stream]}) => {
            console.log(stream)
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = stream
            }
        }
    }, [])

    return (
        <VideoChatContainer>
            <video ref={remoteVideo} autoPlay></video>
            <video muted ref={localVideo} autoPlay></video>
        </VideoChatContainer>
    )
}

export default VideoChat;
