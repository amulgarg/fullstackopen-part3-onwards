import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import personsService from './services';
import './index.css';

const Filter = ({value, handleFilterChange}) => {
  return <div>filter shown with <input value={value} onChange={handleFilterChange}/></div>;
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addPerson}) => {
  console.log('rendering personform');
  return <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>;
}

const Persons = ({persons, filter, removePerson}) => {
  let filteredPersons = persons;
  if(filter!==''){
    filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
  }

  return <div>{filteredPersons.map(person => <p key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person)}>delete</button></p>)}</div>;
}

const App = () => {
  const [ persons, setPersons ] = useState([]);
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const addPerson = (event) => {
    event.preventDefault();
    
    const newPerson = {name: newName, number: newNumber};
    const existingPersonWithName = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if(existingPersonWithName){
      const shouldUpdate = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`);
      if(shouldUpdate){
        personsService.update(existingPersonWithName.id, newPerson).then(response => {
          const newPersons = persons.map(person => person.id === existingPersonWithName.id ? response : person);
          setPersons(newPersons);
        });
      }
    } else {
      personsService.create(newPerson).then(response => {
        setPersons(persons.concat(response));
        setSuccessMessage(`Added ${newPerson.name}`);
        window.setTimeout(()=>setSuccessMessage(null), 3000); //remove after 3 seconds
      });
    }
  }

  const removePerson = (personToRemove) => {
    const shouldRemove = window.confirm(`Delete ${personToRemove.name}?`);
    if(shouldRemove){
      personsService.remove(personToRemove.id).then(() => {
        const newPersons = persons.filter(person => person.id!==personToRemove.id);
        setPersons(newPersons);
      }).catch(error => {
        console.log('error', error);
        setErrorMessage(`Information of ${personToRemove.name} has already been removed from the server`);
      });
    }
  }

  useEffect(()=>{
    personsService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);
  
  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <Filter value={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} removePerson={removePerson}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))