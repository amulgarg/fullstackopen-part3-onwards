const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('build'));

app.use(express.json());

morgan.token('body', function getId (req) {	
  return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors());


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then(personsResponse => {
		response.json(personsResponse);
	}).catch(error => next(error));
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then((result) => {
		if(!result){
			return response.status(404).send({error: "NOT_FOUND"});
		}
		return response.json(result);
	});
})

app.post('/api/persons', (request, response, next) => {
	
	const payload = {
		name: request.body.name,
		number: request.body.number
	};

	const newPerson = new Person(payload);
	newPerson.save().then(result => {
		console.log('note created', result);
		response.json(result);
	}).catch(error => next(error));	

});

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id).then((result) => {
		console.log('result', result);
		return response.status(204).end();
	}).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
	
	Person.find({}).then((result)=>{
		response.send(`<div><div>Phonebook has info for ${result.length} people</div>${new Date()}</div>`);
	}).catch(error => next(error));
})


app.put('/api/persons/:id', (request, response, next) => {

	const payload = {
		name: request.body.name,
		number: request.body.number
	};
	
	Person.findByIdAndUpdate(request.params.id, payload, { new: true }).then((result)=>{
		console.log('note updated', result);
		response.json(result);
	}).catch(error => next(error));

});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})