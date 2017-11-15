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
      this.loading = true
      Conn.deleteHistory().then(res => {
        res.type ? this.success(res.msg) : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    },
    success (data) {
      let reg = /^ISBN\((\S+)\)/g
      this.borrows = []
      data.forEach(item => {
        if(reg.test(item.reason)) {
          item.reason = item.reason.replace(reg, (match, p1) => {
            item.isbn = p1
            return ''
          })
        }
        if (item.bookid !== '0') {
          this.borrows.push(item)
        }
      });
      this.loading = false
    }
  }
}
</script>
