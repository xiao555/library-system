<template>
  <main class="login">
    <h1 class="title">{{ title }}</h1>
    <div class="panel sign-form">
      <form :model="form">
        <div class="item">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="form.uname" required>
        </div>
        <div class="item">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="form.passwd" required>
        </div>
        <div class="item">
          <input type="checkbox" id="remember" v-model="remember"><label class="checkbox" for="remember">Remeber Me</label>
        </div>
        <div class="item">
          <button class="submit login" type="button" @click="onSubmit">Login</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import api from '@/api'

export default {
  name: 'login',
  data () {
    return {
      title: 'Sign in',
      form: {
        uname: '',
        passwd: ''
      },
      remember: false
    }
  },
  methods: {
    onSubmit () {
      this.success = this.error = false
      api.fetch('login', this.form).then(res => {
        if (res.code != 11) {
          let message
          switch(res.code) {
            case 8:
              message = 'The user name or password can not be empty'
              break
            case 9:
              message = 'Username does not exist'
              break
            case 10:
              message = 'wrong user name or password'
              break
          }
          this.$message.error(message);
        } else if (res.code == 11) {
          sessionStorage.setItem('uid', res.data[0]['uid'])
          sessionStorage.setItem('uname', this.form.uname)
          this.remember && window.localStorage.setItem('username', this.form.uname)
          !this.remember && window.localStorage.removeItem('username')
          this.$store.state.user = this.form.uname
          this.$emit('login');
          this.$message({
            message: 'Success',
            type: 'success'
          });
          setTimeout(() => {
            this.$router.push({ path: this.$route.path.replace('/login', '/books') })
          }, 1000)
        }
      }).catch(err => console.error(err))
    }
  },
  beforeMount () {
    // console.log(this)
    this.form.uname = window.localStorage.getItem('username') ? window.localStorage.getItem('username') : ''
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
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
main
  clearfix()
  overflow-y auto

main.login
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
