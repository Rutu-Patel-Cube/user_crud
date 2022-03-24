import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
})

export default {
    getUsers() {
        return apiClient.get('users')
    },
    addUser(userToAdd) {
        return apiClient.post('users', userToAdd);
    },
    deleteUser(deleteId) {
        return apiClient.delete(`users/${deleteId}`);
    },
}
