//inicialmente los select no tiene datos, se deben pedir a la base de datos

//llenar datos de formularios
const llenarFormulario = ()=>{

    addDataToFormulaio('Ubicacion');
    addDataToFormulaio('Persona');
    addDataToFormulaio('Rubro');
    addDataToFormulaio('Especie'); 

    //agregar puntos de mil a los numeros de cantidad y precio
    document.querySelector("#cantidad").addEventListener('keyup', (e)=>{
        document.querySelector("#cantidad").parentNode.children[0].textContent='Cantidad: '+puntosMil(document.querySelector("#cantidad").value)
    });

    document.querySelector("#precio").addEventListener('keyup', (e)=>{
        document.querySelector("#precio").parentNode.children[0].textContent='Precio: $'+puntosMil(document.querySelector("#precio").value)
    });
}

//funcion para retornar cantidad numeria con puntos de mil
const puntosMil = (cadena)=>{
    let resultado = ""
    
    for (let i = 0; i<cadena.length; i++ ){
        if(i%3==0 && i!=0){
            resultado=cadena.charAt(cadena.length-1-i)+'.'+resultado;
        }else{
            resultado=cadena.charAt(cadena.length-1-i)+resultado;
        }
    }
    return resultado;
}

//añado data a los select del formulario de agregar productos
const addDataToFormulaio = async (tipo) =>{
    const select = document.querySelector("#select"+tipo);

    const data = await peticion(tipo);

    for (let i = 0; i < data.key.length; i++) {
        const key = data.key[i];
        const text = data.text[i];
        const option = document.createElement('option');
        option.value = key;
        option.text = text;

        select.appendChild(option);
    }
    
};
//peticion para obtener datos de cada categoria (tipo)
const peticion = async (tipo) =>{
    const url = '/get'+tipo;
    const res = await fetch(url);
    const result = await res.json();
    return result;
};  

//busco los datos del formulario

llenarFormulario();




//objeto de los productos
class producto {
    constructor(descripcion, precio, cantidad, observacion, especie, rubro, ubicacion, encargado, fecha) {
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
        this.observacion = observacion;
        this.especie = especie;
        this.rubro = rubro;
        this.ubicacion = ubicacion;
        this.encargado = encargado;
        this.fecha = fecha;
    }
}

// interfaz para guardar los productos que se estan agregando en la pantalla para luego enviarlos al backend
class UI {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto) {
        this.productos.push(producto);
        return this.productos.length - 1;
    }
    getProductos() {
        return this.productos;
    }
    borrarProducto(index) {
        this.productos.splice( index, 1 );      
    }
}


//formulario de agregar producto
const form = document.querySelector('#product-form');

//instancia de UI
var ui = new UI();


//añadir accion al formulario, al momento de hacer click agregará una fila a la tabla
form.addEventListener('submit', function (event) {
    event.preventDefault();
    guardarProdcutos();
    
});

//obtiene los datos del formulario, los agrega a la tabla y los agrega al array de productos de ui
const guardarProdcutos = () => {
    
    //obtener y  validad información de formulario
    const descripcion = document.querySelector("#descripcion").value;
    const precio = document.querySelector("#precio").value;
    const observacion = document.querySelector("#observacion").value;
    const cantidad = document.querySelector("#cantidad").value;
    
    //comprobar validez de los datos
    if (descripcion === "" || precio === "" || cantidad === "") {
        alert("Los campos Descripcion, Cantidad y Precio deben estan llenados");
        return;
    }
    //obtener data de los select
    const selectEspecie = document.querySelector("#selectEspecie");
    //data para insertar a la tabla
    
    const dataTableEspecie = (selectEspecie.options[selectEspecie.selectedIndex].value == "*" ? "" : selectEspecie.options[selectEspecie.selectedIndex].text);
    //data para insertar en clase ui
    const dataEspecie = (selectEspecie.options[selectEspecie.selectedIndex].value == "*" ? null : selectEspecie.options[selectEspecie.selectedIndex].value);;
    
    const selectRubro = document.querySelector("#selectRubro");
    //data para insertar a la tabla
    const dataTableRubro = (selectRubro.options[selectRubro.selectedIndex].value == "*" ? "" :  selectRubro.options[selectRubro.selectedIndex].text);
    //data para insertar en clase ui
    const dataRubro = (selectRubro.options[selectRubro.selectedIndex].value == "*" ? null :  selectRubro.options[selectRubro.selectedIndex].value);;
    
    const selectUbicacion = document.querySelector("#selectUbicacion");
    //data para insertar a la tabla
    const dataTableUbicacion = (selectUbicacion.options[selectUbicacion.selectedIndex].value == "*" ? "" : selectUbicacion.options[selectUbicacion.selectedIndex].text);
    //data para insertar en clase ui
    const dataUbicacion = (selectUbicacion.options[selectUbicacion.selectedIndex].value == "*" ? null : selectUbicacion.options[selectUbicacion.selectedIndex].value);
    
    const selectPersona = document.querySelector("#selectPersona");
    //data para insertar a la tabla
    const dataTablePersona = (selectPersona.options[selectPersona.selectedIndex].value == "*" ? "" : selectPersona.options[selectPersona.selectedIndex].text);
    //data para insertar en clase ui
    const dataPersona = (selectPersona.options[selectPersona.selectedIndex].value == "*" ? null : selectPersona.options[selectPersona.selectedIndex].value);
    
    //los valores no deben ser nulos
    if(dataPersona===null || dataUbicacion===null || dataEspecie===null || dataRubro===null){
        alert('se deben ingresar todos los datos de Especie, Rubro, Persona, Ubicacion');
        return;
    }
    
    //insertar datos a la tabla
    const tabla = document.querySelector('#tbody');
    const newRow = tabla.insertRow(-1);
    
    let cell = newRow.insertCell(0);
    cell.innerHTML = '<strong>' + descripcion + '</strong>';
    
    cell = newRow.insertCell(1);
    cell.textContent = cantidad;
    
    cell = newRow.insertCell(2);
    cell.textContent = puntosMil(precio);
    
    
    
    cell = newRow.insertCell(3);
    cell.textContent = dataTableEspecie;
    
    cell = newRow.insertCell(4);
    cell.textContent = dataTableRubro;
    
    cell = newRow.insertCell(5);
    cell.textContent = dataTableUbicacion;
    
    cell = newRow.insertCell(6);
    cell.textContent = dataTablePersona;
    
    cell = newRow.insertCell(7);
    cell.textContent = observacion;
    
    const fecha = (new Date()).getTime();
    
    
    let index = ui.agregarProducto(new producto(descripcion, precio, cantidad, observacion, dataEspecie, dataRubro, dataUbicacion, dataPersona, fecha));
    
    cell = newRow.insertCell(8);
    cell.innerHTML = '<button class="btn btn-danger p-0"> Borrar </button>'

    cell.lastElementChild.addEventListener('click', (event) => {
        deleteRow(event.path, index);
    });
}

//Eliminar de la tabla la fila selecionada y quitarla del registro de ui
function deleteRow(path, index) {

    ui.borrarProducto(index);
    
    //path[0]=button, path[1]=td, path[2]=tr, path[3]=th 
    //elimino el tr de la tabla
    path[3].removeChild(path[2]);
}

//enviar datos
const button = document.querySelector("#enviar");

//accion boton enviar productos al backend
button.addEventListener('click', async () => {
    const productos = ui.getProductos();

    if (productos.length > 0) {
        const url = '/addProduct';
        const data = { productos };

        //enviar productos al backend para agregarlos a la base de datos
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resId = await res.json();
        if(resId.error){
            alert(resId.error);
            return
        }
        mostrarListadoAgregado(resId.ids);



    } else {
        alert("No hay productos en la tabla")
    }
});

const mostrarListadoAgregado = (idsFromServer) => {
    //idsFromServer string con rangos que manda el servidor

    const table = document.querySelector('#table');
    
    //remover formulario
    document.querySelector('#div-formulario').parentNode.removeChild(document.querySelector('#div-formulario'));
    
    //clase para que la tabla este al centro
    document.querySelector('#div-tabla').setAttribute("class", "row col-md-12");
    
    const rows = table.rows;

    //agrego la columna id
    rows[0].cells[8].textContent = "Números de id";

    for (let i=1; i<rows.length; i++){
        //itero por las columnas para pintar los rangos de cantidades
        rows[i].cells[8].textContent = idsFromServer[i-1];
        
    }

    let divEnviar = document.querySelector("#div-enviar");
    //boton para volver al formulario de agregar producto
    divEnviar.innerHTML = '<a href="/addProduct" class="btn btn-success">Volver</a>'

}

