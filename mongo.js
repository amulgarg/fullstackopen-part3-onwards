const mongoose = require('mongoose');
console.log('process.argv', process.argv);

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2];

const database = 'phonebook';

const url = `mongodb+srv://fullstackopen:${password}@fullstackopen.deixx.mongodb.net/${database}?retryWrites=true&w=majority`;
  `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })


const personSchema = new mongoose.Schema({
  name: String,
  number: Number
});

const Person = mongoose.model('Person', personSchema);

const newPerson = new Person({
  name: "Amul",
  number: 12345
})

newPerson.save().then(result => {
  console.log('note saved!', result);
  mongoose.connection.close()
})