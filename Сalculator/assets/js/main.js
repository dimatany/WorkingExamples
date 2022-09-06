let buttons = document.querySelector('.buttons');
let btn = document.querySelectorAll('span');
let value = document.getElementById('value');
let toggleBtn = document.querySelector('.toggleBtn');
let body = document.querySelector('body');


for(let i=0; i<btn.length; i++) {
	btn[i].addEventListener('click', function(){
		if(this.innerHTML==='='){
			value.innerHTML = eval(value.innerHTML).toFixed(2);
		}else {
			if(this.innerHTML==='Clear'){
				value.innerHTML = '';
			}
			else {
				value.innerHTML += this.innerHTML;
			}
			//поправки
			if(this.innerHTML==='/ 0'){
				value.innerHTML = "error"
			}
			if(this.innerHTML === value.length > 3){
				value.innerHTML = 'number too long';
			}
		}
	})
}



toggleBtn.onclick = function(){
	body.classList.toggle('dark')
}