import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { characterName: null });
});

app.post("/get-anime", async (req, res) => {
  const userAnime = req.body.userAnime; // anime key from the user input in the form
  try {
    // search for the anime by name
    const searchResults = await axios.get(`${API_URL}/v4/anime?q=${userAnime}`);
    if (!searchResults.data.data || searchResults.data.data.length === 0) {
      throw new Error("Anime not found (;-;)");
    }
    // extract the ID of the first matching anime
    const userIdAnime = searchResults.data.data[0].mal_id;

    // get the characters of the anime
    const charactersResponse = await axios.get(
      `${API_URL}/v4/anime/${userIdAnime}/characters`
    );
    const characters = charactersResponse.data.data;
    if (!characters || characters.length === 0) {
      throw new Error("No characters found for this anime (;-;)");
    }

    // select a random character
    const randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];

      console.log(randomCharacter);

    res.render("index.ejs", {
      characterName: randomCharacter.character.name, characterPhoto: randomCharacter.character.images.jpg.image_url,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.render("index.ejs", {
      characterName: null, characterPhoto: null,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
