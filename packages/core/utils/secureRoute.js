const { validateJwtToken } = require("./cryptoUtils");

const checkPermissions = (user_perm, access_perm) =>
  user_perm.some((v) => access_perm.indexOf(v) !== -1);

module.exports = (appSecret, routePermissions, request) => {
  if (routePermissions.length === 0) return true;
  const token =
    request.query["access-token"] ||
    request.query.access_token ||
    request.headers["access-token"] ||
    request.headers.access_token;
  if (!token) throw Error("No access token was sent");

  try {
    const t = validateJwtToken(token, appSecret, {
      ip: request.info.clientIpAddress,
    });
    request.currentUser = t.user;
    request.currentUserId = t.userId;
    request.currentUserPermissions = t.permissions;
    if (request.payload) {
      request.payload.currentUser = t.user;
      request.payload.currentUserId = t.userId;
      request.payload.currentUserPermissions = t.permissions;
    }
    const userPerms = t.permissions || [];
    return checkPermissions(userPerms, routePermissions);
  } catch (e) {
    console.log("SecureRoute:", e.message);
    return false;
  }
};
