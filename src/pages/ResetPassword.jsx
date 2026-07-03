import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setError(''); setMessage('');
    try { const res = await resetPassword(token, password); setMessage(res.message); } catch (err) { setError(err.message); }
  }
  return <div className="loginPage single"><form className="loginCard" onSubmit={submit}><img className="miniLogo" src="/takora-logo.png" /><h2>Reset Password</h2><label>New Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" /></label>{error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}<button className="primary">Reset Password</button><Link to="/login">Back to login</Link></form></div>;
}
