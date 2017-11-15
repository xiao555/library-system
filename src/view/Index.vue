<template>
  <div>
    <header style="margin-top: 8px">
  		<el-menu
  			theme="dark"
  			class="el-menu-demo"
  			mode="horizontal"
  		>
        <router-link :to="{ path: '/books' }">
    			<el-menu-item index="1">
    				Library
    			</el-menu-item>
        </router-link>
        <el-row style="margin: 0 20px 0 0;float: right">
        <template v-if="isLogin">
  				<el-submenu index="2">
  					<template slot="title">{{ user.uid }}</template>
  					<router-link :to="{ path: '/user/' + user.uid }">
              <el-menu-item index="2-1">Your profile</el-menu-item>
            </router-link>
  					<router-link :to="{ path: '/history/' + user.uid}">
  					  <el-menu-item index="2-2">Your history</el-menu-item>
            </router-link>
  					<a @click="logout()">
  					  <el-menu-item index="2-3">Sign out</el-menu-item>
            </a>
  				</el-submenu>
  			</template>
        <template v-else>
          <router-link :to = "{ path: '/login' }">
    				<el-menu-item index="3">
    					Sign in
    				</el-menu-item>
          </router-link>
  			</template>
      </el-row>
  		</el-menu>
  	</header>
    <main>
      <transition name="fade" mode="out-in">
        <router-view v-on:login="login" v-on:logout="logout"></router-view>
      </transition>
    </main>
    <footer-component></footer-component>
    <el-dialog title="Alert" v-model="dialogVisible" size="tiny">
			<span>Are you sure?</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel()">Cancel</el-button>
				<el-button type="primary" @click="logout()">Yes</el-button>
			</span>
		</el-dialog>
  </div>

</template>

<script>
import Footer from '../components/Footer.vue'
import * as Conn from '../utils/connection'

export default {
  name: 'index',

  components: {
    FooterComponent: Footer
  },

  data () {
    return {
      title: '',
      isLogin: false,
      dialogVisible: false
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  mounted () {
    if (sessionStorage.getItem('uid'))  {
      this.isLogin = true
      Conn.getUserInfo({
        uid: sessionStorage.getItem('uid')
      }).then(res => {
        res.type ? this.$store.state.user = res.msg : this.$message.error(res.msg)
      }).catch(err => console.error(err))
    }
    Conn.allBook().then(res => {
      if (res.type) {
        res.msg.forEach(item => {
          this.$store.state.everyBook[item.bookid] = item
          if (this.$store.state.books.hasOwnProperty(item.isbn)) {
            this.$store.state.books[item.isbn].push(item.bookid)
          } else {
            this.$store.state.books[item.isbn] = []
            this.$store.state.books[item.isbn].push(item.bookid)
          }
        });
      } else {
        this.$message.error(res.msg)
      }
    }).catch(err => console.error(err))
  },

  methods: {
    logout () {
      sessionStorage.removeItem('uid')
      this.$store.state.user = {}
      this.$store.state.carts = []
      this.dialogVisible = this.isLogin = false
      this.$router.push({ path: '/login' })
    },
    cancel () {
      this.dialogVisible = false
    },
    login () {
      this.isLogin = true
    }
  },
}
</script>

<style lang="stylus">
.el-menu
  border-radius 0
a
  text-decoration none
.el-row, .el-table
  margin 10px auto

main
  margin 0 auto
  padding 0 20px

.card
  position fixed
  left 0
  top 0
  right 0
  bottom 0
  background: rgba(0,0,0,.8)
  z-index 100
  border none
  border-radius 0
  .container
    margin 100px auto
    width 85%
    height 400px
    background #fff
    padding 20px
    border-radius 10px
    overflow-y auto
</style>
