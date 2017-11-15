<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input keywords to query" icon="search" v-model="query">
				</el-input>
			</el-col>
		</el-row>
    <el-table
     :data="result"
     stripe
     style="width: 100%"
     :default-sort = "{prop: 'bookid', order: 'ascending'}"
     empty-text="No Data"
     max-height="500">
      <el-table-column
        prop="bookid"
        sortable
        label="BID">
      </el-table-column>
      <el-table-column
        prop="isbn"
        sortable
        label="ISBN">
      </el-table-column>
      <el-table-column
        prop="reason"
        label="Reason">
      </el-table-column>
    </el-table>
    <el-row>Tips: bookid = 0 delete all books of isbn</el-row>
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
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    },
    result () {
      if (this.query == '') return this.borrows
      return this.borrows.filter(item => {
        return item.isbn.indexOf(this.query) !== -1 ||
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
      Conn.deleteHistory().then(res => {
        res.type ? this.success(res.msg) : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    success (data) {
      this.borrows = data
    }
  }
}
</script>
