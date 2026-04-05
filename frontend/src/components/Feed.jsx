import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import emailjs from '@emailjs/browser'
import './Feed.css'

function Feed({ session }) {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        setLoading(true)
        const { data, error } = await supabase
            .from('lfg_posts')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) {
            console.error("Error fetching posts:", error.message)
        } else {
            setPosts(data)
        }
        setLoading(false)
    }

    async function handleRequestJoin(post) {
        const message = window.prompt(`Send a message to ${post.creator_user}`, "Hey, I'd like to join your group!" )

        if(!message){
            return;
        }
        try{
             const {data: profile, error} = await supabase
            .from('profiles')
            .select('email')
            .eq('id', post.creator_id)
            .single()

            if(error || !profile?.email) {
                alert("Unable to find creator's contact info.")
                return
            }

            const templateParams = {
                to_email: profile.email,
                reply_to: session?.user?.email,
                from_email: session?.user?.email,
                name: session?.user?.user_metadata?.username || session?.user?.email || "A fellow gamer"|| "A fellow gamer",
                game: post.game_title,
                platform: post.platform,
                rank: post.rank_level,
                message: message
            };

            emailjs.send('service_e3i6rxc', 'template_9lrrqki', templateParams, 'HULHdjyw3UhyKxI-b')
                .then(() => alert("Request sent!"));
       
        }   
        catch(error){
            console.error("Error sending join request:", error)
            alert("Failed to send join request: " + error.message)
        }
    }

    async function handleDelete(postId, creatorId) {
        const {data: {user } } = await supabase.auth.getUser()

        if (user.id !== creatorId) {
            alert("You can only delete your ownm posts.")
            return
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this LFG post?")
        if (!confirmDelete) return

        const { error } = await supabase
            .from('lfg_posts')
            .delete()
            .eq('id', postId)

        if (error) {
            console.error("Error deleting post:", error.message)
            alert("Failed to delete post: " + error.message)
        }
        else {
            fetchPosts()
        }
    }


    if (loading) return <div className="loading">Loading active sessions...</div>

    return (
        <div className="feed-container">
            <h2>Live LFG Posts</h2>
            <div className="post-grid">
                {posts.length === 0 ? (
                    <p>No active posts. Start a queue above!</p>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="card-header">
                                <span className="game-badge">{post.game_title}</span>
                                <span className="user-tag">@{post.creator_user}</span>
                            </div>
                            <p className="description">{post.description}</p>
                            <div className="card-footer">
                                <span className="platform">{post.platform}</span>

                                {session?.user?.id === post.creator_id ? (
                                    <button className="delete-btn" onClick={() => handleDelete(post.id, post.creator_id)}>Delete</button>
                                ) : (<button className="join-button" onClick={() => handleRequestJoin(post)}>Request Join</button>
                            )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Feed