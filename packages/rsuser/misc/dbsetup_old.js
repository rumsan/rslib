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
            walletAddress VARCHAR(255),
            isApproved BOOLEAN,
            ${columns.users}
            PRIMARY KEY (id),
            name VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS "tblAuths"(
            id int NOT NULL,
            userId INTEGER NOT NULL,
            service VARCHAR(255),
            serviceId VARCHAR(255),
            password JSON,
            details JSON,
            ${columns.auths}
            PRIMARY KEY (id),
            FOREIGN KEY (userId) REFERENCES "tblUsers"(id)
        );

        CREATE TABLE IF NOT EXISTS "tblRoles"(
            id int NOT NULL,
            name VARCHAR(255),
            permissions  VARCHAR(255),
            expiry_date TIMESTAMP,
            is_system BOOLEAN,
            ${columns.roles}
            PRIMARY KEY (id)
        );`;
};
