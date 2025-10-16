# Script para criar o banco de dados PostgreSQL automaticamente
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

config = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': 'root',
    'host': 'localhost',
    'port': '5432'
}

db_to_create = "trust_process"

conn = None 

try:
    conn = psycopg2.connect(**config)
    
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    
    cursor = conn.cursor()

    cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_to_create,))
    exists = cursor.fetchone()

    if not exists:
        cursor.execute(f"CREATE DATABASE {db_to_create} ENCODING 'UTF8' TEMPLATE template0;")
        print(f"Banco de dados '{db_to_create}' criado com sucesso!")
    else:
        print(f"Banco de dados '{db_to_create}' já existe.")

except psycopg2.Error as err:
    print(f"Erro: {err}")
finally:
    if conn is not None:
        cursor.close()
        conn.close()