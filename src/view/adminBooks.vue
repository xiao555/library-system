<template>
	<div class="container">
		<el-row >
			<el-col :span="18">
				<el-input placeholder="Input book name to query" icon="search" v-model="query">
				</el-input>
			</el-col>
      <el-button style="width: 200; float: right" type="success" @click="addBook">Add Book</el-button>
		</el-row>
    <el-table
      :data="books"
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
        prop="info">
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
          <el-button style="float: right;" size="small" type="primary" v-if="cardConf.type == 'edit'" @click="edit()" >Confirm</el-button>
        </div>
        <el-form ref="form" :model="book" label-width="80px">
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
            <el-input type="textarea" v-model="book.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
	</div>
</template>

<script>
  import api from '@/api'
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
        showCard: false,
        cardConf: {
          name: '',
          type: ''
        }
			}
		},
		beforeMount () {
      this.load()
		},

		methods: {
			isLogin () {
				if (!sessionStorage.getItem('uid')) {
					this.$message.error('Please sign in first!');
					setTimeout(() => {
						this.$router.push({ path: '/admin/login' })
					}, 2000)
					return
	      }
			},
      load () {
				this.$bar.start()
        this.$store.dispatch('FETCH_LISTS', {
          model: 'getBook'
        }).then(() => {
          this.books = this.$store.state.lists['books']
        })
				this.$bar.finish()
      },
      addBook () {
				this.isLogin()
        this.showCard = true
        this.book = {}
        this.cardConf = {
          name: 'Add',
          type: 'add'
        }
      },
      handleEdit (index, row) {
				this.isLogin()
        this.showCard = true
        this.book = row
        this.cardConf = {
          name: 'Edit',
          type: 'edit'
        }
      },
      add () {
        api.fetch('addBook', {
          uid: sessionStorage.getItem('uid'),
          ...this.book
        }).then(res => {
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
            this.load()
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
      edit () {
        this.isLogin()
        api.fetch('editBook', {
          uid: sessionStorage.getItem('uid'),
          ...this.book
        }).then(res => {
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
            this.load()
            this.$message({
              message: 'Success',
              type: 'success'
            });
          }
        }).catch(err => console.error(err))
      },
      handleDelete(index, row) {
				this.isLogin()
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
            this.load()
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

<style lang="stylus">
  .book-card
    position fixed
    left 50%
    top 50%
    transform translate(-50%, -50%)
    width 400px
    z-index 9
</style>
