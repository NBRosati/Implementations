
// Creo del servidor
const express = require('express');
require('dotenv').config();



// Creo el puerto que escuche las peticiones de HTTP y las otras variables
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



// Conexion a la base de datos
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



// Creo los middlewares (antes de las rutas, siempre)
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));




// Seteo el motor de plantilla
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));




// Creo rutas para el cliente
//LOGIN
app.get('/login', (req, res) =>{
    res.render('login',{
        titulo: "NBR"
    })
});



//Validacion de ingreso
app.post('/login', (req, res) => {
    const { usuario, pass } = req.body;
    
    if (usuario == "" && pass == "") {
        res.render("login")
    }
    
    conexion.execute(
        'SELECT * FROM Usuarios WHERE Usuario = ? AND Pass = ?',
        [usuario, pass],
        function(err, result, fields) {
            if (result.length === 0) {
                res.render("login")
            } else {
                respuestaUsuario = result[0].Usuario
                respuestaPass = result[0].Pass

                if (respuestaUsuario == usuario && respuestaPass == pass)
                    res.render("principal")
                else
                    res.render("login")
            }
        })
});



//PRINCIPAL
app.get('/principal', (req, res) =>{
    res.render('principal',{
        titulo: "NBR"
    })
});

app.post('/principal', (req, res) => {
    const { Cod, Vel, Dyn, Dry, InkS, InkN, Ani, Tap } = req.body;
    
        
if (Cod == '' || Vel== '' || Dyn== '' || Dry== '' || InkS== '' || InkN== '' || Ani== '' || Tap== '') {
    let validacion = 'Rellene los campos correctamente.';
            res.render('principal', {
            Titulo: 'NBR',
            validacion
    })
    }  else {

        let datos = 
            [Cod, Vel, Dyn, Dry, InkS, InkN, Ani, Tap];

        let sql = "INSERT INTO RegistroFijo \
                    (CodProfile, VelMperMin, DynasMat, DryBetweenCol, InkSupplier, InkName, AniloxSupplier, TapeSupplier) \
                    values (?,?,?,?,?,?,?,?)";

        conexion.query(sql, datos, (err, result) => {
            if (err) throw err;
            
            res.render('mails', {
                titulo: 'Envios de mails'
            });
        })

    }
});


//MAILS
app.get('/mails', (req, res) =>{
    res.render('mails',{
        titulo: "NBR"
    })
});

app.post('/mails', (req, res) => {
    const { mailclient } = req.body;
    let fecha = new Date();
    let dia = fecha.getDate();

    if (mailclient == '' ) {
        let validacion = 'Rellene el correo';

        res.render('mails', {
            Titulo: 'El correo fue enviado',
            validacion
        });
    }

    envioMail(mailclient, fecha, dia);

    res.render('principal');
});

function envioMail(mailclient, fecha, dia) {

    let transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USEREMAIL, 
            pass: process.env.PASSWORDMAIL,
        }
    });
    
    const sql = "SELECT * FROM RegistroFijo";
    conexion.query(sql, (err, result, fields) => {
        if (err) throw err;
        
        transporter.sendMail({
            from: process.env.USEREMAIL, 
            to: mailclient,
            subject: 'Implementación del Fingerprint',
            html: `Implementación del Fingerprint ${JSON.stringify(result)} ${fecha} ${dia}`
        }, (err) => {
            if (err) return console.log(err.message);
    
            console.log("Se mandó email de verificación")
        })
    })
};


//INFORMATION
app.get('/information', (req, res) => {
    let sql = 'SELECT * FROM registrofijo';
        conexion.query(sql, (err, result) => {
            if (err) throw err;
            res.render('information', {
                titulo:'Info. of the profiles',
                results: result,
            });
        });
});






//ABOUT
app.get('/about', (req, res) =>{
    res.render('about',{
        titulo: "NBR"
    })
});






// Defino un indicador de errores
app.on('error',(error) =>{
    console.log('Tenemos un error en' + error);
});




// Servidor que escucha el puerto definido
app.listen(PORT, ()=> {
console.log('Servidor Corriendo')
});