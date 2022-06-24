const { User } = require("../lib/controllers");
const db = require("./db");

const userC = new User({ db, schema: {} });
let savedUser;

const userData = {
  name: "Test User",
  email: "rahat-test@mailinator.com",
  phone: "9801234567",
  wallet_address: "0x7c0179776BB143a36C9d338F3Fa6149F40BaAc30",
};

describe("User Model Test", () => {
  beforeAll(async () => {
    await db.authenticate();
    await db.sync();
  });

  it("create & save user successfully", async () => {
    savedUser = await userC.add(userData);
    expect(savedUser.first).toBe("Test");
  });

  it("Update user full name", async () => {
    let updatedUser = await userC.updateName(savedUser?.id, "Santosh Shrestha");
    expect(updatedUser.last).toBe("Shrestha");
  });
});
