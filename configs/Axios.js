import axios from 'axios'

const Axios = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

// We can use intercepters if we need

export default Axios
