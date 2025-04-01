document.addEventListener("DOMContentLoaded", function () {
	// Получение необходимых элементов DOM
	const expandedMenu = document.getElementById('expanded-menu');
	const categoryContent = document.getElementById('category-content');
	const emptyState = document.getElementById('empty-state');
	const categoryTitle = document.getElementById('category-title');
	const categoryDescription = document.getElementById('category-description');
	
	// Состояние
	let activeCategory = null;
	let menuState = 'collapsed';
	
	// Переключение состояния меню
	function toggleMenu() {
		if (menuState === 'collapsed') {
			expandedMenu.classList.remove('collapsed');
			expandedMenu.classList.add('expanded');
			menuState = 'expanded';
		} else {
			expandedMenu.classList.remove('expanded');
			expandedMenu.classList.add('collapsed');
			menuState = 'collapsed';
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
			categoryTitle.textContent = category;
			categoryDescription.textContent = `Содержимое категории "${category}". Здесь будет отображаться информация, относящаяся к выбранной категории.`;
			categoryContent.style.display = 'block';
			emptyState.style.display = 'none';
		} else {
			categoryContent.style.display = 'none';
			emptyState.style.display = 'flex';
		}
		
		// Закрываем меню на мобильных устройствах
		expandedMenu.classList.remove('expanded');
		expandedMenu.classList.add('collapsed');
		menuState = 'collapsed';
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
	});
	
	// Слушатели для кнопок категорий
	const categoryButtons = document.querySelectorAll('.category-button');
	categoryButtons.forEach(button => {
		button.addEventListener('click', () => {
			const category = button.getAttribute('data-category');
			setActiveCategory(category);
		});
	});
	
	// Инициализация с пустым состоянием
	setActiveCategory(null);
});