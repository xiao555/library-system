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
       prop="name"
       label="Name">
       <template slot-scope="scope">
        <h6><i>{{ scope.row.name }}</i></h6>
       </template>
     </el-table-column>
     <!-- <el-table-column
       prop="passwd"
       label="Passwd">
     </el-table-column> -->
     <el-table-column
       prop="account"
       label="Account">
     </el-table-column>
     <el-table-column
       prop="numofbook"
       label="Borrowed Books">
     </el-table-column>
     <el-table-column
      fixed="right"
      label="Action"
      width="180">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="recharge(scope.$index, scope.row)">Recharge</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
    </el-table-column>
   </el-table>
   <el-card class="book-card new-user" v-if="showCard">
     <div class="container">
       <div slot="header" class="clearfix">
         <span style="line-height: 36px;">{{ card.name }}</span>
         <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
         <el-button style="float: right;" size="small" type="primary" v-if="card.type == 'new'" @click="onSubmit()" >Confirm</el-button>
         <el-button style="float: right;" size="small" type="primary" v-if="card.type == 'recharge'" @click="handleRecharge()" >Confirm</el-button>
       </div>
       <el-form v-if="card.type == 'new'" ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="Name">
           <el-input v-model="user.name"></el-input>
         </el-form-item>
         <el-form-item label="Account">
           <el-input v-model="user.account" type="count"></el-input>
         </el-form-item>
       </el-form>
       <el-form v-if="card.type == 'recharge'" ref="form" :model="user" label-width="80px" name="bookinfo">
         <el-form-item label="UID">
           <el-input v-model="user.uid" disabled></el-input>
         </el-form-item>
         <el-form-item label="Amount">
           <el-input v-model="user.recharge" type="count" placeholer="Recharge amount"></el-input>
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
      user: {},
      card: {}
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
          this.users = this.$store.state.lists['users']
        }
      })
    },
    createUser () {
      this.user = {}
      this.card = {
        name: 'New User',
        type: 'new'
      }
      this.showCard = true
    },
    cancel () {
      this.showCard = false
    },
    onSubmit () {
      // if (this.user.repasswd !== this.user.passwd) {
      //   this.$message.error('The password entered twice is inconsistent');
      //   return
      // }
      let formdata = new FormData();
      formdata.append('name', this.user.name)
      formdata.append('account', this.user.account)
      api.fetch('register', formdata).then(res => {
        if (res.code != 26) {
          this.$message.error(res.msg);
        } else if (res.code == 26) {
          this.$message({
            message: 'Success',
            type: 'success'
          });
          this.showCard = false
          this.load(true)
        }
      }).catch(err => console.error(err))
    },
    recharge (index, user) {
      this.user = user
      this.card = {
        name: 'Recharge',
        type: 'recharge'
      }
      this.showCard = true
    },
    handleRecharge () {
      let formdata = new FormData();
      formdata.append('uid', this.user.uid)
      formdata.append('account', this.user.recharge)
      api.fetch('recharge', formdata).then(res => {
        console.log(res)
        if (res.code != 26) {
          this.$message.error(res.msg);
        } else if (res.code == 26) {
          this.$message({
            message: 'Success',
            type: 'success'
          });
          this.showCard = false
          this.load(true)
        }
        
      })
    },
    handleDelete (index, user) {
      let formdata = new FormData();
      formdata.append('uid', user.uid)
      api.fetch('deleteUser', formdata).then(res => {
        console.log(res)
        if (res.code != 26) {
          this.$message.error(res.msg);
        } else if (res.code == 26) {
          this.$message({
            message: 'Success',
            type: 'success'
          });
          this.showCard = false
          this.load(true)
        }
      })
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
