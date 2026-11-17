
import { useState } from "react";

function AddWord({ onWordAdded }) {
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("");
  async function handleSubmit(event) {
  event.preventDefault();

  const newWord = {
    word,
    meanings: meanings.split(",").map(meaning => meaning.trim()),
    example,
    category
  };

  const response = await fetch("http://localhost:3000/api/words", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newWord)
  });

  const data = await response.json();

  console.log(data, response.ok);

  if (!response.ok) {
    console.error("Något gick snett.")
  } else {
    onWordAdded(data)
  }
}

  return (
    <section>
      <h2>Föreslå ett ord</h2>

      <form onSubmit={handleSubmit}>
        <label>Ord</label>
        <input
          type="text"
          placeholder="Skriv ett ord..."
          value={word}
          onChange={(event) => setWord(event.target.value)}
        />

        <label>Betydelser</label>
        <input
          type="text"
          placeholder="Skriv betydelser, separerade med kommatecken..."
          value={meanings}
          onChange={(event) => setMeanings(event.target.value)}
        />

        <label>Exempelmening</label>
        <textarea
          placeholder="Skriv en exempelmening..."
          value={example}
          onChange={(event) => setExample(event.target.value)}
        />

        <label>Kategori</label>
        <input
          type="text"
          placeholder="Exempelvis Känslor..."
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />

        <button type="submit">Skicka förslag</button>
      </form>
    </section>
  );
}

export default AddWord;
