/*
declaraca 0
nome 1
instancia 2
instancia_retorno 3
tipo sql 4
tipo statement 5
*/

window.onload = function() {
	var pMai = function(string) {
		return string[0].toUpperCase() + string.substring(1, string.length);
	}
	var pMin = function(string) {
		return string[0].toLowerCase() + string.substring(1, string.length);
	}
	var tA0 = document.getElementById("origem");
	var tA = document.getElementById("destino");
	var button = document.getElementById("gerar");
	button.addEventListener("click", function() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		tA.value = "";
		// classe bean
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "import javafx.beans.property." + c[0] + ";\n";
			tA.value += "import javafx.beans.property." + c[2] + ";\n";
		}
		tA.value += "\n";
		tA.value += "public class " + classe + " {\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\tprivate " + c[0] + " " + c[1] + " = null;\n";
		}
		tA.value += "\tpublic " + classe + "() {\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\t\tthis." + c[1] + " = new " + c[2] + "();\n";
		}
		tA.value += "\t}\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\tpublic void set" + pMai(c[1]) + "(" + c[3] + " " + c[1] +") {\n";
			tA.value += "\t\tthis." + c[1] + ".set(" + c[1] + ");\n";
			tA.value += "\t}\n";
			tA.value += "\tpublic " + c[3] + " get" + pMai(c[1]) + "() {\n";
			tA.value += "\t\treturn this." + c[1] + ".get();\n";
			tA.value += "\t}\n";
		}
		tA.value += "}\n\n";

		// classe dao
		tA.value += "import java.util.List;\nimport java.util.ArrayList;\nimport java.sql.Connection;\nimport java.sql.Statement;\nimport java.sql.PreparedStatement;\nimport java.sql.SQLException;\nimport java.sql.ResultSet;\n\n";
		// construtor		
		tA.value += "public class " + classe + "DAO {\n";
		tA.value += "\tpublic " + classe + "DAO() {\n";
		tA.value += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		tA.value += "\t\ttry {\n";
		tA.value += "\t\t\tStatement stmt = conexao.createStatement();\n";
		tA.value += "\t\t\tString sql = \"create table if not exists " + tabelaSql + "(";
		// linha do id
		var c1 = linhas[1].split(" ");
		tA.value += c1[1] + " " + c1[4] + " primary key autoincrement not null, ";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += c[1] + 	" " + c[4] + " not null";
			if (i < linhas.length - 1) {
				tA.value += ", ";
			}
		}
		tA.value += ")\";\n";
		tA.value += "\t\t\tstmt.executeUpdate(sql);\n";
		tA.value += "\t\t\tstmt.close();\n";
		tA.value += "\t\t} catch (SQLException e) {\n";
		tA.value += "\t\t\te.printStackTrace();\n";
		tA.value += "\t\t}\n";
		tA.value += "\t}\n";
		// cadastrar
		tA.value += "\tpublic void cadastrar(" + classe + " " + pMin(classe) + ") {\n";
		tA.value += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		tA.value += "\t\ttry {\n";
		tA.value += "\t\t\tString sql = \"insert into " + tabelaSql + " (";
		var temp = "";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += c[1];
			temp += "?";
			if (i < linhas.length - 1) {
				tA.value += ", ";
				temp += ", ";
			}	
		}
		tA.value += ") values (" + temp + ")\";\n";
		tA.value += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\t\t\tstmt.set" + c[5] + "(" + (i-1) + ", " + pMin(classe) + ".get" + pMai(c[1]) + "());\n";
		}
		tA.value += "\t\t\tstmt.execute();\n";
		tA.value += "\t\t\tstmt.close();\n";
		tA.value += "\t\t} catch (SQLException e) {\n";
		tA.value += "\t\t\te.printStackTrace();\n";
		tA.value += "\t\t}\n";
		tA.value += "\t}\n";
		// remover
		tA.value += "\tpublic void remover(" + c1[3] + " " + c1[1] + ") {\n";
		tA.value += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		tA.value += "\t\ttry {\n";
		tA.value += "\t\t\tString sql = \"delete from " + tabelaSql + " where " + c1[1] + " = ?\";\n";
		tA.value += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		tA.value += "\t\t\tstmt.set" + c1[5] + "(1, " + c1[1] + ");\n";
		tA.value += "\t\t\tstmt.execute();\n";
		tA.value += "\t\t\tstmt.close();\n";
		tA.value += "\t\t} catch (SQLException e) {\n";
		tA.value += "\t\t\te.printStackTrace();\n";
		tA.value += "\t\t}\n";
		tA.value += "\t}\n";
		// alterar
		tA.value += "\tpublic void alterar(" + classe + " " + pMin(classe) + ") {\n";
		tA.value += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		tA.value += "\t\ttry {\n";
		tA.value += "\t\t\tString sql = \"update " + tabelaSql + " ";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "set " + c[1] + " = ?";
			if (i < linhas.length - 1) {
				tA.value += ", ";
			}
		}
		tA.value += " where " + c1[1] + " = ?;\";\n";
		tA.value += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\t\t\tstmt.set" + c[5] + "(" + (i-1) + ", " + pMin(classe) + ".get" + pMai(c[1]) + "());\n"; 
		}
		tA.value += "\t\t\tstmt.set" + c1[5] + "(" + (linhas.length-1) + ", " + pMin(classe) + ".get" + pMai(c1[1]) + "());\n";
		tA.value += "\t\t\tstmt.execute();\n";
		tA.value += "\t\t\tstmt.close();\n";
		tA.value += "\t\t} catch (SQLException e) {\n";
		tA.value += "\t\t\te.printStackTrace();\n";
		tA.value += "\t\t}\n";
		tA.value += "\t}\n";
		// pesquisar
		var c2 = linhas[2].split(" ");
		tA.value += "\tpublic List<" + classe + "> pesquisar(" + c2[3] + " query) {\n";
 		tA.value += "\t\tList<" + classe + "> " + tabelaSql + " = new ArrayList<" + classe + ">();\n";
		tA.value += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		tA.value += "\t\ttry {\n";
		tA.value += "\t\t\tString sql = \"select * from " + tabelaSql + " where " + c2[1] + " like ? order by " + c2[1] +"\";\n";
		tA.value += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		tA.value += "\t\t\tstmt.set" + c2[5] + "(1, query + \"%\");\n";
		tA.value += "\t\t\tResultSet rs = stmt.executeQuery();\n";
		tA.value += "\t\t\twhile (rs.next()) {\n";
		tA.value += "\t\t\t\t" + classe + " " + pMin(classe) + " = new " + classe + "();\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			tA.value += "\t\t\t\t" + pMin(classe) + ".set" + pMai(c[1]) + "(rs.get" + c[5] + "(\"" + c[1] + "\"));\n";
		}
		tA.value += "\t\t\t\t" + tabelaSql + ".add(" + pMin(classe) + ");\n";
		tA.value += "\t\t\t}\n";
		tA.value += "\t\t\tstmt.close();\n";
		tA.value += "\t\t} catch (SQLException e) {\n";
		tA.value += "\t\t\te.printStackTrace();\n";
		tA.value += "\t\t}\n";
		tA.value += "\t\treturn " + tabelaSql + ";\n";
		tA.value += "\t}\n";
		tA.value += "}\n";
	});
}
