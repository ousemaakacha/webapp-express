const express = require("express");
const connection = require("./db");
const cors = require("cors")

const app = express();

app.use(cors({origin: 'http://localhost:5173'}))
app.use(express.json());

app.use("/images", express.static("movies_cover"))

// testo la rotta 
app.get("/test-db", (req, res) => {
  connection.query("SELECT 1 + 1 AS result", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(rows);
  });
});

// rotta Index

app.get("/movies",  (req, res) => {
 const sql = "Select * FROM movies";
 connection.query(sql, (err, results) => {
  if (err){
    return res.status(500).json({ error: "cant read mpvies"})
  }
  res.json(results.map(m => ({
    ...m, 
    imageUrl: `http://localhost:3000/images/${m.image}`
  })))
 })
});


// Rotta show

app.get("/movies/:id", (req, res) => {
  const movieId = req.params.id;

  const sqlMovie = "SELECT * FROM movies WHERE id = ?";
  const sqlReviews = "SELECT * FROM reviews WHERE movie_id = ?";

  connection.query(sqlMovie, [movieId], (err, movieResults) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

   
    if (movieResults.length == 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const movie = movieResults[0];

    movie.imageUrl = `http://localhost:3000/images/${movie.image}`;

    
    connection.query(sqlReviews, [movieId], (err, reviewResults) => {
      if (err) {
        return res.status(500).json({ error: "Error cant load reviews" });
      }

      
      res.json({
        movie,
        reviews: reviewResults
      });
    });
  });
});


// aggiungo una recesnione
app.post("/reviews", (req, res) => {
  const { movieId, name, text, vote } = req.body;

  
  if (!movieId || !name || !text || !vote) {
    return res.status(400).json({ error: "missing data" });
  }

  const sql = "INSERT INTO reviews (movie_id, name, text, vote) VALUES (?, ?, ?, ?)";

  connection.query(sql, [movieId, name, text, vote], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "cant save review" });
    }
    res.status(201).json({ message: "review added", reviewId: result.insertId });
  });
});




// avvio il server
app.listen(3000, () => {
  console.log("Server avviato su http://localhost:3000");
});