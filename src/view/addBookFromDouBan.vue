<template>
	<div class="container">
		<el-row >
			<el-col :span="24">
        <el-input placeholder="Input keywords to query" v-model="query" @input="search(query, queryType, start,success)">
          <el-select style="width: 150px" v-model="queryType" slot="prepend" placeholder="Choose Type">
            <el-option label="ISBN" value="1"></el-option>
            <el-option label="Book Name" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="search" @click="search"></el-button>
        </el-input>
				</el-input>
			</el-col>
      <!-- <el-col :span="6">
        <el-input v-model="count" max="100" placeholder="Input count of result"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button  type="success" @click="search">Search</el-button>
      </el-col> -->
		</el-row>
    <el-row v-loading="loading" element-loading-text="loding..." :gutter = "20" style="height: 450px; overflow-y: auto;">
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
          <el-form-item label="ISBN">
            <el-input v-model="book.isbn"></el-input>
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="book.name"></el-input>
          </el-form-item>
          <el-form-item label="Type">
            <el-input v-model="book.type"></el-input>
          </el-form-item>
          <el-form-item label="Location">
            <el-input v-model="book.location"></el-input>
          </el-form-item>
          <el-form-item label="Number">
            <el-input v-model="book.number"></el-input>
          </el-form-item>
          <el-form-item label="Price">
            <el-input v-model="book.price"></el-input>
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
  import * as _ from '../utils'
  import * as Conn from '../utils/connection'

	export default {
		name: 'addBookFromDouBan',
		data () {
			return {
        title: 'BookList',
				// 筛选图书条件
        query: '',
        queryType: 'ISBN',
        count: '',
        book: {},
        result: [],
        showCard: false,
        loading: false
			}
    },
    
    computed: {
      // 根据bookid获取书籍信息，利用防抖函数防止频繁发送请求
      search () {
        return _.debounce(function () {
          if (arguments[0] == '') return arguments[3]([])
          arguments[2]()
          api.search({
            query: arguments[0],
            type: arguments[1],
            count: 100,
          }).then(res => {
            console.log(res)
            arguments[3](res)
          }).catch(err => this.$message.error(err))
        }, 500)
      },
    },

		methods: {
      choose (book) {
				// if (!this.isLogin()) return;
        this.showCard = true
        this.book = book
      },
      upload () {
        let data = {}
        for (var item in this.book) {
          if (this.book.hasOwnProperty(item) && item !== 'myfile') {
            if (item == 'info') {
              data[item] = 'IMG(' + this.book.myfile + ')' + this.book[item]
            } else {
              data[item] = this.book[item]
            }
          }
        }
        Conn.addBook(data).then(res => {
          res.type ? this.uploadSuccess() : this.$message.error(res.msg)
        }).catch(err => console.error(err))
      },
      uploadSuccess () {
        this.cancel()
        this.$message({
          message: 'Success',
          type: 'success',
          duration: 1000
        });
      },
      cancel () {
        this.showCard = false
        this.book = {}
      },
      start () {
        this.result = []
        this.loading = true
      },
      success (data) {
        this.result = data
        this.loading = false
      }
		}
	}
</script>

<style lang="stylus">
</style>
