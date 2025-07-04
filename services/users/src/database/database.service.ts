import { Injectable, OnModuleInit } from '@nestjs/common';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';

interface DatabaseUser {
  id: number;
  nombre: string;
  email: string;
  password: string;
  created_at: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: sqlite3.Database;

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // La base de datos se ubicará en la raíz del monorepo
      const dbPath = path.join(__dirname, '../../../../../users.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error al conectar con la base de datos:', err);
          reject(err);
        } else {
          console.log('Conectado a la base de datos SQLite');
          this.createUsersTable().then(resolve).catch(reject);
        }
      });
    });
  }

  private async createUsersTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      this.db.run(sql, (err) => {
        if (err) {
          console.error('Error al crear la tabla users:', err);
          reject(err);
        } else {
          console.log('Tabla users creada o ya existe');
          resolve();
        }
      });
    });
  }

  async createUser(
    nombre: string,
    email: string,
    hashedPassword: string,
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)';

      this.db.run(sql, [nombre, email, hashedPassword], function (err) {
        if (err) {
          console.error('Error al crear usuario:', err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | undefined> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';

      this.db.get(sql, [email], (err, row: DatabaseUser) => {
        if (err) {
          console.error('Error al buscar usuario por email:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getUserById(id: number): Promise<DatabaseUser | undefined> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';

      this.db.get(sql, [id], (err, row: DatabaseUser) => {
        if (err) {
          console.error('Error al buscar usuario por ID:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}
