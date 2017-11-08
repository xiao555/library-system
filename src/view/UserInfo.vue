<template lang="html">
  <div class="container">
    <h2>Hello, {{ user }}</h2>
    <div class="content">
      <p>UID: {{ info.uid }}</p>
      <p>Account: {{ info.account }}</p>
      <p>Borrowing: {{ info.numofbook }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api'

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

  beforeMount () {
    this.load()
  },

  methods: {
    load () {
      this.$bar.start()
      let data = new FormData()
      data.append('uid', sessionStorage.getItem('uid'))
      api.fetch('myInfo', data).then(res => {
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
          this.info = res.data[0]
        }
      }).catch(err => console.error(err))
    },
  }
}
</script>

<style lang="css">
</style>
