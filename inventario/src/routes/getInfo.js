//rutas para mostrar los datos

const express = require('express');

const router = express.Router();

const pool = require('../database');

//Obtener datos de todas las ubicaciones

router.get('/get', (req, res)=>{
    res.send('llego');
})

router.get('/getUbicacion', (req, res)=>{
    pool.query('SELECT * FROM UBICACION', (error, results) => {
        let data = { key : [], text : [], error :''};
        if (error) {
            data.error = 'Se produjo un error';
        };
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});



//Obtener datos de todas las Personas
router.get('/getPersona', (req, res)=>{
    pool.query('SELECT * FROM ENCARGADO', (error, results) => {
        if (error) {
            data.error = 'Se produjo un error';
        };
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.RUT);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});

//Obtener datos de todoss los rubros
router.get('/getRubro', (req, res)=>{
    pool.query('SELECT * FROM RUBRO', (error, results) => {
        if (error) {
            data.error = 'Se produjo un error';
        };
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);
        });
        res.send(data);
    });
});

//Obtener datos de todas las Especies
router.get('/getEspecie', (req, res)=>{
    pool.query('SELECT * FROM ESPECIE', (error, results) => {
        if (error) {
            data.error = 'Se produjo un error';
        };
        let data = { key : [], text : []};
        results.forEach(element => {
            data.key.push(element.ID);
            data.text.push(element.NOMBRE);

        });
        res.send(data);
    });
});


//muesta los productos de cada categoria dado los datos de su instancia de categoria y categoria(ej: D instancia de Rubro, Miguel de encargado, etc)
router.get('/getProductos', (req, res) =>{
    //agregar try y catch


    const id = req.query.id;
    const tipo = req.query.tipo;


    let consulta = '';

    //Más adelante se podria crear un procdemiento en la BD para esta consulta ya que es mas compleja
    if(tipo==="Persona"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE  EN.RUT = ? GROUP BY FECHA, P.RUT_ENCARGADO, ID_UBICACION;';
    
    }else if(tipo==="Especie"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE E.ID = ? GROUP BY FECHA, P.RUT_ENCARGADO, ID_UBICACION;';
    
    }else if(tipo==="Rubro"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE R.ID = ? GROUP BY FECHA, P.RUT_ENCARGADO, ID_UBICACION;';
    
    }else if(tipo==="Ubicacion"){
        consulta = 'SELECT P.FECHA, COUNT(P.FECHA) AS CANTIDAD, MAX(P.ID) AS MAX, MIN(P.ID) AS MIN, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE U.ID = ? GROUP BY FECHA;';
    
    }

    //validar datos

    if(id===undefined || consulta==='' || tipo===undefined){
        res.send({error : "Problema con los datos tipo y id"});
        return
    }

    //ejecutar consulta
    pool.query(consulta,[id], (error, results) => {
        if (error) {
            console.log('se produjo un error 104');
        };
        res.send(results);
    });
}); 


//obtener productos dado su numero o rango de numeros 
router.get('/getProductosPorId', (req, res) =>{
    
    const tipo = req.query.tipo;


    //Más adelante podria crear un procdemiento en la BD para esta consulta ya que es mas compleja
    //consulta para busqueda por rango
    if(tipo==='2'){
        if(req.query.idMin && req.query.idMax){
            const consulta = 'SELECT P.FECHA, E.NOMBRE as ESPECIE,  P.DESCRIPCION,  MIN(P.ID) AS ID_MIN, MAX(P.ID) AS ID_MAX, COUNT(P.FECHA) AS CANTIDAD, P.PRECIO, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE  P.ID >= ? AND P.ID <= ? GROUP BY FECHA, P.RUT_ENCARGADO, ID_UBICACION;';
    
            pool.query(consulta,[parseInt(req.query.idMin), parseInt(req.query.idMax)], (error, results) => {
                if (error) {

                    console.log('se produjo un error 122');
                };

                res.send(results);
            });
        }

        //consulta para busqueda por numero especifico
    }else if(tipo==='1'){
        if(req.query.id){
            const consulta = 'SELECT P.ID, P.DESCRIPCION, P.PRECIO, E.NOMBRE as ESPECIE, U.NOMBRE AS UBICACION, R.NOMBRE as RUBRO, EN.NOMBRE as ENCARGADO FROM PRODUCTO as P LEFT OUTER JOIN UBICACION as U ON P.ID_UBICACION=U.ID LEFT OUTER JOIN ESPECIE as E ON P.ID_ESPECIE=E.ID LEFT OUTER JOIN RUBRO as R ON P.ID_RUBRO=R.ID LEFT OUTER JOIN ENCARGADO as EN ON P.RUT_ENCARGADO=EN.RUT WHERE  P.ID = ? ORDER BY P.ID;';
            const id = req.query.id;
            pool.query(consulta,[req.query.id], (error, results) => {
                if (error) {
                    console.log('se produjo un error 134');
                };
                res.send(results);
            });
        }
    }   
    
    
}); 




//
router.get('/search', (req, res)=>{
    res.render('search');
});

router.get('/searchId', (req, res)=>{
    res.render('searchId');
});


module.exports = router;