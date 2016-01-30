/**
	Teste e estudos iomltn@gmail.com
*/
window.addEventListener("load", function() {
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
				$('html, body').scrollTop(0);
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
