const pool = require('../bin/DBconnection');
const express = require('express');
const moment = require('moment');
const router = express.Router();

// Función para obtener los métodos CRUD para una tabla específica
function createCRUDHandlers(tableName) {
  const getTableName = () => tableName;
  /// getallarecords  recupera una tabla
  const getAllRecords = (req, res) => {
    pool.getConnection((err, conexion) => {
      if (err) {
        res.send('Error de conexión: ' + err.message);
      } else {
        const sql = `SELECT * FROM ${getTableName()};`;

        conexion.query(sql, (err, resultado) => {
          if (err) {
            res.send('Error en consulta: ' + err.message);
          } else {
            res.render('index', { datos: resultado, tableName: getTableName() });
          }
        });

        conexion.release();
      }
    });
  };

  const getNewRecordForm = (req, res) => {
    res.render(`nueva${getTableName()}`);
  };

  const addNewRecord = (req, res) => {
    const fields = Object.keys(req.body);
    const values = fields.map((field) => req.body[field]);

    pool.getConnection((err, conexion) => {
      if (err) {
        res.send('Error de conexión: ' + err.message);
      } else {
        const sql = `INSERT INTO ${getTableName()} (${fields.join(', ')}) VALUES (${Array(fields.length).fill('?').join(', ')});`;

        conexion.query(sql, values, (err, resultado) => {
          if (err) {
            res.send('Error al agregar entrada: ' + err.message);
          } else {
            res.redirect('/exito');
          }
        });

        conexion.release();
      }
    });
  };
  const getDeleteConfirmation = (req, res) => {
    const recordId = req.params.id;
  
    pool.getConnection((err, conexion) => {
      if (err) {
        res.send('Error de conexión: ' + err.message);
      } else {
        const sql = `SELECT * FROM ${getTableName()} WHERE id = ?;`;
        const values = [recordId];
  
        conexion.query(sql, values, (err, resultado) => {
          if (err) {
            res.send('Error en consulta: ' + err.message);
          } else {
            if (resultado.length > 0) {
              res.render(`eliminar${getTableName()}`, { record: resultado[0] });
            } else {
              res.send(`Entrada de ${getTableName()} no encontrada`);
            }
          }
        });
  
        conexion.release();
      }
    });
  };
  
  const deleteRecord = (req, res) => {
    const recordId = req.params.id;
  
    pool.getConnection((err, conexion) => {
      if (err) {
        res.send('Error de conexión: ' + err.message);
      } else {
        const sql = `DELETE FROM ${getTableName()} WHERE id = ?;`;
        const values = [recordId];
  
        conexion.query(sql, values, (err, resultado) => {
          if (err) {
            res.send(`Error al eliminar entrada de ${getTableName()}: ` + err.message);
          } else {
            res.redirect('/');
          }
        });
  
        conexion.release();
      }
    });
  };
  // Otros métodos CRUD pueden seguir la misma estructura

  return {
    getAllRecords,
    getNewRecordForm,
    addNewRecord,
    getDeleteConfirmation,
    deleteRecord

    // Otros métodos CRUD pueden agregarse aquí
  };
    // consultas edita

}

//  eliminar 




router.get('/exito', (req, res) => {
  res.render('exito');
});
// Crear handlers CRUD para la tabla t_personal
const personalCRUDHandlers = createCRUDHandlers('t_personal');

// Rutas para la tabla t_personal

router.get('/', personalCRUDHandlers.getAllRecords);
router.get('/nuevat_personal', personalCRUDHandlers.getNewRecordForm);
router.post('/nuevat_personal', personalCRUDHandlers.addNewRecord);
router.post('/eliminart_personal',personalCRUDHandlers.getDeleteConfirmation);




// Añade otras rutas CRUD según sea necesario

// Puedes crear handlers CRUD para otras tablas de la misma manera
// const otraTablaCRUDHandlers = createCRUDHandlers('nombre_otra_tabla');
// router.get('/otra-ruta', otraTablaCRUDHandlers.getAllRecords);
// ...

module.exports = router;
