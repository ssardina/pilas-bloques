import {moduloActividad, actividadTest} from '../../helpers/actividadTest';


const nombre = 'MariaLaComeSandias';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="78" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="87"><mutation name="Morder todas las filas"></mutation><next><block type="procedures_callnoreturn" id="91"><mutation name="Morder columna final"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id="95" x="8" y="176"><mutation></mutation><field name="NAME">Morder fila de sandias</field><statement name="STACK"><block type="repetir" id="115" inline="true"><value name="count"><block type="math_number" id="116"><field name="NUM">5</field></block></value><statement name="block"><block type="MoverACasillaDerecha" id="134"><next><block type="MorderSandia" id="140"></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="100" x="382" y="175"><mutation></mutation><field name="NAME">Volver al borde izquierdo</field><statement name="STACK"><block type="repetir" id="119" inline="true"><value name="count"><block type="math_number" id="120"><field name="NUM">5</field></block></value><statement name="block"><block type="MoverACasillaIzquierda" id="146"></block></statement></block></statement></block><block type="procedures_defnoreturn" id="106" x="739" y="171"><mutation></mutation><field name="NAME">Siguiente fila</field><statement name="STACK"><block type="procedures_callnoreturn" id="153"><mutation name="Volver al borde izquierdo"></mutation><next><block type="MoverACasillaArriba" id="159"><next><block type="MoverACasillaArriba" id="165"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="80" x="10" y="345"><mutation></mutation><field name="NAME">Morder todas las filas</field><statement name="STACK"><block type="repetir" id="123" inline="true"><value name="count"><block type="math_number" id="124"><field name="NUM">2</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="172"><mutation name="Morder fila de sandias"></mutation><next><block type="procedures_callnoreturn" id="179"><mutation name="Siguiente fila"></mutation></block></next></block></statement><next><block type="procedures_callnoreturn" id="186"><mutation name="Morder fila de sandias"></mutation><next><block type="procedures_callnoreturn" id="193"><mutation name="Volver al borde izquierdo"></mutation></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="83" x="386" y="349"><mutation></mutation><field name="NAME">Morder columna final</field><statement name="STACK"><block type="repetir" id="127" inline="true"><value name="count"><block type="math_number" id="128"><field name="NUM">4</field></block></value><statement name="block"><block type="MorderSandia" id="199"><next><block type="MoverACasillaAbajo" id="210"></block></next></block></statement><next><block type="MorderSandia" id="216"></block></next></block></statement></block></xml>',
});
