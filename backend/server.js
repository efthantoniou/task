const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const helmet = require('helmet');
const {body, validationResult} = require('express-validator');
const WebSocket = require('ws');


const app = express();
const port = 5000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

const database = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

database.connect((err) => {
    if(err) {
        console.error('Database connection failed: ', err.stack);
        return;
    }
    console.log('Connected to database');
});

const server = app.listen(port, () => {
    console.log("Server running on http://localhost:",port)
});

const websocket = new WebSocket.Server({server});

websocket.on('connection', (ws) => {
    console.log("Client Connected");

    ws.on('close', () => {
        console.log("Client disconnected")
    });
});

const broadcast = (data) => {
    websocket.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(JSON.stringify(data));
        }
    });
};


app.post(
    '/response-be', 
    [
        body('text')
        .trim()
        .notEmpty().withMessage("Response must not be empty!")
        .isLength({max: 500 }).withMessage("Excceeded max character limit allowed")
        .custom(value => {
            const disallowedResponses = ["yes", "i don't know", "no", "that's fine"]
            if (disallowedResponses.includes(value.toLowerCase())){
                throw new Error("Provide more detailed response!");
            }
            return true;
        })
    ], 
    (req, res) => {
        const text_response = req.body.text
        console.log(req.body.text)
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const query = 'INSERT INTO responses (content) VALUES (?)';

        database.execute(query, [text_response], (err, results) => {
            if(err) {
                console.error('Error saving response: ', err);
                res.status(500).send('Error saving your response!');
            }
            else {
                res.status(200).send('Response saved Successfully!');
                broadcast({ id: results.insertId, content: text_response})
            }
        })
});

app.get('/show_responses-be', (req, res) => {
    const query = 'SELECT * FROM responses ORDER BY id DESC LIMIT 100';
  
    database.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching responses: ', err);
        res.status(500).send('Error fetching responses');
      } else {
        res.status(200).json(results);
      }
    });
  });
