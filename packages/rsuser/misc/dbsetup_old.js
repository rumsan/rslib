module.exports = (columns = {}) => {
  columns.users =
    columns.users && columns.users.length > 0 ? columns.users.join() + "," : "";
  columns.auths =
    columns.auths && columns.auths.length > 0 ? columns.auths.join() + "," : "";
  columns.roles =
    columns.roles && columns.roles.length > 0 ? columns.roles.join() + "," : "";

  return `CREATE TABLE IF NOT EXISTS "tblUsers"(
            id int NOT NULL,
            uuid UUID NOT NULL,
            first  VARCHAR(255),
            mid VARCHAR(255),
            last VARCHAR(255),
            salutation VARCHAR(255),
            suffix VARCHAR(255),
            email VARCHAR(255),
            phone VARCHAR(255),
            gender CHAR(1),
            wallet_address VARCHAR(255),
            is_approved BOOLEAN,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            ${columns.users}
            PRIMARY KEY (id),
            name VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS "tblAuths"(
            id int NOT NULL,
            user_id INTEGER NOT NULL,
            service VARCHAR(255),
            service_id VARCHAR(255),
            password JSON,
            details JSON,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            ${columns.auths}
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES "tblUsers"(id)
        );

        CREATE TABLE IF NOT EXISTS "tblRoles"(
            id int NOT NULL,
            name VARCHAR(255),
            permissions  VARCHAR(255),
            expiry_date TIMESTAMP,
            is_system BOOLEAN,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            ${columns.roles}
            PRIMARY KEY (id)
        );`;
};
