document.addEventListener('DOMContentLoaded', function() {
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ ТАБОВ НА РАДИО-КНОПКАХ
	//=================================================
	const tabInputs = document.querySelectorAll('.tabs-menu input[type="radio"]');
	const tabPanels = document.querySelectorAll('.tab-panel');
	
	// Установка активной вкладки при загрузке страницы
	function setInitialActiveTab() {
		const checkedTab = document.querySelector('.tabs-menu input[type="radio"]:checked');
		if (checkedTab) {
			const targetId = checkedTab.getAttribute('aria-controls');
			// Активируем соответствующую панель
			document.getElementById(targetId).classList.add('active');
		}
	}
	
	// Обработчик изменения таба
	tabInputs.forEach(input => {
		input.addEventListener('change', function() {
			const targetId = this.getAttribute('aria-controls');
			
			// Убираем активный класс у всех панелей
			tabPanels.forEach(panel => {
				panel.classList.remove('active');
			});
			
			// Активируем выбранную панель
			document.getElementById(targetId).classList.add('active');
			
			// Если это мобильный вид, закрываем меню
			if (window.innerWidth <= 768) {
				closeMobileMenu();
			}
			
			// Если выбран таб заказов, инициализируем его функциональность
			if (targetId === 'content-orders') {
				initOrdersTab();
			}
		});
		
		// Доступность с клавиатуры
		input.nextElementSibling.addEventListener('keydown', function(e) {
			// Нажатие Enter или Space активирует таб
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.previousElementSibling.checked = true;
				
				// Запускаем событие change вручную
				const event = new Event('change');
				this.previousElementSibling.dispatchEvent(event);
			}
		});
	});
	
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ МОБИЛЬНОГО МЕНЮ
	//=================================================
	const mobileMenuToggle = document.getElementById('mobileMenuToggle');
	const sidebar = document.querySelector('.sidebar');
	
	// Создаем оверлей для мобильного меню
	const overlay = document.createElement('div');
	overlay.className = 'menu-overlay';
	document.body.appendChild(overlay);
	
	// Функция закрытия мобильного меню
	function closeMobileMenu() {
		sidebar.classList.remove('active');
		if (mobileMenuToggle) {
			mobileMenuToggle.classList.remove('active');
		}
		overlay.classList.remove('active');
		document.body.style.overflow = '';
	}
	
	// Обработчик кнопки мобильного меню
	if (mobileMenuToggle) {
		mobileMenuToggle.addEventListener('click', function() {
			sidebar.classList.toggle('active');
			this.classList.toggle('active');
			overlay.classList.toggle('active');
			
			// Блокировка прокрутки страницы при открытом меню
			if (sidebar.classList.contains('active')) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		});
	}
	
	// Закрытие меню при клике на оверлей
	overlay.addEventListener('click', closeMobileMenu);
	
	// Адаптивное поведение при изменении размера окна
	window.addEventListener('resize', function() {
		if (window.innerWidth > 768) {
			closeMobileMenu();
		}
	});
	
	// Вызываем функцию установки активного таба при загрузке
	setInitialActiveTab();
	
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ ВЫПАДАЮЩЕГО СПИСКА
	//=================================================
	const dropdownSelect = document.getElementById('identifierType');
	const dropdownMenu = document.getElementById('identifierMenu');
	
	if (dropdownSelect && dropdownMenu) {
		const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
		
		// Открытие/закрытие выпадающего списка
		dropdownSelect.addEventListener('click', function() {
			this.classList.toggle('open');
			dropdownMenu.classList.toggle('show');
		});
		
		// Выбор элемента из выпадающего списка
		dropdownItems.forEach(item => {
			item.addEventListener('click', function() {
				dropdownSelect.querySelector('span').textContent = this.textContent;
				dropdownMenu.classList.remove('show');
				dropdownSelect.classList.remove('open');
			});
		});
		
		// Закрытие выпадающего списка при клике вне него
		document.addEventListener('click', function(event) {
			if (!dropdownSelect.contains(event.target) && !dropdownMenu.contains(event.target)) {
				dropdownMenu.classList.remove('show');
				dropdownSelect.classList.remove('open');
			}
		});
	}
	
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ ФОРМ ПРОФИЛЯ
	//=================================================
	// Форма смены пароля
	const passwordForm = document.querySelector('.password-form');
	if (passwordForm) {
		passwordForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			const newPassword = document.getElementById('newPassword');
			const confirmPassword = document.getElementById('confirmPassword');
			
			if (!newPassword || !confirmPassword) return;
			
			// Проверка совпадения паролей
			if (newPassword.value !== confirmPassword.value) {
				alert('Паролі не співпадають');
				return;
			}
			
			// Проверка минимальной длины
			if (newPassword.value.length < 6) {
				alert('Пароль повинен містити мінімум 6 символів');
				return;
			}
			
			// Отправка формы на сервер (в реальном проекте - AJAX)
			alert('Пароль успішно змінено');
			this.reset();
		});
	}
	
	// Форма профиля пользователя
	const userForm = document.querySelector('.user-form');
	if (userForm) {
		userForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Валидация и отправка формы (в реальном проекте - AJAX)
			alert('Дані профілю успішно збережені');
		});
	}
	
	// Форма способов оплаты
	const paymentForm = document.querySelector('.payment-form');
	if (paymentForm) {
		paymentForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Отправка формы на сервер (в реальном проекте - AJAX)
			alert('Налаштування способів оплати збережені');
		});
	}
	
	// Добавление дополнительного телефона
	const addPhoneLink = document.querySelector('.add-phone');
	if (addPhoneLink) {
		addPhoneLink.addEventListener('click', function(e) {
			e.preventDefault();
			
			const phoneContainer = document.querySelector('.additional-phones');
			const phoneInputWrapper = document.createElement('div');
			phoneInputWrapper.className = 'additional-phone-item';
			phoneInputWrapper.innerHTML = `
                <div class="input-with-remove">
                    <input type="tel" class="form-control" placeholder="+38(0__) ___-__-__">
                    <button type="button" class="remove-phone">×</button>
                </div>
            `;
			
			phoneContainer.insertBefore(phoneInputWrapper, addPhoneLink);
			
			// Обработчик удаления телефона
			const removeBtn = phoneInputWrapper.querySelector('.remove-phone');
			removeBtn.addEventListener('click', function() {
				phoneInputWrapper.remove();
			});
		});
	}
	
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ ПОИСКА СЕРВИСА
	//=================================================
	const searchForm = document.querySelector('.search-form');
	if (searchForm) {
		searchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			const selectedType = dropdownSelect.querySelector('span').textContent;
			const inputValue = this.querySelector('.form-control').value.trim();
			
			if (!inputValue) {
				// Показываем ошибку для пустого ввода
				this.querySelector('.form-control').style.borderColor = 'red';
				
				// Сбрасываем стиль ошибки через 3 секунды
				setTimeout(() => {
					this.querySelector('.form-control').style.borderColor = '';
				}, 3000);
				
				return;
			}
			
			// Валидация ввода в зависимости от типа
			let isValid = true;
			
			if (selectedType === 'Номер телефона') {
				// Валидация формата телефона (09*******)
				isValid = /^09\d{7}$/.test(inputValue);
			} else if (selectedType === 'IMEI/серійний номер') {
				// Базовая валидация IMEI (15 цифр) или серийного номера
				isValid = /^\d{15}$/.test(inputValue) || inputValue.length > 5;
			} else if (selectedType === 'Номер квитанції') {
				// Валидация формата номера квитанции (ПР0000XXX)
				isValid = /^ПР\d{4}[A-Za-zА-Яа-яІіЇїЄєҐґ]{3}$/.test(inputValue);
			}
			
			if (!isValid) {
				// Показываем ошибку для неверного формата
				this.querySelector('.form-control').style.borderColor = 'red';
				
				// Сбрасываем стиль ошибки через 3 секунды
				setTimeout(() => {
					this.querySelector('.form-control').style.borderColor = '';
				}, 3000);
				
				return;
			}
			
			// Если всё валидно, отправляем форму (в реальном проекте - AJAX)
			console.log('Форма отправлена:', {
				тип: selectedType,
				значение: inputValue
			});
			
			// Имитация ответа - в реальном проекте заменить на API-запрос
			alert(`Запит на перевірку статусу відправлено. Тип: ${selectedType}, Значення: ${inputValue}`);
		});
		
		// Очистка стиля ошибки при вводе
		const searchInput = searchForm.querySelector('.form-control');
		if (searchInput) {
			searchInput.addEventListener('input', function() {
				this.style.borderColor = '';
			});
		}
	}
	
	//=================================================
	// ФУНКЦИОНАЛЬНОСТЬ ВКЛАДКИ "МОЇ ЗАМОВЛЕННЯ"
	//=================================================
	// Функция инициализации вкладки заказов
	function initOrdersTab() {
		// Получаем элементы на вкладке заказов
		const showMoreButton = document.querySelector('.show-more-btn');
		const repeatOrderButtons = document.querySelectorAll('.repeat-order');
		const createReturnButtons = document.querySelectorAll('.create-return');
		const toggleButtons = document.querySelectorAll('.toggle-details');
		const orderStatusFilter = document.getElementById('orderStatusFilter');
		
		// Инициализация фильтра статусов заказов
		if (orderStatusFilter) {
			// Удаляем существующий обработчик, чтобы избежать дублирования
			orderStatusFilter.removeEventListener('change', handleStatusFilterChange);
			// Добавляем новый обработчик
			orderStatusFilter.addEventListener('change', handleStatusFilterChange);
			
			// Применяем фильтр при инициализации
			applyStatusFilter(orderStatusFilter.value);
		}
		
		// Функция-обработчик изменения фильтра статусов
		function handleStatusFilterChange() {
			applyStatusFilter(this.value);
		}
		
		// Применение фильтра статусов
		function applyStatusFilter(status) {
			const orderCards = document.querySelectorAll('.order-card');
			const noOrdersMessage = document.querySelector('.no-orders-message');
			let visibleCount = 0;
			
			orderCards.forEach(card => {
				if (status === 'all' || card.dataset.status === status) {
					card.style.display = 'block';
					visibleCount++;
				} else {
					card.style.display = 'none';
				}
			});
			
			// Показываем/скрываем сообщение о отсутствии заказов
			if (noOrdersMessage) {
				if (visibleCount === 0) {
					noOrdersMessage.style.display = 'block';
					// Скрываем кнопку "Показать еще"
					if (showMoreButton) {
						showMoreButton.style.display = 'none';
					}
				} else {
					noOrdersMessage.style.display = 'none';
					// Показываем кнопку "Показать еще"
					if (showMoreButton) {
						showMoreButton.style.display = 'block';
					}
				}
			}
		}
		
		// Инициализация кнопок переключения деталей заказа
		if (toggleButtons && toggleButtons.length > 0) {
			toggleButtons.forEach(button => {
				// Удаляем существующий обработчик, чтобы избежать дублирования
				button.removeEventListener('click', handleToggleDetailsClick);
				// Добавляем новый обработчик
				button.addEventListener('click', handleToggleDetailsClick);
			});
		}
		
		// Функция-обработчик кнопки переключения деталей
		function handleToggleDetailsClick() {
			// Получаем ID контейнера с деталями заказа
			const detailsContainerId = this.getAttribute('aria-controls');
			const detailsContainer = document.getElementById(detailsContainerId);
			
			// Проверяем текущее состояние
			const expanded = this.getAttribute('aria-expanded') === 'true';
			
			// Обновляем атрибут aria-expanded
			this.setAttribute('aria-expanded', !expanded);
			
			// Показываем или скрываем детали заказа
			if (expanded) {
				// Скрываем детали
				detailsContainer.style.display = 'none';
				this.querySelector('.toggle-text').textContent = 'Показати деталі';
			} else {
				// Показываем детали
				detailsContainer.style.display = 'block';
				this.querySelector('.toggle-text').textContent = 'Приховати деталі';
				
				// Анимируем трекер заказа, если он есть
				const trackerItems = detailsContainer.querySelectorAll('.tracker-item.active');
				if (trackerItems && trackerItems.length > 0) {
					trackerItems.forEach((item, index) => {
						item.style.transition = 'opacity 0.3s';
						item.style.opacity = '0';
						
						setTimeout(() => {
							item.style.opacity = '1';
						}, 100 * index);
					});
				}
			}
		}
		
		// Обработчик "Показать больше заказов"
		if (showMoreButton) {
			// Удаляем существующий обработчик, чтобы избежать дублирования
			showMoreButton.removeEventListener('click', handleShowMoreClick);
			// Добавляем новый обработчик
			showMoreButton.addEventListener('click', handleShowMoreClick);
		}
		
		// Функция-обработчик кнопки "Показать больше"
		function handleShowMoreClick() {
			// Показываем состояние загрузки
			showMoreButton.textContent = 'Завантаження...';
			showMoreButton.disabled = true;
			
			// Получаем текущий выбранный статус
			const currentStatus = orderStatusFilter ? orderStatusFilter.value : 'all';
			
			// Имитация загрузки данных (в реальном проекте - AJAX запрос)
			setTimeout(() => {
				// Тут бы добавлялись новые заказы в DOM
				// ...
				
				// После добавления применяем текущий фильтр
				applyStatusFilter(currentStatus);
				
				// Восстанавливаем состояние кнопки
				showMoreButton.textContent = 'Показати більше замовлень';
				showMoreButton.disabled = false;
			}, 1000);
		}
		
		// Обработчики кнопок "Повторить заказ"
		if (repeatOrderButtons && repeatOrderButtons.length > 0) {
			repeatOrderButtons.forEach(button => {
				// Удаляем существующий обработчик
				button.removeEventListener('click', handleRepeatOrderClick);
				// Добавляем новый обработчик
				button.addEventListener('click', handleRepeatOrderClick);
			});
		}
		
		// Функция-обработчик кнопки "Повторить заказ"
		function handleRepeatOrderClick(e) {
			e.preventDefault();
			
			// Получаем информацию о товаре
			const orderCard = this.closest('.order-card');
			if (orderCard) {
				const productName = orderCard.querySelector('.product-name');
				if (productName) {
					// В реальном проекте - добавление товара в корзину
					alert(`Товар "${productName.textContent}" додано до кошика для повторного замовлення`);
				}
			}
		}
		
		// Проверка возможности возврата (14 дней с даты заказа)
		checkReturnPeriod();
		
		// Функция проверки периода возврата (14 дней)
		function checkReturnPeriod() {
			const orderCards = document.querySelectorAll('.order-card');
			
			orderCards.forEach(card => {
				const orderDateElem = card.querySelector('.order-date');
				const returnButton = card.querySelector('.create-return');
				
				if (orderDateElem && returnButton) {
					// Получаем дату заказа из текста "від 30.01.2022 09:37"
					const dateText = orderDateElem.textContent;
					const dateMatch = dateText.match(/від (\d{2})\.(\d{2})\.(\d{4})/);
					
					if (dateMatch) {
						// Формат дата, месяц (0-11), год
						const orderDate = new Date(dateMatch[3], dateMatch[2] - 1, dateMatch[1]);
						const currentDate = new Date();
						
						// Добавляем 14 дней к дате заказа
						const returnDeadline = new Date(orderDate);
						returnDeadline.setDate(returnDeadline.getDate() + 14);
						
						// Проверяем, не истек ли срок возврата
						if (currentDate > returnDeadline) {
							// Срок возврата истек - делаем кнопку неактивной
							returnButton.disabled = true;
							returnButton.classList.add('disabled');
							returnButton.title = 'Термін повернення минув (14 днів з дати покупки)';
							
							// Обновляем информацию о возврате
							const returnInfo = card.querySelector('.return-info p');
							if (returnInfo) {
								returnInfo.textContent = '* Термін повернення минув (14 днів з дати покупки)';
								returnInfo.style.color = '#e53935';
							}
						}
					}
				}
			});
		}
		
		// Обработчики кнопок "Создать возврат"
		if (createReturnButtons && createReturnButtons.length > 0) {
			createReturnButtons.forEach(button => {
				// Удаляем существующий обработчик
				button.removeEventListener('click', handleCreateReturnClick);
				// Добавляем новый обработчик
				button.addEventListener('click', handleCreateReturnClick);
			});
		}
		
		// Функция показа формы возврата
		function handleCreateReturnClick(e) {
			e.preventDefault();
			
			// Если кнопка неактивна (срок возврата истек), то ничего не делаем
			if (this.disabled) {
				alert('Термін повернення минув (14 днів з дати покупки)');
				return;
			}
			
			// Получаем информацию о заказе
			const orderCard = this.closest('.order-card');
			if (orderCard) {
				// Находим форму возврата
				const returnFormContainer = document.querySelector('.return-form-container');
				if (returnFormContainer) {
					// Показываем форму
					returnFormContainer.style.display = 'flex';
					document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
					
					// Добавляем обработчики для закрытия формы
					const closeButton = returnFormContainer.querySelector('.close-return-form');
					const cancelButton = returnFormContainer.querySelector('.cancel-return');
					const overlay = returnFormContainer.querySelector('.return-form-overlay');
					
					if (closeButton) {
						closeButton.addEventListener('click', closeReturnForm);
					}
					
					if (cancelButton) {
						cancelButton.addEventListener('click', closeReturnForm);
					}
					
					if (overlay) {
						overlay.addEventListener('click', closeReturnForm);
					}
					
					// Обработчик отправки формы
					const returnForm = returnFormContainer.querySelector('#returnForm');
					if (returnForm) {
						returnForm.addEventListener('submit', function(e) {
							e.preventDefault();
							
							// Здесь будет логика отправки формы на сервер
							// В данном случае просто показываем сообщение
							alert('Заява на повернення надіслана. Ми зв\'яжемося з вами найближчим часом.');
							
							// Закрываем форму
							closeReturnForm();
						});
					}
				}
			}
		}
		
		// Функция закрытия формы возврата
		function closeReturnForm() {
			const returnFormContainer = document.querySelector('.return-form-container');
			if (returnFormContainer) {
				returnFormContainer.style.display = 'none';
				document.body.style.overflow = ''; // Разблокируем прокрутку страницы
			}
		}
		
		// Анимация трекера заказа
		const trackerItems = document.querySelectorAll('.tracker-item.active');
		trackerItems.forEach((item, index) => {
			item.style.transition = 'opacity 0.3s';
			item.style.opacity = '0';
			
			setTimeout(() => {
				item.style.opacity = '1';
			}, 100 * index);
		});
	}
	
	// Проверяем, активна ли вкладка заказов при загрузке
	const ordersTab = document.getElementById('tab-orders');
	const ordersPanel = document.getElementById('content-orders');
	if (ordersTab && ordersTab.checked && ordersPanel) {
		initOrdersTab();
	}
	
	// Инициализация формы возврата при загрузке страницы
	function initReturnForm() {
		// Проверяем наличие формы на странице
		const returnFormContainer = document.querySelector('.return-form-container');
		if (!returnFormContainer) {
			// Если формы нет, создаем ее и добавляем в DOM
			const formHtml = `
				<div class="return-form-container" style="display: none;">
					<div class="return-form-overlay"></div>
					<div class="return-form-modal">
						<div class="return-form-header">
							<h3>Заява на повернення</h3>
							<button class="close-return-form">&times;</button>
						</div>
						<div class="return-form-content">
							<form id="returnForm" class="return-form">
								<div class="form-group">
									<label>Інтернет-замовлення №:</label>
									<input type="text" class="form-control" value="15680395" readonly>
								</div>
								<div class="form-group">
									<label>Видаткова накладна №:</label>
									<input type="text" class="form-control" value="5387041" readonly>
								</div>
								<div class="form-group">
									<label>Дата:</label>
									<input type="text" class="form-control" value="30.01.2022" readonly>
								</div>
								<div class="form-group">
									<label>Покупець:</label>
									<input type="text" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Телефон:</label>
									<input type="tel" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Причина повернення:</label>
									<select class="form-control" required>
										<option value="">Виберіть причину повернення</option>
										<option value="defect">Виявлено дефект</option>
										<option value="not_match">Товар не відповідає опису</option>
										<option value="not_fit">Товар не підійшов</option>
										<option value="change_mind">Передумав(-ла)</option>
									</select>
								</div>
								<div class="form-group">
									<label>Одержувач коштів за повернення:</label>
									<input type="text" class="form-control" required>
								</div>
								<div class="form-group">
									<label>ІПН:</label>
									<input type="text" class="form-control" required>
								</div>
								<div class="form-group">
									<label>Банк:</label>
									<input type="text" class="form-control" required>
								</div>
								<div class="form-group">
									<label>IBAN:</label>
									<input type="text" class="form-control" required>
								</div>
								<div class="form-note">
									<p class="required-fields-note">* Всі поля обов'язкові для заповнення!</p>
								</div>
								<div class="form-actions">
									<button type="submit" class="btn btn-primary">Відправити заяву</button>
									<button type="button" class="btn btn-secondary cancel-return">Скасувати</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			`;
			
			// Добавляем форму в конец body
			document.body.insertAdjacentHTML('beforeend', formHtml);
		}
	}
	
	// Функция инициализации вкладки бонусов
	function initBonusesTab() {
		// Получаем элементы вкладки
		const paginationButtons = document.querySelectorAll('.pagination-btn');
		
		// Обработчик клика по кнопкам пагинации
		if (paginationButtons && paginationButtons.length > 0) {
			paginationButtons.forEach(button => {
				button.addEventListener('click', function() {
					// Убираем активный класс у всех кнопок
					paginationButtons.forEach(btn => {
						btn.classList.remove('pagination-btn-active');
					});
					
					// Если это не кнопка "Следующая", делаем её активной
					if (!this.classList.contains('pagination-btn-next')) {
						this.classList.add('pagination-btn-active');
					} else {
						// Находим текущую активную кнопку
						const currentActive = document.querySelector('.pagination-btn-active');
						const currentIndex = Array.from(paginationButtons).indexOf(currentActive);
						
						// Активируем следующую кнопку, если она не последняя
						if (currentIndex < paginationButtons.length - 2) {
							paginationButtons[currentIndex + 1].classList.add('pagination-btn-active');
						} else {
							// Если достигли последней страницы, возвращаемся к первой
							paginationButtons[0].classList.add('pagination-btn-active');
						}
					}
					
					// Здесь можно добавить загрузку данных для выбранной страницы
					// В реальном проекте - AJAX запрос с учетом выбранной страницы
					console.log('Загрузка страницы:', this.textContent.trim());
				});
			});
		}
		
		// Вы можете добавить дополнительные функции для анимаций,
		// обновления данных или других интерактивных элементов на странице бонусов
	}

// Инициализация вкладки бонусов при загрузке страницы
	const bonusesTab = document.getElementById('tab-bonuses');
	const bonusesPanel = document.getElementById('content-bonuses');
	if (bonusesTab && bonusesTab.checked && bonusesPanel) {
		initBonusesTab();
	}

// Если вы используете табы, вы можете добавить вызов initBonusesTab()
// в обработчик изменения таба, аналогично тому, как это сделано для вкладки заказов
// Пример:
	/*
	 tabInputs.forEach(input => {
	 input.addEventListener('change', function() {
	 const targetId = this.getAttribute('aria-controls');
	 
	 // ...
	 
	 // Если выбран таб бонусов, инициализируем его функциональность
	 if (targetId === 'content-bonuses') {
	 initBonusesTab();
	 }
	 });
	 });
	 */
	
	// Вызываем инициализацию формы возврата при загрузке страницы
	initReturnForm();
});