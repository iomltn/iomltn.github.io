var menubar = document.createElement("div");
menubar.setAttribute("id", "menubar");
var titulo = document.createElement("span");
var btn = document.createElement("button");
btn.setAttribute("class", "btn_menubar");
btn.innerHTML = "Minhas Aplicações";
menubar.appendChild(btn);
var menu = document.createElement("menu");
menu.setAttribute("id", "menu");
var fechar = document.createElement("button");
fechar.innerHTML = "X";
fechar.setAttribute("class", "btn_menubar fechar");
fechar.addEventListener("click", function() {
	document.body.removeChild(menu);
});
menu.appendChild(fechar);

var ul = document.createElement("ul");
for (var i = 0; i < aplicacoes.length; i++) {
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.setAttribute("href", "../" + aplicacoes[i].link);
	var r = document.createTextNode(" " + aplicacoes[i].rotulo);
	var img = document.createElement("img");
	img.setAttribute("src", "../" + aplicacoes[i].icone);
	img.setAttribute("height", "20");
	a.appendChild(img);
	a.appendChild(r);
	li.appendChild(a);
	ul.appendChild(li);	
}
menu.appendChild(ul);

btn.addEventListener("click", function() {
	document.body.appendChild(menu);
});
