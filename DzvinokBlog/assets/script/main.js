document.addEventListener("DOMContentLoaded", function () {
	const catalogBtn = document.querySelector(".catalog-btn");
	const mobileOverlay = document.querySelector(".mobile-menu-overlay");
	const body = document.body;
	const sidebar = document.getElementById("sidebar");
	const contentWrapper = document.querySelector(".content-wrapper");
	
	if (catalogBtn && mobileOverlay) {
		catalogBtn.addEventListener("click", () => {
			body.classList.toggle("mobile-menu-active");
		});
		mobileOverlay.addEventListener("click", () => {
			body.classList.remove("mobile-menu-active");
		});
	}
	
	const dropdownButtons = document.querySelectorAll(".dropdown-btn");
	dropdownButtons.forEach((btn) => {
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			const content = this.nextElementSibling;
			if (content) content.classList.toggle("active");
		});
	});
	
	document.addEventListener("click", (e) => {
		if (!e.target.closest(".dropdown-nav")) {
			document.querySelectorAll(".dropdown-content").forEach((content) => {
				content.classList.remove("active");
			});
		}
	});
	
	// === Логика отображения и фиксации сайдбара ===
	
	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect();
		return rect.top < window.innerHeight && rect.bottom > 0;
	}
	
	const articlesBlock = document.querySelector(".content-wrapper");
	
	function handleSidebarVisibility() {
		if (articlesBlock && sidebar) {
			const isVisible = isElementInViewport(articlesBlock);
			if (isVisible) {
				sidebar.classList.remove("hidden");
				sidebar.classList.remove("collapsed");
				contentWrapper.classList.remove("sidebar-collapsed");
			} else {
				sidebar.classList.add("collapsed");
				contentWrapper.classList.add("sidebar-collapsed");
			}
		}
	}
	
	function fixSidebarPosition() {
		if (sidebar && articlesBlock) {
			const articleRect = articlesBlock.getBoundingClientRect();
			const offsetTop = Math.max(articleRect.top, 0);
			const bottom = Math.min(articleRect.bottom, window.innerHeight);
			const visibleHeight = bottom - offsetTop;
			
			if (visibleHeight > 0) {
				sidebar.style.position = "fixed";
				sidebar.style.top = offsetTop + "px";
				sidebar.style.height = visibleHeight + "px";
			} else {
				sidebar.style.height = "0px";
			}
		}
	}
	
	window.addEventListener("scroll", () => {
		handleSidebarVisibility();
		fixSidebarPosition();
	});
	window.addEventListener("resize", () => {
		handleSidebarVisibility();
		fixSidebarPosition();
	});
	
	handleSidebarVisibility();
	fixSidebarPosition();
	
	// === Навигация по категориям ===
	const menuItems = document.querySelectorAll(".sidebar .menu-item");
	let sidebarClickedRecently = false;
	
	menuItems.forEach((item) => {
		item.addEventListener("click", function (e) {
			e.preventDefault();
			
			menuItems.forEach((menuItem) => {
				menuItem.classList.remove("active");
			});
			this.classList.add("active");
			
			const categoryName = this.querySelector(".menu-text").textContent;
			document.querySelector(".section-title").textContent = categoryName;
			
			const selectedCategory = this.getAttribute("data-category");
			const productCards = document.querySelectorAll(".product-card");
			
			if (selectedCategory === "all") {
				productCards.forEach((card) => {
					card.style.display = "block";
				});
			} else {
				productCards.forEach((card) => {
					const cardCategory = card.getAttribute("data-category");
					card.style.display = cardCategory === selectedCategory ? "block" : "none";
				});
			}
			
			document.querySelectorAll(".pagination-number").forEach((num) => {
				num.classList.remove("active");
			});
			document.querySelector(".pagination-number:first-child")?.classList.add("active");
			
			// Сворачиваем сайдбар после выбора
			sidebar.classList.remove("expanded");
			sidebar.classList.add("collapsed");
			sidebarClickedRecently = true;
			setTimeout(() => {
				sidebarClickedRecently = false;
			}, 1000);
		});
	});
	
	// === Наведение мыши — разворачивание ===
	document.addEventListener("mousemove", function (e) {
		const sidebarWidth = 64;
		if (sidebarClickedRecently) return;
		if (e.clientX <= sidebarWidth) {
			sidebar.classList.add("expanded");
			sidebar.classList.remove("collapsed");
		}
	});
	
	// Scroll to top
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
			
			paginationNumbers.forEach((num) => {
				num.classList.remove("active");
			});
			this.classList.add("active");
			
			const loadingSpinner = document.querySelector(".load-more-spinner");
			const productsGrid = document.querySelector(".products-grid");
			
			if (loadingSpinner && productsGrid) {
				loadingSpinner.style.display = "block";
				productsGrid.style.opacity = "0.5";
				
				setTimeout(() => {
					loadingSpinner.style.display = "none";
					productsGrid.style.opacity = "1";
					
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
	
	// Стрелки пагинации
	const prevButton = document.querySelector(".pagination-prev");
	const nextButton = document.querySelector(".pagination-next");
	
	if (prevButton && nextButton) {
		prevButton.addEventListener("click", function (e) {
			e.preventDefault();
			if (this.classList.contains("disabled")) return;
			
			const activePage = document.querySelector(".pagination-number.active");
			if (activePage && activePage.previousElementSibling) {
				activePage.previousElementSibling.click();
				
				if (!activePage.previousElementSibling.previousElementSibling) {
					this.classList.add("disabled");
				}
				nextButton.classList.remove("disabled");
			}
		});
		
		nextButton.addEventListener("click", function (e) {
			e.preventDefault();
			if (this.classList.contains("disabled")) return;
			
			const activePage = document.querySelector(".pagination-number.active");
			if (activePage && activePage.nextElementSibling) {
				activePage.nextElementSibling.click();
				
				if (!activePage.nextElementSibling.nextElementSibling) {
					this.classList.add("disabled");
				}
				prevButton.classList.remove("disabled");
			}
		});
	}
	
	// Проверка URL параметра "category"
	function checkUrlForCategory() {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("category");
		if (category) {
			const menuItem = document.querySelector(`.menu-item[data-category="${category}"]`);
			if (menuItem) menuItem.click();
		}
	}
	
	menuItems.forEach((item) => {
		item.addEventListener("click", function () {
			const category = this.getAttribute("data-category");
			const url = new URL(window.location);
			if (category === "all") {
				url.searchParams.delete("category");
			} else {
				url.searchParams.set("category", category);
			}
			history.pushState({}, "", url);
		});
	});
	
	window.addEventListener("popstate", checkUrlForCategory);
	checkUrlForCategory();
	toggleScrollTopButton();
});