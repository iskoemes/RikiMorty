import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import "./PostItem.css"

export function PostItem() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`https://rickandmortyapi.com/api/character/${postId}`)
      .then(res => res.json())
      .then(async data => {
        setCharacter(data)
        // Получаем эпизоды
        if (data.episode && data.episode.length > 0) {
          const episodeIds = data.episode.map(url => url.split("/").pop()).join(",")
          const res = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds}`)
          const episodesData = await res.json()
          setEpisodes(Array.isArray(episodesData) ? episodesData : [episodesData])
        }
        setLoading(false)
      })
      .catch(err => {
        setError("Ошибка загрузки данных")
        setLoading(false)
      })
  }, [postId])

  if (loading) return <div className="post-item">Загрузка...</div>
  if (error) return <div className="post-item">{error}</div>
  if (!character) return null

  return (
    <div className="post-card">
    <div className="post-item">
      <button className="back-btn" onClick={() => navigate(-1)}>← Назад</button>
      <img className="post-image" src={character.image} alt={character.name} />
      <h2 className="post-title">{character.name}</h2>
      <div className="post-details">
        <p><b>Статус:</b> {character.status}</p>
        <p><b>Вид:</b> {character.species}</p>
        <p><b>Пол:</b> {character.gender}</p>
        <p><b>Локация:</b> {character.location?.name}</p>
      </div>
      <div className="episodes-block">
        <h3>Эпизоды с персонажем:</h3>
        <ul className="episodes-list">
          {episodes.map(ep => (
            <li key={ep.id}>
              <span className="ep-name">{ep.episode} — {ep.name}</span>
              <span className="ep-date">{ep.air_date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  )
}