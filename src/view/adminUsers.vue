<template lang="html">
  <div class="container">
		<el-row :gutter = "20" >
			<el-col :span="20">
				<el-input placeholder="Input user name or id to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <el-col :span="4">
        <el-button style="float: right"  type="success" @click="createUser()">New User</el-button>
      </el-col>
		</el-row>
    <el-table
     :data="result"
     stripe
     style="width: 100%"
     max-height="500">
     <el-table-column
       prop="uid"
       label="ID">
     </el-table-column>
     <el-table-column
       prop="uname"
       label="Name">
       <template slot-scope="scope">
        <h6><i>{{ scope.row.uname }}</i></h6>
       </template>
     </el-table-column>
     <el-table-column
       prop="passwd"
       label="Passwd">
     </el-table-column>
     <!-- <el-table-column
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
    </el-table-column> -->
   </el-table>
   <el-card class="book-card new-user" v-if="showCard">
     <div class="container">
       <div slot="header" class="clearfix">
         <span style="line-height: 36px;">New User</span>
         <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
         <el-button style="float: right;" size="small" type="primary" @click="onSubmit()" >Confirm</el-button>
       </div>
       <el-form ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="Name">
           <el-input v-model="user.uname"></el-input>
         </el-form-item>
         <el-form-item label="Passwd">
           <el-input v-model="user.passwd" type="password"></el-input>
         </el-form-item>
         <el-form-item label="Confirm">
           <el-input v-model="user.repasswd"  type="password"></el-input>
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
      users: [],
      showCard: false,
      user: {}
    }
  },

  computed: {
    result () {
      if (this.query == '') return this.users
      return this.users.reduce((pre, cur) => {
        if (cur.uname.indexOf(this.query) !== -1 || cur.uid.indexOf(this.query) !== -1) pre.push(cur)
        return pre
      }, [])
    }
  },

  beforeMount () {
    this.load()
  },

  methods: {
    load (reload = false) {
      if (!reload && this.$store.state.lists.hasOwnProperty('users')) {
        return this.users = this.$store.state.lists['users']
      }
      this.$bar.start()
      this.$store.dispatch('FETCH_LISTS', {
        model: 'getUser',
        query: {
          uid: sessionStorage.getItem('uid'),
          status: 1
        }
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
          this.users = this.$store.state.lists['users']
        }
      })
    },
    createUser () {
      this.user = {}
      this.showCard = true
    },
    cancel () {
      this.showCard = false
    },
    onSubmit () {
      if (this.user.repasswd !== this.user.passwd) {
        this.$message.error('The password entered twice is inconsistent');
        return
      }
      api.fetch('register', {
        uname: this.user.uname,
        passwd: this.user.passwd
      }).then(res => {
        if (res.code != 6) {
          let message
          switch(res.code) {
            case 4:
              message = 'The data information can not be empty'
              break
            case 5:
              message = 'registration failed'
              break
          }
          this.$message.error(message);
        } else if (res.code == 6) {
          this.$message({
            message: 'Success',
            type: 'success'
          });
          this.showCard = false
          this.load(true)
        }
      }).catch(err => console.error(err))
    }
  }
}
</script>

<style lang="stylus">
.new-user form
  margin-top 50px
  input
    text-align center
</style>
