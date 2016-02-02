var AvuaAsBandaDeLado = function() {
	var idNoticia = -1;
	var posicaoTopElemento = 0;
	var titulos = document.getElementsByClassName("post-title");
	for (var i = 0; i < titulos.length; i++) {
		posicaoTopElemento = titulos[i].offsetTop;
		var link = titulos[i].getElementsByTagName("a")[0];
		link.setAttribute("name", "noticia" + i);
		link.addEventListener("pageshow", function() {
			idNoticia = i;
		});
	}
	this.verificaNoticiaAtual = function() {
		var alturaCliente = document.body.clientHeight;
		var posicaoScroll = document.body.scroll;
		var posicaoTopElemento;
		for (var i = 0; i < titulos.length; i++) {
			posicaoTopElemento = titulos[i].offsetTop;
			if (posicaoTopElemento > posicaoScroll  && posicaoTopElemento < (posicaoScroll + alturaCliente)) {
				idNoticia = i;
				console.log(idNoticia);
				break;
			};		
		};
	};
	this.setEventTeclado = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 39 && idNoticia == -1) {
			idNoticia++;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idNoticia)[0].offsetTop - 100}, 10000);			
		} else if (keyCode == 37 && idNoticia == 0) {
			idNoticia--;
			$('html, body').stop().animate({scrollTop: 0}, 10000);			
		} else if (keyCode == 39 && idNoticia == titulos.length - 1) {
			idNoticia = -1;
			$('html, body').stop().animate({scrollTop: 0}, 'slow');
		} else if (keyCode == 39 && idNoticia < titulos.length - 1) {
			idNoticia++;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idNoticia)[0].offsetTop - 100}, 'slow');
		} else if (keyCode == 37 && idNoticia > 0) {
			idNoticia--;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idNoticia)[0].offsetTop - 100}, 'slow');
		} else if (keyCode == 37 && idNoticia == -1) {
			idNoticia = titulos.length - 1;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idNoticia)[0].offsetTop - 100}, 'slow');
		}
	}
};
var SobePraCima = function() {
	var scrollTop = 0;
	var larguraPagina = 0;
	var elementoDiv = null;

	var getElementoDiv = function() {
		// Estilo do elemento
		var style = document.createElement("style");
		style.innerHTML = "#setaTopo {position: fixed;	bottom: 10px; right: 10px; cursor: pointer; display: none; width: 20px; height: 20px; background: lightgray; }";
		document.getElementsByTagName("head")[0].appendChild(style);
		// Elemento
		var div = document.createElement("div");
		div.setAttribute("id", "setaTopo");
		div.addEventListener("click", function() {
			idNoticia = -1;
			$('html, body').animate({scrollTop:0}, 'slow');
		});
		document.body.appendChild(div);
		return div;
	}
	elementoDiv = getElementoDiv();
	this.verifica = function() {
		scrollTop = document.body.scrollTop;
		larguraPagina = document.body.clientWidth;
		if (scrollTop > 1598 && larguraPagina >= 730) {
			elementoDiv.setAttribute("style", "display: block");
		} else {
			elementoDiv.setAttribute("style", "display: none");
		}
	}
};
var sobe = new SobePraCima();
var avua = new AvuaAsBandaDeLado();
if (document.body.addEventListener) {
	window.addEventListener("scroll", function() {
		sobe.verifica();
		avua.verificaNoticiaAtual();
	});
	document.body.addEventListener("keyup", function(e) {
		avua.setEventTeclado(e);
	});
} else {
	window.attachEvent("onscroll", function() {
		sobe.verifica();
		avua.verificaNoticiaAtual();
	});
	document.body.attachEvent("onkeyup", function(e) {
		avua.setEventTeclado(e);
	});
};
