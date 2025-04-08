document.addEventListener("DOMContentLoaded", function () {
	// Получение необходимых элементов DOM
	const expandedMenu = document.getElementById('expanded-menu');
	const categoryContent = document.getElementById('category-content');
	const emptyState = document.getElementById('empty-state');
	const categoryTitle = document.getElementById('category-title');
	const categoryDescription = document.getElementById('category-description');
	const articlesSection = document.querySelector('.articles-section');
	const scrollToTopButton = document.querySelector('.scroll-to-top');
	const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
	const sidebarIcons = document.querySelector('.sidebar-icons');
	
	
	// Состояние
	let activeCategory = "Всі статті";
	let menuState = 'collapsed';
	let lastScrollTop = 0;
	
	// Определение размера экрана
	function isMobile() {
		return window.innerWidth <= 768;
	}
	
	// Переключение состояния меню
	function toggleMenu() {
		if (menuState === 'collapsed') {
			expandedMenu.classList.remove('collapsed');
			expandedMenu.classList.add('expanded');
			menuState = 'expanded';
			
			// Синхронизируем положение прокрутки при открытии меню
			expandedMenu.scrollTop = sidebarIcons.scrollTop;
			
			// Показываем оверлей на мобильных
			if (isMobile() && mobileMenuOverlay) {
				mobileMenuOverlay.style.display = 'block';
			}
		} else {
			expandedMenu.classList.remove('expanded');
			expandedMenu.classList.add('collapsed');
			menuState = 'collapsed';
			
			// Скрываем оверлей
			if (mobileMenuOverlay) {
				mobileMenuOverlay.style.display = 'none';
			}
		}
	}
	
	// Установка активной категории
	function setActiveCategory(category) {
		// Обновляем состояние
		activeCategory = category;
		
		// Обновляем UI - выделяем активную категорию
		document.querySelectorAll('.category-button').forEach(button => {
			if (button.getAttribute('data-category') === category) {
				button.classList.add('active');
			} else {
				button.classList.remove('active');
			}
		});
		
		// Обновляем содержимое
		if (category) {
			// Если категория "Всі статті", показываем секцию со статьями
			if (category === "Всі статті") {
				categoryContent.style.display = 'none';
				articlesSection.style.display = 'block';
				emptyState.style.display = 'none';
			} else {
				// Иначе показываем содержимое категории
				categoryTitle.textContent = category;
				categoryDescription.textContent = `Содержимое категории "${category}". Здесь будет отображаться информация, относящаяся к выбранной категории.`;
				categoryContent.style.display = 'block';
				articlesSection.style.display = 'none';
				emptyState.style.display = 'none';
			}
		} else {
			// Если категория не выбрана, показываем пустое состояние
			categoryContent.style.display = 'none';
			articlesSection.style.display = 'none';
			emptyState.style.display = 'flex';
		}
		
		// ВАЖНО: Закрываем меню после выбора категории
		// (возвращаем оригинальный функционал)
		expandedMenu.classList.remove('expanded');
		expandedMenu.classList.add('collapsed');
		menuState = 'collapsed';
		
		if (mobileMenuOverlay) {
			mobileMenuOverlay.style.display = 'none';
		}
	}
	
	// Прокрутка страницы и отображение кнопки "Наверх"
	function handleScroll() {
		const currentScrollTop = window.scrollY;
		
		// Показать/скрыть кнопку прокрутки наверх
		if (currentScrollTop > 300) {
			scrollToTopButton.classList.add('visible');
		} else {
			scrollToTopButton.classList.remove('visible');
		}
		
		// Прокрутка боковой панели на мобильных устройствах
		if (sidebarIcons) {
			// Синхронизируем прокрутку бокового меню с прокруткой страницы
			if (currentScrollTop <= 0) {
				// Если мы в самом верху страницы, сбрасываем прокрутку бокового меню
				sidebarIcons.scrollTop = 0;
			} else if (currentScrollTop + window.innerHeight >= document.documentElement.scrollHeight) {
				// Если мы внизу страницы, прокручиваем боковое меню до конца
				sidebarIcons.scrollTop = sidebarIcons.scrollHeight;
			} else {
				// В промежуточных положениях синхронизируем прокрутку пропорционально
				const scrollPercentage = currentScrollTop / (document.documentElement.scrollHeight - window.innerHeight);
				sidebarIcons.scrollTop = scrollPercentage * (sidebarIcons.scrollHeight - sidebarIcons.clientHeight);
			}
			
			// Если расширенное меню видимо, синхронизируем его тоже
			if (menuState === 'expanded') {
				expandedMenu.scrollTop = sidebarIcons.scrollTop;
			}
		}
		
		lastScrollTop = currentScrollTop;
	}
	
	// Прокрутка наверх
	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
	
	// Добавление слушателей событий
	
	// Слушатели для иконок боковой панели
	const iconButtons = document.querySelectorAll('.icon-button');
	iconButtons.forEach(button => {
		button.addEventListener('click', toggleMenu);
	});
	
	// Слушатель для кнопки закрытия меню
	document.getElementById('close-menu').addEventListener('click', () => {
		expandedMenu.classList.remove('expanded');
		expandedMenu.classList.add('collapsed');
		menuState = 'collapsed';
		
		if (mobileMenuOverlay) {
			mobileMenuOverlay.style.display = 'none';
		}
	});
	
	// Слушатель для мобильного оверлея
	if (mobileMenuOverlay) {
		mobileMenuOverlay.addEventListener('click', () => {
			expandedMenu.classList.remove('expanded');
			expandedMenu.classList.add('collapsed');
			menuState = 'collapsed';
			mobileMenuOverlay.style.display = 'none';
		});
	}
	
	// Слушатели для кнопок категорий
	const categoryButtons = document.querySelectorAll('.category-button');
	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			const category = button.getAttribute('data-category');
			setActiveCategory(category);
		});
	});
	
	// Слушатель события прокрутки
	window.addEventListener('scroll', handleScroll);
	
	// Слушатель для кнопки прокрутки наверх
	scrollToTopButton.addEventListener('click', scrollToTop);
	
	// Dropdown меню в навигации
	const dropdownBtn = document.querySelector('.dropdown-btn');
	const dropdownContent = document.querySelector('.dropdown-content');
	
	if (dropdownBtn && dropdownContent) {
		dropdownBtn.addEventListener('click', function(e) {
			e.stopPropagation();
			dropdownContent.classList.toggle('active');
			const icon = this.querySelector('i');
			if (icon) {
				icon.style.transform = dropdownContent.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
			}
		});
		
		// Закрытие dropdown при клике вне меню
		document.addEventListener('click', function() {
			if (dropdownContent.classList.contains('active')) {
				dropdownContent.classList.remove('active');
				const icon = dropdownBtn.querySelector('i');
				if (icon) {
					icon.style.transform = 'rotate(0)';
				}
			}
		});
	}
	
	// Инициализация при загрузке страницы
	setActiveCategory("Всі статті"); // Установка начальной категории
	
	// Синхронизация начальной прокрутки
	handleScroll();
});

