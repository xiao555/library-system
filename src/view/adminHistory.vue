<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input keywords to query" icon="search" v-model="query">
				</el-input>
			</el-col>
		</el-row>
    <el-table
     v-loading="loading" element-loading-text="loding..."
     :data="result"
     stripe
     style="width: 100%"
     :default-sort = "{prop: 'returntime', order: 'ascending'}"
     empty-text="No Data"
     max-height="500">
      <el-table-column
        prop="id"
        sortable
        label="ID">
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
        prop="uid"
        label="UID"
        sortable>
      </el-table-column>
      <el-table-column
        prop="bookid"
        label="BID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Book">
        <template slot-scope="scope">
          <h6><i>{{ scope.row.bookname }}</i></h6>
        </template>
      </el-table-column>
      <el-table-column
        prop="borrowtime"
        sortable
        label="Bor/Res Time">
        <template slot-scope="scope">
          {{ scope.row.borrowtime || scope.row.reservetime }}
        </template>
      </el-table-column>
      <el-table-column
        prop="returntime"
        sortable
        label="Return Time">
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
          <el-tag type="success" style="font-weight: bold">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
	</div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {

  data () {
    return {
      query: '',
      borrows: [],
      users: {},
      loading: false,
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    result () {
      if (this.query == '') return this.borrows
      return this.borrows.filter(item => {
        return item.uid.indexOf(this.query) !== -1 ||
          item.bookid.indexOf(this.query) !== -1
      })
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    load () {
      this.$bar.start()
      this.loading = true
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
        Conn.userHistory({
          uid: item.uid
        }).then(res => {
          res.type && res.msg.forEach(record => {
              record['uid'] = item.uid
              record['account'] = item.account
              record.id = record.returnid || record.reservehistoryid
              this.borrows.push(record)
            })
          this.loading = false
        }).catch(err => console.error(err))
      })
    },
  }
}
</script>
