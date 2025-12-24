/**
 * Generic helper functions.
 *
 * Currently includes:
 * - phone number normalization
 * - JWT generation helper used by auth flows
 */
const jwt = require("jsonwebtoken");

function removeSpacesFromPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return phoneNumber; // Return as is if phoneNumber is undefined, null, or falsy
  }
  return phoneNumber.replace(/\s/g, "");
}

async function generateJWT(response, isRefresh) {
  return (token = jwt.sign(
    {
      id: response.id,
      picture: response.picture,
      name: response.name,
      role: response.role,
      isVerified: response.isVerified,
      isArchived: response.isArchived,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: isRefresh
        ? process.env.JWT_REFRESH_EXPIRATION
        : process.env.JWT_EXPIRATION,
    }
  ));
}

function extractIdFromGoogleUrl(url) {
  const lastIndex = url.lastIndexOf("/");
  const id = url.substring(lastIndex + 1);
  return id;
}
module.exports = {
  removeSpacesFromPhoneNumber,
  generateJWT,
  extractIdFromGoogleUrl,
};
