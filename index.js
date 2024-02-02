"use strict"

const inputPersona = document.getElementById("nombre");
const btnAgregarPersona = document.getElementById("btnAgregarParticipante");
const inputDescripcion = document.getElementById("inputDescripcion");
const inputMonto = document.getElementById("inputMonto");
const btnAgregarGasto = document.getElementById("btnAgregarGasto");
const ulAgregarGasto = document.getElementById("personasGasto");
const tablaResultado = document.getElementById("tablaResultado");
const btnResetear = document.getElementById("btnResetear");
const tablaGastos = document.getElementById("tablaGastos");
const btnSimular = document.getElementById("btnSimular");

    /**Funcion que setea el array personas en sessionStorage y pinta la tabla de checkbox para ingresar gastos. */
    function pintarpersonasCheckbox () {
        sessionStorage.setItem("personas", JSON.stringify(personas));
        personas.forEach((elemento) => {
            let nombre = elemento.nombre
            let arr = document.getElementsByClassName("form-check-label")
            let arra = Array.prototype.slice.call( arr )
            
            let verificador = arra.some((elemento) => elemento.innerText == nombre)
            if (!verificador) {
                let li = document.createElement("li");
                li.className = "list-group-item";
                let input = document.createElement("input");
                input.className = "form-check-input me-1";
                input.id = elemento.nombre;
                input.type = "checkbox"
                let label = document.createElement("label")
                label.className = "form-check-label";
                label.htmlFor = elemento.nombre;
                label.innerText = elemento.nombre;
                
                ulAgregarGasto.appendChild(li)
                li.appendChild(input)
                li.appendChild(label)
            }
        })
    }


    /**Funcion que setea el array personas en sessionStorage y pinta la tabla de resultados. */
    function pintarResultado () {
    
        sessionStorage.setItem("personas", JSON.stringify(personas));
        tablaResultado.innerHTML = "";
        personas.forEach((elemento) => {
                let nombre = elemento.nombre
                let tr = document.createElement("tr");
                let tdNombre = document.createElement("td");
                tdNombre.textContent = nombre;
                let tdMonto  = document.createElement("td");
                tdMonto.textContent = elemento.monto.toFixed(2);
                tr.appendChild(tdNombre);
                tr.appendChild(tdMonto);
                tablaResultado.appendChild(tr);
        })
        let trTotal = document.createElement("tr")
        let tdTotal = document.createElement("td")
            tdTotal.textContent = "TOTAL"
        let tdAcum = document.createElement("td")
            tdAcum.textContent = acumulador.toFixed(2);
        trTotal.appendChild(tdTotal)
        trTotal.appendChild(tdAcum)
        tablaResultado.appendChild(trTotal)
    }

    /**Funcion que setea el array gastos en sessionStorage, pinta los gastos en la tabla resultado y define el btnEliminar */

    function pintarGastosTabla (){
        sessionStorage.setItem("gastos", JSON.stringify(gastos));
        tablaGastos.innerHTML="";
        gastos.forEach((elemento) => {
            let nombre = elemento.descripcion;
            let monto = elemento.monto;
            let parts = elemento.participantes
     //       console.log(parts)
            let tr = document.createElement("tr");
            let tdGasto = document.createElement("td");
            let div = document.createElement("div")
                div.className = "dropdown";
            let btnDrop = document.createElement("button");
            btnDrop.setAttribute("data-bs-toggle","dropdown")
            btnDrop.className = "btn dropdown-toggle";
            btnDrop.type = "button";
            btnDrop.ariaExpanded = "false";
            btnDrop.textContent = nombre ;
            let ul = document.createElement("ul")
                ul.className = "dropdown-menu"
                parts.forEach((elemento) => {
                    let li = document.createElement("li");
                    li.className = "dropdown-item";
                    li.textContent = elemento;
                    ul.appendChild(li);
                    });
     //           console.log(ul)
            div.appendChild(btnDrop)
            div.appendChild(ul)
            tdGasto.appendChild(div)
            tr.appendChild(tdGasto)
            let tdMonto  = document.createElement("td");
                tdMonto.className = "d-flex justify-content-between";
            let pMonto = document.createElement("p")
                pMonto.textContent = monto;
                let btnEliminar = document.createElement("button")
                btnEliminar.className="btn btn-danger";
                btnEliminar.textContent="Eliminar";
                btnEliminar.onclick=function(){
                    Swal.fire({
                        title: "Seguro?",
                        text: "Deseas borrar este gasto?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar"
                        }).then((result) => {
                        if (result.isConfirmed) {
                    parts.forEach((elemento) => {
                        let nom = personas.findIndex((per) => per.nombre == elemento);
                        let rest = monto / parts.length;
                        personas[nom].monto -= rest;
      //                  console.log(personas[nom].monto)
                        let gas = gastos.findIndex((gasto)=>gasto.descripcion == elemento);
                        gastos.splice(gas,1);
                        sessionStorage.setItem("gastos", JSON.stringify(gastos));
                    })
                    acumulador -= monto;
                    tablaGastos.removeChild(tr)
                    pintarResultado()
                    Swal.fire({
                        title: "Borrado!",
                        text: "Se elimino el gasto y se ajustaron los montos",
                        icon: "success"
                        });
                    }
                    });
     //               console.log(gastos)
     //               console.log(personas)
                }
                tdMonto.appendChild(pMonto)
                tdMonto.appendChild(btnEliminar)
                tr.appendChild(tdMonto)
                tablaGastos.appendChild(tr)
        });
    }
/////////////////////////////////////////////////////////////////////////////////////

let personas = JSON.parse(sessionStorage.getItem("personas"));
if (personas == null) { personas = []; }
let gastos = JSON.parse(sessionStorage.getItem("gastos"));
if (gastos == null) { gastos = []; }

let acumulador = 0;
for (let i = 0; i<gastos.length; i++){
    acumulador += Number(gastos[i].monto);
}

pintarpersonasCheckbox ();
pintarResultado();
pintarGastosTabla();

btnAgregarPersona.onclick = () => {
    let verificador = personas.some((elemento) => elemento.nombre == inputPersona.value);
    if (!verificador && inputPersona.value != "") {
    personas.push (new persona(inputPersona.value, 0));
    inputPersona.value = "";
    } else {Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "El nombre ya existe o no puede guardarse.",
        });}
//    console.log(personas);
    pintarpersonasCheckbox()
}

btnAgregarGasto.onclick = () => {
    
    let coll = document.getElementsByClassName("form-check-input");
    let checks = Array.prototype.slice.call( coll ); //TODOS LOS CHECKBOX
    let checkeados = checks.filter (i => i.checked) 
//    console.log(checkeados)
    let ches = checkeados.map((elemento) => {return elemento.id})
//    console.log(ches)
    let verificador = gastos.some((elemento) => elemento.nombre == inputDescripcion.value);
    if (!verificador && inputDescripcion.value != "" && !isNaN(inputMonto.value) && Number(inputMonto.value) > 0 && ches.length != 0){
    gastos.push (new gasto(inputDescripcion.value, Number(inputMonto.value), ches));}
    else Swal.fire({
        icon: "error",
        title: "ERROR",
        text: "No se puede cargar el gasto",
        footer: "Revisa la descripcion, el monto y que algun participante este marcado"
        });
//        console.log(gastos)
        checkeados.forEach((elemento) => {
            let nom = personas.findIndex((per) => per.nombre == elemento.id);
            personas[nom].monto += (Number(inputMonto.value) / checkeados.length);
        }) 
  //      console.log(personas)
        acumulador += Number(inputMonto.value)
        pintarResultado()
        pintarGastosTabla()
}

btnResetear.onclick = () => {
    personas=[]
    gastos=[]
    pintarpersonasCheckbox ();
    pintarResultado();
    ulAgregarGasto.innerHTML="";
    tablaGastos.innerHTML="";
    sessionStorage.setItem("personas", JSON.stringify(personas));
    sessionStorage.setItem("gastos", JSON.stringify(gastos));
}

btnSimular.onclick  = () => {
    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then((data) => {
            data.forEach((users) => {personas.push(new persona(users.name, 0))})
//            console.log(data)
//            console.log(personas)
            pintarpersonasCheckbox ();
            pintarResultado();
            pintarGastosTabla();
        }
        )
}