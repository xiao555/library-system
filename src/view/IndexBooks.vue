<template>
	<div class = "container">
		<el-row>
			<el-col :span="18">
				<el-input
					placeholder="Input book name to query"
					icon="search"
					v-model = "query"
				>
				</el-input>
				<el-row :gutter = "5" style="height: 450px; overflow-y: auto">
					<el-col style = "margin-bottom: 10px; " :span = "12" v-for = "book in result" :key = "book.bookid">
						<Goods
							:item = "book"
							:choose = "addCart"
						/>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span = "6" class="aside">
				<el-row>Cart</el-row>
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
				>Booking</el-button>
			</el-col>
		</el-row>
		<el-card class="book-card" v-if="showCard">
      <div class="container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;">Booking</span>
          <el-button style="float: right; margin-left: 10px" size="small" type="danger" @click="cancel()" >Cancel</el-button>
          <el-button style="float: right;" size="small" type="primary" @click="book()" >Confirm</el-button>
        </div>
				<div class="block">
				 <el-date-picker
					 v-model="borrowTime"
					 type="daterange"
					 format="yyyy-MM-dd"
					 placeholder="select date range">
				 </el-date-picker>
				 <el-table
			    :data="carts"
			    stripe
			    style="width: 100%">
			    <el-table-column
			      prop="name"
			      label="Name">
			    </el-table-column>
			    <el-table-column
			      prop="type"
			      label="Type">
			    </el-table-column>
			    <el-table-column
			      prop="info"
			      label="Info"
						show-overflow-tooltip>
			    </el-table-column>
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
				// 用户是否登录
				userLogin: true,
				// 筛选图书条件
				query: '',
				showCard: false,
				borrowTime: '',
				imgUrl: imgUrl
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
				var self = this
				return self.books.filter(function (book) {
					return book.name.toLowerCase().indexOf(self.query.toLowerCase()) !== -1
				})
			}
		},

		methods: {
			format (time) {
				if (typeof Date.format) {
					Date.prototype.format = function(fmt) {
					  var o = {
				      "M+" : this.getMonth()+1,                 //月份
	  	        "d+" : this.getDate(),                    //日
					    "h+" : this.getHours(),                   //小时
					    "m+" : this.getMinutes(),                 //分
					    "s+" : this.getSeconds(),                 //秒
					    "q+" : Math.floor((this.getMonth()+3)/3), //季度
			        "S"  : this.getMilliseconds()             //毫秒
					  };
					  if(/(y+)/.test(fmt)) {
					    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
					  }
					  for(var k in o) {
					    if(new RegExp("("+ k +")").test(fmt)){
					      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
					    }
					  }
					  return fmt;
					}
				}
				let date = (new Date(time)).getTime();
    		return new Date(date).format("yyyy-MM-dd");
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
        })
        if (sessionStorage.getItem('uid')) {
          // 如果用户id存在，就是已登录
          this.userLogin = true
        } else {
          this.userLogin = false
        }
				this.$bar.finish()
      },
			addCart (obj) {
				const carts = this.carts
				// 要添加的这个商品是否已经存在购物车中了
				const isChong = carts.some(book => {
					return book.bookid === obj.bookid
				})

				if (isChong === false) {
					// 将商品加入购物车
					this.$store.commit('ADD_TO_CART', obj)
				} else {
					this.$message({
						message: 'The goods are already in the shopping cart'
					})
				}
			},
			removeFromCart (obj) {
				const carts = this.carts
				carts.splice(carts.indexOf(obj), 1)
			},
			order () {
				// 首先判断用户是否登录
        if (!sessionStorage.getItem('uid')) {
					this.$message.error('Please sign in first!');
					setTimeout(() => {
						this.$router.push('/login')
					}, 2000)
        } else if (this.carts.length == 0) {
					this.$message.error('The shopping cart is empty');
				} else {
					console.log(this.carts);
          this.showCard = true
        }
			},
			cancel () {
				this.showCard = false
			},
			book () {
				if (this.borrowTime == '') {
					return this.$message.error('Please select date range');
				}
				let uid = sessionStorage.getItem('uid')
				let borrowtime = this.format(this.borrowTime[0])
				let keeptime = this.format(this.borrowTime[1])
				let carts = this.carts
				let self = this
				function post() {
					// 顺序执行Promise，预订成功的移出carts，失败的返回reject并提示错误信息。
					let sequence = Promise.resolve()
					for (let i = 0, j = carts.length; i < j; i++) {
						let item = carts[i]
						let data = {
							uid: uid,
							bookid: item.bookid,
							borrowtime: borrowtime,
							keeptime: keeptime
						}
						sequence = sequence.then(() => {
							return api.fetch('borrowBook', data).then(res => {
								if (res.code != 15) {
			            let message
			            switch(res.code) {
			              case 13:
			                message = 'Inventory shortage'
			                break
			              case 14:
			                message = 'Booking failed'
			                break
			              case 16:
			                message = 'You have borrowed this book and have not returned it yet, please remove it!'
			                break
			            }
									return Promise.reject('《' + item.name + '》: ' + message)
			          } else if (res.code == 15) {
									carts.shift()
			          }
							}).catch(err => Promise.reject(err)) // api
						}) // sequence
					} // for
					return sequence
				} // post

				post().then(() => {
					this.$message({
						showClose: true,
						message: 'Success，please borrow books from library on ' + borrowtime,
						type: 'success',
						duration: 0
					});
					this.showCard = false
				}, reason => {
					this.$message({
						showClose: true,
						message: reason,
						type: 'error',
						duration: 0
					});
				}).catch(err => console.error(err))
			}
		}
	}
</script>

<style lang="stylus">
  .aside
    padding-left 20px

	.book-card
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    background: rgba(0,0,0,.8)
    z-index 100
    border none
    border-radius 0
    .container
      margin 100px auto
      width 85%
      height 400px
      background #fff
      padding 20px
      border-radius 10px
      overflow-y auto
</style>
