<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input user name or book name to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <el-col :span="4">
      	<el-button style="width: 200; float: right" type="success" @click="borrow">Borrow</el-button>
			</el-col>
		</el-row>
    <el-table
     :data="result"
     stripe
     style="width: 100%"
     max-height="500">
     <el-table-column
       prop="user"
       label="User">
     </el-table-column>
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
     <el-table-column
      fixed="right"
      label="Action"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click="returnBook(scope.$index, scope.row)"
          type="text"
          size="small">
          Return
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
       <el-form ref="form" :model="user" label-width="80px">
         <el-form-item label="Uid">
           <el-input v-model="form.uid"></el-input>
         </el-form-item>
         <el-form-item label="Bookid">
           <el-input v-model="form.bookid"></el-input>
         </el-form-item>
       </el-form>
     </div>
   </el-card>
	</div>
</template>

<script>
import api from '@/api'

export default {

  data () {
    return {
      query: '',
      borrows: [],
      users: {},
      showCard: false,
      form: {}
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
          item.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1
      })
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    load () {
      this.$bar.start()
      api.fetch('getUser', {
        uid: sessionStorage.getItem('uid'),
        status: 1
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
          res.data.forEach(item => {
            if (this.users.hasOwnProperty(item.uid)) return;
            this.users[item.uid] = item
            api.fetch('userBookInfo', {
              uid: item.uid
            }).then(res => {
              if (res.code != 22) {
                let message
                switch(res.code) {
                  case 21:
                    message = 'Query failed, please reload.'
                    break
                }
              } else if (res.code == 22) {
                res.data.forEach(record => {
                  record['user'] = item.uname
                  record['uid'] = item.uid
                  this.borrows.push(record)
                })
              }
            }).catch(err => console.error(err))
          })
        }
      })
    },
    cancel () {
      this.showCard = true
      this.form = {}
    },
    borrow () {
      this.showCard = true
    },
    returnBook (index, item) {
      // api.fetch('returnBook', {
      //   uid: item.uid
      //   bookid: item.bookid
      // })
    },
    // 借书
    onSubmit () {

    }
  }
}
</script>

<style lang="css">
</style>
