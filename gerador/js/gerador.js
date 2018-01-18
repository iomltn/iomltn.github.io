/*
declaraca 0
nome 1
instancia 2
instancia_retorno 3
tipo sql 4
tipo statement 5
*/

window.onload = function() {
	var tA0 = document.getElementById("origem");
	
	var pMai = function(str) {
		return str[0].toUpperCase() + str.substring(1, str.length);
	}
	var pMin = function(str) {
		return str[0].toLowerCase() + str.substring(1, str.length);
	}	
	function getImportsBean() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		// classe bean
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			if ((!(strJava.indexOf(c[0]) != -1 && strJava.indexOf(c[2]) != -1)) && c[0].indexOf("Property") != -1) {
				strJava += "import javafx.beans.property." + c[0] + ";\n";
				strJava += "import javafx.beans.property." + c[2] + ";\n";
			}
		}
		return strJava;
	}
	
	function getClasseBean() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		// classe bean
		strJava += getImportsBean();		
		strJava += "\n";
		strJava += "public class " + classe + " {\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\tprivate " + c[0] + " " + c[1] + ";\n";
		}
		strJava += "\tpublic " + classe + "() {\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\tthis." + c[1] + " = new " + c[2] + "();\n";
		}
		strJava += "\t}\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\tpublic void set" + pMai(c[1]) + "(" + c[3] + " " + c[1] +") {\n";
			strJava += "\t\tthis." + c[1] + ".set(" + c[1] + ");\n";
			strJava += "\t}\n";
			strJava += "\tpublic " + c[3] + " get" + pMai(c[1]) + "() {\n";
			strJava += "\t\treturn this." + c[1] + ".get();\n";
			strJava += "\t}\n";
		}
		strJava += "}\n\n";
		return strJava;
	}
	function getClasseDAO() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";		
		// classe dao
		strJava += "import java.util.List;\nimport java.util.ArrayList;\nimport java.sql.Connection;\nimport java.sql.Statement;\nimport java.sql.PreparedStatement;\nimport java.sql.SQLException;\nimport java.sql.ResultSet;\n\n";
		// construtor		
		strJava += "public class " + classe + "DAO {\n";
		strJava += "\tpublic " + classe + "DAO() {\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tStatement stmt = conexao.createStatement();\n";
		strJava += "\t\t\tString sql = \"create table if not exists " + tabelaSql + "(\"\n";
		// linha do id
		var c1 = linhas[1].split(" ");
		strJava += "\t\t\t\t\"" + c1[1] + " " + c1[4] + "primary key autoincrement not null, \"\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\t\t\"" + c[1] + 	" " + c[4] + " not null";
			if (i < linhas.length - 1) {
				strJava += ", \"\n";
			}
		}
		strJava += ")\";\n";
		strJava += "\t\t\tstmt.executeUpdate(sql);\n";
		strJava += "\t\t\tstmt.close();\n";
		strJava += "\t\t} catch (SQLException e) {\n";
		strJava += "\t\t\te.printStackTrace();\n";
		strJava += "\t\t}\n";
		strJava += "\t}\n";
		// cadastrar
		strJava += "\tpublic void cadastrar(" + classe + " " + pMin(classe) + ") {\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tString sql = \"insert into " + tabelaSql + " (";
		var temp = "";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += c[1];
			temp += "?";
			if (i < linhas.length - 1) {
				strJava += ", ";
				temp += ", ";
			}	
		}
		strJava += ") values (" + temp + ")\";\n";
		strJava += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\tstmt.set" + pMai(c[3]) + "(" + (i-1) + ", " + pMin(classe) + ".get" + pMai(c[1]) + "());\n";
		}
		strJava += "\t\t\tstmt.execute();\n";
		strJava += "\t\t\tstmt.close();\n";
		strJava += "\t\t} catch (SQLException e) {\n";
		strJava += "\t\t\te.printStackTrace();\n";
		strJava += "\t\t}\n";
		strJava += "\t}\n";
		// remover
		strJava += "\tpublic void remover(" + c1[3] + " " + c1[1] + ") {\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tString sql = \"delete from " + tabelaSql + " where " + c1[1] + " = ?\";\n";
		strJava += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		strJava += "\t\t\tstmt.set" + c1[5] + "(1, " + c1[1] + ");\n";
		strJava += "\t\t\tstmt.execute();\n";
		strJava += "\t\t\tstmt.close();\n";
		strJava += "\t\t} catch (SQLException e) {\n";
		strJava += "\t\t\te.printStackTrace();\n";
		strJava += "\t\t}\n";
		strJava += "\t}\n";
		// alterar
		strJava += "\tpublic void alterar(" + classe + " " + pMin(classe) + ") {\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tString sql = \"update " + tabelaSql + " ";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "set " + c[1] + " = ?";
			if (i < linhas.length - 1) {
				strJava += ", ";
			}
		}
		strJava += " where " + c1[1] + " = ?;\";\n";
		strJava += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\tstmt.set" + pMai(c[3]) + "(" + (i-1) + ", " + pMin(classe) + ".get" + pMai(c[1]) + "());\n"; 
		}
		strJava += "\t\t\tstmt.set" + c1[5] + "(" + (linhas.length-1) + ", " + pMin(classe) + ".get" + pMai(c1[1]) + "());\n";
		strJava += "\t\t\tstmt.execute();\n";
		strJava += "\t\t\tstmt.close();\n";
		strJava += "\t\t} catch (SQLException e) {\n";
		strJava += "\t\t\te.printStackTrace();\n";
		strJava += "\t\t}\n";
		strJava += "\t}\n";
		// pesquisar
		var c2 = linhas[2].split(" ");
		strJava += "\tpublic List<" + classe + "> pesquisar(" + c2[3] + " query) {\n";
 		strJava += "\t\tList<" + classe + "> " + tabelaSql + " = new ArrayList<" + classe + ">();\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tString sql = \"select * from " + tabelaSql + " where " + c2[1] + " like ? order by " + c2[1] +"\";\n";
		strJava += "\t\t\tPreparedStatement stmt = conexao.prepareStatement(sql);\n";
		strJava += "\t\t\tstmt.set" + c2[5] + "(1, query + \"%\");\n";
		strJava += "\t\t\tResultSet rs = stmt.executeQuery();\n";
		strJava += "\t\t\twhile (rs.next()) {\n";
		strJava += "\t\t\t\t" + classe + " " + pMin(classe) + " = new " + classe + "();\n";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\t\t" + pMin(classe) + ".set" + pMai(c[1]) + "(rs.get" + pMai(c[3]) + "(\"" + c[1] + "\"));\n";
		}
		strJava += "\t\t\t\t" + tabelaSql + ".add(" + pMin(classe) + ");\n";
		strJava += "\t\t\t}\n";
		strJava += "\t\t\tstmt.close();\n";
		strJava += "\t\t} catch (SQLException e) {\n";
		strJava += "\t\t\te.printStackTrace();\n";
		strJava += "\t\t}\n";
		strJava += "\t\treturn " + tabelaSql + ";\n";
		strJava += "\t}\n";
		strJava += "}\n";
		return strJava;
	};
	function getClasseApplication() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		strJava += "import javafx.application.Application;\n";
		strJava += "import javafx.stage.Stage;\n";
		strJava += "import javafx.scene.Scene;\n";
		strJava += "import javafx.scene.control.Label;\n";
		strJava += "import javafx.scene.control.TextField;\n";
		strJava += "import javafx.scene.control.Button;\n\n";
		strJava += "import javafx.scene.layout.GridPane;\n";
		strJava += "import javafx.geometry.Insets;\n";
		strJava += "public class J" + classe + " extends Application {\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\tLabel l" + pMai(c[1]) + ";\n";
			strJava += "\tTextField tf" + pMai(c[1]) + ";\n";
		}
		strJava += "\tButton btnCadastrarAlterar;\n";
		strJava += "\tButton btnExcluir;\n";
		strJava += "\tButton btnCancelar;\n";
		strJava += "\n\t@Override\n\tpublic void start(Stage stage) {\n";
		strJava += "\t\tstage.setTitle(\"" + classe + "\");\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\tl" + pMai(c[1]) + " = new Label(\"" + pMai(c[1]) + "\");\n";
			strJava += "\t\ttf" + pMai(c[1]) + " = new TextField();\n";
		}
		strJava += "\t\tbtnCadastrarAlterar = new Button(\"Cadastrar\");\n";
		strJava += "\t\tbtnExcluir = new Button(\"Excluir\");\n";
		strJava += "\t\tbtnCancelar = new Button(\"Cancelar\");\n";
		strJava += "\t\tbtnCadastrarAlterar.setOnAction(e -> {\n";
		strJava += "\t\t\t" + classe + " " + pMin(classe) + " = new " + classe + "();\n";
		strJava += "\t\t\t" + classe + "DAO " + pMin(classe) + "DAO = new " + classe + "DAO();\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\t" + pMin(classe) + ".set" + pMai(c[1]) + "(tf" + pMai(c[1]) + ".getText());\n";
		}
		strJava += "\t\t\t" + pMin(classe) + "DAO.cadastrar(" + pMin(classe) + ");\n";
		strJava += "\t\t});\n";
		strJava += "\t\tGridPane grid = new GridPane();\n";
		strJava += "\t\tgrid.setPadding(new Insets(10));\n";
		strJava += "\t\tgrid.setVgap(10);\n";
		strJava += "\t\tgrid.setHgap(10);\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\grid.add(l" + pMai(c[1]) + ", 0, " + (i - 1) + ");\n";
			strJava += "\t\t\grid.add(tf" + pMai(c[1]) + ", 1, " + (i - 1) + ");\n";
		}
		strJava += "\t\tScene scene = new Scene(grid);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.show();\n";
		strJava += "\t}\n";
		strJava += "\tpublic static void main(String[] args) {\n";
		strJava += "\t\tlaunch(args);\n";
		strJava += "\t}\n";
		strJava += "}";
		return strJava;
	}
	var btnBean = document.getElementById("gerarBean");
	var btnDAO = document.getElementById("gerarDAO");
	var btnApplication = document.getElementById("gerarApplication");
	
	
	btnBean.addEventListener("click", function() {
		var wbean = window.open("", "");
		wbean.document.write("<textarea style=\"width: 100%; height: 100%\">");
		wbean.document.write(getClasseBean());
		wbean.document.write("</textarea>");
	});
	btnDAO.addEventListener("click", function() {
		var wdao = window.open("", "");
		wdao.document.write("<textarea style=\"width: 100%; height: 100%\">");
		wdao.document.write(getClasseDAO());
		wdao.document.write("</textarea>");
	});
	btnApplication.addEventListener("click", function() {
		var wdao = window.open("", "");
		wdao.document.write("<textarea style=\"width: 100%; height: 100%\">");
		wdao.document.write(getClasseApplication());
		wdao.document.write("</textarea>");
	});
}
