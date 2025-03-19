document.addEventListener('DOMContentLoaded', function() {
	// ФУНКЦИОНАЛЬНОСТЬ ТАБОВ НА РАДИО-КНОПКАХ
	const tabInputs = document.querySelectorAll('.tabs-menu input[type="radio"]');
	const tabPanels = document.querySelectorAll('.tab-panel');
	
	// Установка активной вкладки при загрузке страницы
	function setInitialActiveTab() {
		const checkedTab = document.querySelector('.tabs-menu input[type="radio"]:checked');
		if (checkedTab) {
			const targetId = checkedTab.getAttribute('aria-controls');
			// Активируем соответствующую панель
			document.getElementById(targetId).classList.add('active');
			
			// Устанавливаем правильную позицию для глайдера
			positionGlider(checkedTab);
		}
	}
	
	// Функция для позиционирования глайдера
	function positionGlider(activeTab) {
		const glider = document.querySelector('.tabs-menu .glider');
		if (glider) {
			const tabLabel = activeTab.nextElementSibling;
			const tabIndex = Array.from(tabInputs).indexOf(activeTab);
			
			if (window.innerWidth > 950) {
				// Для десктопа
				glider.style.opacity = "1";
				glider.style.top = (tabIndex * 59) + "px"; // Высота таба + отступ
			} else {
				// Для мобильных устройств
				glider.style.opacity = "1";
				glider.style.top = (tabIndex * 59) + "px";
			}
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
			
			// Позиционируем глайдер
			positionGlider(this);
			
			// Если это мобильный вид, закрываем меню
			if (window.innerWidth <= 768) {
				closeMobileMenu();
			}
			
			// Если выбран таб заказов, инициализируем его функциональность
			if (targetId === 'content-orders') {
				initOrdersTab();
			}
			
			// Если выбран таб бонусов, инициализируем его функциональность
			if (targetId === 'content-bonuses') {
				initBonusesTab();
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
	
	// ФУНКЦИОНАЛЬНОСТЬ МОБИЛЬНОГО МЕНЮ
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
		
		// Обновляем позицию глайдера при изменении размера окна
		const checkedTab = document.querySelector('.tabs-menu input[type="radio"]:checked');
		if (checkedTab) {
			positionGlider(checkedTab);
		}
	});
	
	// ФУНКЦИОНАЛЬНОСТЬ ВЫПАДАЮЩЕГО СПИСКА
	const dropdownSelect = document.getElementById('identifierType');
	const dropdownMenu = document.getElementById('identifierMenu');
	
	if (dropdownSelect && dropdownMenu) {
		const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
		
		// Открытие/закрытие выпадающего списка с анимацией
		dropdownSelect.addEventListener('click', function() {
			this.classList.toggle('open');
			if (dropdownMenu.classList.contains('show')) {
				dropdownMenu.style.opacity = '0';
				setTimeout(() => {
					dropdownMenu.classList.remove('show');
				}, 300);
			} else {
				dropdownMenu.classList.add('show');
				setTimeout(() => {
					dropdownMenu.style.opacity = '1';
				}, 10);
			}
		});
		
		// Выбор элемента из выпадающего списка
		dropdownItems.forEach(item => {
			item.addEventListener('click', function() {
				dropdownSelect.querySelector('span').textContent = this.textContent;
				dropdownMenu.style.opacity = '0';
				setTimeout(() => {
					dropdownMenu.classList.remove('show');
				}, 300);
				dropdownSelect.classList.remove('open');
			});
		});
		
		// Закрытие выпадающего списка при клике вне него
		document.addEventListener('click', function(event) {
			if (!dropdownSelect.contains(event.target) && !dropdownMenu.contains(event.target)) {
				dropdownMenu.style.opacity = '0';
				setTimeout(() => {
					dropdownMenu.classList.remove('show');
				}, 300);
				dropdownSelect.classList.remove('open');
			}
		});
	}
	
	// ФУНКЦИОНАЛЬНОСТЬ ФОРМ ПРОФИЛЯ
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
	
	// Добавление дополнительного телефона с анимацией
	const addPhoneLink = document.querySelector('.add-phone');
	if (addPhoneLink) {
		addPhoneLink.addEventListener('click', function(e) {
			e.preventDefault();
			
			const phoneContainer = document.querySelector('.additional-phones');
			const phoneInputWrapper = document.createElement('div');
			phoneInputWrapper.className = 'additional-phone-item';
			phoneInputWrapper.style.opacity = '0';
			phoneInputWrapper.style.transform = 'translateY(20px)';
			phoneInputWrapper.innerHTML = `
                <div class="input-with-remove">
                    <input type="tel" class="form-control" placeholder="+38(0__) ___-__-__">
                    <button type="button" class="remove-phone">×</button>
                </div>
            `;
			
			phoneContainer.insertBefore(phoneInputWrapper, addPhoneLink);
			
			// Анимация появления
			setTimeout(() => {
				phoneInputWrapper.style.opacity = '1';
				phoneInputWrapper.style.transform = 'translateY(0)';
				phoneInputWrapper.style.transition = 'all 0.3s ease-out';
			}, 10);
			
			// Обработчик удаления телефона
			const removeBtn = phoneInputWrapper.querySelector('.remove-phone');
			removeBtn.addEventListener('click', function() {
				phoneInputWrapper.style.opacity = '0';
				phoneInputWrapper.style.transform = 'translateY(20px)';
				setTimeout(() => {
					phoneInputWrapper.remove();
				}, 300);
			});
		});
	}
	
	// ФУНКЦИОНАЛЬНОСТЬ ПОИСКА СЕРВИСА
	const searchForm = document.querySelector('.search-form');
	if (searchForm) {
		searchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			const selectedType = dropdownSelect ? dropdownSelect.querySelector('span').textContent : '';
			const inputValue = this.querySelector('.form-control').value.trim();
			
			if (!inputValue) {
				// Анимация ошибки для пустого ввода
				const input = this.querySelector('.form-control');
				input.style.transition = 'border-color 0.3s ease';
				input.style.borderColor = 'red';
				input.style.animation = 'shake 0.5s';
				
				// Сбрасываем стиль ошибки через 3 секунды
				setTimeout(() => {
					input.style.borderColor = '';
					input.style.animation = '';
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
				// Анимация ошибки для неверного формата
				const input = this.querySelector('.form-control');
				input.style.transition = 'border-color 0.3s ease';
				input.style.borderColor = 'red';
				input.style.animation = 'shake 0.5s';
				
				// Сбрасываем стиль ошибки через 3 секунды
				setTimeout(() => {
					input.style.borderColor = '';
					input.style.animation = '';
				}, 3000);
				
				return;
			}
			
			// Имитация загрузки с анимацией
			const button = this.querySelector('.btn-primary');
			const originalText = button.textContent;
			button.textContent = 'Пошук...';
			button.disabled = true;
			
			setTimeout(() => {
				// Имитация ответа - в реальном проекте заменить на API-запрос
				alert(`Запит на перевірку статусу відправлено. Тип: ${selectedType}, Значення: ${inputValue}`);
				
				// Восстанавливаем состояние кнопки
				button.textContent = originalText;
				button.disabled = false;
			}, 1500);
		});
		
		// Очистка стиля ошибки при вводе
		const searchInput = searchForm.querySelector('.form-control');
		if (searchInput) {
			searchInput.addEventListener('input', function() {
				this.style.borderColor = '';
				this.style.animation = '';
			});
		}
	}
	
	// ФУНКЦИОНАЛЬНОСТЬ ВКЛАДКИ "МОЇ ЗАМОВЛЕННЯ"
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
		
		// Применение фильтра статусов с анимацией
		function applyStatusFilter(status) {
			const orderCards = document.querySelectorAll('.order-card');
			const noOrdersMessage = document.querySelector('.no-orders-message');
			let visibleCount = 0;
			
			orderCards.forEach(card => {
				if (status === 'all' || card.dataset.status === status) {
					card.style.display = 'block';
					card.style.opacity = '0';
					card.style.transform = 'translateY(20px)';
					
					setTimeout(() => {
						card.style.opacity = '1';
						card.style.transform = 'translateY(0)';
						card.style.transition = 'all 0.5s ease-out';
					}, 100 * visibleCount);
					
					visibleCount++;
				} else {
					card.style.opacity = '0';
					card.style.transform = 'translateY(20px)';
					
					setTimeout(() => {
						card.style.display = 'none';
					}, 300);
				}
			});
			
			// Показываем/скрываем сообщение о отсутствии заказов
			if (noOrdersMessage) {
				if (visibleCount === 0) {
					setTimeout(() => {
						noOrdersMessage.style.display = 'block';
						noOrdersMessage.style.opacity = '0';
						
						setTimeout(() => {
							noOrdersMessage.style.opacity = '1';
							noOrdersMessage.style.transition = 'opacity 0.5s ease';
						}, 10);
					}, 300);
					
					// Скрываем кнопку "Показать еще"
					if (showMoreButton) {
						showMoreButton.style.display = 'none';
					}
				} else {
					noOrdersMessage.style.opacity = '0';
					
					setTimeout(() => {
						noOrdersMessage.style.display = 'none';
					}, 300);
					
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
			
			// Показываем или скрываем детали заказа с анимацией
			if (expanded) {
				// Скрываем детали
				detailsContainer.style.opacity = '0';
				detailsContainer.style.maxHeight = '0';
				
				setTimeout(() => {
					detailsContainer.style.display = 'none';
				}, 300);
				
				this.querySelector('.toggle-text').textContent = 'Показати деталі';
				this.querySelector('.icon-expand').style.transform = 'rotate(0deg)';
			} else {
				// Показываем детали
				detailsContainer.style.display = 'block';
				detailsContainer.style.opacity = '0';
				detailsContainer.style.maxHeight = '0';
				
				setTimeout(() => {
					detailsContainer.style.opacity = '1';
					detailsContainer.style.maxHeight = '2000px'; // Большое значение для анимации
					detailsContainer.style.transition = 'opacity 0.3s ease, max-height 0.5s ease';
				}, 10);
				
				this.querySelector('.toggle-text').textContent = 'Приховати деталі';
				this.querySelector('.icon-expand').style.transform = 'rotate(180deg)';
				
				// Анимируем трекер заказа, если он есть
				const trackerItems = detailsContainer.querySelectorAll('.tracker-item.active');
				if (trackerItems && trackerItems.length > 0) {
					trackerItems.forEach((item, index) => {
						item.style.opacity = '0';
						
						setTimeout(() => {
							item.style.opacity = '1';
							item.style.transition = 'opacity 0.5s ease';
						}, 300 + (100 * index));
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
			// Показываем состояние загрузки с анимацией
			showMoreButton.textContent = 'Завантаження...';
			showMoreButton.disabled = true;
			showMoreButton.style.opacity = '0.7';
			
			// Получаем текущий выбранный статус
			const currentStatus = orderStatusFilter ? orderStatusFilter.value : 'all';
			
			// Имитация загрузки данных (в реальном проекте - AJAX запрос)
			setTimeout(() => {
				// Тут бы добавлялись новые заказы в DOM
				// ...
				
				// После добавления применяем текущий фильтр
				applyStatusFilter(currentStatus);
				
				// Восстанавливаем состояние кнопки с анимацией
				showMoreButton.textContent = 'Показати більше замовлень';
				showMoreButton.disabled = false;
				showMoreButton.style.opacity = '1';
				showMoreButton.style.transition = 'opacity 0.3s ease';
			}, 1500);
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
			
			// Анимация нажатия
			this.classList.add('clicked');
			setTimeout(() => {
				this.classList.remove('clicked');
			}, 300);
			
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
							returnButton.style.opacity = '0.5';
							returnButton.style.cursor = 'not-allowed';
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
			
			// Анимация нажатия
			this.classList.add('clicked');
			setTimeout(() => {
				this.classList.remove('clicked');
			}, 300);
			
			// Получаем информацию о заказе
			const orderCard = this.closest('.order-card');
			if (orderCard) {
				// Находим форму возврата
				const returnFormContainer = document.querySelector('.return-form-container');
				if (returnFormContainer) {
					// Показываем форму с анимацией
					returnFormContainer.style.display = 'flex';
					returnFormContainer.style.opacity = '0';
					document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
					
					setTimeout(() => {
						returnFormContainer.style.opacity = '1';
						returnFormContainer.style.transition = 'opacity 0.3s ease';
					}, 10);
					
					// Анимируем появление модального окна
					const returnFormModal = returnFormContainer.querySelector('.return-form-modal');
					if (returnFormModal) {
						returnFormModal.style.transform = 'translateY(50px)';
						returnFormModal.style.opacity = '0';
						
						setTimeout(() => {
							returnFormModal.style.transform = 'translateY(0)';
							returnFormModal.style.opacity = '1';
							returnFormModal.style.transition = 'all 0.4s ease-out';
						}, 50);
					}
					
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
				// Анимируем исчезновение
				returnFormContainer.style.opacity = '0';
				
				const returnFormModal = returnFormContainer.querySelector('.return-form-modal');
				if (returnFormModal) {
					returnFormModal.style.transform = 'translateY(50px)';
					returnFormModal.style.opacity = '0';
				}
				
				setTimeout(() => {
					returnFormContainer.style.display = 'none';
					document.body.style.overflow = ''; // Разблокируем прокрутку страницы
				}, 300);
			}
		}
		
		// Анимация трекера заказа
		animateOrderTracker();
		
		function animateOrderTracker() {
			const trackerItems = document.querySelectorAll('.tracker-item.active');
			trackerItems.forEach((item, index) => {
				item.style.opacity = '0';
				
				setTimeout(() => {
					item.style.opacity = '1';
					item.style.transition = 'opacity 0.5s ease';
				}, 200 * index);
			});
		}
	}
	
	// Функция инициализации вкладки бонусов
	function initBonusesTab() {
		// Получаем элементы вкладки
		const paginationButtons = document.querySelectorAll('.pagination-btn');
		const bonusTransactions = document.querySelectorAll('.bonus-transaction');
		
		// Анимация карточек бонусных операций
		animateBonusTransactions();
		
		function animateBonusTransactions() {
			bonusTransactions.forEach((transaction, index) => {
				transaction.style.opacity = '0';
				transaction.style.transform = 'translateY(20px)';
				
				setTimeout(() => {
					transaction.style.opacity = '1';
					transaction.style.transform = 'translateY(0)';
					transaction.style.transition = 'all 0.4s ease-out';
				}, 100 * index);
			});
		}
		
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
					
					// Имитация загрузки данных с анимацией
					const bonusesHistory = document.querySelector('.bonuses-history');
					if (bonusesHistory) {
						bonusesHistory.style.opacity = '0.5';
						
						setTimeout(() => {
							// Здесь бы происходила фактическая загрузка данных для новой страницы
							bonusesHistory.style.opacity = '1';
							bonusesHistory.style.transition = 'opacity 0.5s ease';
							
							// После загрузки применяем анимацию
							animateBonusTransactions();
						}, 500);
					}
				});
			});
		}
	}
	
	// Проверяем, активна ли вкладка заказов при загрузке
	const ordersTab = document.getElementById('tab-orders');
	const ordersPanel = document.getElementById('content-orders');
	if (ordersTab && ordersTab.checked && ordersPanel) {
		initOrdersTab();
	}
	
	// Проверяем, активна ли вкладка бонусов при загрузке
	const bonusesTab = document.getElementById('tab-bonuses');
	const bonusesPanel = document.getElementById('content-bonuses');
	if (bonusesTab && bonusesTab.checked && bonusesPanel) {
		initBonusesTab();
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
	
	// Добавляем стили анимаций, если их нет
	function addAnimationStyles() {
		if (!document.getElementById('animation-styles')) {
			const styleElement = document.createElement('style');
			styleElement.id = 'animation-styles';
			styleElement.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .clicked {
                    transform: scale(0.95);
                    transition: transform 0.2s ease;
                }
            `;
			document.head.appendChild(styleElement);
		}
	}
	
	// JavaScript для блока "Мої привілеї"
	document.addEventListener('DOMContentLoaded', function() {
		// Делаем активным текущий блок на основе якоря в URL
		highlightActiveNavCard();
		
		// Добавляем активный класс при клике
		initNavCardActiveClass();
		
		// Вкладки для промокодов
		initPromoTabs();
		
		// Функция копирования промокодов
		initCopyButtons();
		
		// Проверяем наличие предложений, сертификатов и промокодов
		checkEmptyBlocks();
		
		// Функция для подсветки активной навигационной карточки на основе якоря в URL
		function highlightActiveNavCard() {
			// Получаем текущий якорь (хэш) из URL
			const currentHash = window.location.hash;
			
			if (currentHash) {
				// Находим соответствующую навигационную карточку
				const navCards = document.querySelectorAll('.privilege-nav-card');
				
				navCards.forEach(card => {
					// Проверяем, совпадает ли href карточки с текущим якорем
					if (card.getAttribute('href') === currentHash) {
						// Удаляем активный класс у всех карточек
						navCards.forEach(c => c.classList.remove('active'));
						
						// Добавляем активный класс текущей карточке
						card.classList.add('active');
					}
				});
			} else {
				// Если якоря нет, делаем активной первую карточку
				const firstCard = document.querySelector('.privilege-nav-card');
				if (firstCard) {
					firstCard.classList.add('active');
				}
			}
		}
		
		// Добавление активного класса при клике на навигационную карточку
		function initNavCardActiveClass() {
			const navCards = document.querySelectorAll('.privilege-nav-card');
			
			navCards.forEach(card => {
				card.addEventListener('click', function() {
					// Удаляем активный класс у всех карточек
					navCards.forEach(c => c.classList.remove('active'));
					
					// Добавляем активный класс текущей карточке
					this.classList.add('active');
				});
			});
		}
		
		// Функция для вкладок промокодов
		function initPromoTabs() {
			const tabButtons = document.querySelectorAll('.promo-tab');
			const tabContents = document.querySelectorAll('.promo-codes-grid');
			
			tabButtons.forEach(button => {
				button.addEventListener('click', function() {
					const targetId = this.getAttribute('data-target');
					
					// Удаляем активный класс у всех кнопок
					tabButtons.forEach(btn => btn.classList.remove('active'));
					
					// Добавляем активный класс текущей кнопке
					this.classList.add('active');
					
					// Скрываем все контейнеры с промокодами
					tabContents.forEach(content => {
						content.style.display = 'none';
					});
					
					// Показываем выбранный контейнер
					const targetContent = document.getElementById(targetId);
					if (targetContent) {
						targetContent.style.display = 'grid';
						
						// Проверяем, есть ли промокоды в этой вкладке
						checkEmptyPromoTab(targetContent);
					}
				});
			});
			
			// Проверяем активную вкладку при загрузке
			const activeTab = document.querySelector('.promo-tab.active');
			if (activeTab) {
				const targetId = activeTab.getAttribute('data-target');
				const targetContent = document.getElementById(targetId);
				if (targetContent) {
					targetContent.style.display = 'grid';
					checkEmptyPromoTab(targetContent);
				}
			}
		}
		
		// Функция для копирования промокодов
		function initCopyButtons() {
			const copyButtons = document.querySelectorAll('.copy-button');
			
			copyButtons.forEach(button => {
				button.addEventListener('click', function() {
					// Получаем текст промокода
					const promoCode = this.parentNode.querySelector('.promo-code').textContent;
					
					try {
						// Создаем временный элемент для копирования
						const el = document.createElement('textarea');
						el.value = promoCode;
						document.body.appendChild(el);
						el.select();
						document.execCommand('copy');
						document.body.removeChild(el);
						
						// Изменяем текст кнопки временно
						const originalText = this.textContent;
						this.textContent = 'Скопійовано!';
						this.style.backgroundColor = 'var(--primary-color)';
						this.style.color = 'white';
						
						// Возвращаем исходный текст через 2 секунды
						setTimeout(() => {
							this.textContent = originalText;
							this.style.backgroundColor = '';
							this.style.color = '';
						}, 2000);
					} catch (err) {
						console.error('Помилка при копіюванні: ', err);
						alert('Не вдалося скопіювати промокод. Спробуйте вручну.');
					}
				});
			});
		}
		
		// Функция для проверки пустых блоков
		function checkEmptyBlocks() {
			// Проверяем блок предложений
			const offersGrid = document.querySelector('#personal-offers-block .offers-grid');
			if (offersGrid && offersGrid.children.length === 0) {
				addEmptyMessage(offersGrid);
			}
			
			// Проверяем блок сертификатов
			const certificatesGrid = document.querySelector('#certificates-block .certificates-grid');
			if (certificatesGrid && certificatesGrid.children.length === 0) {
				addEmptyMessage(certificatesGrid);
			}
			
			// Проверяем блок активных промокодов
			const activePromos = document.querySelector('#active-codes');
			if (activePromos) {
				checkEmptyPromoTab(activePromos);
			}
			
			// Проверяем блок использованных промокодов
			const usedPromos = document.querySelector('#used-codes');
			if (usedPromos) {
				checkEmptyPromoTab(usedPromos);
			}
		}
		
		// Функция для проверки пустой вкладки промокодов
		function checkEmptyPromoTab(tab) {
			// Если у вкладки есть дочерние элементы, но они все только заглушки - вкладка пуста
			const promoItems = tab.querySelectorAll('.promo-code-item:not(.empty-message)');
			if (promoItems.length === 0) {
				// Проверяем, не добавлена ли уже заглушка
				const existingMessage = tab.querySelector('.empty-message');
				if (!existingMessage) {
					addEmptyMessage(tab);
				}
			}
		}
		
		// Функция для добавления заглушки
		function addEmptyMessage(container) {
			// Создаем элемент заглушки
			const emptyMessage = document.createElement('div');
			emptyMessage.className = 'empty-message';
			emptyMessage.innerHTML = `
            <div class="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9H9.01" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9H15.01" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <p>Поки тут немає пропозицій, але скоро тебе накриє хвиля гарячих пропозицій!</p>
        `;
			
			// Добавляем заглушку в контейнер
			container.appendChild(emptyMessage);
			
			// Добавляем стили для заглушки, если их еще нет
			if (!document.getElementById('empty-message-styles')) {
				const styleElement = document.createElement('style');
				styleElement.id = 'empty-message-styles';
				styleElement.textContent = `
                .empty-message {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 40px 20px;
                    text-align: center;
                    background-color: var(--bg-light);
                    border-radius: 12px;
                    min-height: 200px;
                    grid-column: 1 / -1;
                }
                
                .empty-icon {
                    margin-bottom: 20px;
                    opacity: 0.7;
                }
                
                .empty-message p {
                    font-size: 18px;
                    color: #666;
                    max-width: 400px;
                    line-height: 1.5;
                }
            `;
				document.head.appendChild(styleElement);
			}
		}
	});
	// Вызываем функцию для добавления стилей анимаций
	addAnimationStyles();
	
	// Вызываем функцию установки активного таба при загрузке
	setInitialActiveTab();
	
	// Вызываем инициализацию формы возврата при загрузке страницы
	initReturnForm();
});