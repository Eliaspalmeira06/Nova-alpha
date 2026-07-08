const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// BASE DE DATOS
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'control_armamento_nfc',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// VERIFICAR CONEXIÓN
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado a MySQL correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error conectando a MySQL:', error.message);
    console.log('⚠️ Verifica que XAMPP/MySQL esté corriendo');
  }
}
testConnection();

// ENDPOINTS DE PERSONAL

// Obtener todo el personal
app.get('/api/personal', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, 
             j.NOMBRE_JERARQUIA as JERARQUIA_NOMBRE, 
             c.NOMBRE_COMPANIA as COMPANIA_NOMBRE
      FROM personal_militar p
      JOIN jerarquias j ON p.ID_JERARQUIA = j.ID_JERARQUIA
      JOIN companias c ON p.ID_COMPANIA = c.ID_COMPANIA
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/personal:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/personal/:cedula', async (req, res) => {
  try {
    const { cedula } = req.params;
    const [rows] = await pool.query(`
      SELECT p.*, 
             j.NOMBRE_JERARQUIA as JERARQUIA_NOMBRE, 
             c.NOMBRE_COMPANIA as COMPANIA_NOMBRE
      FROM personal_militar p
      JOIN jerarquias j ON p.ID_JERARQUIA = j.ID_JERARQUIA
      JOIN companias c ON p.ID_COMPANIA = c.ID_COMPANIA
      WHERE p.CEDULA = ?
    `, [cedula]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Personal no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en /api/personal/:cedula:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/personal', async (req, res) => {
  try {
    const { CEDULA, ID_JERARQUIA, NOMBRE, APELLIDO, CONTINGENTE, ID_COMPANIA, TELEFONO } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO personal_militar 
       (CEDULA, ID_JERARQUIA, NOMBRE, APELLIDO, CONTINGENTE, ID_COMPANIA, TELEFONO)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [CEDULA, ID_JERARQUIA, NOMBRE, APELLIDO, CONTINGENTE, ID_COMPANIA, TELEFONO]
    );
    
    res.status(201).json({ 
      message: 'Personal creado exitosamente',
      CEDULA 
    });
  } catch (error) {
    console.error('Error en POST /api/personal:', error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINTS DE ARMAS

app.get('/api/armas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM armas');
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/armas:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/armas/:serial', async (req, res) => {
  try {
    const { serial } = req.params;
    const [rows] = await pool.query('SELECT * FROM armas WHERE SERIAL_ARMA = ?', [serial]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en /api/armas/:serial:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/armas/nfc/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const [rows] = await pool.query('SELECT * FROM armas WHERE TAG_NFC = ?', [tag]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en /api/armas/nfc/:tag:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/armas/:serial/estado', async (req, res) => {
  try {
    const { serial } = req.params;
    const { estado } = req.body;
    
    const [result] = await pool.query(
      'UPDATE armas SET ESTADO_DISPONIBILIDAD = ? WHERE SERIAL_ARMA = ?',
      [estado, serial]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }
    
    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error en PATCH /api/armas/:serial/estado:', error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINTS DE MOVIMIENTOS

app.post('/api/movimientos', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      TIPO_MOVIMIENTO,
      ID_CEDULA_PERSONAL,
      SERIAL_ARMA,
      CANTIDAD_CARGADORES,
      CANTIDAD_MUNICION,
      MOTIVO,
      UID_LECTOR_NFC
    } = req.body;

    if (!TIPO_MOVIMIENTO || !ID_CEDULA_PERSONAL || !SERIAL_ARMA) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const [result] = await connection.query(
      `INSERT INTO movimientos 
       (TIPO_MOVIMIENTO, ID_CEDULA_PERSONAL, SERIAL_ARMA, 
        CANTIDAD_CARGADORES, CANTIDAD_MUNICION, 
        GRUPO_FECHA_HORA, MOTIVO, UID_LECTOR_NFC)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [TIPO_MOVIMIENTO, ID_CEDULA_PERSONAL, SERIAL_ARMA, 
       CANTIDAD_CARGADORES || 0, CANTIDAD_MUNICION || 0, 
       MOTIVO || '', UID_LECTOR_NFC || 'WEB_APP']
    );

    const nuevoEstado = TIPO_MOVIMIENTO === 'ENTRADA' ? 'DISPONIBLE' : 'ASIGNADO';
    await connection.query(
      'UPDATE armas SET ESTADO_DISPONIBILIDAD = ? WHERE SERIAL_ARMA = ?',
      [nuevoEstado, SERIAL_ARMA]
    );

    await connection.commit();
    
    res.status(201).json({ 
      ID_MOVIMIENTO: result.insertId,
      message: 'Movimiento registrado exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error en POST /api/movimientos:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/movimientos/ultimos', async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 50;
    
    const [rows] = await pool.query(`
      SELECT m.*, 
             CONCAT(p.NOMBRE, ' ', p.APELLIDO) as NOMBRE_COMPLETO,
             a.MODELO as MODELO_ARMA
      FROM movimientos m
      JOIN personal_militar p ON m.ID_CEDULA_PERSONAL = p.CEDULA
      JOIN armas a ON m.SERIAL_ARMA = a.SERIAL_ARMA
      ORDER BY m.GRUPO_FECHA_HORA DESC
      LIMIT ?
    `, [limite]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/movimientos/ultimos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT LECTURA NFC

app.post('/api/lectores/procesar', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { tagNFC, tipoMovimiento, uidLector } = req.body;

    const [armaRows] = await connection.query(
      'SELECT * FROM armas WHERE TAG_NFC = ?',
      [tagNFC]
    );

    if (armaRows.length === 0) {
      return res.status(404).json({ error: 'Arma no encontrada' });
    }

    const arma = armaRows[0];

    if (tipoMovimiento === 'SALIDA' && arma.ESTADO_DISPONIBILIDAD === 'ASIGNADO') {
      return res.status(400).json({ error: 'El arma ya está asignada' });
    }

    if (tipoMovimiento === 'ENTRADA' && arma.ESTADO_DISPONIBILIDAD === 'DISPONIBLE') {
      return res.status(400).json({ error: 'El arma ya está disponible' });
    }

    let cedulaPersonal = null;
    if (tipoMovimiento === 'ENTRADA') {
      const [ultimoMovimiento] = await connection.query(
        `SELECT ID_CEDULA_PERSONAL FROM movimientos 
         WHERE SERIAL_ARMA = ? AND TIPO_MOVIMIENTO = 'SALIDA'
         ORDER BY GRUPO_FECHA_HORA DESC LIMIT 1`,
        [arma.SERIAL_ARMA]
      );
      if (ultimoMovimiento.length > 0) {
        cedulaPersonal = ultimoMovimiento[0].ID_CEDULA_PERSONAL;
      }
    }

    await connection.commit();

    res.json({
      arma,
      personalCedula: cedulaPersonal,
      message: 'Lectura NFC procesada exitosamente'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error en POST /api/lectores/procesar:', error);
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});


app.get('/api/catalogos/jerarquias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jerarquias ORDER BY ID_JERARQUIA');
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/catalogos/jerarquias:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/catalogos/companias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM companias ORDER BY ID_COMPANIA');
    res.json(rows);
  } catch (error) {
    console.error('Error en /api/catalogos/companias:', error);
    res.status(500).json({ error: error.message });
  }
});

// INICIAR SERVIDOR

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME || 'control_armamento_nfc'}`);
  console.log(`📝 Presiona Ctrl+C para detener`);
});