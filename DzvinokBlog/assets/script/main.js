document.addEventListener("DOMContentLoaded", function () {
	// Мобильное меню
	const catalogBtn = document.querySelector(".catalog-btn");
	const mobileOverlay = document.querySelector(".mobile-menu-overlay");
	const body = document.body;
	
	if (catalogBtn && mobileOverlay) {
		catalogBtn.addEventListener("click", () => {
			body.classList.toggle("mobile-menu-active");
		});
		
		mobileOverlay.addEventListener("click", () => {
			body.classList.remove("mobile-menu-active");
		});
	}
	
	// Выпадающие меню
	const dropdownButtons = document.querySelectorAll(".dropdown-btn");
	dropdownButtons.forEach((btn) => {
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			const content = this.nextElementSibling;
			if (content) content.classList.toggle("active");
		});
	});
	
	// Закрытие выпадающих меню по клику вне
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".dropdown-nav")) {
			document.querySelectorAll(".dropdown-content").forEach((content) => {
				content.classList.remove("active");
			});
		}
	});
	
	// Боковое меню категорий
	const menuItems = document.querySelectorAll(".sidebar .menu-item");
	menuItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();
			
			// Удаляем активный класс со всех пунктов
			menuItems.forEach((menuItem) => {
				menuItem.classList.remove("active");
			});
			
			// Добавляем активный класс текущему пункту
			this.classList.add("active");
			
			// Обновляем заголовок раздела
			const categoryName = this.querySelector(".menu-text").textContent;
			document.querySelector(".section-title").textContent = categoryName;
			
			// Фильтрация карточек по категории
			const selectedCategory = this.getAttribute("data-category");
			const productCards = document.querySelectorAll(".product-card");
			
			if (selectedCategory === "all") {
				// Показать все карточки
				productCards.forEach((card) => {
					card.style.display = "block";
					setTimeout(() => {
						card.classList.add("visible");
					}, 100);
				});
			} else {
				// Показать только карточки выбранной категории
				productCards.forEach((card) => {
					const cardCategory = card.getAttribute("data-category");
					if (cardCategory === selectedCategory) {
						card.style.display = "block";
						setTimeout(() => {
							card.classList.add("visible");
						}, 100);
					} else {
						card.classList.remove("visible");
						setTimeout(() => {
							card.style.display = "none";
						}, 300);
					}
				});
			}
		});
	});
	
	// Debounce scroll event (для показа "наверх")
	const scrollToTop = document.querySelector(".scroll-to-top");
	function debounce(func, delay) {
		let timeout;
		return function () {
			clearTimeout(timeout);
			timeout = setTimeout(func, delay);
		};
	}
	
	function toggleScrollTopButton() {
		if (!scrollToTop) return;
		if (window.scrollY > 300) {
			scrollToTop.classList.add("active");
		} else {
			scrollToTop.classList.remove("active");
		}
	}
	
	window.addEventListener("scroll", debounce(toggleScrollTopButton, 100));
	
	// Плавная прокрутка вверх
	if (scrollToTop) {
		scrollToTop.addEventListener("click", function (e) {
			e.preventDefault();
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	}
	
	// Пагинация
	const paginationNumbers = document.querySelectorAll(".pagination-number");
	paginationNumbers.forEach((number) => {
		number.addEventListener("click", function (e) {
			e.preventDefault();
			
			// Убираем активный класс у всех номеров
			paginationNumbers.forEach((num) => {
				num.classList.remove("active");
			});
			
			// Добавляем активный класс текущему номеру
			this.classList.add("active");
			
			// Здесь можно добавить загрузку данных по клику на пагинацию
			// Например, эмуляция загрузки:
			const loadingSpinner = document.querySelector(".load-more-spinner");
			const productsGrid = document.querySelector(".products-grid");
			
			if (loadingSpinner && productsGrid) {
				loadingSpinner.style.display = "block";
				productsGrid.style.opacity = "0.5";
				
				// Эмуляция загрузки - через 1 секунду скрываем спиннер и показываем контент
				setTimeout(() => {
					loadingSpinner.style.display = "none";
					productsGrid.style.opacity = "1";
					
					// Анимация появления карточек
					const productCards = document.querySelectorAll(".product-card");
					productCards.forEach((card, index) => {
						card.style.opacity = "0";
						card.style.transform = "translateY(20px)";
						
						setTimeout(() => {
							card.style.opacity = "1";
							card.style.transform = "translateY(0)";
							card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
						}, 100 * index);
					});
				}, 1000);
			}
		});
	});
});