<template lang="html">
  <div class="container">
    <h2>Hello, {{ user.uid }}</h2>
    <div class="content">
      <h4>Your Information</h4>
      <p>Account: {{ user.account }} / Borrowing: {{ user.numofbook }}</p>
      <el-button size="small" @click="changePasswd()">change Password</el-button>
    </div>
    <div class="content">
      <h4>Your Borrow/Reserve</h4>
      <el-table
       :data="borrows"
       stripe
       style="width: 100%"
       empty-text="No Data"
       height="300">
       <el-table-column
        prop="recordType"
        label="Type"
        sortable
        width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recordType == 'borrow'" color="#784a97" style="font-weight: bold">{{ scope.row.recordType }}</el-tag>
          <el-tag v-else color="#7cd5b1" style="font-weight: bold">{{ scope.row.recordType }}</el-tag>
        </template>
      </el-table-column>
       <el-table-column
         prop="bookid"
         label="BookID">
       </el-table-column>
       <el-table-column
         prop="name"
         label="Name">
         <template slot-scope="scope">
          <h6><i>{{ scope.row.name }}</i></h6>
         </template>
       </el-table-column>
       <el-table-column
         prop="location"
         label="Location">
       </el-table-column>
       <el-table-column
         prop="borrowtime"
         label="Borrow Time">
         <template slot-scope="scope">
           {{ scope.row.hasOwnProperty('borrowtime') ? scope.row.borrowtime : scope.row.reservetime}}
         </template>
       </el-table-column>
       <el-table-column
        label="Expense">
        <template slot-scope="scope">
          ${{ scope.row.hasOwnProperty('borrowexpense') ? scope.row.borrowexpense : 
              scope.row.hasOwnProperty('reserveexpense') ? scope.row.reserveexpense : scope.row.expense}}
        </template>
      </el-table-column>
       <el-table-column
         prop="status"
         label="Status">
         <template slot-scope="scope">
          <span v-if="scope.row.status == 'returned' || scope.row.status == 'taked'" style="color: #13ce66; font-weight: bold">{{ scope.row.status }}</span>
          <span v-else style="color: #f7ba2a; font-weight: bold">{{ scope.row.status }}</span>
         </template>
       </el-table-column>
       <el-table-column
         prop="status"
         label="Action">
         <template slot-scope="scope">
          <el-button 
            v-if="scope.row.status == 'untake'" 
            size="mini"
            type="danger"
            @click="cancelReserve(scope.row)">
            cancel
          </el-button>
         </template>
       </el-table-column>
     </el-table>
    </div>
    <el-card class="card changeP" v-if="showCard">
      <div class="container">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="Old Password">
            <el-input type="password" v-model="form.oldpasswd"></el-input>
          </el-form-item>
          <el-form-item label="New Password">
            <el-input type="password" v-model="form.newpasswd"></el-input>
          </el-form-item>
          <el-form-item label="Confirm Password">
            <el-input type="password" v-model="form.confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">Confirm</el-button>
            <el-button @click="cancel">Cancel</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {

  data () {
    return {
      info: {},
      borrows: [],
      showCard: false,
      form: {}
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    load (reload = false) {
      this.$bar.start()
      if (reload)  {
        Conn.getUserInfo({
          uid: sessionStorage.getItem('uid')
        }).then(res => {
          res.type ? this.$store.state.user = res.msg : this.$message.error(res.msg)
        }).catch(err => console.error(err))
      }
      Conn.userBookInfo({
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        this.$bar.finish()
        res.type ? this.handleInfo(res.msg) : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    handleInfo (info) {
      this.borrows = []
      info.forEach(item => {
        if (!item.hasOwnProperty('bookname')) {
          if (this.$store.state.everyBook[item.bookid]) {
            item.name = this.$store.state.everyBook[item.bookid].name
            item.location = this.$store.state.everyBook[item.bookid].location
            this.borrows.push(item)
          } else {
            Conn.everyBook({
              bookid: item.bookid
            }).then(res => {
              res.type ? (item.name = res.msg.name,item.location = res.msg.location,this.borrows.push(item)) : ''
            }).catch(err => console.error(err))
          }
        } else {
          this.borrows.push(item)
        }
      })
    },
    changePasswd () {
      this.showCard = true,
      this.form = {}
    },
    cancel () {
      this.showCard = false
    },
    onSubmit () {
      if (this.form.newpasswd !== this.form.confirm) {
        return this.$message.error('The passwords entered twice are not the same')
      }
      Conn.userLogin({
        uid: sessionStorage.getItem('uid'),
        uname: this.form.oldpasswd
      }).then(res => {
        if (res.type) {
          Conn.alterPasswd({
            uid: sessionStorage.getItem('uid'),
            passwd: this.form.newpasswd
          }).then(response => {
            response.type ? this.success() : this.$message.error('Error')
          })
        } else {
          this.$message.error('Old Password Error')
        }
      }).catch(err => console.error(err))
    },
    cancelReserve (item) {
      Conn.cancelReserve({
        bookid: item.bookid,
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        res.type ? this.success() : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    success () {
      this.$message.success('Success')
      this.showCard = false
      this.load(true)
    }
  }
}
</script>

<style lang="stylus" scope>
.card.changeP .container
  max-width 400px
</style>
