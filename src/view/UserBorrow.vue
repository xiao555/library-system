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
          <span v-if="scope.row.status == 'return'" style="color: #13ce66; font-weight: bold">{{ scope.row.status }}ed</span>
          <span v-else style="color: #f7ba2a; font-weight: bold">{{ scope.row.status }}</span>
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
      let data = new FormData()
      data.append('uid', sessionStorage.getItem('uid'))
      api.fetch('myBookInfo', data).then(res => {
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
