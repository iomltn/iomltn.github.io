var GraficoSVG = function(grafico_json, elemento_svg) {
	var svgNS = "http://www.w3.org/2000/svg";  
	this.grafico_json = grafico_json;
	this.elemento_svg = elemento_svg;
	this.elemento_svg.setAttribute("width", this.grafico_json.largura);
	this.elemento_svg.setAttribute("height", this.grafico_json.altura);
	this.elemento_svg.style = "border: solid " + this.grafico_json.largura_borda + "px gray";

	this.coluna = function(altura, largura, posicao_x, posicao_y) {
		largura -= 2 * this.grafico_json.largura_borda;
		altura -= 2 * this.grafico_json.largura_borda;
		var r = document.createElementNS(svgNS, "rect");
		r.setAttributeNS("", "x", posicao_x);
		r.setAttributeNS("", "y", posicao_y);
		r.setAttributeNS("", "width", largura);
		r.setAttributeNS("", "height", altura);
		r.setAttributeNS("", "style", "fill:lightblue;stroke:gray;stroke-width:" + this.grafico_json.largura_borda);
		return r;
	}
	this.linha = function(x1, y1, x2, y2, cor="gray") {
		var l = document.createElementNS(svgNS, "line");			
		l.setAttributeNS("", "x1", x1);
		l.setAttributeNS("", "y1", y1);
		l.setAttributeNS("", "x2", x2);
		l.setAttributeNS("", "y2", y2);
		l.setAttributeNS("", "style", "stroke:" + cor + ";stroke-width:" + this.grafico_json.largura_borda);
		return l;
	}
	this.texto = function(texto, posicao_x, posicao_y, tamanho_fonte, angulo="0") {
		var t = document.createElementNS(svgNS, "text");
		t.setAttributeNS("", "x", posicao_x);
		t.setAttributeNS("", "y", posicao_y);
		t.setAttributeNS("", "font-size", tamanho_fonte);
		t.setAttributeNS("", "text-anchor", "middle");
		t.setAttributeNS("", "transform", "rotate(" + angulo +  " " + posicao_x + "," + posicao_y +")");
		t.innerHTML = texto;
		return t;
	}
	this.y_coluna = function(altura) {
		var maior_y = this.maior_y();
		var menor_y = this.menor_y();
		var altura_maxima = this.altura_maxima();
		var altura_minima = this.altura_minima();

		return (altura * ((maior_y - menor_y) / (altura_maxima - altura_minima))) + menor_y;
	}
	this.altura_maxima = function() {
		return this.grafico_json.altura - 140;
	}
	this.altura_minima = function() {
		/*var altura = 0;
		if (this.menor_y != 0) {
			altura = this.altura_maxima() * 0.1;
		}
		return altura;*/
		return 0;
	}
	this.altura_coluna = function(y, maior_y) {
		var altura_max = this.altura_maxima();
		var altura_min = this.altura_minima();
		menor_y = 0;
		return (((altura_max - 2 * this.grafico_json.largura_borda - altura_min) * (y - menor_y)) / (maior_y - menor_y)) + 2 * this.grafico_json.largura_borda + altura_min;
	}
	this.menor_y = function() {
		var y = this.grafico_json.pontos_xy[0].y;
		for (var i = 1; i < this.grafico_json.pontos_xy.length; i++) {
			if (y > this.grafico_json.pontos_xy[i].y)
				y = this.grafico_json.pontos_xy[i].y;
		}
		return y;
	}
	this.maior_y = function() {
		var y = 0;
		for (var i = 0; i < this.grafico_json.pontos_xy.length; i++) {
			if (y < this.grafico_json.pontos_xy[i].y)
				y = this.grafico_json.pontos_xy[i].y;
		}
		return y;
	}
	this.plotar = function() {
		elemento_svg.innerHTML = "";
		var titulo_principal = this.texto(this.grafico_json.titulo_principal, this.grafico_json.largura / 2, 45, "2.25em");
		elemento_svg.appendChild(titulo_principal);
		var margem_esquerda = 25;
		var margem_baixo = 0;
		var numero_colunas = this.grafico_json.pontos_xy.length;
		var largura_coluna = (this.grafico_json.largura - margem_esquerda) /
			(numero_colunas + ((numero_colunas + 1) / 2)); /* para a distância entre uma coluna e outra seja a metade da largura da coluna */
		var maior_y = this.maior_y();
		var menor_y = this.menor_y();

		var x1 = margem_esquerda + (largura_coluna/4);
		var x2 = this.grafico_json.largura - (largura_coluna/4);
		var y1 = this.grafico_json.altura - 60;
		var incremento_grade = (this.altura_coluna(maior_y, maior_y, menor_y) - (2 * this.grafico_json.largura_borda))/ 10;
		var y_incremento_grade = (maior_y - menor_y) / 10;
		var y = 0;
		var ys_grade = [];
		// linhas de grade
		/*
		for (var i = 0; i < 10; i++) {
			y1 -= incremento_grade;
			y = this.y_coluna(this.grafico_json.altura - y1);
			var linha_grade = this.linha(x1, y1, x2, y1, "lightblue");
			elemento_svg.appendChild(linha_grade);

			var y_grade = this.altura_coluna(i * y_incremento_grade, maior_y, menor_y);
			ys_grade.push(parseFloat(y_grade).toFixed(2));
		}

		/*
		y1 = this.grafico_json.altura - 60;
		for (var i = 0; i < 11; i++) {
			var texto_incremento_grade = this.texto(ys_grade[i], x1 - 20, y1);
			elemento_svg.appendChild(texto_incremento_grade);
			y1 -= incremento_grade;
		}
		*/

		var posicao_x_atual = margem_esquerda;
		var posicao_y_atual = 0;
		for (var i = 0; i < numero_colunas; i++) {
			posicao_x_atual += (largura_coluna / 2);
			var altura = this.altura_coluna(this.grafico_json.pontos_xy[i].y, maior_y, menor_y);
			posicao_y_atual = this.grafico_json.altura - altura + 2 * this.grafico_json.largura_borda - 60;
			var nova_coluna = this.coluna(altura, largura_coluna, posicao_x_atual, posicao_y_atual);
			var texto_coluna = this.texto((this.grafico_json.pontos_xy[i].y + "").replace(".", ","), posicao_x_atual + (largura_coluna / 2), posicao_y_atual - (this.grafico_json.largura_borda * 3), "1.4em");
			var texto_base_coluna = this.texto(this.grafico_json.pontos_xy[i].x, posicao_x_atual + (largura_coluna / 2), altura + posicao_y_atual + 20, "1.4em");
			posicao_x_atual += largura_coluna;

			elemento_svg.appendChild(nova_coluna);
			elemento_svg.appendChild(texto_coluna);
			elemento_svg.appendChild(texto_base_coluna);
		}
		var x1 = margem_esquerda + (largura_coluna/4);
		var x2 = this.grafico_json.largura - (largura_coluna/4);
		var y1 = this.grafico_json.altura - 60;
		var linha_base = this.linha(x1, y1, x2, y1);
		y2 = 70;
		var linha_lateral = this.linha(x1, y1, x1, y2);
		var texto_x = this.texto(this.grafico_json.titulo_x, this.grafico_json.largura / 2, this.grafico_json.altura - 13, "1.1em");
		var texto_y = this.texto(this.grafico_json.titulo_y, (margem_esquerda / 2) + 10, (this.grafico_json.altura / 2), "1.1em", -90);
		elemento_svg.appendChild(texto_x);
		elemento_svg.appendChild(texto_y);
		elemento_svg.appendChild(linha_base);
		elemento_svg.appendChild(linha_lateral);
	}
}
