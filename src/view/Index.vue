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
        <!-- <template v-if="isLogin">
  				<el-submenu index="2">
  					<template slot="title">{{ user }}</template>
  					<el-menu-item index="2-1">
  						<router-link :to="{ path: '/user/' + user }">Your profile</router-link>
  					</el-menu-item>
  					<el-menu-item index="2-2">
  						<router-link :to="{ path: '/books' }">Your borrow</router-link>
  					</el-menu-item>
  					<el-menu-item index="2-3">
  						<router-link :to = "{ path: '/books' }">Your orders</router-link>
  					</el-menu-item>
  					<el-menu-item index="2-4">
  						<a @click="logout()">Sign out</a>
  					</el-menu-item>
  				</el-submenu>
  			</template>
        <template v-else>
          <router-link :to = "{ path: '/login' }">
    				<el-menu-item index="3">
    					Sign in
    				</el-menu-item>
          </router-link>
          <router-link :to = "{ path: '/register' }">
            <el-menu-item index="4">
    					Sign up
    				</el-menu-item>
          </router-link>
  			</template> -->
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
    console.log(sessionStorage.getItem('uname'));
    if (sessionStorage.getItem('login'))  {
      this.isLogin = true
      this.$store.state.user = sessionStorage.getItem('uname')
    }
  },

  methods: {
    logout () {
      sessionStorage.removeItem('login')
      this.$store.state.user = ''
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
  width 90%

</style>
