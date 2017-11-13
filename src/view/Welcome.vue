<template lang="html">
  <div class="container">
    <h1 class="title">Welcome to our Library</h1>
    <div class="img">
      <img src="../assets/image/bg.jpg" alt="img">
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    setTimeout(() => {
      this.$router.push({ path: this.$route.path.replace('/', '/books') })
    }, 2000)
  }
}
</script>

<style lang="stylus">
.title
  text-align center
  font-size 32px
  font-weight 300
  letter-spacing -0.5px
  margin-top 50px

.img
  border-radius 10%
  width 80%
  max-width 500px
  height 300px
  overflow hidden
  margin 0 auto
  position:relative

.img:after
  position absolute
  content ''
  width 100%
  height 100%
  top 0
  left 0
  border-radius 10%
  box-shadow 0 0 100px 50px rgba(255,255,255, 1) inset
</style>
