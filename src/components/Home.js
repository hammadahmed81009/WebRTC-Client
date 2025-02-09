import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPhoneAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from '../theme';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 70px);
  background-color: ${theme.colors.background};
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
  background-repeat: repeat;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.text};
  margin-bottom: 2rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: ${theme.borderRadius};
  width: 300px;
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 5px ${theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1.2rem;
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

const Home = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (!roomId) {
      toast.error('Please enter a room ID');
      return;
    }
    onJoinRoom(roomId);
  };

  return (
    <HomeContainer>
      <Title>Start a Call</Title>
      <InputContainer>
        <Input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleJoinRoom}>
          <FaPhoneAlt /> Join Room
        </Button>
      </InputContainer>
    </HomeContainer>
  );
};

export default Home;
