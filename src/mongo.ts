import { PersonType } from './types';

const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.DB_URL;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const PersonModel = mongoose.model('PersonModel', personSchema);

if (process.argv.length === 3) {
  console.log(`phonebook:`);
  PersonModel.find({}).then((people: PersonType[]) => {
    for (const person of people) {
      console.log(`${person.name} ${person.number}`);
    }
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const person = new PersonModel({
    name: newName,
    number: newNumber,
  });

  person.save().then((newPerson: PersonType) => {
    console.log(`added ${newPerson.name} ${newPerson.number} to phonebook`);
    mongoose.connection.close();
  });
}
