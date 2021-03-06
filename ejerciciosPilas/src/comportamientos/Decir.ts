/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ComportamientoAnimado.ts" />
	
class Decir extends ComportamientoAnimado {
	globo;

	/* Redefinir si corresponde */
	preAnimacion() {
		this.globo = this.crearGlobo();
	}

	doActualizar() {
		super.doActualizar();
		return !this.globo.vivo;
  }

	crearGlobo(){
		return new Globo(this.receptor, this.argumentos.mensaje, {autoEliminar: this.argumentos.autoEliminar} )
	}

}

class Pensar extends Decir{
    crearGlobo() {
		return new GloboPensar(this.receptor, this.argumentos.mensaje)
    }
}