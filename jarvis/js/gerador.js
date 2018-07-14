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
		strJava += "import java.sql.Connection;\n";
		strJava += "import java.sql.Statement;\n";
		strJava += "import java.sql.PreparedStatement;\n";
		strJava += "import java.sql.SQLException;\n";
		strJava += "import java.sql.ResultSet;\n";
		strJava += "import javafx.collections.FXCollections;\n";
		strJava += "import javafx.collections.ObservableList;\n\n";
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
		strJava += "\tpublic ObservableList<" + classe + "> pesquisar(" + c2[3] + " query) {\n";
 		strJava += "\t\tObservableList<" + classe + "> " + tabelaSql + " = FXCollections.observableArrayList();\n";
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
		var componentesJanela = [];
		for (var i = 2; i < linhas.length; i++) {
			var c = linhas[i].split(" ");
			declaracoes += "\tLabel l" + pMai(c[1]) + ";\n";
			declaracoes += "\tTextField tf" + pMai(c[1]) + ";\n";
			
			instanciacoes += "\t\tl" + pMai(c[1]) + " = new Label(\"" + pMai(c[1]) + "\");\n";
			instanciacoes += "\t\ttf" + pMai(c[1]) + " = new TextField(" + pMin(classe) + " == null ? \"\" : " + pMin(classe) + ".get" + pMai(c[1]) + "());\n";
			
			actionsJanelaCadastrar += "\t\t\t\t" + pMin(classe) + ".set" + pMai(c[1]) + "(tf" + pMai(c[1]) + ".getText());\n";
			
			componentesJanela.push("l" + pMai(c[1]));
			componentesJanela.push("tf" + pMai(c[1]));
		}
		strJava += "package " + pkg.value + ".visao;\n\n";
		strJava += "import javafx.application.Application;\n";
		strJava += "import javafx.stage.Stage;\n";
		strJava += "import javafx.stage.Modality;\n";
		strJava += "import javafx.scene.Scene;\n";
		strJava += "import javafx.scene.control.Label;\n";
		strJava += "import javafx.scene.control.TextField;\n";
		strJava += "import javafx.scene.control.Button;\n";
		strJava += "import javafx.scene.control.ButtonType;\n";
		strJava += "import javafx.scene.control.Alert;\n";
		strJava += "import javafx.scene.control.Alert.AlertType;\n";
		strJava += "import javafx.scene.layout.VBox;\n";
		strJava += "import javafx.scene.layout.HBox;\n";
		strJava += "import javafx.geometry.Insets;\n";
		strJava += "import javafx.geometry.Pos;\n";
		strJava += "import java.util.Optional;\n";
		strJava += "import " + pkg.value + ".modelo." + classe + ";\n";
		strJava += "import " + pkg.value + ".modelo." + classe + "DAO;\n\n";
		strJava += "public class J" + classe + " extends Application {\n";
		strJava += declaracoes;
		strJava += "\tButton btnCadastrarAlterar;\n";
		strJava += "\tButton btnExcluir;\n";
		strJava += "\tButton btnCancelar;\n";
		strJava += "\t" + classe + " " + pMin(classe) + " = null;\n";
		strJava += "\t" + classe + "DAO " + pMin(classe) + "DAO;\n\n";
		strJava += "\tpublic J" + classe + "() {\n";
		strJava += "\t}\n";
		strJava += "\tpublic J" + classe + "(" + classe + " " + pMin(classe) + ") {\n";
		strJava += "\t\tthis." + pMin(classe) + " = " + pMin(classe) + ";\n";
		strJava += "\t}\n";
		strJava += "\t@Override\n\tpublic void start(Stage stage) {\n";
		strJava += "\t\tstage.setTitle(\"" + classe + "\");\n";
		strJava += "\t\t" + pMin(classe) + "DAO = new " + classe + "DAO();\n\n";
		strJava += instanciacoes;
		strJava += "\t\tbtnCadastrarAlterar = new Button("+ pMin(classe) + " == null ? \"Cadastrar\" : \"Alterar\");\n";
		strJava += "\t\tbtnExcluir = new Button(\"Excluir\");\n";
		strJava += "\t\tbtnCancelar = new Button(\"Cancelar\");\n";
		strJava += "\t\tbtnCadastrarAlterar.setOnAction(e -> {\n";
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
		strJava += "\t\tbtnExcluir.setOnAction(e -> {\n";
		strJava += "\t\t\tAlert alert = new Alert(AlertType.CONFIRMATION);\n";
		strJava += "\t\t\talert.setTitle(\"Confirmação de remoção\");\n";
		strJava += "\t\t\talert.setHeaderText(\"Apagar " + classe + "\");\n";
		strJava += "\t\t\talert.setContentText(\"Tem certeza que deseja apagar \" + " + pMin(classe) + ".get" + pMai(linhas[2].split(" ")[1]) + "() + \"?\");\n";
		strJava += "\t\t\tOptional<ButtonType> resultado = alert.showAndWait();\n";
		strJava += "\t\t\tif (resultado.get() == ButtonType.OK) {\n";
		strJava += "\t\t\t\t" + pMin(classe) + "DAO.remover(" + pMin(classe) + ".getId());\n";
		strJava += "\t\t\t\tstage.close();\n";
		strJava += "\t\t\t}\n";
		strJava += "\t\t});\n";
		strJava += "\t\tVBox vbox = new VBox();\n";
		strJava += "\t\tvbox.setPadding(new Insets(10));\n";
		strJava += "\t\tvbox.setSpacing(10);\n";
		strJava += "\t\tHBox hbox = new HBox();\n";
		strJava += "\t\thbox.setSpacing(10);\n";
		strJava += "\t\thbox.setAlignment(Pos.BASELINE_RIGHT);\n";
		strJava += "\t\thbox.getChildren().add(btnCadastrarAlterar);\n";
		strJava += "\t\tif (" + pMin(classe) + " != null) {\n";
		strJava += "\t\t\thbox.getChildren().add(btnExcluir);\n";
		strJava += "\t\t}\n";
		strJava += "\t\tvbox.getChildren().addAll(" + componentesJanela.join(",") + ",hbox);\n";
		strJava += "\t\tScene scene = new Scene(vbox);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.initModality(Modality.APPLICATION_MODAL);\n";
		strJava += "\t\tstage.setResizable(false);\n";
		strJava += "\t\tstage.showAndWait();\n";
		strJava += "\t}\n";
		strJava += "}";
		return strJava;
	}
	
	function getClasseApplicationPesquisa() {
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
		strJava += "import javafx.scene.control.TableColumn;\n";
		strJava += "import javafx.scene.control.cell.PropertyValueFactory;\n";
		strJava += "import javafx.geometry.Insets;\n";
		strJava += "import javafx.geometry.Pos;\n";
		strJava += "import javafx.scene.layout.VBox;\n";
		strJava += "import javafx.scene.layout.HBox;\n";
		strJava += "import javafx.scene.input.KeyCode;\n";
		strJava += "import " + pkg.value + ".modelo." + classe + ";\n";
		strJava += "import " + pkg.value + ".modelo." + classe + "DAO;\n\n";
		strJava += "public class JPesquisa" + classe + " extends Application {\n";
		strJava += "\tprivate " + classe + " " + pMin(classe) + " = null;\n";
		strJava += "\tTableView tableView = new TableView();\n";
		strJava += "\tTextField textFieldConsulta = new TextField();\n";
		strJava += "\tButton buttonOk = new Button(\"OK\");\n";
		strJava += "\t" + classe + "DAO " + pMin(classe) + "DAO = new " + classe + "DAO();\n";
		strJava += "\t@Override\n";
		strJava += "\tpublic void start(Stage stage) {\n";
		strJava += "\t\tstage.setTitle(\"Consultar " + classe + "\");\n";
		strJava += colunasDlr;
		strJava += colunasVFct;
		strJava += "\t\ttableView.getColumns().addAll(" + colunasAdd.join(",") + ");\n";
		strJava += "\t\ttextFieldConsulta.textProperty().addListener((observable, oldValue, newValue) -> {\n";
		strJava += "\t\t\tatualizarTabela();\n";
		strJava += "\t\t});\n";
		strJava += "\t\ttextFieldConsulta.setOnKeyPressed(e -> {\n";
		strJava += "\t\t\tif (e.getCode() == KeyCode.ENTER) {\n";
		strJava += "\t\t\t\tfechar(stage);\n";
		strJava += "\t\t\t} else if (e.getCode() == KeyCode.DOWN) {\n";
		strJava += "\t\t\t\ttableView.requestFocus();\n";
		strJava += "\t\t\t}\n";
		strJava += "\t\t});\n";
		strJava += "\t\ttableView.setOnKeyPressed(e -> {;\n";
		strJava += "\t\t\tint i = tableView.getSelectionModel().getSelectedIndex();\n";
		strJava += "\t\t\tif (e.getCode() == KeyCode.UP && i <= 1) {\n";
		strJava += "\t\t\t\ttextFieldConsulta.requestFocus();\n";
		strJava += "\t\t\t} else if (e.getCode() == KeyCode.DOWN) {\n";
		strJava += "\t\t\t} else if (e.getCode() == KeyCode.ENTER) {\n";
		strJava += "\t\t\t\tfechar(stage);\n";
		strJava += "\t\t\t} else {\n";
		strJava += "\t\t\t\ttextFieldConsulta.requestFocus();\n";
		strJava += "\t\t\t}\n";
		strJava += "\t\t});\n";
		strJava += "\t\tatualizarTabela();\n";
		strJava += "\t\tbuttonOk.setOnAction(e -> {;\n";
		strJava += "\t\t\tfechar(stage);\n";
		strJava += "\t\t});\n";
		strJava += "\t\tVBox vbox = new VBox();\n";
		strJava += "\t\tHBox hbox = new HBox();\n";
		strJava += "\t\thbox.setAlignment(Pos.BASELINE_RIGHT);\n";
		strJava += "\t\thbox.getChildren().add(buttonOk);\n";
		strJava += "\t\tvbox.setSpacing(10);\n";
		strJava += "\t\tvbox.setPadding(new Insets(10));\n";
		strJava += "\t\tScene scene = new Scene(vbox, 600, 400);\n";
		strJava += "\t\t((VBox) scene.getRoot()).getChildren().addAll(textFieldConsulta, tableView, hbox);\n";
		strJava += "\t\tstage.setScene(scene);\n";
		strJava += "\t\tstage.initModality(Modality.APPLICATION_MODAL);\n";
		strJava += "\t\tstage.showAndWait();\n";
		strJava += "\t}\n";
		strJava += "\tpublic void atualizarTabela() {\n";
		strJava += "\t\ttableView.setItems(" + pMin(classe) + "DAO.pesquisar(textFieldConsulta.getText()));\n";
		strJava += "\t\ttableView.getSelectionModel().selectFirst();\n";
		strJava += "\t}\n";
		strJava += "\tpublic void fechar(Stage stage) {\n";
		strJava += "\t\tint i = tableView.getSelectionModel().getSelectedIndex();\n";
		strJava += "\t\tif (i != -1) {;\n";
		strJava += "\t\t\t" + pMin(classe) + " = (" + classe + ") tableView.getItems().get(i);\n";
		strJava += "\t\t\tstage.close();\n";
		strJava += "\t\t};\n";
		strJava += "\t}\n";
		strJava += "\tpublic " + classe + " get" + classe + "() {\n";
		strJava += "\t\treturn " + pMin(classe) + ";\n";
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
		strJava += "import " + pkg.value + ".modelo." + classe + ";\n\n";
		strJava += "public class JPrincipal extends Application {\n";
		strJava += "\tpublic void start(Stage stage) {\n";
		strJava += "\t\tMenuBar menuBar = new MenuBar();\n";
		strJava += "\t\tMenu mManter = new Menu(\"Manter\");\n";
		strJava += "\t\tMenu m" + classe + " = new Menu(\"" + classe + "\");\n";
		strJava += "\t\tMenuItem miNovo" + classe + " = new MenuItem(\"Novo\");\n";
		strJava += "\t\tMenuItem miPesquisar" + classe + " = new MenuItem(\"Pesquisar\");\n";
		strJava += "\t\tmiNovo" + classe + ".setOnAction(e -> {\n";
		strJava += "\t\t\tJ" + classe + " j" + classe + " = new J" + classe + "();\n";
		strJava += "\t\t\tj" + classe + ".start(new Stage());\n";
		strJava += "\t\t});\n";
		strJava += "\t\tmiPesquisar" + classe + ".setOnAction(e -> {\n";
		strJava += "\t\t\tJPesquisa" + classe + " jPesquisa" + classe + " = new JPesquisa" + classe + "();\n";
		strJava += "\t\t\tjPesquisa" + classe + ".start(new Stage());\n";
		strJava += "\t\t\t" + classe + " " + pMin(classe) + " = jPesquisa" + classe + ".get" + classe + "();\n";
		strJava += "\t\t\tif (" + pMin(classe) + " != null) {\n";
		strJava += "\t\t\t\tJ" + classe + " j" + classe + " = new J" + classe + "(" + pMin(classe) + ");\n";
		strJava += "\t\t\t\tj" + classe + ".start(new Stage());\n";
		strJava += "\t\t\t}\n";
		strJava += "\t\t});\n";
		strJava += "\t\tm" + classe + ".getItems().addAll(miNovo" + classe + ", miPesquisar" + classe + ");\n";
		strJava += "\t\tmManter.getItems().add(m" + classe + ");\n";
		strJava += "\t\tmenuBar.getMenus().addAll(mManter);\n";
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
		w.document.write("<meta charset=\"utf-8\"\>");
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
		getJanela("Application Consulta: " + getNomeClasse(), getClasseApplicationPesquisa());
	});
	btnApplicationPrincipal.addEventListener("click", function() {
		getJanela("Application Principal: " + getNomeClasse(), getClasseApplicationPrincipal());
	});
}
