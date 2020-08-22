import React, {useRef, useEffect, useState, Fragment, useCallback} from 'react';

import {VideoChatContainer, CallHeaderContainer, ConnectedUserAvatar, CustomAccountCircle, VideoChatActionButtons} from './video-chat.styles';
import {socket} from '../../App';
import {Call, CallEnd} from '@material-ui/icons';
import Peer from 'peerjs'

interface VideoChatProps {
    toggleVideoChat: React.Dispatch<React.SetStateAction<boolean>>,
    userId: string,
    channelID: string,
    incomingCall?: {
        incomingOffer: RTCSessionDescriptionInit,
        incomingChannelID: string
    },
    connectedUserName: string;
    setIncomingCall: React.Dispatch<React.SetStateAction<{
        incomingOffer: RTCSessionDescriptionInit;
        incomingChannelID: string;
    } | undefined>>,
    setOutGoingCall: React.Dispatch<React.SetStateAction<{
        channelID: string;
        connectedUserName: string;
    } | undefined>>
} 

let peer: Peer|null = null;
let mediaStream:MediaStream|null=null;

const VideoChat: React.FC<VideoChatProps> = ({toggleVideoChat, userId, channelID, incomingCall, connectedUserName, setIncomingCall, setOutGoingCall}) => {
    const localVideo = useRef<HTMLVideoElement>(null)
    const remoteVideo = useRef<HTMLVideoElement>(null)
    const [callActive, setCallActive] = useState(false)
    
    // const {RTCPeerConnection, RTCSessionDescription} = window
    // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection|null>(new RTCPeerConnection({iceServers: [
    //     {
    //     urls: 'turn:numb.viagenie.ca',
    //     credential: 'ait0ne666',
    //     username: 'bonafide112358@gmail.com'
    // },]}))
    
    
    // const hangUp = useCallback(() => {
    //     if (mediaStream) {
    //         if (localVideo.current) {
    //             localVideo.current.pause()
    //             localVideo.current.srcObject=null
    //         }
    //         if (remoteVideo.current) {
    //             remoteVideo.current.pause()
    //             remoteVideo.current.srcObject=null
    //         }
    //         mediaStream.getTracks().forEach(track => track.stop())
    //         mediaStream=null
    //         socket.emit('hangup', channelID)
    //         peerConnection?.close()
    //         setPeerConnection(null)
    //     }
    // }, [channelID, peerConnection])



    // useEffect(() => {
        
    //     if (!incomingCall&&peerConnection) {
            
    //         const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    //             if (event.candidate) {
    //                 socket.emit('newIceCandidate', event.candidate, channelID)
    //             }
    //         }
    //         peerConnection.ontrack = (event:RTCTrackEvent) => {
    //             console.log(event)
    //             if (remoteVideo.current) {
    //                 remoteVideo.current.srcObject = event.streams[0]
    //             }
    //         }
            
    //         navigator.mediaDevices.getUserMedia({video:true, audio:true})
    //         .then(stream => {
    //             mediaStream=stream
    //             if (localVideo.current) {
    //                 localVideo.current.srcObject = stream;
    //             }
    //             stream.getTracks().forEach(track => {
    //                 peerConnection?.addTrack(track, stream)
    //             })
    //             const callUser = async () => {
    //                 if (peerConnection) {
    //                     const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
    //                     await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
    //                     socket.emit("callUser", offer, channelID)

    //                 }
    //             }
    //             callUser()
    
    //             socket.on('answerMade', async (answer:RTCSessionDescriptionInit, channelID:string)=> {
    //                 if (peerConnection) {
    //                     await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    //                     peerConnection.onicecandidate = handleIceCandidate
    //                     setCallActive(true)
    //                 }
    //             })
    //             socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
    //                 console.log('newicecandidate')
    //                 peerConnection?.addIceCandidate(candidate)
    //             })
    //         })

    //         .catch(err => console.log(err))
    //     }

    //     socket.on('initiatedHangUp', () => {
    //         if (localVideo.current) {
    //             localVideo.current.pause()
    //             localVideo.current.srcObject=null
    //         }
    //         if (remoteVideo.current) {
    //             remoteVideo.current.pause()
    //             remoteVideo.current.srcObject=null
    //         }
    //         mediaStream?.getTracks().forEach(track => track.stop())
    //         mediaStream=null
    //         peerConnection?.close()
    //         setPeerConnection(null)
    //         toggleVideoChat()
    //     })

    //     return () => {
    //         socket.removeListener('answerMade')
    //         socket.removeListener('receivedNewIceCandidate')
    //         socket.removeListener('initiatedHangUp')
    //         hangUp()
    //         setIncomingCall(undefined)
    //     }
    // }, [incomingCall, channelID, userId, hangUp, toggleVideoChat, setIncomingCall, RTCSessionDescription, peerConnection])

    // const handleCallStart = async() => {
    //     if (incomingCall&&peerConnection) {
    //         const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    //             if (event.candidate) {
    //                 socket.emit('newIceCandidate', event.candidate, channelID)
    //             }
    //         }
    //         peerConnection.ontrack = (event:RTCTrackEvent) => {
    //             console.log(event)
    //             if (remoteVideo.current) {
    //                 remoteVideo.current.srcObject = event.streams[0]
    //             }
    //         }
            
    //         const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
    //         if (localVideo.current) {
    //             localVideo.current.srcObject = stream;
    //         }
    //         mediaStream = stream
    //         stream.getTracks().forEach(track => {
    //             peerConnection?.addTrack(track, stream)
    //         })
    //         await peerConnection.setRemoteDescription(
    //             new RTCSessionDescription(incomingCall.incomingOffer)
    //         );
    //         const answer = await peerConnection.createAnswer()
    //         await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
    //         socket.emit("makeAnswer", answer, channelID)
    //         peerConnection.onicecandidate = handleIceCandidate
    //         socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
    //             peerConnection?.addIceCandidate(candidate)
    //         })
    //         setCallActive(true)
    //     }
    // } 

    // const handleCallEnd = () => {
        
    //     hangUp()
    //     toggleVideoChat()
    // }

    const hangUp = useCallback((mediaStream:MediaStream|null) => {
        if (mediaStream) {
            console.log(2)
            if (localVideo.current) {
                localVideo.current.pause()
                localVideo.current.srcObject=null
            }
            if (remoteVideo.current) {
                remoteVideo.current.pause()
                remoteVideo.current.srcObject=null
            }
            mediaStream.getTracks().forEach(track => track.stop())
            mediaStream=null
        }
        socket.emit('hangup', channelID)
        peer?.disconnect()
    }, [channelID])
    

    useEffect(()=> {
        socket.on('initiatedHangUp', () => {
            console.log('hangup')
            hangUp(mediaStream)
            toggleVideoChat(false)
        })
        
        
        if (!incomingCall) {
            peer = new Peer(userId, {config:{iceServers:[{ 
                urls: 'turn:numb.viagenie.ca',
                credential: 'ait0ne666',
                username: 'bonafide112358@gmail.com'}]
            }})
            console.log(userId, channelID)
            socket.emit("callUser", userId, channelID)
            socket.on('answerMade', (connectedUserId:string, channelID:string)=> {
                peer?.connect(connectedUserId)
                navigator.mediaDevices.getUserMedia({video:true, audio:true})
                .then((stream:MediaStream) => {
                    console.log(stream)
                    mediaStream = stream
                    const call = peer?.call(connectedUserId, stream)
                    if (localVideo.current) {
                        localVideo.current.srcObject = mediaStream
                    }
                    call?.on("stream", (remoteStream) => {
                        if (remoteVideo.current) {
                            remoteVideo.current.srcObject = remoteStream
                        }
                        setCallActive(true)
                    })
                })
                .catch(() => {
                    socket.emit('hangup', channelID)
                    peer?.disconnect()
                    toggleVideoChat(false)
                })
                peer?.on("error", (err) => {
                    hangUp(mediaStream)
                })
            })


        }
        return () => {
            socket.removeListener("answerMade")
            socket.removeListener("initiatedHangUp")
            hangUp(mediaStream)
            console.log(1)
            setIncomingCall(undefined)
            setOutGoingCall(undefined)
        }
    }, [userId, channelID, hangUp, incomingCall, toggleVideoChat, setIncomingCall, setOutGoingCall])

    const handleCallStart = () => {
        peer = new Peer(userId, {config:{iceServers:[{ 
            urls: 'turn:numb.viagenie.ca',
            credential: 'ait0ne666',
            username: 'bonafide112358@gmail.com'}]
        }})
        console.log(userId, channelID)
        socket.emit("makeAnswer", userId, channelID)
        peer.on("call", (call) => {
            console.log('getting media')
            navigator.mediaDevices.getUserMedia({video:true, audio:true})
            .then((stream) => {
                mediaStream = stream
                if (localVideo.current) {
                    localVideo.current.srcObject = mediaStream
                }
                call.answer(mediaStream)
                call?.on("stream", (remoteStream) => {
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = remoteStream
                    }
                    setCallActive(true)
                })
            })
            .catch(() => {
                socket.emit('hangup', channelID)
                peer?.disconnect()
                toggleVideoChat(false)
            })
        })
        peer?.on("error", (err) => {
            hangUp(mediaStream)
        })

    }

    const handleCallEnd = () => {
        hangUp(mediaStream)
        toggleVideoChat(false)
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
