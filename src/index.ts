import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
config();

import PersonModel from './models/person';
import { PersonType } from './types';

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
  PersonModel.find({}).then((people: PersonType[]) => {
    const { length } = people;
    const date = new Date();

    res.send(`<p>Phonebook has info for ${length} people</p><p>${date}</p>`);
  });
});

// GET ALL
app.get('/api/persons', (req: Request, res: Response) => {
  PersonModel.find({}).then((people: PersonType[]) => {
    res.json(people);
  });
});

// GET ONE
app.get('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  PersonModel.findById(id)
    .then((person: PersonType) => {
      res.json(person);
    })
    .catch((error: any) => {
      console.log('error:', error);
      res.status(404).send('Person could not be found');
    });
});

// DELETE ONE
app.delete('/api/persons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  PersonModel.findByIdAndDelete(id).then(() => {
    res.status(204).end();
  });
});

// ADD ONE
app.post('/api/persons', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'name and number are required',
    });
    return;
  }

  const exists = PersonModel;

  if (exists) {
    res.status(400).json({
      error: 'name must be unique',
    });
    return;
  }

  const person = new PersonModel({
    name: body.name,
    number: body.number,
  });
  console.log('PERSON:', person);

  person.save();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
