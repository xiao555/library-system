import axios from 'axios'
import fetchJsonp from 'fetch-jsonp'
import { api } from '../../config'

// 后端查询接口
function fetch (method, query = {}) {
  return new Promise((resolve, reject) => {
    axios.get(api[method],{ params: query }).then(res => {
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
function search ({query, count}) {
  return new Promise((resolve, reject) => {
    fetchJsonp(`https://api.douban.com/v2/book/search?count=${count}&q=${query}`, {
			jsonpCallback: 'callback'
		})
		.then(res => {
      return res.json();
		})
		.then(json => {
      // console.log(json);
      let results = []
      // 处理过滤
      json.books.forEach(item => {
        if (item.images == '') return;
        let data = {
          name: item.title,
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
