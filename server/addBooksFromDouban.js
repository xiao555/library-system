import axios from 'axios'
import api from '../src/api'
import FormData from 'form-data'
// require('isomorphic-form-data');

const query = 'computer'
const count = 10
const url = `https://api.douban.com/v2/book/search?count=${count}&q=${query}`


axios.get(url).then(res => {
  // console.log(res);
  res.data.books.forEach(async item => {
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
    if (data.type == '') return;
    let image = typeof item.images == 'string' ? item.images : item.images.large
    data.myfile = await getImageBlob(image)
    // console.log(data.myfile);
    await upload(data);
  })
})

function binaryToBlob(data) {
    var arr = new Uint8Array(data.length);
    for(var i = 0, l = data.length; i < l; i++) {
        arr[i] = data.charCodeAt(i);
    }
    return new Blob(arr,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    return bb.getBlob();
};

function getImageBlob(url) {
    return axios.get(url, { responseType: 'stream'}).then(res => {
      return res.data
    })
    var r = new XMLHttpRequest();
    r.open("GET", url, false);
    // 详细请查看: https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data
    // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
    r.overrideMimeType('text/plain; charset=x-user-defined');
    r.send(null);
    var blob = binaryToBlob(r.responseText);
    blob.name = blob.fileName = url.substring(url.lastIndexOf('/') + 1);
    blob.fileType = "image/jpeg"; //"image/octet-stream";
    return blob;
};

function upload(data) {

  let formdata = new FormData()

  formdata.append('myfile', data.file,{
    filename: 'unicycle.jpg', // ... or:
    contentType: 'image/jpeg',
  })
  console.log(2342332);
  delete data.file
  formdata.append('uid', 1)
  for (var item in data) {
    if (data.hasOwnProperty(item)) {
      formdata.append(item, data[item])
    }
  }
  console.log(formdata);
  api.addBook(formdata).then(res => {
    console.log(res);
    if (res.code != 26) {
      let message
      switch(res.code) {
        case 12:
          message = 'Invaild Data'
          break
        case 24:
          message = 'Permission denied'
          break
        case 25:
          message = 'Insert failed'
          break
      }
      console.error(message);
    } else if (res.code == 26) {
      console.info('upload success')
    }
  }).catch(err => console.error(err))
}
