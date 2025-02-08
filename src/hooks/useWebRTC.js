import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';

const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const originalVideoTrackRef = useRef(null);

  useEffect(() => {
    if (!roomId) return; // Only initialize when roomId is provided

    const initWebRTC = async () => {
      try {
        // Get local media stream (camera and mic)
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // Save the original camera video track
        originalVideoTrackRef.current = stream.getVideoTracks()[0];

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize peer connection with a STUN server (recommended)
        peerConnection.current = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        });

        // Add local tracks to the connection
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        // Listen for remote tracks
        peerConnection.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Handle ICE candidates and send them to the signaling server
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('candidate', { roomId, candidate: event.candidate });
          }
        };

        // Handle Call Drop via ICE Connection State
        peerConnection.current.oniceconnectionstatechange = () => {
          const state = peerConnection.current.iceConnectionState;
          console.log('ICE connection state changed to:', state);
          if (state === 'disconnected' || state === 'failed' || state === 'closed') {
            toast.error('Call dropped. Please try again.');
            // Clean up the connection if not already closed.
            if (peerConnection.current) {
              peerConnection.current.close();
            }
          }
        };

        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        // Connect to Socket.io server and join the room
        socket.current = io(backendUrl, {
          auth: { token: localStorage.getItem('token') },
        });
        socket.current.emit('join-room', roomId);

        // Listen for signaling events

        // When an offer is received, set remote description and send an answer
        socket.current.on('offer', async ({ offer }) => {
          await peerConnection.current.setRemoteDescription(offer);
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit('answer', { roomId, answer });
        });

        // When an answer is received, set it as the remote description
        socket.current.on('answer', async ({ answer }) => {
          await peerConnection.current.setRemoteDescription(answer);
        });

        // When an ICE candidate is received from the remote peer, add it to your connection
        socket.current.on('candidate', async ({ candidate }) => {
          try {
            await peerConnection.current.addIceCandidate(candidate);
          } catch (e) {
            console.error('Error adding received ICE candidate', e);
          }
        });

        // When another user joins, initiate the offer flow
        socket.current.on('user-joined', async () => {
          const offer = await peerConnection.current.createOffer();
          await peerConnection.current.setLocalDescription(offer);
          socket.current.emit('offer', { roomId, offer });
        });
      } catch (error) {
        toast.error('Failed to initialize WebRTC');
        console.error(error);
      }
    };

    initWebRTC();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [roomId]);

  // Toggle audio tracks on/off
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // Toggle video tracks on/off
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Revert back to the camera track after screen sharing ends
  const revertToCamera = () => {
    if (originalVideoTrackRef.current) {
      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(originalVideoTrackRef.current);
      }
      // Update the local video element to show the original camera stream
      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      setIsScreenSharing(false);
    }
  };

  // Toggle screen sharing on and off
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        screenTrack.onended = () => {
          revertToCamera();
        };

        const sender = peerConnection.current
          .getSenders()
          .find((s) => s.track && s.track.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (error) {
        console.error('Error sharing screen:', error);
        toast.error('Error sharing screen');
      }
    } else {
      revertToCamera();
    }
  };

  // End the call (close the peer connection)
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
  };

  return {
    localVideoRef,
    remoteVideoRef,
    endCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
  };
};

export default useWebRTC;
