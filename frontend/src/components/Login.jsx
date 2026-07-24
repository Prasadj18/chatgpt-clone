import React, { useState } from 'react';
import { login, register } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const fn = isRegister ? register : login;
      const data = await fn(email, password);
      loginUser(data.token, data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
        {error && <p className="error">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegister ? 'Register' : 'Log in'}</button>
        <p className="switch" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
        </p>
      </form>
    </div>
  );
}
