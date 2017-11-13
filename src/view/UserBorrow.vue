<template lang="html">
  <div class="container">
    <h2>Hello, {{ user.name }}</h2>
    <div class="content">
      <h4>Your borrows</h4>
      <el-table
       :data="borrows"
       stripe
       style="width: 100%"
       max-height="400">
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
         prop="recordType"
         label="Type">
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
      Conn.userBookInfo({
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        this.$bar.finish()
        res.type ? this.borrows = res.msg : this.$message.error(res.msg)
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
      this.load()
    }
  }
}
</script>

<style lang="css">
</style>
