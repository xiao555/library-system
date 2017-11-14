const url = 'http://120.78.129.29/danteng/'

export const api = {
  register: `${url}insertuser.php`,
  login: `${url}login.php`,
  userLogin: `${url}userlogin.php`,
  getUser: `${url}userinfo.php`,
  getBook: `${url}bookinfo.php`,
  borrowBook: `${url}borrow.php`,
  returnBook: `${url}return.php`,
  addBook: `${url}insertbook.php`,
  deleteBook: `${url}delete.php`,
  userBookInfo: `${url}theborrowhistory.php`,
  userBorrowHistory: `${url}borrowhistory.php`,
  editBook: `${url}alterbook.php`,
  recharge: `${url}alteruseraccount.php`,
  deductions: `${url}deleteuseraccount.php`,
  modifyBookNumber: `${url}alterbooknumber.php`,
  deleteUser: `${url}deleteuser.php`,
  deleteUserAccount: `${url}deleteuseraccount.php`,
  deleteAllBook: `${url}deleteallbook.php`,
  myBookInfo: `${url}mybookinfo.php`,
  myInfo: `${url}myinfo.php`,
  everyBook: `${url}everybook.php`,
  reserve: `${url}reserve.php`,
  unreserve: `${url}unreserve.php`,
  reserveBook: `${url}reservation.php`,
  reserveHistory: `${url}reservehistory.php`,
  borrowReserve: `${url}borrowafterrsv.php`,
  deleteReserve: `${url}deletereservation.php`,
  alterPasswd: `${url}alterpasswd.php`,
  adminAlterPasswd: `${url}adminalterpswd.php`,
  
}

export const imgUrl = 'http://120.78.129.29/danteng/img/'
