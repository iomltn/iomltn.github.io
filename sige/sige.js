var periodo = document.getElementsByName("ds_Periodo")[0].value;
var trs = document.getElementsByTagName("tr");
var dE = document.getElementsByClassName("subTituloBold");
var inputs = document.getElementsByTagName("input");
var disciplinas = [];
var alunos = [];
var dadosTitulo = document.getElementsByClassName("subTituloBold")[0].innerHTML.split("|");
var turma = dadosTitulo[0].trim();


function getNome(tr) {
	try {
		return  tr.getElementsByTagName("td")[1].childNodes[0].nodeValue;
    } catch(e) {
		return 0;
    }
}


for (var i = 3; i < dE.length; i++) {
	var idDisciplina = dE[i].getElementsByTagName("input")[0].value.trim();
	var nomeDisciplina = dE[i].childNodes[0].nodeValue.trim();
	switch (idDisciplina) {
		case "530":
			nomeDisciplina = "EDUCAÇÃO FÍSICA";
			break;
		case "210":
			nomeDisciplina = "CIÊNCIAS";
			break;
		case "670":
			nomeDisciplina = "RELIGIÃO";
			break;
		case "970":
			nomeDisciplina = "HISTÓRIA";
			break;
		case "1130":
			nomeDisciplina = "INGLÊS";
			break;
		case "1140":
			nomeDisciplina = "PORTUGUÊS";
			break;
		case "1200":
			nomeDisciplina = "MATEMÁTICA";
	}
	disciplinas.push([idDisciplina, nomeDisciplina]);
}

for (var i = 3; i < trs.length; i++) {
	var linha = getNome(trs[i]);
	if (linha != 0) {
		var tmp = linha.split("-");
		alunos.push([tmp[0].trim(), tmp[1].trim()]);
	}
}

function getNota(idAluno, idDisciplina) {
	var str = "nr_Nota_" + idAluno + "_" + idDisciplina;
	var nota = document.getElementById(str);
	return nota.value;
}

function chamar() {
	var pp = window.open("", "Notas");
	pp.document.write("<style>td, th {padding: 5px; border: font-size: 10px; solid 1px gray; text-align: center; font-family: arial}</style>");
	pp.document.write("<table border=\"1\" style=\"border-collapse: collapse\">");
	pp.document.write("<tr><th colspan=\"2\">" + turma.toUpperCase() + "</th><th colspan=\"" + disciplinas.length + "\">" + periodo.toUpperCase() + "</th></tr>");
	pp.document.write("<tr>");
	pp.document.write("<th>MATRÍCULA SIGE</th><th>ALUNOS</th>");
	for (var i = 0; i < disciplinas.length; i++) {
		pp.document.write("<th>" + disciplinas[i][1] + "</th>");
	}
	pp.document.write("</tr>");
	for (var i = 0; i < alunos.length; i++) {
		pp.document.write("<tr>");
		pp.document.write("<td>" + alunos[i][0] + "</td>");
		pp.document.write("<td style=\"text-align: left\">" + alunos[i][1] + "</td>");
		for (var j = 0; j < disciplinas.length; j++) {
			var nota = getNota(alunos[i][0], disciplinas[j][0]);
			pp.document.write("<td>" + nota + "</td>");
		}
		pp.document.write("</tr>");
	}
	pp.document.write("</table><p>");
}
