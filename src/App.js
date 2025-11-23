import { useState, useEffect } from "react"
import CharacterCard from "./components/CharacterCard"
import "./App.css"

export default function App() {
  const [characters, setCharacters] = useState([])
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [charStatus, setCharStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // функция для поиска + фильтров + страницы
  const handleSearch = (pageNumber = 1) => {
    let url = `https://rickandmortyapi.com/api/character?page=${pageNumber}`

    const params = []
    if (name) params.push(`name=${name}`)
    if (species) params.push(`species=${species}`)
    if (charStatus) params.push(`status=${charStatus}`)

    if (params.length > 0) {
      url += "&" + params.join("&")
    }

    fetchCharacters(url)
  }

  const fetchCharacters = async (url) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 404) {
          setCharacters([])
          setError("Персонажи не найдены")
          return
        }
        throw new Error("Ошибка при загрузке данных")
      }

      const data = await res.json()
      setCharacters(data.results || [])
      setTotalPages(data.info.pages)
    } catch (err) {
      setError("Ошибка при загрузке данных")
    } finally {
      setLoading(false)
    }
  }

  // обновляем данные при смене страницы
  useEffect(() => {
    handleSearch(page)
    // eslint-disable-next-line
  }, [page])

  // --- Пагинация с ограничением количества кнопок ---
  const maxVisible = 7
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = start + maxVisible - 1
  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - maxVisible + 1)
  }
  const pageNumbers = []
  for (let i = start; i <= end; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="container">
      <h1>Rick and Morty Characters</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Введите имя персонажа"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <select value={species} onChange={e => setSpecies(e.target.value)}>
          <option value="">Все виды</option>
          <option value="Human">Человек</option>
          <option value="Alien">Инопланетянин</option>
          <option value="Robot">Робот</option>
          <option value="unknown">Неизвестный</option>
        </select>

        <select value={charStatus} onChange={e => setCharStatus(e.target.value)}>
          <option value="">Все статусы</option>
          <option value="alive">Живой</option>
          <option value="dead">Мёртвый</option>
          <option value="unknown">Неизвестный</option>
        </select>

        <button onClick={() => { setPage(1); handleSearch(1) }}>Поиск</button>
      </div>

      {loading && <p className="loading">Загрузка...</p>}
      {error && <p className="error">{error}</p>}

      <div className="card-grid">
        {characters.map(ch => (
          <CharacterCard key={ch.id} character={ch} />
        ))}
      </div>

      <div className="pagination">
        <div className="page-numbers">
          {start > 1 && (
            <button
              className="page-num"
              onClick={() => setPage(page - 1)}
              aria-label="Назад"
            >
              &#8592;
            </button>
          )}
          {pageNumbers.map(num => (
            <button
              key={num}
              className={page === num ? "page-num active" : "page-num"}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          {end < totalPages && (
            <button
              className="page-num"
              onClick={() => setPage(page + 1)}
              aria-label="Вперёд"
            >
              &#8594;
            </button>
          )}
        </div>
      </div>
    </div>
  )
}