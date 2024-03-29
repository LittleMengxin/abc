(function (window, Vue, undefined) {
	var vm = new Vue({
		el: '#todoapp',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: '',
			beforeUpdate: {},
			activeBtn: 1,
			showArr: [],
			focus:'flase'
		},
		methods: {
			addTodo() {
				if (!this.newTodo.trim()) {
					return
				}
				this.dataList.push({
					id: this.dataList.length ? this.dataList.sort((a, b) => a.id - b.id)[this.dataList.length - 1]['id'] + 1 : 1,
					content: this.newTodo.trim(),
					isFinish: false
				})
				this.newTodo = ''
			},
			delTodo(index) {
				this.dataList.splice(index, 1)
			},
			delAll() {
				this.dataList = this.dataList.filter(item => !item.isFinish)
			},
			showEdit(index) {
				// this.$refs.show[index].lastElementChild.focus();
				this.focus
				this.$refs.show.forEach(item => {
					item.classList.remove('editing')
				})
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]))
			},

			updateTodo(index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1)
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},

			backTodo(index) {
				this.dataList[index].content = this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},
			hashchange() {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.all()
						this.activeBtn = 1
						break;
					case '#/active':
						this.otherAll(false)
						this.activeBtn = 2
						break;
					case '#/completed':
						this.otherAll(true)
						this.activeBtn = 3
						break;
				}
			},
			all() {
				this.showArr = this.dataList.map(() => true)
			},
			otherAll(boo) {
				this.showArr = this.dataList.map(item => item.isFinish === boo)
				if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/'
			}
		},

		watch: {
			dataList: {
				handler(newArr) {
					window.localStorage.setItem('dataList', JSON.stringify(newArr))
					this.hashchange()
				},
				deep: true
			}
		},
		computed: {
			activeNum() {
				return this.dataList.filter(item => !item.isFinish).length
			},
			toggleAll: {
				get() {
					return this.dataList.every(item => item.isFinish)
				},
				set(val) {
					this.dataList.forEach(item => {
						return item.isFinish = val
					});
				}
			}
		},
		directives: {
			focus:{
				inserted (el) {
					el.focus()
				},
				bind(el){
					el.focus()
				}
			}
		},
		created() {
			this.hashchange()
			window.onhashchange = () => {
				this.hashchange()
			}
		}

	})
})(window, Vue);
