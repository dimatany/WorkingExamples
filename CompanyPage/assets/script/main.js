document.addEventListener('DOMContentLoaded', function() {
	const radioButtons = document.querySelectorAll('input[type="radio"]');
	const tabContents = document.querySelectorAll('.tab-content');
	const glider = document.querySelector('.glider');
	const lastTab = document.querySelector('#radio-4');
	
	radioButtons.forEach((radio, index) => {
		radio.addEventListener('change', function() {
			// Скрыть все содержимое вкладок
			tabContents.forEach(content => content.classList.remove('active'));
			
			// Показать соответствующий контент
			const contentId = `content-${index + 1}`;
			document.getElementById(contentId).classList.add('active');
			
			// Специальная обработка для последнего таба
			if (radio.id === 'radio-4') {
				// Добавляем проверку, чтобы глайдер не выходил за границы
				const tabContainer = document.querySelector('.tabs');
				const containerWidth = tabContainer.offsetWidth;
				const padding = parseInt(window.getComputedStyle(tabContainer).paddingRight) || 0;
				
				// Вычисляем максимальную позицию для глайдера
				const maxPosition = containerWidth - glider.offsetWidth - padding;
				
				// Небольшая задержка для уверенности, что трансформация применится после обработки остальных стилей
				setTimeout(() => {
					const gliderComputedStyle = window.getComputedStyle(glider);
					const matrix = new WebKitCSSMatrix(gliderComputedStyle.transform);
					
					// Если глайдер вышел за пределы, корректируем его позицию
					if (matrix.m41 > maxPosition) {
						glider.style.transform = `translateX(${maxPosition}px)`;
					}
				}, 10);
			} else {
				// Убрать любые ранее примененные inline стили
				glider.style.transform = '';
			}
		});
	});
});
