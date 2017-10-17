<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<style lang="stylus">
mq-desktop = 'screen and (min-width: 1024px)'
mq-tablet = 'screen and (max-width: 1023px) and (min-width: 768px)'
mq-mobile = 'screen and (max-width: 767px)'
mq-below-desktop = 'screen and (max-width: 1023px)'

body
  border 0
  margin 0

#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>
