<template>
  <footer>
    <div class="copyright">Group-12 @ 2017  <router-link :to="{ path: '/admin/login' }">Admin</router-link></div>
  </footer>
</template>

<script type="text/javascript">
  export default {
    name: 'footer'
  }
</script>

<style lang="stylus">
footer
  max-width 800px
  padding 10px 0
  margin 0 auto
  .copyright
    margin-top 30px
    text-align center
    font-weight 700
    font-size 10px
  @media mq-mobile
    width 100%
</style>
