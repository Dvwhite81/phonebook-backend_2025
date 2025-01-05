import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
config();

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

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.static('dist'));

app.use(cors());

morgan.token('body', (req: Request) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

// HOME / TEST
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello</h1>');
});

// INFO
app.get('/info', (req: Request, res: Response) => {
  const date = new Date();

  res.send(
    `<p>Phonebook has info for ${PERSONS.length} people</p><p>${date}</p>`,
  );
});

// GET ALL
app.get('/api/persons', (req: Request, res: Response) => {
  res.json(PERSONS);
});

// GET ONE
app.get('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const person = PERSONS.find((p) => p.id === Number(id));

  if (person) {
    res.json(person);
  } else {
    res.status(404).send('Person could not be found');
  }
});

// DELETE ONE
app.delete('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  const person = PERSONS.find((p) => p.id === Number(id));

  if (person) {
    PERSONS = PERSONS.filter((person) => person.id !== Number(id));
    res.status(204).end();
  } else {
    res.status(404).send('Person could not be found');
  }
});

// ADD ONE
app.post('/api/persons', (req: Request, res: Response) => {
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
