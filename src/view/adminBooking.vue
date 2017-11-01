<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input user name or book name to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <el-col :span="4">
      	<el-button style="width: 200; float: right" type="success" @click="borrow">Borrow</el-button>
			</el-col>
		</el-row>
    <el-table
     :data="result"
     stripe
     style="width: 100%"
     max-height="500">
     <el-table-column
       prop="user"
       label="User">
       <template slot-scope="scope">
        <h6><i>{{ scope.row.user }}({{ scope.row.uid }})</i></h6>
       </template>
     </el-table-column>
     <el-table-column
       prop="name"
       label="Book">
       <template slot-scope="scope">
        <h6><i>{{ scope.row.name }}({{ scope.row.bookid }})</i></h6>
       </template>
     </el-table-column>
     <el-table-column
       prop="borrowtime"
       label="Borrow Time">
     </el-table-column>
     <el-table-column
       prop="keeptime"
       label="Return Time">
     </el-table-column>
     <el-table-column
       prop="status"
       label="Status">
       <template slot-scope="scope">
        <span v-if="scope.row.status == 'return'" style="color: #13ce66; font-weight: bold">{{ scope.row.status }}ed</span>
        <span v-else style="color: #f7ba2a; font-weight: bold">{{ scope.row.status }}</span>
       </template>
     </el-table-column>
     <el-table-column
      fixed="right"
      label="Action"
      width="120">
      <template slot-scope="scope">
        <el-button
          v-if="scope.row.status == 'unreturn'"
          @click="returnBook(scope.$index, scope.row)"
          type="text"
          size="small">
          Return
        </el-button>
      </template>
    </el-table-column>
   </el-table>
   <el-card class="book-card new-user" v-if="showCard">
     <div class="container">
       <div slot="header" class="clearfix">
         <span style="line-height: 36px;">Borrow</span>
         <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
         <el-button style="float: right;" size="small" type="primary" @click="onSubmit()" >Confirm</el-button>
       </div>
       <el-form ref="form" :model="form" label-width="80px">
         <el-form-item label="Uid">
           <el-input v-model="form.uid"></el-input>
         </el-form-item>
         <el-form-item label="Bookid">
           <el-input v-model="form.bookid"></el-input>
         </el-form-item>
         <el-form-item label="Date">
            <el-date-picker
              v-model="form.borrowTime"
              type="daterange"
              format="yyyy-MM-dd"
              placeholder="select date range">
            </el-date-picker>
         </el-form-item>
       </el-form>
     </div>
   </el-card>
   <el-dialog title="Alert" v-model="returnDialog" size="tiny">
  			<span>Are you sure to return?</span>
  			<div>UID: {{ retBook.uid }}</div>
  			<div>BookID: {{ retBook.bookid }}</div>
        <div>Will be deducted ${{ retBook.needmoney}}</div>
  			<span slot="footer" class="dialog-footer">
  				<el-button @click="cancelDialog()">Cancel</el-button>
  				<el-button type="primary" @click="handleReturn()">Yes</el-button>
  			</span>
  		</el-dialog>
	</div>
</template>

<script>
import api from '@/api'

export default {

  data () {
    return {
      query: '',
      borrows: [],
      users: {},
      showCard: false,
      form: {},
      returnDialog: false,
      retBook: {}
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    result () {
      if (this.query == '') return this.borrows
      return this.borrows.filter(item => {
        return item.user.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          item.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
          item.uid.indexOf(this.query) !== -1
      })
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    format (time) {
      if (typeof Date.format) {
        Date.prototype.format = function(fmt) {
          var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
          };
          if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
          }
          for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
          }
          return fmt;
        }
      }
      let date = (new Date(time)).getTime();
      return new Date(date).format("yyyy-MM-dd");
    },
    getDays (sDate1,  sDate2) {
      console.log(sDate1, sDate2)
      let aDate = sDate1.split('-')  
      let oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      aDate = sDate2.split('-')
      let oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      return parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  / 24) 
    },
    load () {
      this.$bar.start()
      api.fetch('getUser').then(res => {
        if (res.code != 22) {
          let message
          switch(res.code) {
            case 21:
              message = 'Query failed, please reload.'
              break
          }
          this.$message.error(message);
        } else if (res.code == 22) {
          res.data.forEach(item => {
            if (this.users.hasOwnProperty(item.uid)) return;
            this.users[item.uid] = item
            let formdata = new FormData()
            formdata.append('uid',item.uid)
            api.fetch('userBookInfo', formdata).then(res => {
              if (res.code != 22) {
                let message
                switch(res.code) {
                  case 21:
                    message = 'Query failed, please reload.'
                    break
                }
              } else if (res.code == 22) {
                res.data.forEach(record => {
                  record['user'] = item.name
                  record['uid'] = item.uid
                  record['account'] = item.account
                  this.borrows.push(record)
                })
              }
            }).catch(err => console.error(err))
          })
        }
      })
    },
    cancel () {
      this.showCard = false
      this.form = {}
    },
    borrow () {
      this.showCard = true
    },
    returnBook (index, item) {
      let today = this.format(Date.now())
      let returnTime = item.keeptime
      let borrowTime = item.borrowtime
      let price = 0;
      if (today < returnTime) {
        price += this.getDays(today, borrowTime) * item.price
      } else {
        price += this.getDays(returnTime, borrowTime) * item.price + this.getDays(today, returnTime) * item.price * 2
      }
      if (item.account < price) {
        return this.$message.error('Insufficient account balance, please recharge.(At least $' + (price - item.account) +')');
      } else {
        item.needmoney = price
        this.returnDialog = true
        this.retBook = item
      }
    },
    cancelDialog () {
      this.returnDialog = false
      this.retBook = {}
    },
    handleReturn () {
      let money= new FormData()
      money.append('uid', this.retBook.uid)
      money.append('account', this.retBook.needmoney)
      api.fetch('deleteUserAccount', money).then(res => {
        console.log(res)
        if (res.code !== 26) {
          this.$message.error(res.msg);
        }
      })

      let formdata= new FormData()
      formdata.append('uid', this.retBook.uid)
      formdata.append('bookid', this.retBook.bookid)
      api.fetch('returnBook', formdata).then(res => {
        console.log(res);
        if (res.code != 19) {
          this.$message.error(res.code);
        } else if (res.code == 19) {
          this.cancelDialog()
          this.load()
          this.$message({
            message: 'Success',
            type: 'success',
            duration: 1000
          });
        }
      })
    },
    // 借书
    onSubmit () {
      let formdata = new FormData()
      formdata.append('uid', this.form.uid)
      formdata.append('bookid', this.form.bookid)
      if (this.form.borrowTime == '') {
        return this.$message.error('Please select date range');
      }
      let borrowtime = this.format(this.form.borrowTime[0])
      let keeptime = this.format(this.form.borrowTime[1])
      formdata.append('borrowtime', borrowtime)
      formdata.append('keeptime', keeptime)
      
      api.fetch('borrowBook', formdata).then(res => {
        if (res.code != 15) {
          let message
          switch (res.code) {
            case 13:
              message = 'You have borrowed two books'
              break;
          
            default:
              break;
          }
          this.$message.error(message);
        } else if (res.code == 15) {
          this.cancel()
          this.load()
          this.$message({
            message: 'Success',
            type: 'success',
            duration: 1000
          });
        }
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="css">
</style>
