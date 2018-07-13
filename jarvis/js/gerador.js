/*
declaraca 0
nome 1
instancia 2
instancia_retorno 3
tipo sql 4
tipo statement 5
*/

function Atributo(tipo, nome, instancia) {
	this.tipo = tipo;
	this.nome = nome;
	this.instancia = instacia;
}

function Bean(nome, atributos) {
	this.nome = nome;
	this.atributos = atributos;
}

window.onload = function() {
	var tA0 = document.getElementById("origem");
	var pkg = document.getElementById("pacote");
	
	var pMai = function(str) {
		return str[0].toUpperCase() + str.substring(1, str.length);
	}
	var pMin = function(str) {
		return str[0].toLowerCase() + str.substring(1, str.length);
	}	
	function getImportsBean() {
		var linhas = tA0.value.split("\n");
		var strJava = "";
		// classe imports bean
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			if ((!(strJava.indexOf(c[0]) != -1 && strJava.indexOf(c[2]) != -1)) && c[0].indexOf("Property") != -1) {
				strJava += "import javafx.beans.property." + c[0] + ";\n";
				strJava += "import javafx.beans.property." + c[2] + ";\n";
			}
		}
		return strJava;
	}
	
	function getLinhas() {
		return tA0.value.split("\n");
	}
	function getClasseBean() {
		var linhas = getLinhas();
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		// classe bean
		strJava += "package " + pkg.value + ".modelo;\n\n";
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
		var linhas = getLinhas();
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";	
		// classe dao
		strJava += "package " + pkg.value + ".modelo;\n\n";
		strJava += "import java.util.List;\nimport java.util.ArrayList;\nimport java.sql.Connection;\nimport java.sql.Statement;\nimport java.sql.PreparedStatement;\nimport java.sql.SQLException;\nimport java.sql.ResultSet;\n\n";
		// construtor		
		strJava += "public class " + classe + "DAO {\n";
		strJava += "\tpublic " + classe + "DAO() {\n";
		strJava += "\t\tConnection conexao = ConexaoFactory.getConexao();\n";
		strJava += "\t\ttry {\n";
		strJava += "\t\t\tStatement stmt = conexao.createStatement();\n";
		strJava += "\t\t\tString sql = \"create table if not exists " + tabelaSql + "(\" +\n";
		// linha do id
		var c1 = linhas[1].split(" ");
		strJava += "\t\t\t\t\"" + c1[1] + " " + c1[4] + " primary key autoincrement not null, \" +\n";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += "\t\t\t\t\"" + c[1] + 	" " + c[4] + " not null";
			if (i < linhas.length - 1) {
				strJava += ", \" +\n";
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
		strJava += "\t\t\tString sql = \"update " + tabelaSql + " set ";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			strJava += c[1] + " = ?";
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
	function getClasseApplicationManter() {
		var linhas = getLinhas();
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		var declaracoes = "";
		var instanciacoes = "";
		var actionsJanelaCadastrar = "";
		var gridJanelaCadastrar = "";
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			declaracoes += "\tLabel l" + pMai(c[1]) + ";\n";
			declaracoes += "\tTextField tf" + pMai(c[1]) + ";\n";
			
			instanciacoes += "\t\tl" + pMai(c[1]) + " = new Label(\"" + pMai(c[1]) + "\");\n";
			instanciacoes += "\t\ttf" + pMai(c[1]) + " = new TextField(" + pMin(classe) + " == null ? \"\" : " + pMin(classe) + ".get" + pMai(c[1]) + "());\n";
			
			actionsJanelaCadastrar += "\t\t\t\t" + pMin(classe) + ".set" + pMai(c[1]) + "(tf" + pMai(c[1]) + ".getText());\n";
			
			gridJanelaCadastrar += "\t\t\grid.add(l" + pMai(c[1]) + ", 0, " + (i - 2) + ");\n";
			gridJanelaCadastrar += "\t\t\grid.add(tf" + pMai(c[1]) + ", 1, " + (i - 2) + ");\n";
		}
		strJava += "package " + pkg.value + ".visao;\n\n";
		strJava += "import javafx.application.Application;\n";
		strJava += "import javafx.stage.Stage;\n";
		strJava += "import javafx.stage.Modality;\n";
		strJava += "import javafx.scene.Scene;\n";
		strJava += "import javafx.scene.control.Label;\n";
		strJava += "import javafx.scene.control.TextField;\n";
		strJava += "import javafx.scene.control.Button;\n";
		strJava += "import javafx.scene.layout.GridPane;\n";
		strJava += "import javafx.geometry.Insets;\n";
		strJava += "import javafx.geometry.HPos;\n";
		strJava += "import " + pkg.value + ".modelo." + classe + ";\n";
		strJava += "import " + pkg.value + ".modelo." + classe + "DAO;\n\n";
		strJava += "public class J" + classe + " extends Application {\n";
		strJava += declaracoes;
		strJava += "\tButton btnCadastrarAlterar;\n";
		strJava += "\tButton btnExcluir;\n";
		strJava += "\tButton btnCancelar;\n";
		strJava += "\t" + classe + " " + pMin(classe) + " = null;\n\n";
		strJava += "\tpublic J" + classe + "() {\n";
		strJava += "\t}\n";
		strJava += "\tpublic J" + classe + "(" + classe + " " + pMin(classe) + ") {\n";
		strJava += "\t\tthis." + pMin(classe) + " = " + pMin(classe) + ";\n";
		strJava += "\t}\n";
		strJava += "\t@Override\n\tpublic void start(Stage stage) {\n";
		strJava += "\t\tstage.setTitle(\"" + classe + "\");\n";
		strJava += instanciacoes;
		strJava += "\t\tbtnCadastrarAlterar = new Button("+ pMin(classe) + " == null ? \"Cadastrar\": \"Alterar\");\n";
		strJava += "\t\tbtnExcluir = new Button(\"Excluir\");\n";
		strJava += "\t\tbtnCancelar = new Button(\"Cancelar\");\n";
		strJava += "\t\tbtnCadastrarAlterar.setOnAction(e -> {\n";
		strJava += "\t\t\t" + classe + "DAO " + pMin(classe) + "DAO = new " + classe + "DAO();\n";
		strJava += "\t\t\tif (" + pMin(classe) + " == null) {\n";
		strJava += "\t\t\t\t" + pMin(classe) + " = new " + classe + "();\n";
		strJava += actionsJanelaCadastrar;
		strJava += "\t\t\t\t" + pMin(classe) + "DAO.cadastrar(" + pMin(classe) + ");\n";
		strJava += "\t\t\t} else {\n";
		strJava += actionsJanelaCadastrar;
		strJava += "\t\t\t\t" + pMin(classe) + "DAO.alterar(" + pMin(classe) + ");\n";
		strJava += "\t\t\t};\n";
		strJava += "\t\t\tstage.close();\n";
		strJava += "\t\t});\n";
		strJava += "\t\tGridPane grid = new GridPane();\n";
		strJava += "\t\tgrid.setPadding(new Insets(10));\n";
		strJava += "\t\tgrid.setVgap(10);\n";
		strJava += "\t\tgrid.setHgap(10);\n";
		strJava += gridJanelaCadastrar;
		strJava += "\t\tGridPane.setHalignment(btnCadastrarAlterar, HPos.RIGHT);\n";
		strJava += "\t\t\grid.add(btnCadastrarAlterar, 1, " + (linhas.length - 2)+ ");\n";
		strJava += "\t\tScene scene = new Scene(grid);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.initModality(Modality.APPLICATION_MODAL);\n";
		strJava += "\t\tstage.setResizable(false);\n";
		strJava += "\t\tstage.showAndWait();\n";
		strJava += "\t}\n";
		strJava += "}";
		return strJava;
	}
	
	function getClasseApplicationConsulta() {
		var linhas = getLinhas();
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";
		var colunasDlr = "";
		var colunasAdd = [];
		var colunasVFct = "";
		for (var i = 1; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			colunasDlr += "\t\tTableColumn tableColumn" + pMai(c[1]) + " = new TableColumn(\"" + pMai(c[1]) + "\");\n";
			colunasAdd.push("tableColumn" + pMai(c[1]));
			colunasVFct += "\t\ttableColumn" + pMai(c[1]) + ".setCellValueFactory(\n";
			colunasVFct += "\t\t\tnew PropertyValueFactory<" + classe + ", " + pMai(c[3]) + ">(\"" + c[1] + "\"));\n";
		}
		
		strJava += "package " + pkg.value + ".visao;\n\n";
		strJava += "import javafx.application.Application;\n";
		strJava += "import javafx.stage.Stage;\n";
		strJava += "import javafx.stage.Modality;\n";
		strJava += "import javafx.scene.Scene;\n";
		strJava += "import javafx.scene.control.TextField;\n";
		strJava += "import javafx.scene.control.Button;\n";
		strJava += "import javafx.scene.control.TableView;\n";
		strJava += "import javafx.scene.control.TableCell;\n";
		strJava += "import javafx.scene.control.TableColumn;\n";
		strJava += "import javafx.event.ActionEvent;\n";
		strJava += "import javafx.event.EventHandler;\n";
		strJava += "import javafx.util.Callback;\n";
		strJava += "import javafx.beans.value.ObservableValue;\n";
		strJava += "import javafx.beans.property.ReadOnlyObjectWrapper;\n";
		strJava += "import javafx.scene.control.TableColumn.CellDataFeatures;\n";
		strJava += "import javafx.geometry.Insets;\n";
		strJava += "import javafx.scene.control.cell.PropertyValueFactory;\n";
		strJava += "import javafx.collections.FXCollections;\n";
		strJava += "import javafx.scene.layout.VBox;\n";
		strJava += "import javafx.scene.layout.HBox;\n";
		strJava += "import " + pkg.value + ".modelo." + classe + ";\n";
		strJava += "import " + pkg.value + ".modelo." + classe + "DAO;\n\n";
		strJava += "public class J" + classe + "Consulta extends Application {\n";
		strJava += "\tTableView tableView = new TableView();\n";
		strJava += "\tTextField textFieldConsulta = new TextField();\n";
		strJava += "\t" + classe + "DAO " + pMin(classe) + "DAO = new " + classe + "DAO();\n";
		strJava += "\t@Override\n";
		strJava += "\tpublic void start(Stage stage) {\n";
		strJava += "\t\tstage.setTitle(\"Consultar\");\n";
		strJava += colunasDlr;
		strJava += "\t\tTableColumn tableColumnComando = new TableColumn(\"Comando\");\n";
		strJava += colunasVFct;
		strJava += "\t\ttableColumnComando.setCellValueFactory(\n";
		strJava += "\t\t\tnew Callback<CellDataFeatures<" + classe + ", " + classe + ">, ObservableValue<" + classe + ">>() {\n";
		strJava += "\t\t\t\t@Override\n";
		strJava += "\t\t\t\tpublic ObservableValue<" + classe + "> call(CellDataFeatures<" + classe + ", " + classe + "> cellDataFeatures) {\n";
		strJava += "\t\t\t\t\treturn new ReadOnlyObjectWrapper(cellDataFeatures.getValue());\n";
		strJava += "\t\t\t\t};\n";
		strJava += "\t\t\t});\n";
		strJava += "\t\ttableColumnComando.setCellFactory(\n";
		strJava += "\t\t\tnew Callback<TableColumn<" + classe + ", " + classe + ">, TableCell<" + classe + ", " + classe + ">>() {\n";
		strJava += "\t\t\t\t@Override\n";
		strJava += "\t\t\t\tpublic TableCell<" + classe + ", " + classe + "> call(TableColumn<" + classe + ", " + classe + "> coluna) {\n";
		strJava += "\t\t\t\t\treturn new TableCell<" + classe + ", " + classe + ">() {\n";
		strJava += "\t\t\t\t\t\t@Override\n";
		strJava += "\t\t\t\t\t\tprotected void updateItem(" + classe + " " + pMin(classe) + ", boolean vazio) {\n";
		strJava += "\t\t\t\t\t\t\tsuper.updateItem(" + pMin(classe) + ", vazio);\n";
		strJava += "\t\t\t\t\t\t\tif (" + pMin(classe) + " == null || vazio) {\n";
		strJava += "\t\t\t\t\t\t\t\tsetText(null);\n";
		strJava += "\t\t\t\t\t\t\t\tsetGraphic(null);\n";
		strJava += "\t\t\t\t\t\t\t} else {\n";
		strJava += "\t\t\t\t\t\t\t\tButton buttonEditar = new Button(\"Editar\");\n";
		strJava += "\t\t\t\t\t\t\t\tbuttonEditar.setOnAction(new EventHandler<ActionEvent>() {\n";
		strJava += "\t\t\t\t\t\t\t\t\t@Override\n";
		strJava += "\t\t\t\t\t\t\t\t\tpublic void handle(ActionEvent e) {\n";
		strJava += "\t\t\t\t\t\t\t\t\t\tJ" + classe + " j" + classe + " = new J" + classe + "(" + pMin(classe) + ");\n";
		strJava += "\t\t\t\t\t\t\t\t\t\tj" + classe + ".start(new Stage());\n";
		strJava += "\t\t\t\t\t\t\t\t\t\tatualizarTabela();\n";
		strJava += "\t\t\t\t\t\t\t\t\t}\n";
		strJava += "\t\t\t\t\t\t\t\t});\n";
		strJava += "\t\t\t\t\t\t\t\tButton buttonRemover = new Button(\"Remover\");\n";
		strJava += "\t\t\t\t\t\t\t\tbuttonRemover.setOnAction(new EventHandler<ActionEvent>() {\n";
		strJava += "\t\t\t\t\t\t\t\t\t@Override\n";
		strJava += "\t\t\t\t\t\t\t\t\tpublic void handle(ActionEvent e) {\n";
		strJava += "\t\t\t\t\t\t\t\t\t\t" + pMin(classe) + "DAO.remover(" + pMin(classe) + ".getId());\n";
		strJava += "\t\t\t\t\t\t\t\t\t\tatualizarTabela();\n";
		strJava += "\t\t\t\t\t\t\t\t\t}\n";
		strJava += "\t\t\t\t\t\t\t\t});\n";
		strJava += "\t\t\t\t\t\t\t\tHBox hbox = new HBox();\n";
		strJava += "\t\t\t\t\t\t\t\thbox.setSpacing(10);\n";
		strJava += "\t\t\t\t\t\t\t\thbox.getChildren().addAll(buttonEditar, buttonRemover);\n";
		strJava += "\t\t\t\t\t\t\t\tsetGraphic(hbox);\n";
		strJava += "\t\t\t\t\t\t\t}\n";
		strJava += "\t\t\t\t\t\t}\n";
		strJava += "\t\t\t\t\t};\n";
		strJava += "\t\t\t\t}\n";
		strJava += "\t\t\t});\n";
		strJava += "\t\ttableView.getColumns().addAll(" + colunasAdd.join(",") + ",tableColumnComando);\n";
		strJava += "\t\ttextFieldConsulta.textProperty().addListener((observable, oldValue, newValue) -> {\n"
		strJava += "\t\t\tatualizarTabela();\n"
		strJava += "\t\t});\n"
		strJava += "\t\tatualizarTabela();\n";
		strJava += "\t\tVBox vbox = new VBox();\n";
		strJava += "\t\tvbox.setSpacing(10);\n";
		strJava += "\t\tvbox.setPadding(new Insets(10));\n";
		strJava += "\t\tScene scene = new Scene(vbox, 600, 400);\n";
		strJava += "\t\t((VBox) scene.getRoot()).getChildren().addAll(textFieldConsulta, tableView);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.initModality(Modality.APPLICATION_MODAL);\n";
		strJava += "\t\tstage.showAndWait();\n";
		strJava += "\t}\n";
		strJava += "\tpublic void atualizarTabela() {\n";
		strJava += "\t\ttableView.setItems(FXCollections.observableArrayList(" + pMin(classe) + "DAO.pesquisar(textFieldConsulta.getText())));\n";
		strJava += "\t}\n";
		strJava += "}";		
		return strJava;
	}
	function getClasseApplicationPrincipal() {
		var linhas = getLinhas();
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		var tabelaSql = temp[1];
		var strJava = "";

		strJava += "package " + pkg.value + ".visao;\n\n";
		strJava += "import javafx.application.Application;\n";
		strJava += "import javafx.stage.Stage;\n";
		strJava += "import javafx.scene.Scene;\n";
		strJava += "import javafx.scene.control.MenuBar;\n";
		strJava += "import javafx.scene.control.Menu;\n";
		strJava += "import javafx.scene.control.MenuItem;\n";
		strJava += "import javafx.scene.layout.VBox;\n\n";
		strJava += "public class JPrincipal extends Application {\n";
		strJava += "\tpublic void start(Stage stage) {\n";
		strJava += "\t\tMenuBar menuBar = new MenuBar();\n";
		strJava += "\t\tMenu menuCadastrar = new Menu(\"Cadastrar\");\n";
		strJava += "\t\tMenu menuConsultar = new Menu(\"Consultar\");\n";
		strJava += "\t\tMenuItem menuItemCadastro" + classe + " = new MenuItem(\"" + classe + "\");\n";
		strJava += "\t\tMenuItem menuItemConsulta" + classe + " = new MenuItem(\"" + classe + "\");\n";
		strJava += "\t\tmenuItemCadastro" + classe + ".setOnAction(e -> {\n";
		strJava += "\t\t\tJ" + classe + " j" + classe + " = new J" + classe + "();\n";
		strJava += "\t\t\tj" + classe + ".start(new Stage());\n";
		strJava += "\t\t});\n";
		strJava += "\t\tmenuItemConsulta" + classe + ".setOnAction(e -> {\n";
		strJava += "\t\t\tJ" + classe + "Consulta j" + classe + "Consulta = new J" + classe + "Consulta();\n";
		strJava += "\t\t\tj" + classe + "Consulta.start(new Stage());\n";
		strJava += "\t\t});\n";
		strJava += "\t\tmenuCadastrar.getItems().add(menuItemCadastro" + classe + ");\n";
		strJava += "\t\tmenuConsultar.getItems().add(menuItemConsulta" + classe + ");\n";
		strJava += "\t\tmenuBar.getMenus().addAll(menuCadastrar, menuConsultar);\n";
		strJava += "\t\tScene scene = new Scene(new VBox(), 800, 600);\n";
		strJava += "\t\t((VBox) scene.getRoot()).getChildren().addAll(menuBar);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.show();\n";
		strJava += "\t}\n";
		strJava += "\tpublic static void main(String[] args) {\n";
		strJava += "\t\tlaunch(args);\n";
		strJava += "\t}\n";
		strJava += "}";		
		return strJava;
	}
	var btnBean = document.getElementById("bean");
	var btnDAO = document.getElementById("dao");
	var btnApplicationManter = document.getElementById("applicationManter");
	var btnApplicationConsulta = document.getElementById("applicationConsulta");
	var btnApplicationPrincipal = document.getElementById("applicationPrincipal");

	function getJanela(titulo, conteudo) {
		var w = window.open("", "_blank", "width=800,height=600");
		w.document.write("<title>" + titulo + "</title>");
		w.document.write("<style>textarea {background-color: black; color: white}</style>");
		w.document.write("<textarea style=\"width: 100%; height: 100%\">");
		w.document.write(conteudo);
		w.document.write("</textarea>");		
	}
	function getNomeClasse() {
		var linhas = tA0.value.split("\n");
		var temp = linhas[0].split(" ");
		var classe = temp[0];
		return classe;
	}
	btnBean.addEventListener("click", function() {
		getJanela("Bean " + getNomeClasse(), getClasseBean());
	});
	btnDAO.addEventListener("click", function() {
		getJanela("DAO " + getNomeClasse(), getClasseDAO());
	});
	btnApplicationManter.addEventListener("click", function() {
		getJanela("Application Manter: " + getNomeClasse(), getClasseApplicationManter());
	});
	btnApplicationConsulta.addEventListener("click", function() {
		getJanela("Application Consulta: " + getNomeClasse(), getClasseApplicationConsulta());
	});
	btnApplicationPrincipal.addEventListener("click", function() {
		getJanela("Application Principal: " + getNomeClasse(), getClasseApplicationPrincipal());
	});
}
