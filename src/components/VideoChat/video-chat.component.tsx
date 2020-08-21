import React, {useRef, useEffect, useState, Fragment, useCallback} from 'react';

import {VideoChatContainer, CallHeaderContainer, ConnectedUserAvatar, CustomAccountCircle, VideoChatActionButtons} from './video-chat.styles';
import {socket} from '../../App';
import {Call, CallEnd} from '@material-ui/icons';


interface VideoChatProps {
    toggleVideoChat: () => void,
    userId: string,
    channelID: string,
    incomingCall?: {
        incomingOffer: RTCSessionDescriptionInit,
        incomingChannelID: string
    },
    connectedUserName: string;
} 

const {RTCPeerConnection, RTCSessionDescription} = window
let peerConnection:RTCPeerConnection|null = new RTCPeerConnection({iceServers: [{urls:'stun:stun.l.google.com:19302'},  {
    urls: 'turn:relay.backups.cz',
    credential: 'webrtc',
    username: 'webrtc'
},]})



const VideoChat: React.FC<VideoChatProps> = ({toggleVideoChat, userId, channelID, incomingCall, connectedUserName}) => {
    const localVideo = useRef<HTMLVideoElement>(null)
    const remoteVideo = useRef<HTMLVideoElement>(null)
    const [callActive, setCallActive] = useState(false)

    const hangUp = useCallback(() => {
        peerConnection?.close()
        navigator.mediaDevices.getUserMedia({video: true, audio:true})
        .then(stream => {
            socket.emit('hangup', channelID)
            stream.getTracks().forEach(track => {
                track.stop();
            })
        })
        peerConnection = null
    }, [channelID])


    useEffect(() => {
        if (!incomingCall&&peerConnection) {
            
            const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate) {
                    socket.emit('newIceCandidate', event.candidate, channelID)
                }
            }
            peerConnection.ontrack = (event:RTCTrackEvent) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = event.streams[0]
                }
            }
            
            navigator.mediaDevices.getUserMedia({video:true, audio:true})
            .then(stream => {
                console.log('call')
                if (localVideo.current) {
                    localVideo.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => {
                    console.log('track',track)
                    peerConnection?.addTrack(track, stream)
                })
                const callUser = async () => {
                    if (peerConnection) {
                        const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
                        await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
                        socket.emit("callUser", offer, channelID)

                    }
                }
                callUser()
    
                socket.on('answerMade', async (answer:RTCSessionDescriptionInit, channelID:string)=> {
                    if (peerConnection) {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                        peerConnection.onicecandidate = handleIceCandidate
                        setCallActive(true)
                    }
                })
                socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
                    console.log('newicecandidate')
                    peerConnection?.addIceCandidate(candidate)
                })
            })

            .catch(err => console.log(err))
        }

        socket.on('initiatedHangUp', () => {
            peerConnection?.close()
            navigator.mediaDevices.getUserMedia({video: true, audio:true})
            .then(stream => {
                stream.getTracks().forEach(track => {
                    track.stop();
                })
            })
            peerConnection = null
            toggleVideoChat()
        })

        return () => {
            socket.removeListener('answerMade')
            socket.removeListener('receivedNewIceCandidate')
            socket.removeListener('initiatedHangUp')
            hangUp()
        }
    }, [incomingCall, channelID, userId, hangUp, toggleVideoChat])

    const handleCallStart = async() => {
        if (incomingCall&&peerConnection) {
            const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate) {
                    socket.emit('newIceCandidate', event.candidate, channelID)
                }
            }
            peerConnection.ontrack = (event:RTCTrackEvent) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = event.streams[0]
                }
            }
            
            const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
            if (localVideo.current) {
                localVideo.current.srcObject = stream;
            }
            stream.getTracks().forEach(track => {
                peerConnection?.addTrack(track, stream)
            })
            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(incomingCall.incomingOffer)
            );
            const answer = await peerConnection.createAnswer()
            await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
            socket.emit("makeAnswer", answer, channelID)
            peerConnection.onicecandidate = handleIceCandidate
            socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
                peerConnection?.addIceCandidate(candidate)
            })
            setCallActive(true)
        }
    } 

    const handleCallEnd = () => {
        hangUp()
        toggleVideoChat()
    }


    return (
        <VideoChatContainer>
            {
                !callActive?
                <Fragment>
                    <CallHeaderContainer>
                        <span>{connectedUserName}</span>
                        <span>{incomingCall? 'incoming call': 'outgoing call'}</span>
                    </CallHeaderContainer>
                    <ConnectedUserAvatar>
                        <CustomAccountCircle/>
                    </ConnectedUserAvatar>
                </Fragment>
                :null
            }
            <VideoChatActionButtons>
                <button onClick={handleCallEnd}><CallEnd/></button>
                {
                    !callActive&&incomingCall?
                    <button onClick={handleCallStart}><Call/></button>
                    :null
                }
            </VideoChatActionButtons>
            <video style={{display: `${!callActive? 'none': 'flex'}`}} ref={remoteVideo} autoPlay></video>
            <video style={{display: `${!callActive? 'none': 'flex'}`}} muted ref={localVideo} autoPlay></video>
        </VideoChatContainer>
    )
}

export default VideoChat;
