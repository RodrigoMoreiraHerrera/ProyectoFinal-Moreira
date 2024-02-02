/** clase que genera objetos "gasto" con descripcion y monto */
class gasto {
    /**constructor de participantes para la divicion de gastos 
     * @param {string} descripcion Nombre del participante
     * @param {Number} monto acumulador de gastos del participante
     * @param {Array} participantes lista de participantes del gasto
    */
    constructor(descripcion, monto, participantes) {
        this.descripcion = descripcion;
        this.monto = monto;
        this.participantes = participantes;
    }
}




