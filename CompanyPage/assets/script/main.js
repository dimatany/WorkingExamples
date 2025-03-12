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
	 * Корректирует позицию глайдера
	 * @param {String} tabId - ID активной вкладки
	 */
	const handleGliderPosition = (tabId) => {
		glider.style.removeProperty('transform');
		
		if (tabId === 'radio-4') {
			requestAnimationFrame(() => {
				const containerWidth = tabContainer.offsetWidth;
				const padding = parseInt(getComputedStyle(tabContainer).paddingRight) || 0;
				const gliderWidth = glider.offsetWidth;
				
				const maxPosition = containerWidth - gliderWidth - padding;
				
				const gliderStyles = getComputedStyle(glider);
				const matrix = new DOMMatrix(gliderStyles.transform);
				
				if (matrix.m41 > maxPosition) {
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
		
		const event = new Event('change', {
			'bubbles': true,
			'cancelable': true
		});
		radioButton.dispatchEvent(event);
		
		// Скрываем все табы
		const tabContents = document.querySelectorAll('.tab-content');
		tabContents.forEach(content => content.classList.remove('active'));
		
		const tabNumber = tabId.split('-')[1];
		
		const targetContent = document.getElementById(`content-${tabNumber}`);
		if (targetContent) {
			targetContent.classList.add('active');
			targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		
		history.pushState(null, null, `#${tabId}`);
	}
	
	// Глобальный доступ к функции
	window.activateTab = activateTab;
	
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
	
	// Обработка хэша URL
	const hash = window.location.hash.substring(1);
	if (hash && hash.startsWith('radio-')) {
		activateTab(hash);
	}
	
	// БЛОК 2: УПРАВЛЕНИЕ GRID-СЕТКАМИ
	function initializeGrids() {
		const grids = document.querySelectorAll('.cards-grid');
		
		grids.forEach(function(grid, index) {
			const itemsCount = grid.querySelectorAll('.card').length;
			grid.classList.add('items-' + itemsCount);
			
			if (index === 0) {
				grid.classList.add('first-grid');
			} else if (index === 1) {
				grid.classList.add('second-grid');
			}
		});
	}
	
	initializeGrids();
	
	// БЛОК 3: УПРАВЛЕНИЕ ТАБАМИ ВАКАНСИЙ
	function handleNewVacancyTabs() {
		const vacancyTabs = document.querySelectorAll('.vacancies-tab');
		const positionGroups = document.querySelectorAll('.positions-group');
		
		if (vacancyTabs.length === 0 || positionGroups.length === 0) return;
		
		vacancyTabs.forEach(tab => {
			tab.addEventListener('click', function() {
				vacancyTabs.forEach(t => t.classList.remove('active'));
				this.classList.add('active');
				
				const category = this.getAttribute('data-category');
				
				positionGroups.forEach(group => group.classList.remove('active'));
				
				const targetGroup = document.querySelector(`.positions-group[data-category="${category}"]`);
				if (targetGroup) {
					targetGroup.classList.add('active');
					
					requestAnimationFrame(() => {
						updateCentering(targetGroup.querySelector('.positions-grid'));
					});
				}
			});
		});
		
		/**
		 * Обновляет центрирование элементов в сетке
		 */
		function updateCentering(grid) {
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
		
		const activeGroup = document.querySelector('.positions-group.active');
		if (activeGroup) {
			updateCentering(activeGroup.querySelector('.positions-grid'));
		}
	}
	
	handleNewVacancyTabs();
	
	// БЛОК 4: ОБРАБОТКА RESIZE
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
					updateCentering(grid);
				}
			}
		}, 100);
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
});