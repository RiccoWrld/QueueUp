import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import './PostForm.css'

function PostForm({ user, username, onPostCreated }) {
  const navigate = useNavigate();
  const [game, setGame] = useState('')
  const [description, setDescription] = useState('')
  const [platform, setPlatform] = useState('') 
  const [loading, setLoading] = useState(false)
  const [creatorUser, setCreatorUser] = useState('')
  const [region, setRegion] = useState('')
  const [rankLevel, setRankLevel] = useState('')
  const [playersNeeded, setPlayersNeeded] = useState('')

  useEffect(() => {
    if (username) {
      setCreatorUser(username)
    }

  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Insert the new LFG post into the 'posts' table
    const { data, error } = await supabase
      .from('lfg_posts')
      .insert([
        { 
          creator_id: user?.id, 
          creator_user: creatorUser,
          game_title: game, 
          platform: platform,
          region: region,
          rank_level: rankLevel,
          players_needed: playersNeeded,
          description: description 
        }
      ])
    
    if (error){
      console.error("Error creating post:", error.message)
      alert("Failed to create post: " + error.message)
      setLoading(false)
    }
    else{
      if (onPostCreated) onPostCreated()
      navigate('/')
    }

  }

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit} className="post-form">
        <h3>Create an LFG Post</h3>
        <input
          type="text"
          placeholder="Username (Gamertag)"
          value={creatorUser}
          onChange={(e) => setCreatorUser(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="What game are you playing?"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Region (e.g., NA, EU, Asia)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Platform (e.g., PC, PlayStation, Xbox)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Rank Level (e.g., Bronze, Silver, Gold)"
          value={rankLevel}
          onChange={(e) => setRankLevel(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Players Needed"
          value={playersNeeded}
          onChange={(e) => setPlayersNeeded(parseInt(e.target.value))}
          required
        />
        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Entry'}
        </button>
      </form>
    </div>
  )
}

export default PostForm