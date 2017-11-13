import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import { api } from '../../config'

// 后端查询接口
function fetch (method, query = {}) {
  console.log(method + ': ')
  return new Promise((resolve, reject) => {
    axios.post(api[method], query).then(res => {
      resolve(res.data)
    }).catch(err => reject(err))
  })
}

// 修改图书
function editBook (data) {
  return new Promise((resolve, reject) => {
    axios.post(api['editBook'], data).then(res => {
      // console.log(res);
      resolve(res.data)
    }).catch(err => reject(err))
  })
}

// 添加图书
function addBook (data) {
  return new Promise((resolve, reject) => {
    axios.post(api['addBook'], data).then(res => {
      // console.log(res);
      resolve(res.data)
    }).catch(err => reject(err))
  })
}

// 豆瓣API查询接口
function search ({query, type = 1, count}) {
  return new Promise((resolve, reject) => {
    fetchJsonp(type == 1 ? `https://api.douban.com/v2/book/isbn/${query}`
      : `https://api.douban.com/v2/book/search?count=${count}&q=${query}`, {
			jsonpCallback: 'callback'
		})
		.then(res => {
      return res.json();
		})
		.then(json => {
      // console.log(json);
      if (type == 1) {
        let data = {
          name: json.title,
          isbn: json.isbn13,
          type: '',
          number: 10,
          info: json.summary ? json.summary : json.subtitle,
          myfile: {}
        }
        for (var tag in json.tags) {
          if (json.tags.hasOwnProperty(tag)) {
            if ((/^[a-zA-Z]+$/).test(json.tags[tag].title)) {
              data.type = json.tags[tag].title
              break
            }
          }
        }
        data.myfile = typeof json.images == 'string' ? json.images : json.images.large
        console.log(data)
        return resolve([data])
      }
      let results = []
      // 处理过滤
      json.books.forEach(item => {
        if (item.images == '') return;
        let data = {
          name: item.title,
          isbn: item.isbn13,
          type: '',
          number: 10,
          info: item.summary ? item.summary : item.subtitle,
          myfile: {}
        }
        for (var tag in item.tags) {
          if (item.tags.hasOwnProperty(tag)) {
            if ((/^[a-zA-Z]+$/).test(item.tags[tag].title)) {
              data.type = item.tags[tag].title
              break
            }
          }
        }
        data.myfile = typeof item.images == 'string' ? item.images : item.images.large
        results.push(data)
      })
      resolve(results)
		})
		.catch(ex => {
			reject(ex)
		})
  })
}

export default {
  fetch,
  editBook,
  addBook,
  search
}
