import api from '../api'
import * as DateUtils from './date'
// 封装成FormData
function formatFormData (data) {
  let formdata = new FormData()
  for (let item in data) {
    if (data.hasOwnProperty(item)) {
      formdata.append(item, data[item])
    }
  }
  return formdata
}
// 封装返回值
function cb (type, msg = '') {
  return {
    type: type,
    msg: msg
  }
}
// 封装返回信息
function resMsg(res) {
  let message
  switch (res.code) {
    case 8:
      message = 'The user name or password can not be empty'
      break
    case 9:
      message = 'Username does not exist'
      break
    case 10:
      message = 'wrong user name or password'
      break
    case 12:
      message = 'Invalid Data'
      break;
    case 13:
      message = 'Have already borrowed two books'
      break;
    case 14:
      message = 'Booking failed'
      break
    case 16:
      message = 'You have borrowed this book, have not returned'
      break;
    case 21:
      message = 'Query failed, please reload.'
      break
    case 133:
      message = 'Your account balance is not enough'
      break;

    default:
      message = res.msg
      break;
  }
  return message
}

// 借书
export function borrowBook (data) {
  return api.fetch('borrowBook', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 15) {
      return cb(0, resMsg(res))
    } else if (res.code == 15) {
      return cb(1)
    }
  })
}
// 删除用户
export function deleteUser(data) {
  return api.fetch('deleteUser', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 26) {
      return cb(0, resMsg(res))
    } else if (res.code == 26) {
      return cb(1)
    }
  })
}
// 充值
export function recharge(data) {
  return api.fetch('recharge', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 26) {
      return cb(0, resMsg(res))
    } else if (res.code == 26) {
      return cb(1)
    }
  })
}
// 注册新用户
export function register(data) {
  return api.fetch('register', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 26) {
      return cb(0, resMsg(res))
    } else if (res.code == 26) {
      return cb(1)
    }
  })
}
// 查询书籍信息
export function everyBook(data) {
  let _data = {}
  _data.bookid = data.bookid || -1
  return api.fetch('everyBook', formatFormData(_data)).then(res => {
    console.log(res)
    if (res.code != 2) {
      return cb(0, resMsg(res))
    } else if (res.code == 2) {
      return cb(1, res.data[0])
    }
  })
}
// 查询所有书籍信息
export function allBook() {
  let _data = {
    bookid: 0
  }
  return api.fetch('everyBook', formatFormData(_data)).then(res => {
    console.log(res)
    if (res.code != 2) {
      return cb(0, resMsg(res))
    } else if (res.code == 2) {
      return cb(1, res.data)
    }
  })
}

// 用户登录
export function userLogin(data) {
  return api.fetch('userLogin', formatFormData(data)).then(res => {
    if (res.code != 11) {
      return cb(0, resMsg(res))
    } else if (res.code == 11) {
      return getUserInfo({
        uid: data.uid
      })
    }
  })
}

// 获取用户信息
export function getUserInfo(data) {
  return api.fetch('myInfo', formatFormData(data)).then(res => {
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data[0])
    }
  })
}

// 管理员登录
export function adminLogin(data) {
  return api.fetch('login', formatFormData(data)).then(res => {
    if (res.code != 11) {
      return cb(0, resMsg(res))
    } else if (res.code == 11) {
      return cb(1)
    }
  }).catch(err => console.error(err))
}

// 预约书
export function reserveBook(data) {
  return api.fetch('reserve', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 15) {
      return cb(0, resMsg(res))
    } else if (res.code == 15) {
      return cb(1)
    }
  })
}
// 取消预定
export function cancelReserve(data) {
  return api.fetch('unreserve', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 19) {
      return cb(0, resMsg(res))
    } else if (res.code == 19) {
      return cb(1)
    }
  })
}

// 用户借书信息
export function userBorrow (data) {
  return api.fetch('userBookInfo', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data)
    }
  })
}
// 用户借书历史
export function userBorrowHistory (data) {
  return api.fetch('userBorrowHistory', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data)
    }
  })
}
// 用户预订信息
export function userBook (data) {
  return api.fetch('reserveBook', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data)
    }
  })
}
// 用户预订历史
export function userBookHistory (data) {
  return api.fetch('reserveHistory', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data)
    }
  })
}
// 计算借书费用
function calcExpence(borrowtime) {
  let today = DateUtils.format(Date.now())
  let days = DateUtils.getDays(today, borrowtime)
  let price = 0;
  if (days <= 30) {
    price += days * 1
  } else if (days <= 45) {
    price += 30 + ((days - 30) * 2)
  } else {
    price += 30 + 30 + ((days - 45) * 3)
  }
  return price + 1
}

// 用户借书所有信息
export function userBookInfo (data) {
  let info = []
  let sequence = Promise.resolve()
  sequence = sequence.then(() => {
    return userBorrow(data).then(res => {
      res.type && res.msg.forEach(item => {
        info.push({
          recordType: 'borrow',
          borrowexpense: calcExpence(item.borrowtime),
          ...item
        })
      });
    }).catch(err => Promise.reject(err)) // api
  })
  sequence = sequence.then(() => {
    return userBook(data).then(res => {
      res.type && res.msg.forEach(item => {
        info.push({
          recordType: 'reserve',
          reserveexpense: 10,
          ...item
        })
      });
    }).catch(err => Promise.reject(err)) // api
  })
  return sequence.then(() => {
    console.log(info)
    return Promise.resolve(cb(1, info))
  }, error => {
    return Promise.resolve(cb(0, error))
  })
}

// 用户借书历史信息
export function userHistory (data) {
  let info = []
  let sequence = Promise.resolve()
  sequence = sequence.then(() => {
    return userBorrowHistory(data).then(res => {
      res.type && res.msg.forEach(item => {
        info.push({
          recordType: 'borrow',
          status: 'returned',
          ...item
        })
      });
    }).catch(err => Promise.reject(err)) // api
  })
  sequence = sequence.then(() => {
    return userBookHistory(data).then(res => {
      res.type && res.msg.forEach(item => {
        return everyBook({
          bookid: item.bookid
        }).then(book => {
          info.push({
            recordType: 'book',
            name: book.type ? book.msg.name : 'Not Found',
            location: book.type ? book.msg.location : 'Not Found',
            status: 'taked',
            ...item
          })
        })
      });
    }).catch(err => Promise.reject(err)) // api
  })
  return sequence.then(() => {
    console.log(info)
    return Promise.resolve(cb(1, info))
  }, error => {
    return Promise.resolve(cb(0, error))
  })
}

// 获取所有用户信息
export function getAllUser() {
  return api.fetch('getUser').then(res => {
    if (res.code != 22) {
      return cb(0, resMsg(res))
    } else if (res.code == 22) {
      return cb(1, res.data)
    }
  })
}

// 还书
export function returnBook (data) {
  return api.fetch('returnBook', formatFormData(data)).then(res => {
    console.log(res);
    if (res.code != 19) {
      return cb(0, resMsg(res))
    } else if (res.code == 19) {
      return cb(1)
    }
  })
}

// 预约后借书
export function borrowReserve (data) {
  return api.fetch('borrowReserve', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 15) {
      return cb(0, resMsg(res))
    } else if (res.code == 15) {
      return cb(1)
    }
  })
}

// 取消过期预约订单
export function deleteReservation(data) {
  return api.fetch('deleteReserve', formatFormData(data)).then(res => {
    console.log(res)
    if (res.code != 19) {
      return cb(0, resMsg(res))
    } else if (res.code == 19) {
      return cb(1)
    }
  })
}