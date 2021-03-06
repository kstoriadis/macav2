var preguntas = [];
var puntajes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var nombres = ['Externo', 'Mecanico', 'Calculo', 'Cientifico', 'Persuasivo', 'Artistico', 'Literario', 'Musical', 'Social', 'Metodico', 'Validez'];
var ultimaOpcion = 0;
var posV = [0, 0, 0];
var negV = [0, 0, 0];
var seleccionoPos = false;
var seleccionoNeg = false;
$(document).ready(function() {
	$.get('xml/preguntasVocacion.xml', function(d) {
		xmlDoc = d;
		var pregunta;
		$(d).find('pregunta').each(function() {
			var $p = $(this);
			pregunta = {
				id : $p.find('idPreg').text(),
				texto : $p.find('texto').text(),
				pos : $p.find('suma').text(),
				neg : $p.find('resta').text()
			}
			preguntas.push(pregunta);
		})
		//todas las preguntas cargadas en el array
		cargarTresOpciones(ultimaOpcion);
	});
	$("#resultados").hide();
	//$("#sendEmail").hide();
	$("#cuestionario").hide();

});
function cargarTresOpciones(numeroPregunta) {
	seleccionoNeg = false;
	seleccionoPos = false;
	$('.pos').each(function(index) {
		$(this).removeClass('megustaAnulado').addClass('megusta');
	});
	$('.neg').each(function(index) {
		$(this).removeClass('noMeGustaAnulado').addClass('noMeGusta');
	});
	$('[id^="pos"]').removeClass('megustaSelected').addClass('megusta').addClass('pos');
	$('[id^="neg"]').removeClass('noMeGustaSelected').addClass('noMeGusta').addClass('neg');

	$('.neg').each(function(index) {
		$(this).click(function() {
			neg(index, this);
		});
	});
	$('.pos').each(function(index) {
		$(this).click(function() {
			pos(index, this);
		});
	});

	if (ultimaOpcion >= 504) {
		$(".sig").hide();
		finalizar();
		return false;
	}

	var pre = preguntas[numeroPregunta];
	$("#texto1").html(pre.texto);
	posV[0] = pre.pos;
	negV[0] = pre.neg;
	numeroPregunta++;
	pre = preguntas[numeroPregunta];
	$("#texto2").html(pre.texto);
	posV[1] = pre.pos;
	negV[1] = pre.neg;
	numeroPregunta++;
	pre = preguntas[numeroPregunta];
	$("#texto3").html(pre.texto);
	posV[2] = pre.pos;
	negV[2] = pre.neg;
	numeroPregunta++;
	ultimaOpcion = numeroPregunta;
	$(".pos").show();
	$(".neg").show();

}

function pos(n, boton) {
	seleccionoPos = true;
	$('.pos').each(function(index) {
		$(this).unbind( "click" );
	});
	$('#' + boton.id).removeClass('megusta').removeClass('pos').addClass("megustaSelected");
	var posASumar = posV[n].split("|");
	for (var i = 0; i < posASumar.length; i++) {
		puntajes[posASumar[i]]++;
	}
	
	$(".pos").removeClass('megusta').addClass("megustaAnulado");
	$("#neg" + n).removeClass('noMeGusta').addClass("noMeGustaAnulado").unbind( "click" );
	if (seleccionoNeg && seleccionoPos) {
		cargarTresOpciones(ultimaOpcion);
	}
}

function neg(n, boton) {
	seleccionoNeg = true;
	$('.neg').each(function(index) {
		$(this).unbind( "click" );
	});
	$('#' + boton.id).removeClass('noMeGusta').removeClass('neg').addClass("noMeGustaSelected");
	var posASumar = negV[n].split("|");
	for (var i = 0; i < posASumar.length; i++) {
		puntajes[posASumar[i]]++;
	}
	$(".neg").removeClass('noMeGusta').addClass("noMeGustaAnulado");
	$("#pos" + n).removeClass('megusta').addClass("megustaAnulado").unbind( "click" );
	if (seleccionoNeg && seleccionoPos) {
		cargarTresOpciones(ultimaOpcion);
	}
}

function finalizar() {
	$('#cuestionario').hide();
	var sql = '';
	var html = '<p>' + nombre + ' de ' + edadVal + ' años, le envia este cuestionario</p><div class="mitad titulo">Categoria</div><div class="mitad titulo">Cantidad de superposiciones</div>';
	for (var i = 0; i < nombres.length; i++) {
		html += '<div class="mitad">' + nombres[i] + '</div><div class="mitad">' + puntajes[i] + '</div>';
		sql += nombres[i] + '   ' + puntajes[i] + '    ';
	}
	//var emailToVal = 'macarena.martin@outlook.com';
		var emailToVal = 'macamartin87@gmail.com';
	//var emailToVal = 'federico.gonzalezc@gmail.com';
	$("#cuestionario li.buttons").append('<img src="css/images/preloader.gif" alt="Loading" id="loading" />');

	$.post("guardar.php", {
		nombre : emailFromVal,
		resultado : sql
	}, function(data) {

	});

	$.post("sendemail.php", {
		emailTo : emailToVal,
		emailFrom : emailFromVal,
		asunto : 'cuestionario de ' + nombre,
		cuerpo : html
	}, function(data) {
		$("#sendEmail").slideUp("normal", function() {
			if (data == 'enviado') {
				$("#sendEmail").before('<div id="muchasGracias"></div><p>Su cuestionario fue enviado a la Licenciada Macarena Martín.</p>');

			} else {
				$("#sendEmail").before('<h1>Atención!</h1><p>Ocurrió un error y su cuestionario no fue enviado! Por favor copie este mensaje completo y envielo a macarena.martin@outlook.com</p><p>' + html + '</p>');
			}
		});
	});
	//$("#resultados").html(html);
	//$("#resultados").show();
	return false;

}