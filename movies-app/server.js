const express = require("express");
const connection = require("./db");

const app = express();
app.use(express.json());

// testo la rotta 
app.get("/test-db", (req, res) => {
  connection.query("SELECT 1 + 1 AS result", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(rows);
  });
});


// avio il server
app.listen(3000, () => {
  console.log("Server avviato su http://localhost:3000");
});
