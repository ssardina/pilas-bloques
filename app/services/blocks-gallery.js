import Ember from 'ember';

export default Ember.Service.extend({
  blockly: Ember.inject.service(),

  start() {
    this._generarLenguaje();
    this._definirColores();
    this._definirBloqueAlIniciar();
    this._definirBloquesAccion();
    this._definirBloquesAlias();
    this._definirBloquesSensores();
    this._definirBloquesQueRepresentanValores();
    this._definirBloquesEstructurasDeControl();
  },

  /*
   * Método auxiliar para crear un bloque acción.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - comportamiento
   *   - argumentos
   *
   */
  crearBloqueAccion(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion','comportamiento','argumentos']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.get('blockly').createCustomBlockWithHelper(nombre, opciones);
    bloque.categoria = "Primitivas";
    return bloque;
  },

  /*
   * Método auxiliar para crear un bloque nuevo a partir de otro original.
   *
   * Este método sirve para crear bloques como 'Si', 'Repetir' etc... ya que
   * esos bloques en realidad se generan a partir de los bloques estándar
   * como 'controls_if'.
   */
  crearBloqueAlias(nombre, nombreDelBloqueOriginal, categoria) {
    if (!Blockly.Blocks[nombreDelBloqueOriginal]) {
      throw new Error(`No existe el bloque ${nombreDelBloqueOriginal} al querer crear un alias, ¿Tal vez los argumentos están invertidos?`);
    }

    let bloque = this.get('blockly').createAlias(nombre, nombreDelBloqueOriginal); 
    bloque.categoria = categoria ||  Blockly.Blocks[nombreDelBloqueOriginal].categoria;

    return bloque;
  },

  /*
   * Método auxiliar para crear un bloque que sirva como sensor.
   *
   * El argumento 'opciones' tiene que definir estas propiedades:
   *
   *   - descripcion
   *   - icono
   *   - funcionSensor
   *
   */
  crearBloqueSensor(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion', 'funcionSensor']);
    
    var formaDelBloque = opciones.icono ? "%1 " : ""; 
    formaDelBloque += opciones.esBool ? "¿" : "";
    formaDelBloque += opciones.descripcion;
    formaDelBloque += opciones.esBool ? "?" : "";

    let blockly = this.get('blockly');
    let bloque = blockly.createCustomBlock(nombre, {
      message0: formaDelBloque,
      colour: opciones.colour || Blockly.Blocks.sensores.COLOUR,
      inputsInline: true,
      output: null,
      args0: [
        {
          type: "field_image",
          src: `iconos/${opciones.icono}`,
          width: 16,
          height: 16,
          alt: "*"
        }
      ],
      code: ``
    });
    // TODO: Arreglar generacion de codigo
    bloque.categoria = "Sensores";

    Blockly.MyLanguage[nombre] = function() {
      let codigo = `evaluar(${JSON.stringify(opciones.funcionSensor)})`;
      return [codigo, Blockly.MyLanguage.ORDER_ATOMIC];
    };

    return bloque;
  },

  crearBloqueValor(nombre, opciones) {
    this._validar_opciones_obligatorias(nombre, opciones, ['descripcion','icono','valor']);
    opciones.colour = opciones.colour || Blockly.Blocks.primitivas.COLOUR;

    let bloque = this.get('blockly').createBlockValue(nombre, opciones);
    bloque.categoria = "Valores";

    return bloque;
  },

  /*
   * Lanza una exception si un diccionario no presenta alguna clave obligatoria.
   */
  _validar_opciones_obligatorias(nombre, opciones, listaDeOpcionesObligatorias) {
    listaDeOpcionesObligatorias.forEach((opcion) => {
      if (!(opcion in opciones)) {
        throw new Error(`No se puede crear el bloque ${nombre} porque no se indicó un valor para la opción ${opcion}.`);
      }
    });
  },

  _definirColores(){
    // Pisar las globales de Blockly es necesario pues usamos algunos bloques de Blockly como aliases.
    Blockly.Blocks.math.HUE =  94; // En PB 1.1.2 era '#48930e'
    Blockly.Blocks.logic.HUE = 210; // En PB 1.1.2 era '#5cb712'
    Blockly.Blocks.procedures.HUE = 290; // En PB 1.1.2 era '#6C52EB'
    Blockly.Blocks.variables.HUE =  330; // En PB 1.1.2 era '#cc5b22'
    Blockly.Blocks.texts.HUE = 160; // En PB 1.1.2 era '#4a6cd4'
    Blockly.Blocks.lists.HUE = 206; // En PB 1.1.2 era '#cc5b22'

    // Para los bloques propios
    Blockly.Blocks.primitivas = {COLOUR: '#4a6cd4'};
    Blockly.Blocks.control = {COLOUR: '#ee7d16'};
    Blockly.Blocks.sensores = {COLOUR: '#2ca5e2'};
    Blockly.Blocks.direcciones = {COLOUR: '#2ba4e2'};
    Blockly.Blocks.eventos = {COLOUR: '#00a65a'}; // == boton ejecutar

    // IN SCRATCH THE COLOURS ARE
    // 4a6cd4 MOTION
    // 8a55d7 LOOKS
    // bb42c3 SOUND
    // 0e9a6c PEN
    // ee7d16 DATA Variables
    // cc5b22 DATA Lists
    // c88330 EVENTS
    // e1a91a CONTROL
    // 2ca5e2 SENSING
    // 5cb712 OPERATORS
    // 49930e OPERATORS dark
    // 632d99 MORE BLOCKS
    // 5e4db3 PARAMS
  },

  _definirBloquesAccion() {

    this.crearBloqueAccion('PrenderCompu', {
      descripcion: 'Prender compu',
      icono: 'icono.computadora.png',
      comportamiento: 'PrenderCompuParaInstalar',
      argumentos: `{
        etiqueta: 'CompuAnimada',
        mensajeError: 'No hay una compu aqui',
        idTransicion: 'prender',
        animacionColisionadoPost: 'prendida',
        nombreAnimacion: 'escribir'
      }`,
    });

    this.crearBloqueAlias('Prendercompu', 'PrenderCompu');

    this.crearBloqueAccion('PrenderCompuConColision', {
      descripcion: 'Prender compu',
      icono: 'icono.computadora.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "CompuAnimada",
        animacionColisionadoPost: "prendida",
        nombreAnimacion: "escribir"
      }`,
    });

    this.crearBloqueAccion('ApretarBoton', {
      descripcion: 'Apretar botón',
      icono: 'iconos.botonRojo.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        animacionColisionadoPost: 'prendida',
        nombreAnimacion: 'apretar',
        etiqueta: 'BotonAnimado',
        mensajeError: 'No hay un botón aquí',
        idTransicion: 'apretarBoton'
      }`,
    });

    this.crearBloqueAccion('EncenderLuz', {
      descripcion: 'Prender la luz',
      icono: 'icono.Lamparita.png',
      comportamiento: 'EncenderPorEtiqueta',
      argumentos: "{'etiqueta':'Luz'}"
    });

    this.crearBloqueAccion('ComerBanana', {
      descripcion: 'Comer banana',
      icono: 'icono.banana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: `{etiqueta: 'BananaAnimada', nombreAnimacion: "comerBanana"}`,
    });

    this.crearBloqueAccion('ComerBananaNano', {
      descripcion: 'Comer banana',
      icono: 'icono.banana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "BananaAnimada"}',
    });

    this.crearBloqueAccion('ComerManzana', {
      descripcion: 'Comer manzana',
      icono: 'icono.manzana.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'ManzanaAnimada\',  nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAccion('ComerQueso', {
      descripcion: 'Comer queso',
      icono: 'queso.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "QuesoAnimado"}',
    });

    this.crearBloqueAccion('ComerNaranja', {
      descripcion: 'Comer naranja',
      icono: 'naranja.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\' : \'NaranjaAnimada\',  nombreAnimacion: "comerNaranja"}',
    });

    this.crearBloqueAccion('MoverACasillaDerecha', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaIzquierda', {
      descripcion: 'Mover a la izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverACasillaIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaArriba', {
      descripcion: 'Mover arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'MoverACasillaArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverACasillaAbajo', {
      descripcion: 'Mover abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'MoverACasillaAbajo',
      argumentos: '{}',
    });

    this.crearBloqueAccion('LevantaTuerca', {
      descripcion: 'Levantar tuerca',
      icono: 'tuerca.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "TuercaAnimada", mensajeError: "No hay tuerca aquí", pasos: 50}',
    });

    this.crearBloqueAccion('Saludar', {
      descripcion: 'Saludar',
      icono: 'icono.saludar.png',
      comportamiento: 'ComportamientoAnimado',
      argumentos: '{nombreAnimacion: "saludando", idTransicion: "saludar"}',
    });

    this.crearBloqueAccion('Abrirojos', {
      descripcion: 'Abrir ojos',
      icono: 'icono.abrirOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "abrirOjos", valorEstar: "con los ojos abiertos", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "parado", arrancoAsi:true, idTransicion: "abrirOjos"}',
    });

    this.crearBloqueAccion('Cerrarojos', {
      descripcion: 'Cerrar ojos',
      icono: 'icono.cerrarOjos.png',
      comportamiento: 'AnimarSiNoEstoyYa',
      argumentos: '{nombreAnimacion: "cerrarOjos", valorEstar: "con los ojos cerrados", descripcionEstar: "estadoOjos", nombreAnimacionSiguiente: "ojosCerrados", idTransicion: "cerrarOjos"}',
    });

    this.crearBloqueAccion('Acostarse', {
      descripcion: 'Acostarse',
      icono: 'icono.acostarse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -180 ,rotacionIr: 90, nombreAnimacion:"acostado", valorEstar: "acostado", descripcionEstar: "posicionCuerpo", idTransicion: "acostarse"}',
    });

    this.crearBloqueAccion('Pararse', {
      descripcion: 'Pararse',
      icono: 'icono.pararse.png',
      comportamiento: 'ModificarRotacionYAltura',
      argumentos: '{alturaIr: -150 ,rotacionIr: 0, nombreAnimacion:"acostado", valorEstar: "parado", descripcionEstar: "posicionCuerpo", arrancoAsi:true, idTransicion: "levantarse"}',
    });

    this.crearBloqueAccion('Volver', {
      descripcion: 'Volver',
      icono: 'icono.izquierda.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, idTransicion: "volver"}',
    });

    this.crearBloqueAccion('Avanzar', {
      descripcion: 'Avanzar',
      icono: 'icono.derecha.png',
      comportamiento: 'MovimientoAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, idTransicion: "avanzar"}',
    });

    this.crearBloqueAccion('Soar', {
      descripcion: 'Soñar',
      icono: 'icono.soniar.png',
      comportamiento: 'Pensar',
      argumentos: '{mensaje: "ZZzzZzZ...", hayQueAnimar: false, idTransicion: "soniar"}',
    });

    this.crearBloqueAccion('saltar1', {
      descripcion: 'Saltar',
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarHablando',
      argumentos: `{
        velocidad_inicial: 30,
        alturaDeseada: 150,
        cantPasos: 20,
        velocidad: 50
      }`,
    });

    this.crearBloqueAccion('VolverABordeIzquierdo', {
      descripcion: 'Ir al borde izquierdo',
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('TomarEstrella', {
      descripcion: 'Tomar estrella',
      icono: 'icono.estrella.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "EstrellaAnimada", "mensajeError": "Acá no hay una estrella"}',
    });

    this.crearBloqueAccion('MorderSandia', {
      descripcion: 'Comer sandía',
      icono: 'icono.sandia.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{\'etiqueta\':\'SandiaAnimada\', \'mensajeError\': \'Acá no hay una sandia\'}',
    });

    this.crearBloqueAccion('AlimentarPez', {
      descripcion: 'Alimentar pez',
      icono: 'icono.pez.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "PezAnimado", idTransicion: "alimentarPez"}',
    });

    this.crearBloqueAccion('AgarrarComida', {
      descripcion: 'Agarrar comida',
      icono: 'icono.alimento_pez.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta: "AlimentoAnimado", idTransicion: "recogerComida"}',
    });

    this.crearBloqueAccion('SiguienteCompu', {
      descripcion: 'Pasar a la siguiente compu',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ApagarCompu', {
      descripcion: 'Apagar compu',
      icono: 'icono.computadora.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
				etiqueta: "CompuAnimada",
				mensajeError: "No hay una compu aqui",
				idTransicion: "apagar",
				animacionColisionadoPost: "parado",
				nombreAnimacion: "escribir"
			}`
    });

    this.crearBloqueAccion('InstalarJuego', {
      descripcion: 'Instalar juego',
			comportamiento: 'SecuenciaAnimada',
			argumentos:  `{
        idTransicion: "instalar",
        secuencia: [
          {
            comportamiento: "ComportamientoColision",
            argumentos: {
              etiqueta: "CompuAnimada",
							mensajeError: "No hay una compu aqui",
							nombreAnimacion: "escribir",
            }
          },
          {
            comportamiento: "EsperarAnimacionTocado",
            argumentos: {
							etiqueta: "CompuAnimada",
							nombreAnimacion: "instalando",
							nombreAnimacionSiguiente: "yaInstalado"
            }
          }
        ]
      }`
    });

    this.crearBloqueAccion('EscribirC', {
      descripcion: 'Escribir "C"',
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion : "escribirC"}',
    });

    this.crearBloqueAccion('EscribirB', {
      descripcion: 'Escribir "B"',
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion: "escribirB"}',
    });

    this.crearBloqueAccion('EscribirA', {
      descripcion: 'Escribir "A"',
      comportamiento: 'EscribirEnCompuAnimada',
      argumentos: '{idTransicion: "escribirA"}',
    });

    this.crearBloqueAccion('Agarrarllave', {
      descripcion: 'Tomar la llave',
      icono: 'icono.llave.png',
      comportamiento: 'Sostener',
      argumentos: `{
        etiqueta: "LlaveAnimado",
        idTransicion: "agarrarLlave"
      }`,
    });

    this.crearBloqueAccion('Abrircofre', {
      descripcion: 'Abrir el cofre',
      icono: 'icono.cofre.png',
      comportamiento: 'Soltar',
      argumentos: `{
        etiqueta: "CofreAnimado",
        queSoltar: "LlaveAnimado",
        animacionColisionadoPost: "abrir",
        idTransicion: "abrirCofre"
      }`,
    });

    this.crearBloqueAccion('Darsombrero', {
      descripcion: 'Dar el sombrero',
      icono: 'icono.sombrero.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "MagoAnimado",
        nombreAnimacion: "cambiarSombreroPorEspada",
        animacionColisionadoMientras: "darEspada",
        idTransicion: "darSombrero"
      }`,
    });

    this.crearBloqueAccion('Atacarconespada', {
      id: 'Atacarconespada',
      descripcion: 'Atacar con la espada',
      icono: 'icono.espada.png',
      comportamiento: 'SecuenciaAnimada',
      argumentos: `{
        idTransicion: "atacarConEspada",
        secuencia: [
          {
            comportamiento: "ComportamientoColision",
            argumentos: {
              etiqueta: "CaballeroAnimado",
              animacionColisionadoMientras: "defender",
              nombreAnimacion:"atacar"
            }
          },
          {
            comportamiento: "Sostener",
            argumentos: {
              etiqueta:"Principe"
            }
          }
        ]
      }`,
    });

    /* NUEVA */

    this.crearBloqueAccion('EscaparEnUnicornio', {
      descripcion: 'Escapar en unicornio',
      icono: 'icono.unicornio.png',
      comportamiento: 'Escapar',
      argumentos: `{
        escaparCon: "unicornio"
      }`,
    });

    this.crearBloqueAlias('Escaparenunicornio', 'EscaparEnUnicornio');

    this.crearBloqueAccion('Escapar', {
      descripcion: 'Escapar',
      comportamiento: 'Escapar',
      argumentos: `{
        receptor: "nave",
        escaparCon: "automata"
      }`,
    });

    this.crearBloqueAccion('TomarHierro', {
      descripcion: 'Agarrar hierro',
      icono: 'icono.hierro.png',
      comportamiento: 'Sostener',
      argumentos: '{etiqueta: "HierroAnimado", nombreAnimacion: "recogerHierro"}',
    });

    this.crearBloqueAccion('TomarCarbon', {
      descripcion: 'Agarrar carbón',
      id: 'TomarCarbon',
      icono: 'icono.carbon.png',
      comportamiento: 'Sostener',
      argumentos: '{etiqueta: "CarbonAnimado", nombreAnimacion: "recogerCarbon"}',
    });

    this.crearBloqueAccion('PrenderFogata', {
      descripcion: 'Prender fogata',
      icono: 'icono.FogataPrendida.png',
      comportamiento: 'ComportamientoColision',
      argumentos: '{etiqueta: "FogataAnimada", animacionColisionadoPost: "prendida", nombreAnimacion: "prender" }',
    });

    this.crearBloqueAlias('Prenderfogata', 'PrenderFogata');

    this.crearBloqueAccion('Depositar', {
      descripcion: 'Poner en la nave',
      comportamiento: 'Soltar',
      argumentos: `{
        idTransicion: "depositar",
        etiqueta: "NaveAnimada"
      }`,
    });


    this.crearBloqueAccion('AvanzarMono', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{velocidad: 25}',
    });

    this.crearBloqueAccion('DejarRegalo', {
      descripcion: 'Dejar un regalo',
      icono: 'icono.regalo.png',
      comportamiento: 'Depositar',
      argumentos: '{claseADepositar: "RegaloAnimado"}',
    });

    this.crearBloqueAlias('Dejarregalo', 'DejarRegalo');

    this.crearBloqueAccion('SiguienteFila', {
      descripcion: 'Pasar a la siguiente fila',
      icono: 'icono.abajo.png',
      comportamiento: 'SiguienteFila',
      argumentos: '{}'
    });

    this.crearBloqueAccion('SiguienteFilaTotal', {
      descripcion: 'Pasar a la siguiente fila',
      icono: 'icono.izquierdaAbajo.png',
      comportamiento: 'SecuenciaAnimada',

      argumentos: `{secuencia: [
        {
          comportamiento: "MoverTodoAIzquierda",
          argumentos: {}
        },
        {
          comportamiento: "MoverACasillaAbajo",
          argumentos: {}
        }
      ]}`,

    });

    this.crearBloqueAccion('SiguienteColumna', {
      descripcion: 'Pasar a la siguiente columna',
      icono: 'icono.derecha.png',
      comportamiento: 'SiguienteColumna',
      argumentos: '{}',
    });

    this.crearBloqueAccion('ContarBanana', {
      descripcion: 'Contar una banana',
      icono: 'icono.banana.png',
      comportamiento: 'ContarPorEtiqueta',
      argumentos: '{etiqueta: "BananaAnimada", nombreAnimacion: "comerBanana"}',
    });

    this.crearBloqueAlias('Contarbanana', 'ContarBanana');

    this.crearBloqueAccion('ContarManzana', {
      descripcion: 'Contar una manzana',
      icono: 'icono.manzana.png',
      comportamiento: 'ContarPorEtiqueta',
      argumentos: '{etiqueta: "ManzanaAnimada", nombreAnimacion: "comerManzana"}',
    });

    this.crearBloqueAlias('Contarmanzana', 'ContarManzana');

    this.crearBloqueAccion('ExplotarGlobo', {
      descripcion: 'Explotar globo',
      icono: 'icono.globo.png',
      comportamiento: 'ComportamientoColision',

      argumentos: `{
        etiqueta: "GloboAnimado",
        nombreAnimacion: "recoger",
        idTransicion: "explotar",
        comportamientoAdicional: 'Eliminar',
        argumentosComportamiento: {
          nombreAnimacion: "explotar"
        }}`,
    });

    let blockly = this.get('blockly');

    let bloque = blockly.createCustomBlock('MoverA', {
      message0: "Mover a %1",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "input_value",
          "name": "direccion",
        }
      ],
      code: 'hacer(actor_id, "MovimientoEnCuadricula", {direccionCasilla: $direccion});'
    });

    bloque.categoria = "Primitivas";


    this.crearBloqueAccion('PatearPelota', {
      descripcion: 'Patear pelota',
      icono: 'icono.pelota.png',
      comportamiento: 'DesencadenarComportamientoSiColisiona',
      argumentos: '{"comportamiento": "SerPateado", idTransicion: "patear", etiqueta: "PelotaAnimada", argumentosComportamiento: {tiempoEnElAire:25, aceleracion:0.0025, elevacionMaxima:25, gradosDeAumentoStep:-2}}',
    });

    this.crearBloqueAccion('Avanzar1km', {
      descripcion: 'Avanzar 1 Km',
      icono: 'icono.derecha.png',
      comportamiento: 'VolarHeroicamente',
      argumentos: '{}',
    });

    this.crearBloqueAlias('AvanzarKm', 'Avanzar1km');

    this.crearBloqueAccion('CambiarColor', {
      descripcion: 'Cambiar color del foco',
      icono: 'icono.cambiar.color.png',
      comportamiento: 'CambiarColor',
      argumentos: '{}',
    });

    this.crearBloqueAlias('cambiarColor', 'CambiarColor');

    this.crearBloqueAccion('SiguienteFoco', {
      descripcion: 'Pasar al siguiente foco',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAlias('siguienteFoco', 'SiguienteFoco');

    this.crearBloqueAccion('EmpezarFiesta', {
      descripcion: 'Empezar fiesta',
      icono: 'icono.empezar.fiesta.png',
      comportamiento: 'EmpezarFiesta',
      argumentos: '{idTransicion: "empezarFiesta"}',
    });

    this.crearBloqueAlias('empezarFiesta', 'EmpezarFiesta');

    this.crearBloqueAccion('VolverAlBordeIzquierdo', {
      descripcion: 'Volver al borde izquierdo',
      icono: 'icono.izquierdaTope.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Volveralbordeizquierdo', 'VolverAlBordeIzquierdo');

    this.crearBloqueAccion('PrimerSospechoso', {
      descripcion: 'Ir al primer sospechoso',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverTodoAIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Primersospechoso', 'PrimerSospechoso');

    this.crearBloqueAccion('SiguienteSospechoso', {
      descripcion: 'Pasar al siguiente sospechoso',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverACasillaDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Siguientesospechoso', 'SiguienteSospechoso');

    this.crearBloqueAccion('SacarDisfraz', {
      descripcion: 'Interrogar sospechoso',
      icono: 'icono.sacar.disfraz.png',
      comportamiento: 'SacarDisfraz',
      argumentos: '{}',
    });

    this.crearBloqueAlias('Sacardisfraz', 'SacarDisfraz');

    blockly.createCustomBlock('DibujarLado', {
      message0: "%1 Dibujar lado de %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.DibujarLinea.png`,
          "width": 16,
          "height": 16,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "longitud",
        }
      ],
      code: 'hacer(actor_id, "DibujarHaciaAdelante", {distancia: $longitud, voltearAlIrAIzquierda: false, velocidad: 60});'
    });

    Blockly.Blocks['DibujarLado'].toolbox = `
      <block type="DibujarLado">
        <value name="longitud">
          <block type="math_number"><field name="NUM">100</field></block></value>
      </block>
    `;

    Blockly.Blocks['DibujarLado'].categoria = 'Primitivas';

		this.crearBloqueAccion('ComerChurrasco', {
      descripcion: 'Comer churrasco',
      icono: 'icono.churrasco.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: '{etiqueta:"Churrasco", nombreAnimacion: "comerChurrasco", animacionColisionadoMientras: "desaparecer"}',
    });

		this.crearBloqueAccion('AgarrarTomate', {
      descripcion: 'Agarrar tomate',
      icono: 'icono.tomate.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: `{
        etiqueta: "Tomate",
        nombreAnimacion: "agarrarTomate",
        animacionColisionadoMientras: "desaparecer",
        idTransicion: "agarrarTomate"
        
      }`,
    });

		this.crearBloqueAccion('AgarrarLechuga', {
      descripcion: 'Agarrar lechuga',
      icono: 'icono.lechuga.png',
      comportamiento: 'RecogerPorEtiqueta',
      argumentos: `{
        etiqueta: "Lechuga",
        nombreAnimacion: "agarrarLechuga",
        animacionColisionadoMientras: "desaparecer",
        idTransicion: "agarrarLechuga"
      }`,
    });

		this.crearBloqueAccion('PrepararEnsalada', {
      descripcion: 'Preparar ensalada',
      icono: 'icono.ensaladera.png',
      comportamiento: 'ComportamientoColision',
      argumentos: `{
        etiqueta: "Ensaladera",
        nombreAnimacion: "prepararEnsalada",
        animacionColisionadoMientras: "preparando",
        animacionColisionadoPost: "llena",
        idTransicion: "prepararEnsalada"
      }`
      // comportamientoAdicional: 'Eliminar',
      // argumentosComportamiento: {
      //   nombreAnimacion: "explotar"
      // }
    });



    // Para los desafíos de escribir y leer letras
    
    this.crearBloqueAccion('EscribirLetraActualEnOtraCuadricula', {
      descripcion: 'Escribir letra que estoy tocando',
      icono: 'icono.DibujarLinea.png',
      comportamiento: 'EscribirTextoDadoEnOtraCuadricula',
      argumentos: '{}',
    });

    blockly.createCustomBlock('EscribirTextoDadoEnOtraCuadricula', {
      message0: "%1 Escribir: %2",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.DibujarLinea.png`,
          "width": 16,
          "height": 16,
          "alt": "*"
        },
        {
          "type": "field_input",
          "name": "texto",
          "text": ""
        }
      ],
      code: 'hacer(actor_id, "EscribirTextoDadoEnOtraCuadricula", {texto: "$texto"});'
    });

    Blockly.Blocks['EscribirTextoDadoEnOtraCuadricula'].categoria = 'Primitivas';



    blockly.createCustomBlock('GirarGrados', {
      message0: "%1 Girar %2 grados",
      colour: Blockly.Blocks.primitivas.COLOUR,
      inputsInline: true,
      previousStatement: true,
      nextStatement: true,
      args0: [
        {
          "type": "field_image",
          "src": `iconos/icono.Girar.png`,
          "width": 16,
          "height": 16,
          "alt": "*"
        },
        {
          "type": "input_value",
          "name": "grados",
        }
      ],
      code: 'hacer(actor_id, "Rotar", {angulo: - $grados, voltearAlIrAIzquierda: false, velocidad: 60});'
    });

    Blockly.Blocks['GirarGrados'].toolbox = `
      <block type="GirarGrados">
        <value name="grados">
          <block type="math_number"><field name="NUM">90</field></block></value>
      </block>
    `;

    Blockly.Blocks['GirarGrados'].categoria = 'Primitivas';

    this.crearBloqueAccion('MoverArribaDibujando', {
      descripcion: 'Mover arriba dibujando',
      icono: 'icono.arribaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{distancia: 50, direccion: [0,1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverAbajoDibujando', {
      descripcion: 'Mover abajo dibujando',
      icono: 'icono.abajoDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{distancia: 50, direccion: [0,-1], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverDerechaDibujando', {
      descripcion: 'Mover derecha dibujando',
      icono: 'icono.derechaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{distancia: 50, direccion: [1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('MoverIzquierdaDibujando', {
      descripcion: 'Mover izquierda dibujando',
      icono: 'icono.izquierdaDibujando.png',
      comportamiento: 'DibujarLinea',
      argumentos: '{distancia: 50, direccion: [-1,0], nombreAnimacion: "correrDibujando", dibujarPuntos: true}',
    });

    this.crearBloqueAccion('SaltarArriba', {
      descripcion: 'Saltar arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarAbajo', {
      descripcion: 'Saltar abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [0,-1], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarDerecha', {
      descripcion: 'Saltar derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('SaltarIzquierda', {
      descripcion: 'Saltar izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'SaltarAnimado',
      argumentos: '{direccion: [-1,0], distancia: 50, alturaDeseada: 50, velocidad_inicial: 20, nombreAnimacion: "saltar"}',
    });

    this.crearBloqueAccion('MoverLeyendoDerecha', {
      descripcion: 'Mover a la derecha',
      icono: 'icono.derecha.png',
      comportamiento: 'MoverLeyendoDerecha',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoIzquierda', {
      descripcion: 'Mover a la izquierda',
      icono: 'icono.izquierda.png',
      comportamiento: 'MoverLeyendoIzquierda',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoArriba', {
      descripcion: 'Mover arriba',
      icono: 'icono.arriba.png',
      comportamiento: 'MoverLeyendoArriba',
      argumentos: '{}',
    });

    this.crearBloqueAccion('MoverLeyendoAbajo', {
      descripcion: 'Mover abajo',
      icono: 'icono.abajo.png',
      comportamiento: 'MoverLeyendoAbajo',
      argumentos: '{}',
    });

  },

  _definirBloquesAlias() {
    this.crearBloqueAlias('Numero', 'math_number', 'Valores');
    this.crearBloqueAlias('OpAritmetica', 'math_arithmetic', 'Operadores');
    this.crearBloqueAlias('OpComparacion', 'logic_compare', 'Operadores');
    this.crearBloqueAlias('Booleano', 'logic_boolean', 'Valores');
  },

  _definirBloquesSensores() {

    this.crearBloqueSensor('Tocandobanana', {
      descripcion: 'Hay banana acá',
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
      esBool: true
    });
    this.crearBloqueAlias('tocandoBanana', 'Tocandobanana');

    this.crearBloqueSensor('Tocandomanzana', {
      descripcion: 'Hay manzana acá',
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoManzana', 'Tocandomanzana');

    this.crearBloqueSensor('TocandoNaranja', {
      descripcion: 'Hay una naranja acá',
      icono: 'icono.naranja.png',
      funcionSensor: 'tocando("NaranjaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFogata', {
      descripcion: 'Hay fogata acá',
      icono: 'icono.FogataApagada.png',
      funcionSensor: 'tocando("FogataAnimada")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoFogata', 'TocandoFogata');

    this.crearBloqueSensor('TocandoInicio', {
      descripcion: 'Estoy al inicio',
      icono: 'icono.futbolInicio.png',
      funcionSensor: 'tocandoInicio()',
      esBool: true
    });

    this.crearBloqueAlias('tocandoInicio', 'TocandoInicio');

    this.crearBloqueSensor('TocandoPelota', {
      descripcion: 'Llegué a la pelota',
      icono: 'icono.pelota.png',
      funcionSensor: 'tocando("PelotaAnimada")',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinal', {
      descripcion: 'Llegué al final',
      icono: 'icono.titoFinalizacion.png',
      funcionSensor: 'estoyUltimaFila()',
      esBool: true
    });

    this.crearBloqueAlias('tocandoFinal', 'TocandoFinal');


    this.crearBloqueAlias('tocandoPelota', 'TocandoPelota');

    this.crearBloqueSensor('KmsTotales', {
      descripcion: 'Kilómetros a recorrer',
      icono: 'icono.kms.png',
      funcionSensor: 'kmsTotales()',
    });

    this.crearBloqueSensor('EstoyEnEsquina', {
      descripcion: 'Estoy en una esquina',
      icono: 'icono.prendiendoLasCompus2.png',
      funcionSensor: 'casillaActual().esEsquina()',
      esBool: true
    });

    this.crearBloqueAlias('Estoyenunaesquina', 'EstoyEnEsquina');


    this.crearBloqueSensor('TocandoManzana', {
      descripcion: 'Hay una manzana acá',
      icono: 'icono.manzana.png',
      funcionSensor: 'tocando("ManzanaAnimada")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoManzana', 'TocandoManzana');

    this.crearBloqueSensor('TocandoBanana', {
      descripcion: 'Hay una banana acá',
      icono: 'icono.banana.png',
      funcionSensor: 'tocando("BananaAnimada")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoBanana', 'TocandoBanana');

    this.crearBloqueSensor('EstoyAlInicio', {
      descripcion: 'Estoy al inicio de la columna',
      icono: 'icono.casillainiciomono.png',
      funcionSensor: 'casillaActual().esInicio()',
      esBool: true
    });

    this.crearBloqueAlias('estoyInicio', 'EstoyAlInicio');

    this.crearBloqueSensor('EstoyAlFin', {
      descripcion: 'Estoy al final de la columna',
      icono: 'icono.casillafinalmono.png',
      funcionSensor: 'casillaActual().esFin()',
      esBool: true
    });

    this.crearBloqueAlias('estoyFinColumna', 'EstoyAlFin');

    this.crearBloqueSensor('LargoColumnaActual', {
      descripcion: 'Largo de la columna actual',
      icono: 'icono.largoCol.png',
      funcionSensor: 'largoColumnaActual()-1',
    });

    this.crearBloqueSensor('TocandoAbajo', {
      descripcion: 'Puedo mover abajo',
      icono: 'icono.abajo.png',
      funcionSensor: 'tocandoFlechaAbajo()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoDerecha', {
      descripcion: 'Puedo mover a la derecha',
      icono: 'icono.derecha.png',
      funcionSensor: 'tocandoFlechaDerecha()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoFinCamino', {
      descripcion: 'Llegó a la meta',
      icono: 'icono.finCamino.png',
      funcionSensor: 'alFinalDelCamino()',
      esBool: true
    });

    this.crearBloqueSensor('TocandoQueso', {
      descripcion: 'Hay queso acá',
      icono: 'queso.png',
      funcionSensor: 'tocando("QuesoAnimado")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoQueso', 'TocandoQueso');

    this.crearBloqueSensor('TocandoLuz', {
      descripcion: 'Hay lamparita acá',
      icono: 'icono.LamparitaApagada.png',
      funcionSensor: 'tocando("Lamparin")',
      esBool: true
    });

    this.crearBloqueAlias('tocandoLuz', 'TocandoLuz');

    this.crearBloqueSensor('EsCulpable',  {
      id: 'Descubralculpable',
      descripcion: 'Estoy frente al culpable',
      icono: 'icono.culpable.png',
      funcionSensor: 'colisionaConElCulpable() && pilas.escena_actual().culpable.teEncontraron()',
      esBool: true
    });

    this.crearBloqueAlias('Descubralculpable', 'EsCulpable');

    this.crearBloqueSensor('HayChurrasco', {
      descripcion: 'Hay un churrasco acá',
      icono: 'icono.churrasco.png',
      funcionSensor: 'tocando("Churrasco")',
      esBool: true
    });
  
    this.crearBloqueSensor('HayObstaculoArriba', {
      descripcion: 'Hay un obstáculo arriba',
      icono: 'icono.arriba.png',
      funcionSensor: 'tieneEnLaCasillaDeArriba("Obstaculo")',
      esBool: true
    });
  
    this.crearBloqueSensor('HayObstaculoAbajo', {
      descripcion: 'Hay un obstáculo abajo',
      icono: 'icono.abajo.png',
      funcionSensor: 'tieneEnLaCasillaDeAbajo("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoIzquierda', {
      descripcion: 'Hay un obstáculo a la izquierda',
      icono: 'icono.izquierda.png',
      funcionSensor: 'tieneEnLaCasillaASuIzquierda("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayObstaculoDerecha', {
      descripcion: 'Hay un obstáculo a la derecha',
      icono: 'icono.derecha.png',
      funcionSensor: 'tieneEnLaCasillaASuDerecha("Obstaculo")',
      esBool: true
    });

    this.crearBloqueSensor('HayCharco', {
      descripcion: 'Hay un charco',
      icono: 'icono.charco.png',
      funcionSensor: 'hayEnEscena("Charco")',
      esBool: true
    });

    let sensorHayVocal = this.get('blockly').createCustomBlock('hayVocalRMT', {
      "type": "block_type",
      "message0": "%1 ¿La letra actual es una %2 ?",
      "args0": [
        {
          type: "field_image",
          src: `iconos/icono.DibujarLinea.png`,
          width: 16,
          height: 16,
          alt: "*"
        },
        {
          "type": "field_dropdown",
          "name": "letra",
          "options": [
            ["R","r"],["M","m"],["T","t"],["A","a"],["E","e"],["I","i"],["O","o"],["U","u"]
          ]
        }
      ],
      "output": null,
      "colour": Blockly.Blocks.sensores.COLOUR,
      "tooltip": "Es cierto cuando estoy leyendo esta letra ahora",
      "helpUrl": ""
    });
    sensorHayVocal.categoria = "Sensores";

    Blockly.MyLanguage['hayVocalRMT'] = function(block) {
      let codigo = `evaluar("leyendoCaracter('${block.getFieldValue('letra')}')")`;
      return [codigo, Blockly.MyLanguage.ORDER_ATOMIC];
    };

    this.crearBloqueSensor('HayLechuga', {
      descripcion: 'Hay lechuga acá',
      icono: 'icono.lechuga.png',
      funcionSensor: 'tocando("Lechuga")',
      esBool: true
    });

    this.crearBloqueSensor('HayTomate', {
      descripcion: 'Hay tomate acá',
      icono: 'icono.tomate.png',
      funcionSensor: 'tocando("Tomate")',
      esBool: true
    });

  },

  _definirBloquesQueRepresentanValores() {

    this.crearBloqueValor("ParaLaDerecha", {
      descripcion: 'la derecha',
      icono: 'icono.derecha.png',
      valor: 'derecha',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaLaIzquierda', {
      descripcion: 'la izquierda',
      icono: 'icono.izquierda.png',
      valor: 'izquierda',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaArriba', {
      descripcion: 'arriba',
      icono: 'icono.arriba.png',
      valor: 'arriba',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueValor('ParaAbajo', {
      descripcion: 'abajo',
      icono: 'icono.abajo.png',
      valor: 'abajo',
      colour: Blockly.Blocks.direcciones.COLOUR,
    });

    this.crearBloqueAlias('Texto', 'text','Valores');

  },

  _definirBloqueAlIniciar() {

    Blockly.Blocks['al_empezar_a_ejecutar'] = {
      init: function() {
        this.setColour(Blockly.Blocks.eventos.COLOUR);

        this.appendDummyInput().appendField('Al empezar a ejecutar');

        this.appendStatementInput('program');
        this.setDeletable(false);

        this.setEditable(false);
        this.setMovable(false);
      }
    };

  },

  _definirBloquesEstructurasDeControl() {

    Blockly.Blocks['RepetirVacio'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.appendValueInput('count')
          .setCheck('Number')
          .appendField('Repetir');
        this.appendDummyInput()
          .appendField('veces');
        this.appendStatementInput('block');
      },
      categoria: 'Repeticiones',
    };

    Blockly.Blocks['repetir'] = {
      init: Blockly.Blocks['RepetirVacio'].init,
      categoria: Blockly.Blocks['RepetirVacio'].categoria,
      toolbox: '<block type="repetir"><value name="count"><block type="math_number"><field name="NUM">10</field></block></value></block>'
    };

    let bloque_procedimiento = this.crearBloqueAlias('Procedimiento', 'procedures_defnoreturn');


    let init_base_callnoreturn = Blockly.Blocks['procedures_callnoreturn'].init;

    Blockly.Blocks['procedures_callnoreturn'].init = function() {
      this.setInputsInline(true);
      init_base_callnoreturn.call(this);
    };


    Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = "Definir";
    let init_base_procedimiento = Blockly.Blocks['procedures_defnoreturn'].init;

    Blockly.Blocks['procedures_defnoreturn'].init = function() {
      init_base_procedimiento.call(this);
    };

    this.crearBloqueAlias('param_get', 'variables_get');

    bloque_procedimiento.categoria = 'Mis procedimientos';
    bloque_procedimiento.categoria_custom = 'PROCEDURE';

    delete Blockly.Blocks.procedures_defreturn;
    delete Blockly.Blocks.procedures_ifreturn;

    this.crearBloqueAlias('Repetir', 'repetir', 'Repeticiones');

    Blockly.Blocks['Si'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField('Si');
				this.setInputsInline(true);
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Alternativas',
    };

    this.crearBloqueAlias('si', 'Si', 'Alternativas');

    Blockly.Blocks['SiNo'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField('Si');
        this.appendStatementInput('block1');
				this.setInputsInline(true);
        this.appendDummyInput()
            .appendField('si no');
        this.appendStatementInput('block2');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Alternativas',
    };

    this.crearBloqueAlias('Sino', 'SiNo', 'Alternativas');
    this.crearBloqueAlias('sino', 'SiNo', 'Alternativas');

    Blockly.Blocks['Hasta'] = {
      init: function() {
        this.setColour(Blockly.Blocks.control.COLOUR);
        this.setInputsInline(true);
        this.appendValueInput('condition')
            .setCheck('Boolean')
            .appendField('Repetir hasta que');
        this.appendStatementInput('block');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      },
      categoria: 'Repeticiones',
    };

    this.crearBloqueAlias('hasta', 'Hasta');

  },

  _generarLenguaje() {
    Blockly.MyLanguage = Blockly.JavaScript;
    Blockly.MyLanguage.addReservedWords('main', 'hacer', 'out_hacer', 'evaluar');

    Blockly.MyLanguage['al_empezar_a_ejecutar'] = function(block) {
      let programa = Blockly.JavaScript.statementToCode(block, 'program');
      let codigo = `${programa}`;
      return codigo;
    };

    Blockly.MyLanguage['RepetirVacio'] = function(block) {
      var repeats = Blockly.MyLanguage.valueToCode(block, 'count',
      Blockly.MyLanguage.ORDER_ASSIGNMENT) || '0';

      var branch = Blockly.MyLanguage.statementToCode(block, 'block');
      branch = Blockly.MyLanguage.addLoopTrap(branch, block.id);
      var code = '';

      var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'count', Blockly.Variables.NAME_TYPE);
      var endVar = repeats;
      if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
        endVar = Blockly.MyLanguage.variableDB_.getDistinctName(
          'repeat_end', Blockly.Variables.NAME_TYPE);
        code += 'var ' + endVar + ' = ' + repeats + ';\n';
      }
      code += 'for (var ' + loopVar + ' = 0; ' +
        loopVar + ' < ' + endVar + '; ' +
        loopVar + '++) {\n' +
        branch + '}\n';
      return code;
    };

    Blockly.MyLanguage['repetir'] = Blockly.MyLanguage['RepetirVacio'];

    Blockly.MyLanguage['Si'] = function(block) {
      var condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `if (${condition}) {
        ${contenido}
      }`;
    };

    Blockly.MyLanguage['SiNo'] = function(block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var bloque_1 = Blockly.JavaScript.statementToCode(block, 'block1');
      var bloque_2 = Blockly.JavaScript.statementToCode(block, 'block2');

      return `if (${condition}) {
        ${bloque_1}
      } else {
        ${bloque_2}
      }`;
    };

    Blockly.MyLanguage['Hasta'] = function(block) {
      var condition = Blockly.MyLanguage.valueToCode(block, 'condition', Blockly.MyLanguage.ORDER_ASSIGNMENT) || 'false';
      var contenido = Blockly.MyLanguage.statementToCode(block, 'block');
      return `while (!${condition}) {
        ${contenido}
      }`;
    };


    Blockly.MyLanguage.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.MyLanguage.addReservedWords('highlightBlock');
  }
});
