import React, { useContext, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import CallScreen from './components/CallScreen';
import useWebRTC from './hooks/useWebRTC';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthContext } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { theme } from './theme';

const SwitchButton = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1.2rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: background 0.3s ease;
  margin: 1rem 0;
  
  &:hover {
    background: ${theme.colors.secondary};
  }
`;

const App = () => {
  const { token } = useContext(AuthContext);
  const [roomId, setRoomId] = useState('');
  const [showAuth, setShowAuth] = useState('login'); // toggle between 'login' and 'signup'

  const {
    localVideoRef,
    remoteVideoRef,
    endCall, // from useWebRTC hook
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isAudioEnabled,
    isVideoEnabled,
    isScreenSharing,
  } = useWebRTC(roomId);

  // New combined handler for ending the call and navigating home.
  const handleEndCall = () => {
    endCall();         // Close the peer connection
    setRoomId('');     // Reset roomId so that the Home component is rendered
  };

  // If not authenticated, show login/signup screens.
  if (!token) {
    return (
      <div>
        <Navbar />
        {showAuth === 'login' ? <Login /> : <Signup />}
        <div style={{ textAlign: 'center' }}>
          <SwitchButton
            onClick={() => setShowAuth(showAuth === 'login' ? 'signup' : 'login')}
          >
            {showAuth === 'login' ? 'Switch to Signup' : 'Switch to Login'}
          </SwitchButton>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {!roomId ? (
        <Home onJoinRoom={setRoomId} />
      ) : (
        <CallScreen
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          endCall={handleEndCall}  // Pass the combined end call handler here.
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          toggleScreenShare={toggleScreenShare}
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          isScreenSharing={isScreenSharing}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
