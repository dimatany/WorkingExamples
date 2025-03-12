/**
 * Управление табами для страницы Дзвінок
 * Обрабатывает переключение вкладок и корректное отображение глайдера
 */
document.addEventListener('DOMContentLoaded', () => {
	// Кэшируем DOM-элементы
	const radioButtons = document.querySelectorAll('input[type="radio"][name="tabs"]');
	const tabContents = document.querySelectorAll('.tab-content');
	const glider = document.querySelector('.glider');
	const tabContainer = document.querySelector('.tabs');
	
	/**
	 * Отображает контент для выбранной вкладки и корректирует позицию глайдера
	 * @param {Number} tabIndex - Индекс выбранной вкладки
	 * @param {String} tabId - ID выбранной вкладки
	 */
	const switchTab = (tabIndex, tabId) => {
		// Скрываем все вкладки
		tabContents.forEach(content => content.classList.remove('active'));
		
		// Показываем нужную вкладку
		const contentId = `content-${tabIndex + 1}`;
		const targetContent = document.getElementById(contentId);
		if (targetContent) {
			targetContent.classList.add('active');
		}
		
		// Обрабатываем позицию глайдера для последней вкладки
		handleGliderPosition(tabId);
	};
	
	/**
	 * Корректирует позицию глайдера для последней вкладки
	 * @param {String} tabId - ID выбранной вкладки
	 */
	const handleGliderPosition = (tabId) => {
		// Сбрасываем трансформацию для повторного применения CSS-правил
		glider.style.removeProperty('transform');
		
		// Специальная обработка только для последней вкладки
		if (tabId === 'radio-4') {
			// Используем requestAnimationFrame для выполнения после обновления рендеринга
			requestAnimationFrame(() => {
				const containerWidth = tabContainer.offsetWidth;
				const padding = parseInt(getComputedStyle(tabContainer).paddingRight) || 0;
				const gliderWidth = glider.offsetWidth;
				
				// Вычисляем максимальную позицию
				const maxPosition = containerWidth - gliderWidth - padding;
				
				// Получаем текущую позицию
				const gliderStyles = getComputedStyle(glider);
				const matrix = new DOMMatrix(gliderStyles.transform);
				
				// Корректируем позицию, если она выходит за границы
				if (matrix.m41 > maxPosition) {
					glider.style.transform = `translateX(${maxPosition}px)`;
				}
			});
		}
	};
	
	// Инициализация обработчиков событий
	radioButtons.forEach((radio, index) => {
		radio.addEventListener('change', () => switchTab(index, radio.id));
	});
	
	// Установка начального состояния
	const checkedRadio = document.querySelector('input[type="radio"][name="tabs"]:checked');
	if (checkedRadio) {
		const index = Array.from(radioButtons).indexOf(checkedRadio);
		switchTab(index, checkedRadio.id);
	}
	
	
	
	document.addEventListener('DOMContentLoaded', function() {
		// Находим все grid-контейнеры на странице
		const grids = document.querySelectorAll('.cards-grid');
		
		// Для каждого контейнера добавляем класс с количеством элементов
		grids.forEach(function(grid, index) {
			const itemsCount = grid.querySelectorAll('.card').length;
			grid.classList.add('items-' + itemsCount);
			
			// Добавляем специальную обработку для конкретных сеток
			if (index === 0) {
				// Первая сетка имеет 5 элементов
				grid.classList.add('first-grid');
			} else if (index === 1) {
				// Вторая сетка имеет 4 элемента
				grid.classList.add('second-grid');
			}
		});
	});
});