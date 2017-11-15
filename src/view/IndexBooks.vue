<template>
	<div class = "container">
		<el-row>
			<el-col :xs="24" :sm="6" class="aside">
				<el-row>Cart
				<el-popover
					ref="popover1"
					placement="bottom"
					width="400"
					trigger="hover">
					<h6>Reserve Rule</h6>
					<p>The upper limit for the number of borrowed or booked books per person is 2</p>
					<p>If you book the book on Monday,Tuesday or Wednesday,then you can come to fetch the book on Friday,Saturday or Sunday.</p>
					<p>If you book the book on Thursday,Friday or Saturday ,then you can come to fetch the book on Monday,Tuesday or Wednesday.</p>
					<p>You can not book the book on Sunday.</p>
					<h6>Reservation Expence</h6>
					<p>$10 / a book</p>
					<p>If you cancel reservation, you will get $5 back.</p>
					<p>If you do not pick up the book in accordance with the specified time, the order will be canceled, the cost will not be returned</p>
				</el-popover>
				<el-button type="text" v-popover:popover1><i class="fa fa-question-circle" aria-hidden="true"></i></el-button>
				</el-row>
				
				<el-row v-if="user.hasOwnProperty('uid')">Your can reserve {{ availableBook }} books</el-row>
				<el-row>
					<el-col style = "margin-bottom: 10px;" :span = "24" v-for = "item in carts" :key = "item.bookid">
						<Cart
							:item = "item"
							:remove = "removeFromCart"
						/>
					</el-col>
				</el-row>
				<el-button
					style = "width: 100%;"
					type = "success"
					@click = "order"
					:disabled="!user.uid || (availableBook == 0 && carts.length == 0)"
				>Reserve</el-button>
			</el-col>
			<el-col :xs="24" :sm="18">
				<el-input
					placeholder="Input keywords to query"
					icon="search"
					v-model = "query"
				>
				</el-input>
				<el-row :gutter = "5" style="height: 450px; overflow-y: auto">
					<el-col style = "margin-bottom: 10px; " :xs="24" :sm="24" :md="12" v-for = "book in result" :key = "book.bookid">
						<Goods
							:item = "book"
							:choose = "addCart"
						/>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
		<el-card class="card reserve" v-if="showCard">
      <div class="container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">Reserve</span>
          <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
          <el-button style="float: right;" size="small" type="primary" @click="book()" >Confirm</el-button>
        </div>
				<div class="block">
					You should take this books on <el-tag type="primary" style="margin: 0 10px" v-for="item in borrowDate" :key="item.value">{{item.date}} - {{item.value}}</el-tag>
				 <el-table
			    :data="carts"
			    stripe
			    style="width: 100%">
					<el-table-column
			      prop="isbn"
			      label="ISBN">
			    </el-table-column>
			    <el-table-column
			      prop="name"
			      label="Name">
			    </el-table-column>
					<el-table-column
			      label="Expense">
						<template slot-scope="scope">
							<span>$10</span>
						</template>
			    </el-table-column>
			    <el-table-column
			      label="BookID">
						<template slot-scope="scope">
							<el-select v-model="scope.row.bookid" placeholder="Choose Book">
								<el-option
									v-for="item in scope.row.availableBooks"
									:key="item"
									:label="item"
									:value="item">
								</el-option>
							</el-select>
						</template>
			    </el-table-column>
			    <!-- <el-table-column
			      label="Borrow Date">
						<template slot-scope="scope">
							<el-select v-model="scope.row.reservetime" placeholder="Choose Date">
								<el-option
									v-for="item in scope.row.borrowDate"
									:key="item.value"
									:label="item.date"
									:value="item.date">
									<template>
										{{item.date}} : {{item.value}}
									</template>
								</el-option>
							</el-select>
						</template>
			    </el-table-column> -->
			  </el-table>
			 </div>
      </div>
    </el-card>
	</div>
</template>

<script>

	import Goods from '@/components/Goods.vue'
	import Cart from '@/components/Cart.vue'
	import api from '@/api'
	import { imgUrl } from '../../config'
	import * as DateUtils from '../utils/date'
	import * as Conn from '../utils/connection'
	import * as _ from '../utils'

	export default {
		name: 'IndexBooks',
		components: {
			Goods,
			Cart
		},
		data () {
			return {
        title: 'Books',
				// 书籍列表
				books: [],
				// 筛选图书条件
				query: '',
				showCard: false,
				imgUrl: imgUrl,
				availableBooks: [],
				borrowDate: {},
			}
		},
		beforeMount () {
      this.load()
		},
		computed: {
			// 购物车列表，从 vuex 中获取
			carts () {
				return this.$store.state.carts
			},
			result () {
				let res =  this.books.filter((book) => {
					return book.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
								 book.type.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 ||
								 book.isbn.indexOf(this.query) !== -1
				})
				if (res.length == 0 && this.query !== '') {
					this.$message.error('Not Found')
				}
				return res
			},
			user () {
				return this.$store.state.user
			},
			availableBook () {
				return 2 - this.user.numofbook - this.carts.length
			},
			canBook () {
				return new Date().getDay() !== 4
			}
		},

		methods: {
			showRules () {

			},
      load () {
				this.$bar.start()
        this.$store.dispatch('FETCH_LISTS', {
          model: 'getBook'
        }).then(() => {
          let books = this.$store.state.lists['books']
					let reg = /^IMG\((\S+)\)/g
					books.forEach(item => {
						if(reg.test(item.info)) {
							item.info = item.info.replace(reg, (match, p1) => {
								item.photo = p1
								return ''
							})
						} else {
							item.photo = `${imgUrl}${item.photo}.png`
						}
					})
					this.books = books
					this.$bar.finish()
        })
      },
			addCart (obj) {
				if (this.availableBook == 0) {
					return this.$message.error('Sorry,you can not reserve more books.')
				}
				const carts = this.carts
				// 要添加的这个商品是否已经存在购物车中了
				const isChong = carts.some(book => {
					return book.isbn === obj.isbn
				})

				if (isChong === false) {
					// 获取可借bookid
					obj.availableBooks = []
					this.$store.state.books[obj.isbn].forEach(item => {
						if (this.$store.state.everyBook[item].status == '10') {
							obj.availableBooks.push(item)
						}
					})
					// 获取可取书时间
					this.borrowDate = DateUtils.getBorrowDates()

					// 将商品加入购物车
					this.$store.commit('ADD_TO_CART', obj)
				} else {
					this.$message.error('This book is already in the shopping cart');
				}
			},

			removeFromCart (obj) {
				this.carts.splice(this.carts.indexOf(obj), 1)
			},
			order () {
				// 首先判断用户是否登录
        if (!sessionStorage.getItem('uid')) {
					this.$message.error('Please sign in first!');
					return setTimeout(() => {
						this.$router.push('/login')
					}, 2000)
        } else if (this.carts.length == 0) {
					this.$message.error('The shopping cart is empty');
				} else {
          this.showCard = true
        }
			},
			cancel () {
				this.showCard = false
			},
			book () {
				let uid = sessionStorage.getItem('uid')
				let carts = this.carts
				let self = this
				function post() {
					// 顺序执行Promise，预订成功的移出carts，失败的返回reject并提示错误信息。
					let sequence = Promise.resolve()
					for (let i = 0, j = carts.length; i < j; i++) {
						let item = carts[i]
						let data = {
							uid: uid,
							bookid: item.bookid || '',
							reservetime: DateUtils.format(Date.now())
						}
						sequence = sequence.then(() => {
							return Conn.everyBook({
								bookid: item.bookid
							}).then(st => {
								if (st.type) {
									if (st.msg.status == '10') {
											return Conn.reserveBook(data).then(res => {
												return res.type ? carts.shift() : Promise.reject('Reserve ' + item.name + ' failed: ' +res.msg)
											}).catch(err => Promise.reject(err)) // api
									} else {
										self.$message.error(item.bookid + ' has been borrowed, please choose another one!')
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
					console.log(this.carts.length)
					if (this.carts.length == 0) {
						this.$message({
							message: 'Success，please take books in time',
							type: 'success',
							duration: 2000
						});
						this.showCard = false
					}
				}, reason => {
					this.$message({
						message: reason,
						type: 'error',
						duration: 2000
					});
				}).then(() => {
					Conn.getUserInfo({
						uid: sessionStorage.getItem('uid')
					}).then(res => {
						res.type ? this.$store.state.user = res.msg : this.error(res.msg)
					})
				}).catch(err => console.error(err))
			}
		},
		error (msg) {
			this.$message.error(msg)
		}
	}
</script>

<style lang="stylus">
  .aside
    padding-right 20px
</style>
