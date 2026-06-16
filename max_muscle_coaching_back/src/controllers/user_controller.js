/**
 * User/auth HTTP controllers.
 *
 * Endpoints are mounted in `src/routes/user_route.js` under `/users`.
 * Detailed endpoint docs: `docs/API.md`
 */
const User = require("../models/user_model.js");
const logger = require("../helper/logger");

const { VerificationCode } = require("../models/verification_code.js");
const { Op } = require("sequelize");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  removeSpacesFromPhoneNumber,
  generateJWT,
  extractIdFromGoogleUrl,
} = require("../helper/helper.js");
const { downloadImage, saveImage } = require("../helper/image.js");
const { buildUserProfileAttributes } = require("../helper/user_profile.js");

/**
 * POST /users/renew
 *
 * Uses `refreshTokenVerification` middleware to populate `req.decoded`,
 * then returns a new access token + refresh token.
 */
exports.renewJWT = async (req, res) => {
  try {
    const decodedJwt = req.decoded;
    const client = await User.findByPk(decodedJwt.id);
    const token = await generateJWT(client);
    const refreshToken = await generateJWT(client, true);

    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    logger.error({ err: error, path: req.route.path }, "user controller error");
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /users/signin
 *
 * Supports:
 * - Traditional signin with `email`/`phoneNumber` + `password`
 * - Social signin using `googleId` / `facebookId` / `appleId`
 *
 * Returns a JWT, and optionally a refresh token when `stayLoggedIn` is true.
 */
exports.signIn = async (req, res) => {
  const {
    email,
    phoneNumber,
    facebookId,
    googleId,
    password,
    stayLoggedIn,
    isMobile,
    appleId,
  } = req.body;
  try {
    // Check if user exists
    let formattedPhoneNumber = removeSpacesFromPhoneNumber(phoneNumber);
    const user = await checkUserExists(
      email,
      formattedPhoneNumber,
      googleId,
      facebookId,
      appleId,
      { includeSecrets: true },
    );
    if (!user) {
      return res.status(404).json({ message: "client_not_found" });
    }
    if (googleId && user.googleId != googleId) {
      user.googleId = googleId;
    }
    if (facebookId && user.facebookId != facebookId) {
      user.facebookId = facebookId;
    }
    if (!googleId && !facebookId && (email || formattedPhoneNumber)) {
      // If neither googleId nor facebookId matches, verify traditionally with email and password
      if (!password) {
        return res.status(400).json({ message: "missing_password" });
      }
      const isPasswordValid = user.password
        ? await Bcrypt.compare(password, user.password)
        : undefined;
      if (!isPasswordValid) {
        return res.status(401).json({ message: "invalid_credentials" });
      }
    } else if (!googleId && !facebookId && !appleId) {
      return res.status(400).json({ message: "missing_credentials" });
    }
    let token, refreshToken;

    // if (picture) {
    //   const pictureName = `${extractIdFromGoogleUrl(picture)}.jpg`;
    //   if (user.picture !== pictureName) {
    //     try {
    //       const name = await downloadImage(picture);
    //       await saveImage(pictureName, name, "client");
    //       user.picture = pictureName;
    //     } catch (error) {
    //       console.error("Error downloading image:", error);
    //     }
    //   }
    // }
    // if (!user.isVerified) {
    //   resendConfirmationMail(user, req.hostname);
    // }
    await user.save();

    token = await generateJWT(user);

    if (stayLoggedIn) refreshToken = await generateJWT(user, true);

    return res.status(200).json({ token, refreshToken });
  } catch (error) {
    logger.error({ err: error, path: req.route.path }, "user controller error");
    return res.status(500).json({ message: error.message });
  }
};

// exports.contactUs = async (req, res) => {
//   const { name, body, email, subject, phone } = req.body;
//   if (!name || !body || !email || !subject) {
//     return res.status(401).json({ message: "missing" });
//   }
//   try {
//     const template = await getTemplate(
//       "french",
//       "contactUsMail",
//       email,
//       name,
//       subject,
//       body,
//       phone
//     );
//     const subjectTitle = `${subjectMap["contactUsMail"]["french"]} ${subject}`;
//     sendMail(
//       process.env.CONTACT_USER_EMAIL,
//       subjectTitle,
//       template,
//       req.hostname
//     );
//     sendMail(
//       "reservations@thelandlord.tn",
//       subjectTitle,
//       template,
//       req.hostname
//     );
//     sendMail(
//       "lotfi.lamti@thelandlord.tn",
//       subjectTitle,
//       template,
//       req.hostname
//     );
//     sendMail(
//       "Sarah.benachour@thelandlord.tn",
//       subjectTitle,
//       template,
//       req.hostname
//     );
//     return res.status(200).json({ message: "done" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

exports.signUp = async (req, res) => {
  let { email, phoneNumber, facebookId, picture, googleId, password, appleId } =
    req.body;

  let response;
  let formattedPhoneNumber = removeSpacesFromPhoneNumber(phoneNumber);
  let willSendMail = true;
  try {
    const profileAttributes = buildUserProfileAttributes(req.body);

    // Check if user exists
    const user = await checkUserExists(
      email,
      formattedPhoneNumber,
      googleId,
      facebookId,
      appleId,
    );
    if (user) {
      return res.status(404).json({ message: "client_already_found" });
    }

    if (googleId || facebookId) {
      var newPicture = null;
      willSendMail = false;
      // If the user connects with Google or Facebook, no password is needed
      if (picture) {
        const pictureName = `${extractIdFromGoogleUrl(picture)}.jpg`;
        try {
          const name = await downloadImage(picture);
          await saveImage(pictureName, name, "images/client");
          newPicture = pictureName;
        } catch (error) {
          logger.error({ err: error }, "error downloading user picture");
        }
      }
      response = await User.create({
        email,
        ...profileAttributes,
        phoneNumber: formattedPhoneNumber,
        facebookId,
        googleId,
        appleId,
        picture: newPicture,
        isVerified: true,
      });
    } else if (appleId) {
      willSendMail = false;
      response = await User.create({
        email,
        ...profileAttributes,
        phoneNumber: formattedPhoneNumber,
        facebookId,
        googleId,
        appleId,
        picture,
        isVerified: true,
      });
    } else if (email || formattedPhoneNumber) {
      // If email or phone_number is provided, password must be set
      if (!password) {
        return res.status(400).json({ message: "missing_password" });
      }
      // if (formattedPhoneNumber) {
      //   // we verify if it validate the pattern
      //   if (!verifyPhoneNumber(formattedPhoneNumber)) {
      //     return res.status(400).json({ message: "wrong_number" });
      //   }
      // }
      const hashedPass = await Bcrypt.hash(password, 10);

      //if the client used a phone number
      response = await User.create({
        email,
        ...profileAttributes,
        phoneNumber: formattedPhoneNumber,
        facebookId,
        googleId,
        appleId,
        picture,
        password: hashedPass,
        isVerified: false,
      });
    } else {
      return res.status(400).json({ message: "missing_credentials" });
    }
    ///TODO referral
    // if (iduser) {
    //   const encryptedIdFromUrl = decodeURIComponent(iduser);
    //   const decryptedId = decryptData(encryptedIdFromUrl);
    //   const decryptedIntId = parseInt(decryptedId, 10);
    //   await Parrainage.create({
    //     parrainId: decryptedIntId,
    //     filleulId: response.id,
    //   });
    //   const tokenFcm = await FcmUser.findAll({
    //     where: { user_id: decryptedIntId },
    //   });
    //   const foundParrain = await User.findByPk(decryptedIntId);
    //   if (tokenFcm && tokenFcm.length != 0) {
    //     for (let index = 0; index < tokenFcm.length; index++) {
    //       const element = tokenFcm[index];
    //       await sendNotifToken(
    //         `Félicitations, ${name} ${lastName} vient de rejoindre The Landlord grâce à votre parrainage.`,
    //         `À sa première réservation votre bonus de parrainage sera crédité sur votre compte`,
    //         element.token
    //       );
    //     }
    //   }
    //   const parametersFound = await Parameters.findOne({
    //     where: { clientId: decryptedIntId },
    //   });
    //   let language = parametersFound ? parametersFound.langue : null;
    //   let template;
    //   template = await getTemplate(
    //     language,
    //     "newUserReferral",
    //     foundParrain.name,
    //     response.name,
    //     response.lastName
    //   );
    //   if (template) {
    //     const subject = `${
    //       subjectMap["newUserReferral"][language] ||
    //       subjectMap["newUserReferral"]["french"]
    //     }`;
    //     sendMail(foundParrain.email, subject, template, req.hostname);
    //   }
    // }
    const token = await generateJWT(response);

    // if (email && willSendMail) {
    //   //generate code for confrimation mail
    //   let code = generateRandomCode();

    //   //save the code in the database
    //   await VerificationCode.create({
    //     code,
    //     client_id: response.id,
    //   });

    //   // Create JWT token for email verification
    //   const mailVerificationToken = jwt.sign(
    //     {
    //       code: code,
    //       client_id: response.id,
    //     },
    //     process.env.JWT_SECRET,
    //     { expiresIn: process.env.JWT_MAIL_EXPIRATION }
    //   );

    //   const parametersFound = await Parameters.findOne({
    //     where: { clientId: response.id },
    //   });
    //   let language = parametersFound ? parametersFound.langue : null;
    //   let template;
    //   const verificationLink = `${process.env.LANDLORD_WEB}/account-verification?token=${mailVerificationToken}`;
    //   template = await getTemplate(
    //     language,
    //     "sendConfirmationMail",
    //     response.name + " " + response.lastName,
    //     code,
    //     verificationLink
    //   );
    //   if (template) {
    //     const subject = `${
    //       subjectMap["sendConfirmationMail"][language] ||
    //       subjectMap["sendConfirmationMail"]["french"]
    //     }`;
    //     sendMail(response.email, subject, template, req.hostname);
    //   }
    // }
    // if (formattedPhoneNumber) {
    //   const otp = await sendOTP(formattedPhoneNumber);
    //   const verificationCode = {
    //     status: otp.status,
    //     phone_number: otp.to,
    //     attempt: otp.sendCodeAttempts.length,
    //   };
    //   await VerificationCode.create(verificationCode);
    // }

    // Return token
    return res.status(200).json({ token });
  } catch (error) {
    logger.error({ err: error, path: req.route.path }, "user controller error");
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /users/profile
 *
 * Returns the authenticated user profile.
 * Requires `tokenVerification` middleware to set `req.decoded.id`.
 */
exports.profile = async (req, res) => {
  try {
    const clientId = req.decoded.id;
    const clientFound = await User.findByPk(clientId);
    if (!clientFound) {
      return res.status(404).json({ message: "client_not_found" });
    }

    // Default scope + toJSON override strip password/social IDs.
    return res.status(200).json({ clientFound });
  } catch (error) {
    logger.error({ err: error, path: req.route.path }, "user controller error");
    return res.status(500).json({ message: error.message });
  }
};

// exports.profile = async (req, res) => {
//   try {
//     const clientId = req.decoded.id;
//     const clientFound = await User.findByPk(clientId);
//     if (!clientFound) {
//       return res.status(404).json({ message: "client_not_found" });
//     }

//     const government_id_client = await GovernmentId.findAll({
//       where: {
//         client_id: clientFound.id,
//       },
//     });

//     clientFound.government_id_client = government_id_client;
//     clientFound.password = "set";

//     return res.status(200).json({ client: clientFound });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// exports.deleteProfil = async (req, res) => {
//   try {
//     const clientId = req.decoded.id;
//     await deleteUserAndRelatedRecords(clientId);
//     return res.status(200).json("deleted");
//   } catch (error) {
//     if (error.message === "user_not_found") {
//       return res.status(404).json({ message: "User not found" });
//     }
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// exports.getUserById = async (req, res) => {
//   try {
//     const connectedUserId = req.decoded.id;
//     const id = req.query.id;

//     const connectedUser = await User.findByPk(connectedUserId);
//     if (!connectedUser) {
//       return res.status(404).json({ message: "client_not_found" });
//     }
//     const role = req.decoded.role;
//     const condition = role.includes("admin")
//       ? {}
//       : {
//           attributes: {
//             exclude: [
//               "phone_number",
//               "email",
//               "password",
//               "lastName",
//               "password_rentals",
//               "facebookId",
//               "googleId",
//               "appleId",
//               "picture",
//               "isArchived",
//               "isVerified",
//               "role",
//             ],
//           },
//         };
//     const clientFound = await User.findByPk(id, condition);

//     return res.status(200).json({ client: clientFound });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// exports.verifyPhone = async (req, res) => {
//   try {
//     const { phoneNumber, code, email } = req.body;

//     if (!phoneNumber || !code || !email) {
//       return res.status(400).json({ message: "missing_credentials" });
//     }
//     const formattedPhoneNumber = removeSpacesFromPhoneNumber(phoneNumber);
//     const phoneNumberExist = await User.findOne({
//       where: { phone_number: formattedPhoneNumber },
//     });
//     if (phoneNumberExist) {
//       return res.status(400).json({ message: "phone_exist" });
//     }

//     // if (!verifyPhoneNumber(formattedPhoneNumber)) {
//     //   return res.status(400).json({ message: "wrong_number" });
//     // }

//     const responseVerification = await verifyOTP(formattedPhoneNumber, code);
//     if (responseVerification == "approved") {
//       const user = await User.findOne({
//         where: { email: email },
//       });
//       if (user) {
//         user.phone_number = formattedPhoneNumber;
//         await VerificationCode.destroy({
//           where: {
//             phone_number: formattedPhoneNumber,
//           },
//         });
//       } else {
//         return res.status(404).json({ message: "client_not_found" });
//       }

//       await user.save();
//     } else {
//       return res.status(400).json({ message: "otp_verif_failed" });
//     }
//     return res.status(200).json({ message: "otp_approved" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// exports.getAll = async (req, res) => {
//   try {
//     const page = req.query.pageQuery ? parseInt(req.query.pageQuery) : 1;
//     const limit = req.query.limitQuery ? parseInt(req.query.limitQuery) : 3000;
//     const offset = (page - 1) * limit;
//     const getOwners = req.query.owners;
//     let query = `
//       SELECT client.id,client.name,client.lastName,client.email,client.phone_number,client.role,client.createdAt,client.isVerified, bank_account.rib, bank_account.bank_name
//       FROM client
//      left JOIN bank_account ON client.id = bank_account.client_id
//      ${getOwners ? "where client.role like '%owner%'" : ""}
//       ORDER BY client.createdAt DESC
//       LIMIT :limit OFFSET :offset
//     `;

//     let clientList = await sequelize.query(query, {
//       type: sequelize.QueryTypes.SELECT,
//       replacements: { limit, offset },
//     });

//     return res.status(200).json({ clients: clientList });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// exports.getAllClientsWithBank = async (req, res) => {
//   try {
//     // Extract pagination params with default values
//     const page = req.query.pageQuery ? req.query.pageQuery : 1;
//     const limit = req.query.limitQuery ? parseInt(req.query.limitQuery) : 3000;
//     const offset = (page - 1) * limit;

//     // Fetch clients with associated bank accounts
//     const clients = await User.findAll({
//       attributes: [
//         "id",
//         "name",
//         "email",
//         "phone_number",
//         "role",
//         "createdAt",
//         "isVerified",
//       ],
//       include: [
//         {
//           model: BankAccount,
//           attributes: ["rib", "bank_name"],
//         },
//       ],
//       order: [["createdAt", "DESC"]],
//       limit,
//       offset,
//     });

//     // Format response to remove nested bank_accounts array
//     const formattedClients = clients.map((client) => {
//       const bank =
//         client.bank_accounts.length > 0 ? client.bank_accounts[0] : {};
//       return {
//         id: client.id,
//         name: client.name,
//         email: client.email,
//         phone_number: client.phone_number,
//         role: client.role,
//         createdAt: client.createdAt,
//         isVerified: client.isVerified,
//         bank_name: bank.bank_name || null,
//         rib: bank.rib || null,
//       };
//     });

//     return res.status(200).json({
//       clients: formattedClients,
//     });
//   } catch (error) {
//     console.error("Error in getAllClientsWithBank:", error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred while fetching clients." });
//   }
// };

// exports.socialMedia = async (req, res) => {
//   try {
//     const { facebookId, googleId, email, name } = req.body;
//     const clientFound = await User.findByPk(req.decoded.id);
//     const updatedClient = await clientFound.update({
//       facebookId: facebookId ?? null,
//       googleId: googleId ?? null,
//       email:
//         clientFound.email && clientFound.email != ""
//           ? clientFound.email
//           : email,
//       name:
//         clientFound.name && clientFound.name != "" ? clientFound.name : name,
//     });

//     // await clientFound.save();
//     return res.status(200).json({ updatedClient });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// Find a single User with token
// exports.checkVerificationUser = async (req, res) => {
//   try {
//     const clientId = req.decoded.id;
//     const clientFound = await User.findByPk(clientId);
//     if (!clientFound) {
//       return res.status(404).json({ message: "account_not_found" });
//     }
//     return res.status(200).json({ verified: clientFound.isVerified });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

//verify mail by clientId
// exports.verifyMail = async (req, res) => {
//   try {
//     const code = req.body.code;
//     const verificationCode = await VerificationCode.findOne({
//       where: { code: code },
//     });
//     if (!verificationCode) {
//       return res.status(401).send({ message: "wrong_otp" });
//     }

//     const client = await User.findByPk(verificationCode.client_id);

//     if (!client) {
//       return res.status(401).send({ message: "account_not_found" });
//     }

//     if (verificationCode && code == verificationCode.code) {
//       if (client.isVerified) {
//         return res.status(400).send({ message: "already_verified" });
//       }
//       client.isVerified = true;
//       await client.save();

//       await verificationCode.destroy();

//       const token = await generateJWT(client);
//       return res.status(200).json({ token });
//     } else {
//       return res.status(400).send({ message: "already_verified" });
//     }
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// exports.checkFCM = async (req, res) => {
//   try {
//     const { id, token } = req.body;

//     if (!token) {
//       return res.status(400).json({ message: "FCM token is required" });
//     }

//     let foundClient;
//     if (id) {
//       foundClient = await User.findByPk(id);
//     }

//     // Check if the token already exists
//     const foundToken = await FcmUser.findOne({ where: { token } });

//     if (foundToken) {
//       // Update the user_id if a client was found and it differs from the existing one
//       if (foundClient && foundToken.user_id !== id) {
//         foundToken.user_id = id;
//         await foundToken.save();
//       }
//     } else {
//       // Create a new FCM entry for the token only if it doesn't already exist
//       await FcmUser.create({ token, user_id: foundClient ? id : null });
//     }

//     // Subscribe to the topic only after ensuring no duplicates are created
//     await subscribeToTopic(token, "spam");

//     return res
//       .status(200)
//       .json({ message: "FCM token processed successfully" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// Resend verification mail to user
// exports.resendVerification = async (req, res) => {
//   try {
//     const clientId = req.decoded.id;
//     const isMobile = req.body.isMobile;
//     var verificationCode;
//     const client = await User.findByPk(clientId);
//     if (client.isVerified) {
//       return res.status(404).json({ message: "already_verified" });
//     }
//     verificationCode = await resendConfirmationMail(
//       client,
//       req.hostname,
//       isMobile
//     );

//     return res.status(200).json({ message: verificationCode });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// Resend verification mail to user
// exports.broadcastNotification = async (req, res) => {
//   try {
//     const { body, title } = req.body;
//     if (!body || !title) {
//       return res.status(400).json({ message: "missing" });
//     }
//     await broadcastNotification(body, title);
//     return res.status(200).json("done");
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// exports.showContract = async (req, res) => {
//   return res.status(200).send(contratHtml());
// };

// async function createAndSaveCode(clientId, type) {
//   const code = generateRandomCode();
//   await VerificationCode.create({ code, client_id: clientId, type: type });
//   return code;
// }

// Main controller function
// exports.emailForgotPassword = async (req, res) => {
//   const email = req.body.email;
//   if (!email) {
//     return res.status(401).json({ message: "email_missing" });
//   }

//   try {
//     const foundClient = await User.findOne({ where: { email } });
//     if (!foundClient) {
//       return res.status(401).json({ message: "client_not_found" });
//     }

//     const foundCode = await VerificationCode.findOne({
//       where: {
//         [Op.and]: [{ type: "forgotPassword", client_id: foundClient.id }],
//       },
//     });

//     let code;
//     if (foundCode) {
//       const currentdate = new Date();
//       const foundCodeCreatedAt = new Date(foundCode.createdAt);
//       const minuteDiff = calculateDateDifference(
//         foundCodeCreatedAt,
//         currentdate,
//         "minutes"
//       );

//       if (minuteDiff >= 30) {
//         await foundCode.destroy();
//         code = await createAndSaveCode(foundClient.id, "forgotPassword");
//       } else {
//         code = foundCode.code; // Reuse the existing code
//       }
//     } else {
//       code = await createAndSaveCode(foundClient.id, "forgotPassword");
//     }
//     const parametersFound = await Parameters.findOne({
//       where: { clientId: foundClient.id },
//     });
//     let language = parametersFound ? parametersFound.langue : null;
//     let template;
//     template = await getTemplate(language, "forgotPasswordEmailTemplate", code);

//     if (template) {
//       const subject = `${
//         subjectMap["forgotPasswordEmailTemplate"][language] ||
//         subjectMap["forgotPasswordEmailTemplate"]["french"]
//       }`;
//       sendMail(foundClient.email, subject, template, req.hostname);
//     }

//     return res.status(200).json({ message: "done" });
//   } catch (error) {
//     console.error(`Error at ${req.route.path}`, error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// exports.forgotPassword = async (req, res) => {
//   const { newPassword, code } = req.body;
//   if (!newPassword || !code) {
//     return res.status(401).json({ message: "missing" });
//   }
//   try {
//     const foundCode = await VerificationCode.findOne({
//       where: {
//         code: code,
//         type: "forgotPassword",
//       },
//       include: [
//         {
//           model: User,
//           as: "client",
//         },
//       ],
//     });
//     if (!foundCode) {
//       return res.status(401).json({ message: "code_not_found" });
//     }
//     if (foundCode.client.password) {
//       const samePassword = await Bcrypt.compare(
//         newPassword,
//         foundCode.client.password
//       );
//       if (samePassword) {
//         return res.status(401).json({ message: "same_password" });
//       }
//     }
//     const hashedPass = await Bcrypt.hash(newPassword, 10);
//     foundCode.client.password = hashedPass;
//     await foundCode.client.save();
//     await foundCode.destroy();
//     return res.status(200).json({ message: "done" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// exports.updatePassword = async (req, res) => {
//   if (!req.body.newPassword || !req.body.currentPass) {
//     return res.status(404).json({ message: "password_missing" });
//   }
//   try {
//     var clientFound = await User.findByPk(req.decoded.id);
//     if (clientFound.password) {
//       const correctOldPassword = await Bcrypt.compare(
//         req.body.currentPass,
//         clientFound.password
//       );
//       if (!correctOldPassword) {
//         return res.status(400).json({ message: "wrong_old_pass" });
//       }
//       const samePassword = await Bcrypt.compare(
//         req.body.newPassword,
//         clientFound.password
//       );
//       if (samePassword) {
//         return res.status(400).json({ message: "same_password" });
//       }
//     }
//     const hashedPass = await Bcrypt.hash(req.body.newPassword, 10);
//     clientFound.password = hashedPass;
//     await clientFound.save();
//     return res.status(200).json({ message: "done" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };

// exports.verifyClient = async (req, res) => {
//   const { idClient, value } = req.body;

//   try {
//     const foundClient = await User.findByPk(idClient);

//     if (!foundClient) {
//       return res.status(404).json({ message: "client_not_found" });
//     }
//     foundClient.isVerified = value;
//     await foundClient.save();
//     return res.status(200).json({ value });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error });
//   }
// };
// exports.updateProfileClientAdmin = async (req, res) => {
//   const { email, phoneNumber, name, lastName } = req.body;
//   const { id } = req.params;
//   const formattedPhoneNumber = phoneNumber
//     ? removeSpacesFromPhoneNumber(phoneNumber)
//     : null;

//   try {
//     const clientFound = await User.findByPk(id);
//     if (!clientFound) {
//       return res.status(404).json({ message: "client_not_found" });
//     }

//     // Check if the new phone number is already used by another client
//     if (phoneNumber) {
//       const clientFoundPhoneNumber = await User.findOne({
//         where: { phone_number: formattedPhoneNumber },
//       });

//       if (
//         clientFoundPhoneNumber &&
//         clientFoundPhoneNumber.id !== clientFound.id
//       ) {
//         return res.status(400).json({ message: "phone_exist" });
//       }
//     }
//     if (email) {
//       const clientFoundEmail = await User.findOne({
//         where: { email: email },
//       });
//       if (clientFoundEmail && clientFoundEmail.id != clientFound.id) {
//         return res.status(400).json({ message: "email_exist" });
//       }
//     }

//     // Admin updates client details
//     const updatedClient = await clientFound.update({
//       name: name || clientFound.name,
//       lastName: lastName || clientFound.lastName,
//       email: email || clientFound.email,
//       phone_number: phoneNumber ? formattedPhoneNumber : null,
//     });

//     return res
//       .status(200)
//       .json({ message: "update_profile_success", updatedClient });
//   } catch (error) {
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: error.message || "server_error" });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   const { email, phone, name, lastName, address, bio } = req.body;
//   const formattedPhoneNumber = removeSpacesFromPhoneNumber(phone);
//   try {
//     const clientFound = await User.findByPk(req.decoded.id);
//     if (formattedPhoneNumber) {
//       const clientFoundPhoneNumber = await User.findOne({
//         where: { phone_number: formattedPhoneNumber },
//       });
//       if (
//         clientFoundPhoneNumber &&
//         clientFoundPhoneNumber.phone_number != clientFound.phone_number
//       ) {
//         return res.status(400).json({ message: "phone_exist" });
//       }
//     }
//     if (clientFound.email && !email) {
//       return res.status(400).json({ message: "mail_missing" });
//     }
//     if (clientFound.phone_number && !formattedPhoneNumber) {
//       return res.status(400).json({ message: "phone_missing" });
//     }
//     if (clientFound.name && !name) {
//       return res.status(400).json({ message: "name_missing" });
//     }
//     // if (clientFound.lastName && !lastName) {
//     //   return res.status(400).json({ message: "lastName_missing" });
//     // }
//     // if (clientFound.phone_number && !verifyPhoneNumber(formattedPhoneNumber)) {
//     //   return res.status(400).json({ message: "wrong_number" });
//     // }
//     //we either change the new profilPic if sended, or we put the same picture
//     let picture = req.files?.photo?.[0].filename ?? clientFound.picture;

//     const updatedClient = await clientFound.update({
//       name,
//       lastName,
//       // address,
//       // bio,
//       email,
//       picture,
//     });
//     req.files?.gallery?.forEach(async (image) => {
//       await GovernmentId.create({
//         url: image.filename,
//         client_id: clientFound.id,
//       });
//     });
//     if (formattedPhoneNumber != clientFound.phone_number) {
//       const foundedCode = await VerificationCode.findOne({
//         where: {
//           client_id: clientFound.id,
//         },
//       });
//       if (foundedCode && foundedCode.attempt > 4) {
//         return res.status(401).json({ message: "too_many_otp" });
//       }
//       const otp = await sendOTP(formattedPhoneNumber);
//       const verificationCode = {
//         status: otp.status,
//         phone_number: otp.to,
//         client_id: clientFound.id,
//         attempt: otp.sendCodeAttempts.length,
//       };
//       foundedCode
//         ? VerificationCode.update(verificationCode, {
//             where: {
//               client_id: clientFound.id,
//             },
//           })
//         : VerificationCode.create(verificationCode);
//     }
//     const jwt = await generateJWT(updatedClient);
//     return res.status(200).json({ updatedClient, jwt });
//   } catch (error) {
//     const errorMessage = error.errors?.[0].message || error.message;
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: errorMessage });
//   }
// };

// exports.saveContract = async (req, res) => {
//   try {
//     // get copy of the contract
//     let htmlContent = contratHtml();
//     const signatureDataURL = req.body.signatureDataURL; // Assuming you're passing the signature data URL in the request body

//     // Load HTML content into cheerio
//     const $ = cheerio.load(htmlContent);

//     // Replace the content of the element with id "changethis" with the signature image
//     $("#changethis").html(
//       `<h3 class="tag-ingo">Tenant Signature</h3> <img src="${signatureDataURL}" alt="New Image">`
//     );

//     // Convert modified HTML content back to string
//     htmlContent = $.html();

//     // Convert HTML content to PDF
//     const pdfBuffer = await convertHTMLToPDF(htmlContent);

//     // Define the filename for the PDF
//     const fileName = "contract.pdf";

//     // Construct the full directory path
//     const directoryPath = path.join(__dirname, "../../public/pdf/");

//     // Check if the directory exists, if not, create it
//     if (!fs.existsSync(directoryPath)) {
//       fs.mkdirSync(directoryPath, { recursive: true });
//     }

//     // Construct the full file path
//     const pdfFilePath = path.join(directoryPath, fileName);

//     // Save the PDF to the server
//     fs.writeFileSync(pdfFilePath, pdfBuffer);

//     const template = contractMail("response.name");
//     await sendMail(
//       "benachour.farouk@gmail.com",
//       "Contrat The Landlord",
//       template,
//       req.hostname,
//       pdfFilePath
//     );
//     // Send the response
//     res
//       .status(200)
//       .send({ success: true, message: "PDF created and saved successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Function to convert HTML to PDF
// async function convertHTMLToPDF(htmlContent, signatureDataURL) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Inject signature data URL into the page
//   await page.setContent(htmlContent);
//   await page.evaluate((signatureDataURL) => {
//     // Insert signature image into the HTML content
//     // For example, you could use JavaScript to insert an <img> tag with the signatureDataURL as its src attribute
//   }, signatureDataURL);

//   // Generate PDF
//   const pdfBuffer = await page.pdf({ format: "A4" });

//   await browser.close();

//   return pdfBuffer;
// }

/**
 * Finds an existing user using any of the provided identifiers.
 *
 * Notes:
 * - Excludes users whose role includes `partner` (when the `role` column exists).
 * - Returns `null` on errors (to keep auth flows resilient).
 */
const checkUserExists = async (
  email,
  phoneNumber,
  googleId,
  facebookId,
  appleId,
  { includeSecrets = false } = {},
) => {
  try {
    let whereClause = {};

    // Build the where clause based on provided email, phoneNumber, googleId, and facebookId
    const conditions = [];
    if (appleId) {
      conditions.push({ appleId });
    }
    if (email && !appleId) {
      conditions.push({ email });
    }
    if (phoneNumber) {
      conditions.push({ phoneNumber: phoneNumber });
    }
    if (googleId) {
      conditions.push({ googleId });
    }
    if (facebookId) {
      conditions.push({ facebookId });
    }

    const hasRoleColumn = Boolean(User?.rawAttributes?.role);
    const roleCondition = hasRoleColumn
      ? { role: { [Op.notLike]: "%partner%" } }
      : null;

    if (conditions.length > 0) {
      whereClause = roleCondition
        ? { [Op.and]: [{ [Op.or]: conditions }, roleCondition] }
        : { [Op.or]: conditions };
    } else {
      whereClause = roleCondition || {};
    }

    const finder = includeSecrets ? User.scope("withSecrets") : User;
    const user = await finder.findOne({ where: whereClause });

    return user ? user : null;
  } catch (error) {
    logger.error({ err: error }, "checkUserExists failed");
    return null;
  }
};

// const checkPartnerExists = async (fiscal_matricule, iban, society_name) => {
//   try {
//     let whereClause = {};

//     const conditions = [];
//     if (fiscal_matricule) {
//       conditions.push({ fiscal_matricule });
//     }
//     if (iban) {
//       conditions.push({ iban });
//     }
//     if (society_name) {
//       conditions.push({ society_name });
//     }

//     if (conditions.length > 0) {
//       whereClause[Op.or] = conditions;
//     } else {
//       // All identifiers are null, return null directly
//       return null;
//     }

//     const partner = await Partner.findOne({ where: whereClause });

//     return partner ? partner : null;
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return null;
//   }
// };

// async function resendConfirmationMail(client, host, isMobile) {
//   var verificationCode;
//   verificationCode = await VerificationCode.findOne({
//     where: { client_id: client.id },
//   });
//   if (!verificationCode) {
//     verificationCode = await VerificationCode.create({
//       client_id: client.id,
//       code: generateRandomCode(),
//     });
//   }
//   // else {
//   //   const dayDiff = calculateDateDifference(
//   //     verificationCode.createdAt,
//   //     getDate(),
//   //     "days"
//   //   );
//   //   //we can change this
//   //   if (dayDiff < 1) {
//   //     return "mail_already_sent";
//   //   }
//   // }
//   const mailVerificationToken = jwt.sign(
//     {
//       code: verificationCode.code,
//       client_id: client.id,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_MAIL_EXPIRATION }
//   );
//   const parametersFound = await Parameters.findOne({
//     where: { clientId: client.id },
//   });

//   let language = parametersFound ? parametersFound.langue : null;

//   let template;
//   const verificationLink = `${process.env.LANDLORD_WEB}/account-verification?token=${mailVerificationToken}`;
//   template = await getTemplate(
//     language,
//     "sendConfirmationMail",
//     client.name,
//     verificationCode.code,
//     verificationLink
//   );
//   if (template) {
//     const subject = `${
//       subjectMap["sendConfirmationMail"][language] ||
//       subjectMap["sendConfirmationMail"]["french"]
//     }`;
//     sendMail(client.email, subject, template, host);
//   }

//   // const cryptedToken = encryptData(mailVerificationToken);

//   //prepare mail to send for the user with code
//   return verificationCode.code;
// }

// exports.getUserProfileReview = async (req, res) => {
//   const userId = req.params.idClient;

//   try {
//     // Fetch user with specific fields including createdAt
//     const clientFound = await User.findByPk(userId);

//     if (!clientFound) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Format createdAt as DD/MM/YYYY
//     const formattedCreatedAt = clientFound.createdAt
//       ? moment(clientFound.createdAt).format("DD-MM-YYYY")
//       : null;

//     // Fetch client review
//     const reviewClientFound = await ClientReview.findOne({
//       where: { client_id: userId },
//       attributes: ["review", "count"],
//       raw: true,
//     });

//     // Format review
//     const formattedReview = reviewClientFound
//       ? {
//           review: reviewClientFound.review
//             ? parseFloat(reviewClientFound.review.toFixed(1))
//             : null,
//           count: reviewClientFound.count || 0,
//         }
//       : { review: null, count: 0 };

//     // Construct response
//     const response = {
//       reviewUser: {
//         clientId: clientFound.id,
//         name: clientFound.name, // First name only
//         picture: clientFound.picture,
//         joined_since: formattedCreatedAt, // ✅ Now in DD/MM/YYYY format
//         review: formattedReview.review,
//         count: formattedReview.count,
//       },
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.profilePreview = async (req, res) => {
//   const userId = req.body.id;
//   console.log(`the user id that showed is ${userId}`);
//   try {
//     const newUserId = decryptData(userId);
//     console.log(`the user id that has been decrypted is ${newUserId}`);
//     // Fetch user with specific fields including createdAt
//     const clientFound = await User.findByPk(newUserId);

//     if (!clientFound) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Format createdAt as DD/MM/YYYY
//     const formattedCreatedAt = clientFound.createdAt
//       ? moment(clientFound.createdAt).format("DD-MM-YYYY")
//       : null;

//     const nameToShow =
//       clientFound.name.split(" ").length > 2
//         ? `${clientFound.name.split(" ")[0]} ${clientFound.name.split(" ")[1]}`
//         : clientFound.name.split(" ")[0];
//     // Construct response
//     const response = {
//       clientId: clientFound.id,
//       name: nameToShow, // First name only
//       picture: clientFound.picture,
//       joined_since: formattedCreatedAt, // ✅ Now in DD/MM/YYYY format
//     };

//     return res.status(200).json(response);
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// exports.changeUserLanguage = async (req, res) => {
//   const userId = req.decoded.id;
//   const lang = req.body.language;
//   try {
//     const clientFound = await User.findByPk(userId);
//     if (!clientFound) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (lang == null) {
//       return res.status(404).json({ message: "missing" });
//     }
//     const parametersFound = await Parameters.findOne({
//       where: { clientId: userId },
//     });

//     if (parametersFound) {
//       await parametersFound.update({
//         langue: lang,
//       });
//     } else {
//       // If no parameters are found, create a new record
//       await Parameters.create({
//         clientId: userId,
//         langue: lang,
//         theme: "light",
//         currency: "dtn",
//         stayLoggedIn: false,
//       });
//     }
//     return res.status(200).json({ message: "language_changed" });
//   } catch (error) {
//     console.log(`Error at ${req.route.path}`);
//     console.error("\x1b[31m%s\x1b[0m", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// function toBase64Url(b64) {
//   return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// }

// exports.generateReferralLink = async (req, res) => {
//   const userId = req.decoded.id;
//   try {
//     const clientFound = await User.findByPk(userId);
//     if (!clientFound)
//       return res.status(404).json({ message: "User not found" });

//     const encrypted = encryptData(String(userId)); // returns base64 now
//     const safeToken = toBase64Url(encrypted);

//     const referralLink = `${process.env.LANDLORD_WEB}/register/${safeToken}`;
//     return res.status(200).json({ link: referralLink });
//   } catch (e) {
//     console.log(`Error at ${req.route.path}`);
//     console.error(e);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
