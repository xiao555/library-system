<!-- borrowed from Nuxt! -->

<template>
  <div class="">
    <div class="header-mask">
      <div class="violet"></div>
      <div class="indigo"></div>
      <div class="blue"></div>
      <div class="green"></div>
    </div>
    <div class="progress" :style="{
      'width': percent+'%',
      'height': height,
      'background-color': canSuccess? color : failedColor,
      'opacity': show ? 1 : 0
    }"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      percent: 100,
      show: false,
      canSuccess: true,
      duration: 1000,
      height: '8px',
      color: '#fff',
      failedColor: '#ff0000',
    }
  },
  methods: {
    start () {
      this.show = true
      this.canSuccess = true
      if (this._timer) {
        clearInterval(this._timer)
        this.percent = 100
      }
      this._cut = 10000 / Math.floor(this.duration)
      this._timer = setInterval(() => {
        this.increase(this._cut * Math.random())
        if (this.percent < 5) {
          this.finish()
        }
      }, 100)
      return this
    },
    set (num) {
      this.show = true
      this.canSuccess = true
      this.percent = Math.floor(num)
      return this
    },
    get () {
      return Math.floor(this.percent)
    },
    increase (num) {
      this.percent = this.percent - Math.floor(num)
      return this
    },
    decrease (num) {
      this.percent = this.percent + Math.floor(num)
      return this
    },
    finish () {
      this.percent = 0
      this.hide()
      return this
    },
    pause () {
      clearInterval(this._timer)
      return this
    },
    hide () {
      clearInterval(this._timer)
      this._timer = null
      setTimeout(() => {
        this.show = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.percent = 100
          }, 200)
        })
      }, 500)
      return this
    },
    fail () {
      this.canSuccess = false
      return this
    }
  }
}
</script>

<style lang="stylus">
.progress {
  position: fixed;
  top: 0px;
  right: 0px;
  height: 2px;
  width: 100%;
  transition: width 1s, opacity 0.2s;
  opacity: 1;
  background-color: #efc14e;
  z-index: 999999;
}

.header-mask
  overflow hidden
  position fixed
  top 0
  width 100%
  height 8px
  z-index 999
  > div
    height 8px
    width 25%
    float left

.violet
  background #784a97
.indigo
  background #706AA1
.blue
  background #69A8C0
.green
  background #7CD5B1
</style>
