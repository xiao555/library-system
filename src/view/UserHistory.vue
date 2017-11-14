<template lang="html">
  <div class="container">
    <h2>Hi, {{ user.uid }}</h2>
    <div class="content">
      <h4>Your History</h4>
      <el-table
       :data="borrows"
       stripe
       style="width: 100%"
       :default-sort = "{prop: 'returntime', order: 'ascending'}"
       empty-text="No Data"
       height="400">
       <el-table-column
         prop="id"
         sortable
         label="ID"
         width="80">
       </el-table-column>
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
          <h6><i>{{ scope.row.bookname }}</i></h6>
         </template>
       </el-table-column>
       <el-table-column
         prop="borrowtime"
         label="Bor/Res Time"
         sortable>
         <template slot-scope="scope">
           {{ scope.row.borrowtime || scope.row.reservetime }}
         </template>
       </el-table-column>
       <el-table-column
        prop="returntime"
        label="Ret/Tak Time"
        sortable>
          <template slot-scope="scope">
           {{ scope.row.returntime || scope.row.taketime }}
         </template>
       </el-table-column>
       <el-table-column
        label="Expense">
        <template slot-scope="scope">
          ${{ scope.row.expense || 10}}
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
     </el-table>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {

  data () {
    return {
      borrows: []
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
    load () {
      this.$bar.start()
      Conn.userHistory({
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        this.$bar.finish()
        res.type ? this.handleInfo(res.msg) : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    handleInfo (info) {
      info.forEach(item => {
        item.id = item.returnid || item.reservehistoryid
      });
      this.borrows = info
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
      this.load()
    }
  }
}
</script>

<style lang="css">
</style>
