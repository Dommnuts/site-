import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

app.use(express.static("public"));

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(400).send("Missing URL parameter");
  }
  
  try {
    const response = await fetch(targetUrl);
    const body = await response.text();
    res.status(200).send(body);
  } catch (error) {
    res.status(500).send(`Error fetching URL: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
