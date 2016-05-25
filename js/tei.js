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
