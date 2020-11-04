const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
///app.use(morgan('tiny'));

morgan.token('body', function getId (req) {	
  return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "amul",
      "number": "929499",
      "id": 5
    },
    {
      "name": "harshit",
      "number": "2277722",
      "id": 6
    },
    {
      "name": "dhdehd",
      "number": "118818",
      "id": 7
    },
    {
      "name": "feeu8u",
      "number": "18818",
      "id": 8
    },
    {
      "name": "dedeuf8Updated",
      "number": "1777171",
      "id": 9
    }
];

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const person = persons.find(person => person.id == request.params.id)
	if(!person){
		return response.status(404).send({error: "NOT_FOUND"});
	} 
  return response.json(person);
})

app.post('/api/persons', (request, response) => {	
	const newPerson = request.body;

	if(!newPerson.name){
		return response.status(400).send({error: 'name is required'});
	}

	if(!newPerson.number){
		return response.status(400).send({error: 'number is required'});
	}

	const doesAlreadyExist = persons.find(person => person.name.toLowerCase() == newPerson.name.toLowerCase());

	if(doesAlreadyExist){
		return response.status(400).send({error: 'name must be unique'});
	}

	const largestId = Math.max(...persons.map(person => person.id));
	newPerson.id = randomInteger(largestId+1, 1000);
	const updatedPersons = persons.concat(newPerson);
  response.json(updatedPersons);
})

app.delete('/api/persons/:id', (request, response) => {
	const remainingPersons = persons.filter(person => person.id != request.params.id);
	if(remainingPersons.length === persons.length){
		return response.status(404).send({error: "NOT_FOUND"});
	} 
  return response.status(204).end();
})

app.get('/info', (request, response) => {
	response.send(`<div><div>Phonebook has info for ${persons.length} people</div>${new Date()}</div>`);
})

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})