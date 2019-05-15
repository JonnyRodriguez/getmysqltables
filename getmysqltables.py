import mysql.connector

mydb = mysql.connector.connect(
  database="turing",
  user="root",
  passwd="password",
  raw=False
)

cursor = mydb.cursor()

cursor.execute("SHOW TABLES")

tables = [item[0] for item in cursor.fetchall()]

for table in tables:
  cursor.execute(f'DESC {table}')
  columns = cursor.fetchall() ##[item for item in cursor.fetchall()]
##  for column in columns:
  print(columns)
    ##for key,val in column:
      ##print(f'{key} = {val}')
