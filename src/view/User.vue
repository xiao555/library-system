<template lang="html">
  <div class="container">
    <h2>Hello, {{ user }}</h2>
    <div class="content">
      <h4>Your borrows</h4>
      <el-table
       :data="borrows"
       stripe
       style="width: 100%"
       max-height="400">
       <el-table-column
         prop="name"
         label="Name">
         <template slot-scope="scope">
          <h6><i>{{ scope.row.name }}</i></h6>
         </template>
       </el-table-column>
       <el-table-column
         prop="type"
         label="Type">
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
          <span >{{ scope.row.status == 1 ? 'borrowing' : 'returned' }}</span>
         </template>
       </el-table-column>
     </el-table>
    </div>
  </div>
</template>

<script>
import api from '@/api'

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
      api.fetch('userBookInfo', {
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        if (res.code != 22) {
          this.$bar.finish()
          let message
          switch(res.code) {
            case 21:
              message = 'Query failed, please reload.'
              break
          }
          this.$message.error(message);
        } else if (res.code == 22) {
          this.borrows = res.data
        }
      }).catch(err => console.error(err))
    },
  }
}
</script>

<style lang="css">
</style>
