<template lang="html">
  <div class="container">
    <h2><i>{{ book.name }}</i></h2>

    <div class="content clearfix" style="min-height: 450px;">
        <div class="photo" style="width: 300px; float: left; padding: 10px;">
			<img :src="book.photo" alt="photo">
		</div>
        <div style="margin-left: 340px;">
            <p>Type: {{ book.type }}</p>
            <p>ISBN: {{ book.isbn }}</p>
            <p>Number: {{ book.number }}</p>
            <p>Location: {{ book.location }}</p>
            <p>Price: {{ book.price }}</p>
            <p>Info: {{ book.info }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {

  data () {
    return {
      book: {}
    }
  },

  computed: {
  },

  mounted () {
    this.load()
  },

  methods: {
    load () {
      this.$bar.start()
      let formdata = new FormData()
      formdata.append('isbn', this.$route.params.isbn)
      api.fetch('getBook', formdata).then(res => {
        console.log(res)
        if (res.code !== 2) {
            this.$message.error(res.msg);
        }
        let reg = /^IMG\((\S+)\)/g
        if(reg.test(res.data[0].info)) {
            res.data[0].info = res.data[0].info.replace(reg, (match, p1) => {
                res.data[0].photo = p1
                return ''
            })
        }
        this.book = res.data[0]
      }).catch(err => console.error(err))
    },
  }
}
</script>

<style lang="css">
</style>
