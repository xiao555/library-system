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
				<el-row :gutter = "20">
					<el-col style = "margin-bottom: 10px;" :span = "12" v-for = "book in books" :key = "book.bookid">
						<Goods
							:item = "book"
							:choose = "addCart"
						/>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span = "6" class="aside">
				<el-row>Borrowed</el-row>
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
				>Borrow</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>

	import Goods from '@/components/Goods.vue'
	import Cart from '@/components/Cart.vue'
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
			}
		},
		beforeMount () {
      this.load()
		},
		computed: {
			// 购物车列表，从 vuex 中获取
			carts () {
				return this.$store.state.carts
			}
		},
		methods: {
      load () {
				this.$bar.start()
        this.$store.dispatch('FETCH_LISTS', {
          model: 'getBook'
        }).then(() => {
          this.books = this.$store.state.lists['books']
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
          router.push('/login')
        } else {
          // router.push('/order')
        }
			}
		}
	}
</script>

<style lang="stylus">
  .aside
    padding-left 20px
</style>
