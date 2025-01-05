"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let PERSONS = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
];
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json());
app.use(express_1.default.static('dist'));
app.use((0, cors_1.default)());
morgan_1.default.token('body', (req) => JSON.stringify(req.body));
app.use((0, morgan_1.default)(':method :url :status :res[content-length] - :response-time ms :body'));
// HOME / TEST
app.get('/', (req, res) => {
    res.send('<h1>Hello</h1>');
});
// INFO
app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${PERSONS.length} people</p><p>${date}</p>`);
});
// GET ALL
app.get('/api/persons', (req, res) => {
    res.json(PERSONS);
});
// GET ONE
app.get('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = PERSONS.find((p) => p.id === Number(id));
    if (person) {
        res.json(person);
    }
    else {
        res.status(404).send('Person could not be found');
    }
});
// DELETE ONE
app.delete('/api/persons/:id', (req, res) => {
    const { id } = req.params;
    const person = PERSONS.find((p) => p.id === Number(id));
    if (person) {
        PERSONS = PERSONS.filter((person) => person.id !== Number(id));
        res.status(204).end();
    }
    else {
        res.status(404).send('Person could not be found');
    }
});
// ADD ONE
app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        res.status(400).json({
            error: 'name and number are required',
        });
        return;
    }
    const existingPerson = PERSONS.find((person) => person.name === name);
    if (existingPerson) {
        res.status(400).json({
            error: 'name must be unique',
        });
        return;
    }
    const newPerson = {
        name,
        number,
        id: Math.floor(Math.random() * 1000000),
    };
    PERSONS.push(newPerson);
    res.json({ person: newPerson });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
