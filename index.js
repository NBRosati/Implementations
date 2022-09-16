
//1. Creo del servidor
const express = require('express');
require('dotenv').config();


//2. Creo el puerto que escuche las peticiones de HTTP y las otras variables
const app = express();
const path = require('path');
const hbs = require('hbs');
const mysql2 = require('mysql2');
const nodemailer = require('nodemailer');
const exp = require('constants');
const { dirname } = require('path');
const { isReadable } = require('stream');
const { Console } = require('console');
const { setEngine } = require('crypto');
const PORT = process.env.PORT || 8080;



//3. Conexion a la base de datos
const conexion = mysql2.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

conexion.connect(function(err){
    if (err) {
    console.error(`Error en la conexión: ${err.stack}`);
    return;
    }
    console.log("Conectado a la BD");
});


//4. Creo los middlewares (antes de las rutas, siempre)
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));


//5. Seteo el motor de plantilla
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));


    //5.Creo rutas para el cliente
app.get('/login', (req, res) =>{
    res.render('login',{
        titulo: "NBR"
    })
});

app.post('/login', (req, res) => {
    const { usuario, pass } = req.body;
    res.render('cargaexitosa', {
        titulo: 'Su carga ha sido exitosa'})
        
    
        
if (usuario == '' || pass == '') {
        let validacion = 'Rellene los campos correctamente.';
                res.render('login', {
                Titulo: 'Login',
                validacion
        })
        }  else {
    
            let datos = {
                Usuario:usuario, 
                Pass:pass
            };
    
        
            
            
            let sql = 'INSERT INTO Registro set ?';
    
            conexion.query(sql, datos, (err, result) => {
                if (err) throw err;
                res.render('login', {
                    titulo: 'Acceso Conseguido'
                });
            })
    
        }
        
});


//6. Defino un indicador de errores
app.on('error',(error) =>{
    console.log('Tenemos un error en' + error);
});


//3. Servidor que escucha el puerto definido
app.listen(PORT, ()=> {
console.log('Servidor Corriendo')
});