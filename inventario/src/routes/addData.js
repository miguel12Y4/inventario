//rutas para añadir informacion

const express = require('express');

const router = express.Router();

const pool = require('../database');


router.get('/addProduct', (req, res) => {
    res.render('addProducto', {title : "Agregar productos"});
});

router.post('/addProduct', (req, res) => {
    const { productos } = req.body;

    const productosIndividuales = [];

    //itero sobre todos los elementos para obtener todas las tuplas
    productos.forEach(element => {
        for (let i = 0; i < element.cantidad; i++) {
            productosIndividuales.push(
                [
                    element.descripcion,
                    element.precio,
                    element.observacion ,
                    element.especie,
                    element.rubro,
                    element.ubicacion,
                    element.encargado,
                    element.fecha
                ]
            );

        }
    });

    let id = [];

    pool.query('INSERT INTO PRODUCTO(DESCRIPCION, PRECIO, OBSERVACION, ID_ESPECIE, ID_RUBRO, ID_UBICACION, RUT_ENCARGADO, FECHA) VALUES ?', [productosIndividuales], (error, results) => {
        if (error) if (error){
            res.send({error:'Hay un error, reintentelo más tarde'}); 
            return 
        };
    
        let top = results.insertId;
        
        //envio los id para que los muestre la tabla en el frontend (solo los calculé porque la base de datos solo retorna el id inicial o final (no recuerdo bien ahora))
        for(let i=0; i<productos.length; i++){
            
            let d = `${top} - ${top + parseInt(productos[i].cantidad - 1)}`;
            if(parseInt(productos[i].cantidad)===1) {
                d = top;
            }
            top = top+parseInt(productos[i].cantidad);
            id.push(d);
        }
        res.send({ ids: id });
    });
});




//Agregar Persona

router.get('/addPersona', (req, res) => {
    res.render('addPersona', {title : "Agregar Persona"});
});
router.post('/addPersona', (req, res) => {
    const data = req.body;
    const datos = [data.rut, data.nombre]
    pool.query('INSERT INTO ENCARGADO(RUT, NOMBRE) VALUES (?);', [datos], (error, results) => {
        let status = 'Persona agregada'
        if (error){
            if(error.code==='ER_DUP_ENTRY'){
                status = 'Rut ingresado ya esta en el sistema';
            }
            status = 'Hay un error, reintentelo más tarde'; 
        }
        res.send(status);
    });
    
});    

//Agregar Especie
router.get('/addEspecie', (req, res) => {
    res.render('addEspecie', {title : "Agregar Especie"});
});

router.post('/addEspecie', (req, res) => {
    const data = req.body;
    pool.query('INSERT INTO ESPECIE(NOMBRE) VALUES (?);', [data.nombre], (error, results) => {
        let status = 'Especie agregada';
        if (error){
            status = 'Hay un error, reintentelo más tarde'; 
        }
        res.send(status);
    });
});


//Agregar Rubro
router.get('/addRubro', (req, res) => {
    res.render('addRubro', {title : "Agregar Rubro"});
});
router.post('/addRubro', (req, res) => {
    const data = req.body;
    pool.query('INSERT INTO RUBRO (NOMBRE) VALUES (?);', [data.nombre], (error, results) => {
        let status = 'Rubro agregado';
        if (error){
            status = 'Hay un error, reintentelo más tarde'; 
        }
        res.send(status);
    });
});


//agregar Ubicación
router.get('/addUbicacion', (req, res) => {
    res.render('addUbicacion', {title : "Agregar Ubicacion"});
});
router.post('/addUbicacion', (req, res) => {
    const data = req.body;
    pool.query('INSERT INTO UBICACION(NOMBRE) VALUES (?);', [data.nombre], (error, results) => {
        let status = 'Ubicación agregada';
        if (error){
            status = 'Hay un error, reintentelo más tarde'; 
        }
        res.send(status);
    });
});


//ruta para transferir productos de una persona a otra o una ubicacion a otra
router.post('/transferencia', (req, res) => {
    const datos = req.body;
    let ids = [];

    if(datos[0].tipo != "Persona" && datos[0].tipo != "Ubicacion"){
        res.send({error: 'tipo de categoria es invalida'})
    }

    for (let j = 0; j < datos.length; j++) {
        for (let i = 0; i < datos[j].cantidad; i++) {
            ids.push(datos[j].id + i);
        }
    }
    const idsACambiar = ids.map(e => '('+e+')').join('');

    const idDestino = datos[0].idDestino;


    if(datos[0].tipo === 'Persona'){
        pool.query("UPDATE PRODUCTO SET RUT_ENCARGADO = ? WHERE ? LIKE  CONCAT('%(', ID , ')%');", [idDestino, idsACambiar], (error, results) => {
            let status = 'Productos transferidos de encargado correctamente';
            if (error){
                status = 'Hay un error, reintentelo más tarde'; 
            }
            res.send(status);
        });
    }else{
        pool.query("UPDATE PRODUCTO SET ID_UBICACION = ? WHERE ? LIKE  CONCAT('%(', ID , ')%');", [idDestino, idsACambiar], (error, results) => {
            let status = 'Productos transferidos de ubicación correctamente';
            if (error){
                status = 'Hay un error, reintentelo más tarde';
            }
            res.send(status);
        });
    }

});


module.exports = router;