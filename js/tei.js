/**
	Teste e estudos iomltn@gmail.com
*/
var antiLomadee = document.createElement("style");
antiLomadee.innerHTML = "#lomadeeAdsM {display: none ! important}";
document.getElementsByTagName("head")[0].appendChild(antiLomadee);
window.addEventListener("load", function() {
	try {
		document.getElementById("lomadeeAdsM").remove();
	} catch(e) {

	}
	var titulos = document.getElementsByClassName("post-title");
	var idTitulo = -1;
	for (var i = 0; i < titulos.length; i++) {
		var link = titulos[i].getElementsByTagName("a")[0];
		link.setAttribute("name", "noticia" + i);
		link.addEventListener("pageshow", function() {
			idTitulo = i;
		});
	}
	window.addEventListener("keyup", function() {
		var keyCode = window.event.keyCode;
		if (keyCode == 39 && idTitulo == -1) {
			idTitulo++;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idTitulo)[0].offsetTop - 100}, 10000);			
		} else if (keyCode == 39 && idTitulo == titulos.length - 1) {
			idTitulo = -1;
			$('html, body').stop().animate({scrollTop: 0}, 'slow');
		} else if (keyCode == 39 && idTitulo < titulos.length - 1) {
			idTitulo++;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idTitulo)[0].offsetTop - 100}, 'slow');
		} else if (keyCode == 37 && idTitulo >= 0) {
			idTitulo--;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idTitulo)[0].offsetTop - 100}, 'slow');
		} else if (keyCode == 37 && idTitulo == -1) {
			idTitulo = titulos.length - 1;
			$('html, body').stop().animate({scrollTop: document.getElementsByName("noticia" + idTitulo)[0].offsetTop - 100}, 'slow');
		}
	});
	var Objeto = function() {
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
				idTitulo = -1;
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
		};
	}
	var o = new Objeto();
	document.addEventListener("scroll", function() {
		o.verifica();
	});
});
