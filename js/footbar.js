var footbar = document.createElement("div");
footbar.setAttribute("id", "footbar");
var aw = document.createElement("a");
aw.setAttribute("href", "http://api.whatsapp.com/send?1=pt_BR&phone=" + autor.whatsapp);
aw.innerHTML = autor.nome;

var ae = document.createElement("a");
ae.setAttribute("href", "mailto: " + autor.email);
ae.innerHTML = autor.email;

var s = document.createTextNode(" - ");

footbar.appendChild(aw);
footbar.appendChild(s);
footbar.appendChild(ae);

