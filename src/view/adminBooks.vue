<template>
	<div class="container">
		<el-row :gutter="20">
			<el-col :span="18">
				<el-input placeholder="Input keywords to query" icon="search" v-model="query">
				</el-input>
			</el-col>
			<el-col :span="6">
      	<el-button style="width: 200; float: right" type="danger" @click="handleDelete">Delete Book</el-button>
			</el-col>
		</el-row>
    <el-table
      v-loading="loading" element-loading-text="loding..."
      :data="result"
			stripe
      empty-text="No Data"
      style="width: 100%"
      max-height="500">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table
            :data="scope.row.allbook"
            stripe
            style="width: 100%">
            <el-table-column
              label="BookID"
              prop="bookid">
            </el-table-column>
            <el-table-column
              label="Status"
              prop="status">
              <template slot-scope="scope">
                {{ scope.row.status == '00' ? 'borrowed' :
                   scope.row.status == '01' ? 'reserved' :
                                          'available'}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        label="ISBN"
        prop="isbn">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
        <template slot-scope="scope">
          <h6><i>{{ scope.row.name }}</i></h6>
        </template>
      </el-table-column>
      <el-table-column
        label="Type"
        prop="type">
      </el-table-column>
      <el-table-column
        label="Location"
        prop="location">
      </el-table-column>
      <el-table-column
        label="Number"
        prop="number">
      </el-table-column>
      <el-table-column
        label="Price"
        prop="price">
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
            @click="handleDeleteAll(scope.$index, scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card class="book-card" v-if="showCard">
      <div class="container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">{{ card.name }}</span>
          <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
          <el-button style="float: right;" size="small" type="primary" v-if="card.type == 'edit'" @click="edit($event)" >Confirm</el-button>
          <el-button style="float: right;" size="small" type="primary" v-else-if="card.type == 'del'" @click="deleteBook($event)" >Confirm</el-button>
          <el-button style="float: right;" size="small" type="primary" v-else-if="card.type == 'delall'" @click="DeleteAll($event)" >Confirm</el-button>
        </div>
        <el-form v-if="card.type == 'edit'" ref="form" :model="book" label-width="80px" name="bookinfo">
          <el-form-item label="ISBN">
            <el-input v-model="book.isbn" disabled></el-input>
          </el-form-item>
          <el-form-item label="Name">
            <el-input v-model="book.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="Location">
            <el-input v-model="book.location"></el-input>
          </el-form-item>
          <el-form-item label="Price">
            <el-input v-model="book.price"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-else-if="card.type == 'del'" ref="form" :model="book" label-width="80px" name="bookinfo">
          <el-form-item label="BookID">
            <el-input v-model="book.bookid"></el-input>
          </el-form-item>
          <el-form-item label="Reason">
            <el-input type="textarea" v-model="book.reason" autosize></el-input>
          </el-form-item>
        </el-form>
        <el-form v-else-if="card.type == 'delall'" ref="form" :model="book" label-width="80px" name="bookinfo">
          <el-form-item label="ISBN">
            <el-input v-model="book.isbn"></el-input>
          </el-form-item>
          <el-form-item label="Reason">
            <el-input type="textarea" v-model="book.reason" autosize></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
	</div>
</template>

<script>
  import api from '@/api'
  import { imgUrl } from '../../config'
  import * as Conn from '../utils/connection'

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
        file: '',
				imgUrl: imgUrl,
        imageUrl: '',
        card: {
          name: '',
          type: ''
        },
        loading: false
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
            book.type.toLowerCase().indexOf(self.query.toLowerCase()) !== -1 ||
            book.isbn.indexOf(self.query) !== -1
				})
			}
    },

		methods: {
      load (reload = false) {
				if (!reload && this.$store.state.lists.hasOwnProperty('books')) {
					return this.books = this.$store.state.lists['books']
				}
        
        if (reload || !this.$store.state.lists.hasOwnProperty('books'))
        this.$bar.start()
        this.loading = true
        Conn.allBook().then(res => {
          if (res.type) {
            res.msg.forEach(item => {
              this.$store.state.everyBook[item.bookid] = item
              if (this.$store.state.books.hasOwnProperty(item.isbn)) {
                this.$store.state.books[item.isbn].push(item.bookid)
              } else {
                this.$store.state.books[item.isbn] = []
                this.$store.state.books[item.isbn].push(item.bookid)
              }
            });
          } else {
            this.$message.error(res.msg)
          }
          this.$store.dispatch('FETCH_LISTS', {
            model: 'getBook'
          }).then(() => {
            let books = this.$store.state.lists['books']
            books.forEach(item => {
              item.allbook = []
              console.log(this.$store.state.books[item.isbn])
              this.$store.state.books[item.isbn].forEach(id => {
                item.allbook.push(this.$store.state.everyBook[id])
              })
            })
            this.books = books
            this.$bar.finish()
            this.loading = false
          })
        }).catch(err => console.error(err))
				
      },
      handleEdit (index, row) {
        this.showCard = true
        this.card = {
          name: 'Edit',
          type: 'edit'
        }
        this.book = row
      },
      cancel () {
        this.showCard = false
        this.card = {}
        this.book = {}
      },
      edit (e) {
        let formdata = new FormData()
        formdata.append('location', this.book.location)
        formdata.append('price', this.book.price)
        formdata.append('isbn', this.book.isbn)
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
      handleDelete () {
        this.showCard = true
        this.card = {
          name: 'Delete',
          type: 'del'
        }
      },
      handleDeleteAll (index, book) {
        this.showCard = true
        this.book.isbn = book.isbn
        this.card = {
          name: 'Delete',
          type: 'delall'
        }
      },
      deleteBook () {
        let formdata = new FormData()
        formdata.append('bookid', this.book.bookid)
        formdata.append('reason', this.book.reason)
        api.fetch('deleteBook', formdata).then(res => {
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
            this.cancel()
            this.load(true)
            this.$message({
              message: 'Success',
              type: 'success'
            });
          }
        }).catch(err => console.error(err))
      },
      DeleteAll (index, book) {
        let formdata = new FormData()
        formdata.append('isbn', this.book.isbn)
        formdata.append('reason', this.book.reason)
        api.fetch('deleteAllBook', formdata).then(res => {
          console.log(res)
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
            this.cancel()
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
