const url = 'http://120.78.129.29/danteng/'

export const api = {
  register: `${url}insertuser.php`,
  login: `${url}login.php`,
  getUser: `${url}userinfo.php`,
  getBook: `${url}bookinfo.php`,
  borrowBook: `${url}borrow.php`,
  returnBook: `${url}return.php`,
  addBook: `${url}insertbook.php`,
  deleteBook: `${url}delete.php`,
  userBookInfo: `${url}theborrowhistory.php`,
  editBook: `${url}alterbook.php`,
  recharge: `${url}alteruseraccount.php`,
  deductions: `${url}deleteuseraccount.php`,
  modifyBookNumber: `${url}alterbooknumber.php`,
  deleteUser: `${url}deleteuser.php`,
  deleteUserAccount: `${url}deleteuseraccount.php`,
  deleteAllBook: `${url}deleteallbook.php`,
}

export const imgUrl = 'http://120.78.129.29/danteng/img/'
