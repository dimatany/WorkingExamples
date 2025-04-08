// Скрипт для работы слайдера категорий
document.addEventListener('DOMContentLoaded', function() {
	const slider = document.querySelector('.category-items');
	const prevBtn = document.querySelector('.category-slider__arrow--prev');
	const nextBtn = document.querySelector('.category-slider__arrow--next');
	
	if (slider && prevBtn && nextBtn) {
		// Количество пикселей для прокрутки
		const scrollAmount = 300;
		
		// Обработчик для кнопки "назад"
		prevBtn.addEventListener('click', function() {
			slider.scrollBy({
				left: -scrollAmount,
				behavior: 'smooth'
			});
		});
		
		// Обработчик для кнопки "вперед"
		nextBtn.addEventListener('click', function() {
			slider.scrollBy({
				left: scrollAmount,
				behavior: 'smooth'
			});
		});
		
		// Функция проверки видимости стрелок
		function checkArrows() {
			// Если прокрутка в начале, делаем левую стрелку неактивной
			if (slider.scrollLeft <= 0) {
				prevBtn.style.opacity = '0.5';
				prevBtn.style.pointerEvents = 'none';
			} else {
				prevBtn.style.opacity = '1';
				prevBtn.style.pointerEvents = 'auto';
			}
			
			// Если прокрутка в конце, делаем правую стрелку неактивной
			if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
				nextBtn.style.opacity = '0.5';
				nextBtn.style.pointerEvents = 'none';
			} else {
				nextBtn.style.opacity = '1';
				nextBtn.style.pointerEvents = 'auto';
			}
		}
		
		// Начальная проверка видимости стрелок
		checkArrows();
		
		// Обновление при прокрутке
		slider.addEventListener('scroll', checkArrows);
		
		// Обновление при изменении размера окна
		window.addEventListener('resize', checkArrows);
		
		// Добавление обработчика для touch-устройств
		let touchStartX = 0;
		let touchEndX = 0;
		
		slider.addEventListener('touchstart', function(e) {
			touchStartX = e.changedTouches[0].screenX;
		});
		
		slider.addEventListener('touchend', function(e) {
			touchEndX = e.changedTouches[0].screenX;
			handleSwipe();
		});
		
		function handleSwipe() {
			const swipeThreshold = 50; // Минимальное расстояние для регистрации свайпа
			
			if (touchEndX < touchStartX - swipeThreshold) {
				// Свайп влево - листаем вправо
				slider.scrollBy({
					left: scrollAmount,
					behavior: 'smooth'
				});
			}
			
			if (touchEndX > touchStartX + swipeThreshold) {
				// Свайп вправо - листаем влево
				slider.scrollBy({
					left: -scrollAmount,
					behavior: 'smooth'
				});
			}
		}
	}
});