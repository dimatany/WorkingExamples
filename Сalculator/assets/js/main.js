//переключение темы
let toggleBtn = document.querySelector('.toggleBtn');
let body = document.querySelector('body');
toggleBtn.onclick = function(){
	body.classList.toggle('dark')
}
//логика калькулятора
let a = '';//первое число
let b = '';//второе число
let sign = '';//знак операции
let finish = false;

const digit = ['0','1', '2', '3', '4','5','6','7','8','9','.'];//с помощью него проверяем что нажато
const action = ['-','+','X','/'];//массив операций

const out = document.querySelector('.calc-screen');
function ClearAll(){
	a = '';//первое число и результат
	b = '';//второе число
	sign = '';//знак операции
	finish = false;
	out.textContent = 0;
}

document.querySelector('.ac').onclick = ClearAll;
document.querySelector('.buttons').onclick = (event) => {
	//если нажата кнопка clearAll ac
	if(event.target.classList.contains('.ac')) return;
	out.textContent = '';
	//получаю нажатую кнопку
	const key = event.target.textContent;
	//если нажата кнопка 0-9 или '.'
	if(digit.includes(key)){
		if (b ==='' && sign === '') {
			if (key === '.' && a.includes('.')) {//нажатие двух точек исключаем
				a += '';
				console.log(a, b, sign);
				out.textContent = a;
			} else {
				a += key;
				console.log(a, b, sign);
				out.textContent = a;
			}
		}
		else if (a !=='' && b !=='' && finish){
			b = key;
			finish = false;
			out.textContent = b;
		}
		else {
			if (key === '.' && b.includes('.')) {//нажатие двух точек исключаем
				b += '';
				console.log(a, b, sign);
				out.textContent = b;
			} else {
				b += key;
				console.log(a, b, sign);
				out.textContent = b;
			}
		}
		console.log(a, b, sign);
		return;
	}
	//если нажата кнопка + - / X или '.'
	if(action.includes(key)){
		sign = key;
		out.textContent = sign;//тут же продумать ограничение в знаках --
		console.log(a, b, sign);
		return;
	}
	//нажатие =
	if(key === '=') {
		if(b ==='') b = a;
		switch (sign) {
			case '+':
				a = (+a) + (+b);
				break;
			case '-':
				a = a - b;
				break;
			case 'X':
				a = a * b;
				break;
			case '/':
				if( b === '0') {
					out.textContent = 'error';
					a = '';
					b = '';
					sign = '';
					return;
				}
				a = a / b;
				break;
		}
		finish = true;
		out.textContent = a;
		console.log(a, b, sign);
	}
}

//закрепить количество цифр вводимых в поле до 9
//реализовать логику +/-
//перед цифрой запретить вставлять 0000




















