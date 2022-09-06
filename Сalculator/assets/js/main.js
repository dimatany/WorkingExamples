let buttons = document.querySelector('.buttons');
let btn = document.querySelectorAll('span');
let value = document.getElementById('value');
let toggleBtn = document.querySelector('.toggleBtn');
let body = document.querySelector('body');

for(let i=0; i<btn.length; i++) {
	btn[i].addEventListener('click', function(){
		
		if(this.innerHTML==='='){
			value.innerHTML = eval(value.innerHTML);
		}else {
			if(this.innerHTML==='Clear'){
				value.innerHTML = '';
			}
			else {
				value.innerHTML += this.innerHTML;
			}
		}
		
	})
}

toggleBtn.onclick = function(){
	body.classList.toggle('dark')
}

function hasTouch() {
	return 'ontouchstart' in document.documentElement
		|| navigator.maxTouchPoints > 0
		|| navigator.msMaxTouchPoints > 0;
}

if (hasTouch()) { // remove all the :hover stylesheets
	try { // prevent exception on browsers not supporting DOM styleSheets properly
		for (var si in document.styleSheets) {
			var styleSheet = document.styleSheets[si];
			if (!styleSheet.rules) continue;
			
			for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
				if (!styleSheet.rules[ri].selectorText) continue;
				
				if (styleSheet.rules[ri].selectorText.match(':hover')) {
					styleSheet.deleteRule(ri);
				}
			}
		}
	} catch (ex) {}
}