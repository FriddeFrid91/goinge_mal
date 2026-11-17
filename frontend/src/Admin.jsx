
import { useState, useEffect } from "react";

function Admin() {
  const [pendingWords, setPendingWords] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/pending-words")
      .then(response => response.json())
      .then(data => setPendingWords(data));
  }, []);

  async function approveWord(id) {
  const response = await fetch(
    `http://localhost:3000/api/words/${id}/approve`,
    {
      method: "PUT"
    }
  );

  if (response.ok) {
    setPendingWords(prevWords =>
      prevWords.filter(word => word.id !== id)
    );
  }
}
  
async function deleteWord(id) {
    const response = await fetch(
        `http://localhost:3000/api/words/${id}`,
        {
            method: "DELETE"
        }
);
if (response.ok) {
    setPendingWords(prevWords =>
      prevWords.filter(word => word.id !== id)
    );
  }
}

  return (
    <section>
      <h1>Hantera ord</h1>

      {pendingWords.map((word) => (
        <div key={word.id}>
            <h2>{word.word}</h2>
            <p>{word.meanings.join(", ")}</p>
            <p>{word.example}</p>
            <p>{word.category}</p>

            <button onClick={() => approveWord(word.id)}>
            Godkänn
            </button>
            <button onClick={() => deleteWord(word.id)}>
                Radera
            </button>
        </div>
        ))}
    </section>
  );
}

export default Admin;
