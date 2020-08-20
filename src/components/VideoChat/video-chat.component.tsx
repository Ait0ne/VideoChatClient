import React, {useRef, useEffect} from 'react';
import Peer from 'peerjs';

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
    console.log(1)
    
    useEffect(() => {
        if (incomingCall) {
            const onIncomingCall = async () => {
                peerConnection.ontrack = (event:RTCTrackEvent) => {
                    console.log('hefsddf', event)
                    if (remoteVideo.current) {
                        remoteVideo.current.srcObject = event.streams[0]
                    }
                }
                
                const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
                console.log('stream', stream)
                if (localVideo.current) {
                    localVideo.current.srcObject = stream;
                }
                stream.getTracks().forEach(track => {
                    console.log('track',track)
                    peerConnection.addTrack(track, stream)
                })
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(incomingCall.incomingOffer)
                );
                const answer = await peerConnection.createAnswer()
                await peerConnection.setLocalDescription(new RTCSessionDescription(answer))
                socket.emit("makeAnswer", answer, channelID)
                peerConnection.onicecandidate = handleIceCandidate
                socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
                    peerConnection.addIceCandidate(candidate)
                })
            }
            onIncomingCall()
            console.log('offer',incomingCall.incomingOffer)


            // const peer = new Peer(userId)
            // console.log('incoming',peer)
            // socket.emit('makeAnswer', userId, channelID)
            // peer.on('call', (call) => {
            //     navigator.mediaDevices.getUserMedia({video:true, audio:true})
            //     .then(stream => {
            //         console.log('stream', stream)
            //         if (localVideo.current) {
            //             localVideo.current.srcObject = stream;
            //         }
            //         call.answer(stream)
            //         call.on('stream', (remoteStream:MediaStream) => {
            //             if (remoteVideo.current) {
            //                 remoteVideo.current.srcObject = remoteStream
            //             }
            //         })
            //     })
            //     .catch(err => console.log(err))

            // })


        } else {
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
                const callUser = async (channelId:string) => {
                    const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true})
                    await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
                    socket.emit("callUser", offer, channelID)
                }
                callUser(channelID)
    
                socket.on('answerMade', async (answer:RTCSessionDescriptionInit, channelID:string)=> {
                    console.log('answer', answer)
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
                    peerConnection.onicecandidate = handleIceCandidate
                })
                socket.on('receivedNewIceCandidate', (candidate:RTCIceCandidate) => {
                    peerConnection.addIceCandidate(candidate)
                })

            })

            .catch(err => console.log(err))

            // const peer = new Peer(userId)
            // console.log(peer)
            // socket.emit("callUser", userId, channelID )
            // socket.on("answerMade", (connectedUserId:string, channel:string) => {
            //     peer.connect(connectedUserId)
            //     navigator.mediaDevices.getUserMedia({video:true, audio:true})
            //     .then(stream => {
            //         console.log('stream', stream)
            //         if (localVideo.current) {
            //             localVideo.current.srcObject = stream;
            //         }
            //         const call = peer.call(connectedUserId, stream)
            //         console.log(call)
            //         call.on('stream', (remoteStream:MediaStream) => {
            //             if (remoteVideo.current) {
            //                 remoteVideo.current.srcObject = remoteStream
            //             }
            //         })
            //     })
            //     .catch(err => console.log(err))
            // })

        }

        return () => {
            socket.removeListener('answerMade')
            socket.removeListener('receivedNewIceCandidate')
        }
    }, [incomingCall, channelID, userId])
    
    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
            socket.emit('newIceCandidate', event.candidate, channelID)
        }
    }
    
    // useEffect(() => {
    //     peerConnection.ontrack = (event:RTCTrackEvent) => {
    //         console.log('hefsddf', event)
    //         if (remoteVideo.current) {
    //             remoteVideo.current.srcObject = event.streams[0]
    //         }
    //     }
        
    //     navigator.mediaDevices.getUserMedia({video:true, audio:true})
    //     .then(stream => {
    //         console.log('stream', stream)
    //         if (localVideo.current) {
    //             localVideo.current.srcObject = stream;
    //         }
    //         stream.getTracks().forEach(track => {
    //             console.log('track',track)
    //             peerConnection.addTrack(track, stream)
    //         })
    //     })
    //     .catch(err => console.log(err))
    // }, [])

    return (
        <VideoChatContainer>
            <video ref={remoteVideo} autoPlay></video>
            <video muted ref={localVideo} autoPlay></video>
        </VideoChatContainer>
    )
}

export default VideoChat;
