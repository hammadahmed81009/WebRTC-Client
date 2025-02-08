import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { theme } from '../theme';

const NavbarContainer = styled.nav`
  background: linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary});
  color: ${theme.colors.white};
  padding: 1rem 2rem;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px ${theme.colors.shadow};
`;

const Brand = styled.div`
  font-size: 1.8rem;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.white};
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borderRadius};
  }
`;

const Navbar = () => {
  const { token, logout, user } = useContext(AuthContext);
  
  return (
    <NavbarContainer>
      <Brand>WebRTC Calling App</Brand>
      {token && (
        <div>
          {user && <span style={{ marginRight: '1rem' }}>Hello, {user.username}</span>}
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </div>
      )}
    </NavbarContainer>
  );
};

export default Navbar;
