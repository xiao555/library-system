<template>
  <div class="login">
    <h1 class="title">{{ title }}</h1>
    <div class="panel sign-form">
      <form v-on:keyup.enter="onSubmit">
        <div class="item">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="uname" required>
        </div>
        <div class="item">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="passwd" required>
        </div>
        <div class="item">
          <input type="checkbox" id="remember" v-model="remember"><label class="checkbox" for="remember">Remeber Me</label>
        </div>
        <div class="item">
          <button class="submit login" type="button" @click="onSubmit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {
  name: 'login',
  data () {
    return {
      title: 'Sign in',
      uname: '',
      passwd: '',
      remember: false
    }
  },
  methods: {
    onSubmit () {
      Conn.adminLogin({
        uname: this.uname,
        passwd: this.passwd
      }).then(res => {
        res.type ? this.success() : this.error(res.msg)
      }).catch(err => console.error(err))
    },
    success (data) {
      sessionStorage.setItem('admin', 1)
      this.remember ? localStorage.setItem('username', this.uname)
                    : localStorage.removeItem('username')
      this.$store.state.user = { name: this.uname }
      this.$emit('login');
      this.$message({
        message: 'Success',
        type: 'success',
        duration: 1000
      });
      setTimeout(() => {
        this.$router.push({ path: this.$route.path.replace('/login', '/booking') })
      }, 1000)
    },
    error (msg) {
      this.$message.error(msg);
    }
  },
  beforeMount () {
    this.uname = localStorage.getItem('username') ? localStorage.getItem('username') : ''
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.panel
  border 1px solid #d8dee2
  padding 20px
  margin-top 20px

form
  .item
    padding-top 10px
  label:not(.checkbox)
    display block
    margin-bottom 5px
  input
    margin 5px 0
    text-align center
    &:not([type='checkbox'])
      border 1px solid rgb(211, 211, 211)
      border-radius 5px
      height 30px
      width 100%
    &:focus
      border-color #51a7e8
      outline none
      box-shadow inset 0 1px 2px rgba(0, 0, 0, .075), 0 0 5px rgba(81, 167, 232, .5)
    &[type='checkbox']
      margin-right 10px
  button.submit
    margin 5px 0
    border 1px solid rgb(211, 211, 211)
    border-radius 5px
    height 30px
    width 100%
    color white
    border-radius 5px
    background-color #55a532
    background-image -webkit-linear-gradient(#85d063, #4f992f)
    background-image linear-gradient(#85d063, #4f992f)
    border-color #519d30
    &:hover
      cursor pointer
      opacity .8
div.login
  text-align center
  width 80%
  max-width 300px
  margin 0 auto
  padding-top 50px
  a
    color #ff9800
    &:hover
      background-color #ff9800
      color white
      padding 5px
      border-radius 5px
      font-weight 500
  .title
    text-align center
    font-size 32px
    font-weight 300
    letter-spacing -0.5px
</style>
