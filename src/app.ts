import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3000;

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS birthdays (name TEXT, date TEXT)");
});

app.use(express.json());

app.get('/birthdays', (req: Request, res: Response) => {
    db.all("SELECT * FROM birthdays", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/birthdays', (req: Request, res: Response) => {
    const { name, date } = req.body;
    db.run("INSERT INTO birthdays (name, date) VALUES (?, ?)", [name, date], (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(201).json({ message: 'Birthday added successfully' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
