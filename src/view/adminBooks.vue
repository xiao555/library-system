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
            empty-text="No Data"
            style="width: 100%">
            <el-table-column
              label="BookID"
              prop="bookid">
            </el-table-column>
            <el-table-column
              label="Status"
              prop="status">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status == '10'">Available</el-tag>
                <el-tag type="warning" v-if="scope.row.status == '01'">Reserved</el-tag>
                <el-tag type="danger" v-if="scope.row.status == '00'">Borrowed</el-tag>
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
			this.load(1)
		},

    computed: {
      result () {
				var self = this
				return self.books.filter(function (book) {
					return book.name.toLowerCase().indexOf(self.query.toLowerCase()) !== -1 ||
            book.type.toLowerCase().indexOf(self.query.toLowerCase()) !== -1 ||
            book.isbn.indexOf(self.query) !== -1 ||
            book.allbook.some((val, index) => {
              return val.bookid == self.query
            })
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
                this.$store.state.books[item.isbn].indexOf(item.bookid) == -1 && this.$store.state.books[item.isbn].push(item.bookid)
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
        if (!this.$store.state.everyBook[this.book.bookid]) {
          return this.$message.error('No this book')
        }
        let isbn = this.$store.state.everyBook[this.book.bookid].isbn
        let bookid = this.book.bookid
        let reason = this.book.reason
        let self = this
        Conn.everyBook({
          bookid: bookid
        }).then(st => {
          if (st.type) {
            if (st.msg.status == '10') {
                return Conn.deleteBook({
                  bookid: bookid,
                  reason: 'ISBN('+ isbn +')' + reason,
                }).then(res => {
                  res.type ? self.success() : self.$message.error(res.msg)
                }).catch(err => console.error(err))
            } else {
              self.$message.error(bookid + ' has been borrowed/reserved, delete failed!')
            }
          } else {
            self.$message.error('Delete ' + item.name + ' failed: ' +res.msg)
          }
        }).catch(err => Promise.reject(err)) // api
      },
      success () {
        this.cancel()
        this.load(true)
        this.$message({
          message: 'Success',
          type: 'success'
        });
      },
      DeleteAll (index, book) {
        let isbn = this.book.isbn
        let reason = this.book.reason
        let books = this.$store.state.books[isbn]
        let self = this
        this.loading = true
        function post() {
					// 顺序执行Promise，预订成功的移出carts，失败的返回reject并提示错误信息。
					let sequence = Promise.resolve()
					for (let i = 0, j = books.length; i < j; i++) {
						let bookid = books[i]
						sequence = sequence.then(() => {
              return Conn.everyBook({
								bookid: bookid
							}).then(st => {
								if (st.type) {
									if (st.msg.status == '10') {
											return Conn.deleteBook({
                        bookid: bookid,
                        reason: 'ISBN('+ isbn +')' + reason,
                      }).then(res => {
                        res.type ? books.shift() : self.$message.error(bookid + ' delete failed : ' + res.msg)
                      }).catch(err => console.error(err))
									} else {
										self.$message.error(bookid + ' has been borrowed/reserved, delete failed!')
									}
								} else {
									self.$message.error('Reserve ' + item.name + ' failed: ' +res.msg)
								}
							}).catch(err => Promise.reject(err)) // api
							
						}) // sequence
					} // for
					return sequence
				} // post

				post().then(() => {
					console.log(books.length)
					if (books.length == 0) {
            Conn.deleteAllBook({
              isbn: isbn,
              reason: reason
            }).then(res => {
              if (res.type) {
                this.$message({
                  message: 'Success',
                  type: 'success',
                  duration: 2000
                });
                this.load(true)
                this.showCard = false
              } else {
                this.loading = false
                this.$message.error(res.msg)
              }
            })
					} else {
            this.load(true)
            this.showCard = false
          }
				}, reason => {
					this.$message({
						message: reason,
						type: 'error',
						duration: 2000
          });
          this.load(true)
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
