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
          <label for="password">Confirm Passwd</label>
          <input type="password" id="password" v-model="form.repasswd" required>
        </div>
        <div class="item">
          <button class="submit login" type="button" @click="onSubmit">Register</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import api from '@/api'

export default {
  name: 'register',
  data () {
    return {
      title: 'Sign up',
      form: {
        uname: '',
        passwd: '',
        repasswd: ''
      },
      message: '',
      success: false,
      error: false
    }
  },
  methods: {
    onSubmit () {
      if (this.form.repasswd !== this.form.passwd) {
        this.$message.error('The password entered twice is inconsistent');
        return
      }
      api.fetch('register', {
        uname: this.form.uname,
        passwd: this.form.passwd
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
          setTimeout(() => {
            this.$router.push({ path: this.$route.path.replace('/register', '/login') })
          }, 1000)
        }
      }).catch(err => console.error(err))
    }
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
