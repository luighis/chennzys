
/* menu scroll */

var scroll = new SmoothScroll();
var smoothScrollWithoutHash = function (selector, settings) {

	var clickHandler = function (event) {
		var toggle = event.target.closest(selector);

		if (!toggle || toggle.tagName.toLowerCase() !== 'a') return;
		
		var anchor = document.querySelector(toggle.hash);

		if (!anchor) return;

		event.preventDefault();
		scroll.animateScroll(anchor, toggle, settings || {});
	};

	window.addEventListener('click', clickHandler, false);
};
smoothScrollWithoutHash('a[href*="#"]');

/* menu-boton */

var btn = document.querySelector('.menu-btn');

btn.addEventListener('click', function () {

	var body = document.body;
	body.classList.toggle('show-menu');

	if (body.classList.contains('show-menu')) {
		btn.classList.add('icon-cancel', 'icon-color-top');
	} else {
		btn.classList.remove('icon-cancel', 'icon-color-top');
	}

}, false);

/* menu-color-icon */

var aboutSection = document.querySelector(".about-section"),
	height = aboutSection.offsetTop,
	menuBtn = document.querySelector('.menu-btn');

var changeHeight = function () {
	height = aboutSection.offsetTop;
};

var changeColorIcon = function () {

	if (window.pageYOffset >= height - 45) {
		menuBtn.classList.add("icon-color");
  	} else {
		menuBtn.classList.remove("icon-color");
  	}
};

window.addEventListener('scroll', changeColorIcon, false);
window.addEventListener('resize', changeHeight, false);

/* form effects */

var form = document.getElementById('contact-form');

for (var index = 0; index < form.length - 1; index++) {
	form.elements[index].value = '';
}

form.addEventListener('click', function (event) {
	
	if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
		var element = event.target;

		if (!element.classList.contains('send')) element.nextElementSibling.classList.add('form-blur');
		
		element.addEventListener('blur', function () {

			if (element.value !== '') {
				return;
			} else {
				element.nextElementSibling.classList.remove('form-blur');
			}
		});
	}
});

/* form validation - send ajax */

var removeClass = function () {

	var elements = document.querySelectorAll('.form-blur');	
		elements.forEach( function (element) {
			element.classList.remove('form-blur');
		});
};

var ajaxForm = function () {

	var preload = form.querySelector('.preload'),
		message = form.querySelector('.message'),
		btnSend = form.querySelector('.send'),
		messageServer = document.querySelector('.message-server'),
		formData = '';

	var ajax = new XMLHttpRequest();

	ajax.open('POST', './../form.php', true);
	ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

	ajax.addEventListener('readystatechange', function (event) {
		
		btnSend.classList.add('color-submit');
		preload.classList.remove('hidden');
	
		if (ajax.readyState === 4 && ajax.status === 200) {
			preload.classList.add('hidden');
			
			if (ajax.responseText !== 'mensaje enviado' ) {
				messageServer.innerHTML = ajax.responseText;
				messageServer.classList.add('error-server');
				btnSend.classList.remove('color-submit');
			} else {
				message.classList.remove('hidden');
				message.innerHTML = ajax.responseText;
			}
			
			form.reset();
			removeClass();
			setTimeout( function () {
				message.classList.add('hidden');
				btnSend.classList.remove('color-submit');
			}, 4000);
		} else if (ajax.readyState === 4 && ajax.status === 404) {
			preload.classList.add('hidden');
			btnSend.classList.remove('color-submit');
			alert('El servidor NO responde. Error N°: ' + ajax.status +' - ' + ajax.statusText + ' - Mensaje no enviado');
			//message.innerHTML = '<b>El servidor NO responde. Error N°: ' + ajax.status +':  <mark>' + ajax.statusText + '</mark></b>';
		} 
	
	});

 	for (var index = 0; index < form.length -1; index++) {
		formData += form.elements[index].name+ '='+ form.elements[index].value+ '&';
 	}

	console.log(formData);
	ajax.send(encodeURI(formData));
};

var validateEmail = function (mail) {
	return /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}; 

var createElement = function (tag, text) {

	var nodo = document.createElement(tag);
        nodo.textContent = text;
		return nodo;
 };  

var inputsErrors = function (inputs) {
    
	var field,
		countErrors = inputs.length;
        
	for (var index = 0; index < inputs.length; index++) {

		if (inputs[index].name === 'email' && inputs[index].value !== '') {

			if (!validateEmail(inputs[index].value))  {
				field = createElement('div', 'ingrese un email valido');
				field.className='errors';
				inputs[index].parentNode.appendChild(field);
			} else {
				countErrors--;
			}	
		} else {
		    field = createElement('div', 'Complete este campo');
			field.className='errors';
			inputs[index].parentNode.appendChild(field);
		}
	 }		
	return countErrors; 
};

var inputsEmpty = function (form) {

	var	element,
		inputs = [];

	for (var index = 0; index < form.length; index++) {
		element = form.elements[index].value.trim();
		if (!element || form.elements[index].name === 'email') inputs.push(form.elements[index]);	 
	}
	return inputs;
 };

var eraseErrors = function (form) {
	
	var parent,
	 	child;
    
	for (var index = 0; index < form.length - 1; index++) {
		parent = form.elements[index].parentNode;
		child = parent.lastElementChild;
		if (child.getAttribute('class') === 'errors') parent.removeChild(child);
	}
};

var validate = function (event) {
  
	event.preventDefault();
	
	var inputs,
		countErrors= 0,
		countClass = document.getElementsByClassName('errors').length,
		messageServer = document.querySelector('.message-server'); 

	if (messageServer.classList.contains('error-server')) {
		messageServer.classList.remove('error-server');
		messageServer.innerHTML = '';
	}	

	if (countClass) eraseErrors(form);

 	inputs = inputsEmpty(form);
	countErrors = inputsErrors(inputs);  

	if (!countErrors) ajaxForm();
};

form.addEventListener('submit', validate, false);





