const express = require("express");
const cors = require("cors");
const db = require("./db")

const app = express();

app.use(cors());
app.use(express.json());

app.delete("/api/words/:id", (req, res) => {
  const { id } = req.params;

  const sqlMeanings = `
    DELETE FROM meanings
    WHERE word_id = ?
  `;
  db.query(sqlMeanings, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    const sqlWord = `
    DELETE FROM words
    WHERE id = ?
    `;
  
  db.query(sqlWord, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ordet hittades inte." });
    }
    res.json({ message: "Ordet har raderats!"})
 });
  });
});

app.post("/api/words", (req, res) => {
  const { word, example, category, meanings } = req.body;

  if (!word || !word.trim()) {
    return res.status(400).json({ error: "Du måste ange ett ord." });
  }

  const sql = `
    INSERT INTO words (word, example, category, status)
    VALUES (?, ?, ?, 'pending')
  `;

  db.query(sql, [word, example, category], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const wordId = result.insertId;

    const meaningSql = `
      INSERT INTO meanings (word_id, meaning)
      VALUES ?
    `;

    const meaningValues = meanings.map(meaning => [wordId, meaning]);

    db.query(meaningSql, [meaningValues], (error) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(201).json({
        message: "Ordet och betydelserna har sparats!",
        id: wordId,
        word,
        example,
        category,
        meanings
      });
    });
  });
});

app.get("/api/words", (req, res) => {
  const sql = `
    SELECT
      words.id,
      words.word,
      words.example,
      words.category,
      JSON_ARRAYAGG(meanings.meaning) AS meanings
    FROM words
    LEFT JOIN meanings
      ON words.id = meanings.word_id
    WHERE words.status = 'approved'
    GROUP BY
      words.id,
      words.word,
      words.example,
      words.category
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(results);
  });
});

app.get("/api/pending-words", (req, res) => {
  const sql = `
    SELECT
      words.id,
      words.word,
      words.example,
      words.category,
      JSON_ARRAYAGG(meanings.meaning) AS meanings
    FROM words
    LEFT JOIN meanings
      ON words.id = meanings.word_id
    WHERE words.status = 'pending'
    GROUP BY
      words.id,
      words.word,
      words.example,
      words.category
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(results);
  });
});

app.put("/api/words/:id/approve", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE words
    SET status = 'approved'
    WHERE id = ? AND status = 'pending'
  `;

  db.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ordet hittades inte eller är redan behandlat." });
    }

    res.json({ message: "Ordet har godkänts!" });
  });
});

app.get("/", (req, res) => {
  res.send("GöingeMål API fungerar!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});