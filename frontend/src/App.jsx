import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Auth from './components/Auth'
import './index.css' // Global styles
import PostForm from './components/PostForm'
import Feed from './components/Feed'

function App() {
  const [session, setSession] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    //Check for an active session immediately when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) getProfile(session.user.id)
    })

    // 2. Listen for any changes (Login, Logout, Sign Up)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) getProfile(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()

    if (data) setUsername(data.username)
    if (error) console.log("Error fetching profile:", error.message)
  }

  return (
  <BrowserRouter>
    <div className="container">
      {}
      {!session ? (
        <Auth />
      ) : (
        <>
          <nav className="navbar">
            <Link to="/" className="logo">QueueUp</Link>
            <div className="nav-actions">
              <Link to="/create" className="create-btn">+ Create Post</Link>
              <button className="logout-button" onClick={() => supabase.auth.signOut()}>
                Logout
              </button>
            </div>
          </nav>

          <p>Logged in as: <strong>{username || session.user.email}</strong></p>

          <Routes>
            <Route path="/" element={<Feed session={session} />} />
            <Route path="/create" element={
              <div className="create-page">
                {}
                <PostForm user={session?.user} username={username} />
                <Link to="/" className="back-link">← Back to Feed</Link>
              </div>
            } />
          </Routes>
        </>
      )}
    </div>
  </BrowserRouter>
)
}

export default App