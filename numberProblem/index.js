const express = require("express");
const app = express();
const PORT = 3000;

const axios = require("axios");

app.get("/numbers", async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "bad query." });
  }

  try {
    const result = new Set();

    const requests = urls.map((url) => {
      return axios
        .get(url)
        .then((response) => {
          if (response.data && Array.isArray(response.data.numbers)) {
            response.data.numbers.forEach((number) => {
              result.add(number);
            });
          }
        })
        .catch((error) => {
          console.error(`Error fetching ${url}: ${error.message}`);
        });
    });

    await Promise.all(requests);

    const endResult = Array.from(result).sort((a, b) => a - b);
    return res.json({ numbers: endResult });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} is running`);
});
