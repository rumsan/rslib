const db = require("./db");
const { Role } = require("../src/controllers");

const role = new Role({ db, schema: {} });

let createdRole;

const roleData = {
  name: "Role",
  permissions: ["artist_read", "artist_write", "artist_admin", "artist_remove"],
};

describe("Role Model/Controller Test", () => {
  beforeAll(async () => {
    await db.authenticate();
    await db.sync();
  });

  it("should create a new role", async () => {
    createdRole = await role.add(roleData);
    expect(createdRole.name).toBe("Role");
  });

  it("should add a new permission to a role", async () => {
    const updatedRole = await role.addPermission({
      name: createdRole?.name,
      permissions: "artist_admin_new",
    });
    expect(updatedRole.permissions).toContain("artist_admin_new");
  });

  it("should list all roles", async () => {
    const roles = await role.list();
    expect(roles.length).toBe(1);
  });

  it("should list all permissions of a role", async () => {
    const permissions = await role.listPermissions(createdRole?.name);
    expect(permissions).toContain("artist_admin");
  });

  it("should remove a permission from a role", async () => {
    const updatedRole = await role.removePermission({
      id: createdRole?.id,
      permissions: "artist_admin_new",
    });
    expect(updatedRole.permissions).not.toContain("artist_admin_new");
  });

  it("should remove a role", async () => {
    const removedRole = await role.remove(createdRole?.id);
    expect(removedRole).toBe(1);
  });
});
