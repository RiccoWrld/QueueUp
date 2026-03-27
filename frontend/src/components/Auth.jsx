import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // Metadata for Trigger

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        if(isSignUp){
            const {data, error} = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {username: username} // Metadata for Trigger
                }
            })
            if (error) alert(error.message)
            else alert('Check your email to confirm your account!')
        }
        else{
            const {error} = await supabase.auth.signInWithPassword({email, password})
            if (error) alert(error.message)
        }
        setLoading(false)
    }   

    return (
        <div className="auth-container">
            <div className="authcard">
                <h1>QueueUp</h1>
                <p className="auth-subtitle">
                    {isSignUp ? 'Create your account' : 'Welcome back! Please login to your account'}
                </p>

                <form className="auth-form" onSubmit={handleAuth}>
                    {isSignUp && (
                        <div className="input-group">
                            <label>Gamertag</label>
                            <input 
                            type="text"
                            placeholder='e.g RiccoWrld'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required/>
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email</label>
                        <input 
                        type="text"
                        placeholder='testemail@gmail.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input 
                        type="password"
                        placeholder='********'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Loading..." : (isSignUp ? "Create Account" : "Login")}
                    </button>
                </form>

                <button 
                    className="toggle-button"
                    onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    )
}   

