import React, { useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { theme } from "../theme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 70px);
  background-color: ${theme.colors.background};
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
  background-repeat: repeat;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: ${theme.colors.white};
  padding: 2rem;
  border-radius: ${theme.borderRadius};
  box-shadow: 0 4px 6px ${theme.colors.shadow};
`;

const Input = styled.input`
  padding: 0.8rem;
  font-size: 1.1rem;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: ${theme.borderRadius};
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 5px ${theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.8rem;
  font-size: 1.1rem;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${theme.colors.secondary};
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Defined a keyframes animation for the loader spinner.
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// A styled loader component.
const Loader = styled.div`
  border: 4px solid ${theme.colors.white};
  border-top: 4px solid ${theme.colors.primary};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: ${theme.colors.text};
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }
      login(data);
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Login"}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
