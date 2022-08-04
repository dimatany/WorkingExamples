const movieItem = {
	props: ['movie'],
	methods: {
		getMovieInfo(id) {
			this.$emit('getMovie', id)
		},
		addToFavourites(id){
			this.$emit('addToFavourites', id)
		}
	},
	template: '#movieItem',
}

const Pagination = {
	props: {
		page: {
			type: Number,
			default: 1,
			required: true,
		},
		total: {
			type: Number,
			default: 0,
			required: true
		}
	},
	methods: {
		goToPage(new_page) {
			this.$emit("goToPage", new_page)
			console.log(new_page);
		},
	},
	template:  '#pagination',
}

const App = {
	data() {
		return {
			API_KEY: 'ece4f8e9',
			search: '',
			selected: ['Movie', 'Series'],
			select: 'Movie',
			movieList: [],
			movieInfo: {},
			favourite: [],
			showModal: false,
			year:'',
			rating: "",
			totalPages: 0,
			page: 1,
			perPage: 10,
		}
	},
	
	components: {
		movieItem,
		Pagination,
	},
	created() {
		this.favourite = JSON.parse(localStorage.getItem('user_favourites')) || []
	},
	methods: {
		searchMovie() {
			if (this.search !== '') {
				axios
				.get(`https://www.omdbapi.com/?apikey=${this.API_KEY}&s=${this.search}&y=${this.year}&type=${this.select}&page=${this.page}`)
				.then(response => {
					if (response.data.Responce === 'False') {
						this.showMessage('Movie not found')
					} else {
						this.movieList = response.data.Search
						this.totalPages = Math.ceil(response.data.totalResults / 10)
					}
					
					if (this.year.length !== 0 && this.year.length !== 4 && this.year > new Date()) {
						this.showMessage('Your data is wrong')
					} else {
						this.movieList = response.data.Search
					}
				})
				.catch(error => {
					this.showMessage(`${error.code}. Try again later.`)
				})
			} else {
				this.showMessage('Enter movie title.')
			}
		},
		
		goToPage(new_page) {
			this.page = new_page
			this.searchMovie()
		},
		
		showMovieInfo() {
			this.showModal = true
		},
		
		getMovieInfo(id) {
			axios.get(`https://www.omdbapi.com/?apikey=${this.API_KEY}&i=${id}`)
			.then(response => {
				this.movieInfo = response.data
				this.showMovieInfo()
			})
			.catch(error => {
				this.showMessage(error.code)
			})
		},
		
		addToFavourites(id) {
			const index = this.movieList.findIndex((el) => el.imdbID === id)
			const index2 = this.favourite.findIndex((el) => el.imdbID === id)
			if (index2 === -1) {
				let item = this.movieList[index]
				item.inFav = true
				this.favourite.push(item);
				this.showMessage('You added the movie to the section on "Favorite"')
			} else {
				if (this.favourite.length > 1) {
					this.favourite.splice(index2, 1)
					this.showMessage("Removed your favorite")
				} else {
					this.favourite.splice(index2, 1)
					this.showMessage("List is empty.")
				}
			}
			localStorage.setItem('user_favourites', JSON.stringify(this.favourite))
		},
		
		showMessage(text) {
			let html = ''
			html += `
                    <div class='modal_overlay'>
                        <div class='my_modal text-bg-warning text-center fs-2'>
                            ${text}
                        </div>
                    </div>
                `
			document.body.insertAdjacentHTML('afterbegin', html)
			
			setTimeout(() => {
				let el = document.querySelector(".modal_overlay")
				el.classList.add('none')
				
			},800)
		},
		
		movieListWithFavourite() {
			let arr = []
			this.movieList.forEach(el => {
				let findFav =  this.favourite.find(item => {
					return el.imdbID === item.imdbID
				})
				el.inFav = findFav !== undefined
				arr.push(el)
			})
			return arr
		},
	}
}
//переключение цвета темы
function changTheme() {
	let checkBox = document.getElementById("switch");
	if (checkBox.checked === true){
		document.body.classList.toggle('dark');
	} else {
		document.body.classList.toggle('dark');
	}
}

Vue.createApp(App).mount('#app')













