
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
	
	// Переключение табов
	const tabItems = document.querySelectorAll(".tab-item");
	tabItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();
			tabItems.forEach((el) => el.classList.remove("active"));
			this.classList.add("active");
			// Здесь можно вставить логику фильтрации по контенту
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
});
