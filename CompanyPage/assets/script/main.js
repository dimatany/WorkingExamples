/**
 * Главный скрипт для сайта Дзвінок
 * Объединяет все функциональные блоки: основные табы, управление вакансиями и сетками карточек
 */
document.addEventListener('DOMContentLoaded', () => {
	/************************************************************
	 * БЛОК 1: УПРАВЛЕНИЕ ОСНОВНЫМИ ТАБАМИ САЙТА
	 * Обрабатывает переключение основных вкладок и позиционирование глайдера
	 ************************************************************/
		
		// Кэшируем DOM-элементы основных табов
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
	
	/**
	 * Функция для переключения на указанный таб
	 * @param {String} tabId - ID радиокнопки, соответствующей нужному табу
	 */
	function activateTab(tabId) {
		// Проверяем, существует ли нужный элемент
		const radioButton = document.getElementById(tabId);
		if (!radioButton) return;
		
		// Устанавливаем состояние checked у радиокнопки
		radioButton.checked = true;
		
		// Симулируем событие change для запуска обработчиков
		const event = new Event('change', {
			'bubbles': true,
			'cancelable': true
		});
		radioButton.dispatchEvent(event);
		
		// Дополнительно выполняем ручное переключение контента
		// Скрываем все табы
		const tabContents = document.querySelectorAll('.tab-content');
		tabContents.forEach(content => content.classList.remove('active'));
		
		// Определяем номер таба из его ID (например, 'radio-3' -> 3)
		const tabNumber = tabId.split('-')[1];
		
		// Активируем нужный таб
		const targetContent = document.getElementById(`content-${tabNumber}`);
		if (targetContent) {
			targetContent.classList.add('active');
			
			// Прокручиваем страницу к началу содержимого таба
			targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		
		// Обновляем URL, чтобы можно было использовать кнопку "Назад" браузера
		history.pushState(null, null, `#${tabId}`);
	}
	
	// Добавляем функцию к глобальному объекту window, чтобы она была доступна из атрибутов onclick
	window.activateTab = activateTab;
	
	// Инициализация обработчиков событий для основных табов
	radioButtons.forEach((radio, index) => {
		radio.addEventListener('change', () => switchTab(index, radio.id));
	});
	
	// Установка начального состояния для основных табов
	const checkedRadio = document.querySelector('input[type="radio"][name="tabs"]:checked');
	if (checkedRadio) {
		const index = Array.from(radioButtons).indexOf(checkedRadio);
		switchTab(index, checkedRadio.id);
	}
	
	// Обработка хэша URL при загрузке страницы
	const hash = window.location.hash.substring(1); // Убираем символ # из начала
	if (hash && hash.startsWith('radio-')) {
		activateTab(hash);
	}
	
	/************************************************************
	 * БЛОК 2: УПРАВЛЕНИЕ GRID-СЕТКАМИ И КАРТОЧКАМИ
	 * Улучшает отображение карточек в grid-контейнерах
	 ************************************************************/
	
	/**
	 * Идентифицирует grid-контейнеры и добавляет им классы
	 * для правильного центрирования и стилизации
	 */
	function initializeGrids() {
		// Находим все grid-контейнеры на странице
		const grids = document.querySelectorAll('.cards-grid');
		
		// Для каждого контейнера добавляем класс с количеством элементов
		grids.forEach(function(grid, index) {
			const itemsCount = grid.querySelectorAll('.card').length;
			grid.classList.add('items-' + itemsCount);
			
			// Добавляем специальную обработку для конкретных сеток
			if (index === 0) {
				// Первая сетка имеет 5 элементов (Чому Дзвінок – це топ?)
				grid.classList.add('first-grid');
			} else if (index === 1) {
				// Вторая сетка имеет 4 элемента (Що знайдеш у Дзвінку?)
				grid.classList.add('second-grid');
			}
		});
	}
	
	// Запускаем инициализацию грид-контейнеров
	initializeGrids();
	
	/************************************************************
	 * БЛОК 3: УПРАВЛЕНИЕ ТАБАМИ ВАКАНСИЙ
	 * Обрабатывает переключение категорий вакансий и их отображение
	 ************************************************************/
	
	// Поддержка старой версии табов вакансий
	function handleOldVacancyTabs() {
		// Кэшируем DOM-элементы для управления вакансиями (старая версия)
		const vacancyTabs = document.querySelectorAll('.vacancies-tab');
		const vacancyGrids = document.querySelectorAll('.vacancies-grid');
		
		// Проверяем, существуют ли элементы старой версии
		if (vacancyTabs.length === 0 || vacancyGrids.length === 0) return;
		
		/**
		 * Определяет количество колонок в текущем размере экрана
		 * для правильного центрирования элементов
		 * @returns {Number} Количество колонок в текущем размере экрана
		 */
		function getColumnsCount() {
			if (window.innerWidth <= 480) {
				return 1; // Мобильные устройства
			} else if (window.innerWidth <= 768) {
				return 2; // Планшеты
			} else {
				// Десктопы - определяем количество колонок на основе ширины
				const containerWidth = document.querySelector('.about-dzvinok-cards')?.offsetWidth || 1200;
				return Math.floor(containerWidth / 300) || 3; // Предполагаем, что одна колонка примерно 300px
			}
		}
		
		/**
		 * Центрирует последние элементы в неполных рядах грид-контейнера
		 * @param {HTMLElement} grid - Грид-контейнер для обработки
		 */
		function centerLastItems(grid) {
			if (!grid) return;
			
			// Получаем все карточки в активном гриде
			const cards = grid.querySelectorAll('.vacancy-card');
			const totalCards = cards.length;
			
			// Определяем количество колонок в гриде
			const columnsCount = getColumnsCount();
			
			// Рассчитываем количество карточек в последнем ряду
			const lastRowItems = totalCards % columnsCount;
			
			// Если в последнем ряду меньше карточек, чем колонок
			if (lastRowItems > 0 && lastRowItems < columnsCount) {
				// Очищаем предыдущие классы
				cards.forEach(card => card.classList.remove('last-row-item'));
				
				// Добавляем класс для последних элементов
				for (let i = totalCards - lastRowItems; i < totalCards; i++) {
					cards[i].classList.add('last-row-item');
				}
				
				// Добавляем класс для грида
				grid.classList.add('last-row-centered');
			} else {
				grid.classList.remove('last-row-centered');
			}
		}
		
		/**
		 * Обрабатывает клик по табу вакансий
		 * @param {HTMLElement} clickedTab - Таб, по которому кликнули
		 */
		function handleVacancyTabClick(clickedTab) {
			// Удаляем активный класс у всех табов
			vacancyTabs.forEach(tab => tab.classList.remove('active'));
			
			// Добавляем активный класс кликнутому табу
			clickedTab.classList.add('active');
			
			// Получаем категорию из атрибута
			const category = clickedTab.getAttribute('data-category');
			
			// Скрываем все контейнеры с вакансиями
			vacancyGrids.forEach(grid => grid.classList.remove('active'));
			
			// Показываем контейнер с соответствующей категорией
			const activeGrid = document.querySelector(`.vacancies-grid[data-category="${category}"]`);
			if (activeGrid) {
				activeGrid.classList.add('active');
				
				// Добавляем классы для центрирования последних элементов
				// Используем setTimeout для гарантии, что DOM обновился
				setTimeout(() => centerLastItems(activeGrid), 50);
			}
		}
		
		// Добавляем обработчики кликов для каждого таба вакансий
		vacancyTabs.forEach(tab => {
			tab.addEventListener('click', function() {
				handleVacancyTabClick(this);
			});
		});
		
		// Инициализация для активного грида вакансий при загрузке
		const activeVacancyGrid = document.querySelector('.vacancies-grid.active');
		if (activeVacancyGrid) {
			centerLastItems(activeVacancyGrid);
		}
		
		// Обработчик изменения размера окна для старой версии
		window.addEventListener('resize', function() {
			// Используем общий таймер resizeTimer, объявленный в блоке 4
			const activeGrid = document.querySelector('.vacancies-grid.active');
			if (activeGrid) {
				centerLastItems(activeGrid);
			}
		});
	}
	
	// Поддержка новой версии табов вакансий
	function handleNewVacancyTabs() {
		// Кэшируем DOM-элементы для управления вакансиями (новая версия)
		const vacancyTabs = document.querySelectorAll('.vacancies-tab');
		const positionGroups = document.querySelectorAll('.positions-group');
		
		// Проверяем, существуют ли элементы новой версии
		if (vacancyTabs.length === 0 || positionGroups.length === 0) return;
		
		// Добавляем обработчики кликов для каждого таба
		vacancyTabs.forEach(tab => {
			tab.addEventListener('click', function() {
				// Убираем активный класс со всех табов
				vacancyTabs.forEach(t => t.classList.remove('active'));
				
				// Добавляем активный класс текущему
				this.classList.add('active');
				
				// Получаем категорию из атрибута
				const category = this.getAttribute('data-category');
				
				// Скрываем все группы
				positionGroups.forEach(group => group.classList.remove('active'));
				
				// Показываем нужную группу
				const targetGroup = document.querySelector(`.positions-group[data-category="${category}"]`);
				if (targetGroup) {
					targetGroup.classList.add('active');
					
					// Обновляем центрирование
					requestAnimationFrame(() => {
						updateCentering(targetGroup.querySelector('.positions-grid'));
					});
				}
			});
		});
		
		/**
		 * Обновляет центрирование элементов в последнем ряду
		 * @param {HTMLElement} grid - Грид-контейнер для обработки
		 */
		function updateCentering(grid) {
			if (!grid) return;
			
			// Определение текущего количества колонок на основе размера экрана
			let columnsCount = 3; // По умолчанию для десктопов
			
			if (window.innerWidth <= 480) {
				columnsCount = 1;
			} else if (window.innerWidth <= 768) {
				columnsCount = 2;
			}
			
			// Количество карточек
			const cards = grid.querySelectorAll('.position-card');
			const totalCards = cards.length;
			
			// Специальная обработка для последнего ряда
			const lastRowItems = totalCards % columnsCount;
			
			// Если последний ряд неполный
			if (lastRowItems > 0) {
				// Добавляем класс для грида
				grid.classList.add('last-row-incomplete');
				
				// Специальный случай для планшетов (2 колонки) с нечетным количеством элементов
				if (columnsCount === 2 && lastRowItems === 1) {
					cards[totalCards - 1].classList.add('center-in-row');
				}
				
				// Специальный случай для десктопов (3 колонки)
				if (columnsCount === 3) {
					if (lastRowItems === 1) {
						// Один элемент центрируем
						cards[totalCards - 1].classList.add('center-in-row');
					} else if (lastRowItems === 2) {
						// Два элемента должны быть размещены сбалансированно
						cards[totalCards - 2].classList.add('left-of-center');
						cards[totalCards - 1].classList.add('right-of-center');
					}
				}
			} else {
				// Если все ряды полные, убираем классы
				grid.classList.remove('last-row-incomplete');
				cards.forEach(card => {
					card.classList.remove('center-in-row', 'left-of-center', 'right-of-center');
				});
			}
		}
		
		// Инициализация при загрузке страницы
		const activeGroup = document.querySelector('.positions-group.active');
		if (activeGroup) {
			updateCentering(activeGroup.querySelector('.positions-grid'));
		}
		
		// Обработчик изменения размера окна для новой версии
		window.addEventListener('resize', function() {
			// Используем общий таймер resizeTimer, объявленный в блоке 4
			const activeGroup = document.querySelector('.positions-group.active');
			if (activeGroup) {
				updateCentering(activeGroup.querySelector('.positions-grid'));
			}
		});
	}
	
	// Проверяем и инициализируем оба варианта табов вакансий
	handleOldVacancyTabs();
	handleNewVacancyTabs();
	
	/************************************************************
	 * БЛОК 4: ГЛОБАЛЬНАЯ АДАПТИВНОСТЬ
	 * Обрабатывает изменение размера окна и перерасчет элементов
	 ************************************************************/
		
		// Обработчик изменения размера окна с предотвращением частых вызовов
	let resizeTimer;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			// Пересчитываем позицию глайдера для основных табов
			const activeRadio = document.querySelector('input[type="radio"][name="tabs"]:checked');
			if (activeRadio) {
				handleGliderPosition(activeRadio.id);
			}
			
			// Остальные обработчики resize для старых и новых табов вакансий
			// добавлены в соответствующих функциях
		}, 100); // Задержка в 100мс для оптимизации производительности
	});
});