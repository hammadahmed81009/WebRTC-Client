import React from 'react';
import styled from 'styled-components';
import {
  FaPhoneSlash,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaDesktop,
  FaStopCircle,
} from 'react-icons/fa';
import { theme } from '../theme';

const CallScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${theme.colors.background};
  min-height: calc(100vh - 70px);
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: ${theme.colors.text};
`;

const VideoContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Video = styled.video`
  width: 320px;
  height: 240px;
  border: 3px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 6px ${theme.colors.shadow};
  background: #000;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem 1.5rem;
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 6px ${theme.colors.shadow};
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  font-size: 1rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const CallScreen = ({
  localVideoRef,
  remoteVideoRef,
  endCall,
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
}) => {
  return (
    <CallScreenContainer>
      <Title>Call in Progress</Title>
      <VideoContainer>
        <Video ref={localVideoRef} autoPlay muted />
        <Video ref={remoteVideoRef} autoPlay />
      </VideoContainer>
      <ControlsContainer>
        <Button onClick={toggleAudio}>
          {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          {isAudioEnabled ? 'Mute' : 'Unmute'}
        </Button>
        <Button onClick={toggleVideo}>
          {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
          {isVideoEnabled ? 'Video Off' : 'Video On'}
        </Button>
        <Button onClick={toggleScreenShare}>
          {isScreenSharing ? <FaStopCircle /> : <FaDesktop />}
          {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        </Button>
        <Button onClick={endCall}>
          <FaPhoneSlash /> End Call
        </Button>
      </ControlsContainer>
    </CallScreenContainer>
  );
};

export default CallScreen;
