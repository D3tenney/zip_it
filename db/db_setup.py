import sqlite3

sql_con = sqlite3.connect('./zipcode_db.sqlite')

ZIP_FILENAME = './zip_data/uszips.csv'

TABLE_NAME = 'zipcode'

CREATE_TABLE = f"""
               CREATE TABLE {TABLE_NAME} (
                 zip TEXT PRIMARY KEY,
                 lat TEXT,
                 lng TEXT,
                 city TEXT,
                 state_id TEXT,
                 state_name TEXT,
                 zcta TEXT,
                 parent_zcta TEXT,
                 population TEXT,
                 density TEXT,
                 county_fips TEXT,
                 county_name TEXT,
                 county_weights TEXT,
                 county_names_all TEXT,
                 county_fips_all TEXT,
                 imprecise TEXT,
                 military TEXT,
                 timezone TEXT
               );
               """

sql_con.execute(CREATE_TABLE)

id_count = 0
with open(ZIP_FILENAME, 'r') as f:
    for line in f:
        # skip headers in first row
        if id_count == 0:
            id_count += 1
            continue
        insert_stmt = f"INSERT INTO {TABLE_NAME} VALUES ({line});"
        sql_con.execute(insert_stmt)
        id_count += 1
sql_con.commit()
