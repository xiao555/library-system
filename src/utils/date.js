// Return format date "yyyy-MM-dd"
export function format(time) {
  if (typeof Date.prototype.format == 'undefined') {
    Date.prototype.format = function (fmt) {
      var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
    }
  }
  let date = (new Date(time)).getTime();
  return new Date(date).format("yyyy-MM-dd");
}
// Calculate the number of days between two date
export function getDays(sDate1, sDate2) {
  let aDate = sDate1.split('-')
  let oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  aDate = sDate2.split('-')
  let oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  return parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
}

// 获取AddDayCount天后的日期
function getDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + m + "-" + d;
}

// 计算还书日期
export function getBorrowDates() {
  let data = []
  let weeks = ['Monday', 'Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let day = new Date().getDay()
  let start, end;
  if (day <= 3) {
    start = 4,
    end = 6
  } else {
    start = 0
    end = 2
  }
  for (let index = start; index <= end; index++) {
    data.push({
      value: weeks[index],
      date: getDateStr(index > day ? index - day + 1 : index + 7 - day + 1)
    })
  }
  return data
}