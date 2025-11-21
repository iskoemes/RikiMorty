import { useState } from "react"; 
import CharacterCard from "./components/CharacterCard";
import "./App.css";

export default function App() {
  const [characters, setCharacters] = useState([]) //список персонажей
  const [name, setName] = useState("") //строка поиска
  const [species, setSpecies] = useState("") //выбранный вид
  const [loading, setLoading] = useState(false) //состояние загрузки (true/false)
  const [error, setError] = useState(null) //текст ошибки

  const handleSearch = () => {
    let url = "https://rickandmortyapi.com/api/character";

    const params = [];
    if (name) params.push("name=" + name);
    if (species) params.push("species=" + species);

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    fetchCharacters(url)
     
  }

const fetchCharacters = async (url) => {
 try {
    setLoading(true);
    setError(null);

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) {
        setCharacters([]);
        setError("Персонажи не найдены");
        return;
      }
      throw new Error("Ошибка при загрузке данных");
    }
    const data = await res.json();
    setCharacters(data.results || []);
 } catch (err) {
    setError("Ошибка при загрузке данных");
 } finally {
    setLoading(false);
 }
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
            <option value=''>Все виды</option>
            <option value='Human'>Человек</option>
            <option value='Alien'>Инопланетянин</option>
            <option value='Robot'>Робот</option>
            <option value='unknown'>Зомби</option>
        </select>
        <button onClick={handleSearch}>Поиск</button>
      </div>

       {loading && <p className="loading">Загрузка...</p>}
          {error && <p className="error">{error}</p>}

           <div className="card-grid">
        {characters.map((ch) => (
          <CharacterCard key={ch.id} character={ch} />
        ))}
      </div>
    </div>
  );
}
