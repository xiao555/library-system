<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="18">
				<el-input placeholder="Input book name or type to query" icon="search" v-model="query">
				</el-input>
			</el-col>
			<el-col :span="6">
      	<el-button style="width: 200; float: right" type="success" @click="addBook">Add Book</el-button>
			</el-col>
		</el-row>
    <el-table
      :data="result"
			stripe
      style="width: 100%">
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        label="Type"
        prop="type">
      </el-table-column>
      <el-table-column
        label="Number"
        prop="number">
      </el-table-column>
      <el-table-column
        label="Info"
        prop="info"
				show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="Options" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="book-card" v-if="showCard">
      <div class="container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">{{ cardConf.name }}</span>
          <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
          <el-button style="float: right;" size="small" type="primary" v-if="cardConf.type == 'add'" @click="add()" >Confirm</el-button>
          <el-button style="float: right;" size="small" type="primary" v-if="cardConf.type == 'edit'" @click="edit($event)" >Confirm</el-button>
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
            <div class="" v-if="book.photo">
              <img :src="`${imgUrl}${book.photo}.png`" style="width: 240px" alt="photo">
              <el-button size="small" type="primary" @click="changeImg(book)">Change Photo</el-button>
            </div>
						<el-upload
						  v-else
						  class="avatar-uploader"
						  action="https://jsonplaceholder.typicode.com/posts/"
						  :show-file-list="false"
							:on-change="onUploadImg"
							:auto-upload="false">
						  <img v-if="imageUrl" :src="imageUrl" class="avatar">
						  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
	</div>
</template>

<script>
  import api from '@/api'
  import { imgUrl } from '../../config'

	export default {
		name: 'adminBooks',
		data () {
			return {
        title: 'BookList',
				// 书籍列表
				books: [],
				// 筛选图书条件
				query: '',
        book: {},
        // result: [],
        showCard: false,
        cardConf: {
          name: '',
          type: ''
        },
        file: '',
				imgUrl: imgUrl,
				imageUrl: ''
			}
		},

		mounted () {
			this.load()
		},

    computed: {
      result () {
				var self = this
				return self.books.filter(function (book) {
					return book.name.toLowerCase().indexOf(self.query.toLowerCase()) !== -1 ||
						book.type.toLowerCase().indexOf(self.query.toLowerCase()) !== -1
				})
			}
    },

		methods: {
			// 上传图片钩子
			onUploadImg(file) {
				const isJPG = file.raw.type === 'image/jpeg';
        const isLt2M = file.raw.size / 1024 / 1024 < 2;

        if (!isJPG) {
          return this.$message.error('Upload picture picture can only be JPG format!');
        }
        if (!isLt2M) {
          return this.$message.error('Upload picture size can not exceed 2MB!');
        }
        this.imageUrl = URL.createObjectURL(file.raw);
      },
			// 更换图片
      changeImg (book) {
        book.photo = ''
      },

      load (reload = false) {
				if (!reload && this.$store.state.lists.hasOwnProperty('books')) {
					return this.books = this.$store.state.lists['books']
				}
				this.$bar.start()
        this.$store.dispatch('FETCH_LISTS', {
          model: 'getBook'
        }).then(() => {
          this.books = this.$store.state.lists['books']
        })
				this.$bar.finish()
      },
      addBook () {
        this.showCard = true
        this.book = {}
        this.cardConf = {
          name: 'Add',
          type: 'add'
        }
      },
      handleEdit (index, row) {
        this.showCard = true
        this.book = row
        this.cardConf = {
          name: 'Edit',
          type: 'edit'
        }
      },
      add () {
				let file = document.querySelector('.avatar-uploader input[type="file"]').files[0]
        let formdata = new FormData()
        formdata.append('myfile', file)
        formdata.append('uid', sessionStorage.getItem('uid'))
        for (var item in this.book) {
          if (this.book.hasOwnProperty(item) && item !== 'photo') {
            formdata.append(item, this.book[item])
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
            this.load(true)
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
      edit (e) {
        let formdata = new FormData()
        if (document.querySelector('#myfile input')) {
          formdata.append('myfile', document.querySelector('#myfile input').files[0])
        }
        formdata.append('uid', sessionStorage.getItem('uid'))
        for (var item in this.book) {
          if (this.book.hasOwnProperty(item) && item !== 'photo') {
            // formdata.append(item, item == 'number' ? Number(this.book[item]) : this.book[item])
            formdata.append(item, this.book[item])
          }
        }
        api.editBook(formdata).then(res => {
          if (res.code != 32) {
            console.log(res);
            let message
            switch(res.code) {
              case 30:
                message = 'Permission denied'
                break
              case 31:
                message = 'Edit failed'
                break
              case 34:
                message = 'Book not find'
                break
            }
            this.$message.error(message);
          } else if (res.code == 32) {
            this.cancel()
            this.load(true)
            this.$message({
              message: 'Success',
              type: 'success'
            });
          }
        }).catch(err => console.error(err))
      },
      handleDelete(index, row) {
        api.fetch('deleteBook', {
          uid: sessionStorage.getItem('uid'),
          bookid: row.bookid
        }).then(res => {
          if (res.code != 29) {
            let message
            switch(res.code) {
              case 27:
                message = 'Permission denied'
                break
              case 28:
                message = 'Delete failed'
                break
            }
            this.$message.error(message);
          } else if (res.code == 29) {
            this.load(true)
            this.$message({
              message: 'Success',
              type: 'success'
            });
          }
        }).catch(err => console.error(err))
      }
		}
	}
</script>

<style lang="css">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
