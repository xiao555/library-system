<template>
	<div class="container">
		<el-row :gutter = "20" >
			<el-col :span="14">
				<el-input placeholder="Input book name to query" icon="search" v-model="query" :on-icon-click="search">
				</el-input>
			</el-col>
      <el-col :span="6">
        <el-input v-model="count" placeholder="Input count of result"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button  type="success" @click="search">Search</el-button>
      </el-col>
		</el-row>
    <el-row :gutter = "20" style="height: 450px; overflow-y: auto;">
      <el-col style = "margin-bottom: 10px;" :span = "12" v-for = "book in result" :key = "book.bookid">
        <el-card class="searh-item" :body-style="{ padding: '0px' }">
      		<div class="photo" style="float: left; padding: 10px;">
      			<img :src="book.myfile" alt="photo">
      		</div>
      		<div style="float: left; padding: 10px;">
      			<h6><i>{{book.name}}</i></h6>
      			<div class="bottom clearfix">
      				<p>Type: {{ book.type }}</p>
      				<el-button
      					@click="choose(book)"
      				>Upload</el-button>
      			</div>
      		</div>
      	</el-card>
      </el-col>
    </el-row>
    <el-card class="book-card" v-if="showCard">
      <div class="container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">Upload</span>
          <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
          <el-button style="float: right;" size="small" type="primary" @click="upload()" >Upload</el-button>
        </div>
        <el-form ref="form" :model="book" label-width="80px" name="bookinfo">
          <el-form-item label="Name">
            <el-input v-model="book.name"></el-input>
          </el-form-item>
          <el-form-item label="Type">
            <el-input v-model="book.type"></el-input>
          </el-form-item>
          <el-form-item label="Number">
            <el-input v-model="book.number"></el-input>
          </el-form-item>
          <el-form-item label="Info">
            <el-input type="textarea" v-model="book.info" autosize></el-input>
          </el-form-item>
          <el-form-item label="Img">
            <img :src="book.myfile" style="max-width: 240px">
          </el-form-item>

        </el-form>
      </div>
    </el-card>
	</div>
</template>

<script>
  import api from '@/api'
  import { imgUrl } from '../../config'
  import { getImageBlob } from '../utils/blob'

	export default {
		name: 'addBookFromDouBan',
		data () {
			return {
        title: 'BookList',
				// 筛选图书条件
				query: '',
        count: '',
        book: {},
        result: [],
        showCard: false
			}
		},

		methods: {
      search () {
        if (this.query == '') return []
				var self = this
				return api.search({
          query: this.query,
          count: this.count || 20,
        }).then(res => {
          this.result = res
        })
			},
			isLogin () {
				if (!sessionStorage.getItem('uid')) {
					this.$message.error('Please sign in first!');
					setTimeout(() => {
						this.$router.push({ path: '/admin/login' })
					}, 2000)
					return false
	      } else if (sessionStorage.getItem('uid') != 1) {
          this.$message.error('Permission denied, please sign in as admin!');
          setTimeout(() => {
            this.$emit('logout')
					}, 2000)
					return false
        }
        return true
			},
      choose (book) {
				// if (!this.isLogin()) return;
        this.showCard = true
        this.book = book
      },
      upload () {
        // this.isLogin()
        let formdata = new FormData()
        // let blob = getImageBlob(this.book.myfile)
        // console.log(blob);
        formdata.append('myfile', new Blob(), "photo.jpg")
        formdata.append('uid', sessionStorage.getItem('uid'))
        for (var item in this.book) {
          if (this.book.hasOwnProperty(item) && item !== 'myfile') {
            if (item == 'info') {
              formdata.append(item, 'IMG(' + this.book.myfile + ')' + this.book[item])
            } else {
              formdata.append(item, this.book[item])
            }
          }
        }
        api.addBook(formdata).then(res => {
          if (res.code != 26) {
            let message
            switch(res.code) {
              case 12:
                message = 'Invaild Data'
                break
              case 24:
                message = 'Permission denied'
                break
              case 25:
                message = 'Insert failed'
                break
            }
            this.$message.error(message);
          } else if (res.code == 26) {
            this.cancel()
            this.$message({
              message: 'Success',
              type: 'success'
            });
          }
        }).catch(err => console.error(err))
      },
      cancel () {
        this.showCard = false
        this.book = {}
      },
      addAll () {

      }
		}
	}
</script>

<style lang="stylus">
</style>
