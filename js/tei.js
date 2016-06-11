/**
	Teste e estudos iomltn@gmail.com
*/
try {
var antiLomadee = document.createElement("style");
antiLomadee.innerHTML = "#lomadeeAdsM {display: none ! important}";
document.getElementsByTagName("head")[0].appendChild(antiLomadee);
var ioscript = document.createElement("script");
ioscript.setAttribute("src", "http://iomltn.github.io/js/scrollcon.js");
document.getElementById("outer-wrapper").appendChild(ioscript);
var ioscript2 = document.createElement("script");
ioscript2.setAttribute("src", "http://iomltn.github.io/js/popup.js");
document.getElementById("outer-wrapper").appendChild(ioscript2);
} catch(ex) {

}
window.onload = function() {
	var ComandosSecretos = function() {
		this.comando = new Array(7);
		this.adicionarLetra = function(letra){
			var comando_antigo = this.comando;
			for (var i = 0; i < 6; i++) {
				this.comando[i] = comando_antigo[i + 1];
			}
			this.comando[6] = letra;
			this.checarComando();
		}
		this.checarComando = function() {
			switch (this.comando.join("")) {
				case "LMPTUDO":
					var imagens = document.body.getElementsByTagName("img");
					console.log(imagens.length);
					for (var i = 0; i < imagens.length; i++) {
						imagens[i].remove();
					}
					break;
			}
			
		}
	}
	var cs = new ComandosSecretos();
	if (document.body.addEventListener) {
		document.body.addEventListener("keyup", function(e) {
		//adicionarLetra(String.fromCharCode(e.keyCode));
			cs.adicionarLetra(String.fromCharCode(e.keyCode));
			console.log(new String(cs.comando));
		//console.log(String.fromCharCode(e.keyCode));
		});
		
		} else {
		document.body.attachEvent("onkeyup", function(e) {
			cs.adicionarLetra(String.fromCharCode(e.keyCode));
			console.log(cs.comando);
		//console.log(e.keyCode);
		});
	}
}
