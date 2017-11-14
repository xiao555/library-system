<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input keywords to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <!-- <el-col :span="4">
      	<el-button style="width: 200; float: right" type="success" @click="borrow">Borrow</el-button>
			</el-col> -->
		</el-row>
    <el-table
     :data="result"
     stripe
     style="width: 100%"
     :default-sort = "{prop: 'borrowtime', order: 'ascending'}"
     empty-text="No Data"
     max-height="500">
      <el-table-column
        prop="recordType"
        label="Type"
        width="90">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.recordType == 'borrow'" color="#784a97" style="font-weight: bold">{{ scope.row.recordType }}</el-tag>
          <el-tag v-else color="#7cd5b1" style="font-weight: bold">{{ scope.row.recordType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="uid"
        label="UID">
      </el-table-column>
      <el-table-column
        prop="user"
        label="User">
      </el-table-column>
      <el-table-column
        prop="bookid"
        label="BID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Book">
        <template slot-scope="scope">
          <h6><i>{{ scope.row.name ? scope.row.name : scope.row.bookname }}</i></h6>
        </template>
      </el-table-column>
      <el-table-column
        prop="borrowtime"
        label="Bor/Res Time"
        sortable>
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
          <el-tag type="warning" style="font-weight: bold">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Action"
        width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 'unreturn'"
            @click="returnBook(scope.$index, scope.row)"
            type="mini"
            size="small">
            Return
          </el-button>
          <el-button 
            v-if="scope.row.status == 'untake'" 
            size="mini"
            @click="borrowReserve(scope.row)">
            borrow
          </el-button>
          <el-button 
            v-if="scope.row.status == 'untake'" 
            size="mini"
            type="danger"
            @click="cancelReserveDialog(scope.row)">
            cancel
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
          <el-form-item label="UID">
            <el-input v-model="form.uid" disabled></el-input>
          </el-form-item>
          <el-form-item label="BookID">
            <el-input v-model="form.bookid" disabled></el-input>
          </el-form-item>
          <el-form-item label="Book name">
            <el-input v-model="form.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="Take time">
            <el-input v-model="form.reservetime" disabled></el-input>
          </el-form-item>
          <el-form-item label="Expensee">
            <el-input v-model="form.reserveexpense" disabled></el-input>
          </el-form-item>
          <el-form-item label="Scanning BID">
            <el-input v-model="form.bid" placeholder="Scanning the BookID"></el-input>
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
    <el-dialog title="Alert" v-model="dialog" size="tiny">
      <p>{{ diaConf.info }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">Cancel</el-button>
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
      borrows: [],
      users: {},
      showCard: false,
      form: {},
      returnDialog: false,
      retBook: {},
      dialog: false,
      diaConf: {
        info: '',
        action: {},
        bookid: '',
      }
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
          item.uid.indexOf(this.query) !== -1 ||
          item.bookid.indexOf(this.query) !== -1
      })
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    cancelReserveDialog (item) {
      this.dialog = true,
      this.diaConf.info = `Are you sure to cancel ${item.uid}'s reserve?`
      this.diaConf.action = this.cancelReserve
      this.diaConf.bookid = item.bookid
    },
    load () {
      this.$bar.start()
      if (this.$store.state.lists.hasOwnProperty('users')) {
        return this.getUserBooks(this.$store.state.lists['users'])
      }
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
          this.getUserBooks(this.$store.state.lists['users'])
        }
      })
    },
    getUserBooks (all) {
      this.borrows = []
      all.forEach(item => {
        Conn.userBookInfo({
          uid: item.uid
        }).then(res => {
          console.log('BookInfo: ', res.type, res.msg.length)
          res.type && res.msg.forEach(record => {
            record['user'] = item.name
            record['uid'] = item.uid
            record['account'] = item.account
            if (record.name || record.bookname) {
              this.borrows.push(record)
            } else {
              if (this.$store.state.everyBook[record.bookid]) {
                record.name = this.$store.state.everyBook[record.bookid].name
                this.borrows.push(record)
              } else {
                Conn.everyBook({
                  bookid: record.bookid
                }).then(res => {
                  res.type ? (record.name = res.msg.name,this.borrows.push(record)) : ''
                }).catch(err => console.error(err))
              }
            }
          })
          console.log(this.borrows.length)
        }).catch(err => console.error(err))
      })
    },
    cancel () {
      this.showCard = false
      this.form = {}
    },
    borrowReserve (item) {
      this.showCard = true
      this.form = item
      this.form.reservetime = DateUtils.format(Date.now())
    },
    returnBook (index, item) {
      if (item.account < item.borrowexpense) {
        return this.$message.error('Insufficient account balance, please recharge.(At least $' + (item.borrowexpense - item.account) +' needed)');
      } else {
        item.needmoney = item.borrowexpense
        this.returnDialog = true
        this.retBook = item
      }
    },
    cancelDialog () {
      this.returnDialog = false
      this.retBook = {}
      this.dialog = false
    },
    handleReturn () {
      Conn.returnBook({
        uid: this.retBook.uid,
        bookid: this.retBook.bookid,
        expense: this.retBook.needmoney,
        returntime: DateUtils.format(Date.now())
      }).then(res => {
        res.type ? this.returnSuccess() : this.$message.error(res.msg)
      })
    },
    returnSuccess () {
      this.cancelDialog()
      this.load()
      this.$message({
        message: 'Success',
        type: 'success',
        duration: 1000
      });
    },
    // 预约后借书
    onSubmit () {
      if (this.form.bid !== this.form.bookid) {
        return this.$message.error('Please select the right book');
      }
      Conn.borrowReserve({
        bookid: this.form.bookid,
        uid: this.form.uid,
        borrowtime: DateUtils.format(Date.now())
      }).then(res => {
        res.type ? this.success() : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    success () {
      this.cancel()
      this.cancelDialog()
      this.load()
      this.$message({
        message: 'Success',
        type: 'success',
        duration: 1000
      });
    },
    cancelReserve () {
      Conn.deleteReservation({
        bookid: this.diaConf.bookid
      }).then(res => {
        res.type ? this.success() : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="css">
</style>
