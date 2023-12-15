import axios from 'axios';

const axiosApi = axios.create({
  baseURL: 'https://plovo-js-20-fce65-default-rtdb.europe-west1.firebasedatabase.app/',
});

export default axiosApi;