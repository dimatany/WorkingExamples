/**
 * Главный скрипт для сайта Дзвінок
 * Управление всеми интерактивными элементами
 */
document.addEventListener('DOMContentLoaded', () => {
	// БЛОК 1: УПРАВЛЕНИЕ ТАБАМИ
	const radioButtons = document.querySelectorAll('input[type="radio"][name="tabs"]');
	const tabContents = document.querySelectorAll('.tab-content');
	const glider = document.querySelector('.glider');
	const tabContainer = document.querySelector('.tabs');
	
	/**
	 * Переключает вкладку и настраивает глайдер
	 * @param {Number} tabIndex - Индекс вкладки
	 * @param {String} tabId - ID вкладки
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
		
		// Обрабатываем позицию глайдера
		handleGliderPosition(tabId);
	};
	
	/**
	 * Корректирует позицию глайдера на основе CSS переменных вместо инлайн-стилей
	 * @param {String} tabId - ID активной вкладки
	 */
	const handleGliderPosition = (tabId) => {
		// Используем CSS классы вместо прямых манипуляций со стилями
		// Это делает код более поддерживаемым и позволяет перенести логику в CSS
		glider.classList.remove('position-tab-1', 'position-tab-2', 'position-tab-3', 'position-tab-4');
		glider.classList.add(`position-tab-${tabId.split('-')[1]}`);
		
		// Дополнительная логика для последнего таба
		if (tabId === 'radio-4') {
			requestAnimationFrame(() => {
				const containerWidth = tabContainer.offsetWidth;
				const padding = parseInt(getComputedStyle(tabContainer).paddingRight) || 0;
				const gliderWidth = glider.offsetWidth;
				
				const maxPosition = containerWidth - gliderWidth - padding;
				
				const gliderStyles = getComputedStyle(glider);
				const matrix = new DOMMatrix(gliderStyles.transform);
				
				if (matrix.m41 > maxPosition) {
					// Применяем корректировку только если необходимо
					glider.style.transform = `translateX(${maxPosition}px)`;
				}
			});
		}
	};
	
	/**
	 * Активирует указанный таб
	 * @param {String} tabId - ID таба для активации
	 */
	function activateTab(tabId) {
		const radioButton = document.getElementById(tabId);
		if (!radioButton) return;
		
		radioButton.checked = true;
		
		// Используем кастомное событие для лучшей поддержки
		const event = new Event('change', {
			'bubbles': true,
			'cancelable': true
		});
		radioButton.dispatchEvent(event);
		
		// Скрываем все табы
		tabContents.forEach(content => content.classList.remove('active'));
		
		const tabNumber = tabId.split('-')[1];
		
		const targetContent = document.getElementById(`content-${tabNumber}`);
		if (targetContent) {
			targetContent.classList.add('active');
			targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		
		// Обновляем URL с хэшем для возможности прямых ссылок
		history.pushState(null, null, `#${tabId}`);
	}
	
	// Глобальный доступ к функции активации таба
	window.activateTab = activateTab;
	
	// Инициализация обработчиков событий для табов
	radioButtons.forEach((radio, index) => {
		radio.addEventListener('change', () => switchTab(index, radio.id));
	});
	
	// Установка начального состояния активного таба
	const checkedRadio = document.querySelector('input[type="radio"][name="tabs"]:checked');
	if (checkedRadio) {
		const index = Array.from(radioButtons).indexOf(checkedRadio);
		switchTab(index, checkedRadio.id);
	}
	
	// Обработка хэша URL для прямых ссылок на табы
	const hash = window.location.hash.substring(1);
	if (hash && hash.startsWith('radio-')) {
		activateTab(hash);
	}
	
	// БЛОК 2: УПРАВЛЕНИЕ GRID-СЕТКАМИ
	/**
	 * Инициализирует сетки с классами для правильного отображения
	 */
	function initializeGrids() {
		const grids = document.querySelectorAll('.cards-grid');
		
		grids.forEach(function(grid, index) {
			const itemsCount = grid.querySelectorAll('.card').length;
			// Добавляем класс с количеством элементов для CSS-центрирования
			grid.classList.add('items-' + itemsCount);
			
			// Добавляем классы для идентификации сеток
			if (index === 0) {
				grid.classList.add('first-grid');
			} else if (index === 1) {
				grid.classList.add('second-grid');
			}
		});
	}
	
	initializeGrids();
	
	// БЛОК 3: УПРАВЛЕНИЕ ТАБАМИ ВАКАНСИЙ
	/**
	 * Обработка табов в разделе вакансий
	 */
	function handleVacancyTabs() {
		const vacancyTabs = document.querySelectorAll('.vacancies-tab');
		const positionGroups = document.querySelectorAll('.positions-group');
		
		// Проверяем наличие элементов перед установкой обработчиков
		if (vacancyTabs.length === 0 || positionGroups.length === 0) return;
		
		// Устанавливаем обработчики для каждого таба вакансий
		vacancyTabs.forEach(tab => {
			tab.addEventListener('click', function() {
				// Устанавливаем активный класс для выбранного таба
				vacancyTabs.forEach(t => t.classList.remove('active'));
				this.classList.add('active');
				
				// Получаем категорию из атрибута
				const category = this.getAttribute('data-category');
				
				// Скрываем все группы
				positionGroups.forEach(group => group.classList.remove('active'));
				
				// Показываем нужную группу
				const targetGroup = document.querySelector(`.positions-group[data-category="${category}"]`);
				if (targetGroup) {
					targetGroup.classList.add('active');
					
					// Обновляем центрирование на следующем кадре анимации для надежности
					requestAnimationFrame(() => {
						updateGridCentering(targetGroup.querySelector('.positions-grid'));
					});
				}
			});
		});
		
		/**
		 * Обновляет центрирование элементов в сетке в зависимости от размера экрана
		 * @param {HTMLElement} grid - сетка для обновления
		 */
		function updateGridCentering(grid) {
			if (!grid) return;
			
			// Определяем количество колонок по ширине экрана
			let columnsCount = 3; // По умолчанию для больших экранов
			
			if (window.innerWidth <= 480) {
				columnsCount = 1; // Мобильные устройства
			} else if (window.innerWidth <= 768) {
				columnsCount = 2; // Планшеты
			}
			
			const cards = grid.querySelectorAll('.position-card');
			const totalCards = cards.length;
			
			// Определяем количество элементов в последнем ряду
			const lastRowItems = totalCards % columnsCount;
			
			// Добавляем классы для центрирования на основе количества элементов
			if (lastRowItems > 0) {
				grid.classList.add('last-row-incomplete');
				
				// Центрируем единственный элемент в ряду из двух колонок
				if (columnsCount === 2 && lastRowItems === 1) {
					cards[totalCards - 1].classList.add('center-in-row');
				}
				
				// Обработка для трех колонок
				if (columnsCount === 3) {
					if (lastRowItems === 1) {
						cards[totalCards - 1].classList.add('center-in-row');
					} else if (lastRowItems === 2) {
						cards[totalCards - 2].classList.add('left-of-center');
						cards[totalCards - 1].classList.add('right-of-center');
					}
				}
			} else {
				// Если последний ряд полный, удаляем все классы центрирования
				grid.classList.remove('last-row-incomplete');
				cards.forEach(card => {
					card.classList.remove('center-in-row', 'left-of-center', 'right-of-center');
				});
			}
		}
		
		// Обновляем активную группу при загрузке
		const activeGroup = document.querySelector('.positions-group.active');
		if (activeGroup) {
			updateGridCentering(activeGroup.querySelector('.positions-grid'));
		}
	}
	
	handleVacancyTabs();
	
	// БЛОК 4: ОБРАБОТКА RESIZE
	// Используем задержку для предотвращения частых вызовов при изменении размера
	let resizeTimer;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			// Обновляем позицию глайдера
			const activeRadio = document.querySelector('input[type="radio"][name="tabs"]:checked');
			if (activeRadio) {
				handleGliderPosition(activeRadio.id);
			}
			
			// Обновляем центрирование в активной группе вакансий
			const activeGroup = document.querySelector('.positions-group.active');
			if (activeGroup) {
				const grid = activeGroup.querySelector('.positions-grid');
				if (grid) {
					updateGridCentering(grid);
				}
			}
		}, 100); // Задержка в 100 мс для оптимизации производительности
	});
	
	// БЛОК 5: ОБРАБОТКА ОТОБРАЖЕНИЯ ИМЕНИ ВЫБРАННОГО ФАЙЛА
	const fileInput = document.getElementById('resumeFile');
	if (fileInput) {
		fileInput.addEventListener('change', function() {
			const fileStatus = this.parentElement.querySelector('.file-status');
			if (this.files.length > 0) {
				fileStatus.textContent = this.files[0].name;
			} else {
				fileStatus.textContent = 'Файл не вибрано';
			}
		});
	}
	
	// Определяем функцию updateGridCentering глобально для использования при ресайзе
	function updateGridCentering(grid) {
		if (!grid) return;
		
		let columnsCount = 3;
		
		if (window.innerWidth <= 480) {
			columnsCount = 1;
		} else if (window.innerWidth <= 768) {
			columnsCount = 2;
		}
		
		const cards = grid.querySelectorAll('.position-card');
		const totalCards = cards.length;
		
		const lastRowItems = totalCards % columnsCount;
		
		if (lastRowItems > 0) {
			grid.classList.add('last-row-incomplete');
			
			if (columnsCount === 2 && lastRowItems === 1) {
				cards[totalCards - 1].classList.add('center-in-row');
			}
			
			if (columnsCount === 3) {
				if (lastRowItems === 1) {
					cards[totalCards - 1].classList.add('center-in-row');
				} else if (lastRowItems === 2) {
					cards[totalCards - 2].classList.add('left-of-center');
					cards[totalCards - 1].classList.add('right-of-center');
				}
			}
		} else {
			grid.classList.remove('last-row-incomplete');
			cards.forEach(card => {
				card.classList.remove('center-in-row', 'left-of-center', 'right-of-center');
			});
		}
	}
});