// index.js
require('dotenv').config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.post("/compile", (req, res) => {
    // getting the required data from the request
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    let languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
    };

    if (!languageMap[language]) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    let data = {
        "language": languageMap[language].language,
        "version": languageMap[language].version,
        "files": [
            {
                "name": "main",
                "content": code
            }
        ],
        "stdin": input
    };

    let config = {
        method: 'post',
        url: process.env.BACKEND_URL, // Use environment variable for the API URL
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    // calling the code compilation API
    Axios(config)
        .then((response) => {
            res.json(response.data.run);  // Send the run object directly
            console.log(response.data);
        }).catch((error) => {
            console.error('Error:', error.response ? error.response.data : error.message);
            res.status(500).send({ error: "Something went wrong", details: error.message });
        });
});

app.use(cors({
    origin: process.env.FRONTEND_URL // Use environment variable for frontend URL
}));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
