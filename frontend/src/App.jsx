import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import './index.css' // Global styles

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    //Check for an active session immediately when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // 2. Listen for any changes (Login, Logout, Sign Up)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="container">
      {!session ? (
        // If NO session, show the Auth screen
        <Auth />
      ) : (
        // If there is a session, show the main app/feed
        <div className="dashboard">
          <h1>Welcome, {session.user.email}</h1>
          <button className="logout-button" onClick={() => supabase.auth.signOut()}>
            Logout
          </button>
          <p>Next: Building your LFG Feed!</p>
        </div>
      )}
    </div>
  )
}

export default App