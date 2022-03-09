const button = document.getElementById('Buscar');

const select = document.getElementById("selectBusqueda");

//evento de select para elegir busqueda por numero o rangos
select.addEventListener('change', (event)=>{
    const div = document.getElementById('campos')

    //2 => busqueda por rangos
    if(event.target.value==='2'){
        div.innerHTML = `<div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="min" placeholder="Número Minimo" class="form-control" autocomplete="off" min="0">
        </div>
        <div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="max" placeholder="Número Maximo" class="form-control" autocomplete="off" min="0">
        </div>  `
        //1=> busque por numero especifico
    }else if(event.target.value==='1'){
        div.innerHTML = `<div class="form-group">
            <label for="Tipo">Ingrese número</label>
            <input type="number" id="numero" placeholder="Número de Producto" class="form-control" autocomplete="off" min="0">
        </div>`
    }else if(event.target.value==='*'){
        div.innerHTML = '';
    }
});

//Al momento de hacer click en el boton Buscar se obtendrá el tipo de categoria y se hará un fetch para obtener sus datos
button.addEventListener('click', async (e) => {
    e.preventDefault();

    const selectBusqueda = document.getElementById("selectBusqueda");
    const valor = selectBusqueda.options[selectBusqueda.selectedIndex].value;
    
    const data = {tipo:'', id:'', idMin:'', idMax:''}

    //accion buscar para cada opcion del select
    if(valor==='1'){
        const numero = document.getElementById('numero');

        //validar que el elemento  no es vacio
        if(numero.value===''){
            alert('ingrese un número');
            return;
        }
        const n = parseInt(numero.value);
        data.tipo = 1;
        data.id = n;
    }else if(valor==='2'){
        const min = document.getElementById('min');
        const max = document.getElementById('max');

        const nMin = parseInt(min.value);
        const nMax = parseInt(max.value);

        //validar rangos           
        if(max.value ==="" && min.value===""){
            alert('Ingrese los 2 rangos');
            return;
        }else if(nMin>nMax){
            alert('Número minimo es mayor al numero Maximo');
            return;
        }
        data.tipo = 2;
        data.idMin = nMin;
        data.idMax = nMax;

    }else if(valor==='*'){
        alert('Selecione una opcion');
        return;
    }

    //preparar datos para solicitar productos segun opcion (numero o rangos)
    let params = '';
    if(valor==='1'){
        params = new URLSearchParams({tipo: data.tipo, id : data.id })
    }else{
        params = new URLSearchParams({tipo: data.tipo, idMin : data.idMin, idMax: data.idMax});
    }
    //pedir productos de la categoria pasada por parametros
    const response = await fetch('/getProductosPorId/?'+ params.toString());
    const productos =  await response.json();

    
    class Table{
        // obtiene y agrega botones al div "pagina" que rendericen 10 rows por cada boton
        static getBotones(data){

            //crear un string con el codigo HTML de una tabla cuyo array esta pasado por parametros
            const getTable = (datos)=>{
                let keys;
                try {
                    keys = Object.keys(datos[0]);
                } catch (error) {
                    alert('No hay productos con ese Número');
                    return '';
                }
                const TableStyle = 'table table-responsive text-center table-bordered table-hover';
                const TheadStyle = 'thead-dark';
                
                return(`<table class='${TableStyle}'><thead class='${TheadStyle}' ><tr>${keys.map(e => `<th>${e}</th>`).join('')} </tr></thead><tbody>${addRow(datos)}</tbody></table>`);
            }
    
            //string con las filas de cada producto
            const addRow  = (data)=>{
                return data.map( rowDic =>`<tr>${Object.values(rowDic).map( dataRow => `<td>${(dataRow === null)?"":dataRow}</td>`).join('')}</tr>`).join('');
            };
    

            //creo elementos button y que modifican en div "tabla" para que al pulsar el boton i muestra 10 rows 
            const tablePaginada = (data) =>{
                let number = parseInt( data.length / 10);
                number+= data.length % 10 >0?1:0;
                //botones contendrá un array de botones para que en cada "pagina" hayan maximo 10 productos
                let botones = []
                //div que contendrá la tabla
                const divTabla = document.createElement('div');
                
                //filtro todos los productos en botones que contendran 10 productos por cada uno
                for (let i = 0; i < number; i++) {
                    let rows = [];
                    let btn = document.createElement('button');
                    btn.textContent = i+1;
                    for (let j = i*10; j < i*10 + 10 && j<data.length; j++) {
                        rows.push(data[j]);
                    }
                    btn.addEventListener('click', ()=>{
                        divTabla.innerHTML = getTable(rows);
                    })
                    if(i===0){
                        divTabla.innerHTML = getTable(rows);
                    }
                    botones.push(btn);
                }

                //div que contendra la tabla y los botones de las otras paginas
                const divPadre = document.createElement('div');
                const divBotones = document.createElement('div');
                 
                //agrego los botones a divBotones
                botones.forEach(element => {
                    divBotones.appendChild(element);
                });

                //estilos 
                divBotones.classList.add('text-center');
                divTabla.classList.add('container');

                //agrego los botones y la tabla a un div padre
                divPadre.appendChild(divBotones);
                divPadre.appendChild(divTabla);

                //retorno el padre (aquí no lo agrego al DOM)
                return divPadre;
            }

            //retorno el divPadre con la tabla y su paginación
            return tablePaginada(data)


        }

    }


    const t = document.querySelector('#tabla');

    if(productos.length === 0){
        alert('no se encontraron productos')
        return
    }
    
    //obtener tabla quitandole la columna FECHA que viene desde la base de datos (por ahora no es necesario mostrar este atributo)
    const tabla = Table.getBotones(productos.map(e=>  {delete e.FECHA; return e}))
    
    //'borro' de productos de la tabla (si es que habia antes)
    t.innerHTML = '';
    //agrego los productos que corresponden a la tabla
    t.appendChild(tabla);
    
    
    
});

