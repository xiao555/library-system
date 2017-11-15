<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input user name or id to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <el-col :span="4">
        <el-button style="float: right"  type="success" @click="createUser()">New User</el-button>
      </el-col>
		</el-row>
    <el-table
     v-loading="loading" element-loading-text="loding..."
     :data="result"
     stripe
     style="width: 100%"
     :default-sort = "{prop: 'uid', order: 'ascending'}"
     empty-text="No Data"
     max-height="500">
     <el-table-column
       prop="uid"
       label="ID">
     </el-table-column>
     <!-- <el-table-column
       prop="name"
       label="Password">
       <template slot-scope="scope">
        <h6><i>{{ scope.row.name }}</i></h6>
       </template>
     </el-table-column> -->
     <!-- <el-table-column
       prop="passwd"
       label="Passwd">
     </el-table-column> -->
     <el-table-column
       prop="account"
       label="Account">
     </el-table-column>
     <el-table-column
       prop="numofbook"
       label="Borrowed Books">
     </el-table-column>
     <el-table-column
      fixed="right"
      label="Action"
      width="330">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="borrow(scope.$index, scope.row)">Borrow</el-button>
        <el-button
          size="mini"
          @click="recharge(scope.$index, scope.row)">Recharge</el-button>
        <el-button
          size="mini"
          @click="alter(scope.row)">Reset Password</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="Delete(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
   </el-table>
   <el-card class="book-card new-user" v-if="showCard">
     <div class="container">
       <div slot="header" class="clearfix">
         <span style="line-height: 36px;">{{ card }}</span>
         <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
         <el-button style="float: right;" size="small" type="primary" v-if="card == 'New User'" @click="onSubmit()" >Confirm</el-button>
         <el-button style="float: right;" size="small" type="primary" v-if="card == 'Recharge'" @click="handleRecharge()" >Confirm</el-button>
         <el-button style="float: right;" size="small" type="primary" v-if="card == 'Borrow'" @click="handleBorrow()" >Confirm</el-button>
       </div>
       <el-form v-if="card == 'New User'" ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="Password">
           <el-input v-model="user.name" type="password"></el-input>
         </el-form-item>
         <el-form-item label="Confirm Passwd">
           <el-input v-model="user.confirm" type="password"></el-input>
         </el-form-item>
         <el-form-item label="Account">
           <el-input v-model="user.account" type="count"></el-input>
         </el-form-item>
       </el-form>
       <el-form v-if="card == 'Recharge'" ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="UID">
           <el-input v-model="user.uid" disabled></el-input>
         </el-form-item>
         <el-form-item label="Amount">
           <el-input v-model="user.recharge" type="count" placeholer="Recharge amount"></el-input>
         </el-form-item>
       </el-form>
       <el-form v-if="card == 'Borrow'" ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="UID">
           <el-input v-model="user.uid" disabled></el-input>
         </el-form-item>
         <el-form-item label="BookID">
           <el-input v-model="user.bookid" type="text" placeholer="Please scan code input" @input="getBook(user.bookid, showBookName)"></el-input>
         </el-form-item>
         <el-form-item label="Book">
           <el-input v-model="bookname" type="text" placeholer="Your book name"></el-input>
         </el-form-item>
         <el-form-item label="Borrow Time">
           <el-input v-model="user.borrowtime" type="text" disabled></el-input>
         </el-form-item>
       </el-form>
     </div>
    </el-card>
    <el-dialog title="Alert" v-model="dialog" size="tiny">
      <p>{{ diaConf.info }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog()">Cancel</el-button>
        <el-button type="primary" @click="diaConf.action">Yes</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import api from '@/api'
import * as DateUtils from '../utils/date'
import * as Conn from '../utils/connection'
import * as _ from '../utils'

export default {

  data () {
    return {
      query: '',
      users: [],
      showCard: false,
      user: {},
      card: "",
      utils: _,
      bookname: '',
      dialog: false,
      diaConf: {
        info: '',
        action: {},
      },
      loading: false
    }
  },

  computed: {
    result () {
      if (this.query == '') return this.users
      return this.users.reduce((pre, cur) => {
        if (cur.uid.indexOf(this.query) !== -1) pre.push(cur)
        return pre
      }, [])
    },
    // 根据bookid获取书籍信息，利用防抖函数防止频繁发送请求
    getBook () {
      return _.debounce(function () {
        Conn.everyBook({
          bookid: arguments[0]
        }).then(res => {
          res.type ? arguments[1](res.msg.name) : arguments[1]('Not Found')
        }).catch(err => console.error(err))
      }, 500)
    },
  },

  beforeMount () {
    this.load(1)
  },

  methods: {
    alter (user) {
      this.dialog = true,
      this.diaConf.info = `Are you sure to reset ${user.uid}'s password?`
      this.diaConf.action = this.alterPasswd
      this.user = user
    },
    Delete (user) {
      this.dialog = true,
      this.diaConf.info = `Are you sure to delete ${user.uid}?`
      this.diaConf.action = this.handleDelete
      this.user = user
    },
    cancelDialog () {
      this.dialog = false,
      this.user = {}
    },
    alterPasswd () {
      Conn.adminAlterPasswd({
        uid: this.user.uid
      }).then(res => {
        res.type ? this.success(1) : this.$message.error(res.msg)
      })
    },
    // 加载用户信息，reload = true 强制刷新
    load (reload = false) {

      if (!reload && this.$store.state.lists.hasOwnProperty('users')) {
        return this.users = this.$store.state.lists['users']
      }
      this.$bar.start()
      this.loading = true
      this.$store.dispatch('FETCH_LISTS', {
        model: 'getUser'
      }).then(res => {
        if (res.code != 22) {
          let message
          switch(res.code) {
            case 21:
              message = 'Query failed, please reload.'
              break
          }
          this.$message.error(message);
        } else if (res.code == 22) {
          this.users = this.$store.state.lists['users']
          this.loading = false
        }
      })
    },
    // 显示书名
    showBookName (name) {
      console.log(name)
      this.bookname = name
    },
    // 显示创建用户弹出层
    createUser () {
      this.user = {}
      this.cardInfo('New User')
    },
    // 显示充值弹出层
    recharge (index, user) {
      this.user = user
      this.cardInfo('Recharge')
    },
    // 显示借书弹出层
    borrow (index, user) {
      this.user = user
      this.user.bookid = ""
      this.user.borrowtime = DateUtils.format(Date.now())
      this.cardInfo('Borrow')
    },
    // 隐藏弹出层
    cancel () {
      this.user = {}
      this.bookname = ''
      this.showCard = false
    },
    // 注册新用户
    onSubmit () {
      if (this.user.name !== this.user.confirm) {
        return this.$message.error('The passwords entered twice are not the same')
      }
      Conn.register({
        name: this.user.name,
        account: this.user.account
      }).then(res => {
        res.type ? this.success(1, res.msg.uid) : this.error(res.msg)
      }).catch(err => console.error(err))
    },
    // 充值
    handleRecharge () {
      Conn.recharge({
        uid: this.user.uid,
        account: this.user.recharge
      }).then(res => {
        res.type ? this.success(1) : this.error(res.msg)
      }).catch(err => console.error(err))
    },
    // 删除用户
    handleDelete () {
      Conn.deleteUser({
        uid: this.user.uid
      }).then(res => {
        res.type ? this.success(1) : this.error(res.msg)
      })
    },
    // 借书
    handleBorrow () {
      Conn.borrowBook(this.user).then(res => {
        res.type ? this.success(1) : this.error(res.msg)
      }).catch(err => console.error(err))
    },
    // 操作成功
    success (reload = false, id = false) {
      console.log(id)
      id ? this.$message({
        message: "New User's ID is " + id,
        type: 'success',
        showClose: true,
        duration: 0,
      }) : this.$message({
        message: 'Success',
        type: 'success'
      });
      this.user = {}
      this.showCard = false
      this.dialog = false
      reload && this.load(true)
    },
    // 操作失败
    error (msg) {
      this.$message.error(msg);
    },
    // 弹出层信息
    cardInfo (name) {
      this.card = name
      this.showCard = true
    },
  }
}
</script>

<style lang="stylus">
.new-user form
  margin-top 50px
  input
    text-align center
</style>
