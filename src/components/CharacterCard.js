import { useNavigate } from "react-router";

export default function CharacterCard({ character }) {
  const episodes = character.episode.map(ep =>
    ep.replace("https://rickandmortyapi.com/api/episode/", "")
  );

  const navigate = useNavigate()

  const statusColor = {
    Alive: "green",
    Dead: "red",
    unknown: "gray"
  };

  const navigateToCharacter = (postId) => {
    navigate(`/posts/${postId}`);
  }

  return (
    <div className="card" onClick={() => navigateToCharacter(character.id)}>
      <img src={character.image} alt={character.name} />

      <h3>{character.name}</h3>

      <p><strong>Вид:</strong> {character.species}</p>

      <p style={{ color: statusColor[character.status] || "gray" }}>
        <strong>Статус:</strong> {character.status}
      </p>

      <p>
        <strong>Серии:</strong> {episodes.join(", ")}
      </p>
    </div>
  );
}
