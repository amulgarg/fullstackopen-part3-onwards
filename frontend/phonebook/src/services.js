import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data);
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data);
}

const remove = (personId) => {
    return axios.delete(`${baseUrl}/${personId}`).then(response => response.data);
}

const update = (personId, updatedPerson) => {
    return axios.put(`${baseUrl}/${personId}`, updatedPerson).then(response => response.data);
}

const services = {getAll, create, remove, update};

export default services;