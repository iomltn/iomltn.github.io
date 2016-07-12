var estilo_popup = document.createElement("style");
estilo_popup.innerHTML = "#popup {z-index: 1000; position: fixed; width: 550px; height: 550px; background: rgb(0, 153, 51); border-radius: 10px; padding: 2px; display: none; top: 50px; left: 50%; margin-left: -275px}";
estilo_popup.innerHTML += "#popup #imagem {border-radius: 8px; display: none;}";
estilo_popup.innerHTML += "#popup #imagem_fechar {position: absolute; top: -9px; right: -9px; cursor: pointer;}";
document.getElementsByTagName("head")[0].appendChild(estilo_popup);

var top, left = 0;
var clientWidth = document.body.clientWidth;
var clientHeight = document.body.clientHeight;
var scrollTop = 0;
var visibilidade_popup = true;
var popup = document.createElement("div");
popup.setAttribute("id", "popup");
var imagem = document.createElement("img");
var imagem_fechar = document.createElement("img");
imagem.setAttribute("src", "https://3.bp.blogspot.com/-i2rTHDEt6Ao/V4T5RWlKGrI/AAAAAAAADQg/tRlpVNH1LZEDXvbSFApH3od3loMXAJzvwCLcB/s1600/ites_popup.png");
imagem.setAttribute("id", "imagem");
imagem.setAttribute("width", "550");
imagem.setAttribute("height", "550");
imagem_fechar.setAttribute("src", "https://1.bp.blogspot.com/-4WAs-gBR-S4/V0YH-GiyJ3I/AAAAAAAADMA/7Lis8F2tDnc84nIudpUq79rOSz60_GfHQCLcB/s1600/fechar.png");
imagem_fechar.setAttribute("id", "imagem_fechar");
/*
top = (clientHeight / 2);
left = (clientWidth / 2);
popup.setAttribute("style", "top: " + top + "px; left: " + left + "px");*/

var mostrar_popup = function() {
	$(popup).fadeIn("fast", function() {
		$(imagem).fadeIn("fast");
	});
}
var verifica_se_mostra = function() {
	scrollTop = $(window).scrollTop();
	if (scrollTop > 1482 && visibilidade_popup) {
	//if (scrollTop > 10 && visibilidade_popup) {
		mostrar_popup();
		visibilidade_popup = false;
	}
}
if (document.body.addEventListener) {
	imagem.addEventListener("load", function() {
		verifica_se_mostra();
	});
	window.addEventListener("scroll", function() {
		verifica_se_mostra();
	});
	document.body.addEventListener("keyup", function(e) {
		if (e.keyCode == 27) {
			$(popup).fadeOut("fast");
		}
	});

} else  {
	imagem.attachEvent("onload", function() {
		verifica_se_mostra();
	});
	window.attachEvent("onscroll", function() {
		verifica_se_mostra();
	});
	document.body.attachEvent("onkeyup", function(e) {
		if (e.keyCode == 27) {
			$(popup).fadeOut("fast");
		}
	});
}
$(imagem_fechar).click(function(){
	$(popup).fadeOut("fast");
});

popup.appendChild(imagem);
popup.appendChild(imagem_fechar);
document.body.appendChild(popup);
