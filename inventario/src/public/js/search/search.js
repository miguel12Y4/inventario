//script para la pantalla de buscar productos por categoría


const button = document.getElementById('Buscar');

//Al momento de hacer click en el boton Buscar se obtendrá el tipo de categoria y se hará un fetch para obtener sus datos
button.addEventListener('click', async (e) => {
    e.preventDefault();

    const myselect = document.getElementById('Tipo');
    const valor = myselect.options[myselect.selectedIndex].value;

    //Valirdar que no esté vacio el dato
    if (valor === '-') {
        alert('ingrese un Tipo antes de buscar');
        return;
    }

    //validar que el dato sea correcto
    if(!(valor==="Especie" || valor==="Rubro" || valor==="Persona" || valor==="Ubicacion")){
        alert('dato ingresado no es valido para realizar la consulta');
        return
    }

    //obtener datos de esa categoría especifica
    //No sé si esto es una mala practica
    const url = '/get' + valor;
    const res = await fetch(url);
    const filasDeCategoria = await res.json();

    rederizarFilasDeCategorias(filasDeCategoria, valor);

});

const rederizarFilasDeCategorias = (data, tipo) => {

    const div = document.getElementById('tabla');
    div.classList.remove('container')
    //creo la tabla
    div.innerHTML = `<table id="table" class="table table-responsive text-center table-bordered m-4">
            <thead id="thead" class="thead-dark">
                <tr>
                    <th scope="col">${(tipo==="Persona")? "RUT":"id"}</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Buscar sus Productos</th>
                </tr>
            </thead>
            <tbody id="tbody">
                
                </tbody>
        </table>`;
    const table = document.getElementById('tbody');
    //agrego las filas
    for (let i = 0; i < data.key.length; i++) {
        const idRow = data.key[i];
        const textRow = data.text[i];
        const Newrow = table.insertRow(-1);
        Newrow.insertCell(0).textContent = idRow;
        Newrow.insertCell(1).textContent = textRow;
        const cell = Newrow.insertCell(2)
        cell.innerHTML = `<button class="btn-btn button">Buscar</button>`;
        cell.children[0].addEventListener('click', async()=>{
            await PedirProductosDeCategoria(idRow, tipo);
        });

        const PedirProductosDeCategoria = async (id, tipo)=>{
            
            const params = new URLSearchParams({id, tipo})
            //pedir productos de la categoria pasada por parametros
            const response = await fetch('/getProductos/?'+ params.toString());
            const data =  await response.json();

            if(data.error){
                alert('datos no encontrados');
                return
            }
            //con los datos de los productos de la categoría selecionada, agrego las filas a la tabla
            renderizarTablaProductos(data, tipo)


        }
        const renderizarTablaProductos = (data, tipo)=>{
            const div = document.getElementById('tabla');
            div.classList.add('container')

            //tabla que contendrá los productos (sobre-escribo la tabla anterior)
            div.innerHTML = `<table id="table" class="row justify-content-center table table-responsive text-center table-bordered p-4">
                <thead id="thead" class="thead-dark">
                    <tr>
                        <th scope="col">Números</th>
                        <th scope="col">Tipo Especie</th>
                        <th scope="col">Descripción</th>
                        <th scope="col">Encargado</th>
                        <th scope="col">Rubro</th>
                        <th scope="col">Ubicación</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col" id="columna">Precio</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                
                </tbody>
            </table>
            <div class="text-center">
                <button id="transferir" class="btn btn-info">Transferir productos</button>
                <button id="enviarT" class="btn btn-info d-none">Procesar transferencia</button>
            </div>
            `;

            
            const table = document.getElementById('tbody');

            //agrego las filas a la tabla
            for (let i = 0; i < data.length; i++) {
                
                const min = data[i].MIN;
                const max = data[i].MAX;
                const especie = data[i].ESPECIE;
                const descripcion = data[i].DESCRIPCION;
                const encargado = data[i].ENCARGADO;
                const rubro = data[i].RUBRO;
                const ubicacion = data[i].UBICACION;
                const cantidad = data[i].CANTIDAD;
                const precio = data[i].PRECIO;
                const filaProductoCategoria = table.insertRow(-1);
                filaProductoCategoria.insertCell(0).textContent = `${min} - ${max}`;
                filaProductoCategoria.insertCell(1).textContent = especie;
                filaProductoCategoria.insertCell(2).textContent = descripcion;
                filaProductoCategoria.insertCell(3).textContent = encargado;
                filaProductoCategoria.insertCell(4).textContent = rubro;
                filaProductoCategoria.insertCell(5).textContent = ubicacion;
                filaProductoCategoria.insertCell(6).textContent = cantidad;
                filaProductoCategoria.insertCell(7).textContent = precio;
            }

            // si es persona o ubicación se debe agregar la funcionalidad "transferir productos"
            if(tipo==='Persona' || tipo==='Ubicacion'){
                const boton = document.querySelector('#transferir');

                boton.addEventListener('click', async ()=>{

                
                    document.querySelector('#columna').textContent = 'Transferir';
        
                    const tbody = document.querySelector('tbody');
        
                    //sobreescribo la columna precio para que ahí se agrege la cantidad de elementos a transferir
                    
                    for (let i = 0; i < tbody.rows.length; i++) {
                        tbody.rows[i].children[7].innerHTML='<input type="number" placeholder="Cantidad" class="form-control" min="1" step="1" autocomplete="off">'
                    }
                    //quito el boton de transferencia porque ya estoy en eso
                    boton.remove();

                    //boton para enviar los datos para que se procesen
                    const botonEnviar = document.querySelector('#enviarT');

                    //evento de validar cantidades y procesar operación
                    botonEnviar.addEventListener('click',async ()=>{

                        const selectTrans = document.querySelector('#SelectPersonas');
                            
                        const valueSelect = selectTrans.options[selectTrans.selectedIndex].value;

                        //valido que el valor del select donde especifica el destino
                        if(valueSelect==='-'){
                            alert(`Por favor ingrese una ${tipo}`);
                            return;
                        }
                
                        //validar cantidades ingresadas por el usuario (columna Transferir)
                        const tbody = document.querySelector('tbody');
                        let datos = [];
                        for (let i = 0; i < tbody.rows.length; i++) {
                            const id = parseInt(tbody.rows[i].children[0].textContent.split('-')[0].trim());
                            const cantidad = parseInt(tbody.rows[i].children[6].textContent.trim());

                            
                            const valor = tbody.rows[i].children[7].children[0].value;

                            const valorNro = (valor==="")?0:parseInt(tbody.rows[i].children[7].children[0].value);
                            
                            if(isNaN(valorNro)){
                                alert('datos de cantidad ingresados no son correctos, verifique que las cantidades ingresadas sean validas');
                                return;
                            }

                            if(valorNro>cantidad){
                                alert('datos de cantidad ingresados son mayores que la cantidad total')
                                return;
                            }
                            
                            datos.push({id, cantidad: valorNro, tipo, idDestino: valueSelect});
                        }
                        
                        //envío los datos al backend
                        const url = '/transferencia';

                        const res = await fetch(url, {
                            method: 'POST',
                            body: JSON.stringify(datos),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        //recibo la respuesta y la proceso
                        const respuesta = await res.text();
                        if(respuesta.error){
                            alert(respuesta.error);
                            return
                        }
                        alert('Éxito');
                        //recargo la pagina
                        window.location.href = '/search';
                    });
                    
                    //muestro el boton "enviar transferencia"
                    botonEnviar.classList.remove('d-none');

                    //select donde se deberá seleccionar el destinatario de la transferencia (puede ser persona o ubicación)
                    const divParaSelectPersona = document.createElement('div')
                    divParaSelectPersona.innerHTML = `<div class="form-group">
                        <label for="Tipo">Ingrese ${tipo}:</label>
                        <select class="form-control" id="SelectPersonas">
                            <option value="-">Opción</option>
                        </select>
                    </div>   `
                
                    //agrego el select al DOM
                    div.appendChild(divParaSelectPersona)

                    const select = document.getElementById("SelectPersonas");

                         
                    //Obtengo los datos de todas las personas o ubicaciones para agregarlas al select
                    const url = `/get${tipo}`;
                    const res = await fetch(url);
                    const result = await res.json();

                    for (let i = 0; i < result.key.length; i++) {
                        const key = result.key[i];
                        const text = result.text[i];
                        const option = document.createElement('option');
                        option.value = key;
                        option.text = text;
                        select.appendChild(option);
                    }
                });

                
            }

        }
    }
    
}