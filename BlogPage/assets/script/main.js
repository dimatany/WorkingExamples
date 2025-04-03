// Функция для отображения уведомления
function showNotification(message, duration = 3000) {
	const notification = document.getElementById('notification');
	notification.textContent = message;
	notification.classList.add('show');
	
	setTimeout(() => {
		notification.classList.remove('show');
	}, duration);
}

// Обработчик для кнопки "Поделиться"
document.querySelector('.share-button').addEventListener('click', function() {
	// Здесь можно добавить логику для шеринга
	showNotification('Спасибо, что поделились этой статьей!');
});

// Также добавляем обработку нажатия клавиши Enter для доступности
document.querySelector('.share-button').addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		this.click();
	}
});

// Скрипт для звездного рейтинга
const stars = document.querySelectorAll('.star');
stars.forEach((star, index) => {
	star.addEventListener('click', () => {
		// Установка рейтинга
		stars.forEach((s, i) => {
			if (i <= index) {
				s.classList.remove('empty');
			} else {
				s.classList.add('empty');
			}
		});
		
		// Показываем уведомление вместо alert
		showNotification(`Спасибо за вашу оценку: ${index + 1} из 5!`);
	});
	
	// Обработка нажатия клавиши Enter для доступности
	star.addEventListener('keydown', function(e) {
		if (e.key === 'Enter') {
			this.click();
		}
	});
	
	// Добавляем эффект наведения
	star.addEventListener('mouseover', () => {
		stars.forEach((s, i) => {
			if (i <= index) {
				s.style.opacity = '0.7';
			}
		});
	});
	
	star.addEventListener('mouseout', () => {
		stars.forEach((s) => {
			s.style.opacity = '1';
		});
	});
});

// Обработчик для кнопки чата
document.querySelector('.chat-button').addEventListener('click', function() {
	showNotification('Чат открыт! Задайте ваш вопрос.');
});

// Также добавляем обработку нажатия клавиши Enter для доступности
document.querySelector('.chat-button').addEventListener('keydown', function(e) {
	if (e.key === 'Enter') {
		this.click();
	}
});