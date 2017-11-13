<template lang="html">
  <div class="container">
    <h2>Hello, {{ user.name }}</h2>
    <div class="content">
      <p>UID: {{ user.uid }}</p>
      <p>Account: {{ user.account }}</p>
      <p>Borrowing: {{ user.numofbook }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import * as Conn from '../utils/connection'

export default {

  data () {
    return {
      info: {}
    }
  },

  computed: {
    user () {
      return this.$store.state.user
    }
  },

  // beforeMount () {
  //   this.load()
  // },

  // methods: {
  //   load () {
  //     this.$bar.start()
  //     Conn.getUserInfo({
  //       uid: this.user.uid || sessionStorage.getItem('uid')
  //     }).then(res => {
  //       this.$bar.finish()
  //       res.type ? this.success(res.msg) : this.error(res.msg)
  //     }).catch(err => console.error(err))
  //   },
  //   success (data) {
  //     this.info = data
  //   }
  // }
}
</script>

<style lang="css">
</style>
