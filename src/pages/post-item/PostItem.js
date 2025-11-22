import { useEffect } from "react"
import { useParams } from "react-router"

export function PostItem({ post }) {
  const {postId} = useParams()
  
  useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/${postId}`).then(res => res.json()).then(data => {
      console.log(data);
      
    })
  }, [])
  
  return (
    <div className="post-item">
      <h2 className="post-title">dasdas</h2>
      <p className="post-body">dsdasd</p>
    </div>
  )
}