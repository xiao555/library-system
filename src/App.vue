<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
    <chat></chat>
  </div>
</template>

<script>
import Chat from './components/Chat.vue'
export default {
  components: {
    Chat
  },
}
</script>

<style lang="stylus">
@import url("../node_modules/font-awesome/css/font-awesome.css")

mq-desktop = 'screen and (min-width: 1024px)'
mq-tablet = 'screen and (max-width: 1023px) and (min-width: 768px)'
mq-mobile = 'screen and (max-width: 767px)'
mq-below-desktop = 'screen and (max-width: 1023px)'

*, *:after, *:before
  box-sizing: border-box

body
  border 0
  margin 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

ul
  list-style none
  word-wrap break-word

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
