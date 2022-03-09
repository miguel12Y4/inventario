const express = require('express');process.env.Po
const path = require('path');

//inicio de express
const app = express();


//configuración
app.set('port', 5001);
app.set('views', path.join(__dirname, 'views'));
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.json());

//middlewares


//routes
app.use(require('./routes/index'));
app.use(require('./routes/addData'));
app.use(require('./routes/getInfo'));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//escucha del servidor
app.listen(app.get('port'), ()=>{
    console.log('servidor en puerto ' +app.get('port'));
});


