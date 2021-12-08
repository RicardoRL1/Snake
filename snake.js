// dimensiones del tablero
var fila = 20, columna = 20, velocidad = 120

// eventos del juego y la serpiente
var crecer = false, juegoTerminado = false, manzanaEnMapa = false
    manzanaX = null, manzanaY = null, direccion = null, buffer = [] // almacenar las direcciones tecleadas (R,U,L,D)



// json con todos los colores a utilizar
var colores = {
	cuerpo:'blue',
	cabeza:'black', 
	manzana:'red', 
	colorCasillaUno:'greenyellow', 
	colorCasillaDos:'green'
}

// teclas de movimiento - Valore númericos T es de Tecla 
var T_IZQUIERDA = 37;
var T_ARRIBA = 38;
var T_DERECHA = 39;
var T_ABAJO = 40;

// posiciones de la serpiente
var ejeX = [9];
var ejeY = [3];


//Detectar las teclas presionadas...

$(document).keydown(function(e){

	buffsize = buffer.length;

	ultimoMovimiento = buffsize ? buffer[buffsize - 1] : direccion;

	// R: Derecha, L: Izquierda, U:Arriba y D: Abajo... 
	if (e.keyCode == T_IZQUIERDA) {
		if (ultimoMovimiento != "R")
			direccion = ultimoMovimiento = "L"
	}
	else if (e.keyCode == T_ARRIBA) { 
		if (ultimoMovimiento != "D")
			direccion = ultimoMovimiento = "U"
	}
	else if (e.keyCode == T_DERECHA) {
		if (ultimoMovimiento != "L")
			direccion = ultimoMovimiento = "R"
	}
	else if (e.keyCode == T_ABAJO) { 
		if (ultimoMovimiento != "U")
			direccion = ultimoMovimiento = "D"
	}

	buffer.push(direccion)
	

	if (e.keyCode >= 37 && e.keyCode <= 40) 
		return false;
	
});

//Función principal 
$(function() {
	crearTablero();
	correrJuego();
});



/* Pinta la serpiente, la manzana e inicia el juego... Valida si hay choque...
   Se llama a si mismo después de un tiempo... El tiempo es el valor de la velocidad(Unidad de milisegundos)
   setTimeout ejemplo: https://www.w3schools.com/jsreF/met_win_settimeout.asp    
*/

function correrJuego(){

    colocarSerpiente();

	// al presionar una de las teclas de dirección inicia el juego...
    if(direccion)
        pasos();

    if (detectarChoque()) {
        return false;
    }

    colocarManzana();

    setTimeout(function() { correrJuego() }, velocidad);
}

// Crear tablero en forma de tablero de ajedres de dos colores: verde y verde amarillento
function crearTablero() {

    for (let i = 0; i < fila; i++) {
        $("#tablero").append("<tr id ='fila" + i + "'> </tr>")
        for (let j = 0; j < columna; j++) {
            if ((i + j) % 2) {
                $("#fila" + i).append(`<td id="${i+"-"+j}" bgcolor="${colores.colorCasillaUno}" width='30px' height='30px'></td>`)
            } else {
                $("#fila" + i).append(`<td id="${i+"-"+j}" bgcolor="${colores.colorCasillaDos}" width='30px' height='30px'></td>`)
            }
        }
    }

}

// Pintamos la serpiente, pero antes restauramos el tablero...
// Recordemos que la serpiente es un conjunto de celdas de la tabla...

function colocarSerpiente() {
	limpiarTablero();
	
	for (let i = 0; i < ejeX.length; i++) {
		$("#" + ejeY[i] + "-" + ejeX[i]).css("backgroundColor", colores[(!i ? "cabeza" : "cuerpo")]);
	}
}


/* Función encargada de detectar si las posiciones en las que se mueve la serpiente superan las dimensiones del tablero
   o si esta hace parte de la serpiente
*/
function detectarChoque() {
	died = false;

	//Arriba e izquierda
    if (ejeX[0] == -1 || ejeY[0] == -1){
		died = true;
	}

	// Abajo o derecha
    else if (ejeX[0] == fila  || ejeY[0] == columna ){
		died = true;
	}else{
		//Limites de la serpiente
		for (i = 1; i < ejeX.length+1; i++){
			if (ejeX[0] == ejeX[i] && ejeY[0] == ejeY[i]){
				died = true;
			}
		}
	}
	
	return died;
}


/* Colocar la manzana es poner una celda de color rojo dentro de los limites del tablero y
   fuera de las casillas ocupadas por la serpiente, la posición es puesta de manera aleatoria.
*/
function colocarManzana() {
	
    if (!manzanaEnMapa) {

		posSerpiente = true;

		while (posSerpiente) {
			posSerpiente = false;
			
			//Posición "x" e "y" elegida aleatoria
			manzanaX = Math.floor(Math.random() * fila);
			manzanaY = Math.floor(Math.random() * columna);
		
			for (i = 0; i < ejeX.length; i++) {
				if (manzanaX == ejeX[i] && manzanaY == ejeY[i]) {
					posSerpiente = true;
					continue;
				}
			}
		}
		
		manzanaEnMapa = true;
	}

	$("#" + manzanaY + "-" + manzanaX).css("backgroundColor", colores.manzana);
}


/* La serpiente es la ocupación de celdas
   Las coordenadas se almacenan en dos arrays, uno para "x" y otro para "y"
*/
function pasos() {
	
	longitud_serpiente = ejeX.length
	
	lastejeX = ejeX[longitud_serpiente - 1]
	lastejeY = ejeY[longitud_serpiente - 1]
	
	if (longitud_serpiente > 1 && direccion) {
		for (i = longitud_serpiente - 1; i > 0; i--) {
			ejeX[i] = ejeX[i - 1];
			ejeY[i] = ejeY[i - 1];
		}
	}
	
	if (crecer) {
		ejeX.push(lastejeX);
		ejeY.push(lastejeY);
		crecer = false;
	}

	buffsize = buffer.length
	
	mov = direccion

	if (buffsize)
		mov = buffer.shift();
	
	if (mov == "U")
		ejeY[0] -= 1;
    else if (mov == "R")
		ejeX[0] += 1;
	else if (mov == "D")
		ejeY[0] += 1;
	else if (mov == "L")
		ejeX[0] -= 1;
		

	if (ejeX[0] == manzanaX && ejeY[0] == manzanaY) {
		crecer = true;
		manzanaEnMapa = false;
	}
}

function limpiarTablero() {

	for (let i = 0; i < fila; i++) {
        for (let j = 0; j < columna; j++) {
			if ((i + j) % 2) {
				$("#" + i+ "-" +j).css("backgroundColor", colores.colorCasillaUno)
			} else {
				$("#" + i+ "-" +j).css("backgroundColor", colores.colorCasillaDos)
			}
        }
    }
}
