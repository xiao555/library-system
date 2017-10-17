import axios from 'axios'
import { api } from '../../config'

function fetch (method, query = {}) {
  console.log(query);
  return new Promise((resolve, reject) => {
    axios.get(api[method],{ params: query }).then(res => {
      console.log(res);
      resolve(res.data)
    }).catch(err => reject(err))
  })
}

export default {
  fetch,
}
