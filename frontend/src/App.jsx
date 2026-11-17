import Header from "./Header";
import Footer from "./Footer";
import AddWord from "./Addwords";
import Admin from "./Admin";
import { useState, useEffect } from "react";
function App() {
    if (window.location.pathname === "/admin") {
    return <Admin />;
  }
  const [search, setSearch] = useState("");
  const [words, setWords] = useState([])
  const filteredWords = words.filter((word) =>
  word.word.toLowerCase().includes(search.toLowerCase()) ||
  word.meanings.some((meaning) =>
    meaning.toLowerCase().includes(search.toLowerCase())
  )
);
  useEffect(() => {
    fetch("http://localhost:3000/api/words")
    .then(response => response.json())
    .then(data => {
      console.log("Data från API: ", data);
      setWords(data);
    });
  }, []);
  return (
    <>
      <Header />
      <main>
        <input 
        type="text" 
        placeholder="Sök..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        />
        <AddWord onWordAdded={() => {
          fetch("http://localhost:3000/api/words")
            .then(response => response.json())
            .then(data => setWords(data));
        }} />
        <section>
          {filteredWords.map((word) => (
            <div key={word.id}>
              <h2>{word.word}</h2>
              <ul>
                  {word.meanings.map((meaning, index) => (
                    <li key={index}>{meaning}</li>
                  ))}
                </ul>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;