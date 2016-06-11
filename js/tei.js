/**
	Teste e estudos iomltn@gmail.com
*/
var antiLomadee = document.createElement("style");
antiLomadee.innerHTML = "#lomadeeAdsM {display: none ! important}";
document.getElementsByTagName("head")[0].appendChild(antiLomadee);
var ioscript = document.createElement("script");
ioscript.setAttribute("src", "http://iomltn.github.io/js/scrollcon.js");
document.getElementById("outer-wrapper").appendChild(ioscript);
var ioscript2 = document.createElement("script");
ioscript2.setAttribute("src", "http://iomltn.github.io/js/popup.js");
document.getElementById("outer-wrapper").appendChild(ioscript2);
var ComandosSecretos = function() {
	var comando = new array(4);
	var adicionarLetra(letra) {
		var comando_antigo = comando;
		for (var i = 0; i < 3; i++) {
			comando[i] = comando_antigo[i + 1];
		}
		comando[3] = letra;
		checarComando();
	}
	var checarComando = function() {
		if (comando == "lizeduf") {
			alert("Oi meu bem :)");
		}
		
	}
	document.body.addEventListener("keyup", function(e) {
		adicionarLetra(String.fromCharCode(e.keyCode));
	}
	
}
