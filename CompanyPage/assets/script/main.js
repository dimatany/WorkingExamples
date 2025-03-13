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
		
		// Обновляем активную группу при загрузке
		const activeGroup = document.querySelector('.positions-group.active');
		if (activeGroup) {
			updateGridCentering(activeGroup.querySelector('.positions-grid'));
		}
	}
	
	handleVacancyTabs();
	
	// БЛОК 4: УПРАВЛЕНИЕ МАГАЗИНАМИ
	/**
	 * Инициализация и обработка интерактивного списка магазинов
	 */
	function initStoreLocator() {
		// Проверяем, есть ли элементы для магазинов на странице
		const storeLocator = document.querySelector('.store-locator');
		if (!storeLocator) return;
		
		// Данные о магазинах
		const storesData = {
			'bahm': {
				name: 'м. Бахмач',
				address: 'вул. Дружби, 14',
				phone: '(068) 125 78 68',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 51.1856, lng: 32.8344 }
			},
			'bilo': {
				name: 'м. Білопілля',
				address: 'вул. Сумська, 5',
				phone: '(095) 545 57 37',
				hours: {
					weekdays: 'пн-нд: 09:00-15:00',
					weekend: ''
				},
				coordinates: { lat: 51.1541, lng: 34.3061 }
			},
			'berez': {
				name: 'м. Березне',
				address: 'вул. Андріївська, 27',
				phone: '(097) 886 97 37',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-18:00'
				},
				coordinates: { lat: 50.9985, lng: 26.7505 }
			},
			'gluh': {
				name: 'м. Глухів',
				address: 'вул. Терещенків, 44',
				phone: '(095) 224 74 42',
				hours: {
					weekdays: 'пн-пт: 09:00-18:00',
					weekend: 'сб-нд: 09:00-16:00'
				},
				coordinates: { lat: 51.6775, lng: 33.9071 }
			},
			'goroh': {
				name: 'м. Горохів',
				address: 'вул. Торгова, 2',
				phone: '(097) 738 96 00',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 50.4994, lng: 24.7605 }
			},
			'dubr': {
				name: 'м. Дубровиця',
				address: 'вул. Шевченка, 55',
				phone: '(097) 691 00 31',
				hours: {
					weekdays: 'пн-пт: 09:00-18:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 51.5745, lng: 26.5675 }
			},
			'konot': {
				name: 'м. Конотоп',
				address: 'пр. Миру, 61',
				phone: '(096) 762 68 68',
				hours: {
					weekdays: 'пн-нд: 09:00-19:00',
					weekend: ''
				},
				coordinates: { lat: 51.2392, lng: 33.2009 }
			},
			'kost': {
				name: 'м. Костопіль',
				address: 'вул. Грушевського, 29',
				phone: '(097) 887 42 77',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-18:00'
				},
				coordinates: { lat: 50.8788, lng: 26.4432 }
			},
			'krol': {
				name: 'м. Кролевець',
				address: 'вул. Рушникова, 2',
				phone: '(068) 698 17 10',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 51.5518, lng: 33.3829 }
			},
			'lubny': {
				name: 'м. Лубни',
				address: 'пл. Ярмаркова, 2',
				phone: '(099) 109 48 28',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 50.0122, lng: 32.9968 }
			},
			'rokyt': {
				name: 'смт. Рокитне',
				address: 'вул. Незалежності, 7',
				phone: '(050) 060 33 03',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 51.2791, lng: 27.2143 }
			},
			'sarny': {
				name: 'м. Сарни',
				address: 'вул. Польська, 1',
				phone: '(068) 708 48 38',
				hours: {
					weekdays: 'пн-пт: 09:00-18:00',
					weekend: 'сб-нд: 09:00-17:00'
				},
				coordinates: { lat: 51.3384, lng: 26.6009 }
			},
			'shost': {
				name: 'м. Шостка',
				address: 'вул. Свободи, 30 (Універмаг, 2-й пов.)',
				phone: '(068) 924 62 62',
				hours: {
					weekdays: 'пн-нд: 09:00-18:00',
					weekend: ''
				},
				coordinates: { lat: 51.8653, lng: 33.4758 }
			},
			'romny': {
				name: 'м. Ромни',
				address: 'бульвар Шевченка, 31',
				phone: '(068) 978 80 09',
				hours: {
					weekdays: 'пн-пт: 09:00-19:00',
					weekend: 'сб-нд: 09:00-18:00'
				},
				coordinates: { lat: 50.7507, lng: 33.4785 }
			}
		};
		
		// Получаем элементы
		const citySelector = document.getElementById('citySelector');
		const storeDetailsContent = document.querySelector('.store-details__content');
		const storeDetailsInitial = document.querySelector('.store-details__initial');
		let map = null;
		let marker = null;
		
		// Инициализация Google карты (если API доступен)
		function initMap() {
			// Центр Украины для начального отображения
			const ukraineCenter = { lat: 49.4871, lng: 31.2718 };
			
			// Проверяем, доступен ли Google Maps API
			if (typeof google !== 'undefined' && google.maps) {
				map = new google.maps.Map(document.getElementById('map'), {
					center: ukraineCenter,
					zoom: 6,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false,
					fullscreenControl: true,
					streetViewControl: false
				});
				
				// Переключение типа карты
				const mapBtnView = document.querySelector('.map-btn--view');
				const mapBtnSatellite = document.querySelector('.map-btn--satellite');
				
				if (mapBtnView && mapBtnSatellite) {
					mapBtnView.classList.add('active');
					
					mapBtnView.addEventListener('click', function() {
						map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
						mapBtnView.classList.add('active');
						mapBtnSatellite.classList.remove('active');
					});
					
					mapBtnSatellite.addEventListener('click', function() {
						map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
						mapBtnSatellite.classList.add('active');
						mapBtnView.classList.remove('active');
					});
				}
			}
		}
		
		// Обновление информации о магазине
		function updateStoreInfo(cityCode) {
			if (!cityCode || !storesData[cityCode]) {
				// Если город не выбран или данных нет, показываем начальное состояние
				storeDetailsInitial.style.display = 'flex';
				storeDetailsContent.style.display = 'none';
				return;
			}
			
			// Скрываем начальное состояние и показываем информацию о магазине
			storeDetailsInitial.style.display = 'none';
			storeDetailsContent.style.display = 'block';
			
			const store = storesData[cityCode];
			
			// Заполняем информацию о магазине
			document.querySelector('.store-city').textContent = store.name;
			document.querySelector('.store-street').textContent = store.address;
			document.querySelector('.store-phone-number').textContent = store.phone;
			document.querySelector('.store-phone-number').href = `tel:${store.phone.replace(/[^0-9+]/g, '')}`;
			document.querySelector('.messenger-telegram').href = `https://t.me/${store.phone.replace(/[^0-9+]/g, '')}`;
			document.querySelector('.messenger-viber').href = `viber://chat?number=${store.phone.replace(/[^0-9+]/g, '')}`;
			document.querySelector('.store-weekdays').textContent = store.hours.weekdays;
			document.querySelector('.store-weekend').textContent = store.hours.weekend;
			
			// Обновляем ссылку "прокласти маршрут"
			document.getElementById('routeLink').href = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
			
			// Обновляем карту
			if (map) {
				// Центрируем карту на выбранном магазине
				map.setCenter(store.coordinates);
				map.setZoom(16);
				
				// Добавляем или обновляем маркер
				if (marker) {
					marker.setPosition(store.coordinates);
				} else {
					marker = new google.maps.Marker({
						position: store.coordinates,
						map: map,
						title: store.name,
						animation: google.maps.Animation.DROP
					});
				}
			}
		}
		
		// Инициализация событий
		if (citySelector) {
			// Обработчик выбора города в селекте
			citySelector.addEventListener('change', function() {
				const selectedCity = this.value;
				updateStoreInfo(selectedCity);
			});
		}
		
		// Инициализируем карту, если Google Maps API загружен
		if (typeof google !== 'undefined') {
			initMap();
		} else {
			// Если API не загружен, добавляем заглушку изображения карты
			const mapContainer = document.getElementById('map');
			if (mapContainer) {
				mapContainer.style.backgroundImage = 'url("assets/img/map-placeholder.jpg")';
				mapContainer.style.backgroundSize = 'cover';
				mapContainer.style.backgroundPosition = 'center';
			}
		}
	}
	
	// БЛОК 5: ОБРАБОТКА RESIZE
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
	
	// БЛОК 6: ОБРАБОТКА ОТОБРАЖЕНИЯ ИМЕНИ ВЫБРАННОГО ФАЙЛА
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
	
	// Глобальная функция для центрирования элементов в grid
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
	
	// JavaScript для управления слайдером
	const sliderStack = document.querySelector(".slider-stack");
	const sliderItems = Array.from(sliderStack.children)
	.reverse()
	.filter((child) => child.classList.contains("slider-item"));
	sliderItems.forEach((item) => sliderStack.appendChild(item));
	
	function moveSliderItem() {
		const lastItem = sliderStack.lastElementChild;
		if (lastItem.classList.contains("slider-item")) {
			lastItem.classList.add("slider-swap");
			setTimeout(() => {
				lastItem.classList.remove("slider-swap");
				sliderStack.insertBefore(lastItem, sliderStack.firstElementChild);
			}, 1300);
		}
	}
	
	// Автоматическое переключение карточек каждые 4 секунды
	let autoplayInterval = setInterval(moveSliderItem, 4000);
	
	// Обработчик клика для ручного переключения
	sliderStack.addEventListener("click", function (e) {
		const item = e.target.closest(".slider-item");
		if (item && item === sliderStack.lastElementChild) {
			// Очистить таймер при ручном переключении
			clearInterval(autoplayInterval);
			
			item.classList.add("slider-swap");
			setTimeout(() => {
				item.classList.remove("slider-swap");
				sliderStack.insertBefore(item, sliderStack.firstElementChild);
			}, 1300);
			
			// Перезапустить таймер
			autoplayInterval = setInterval(moveSliderItem, 4000);
		}
	});
	
	// Пересчет анимации при изменении размера окна
	let resizeTimeout;
	window.addEventListener('resize', function() {
		clearTimeout(resizeTimeout);
		
		// Дебаунсинг для предотвращения многократных вызовов
		resizeTimeout = setTimeout(function() {
			// Если есть активная анимация, сбросить ее
			const activeSlide = document.querySelector('.slider-swap');
			if (activeSlide) {
				activeSlide.classList.remove('slider-swap');
				setTimeout(() => {
					activeSlide.classList.add('slider-swap');
				}, 50);
			}
		}, 250);
	});
	
	// Инициализируем функциональность магазинов
	initStoreLocator();
});