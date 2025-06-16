// src/config.js
export const config = {
    port: process.env.PORT || 3000,


 //  configuración de la BD 
    db_host: 'localhost',
    db_user: 'root',         // o tu usuario de MySQL
    db_password: '',         // o tu contraseña
    db_name: 'LaModerna'     // nombre de la base de datos
};
