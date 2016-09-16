function getResultados(c, filtro) {
	var resultados = [];
	for (var i = 0; i < c.length; i++) {
		var nome = c[i][0].toUpperCase();
		if (nome.indexOf(filtro.toUpperCase()) != -1) {
			resultados.push(c[i]);
		}
	}
	return resultados;
}
function atualizaContatos(contatos, resultados) {
	contatos.innerHTML = "";
	for (var i = 0; i < resultados.length; i++) {
		var contato = document.createElement("div");
		var nome = document.createElement("div");
		var telefone = document.createElement("div");

		contato.setAttribute("class", "contato");
		nome.setAttribute("class", "nome");
		telefone.setAttribute("class", "telefone");

		nome.innerHTML = resultados[i][0]; //nome
		telefone.innerHTML  = resultados[i][1]; //telefone

		contato.appendChild(nome);
		contato.appendChild(telefone);
		contatos.appendChild(contato);
	} 
}
function criarAgenda(parent) {
	var input =  document.createElement("input");
	var contatos = document.createElement("div");
	input.setAttribute("id", "input-filtro");
	input.setAttribute("placeholder", "Filtrar contatos");
	contatos.setAttribute("id", "contatos");
	if (input.addEventListener) {
		input.addEventListener("keyup", function() {
			var resultados = getResultados(dados, input.value);
			if (input.value.length > 0) {
				atualizaContatos(contatos, resultados);
			} else {
				atualizaContatos(contatos, dados);	
			}
		});
	} else {
		input.attachEvent("onKeyup", function() {
			var resultados = getResultados(dados, input.value);
			if (input.value.length > 0) {
				atualizaContatos(contatos, resultados);
			} else {
				atualizaContatos(contatos, dados);	
			}
		});
	}
	parent.appendChild(input);
	parent.appendChild(contatos);
	atualizaContatos(contatos, dados);
}
criarAgenda(document.getElementById("agendacamocimonline"));
