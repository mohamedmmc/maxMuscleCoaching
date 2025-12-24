/**
 * Email template generator.
 *
 * Exports functions that build HTML emails as strings.
 */
const fs = require("fs");
const path = require("path");
const { getDate } = require("../helper/helpers");
const logoPath = path.join(
  __dirname,
  "../../public/images/logo_thelandlord.png"
);
const logoData = fs.readFileSync(logoPath);
const logoBase64 = Buffer.from(logoData).toString("base64");
const logoPathSig = path.join(__dirname, "../../public/images/sign-admin.png");
const logoDataSig = fs.readFileSync(logoPathSig);
const logoBase64Sig = Buffer.from(logoDataSig).toString("base64");

const emailPicture = () => `
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vos Vacances d'Été en Tunisie</title>
    <style>
      a {
        color: black;
      }
      body {
        margin-top: -20px;
        margin: 0;
        padding: 0;
        text-align: center;
      }
      .image-container {
        display: inline-block;
        max-width: 100%;
        max-height: 2000px;
        margin: 20px 0;
      }
      img {
        max-width: 100%;
        height: auto;
        width: auto;
      }
    </style>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D5yAlxY9bBvpu1JmW5x1llKni5tI8C1fQ8lx4I1bV29rdsQOqPBsyZjZ9W2Lv8pA=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
  </head>
  <body>
    <div class="image-container">
      <img src="cid:background" alt="Vacation Image" />
    </div>
    <div style="align-items: center">
      <a
        style="grid-template-columns: auto"
        href="mailto:contact@thelandlord.tn"
      >
        <i style="padding: 50px" class="fas fa-envelope"></i
        >contact@thelandlord.tn
      </a>
      <a href="https://wa.me/+21658595900">
        <i style="padding: 50px" class="fas fa-phone"></i>+216 58 595 900
      </a>
      <a href="www.thelandlord.tn" target="_blank">
        <i style="padding: 50px" class="fas fa-globe"></i>www.thelandlord.tn
      </a>
    </div>
  </body>
</html>


`;
const checkRuSyncDiscrepancyEmail = (cloudMissingLocal, localMissingCloud) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Rentals United Sync Check</title>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px 0;
      }
      .container {
        max-width: 800px;
        width: 100%;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
      .logo {
        text-align: center;
        margin-bottom: 30px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      h1 {
        color: #2da680;
        font-size: 24px;
        margin-top: 0;
      }
      h2 {
        color: #333;
        font-size: 20px;
        margin-top: 30px;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        color: #444;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
        font-size: 15px;
      }
      th {
        background-color: #2da680;
        color: white;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 14px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord Logo" />
      </div>
      <h1>Rentals United Sync Discrepancy</h1>
      <p>Here is a summary of mismatched properties between your local database and Rentals United.</p>

      <h2>❌ Active on Rentals United but missing in The landlord (${
        cloudMissingLocal.length
      })</h2>
      ${
        cloudMissingLocal.length === 0
          ? "<p>No discrepancies found.</p>"
          : `
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th></tr>
            </thead>
            <tbody>
              ${cloudMissingLocal
                .map((p) => `<tr><td>${p.id}</td><td>${p.name}</td></tr>`)
                .join("")}
            </tbody>
          </table>`
      }

      <h2>❌ Present in local DB but missing/inactive on Rentals United (${
        localMissingCloud.length
      })</h2>

      <div class="footer">
        <p>Generated automatically by The Landlord system</p>
      </div>
    </div>
  </body>
</html>
`;

const mailToClienIsthelandlord = (property, owner, reservation) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border: 1px solid #ddd;
        overflow: hidden;
      }
      .header {
        border-radius: 0 0 40px 40px;
        background-color: #2da680;
        padding-left: 20px;
      }
      .footer {
        border-radius: 40px 40px 0 0;
        background-color: #2da680;
        padding: 20px;
      }
      .contact-info img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      .header img {
        width: 150px;
      }
      .payment-row {
        width: 100%;
        padding-left: 25px;
        padding-right: 25px;
      }
      .payment-date {
        text-align: left;
        font-size: 20px;
        color: #888;
      }
      .payment-price {
        text-align: right;
        color: #888;
        font-size: 25px;
        font-weight: bold;
      }
      a,
      h3 {
        color: #888;
      }
      .content {
        padding: 20px;
        text-align: center;
      }
      .content h1 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      h3 {
        padding-left: 25px;
      }
      .paiement {
        margin-top: 40px;
        font-size: 30px;
        font-weight: bold;
        padding-left: 25px;
        color: #2da680;
      }
      .content p {
        font-size: 18px;
        margin-bottom: 20px;
        color: #888;
      }
      .villa-info {
        padding: 25px;
        margin-bottom: 20px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 8px;
      }
      .details-table {
        width: 100%;
        margin-bottom: 20px;
      }
      .details-left {
        background-color: #2da680;
        padding: 20px;
        color: #fff;
        width: 100%;
        border-radius: 8px 0 0 8px;
      }
      .details-right img {
        height: 200px;
        border-radius: 0 20px 20px 0;
      }
      .check-in-out-table {
        margin-left: 20%;
        width: 100%;
        margin-bottom: 20px;
        /* table-layout: fixed; */
      }
      .check-in-out-table td {
        background-color: rgba(222, 226, 226, 0.655);
        text-align: left;

        border-radius: 8px;
        padding: 10px;
        width: 50%;
      }
      .check-in-out-table img {
        width: 50px;
        height: auto;
        margin-right: 10px;
      }
      .check-in-out-table .check-in-out-text {
        display: flex;
        align-items: center;
      }
      .check-in-out-table .check-in-out-text p {
        margin: 0;
      }
      .check-in-out-table .check-in-out-text .top-text {
        font-weight: bold;
      }
      .check-in-out-table .check-in-out-text .middle-text {
        font-weight: bold;
      }
      .check-in-out-table .check-in-out-text .bottom-text {
        font-weight: normal;
      }
      .adresse {
        display: flex;
        align-items: center;
        height: 50px;
        text-align: left;
        border-radius: 8px;
        padding: 10px;
        margin: 0 30px 0 30px;
        box-shadow: 0 0 10px 5px rgba(99, 96, 96, 0.118);
      }
      .contact {
        text-align: center;
        margin-bottom: 20px;
      }
      .contact p {
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="cid:landlordlogo"
          alt="The Land Lord"
        />
      </div>
      <div class="content">
        <h1>TOUT EST PRÊT POUR VOTRE VOYAGE</h1>
        <p>${property.location}</p>
      </div>
      <div class="villa-info">
        <img
          src="cid:property"
          alt="${property.name}"
        />
      </div>
      <table class="details-table">
        <tr>
          <td class="details-left">
            <h2>${property.name}</h2>
            <p>Logement entier</p>
            ${
              owner.phone_number != null
                ? `   <div class="contact-info">
              <img src="cid:phone" alt="Phone" />
              <span>${owner.phone_number}</span>
            </div>`
                : ""
            }
         
            <div class="contact-info">
              <img src="cid:email" alt="Email" />
              <span>${owner.email}</span>
            </div>
          </td>
          <td class="details-right">
            <img src="cid:owner" alt="Hôte" />
          </td>
        </tr>
      </table>
      <h3>Check IN / CHECK OUT</h3>
      <table class="check-in-out-table">
        <tr>
          <td class="check-in-out-text">
            <img src="cid:checkin" alt="Check In" />
            <p>
              <span class="top-text">ARRIVÉE</span><br />
              <span class="middle-text">${reservation.date_from}</span><br />
              <span class="bottom-text">16:00</span>
            </p>

            <img src="cid:checkout" alt="Check Out" />
            <p>
              <span class="top-text">DÉPART</span><br />
              <span class="middle-text">${reservation.date_to}</span><br />
              <span class="bottom-text">12:00</span>
            </p>
          </td>
        </tr>
      </table>
      <h3>Adresse</h3>
      <div class="adresse">
        <div>${property.location}</div>
        <a
          href="https://www.google.com/maps/place/${property.latitude},${
  property.longitude
}"
        >
          <h3>Obtenir l'itinéraire</h3>
        </a>
      </div>
      <div class="paiement">Paiement</div>
      <table class="payment-row">
        <tr>
          <td class="payment-date">Paiement effécuté le ${getDate()}</td>
          <td class="payment-price">${reservation.client_price} TND</td>
        </tr>
      </table>
      <div class="footer"></div>
    </div>
  </body>
</html>

`;

const mailToOwnerIsthelandlord = (property, client, reservation) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmation</title>
    <style>
      .villa-info {
        padding: 25px;
        margin-bottom: 20px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 8px;
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .card {
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 12px;
        padding: 10px;
        margin-top: 30px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        position: relative;
        background-color: white;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background-color: white;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        overflow: hidden;
      }
      .header {
        background-color: #2da680;
        color: white;
        text-align: center;
        padding: 20px;
      }
      .logo {
        width: 150px;
      }
      .logoCheck {
        width: 50px;
      }
      .header h1 {
        margin: 10px 0;
        font-size: 1.5em;
      }
      .header p {
        margin: 0;
        font-size: 1.2em;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        text-align: center;
        color: #333;
      }
      .details {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
      }
      .details div {
        text-align: center;
      }
      .adresse {
        height: 100px;
        text-align: left;
        border-radius: 8px;
        padding: 10px;
        margin: 0 30px 0 30px;
        box-shadow: 0 0 10px 5px rgba(99, 96, 96, 0.118);
      }
      .details h3 {
        margin: 10px 0;
        color: #2da680;
      }
      .details p {
        margin: 0;
        color: #999;
      }
      .price-details {
        margin: 20px 0;
      }
      .price-details table {
        width: 100%;
        border-collapse: collapse;
      }
      .price-details th,
      .price-details td {
        padding: 10px;
        border-bottom: 1px solid #f0f0f0;
      }
      .price-details th {
        text-align: left;
        color: #999;
      }
      .price-details td {
        text-align: right;
        color: #333;
      }
      .price-details td:first-child {
        text-align: left;
      }
      .footer {
        text-align: center;
        padding: 20px;
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 5px 0;
        color: #2da680;
        font-size: 1.2em;
      }
      .footer span {
        color: #333;
        font-size: 1em;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <table class="header" width="100%" style="text-align: center">
        <tr>
          <td style="vertical-align: middle">
            <img
              class="logo"
              src="cid:landlordlogo"
              alt="The Landlord"
              style="display: block; margin: 0 auto; width: 100px"
            />
            <img
              class="logoCheck"
              src="cid:check"
              alt="The Landlord"
              style="display: block; margin: 0 auto; width: 50px"
            />
            <h1 style="margin: 10px 0">La réservation de ${
              client.name == null ? `${client.email}` : `${client.name}`
            }</h1>
            <p style="margin: 10px 0">EST CONFIRMÉE</p>
          </td>
        </tr>
      </table>

      <div class="content">
        <table class="card" width="100%">
          <tr>
            <td>
              <table width="100%" style="position: relative">
                <tr>
                  <td style="width: 24px; vertical-align: top">
                    <img
                      src="cid:calendar"
                      alt="Calendar"
                      style="width: 40px; height: 40px"
                    />
                  </td>
                  <td
                    style="
                      padding-left: 8px;
                      text-align: right;
                      font-size: 20px;
                    "
                  >
                    ${property.name}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: right; padding-top: 10px">
                    <p style="margin: 0; font-size: 30px">
                      <strong>${reservation.dayDiff} nuits</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table class="card" width="100%" style="margin-top: 20px">
          <tr>
            <td colspan="2" style="text-align: center">
              <img
                src="cid:property"
                alt="${property.name}"
                style="
                  width: 100%;
                  max-width: 600px;
                  height: auto;
                  border-radius: 12px;
                "
              />
            </td>
          </tr>
          <tr>
            <td style="width: 50%; padding-right: 10px">
              <div class="card">
                <img
                  src="cid:checkin"
                  alt="Check-in"
                  style="width: 40px; position: absolute; top: 10px; left: 10px"
                />
                <h1 style="color: #2da680; text-align: center">Arrivée</h1>
                <h2 style="color: black; text-align: center">${
                  reservation.date_from
                }</h2>
                
              </div>
            </td>
            <td style="width: 50%; padding-left: 10px">
              <div class="card">
                <img
                  src="cid:checkout"
                  alt="Check-out"
                  style="
                    width: 40px;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                  "
                />
                <h1 style="color: #2da680; text-align: center">Départ</h1>
                <h2 style="color: black; text-align: center">${
                  reservation.date_to
                }</h2>
                
              </div>
            </td>
          </tr>
        </table>

        <div class="price-details">
          <h1>Détails du prix</h1>
          <table>
            <tr>
              <th>Nuits</th>
              <td>${reservation.dayDiff}</td>
            </tr>
            <tr>
              <th>${reservation.priceNight} TND x ${
  reservation.dayDiff
} nuits</th>
              <td>${reservation.totalCost} TND</td>
            </tr>
            ${
              reservation.remise != null
                ? `   <tr>
              <th>Remise hébdomadaire de ${reservation.remise}%</th>
              <td>${reservation.remisePrice} TND</td>
                  </tr>`
                : ``
            }
         
            <tr>
              <th>Frais de nettoyage</th>
              <td>${reservation.cleaningFees} TND</td>
            </tr>
                 ${
                   reservation.couponPercentage != null
                     ? `   <tr>
              <th>Coupon utilisé -${reservation.couponPercentage}%</th>
              <td>${reservation.coupon} TND</td>
                  </tr>`
                     : ``
                 }
         
            <tr>
              <th>Sous-Total</th>
              <td>${reservation.subtotal} TND</td>
            </tr>
            <tr>
              <th>Frais The Landlord</th>
              <td>-${reservation.thelandlordFees} TND</td>
            </tr>
            <tr>
              <th>Frais de TVA</th>
              <td>-${reservation.tvaFees} TND</td>
            </tr>
            <tr>
              <th>Gain total</th>
              <td>${reservation.priceTotal} TND</td>
            </tr>
            <tr>
              <th>Type de paiement</th>
              <td>Carte Bancaire</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="footer">
        <h1 style="color: #333">MERCI</h1>
        <h1 style="color: #2da680">L'équipe The Landlord</h1>
      </div>
    </div>
  </body>
</html>

`;

const notificationMessage = (sender, message, property) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .card {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .small-image {
        max-width: 100px; /* Set the maximum width of the image */
        height: auto; /* Maintain aspect ratio */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Nouveau message de The Landlord</h1>
      <div class="card">
        <h2>${sender.name}</h2>
        <p>${message}</p>
        <img
          class="small-image"
          src="${property.url}"
          alt="Small Image"
        />
      </div>
      <p>
        Nous avons reçu un nouveau message sur The Landlord. Vous pouvez
        consulter et répondre à ce message en vous connectant à votre compte.
      </p>
      <p>
        Si vous avez des questions ou des préoccupations, n'hésitez pas à nous
        contacter.
      </p>
      <p>
        Merci de votre confiance en The Landlord. Nous sommes là pour vous
        offrir la meilleure expérience possible.
      </p>
      <p>L'équipe de The Landlord</p>
    </div>
  </body>
</html>


`;
const mailNewPropertyHost = (owner, property) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .card {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
      }
      .card h2 {
        font-size: 20px;
        margin: 10px 0;
        color: #333;
      }
      .small-image {
        max-width: 100px; /* Set the maximum width of the image */
        height: auto; /* Maintain aspect ratio */
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Merci de votre confiance en The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img class="small-image" src="cid:property" alt="Image de la maison" />
        <p>${property.address}</p>
      </div>
      <p>
        Votre maison a été ajoutée avec succès sur The Landlord et est actuellement en cours de traitement. Notre équipe travaille activement à vérifier les détails de votre propriété, et cela ne prendra pas longtemps.
      </p>
      <p>
        Nous vous contacterons dans les plus brefs délais pour vous tenir informé de l'avancement et pour toute clarification nécessaire.
      </p>
      <p>
        Merci encore pour votre confiance et votre patience. Nous sommes là pour vous offrir la meilleure expérience possible.
      </p>
      <p>
        Cordialement,<br />
        L'équipe de The Landlord
      </p>
    </div>
  </body>
</html>


`;
const mailNewPropertyLandlord = (owner, property) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .card {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
      }
      .card h2 {
        font-size: 20px;
        margin: 10px 0;
        color: #333;
      }
      .small-image {
        max-width: 100px; /* Set the maximum width of the image */
        height: auto; /* Maintain aspect ratio */
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Nouvelle maison ajoutée sur The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img
          class="small-image"
          src="cid:property"
          alt="Image de la maison"
        />
        <p>${property.address}</p>
      </div>
      <p>
        Une nouvelle maison a été ajoutée sur The Landlord. L'équipe de The
        Landlord est priée de vérifier les détails de la maison, de modifier les
        informations si nécessaire, d'approuver la publication et de contacter
        l'hôte pour toute clarification supplémentaire.
      </p>
      <p>
        Merci de votre diligence et de votre professionnalisme dans le
        traitement de cette nouvelle maison.
      </p>
      <p>
        Cordialement,<br />
        L'équipe de The Landlord
      </p>
    </div>
  </body>
</html>

`;
const emailReservationForCheckin = (propertyName, idReservation) => `
<!DOCTYPE html>
<html>
<head>
	<title>Welcome to The Landlord</title>
	<style>
	    body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      h1 {
        font-size: 24px;
        margin-top: 0;
        text-align: center;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        text-align: center;
        /* color: #2da680; Base Color */
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }

	</style>
</head>
<body>
	<div class="container">		
		<div class="logo">
			<img src="cid:landlordlogo" alt="The landlord" />
		</div>
		<h1>Confirmation de votre réservation chez The Landlord</h1>
    
		<p>Au nom de toute l'équipe de The Landlord, j'ai le plaisir de vous confirmer votre réservation pour « ${propertyName}» et de vous souhaiter la bienvenue.</p>
		<p>Pour faciliter votre arrivée et votre séjour, veuillez utiliser le lien suivant pour effectuer votre check-in en ligne. Vous aurez simplement besoin d'entrer votre code de réservation  <strong>${idReservation}</strong> et de suivre les étapes indiquées :
    www.checkin.thelandlord.tn </p>
		<p>Chez The Landlord, nous nous engageons à offrir à nos clients des logements de qualité et un service irréprochable. Votre confort et votre satisfaction sont nos priorités.</p>
		<p>Nous vous invitons également à partager votre expérience en répondant au questionnaire de satisfaction qui vous sera proposé le jour de votre départ. Vos retours sont précieux et nous aident à améliorer continuellement nos services.</p>
		<p>Nous vous souhaitons un agréable séjour et restons à votre disposition pour toute demande ou information complémentaire.</p>
		<p>Cordialement,</p>
		<p>Farouk Ben Achour</p>
		<p>CEO</p>
		<p>Raise your expectations</p>
    
	</div>
</body>
</html>
`;
const errorMailReservation = (
  propertyName,
  idReservation,
  dateFrom,
  dateTo,
  clientPrice,
  propertyId,
  clientName,
  clientEmail,
  clientPhoneNumber,
  errorMessage
) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Erreur lors de l'ajout d'une réservation</title>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      h1 {
        font-size: 24px;
        margin-top: 0;
        text-align: center;
        color: #d9534f; /* Error Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        text-align: center;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .error-message {
        color: #d9534f;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Erreur lors de l'ajout d'une réservation</h1>

      <p>Chère équipe de <strong>The Landlord</strong>,</p>
      <p>
        Une erreur s'est produite lors de l'ajout de la réservation pour la
        propriété <strong>« ${propertyName} »</strong>.
      </p>
      <p class="error-message">
        Détails de l'erreur : Impossible d'ajouter la réservation du
        ${dateFrom} au ${dateTo}.
      </p>
      <p>Informations sur la réservation :</p>
      <ul>
        <li>
          Propriété : <strong>${propertyName}</strong> (ID :
          ${propertyId})
        </li>
        <li>
          Dates de réservation : du <strong>${dateFrom}</strong> au
          <strong>${dateTo}</strong>
        </li>
        <li>Prix client : <strong>${clientPrice} TND</strong></li>
        <li>
          Identifiant de la réservation : <strong>${idReservation}</strong>
        </li>
      </ul>
      <p>Informations sur le client :</p>
      <ul>
        <li>
          Nom du client :
          <strong
            >${clientName ? clientName : "Non disponible"}</strong
          >
        </li>
        <li>
          Email :
          <strong
            >${clientEmail ? clientEmail : "Non disponible"}</strong
          >
        </li>
        <li>
          Téléphone :
          <strong
            >${clientPhoneNumber ? clientPhoneNumber : "Non disponible"}</strong
          >
        </li>
      </ul>
      <p class="error-message">Message d'erreur : ${errorMessage}</p>
      <p>
        Merci de contacter le client dès que possible pour résoudre ce problème.
        Nous nous excusons pour cette gêne et restons à votre disposition pour
        toute information supplémentaire.
      </p>
      <p>Cordialement,</p>
      <p>L'équipe technique de The Landlord</p>
      <p>Raise your expectations</p>
    </div>
  </body>
</html>
`;

const newPartnerMail = (email, password) => `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .card {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .small-image {
        max-width: 100px; /* Set the maximum width of the image */
        height: auto; /* Maintain aspect ratio */
      }
      .link {
        color: #2da680;
        text-decoration: none;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Welcome to The Landlord Partnership</h1>
      <div class="card">
        <p>Dear Partner,</p>
        <p>
          It is with great enthusiasm that we welcome you as our newest partner! This collaboration marks the beginning of a promising journey, and we are committed to ensuring its success. As part of our partnership, we are pleased to provide you with access to our API documentation through Swagger. This tool will facilitate a seamless integration and exploration of our API endpoints, enabling you to leverage the full potential of our services.
        </p>
        <p>
          Please click on the following link to access Swagger and explore our
          API endpoints:
          <a class="link" href="https://api.thelandlord.tn/swagger"
            >Swagger Documentation</a
          >
        </p>
        <p>Here are your login credentials for accessing Swagger:</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Password: ${password}</li>
        </ul>
      </div>
      <p>
       Please follow the provided link to access the Swagger interface and immerse yourself in the comprehensive documentation we have prepared for you. Should you require any assistance or have any questions, do not hesitate to reach out to us.
      </p>
      <p>
        We look forward to a fruitful and enduring partnership.
      </p>
      <p>Best regards,</p>
      <p>The Landlord Team</p>
    </div>
  </body>
</html>

`;

/**
 * Confirmation email after successful reset password
 * @param {String} fullName User full name
 * @param {String} code User full name
 * @returns
 */
const contractMail = (fullName) => `
<!DOCTYPE html>
<html>
<head>
	<title>Contract The Landlord</title>
	<style>
		    body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      h1 {
        font-size: 24px;
        margin-top: 0;
        text-align: center;
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        text-align: center;
        /* color: #2da680; Base Color */
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
	</style>
</head>
<body>
	<div class="container">
		<div class="logo">
			<img src="cid:logoName" alt="landlord logo" />
		</div>
		<h1>Contract The landlord</h1>
		<hr />
	</div>
</body>
</html>

  `;

/**
 * Send Email to reset password
 * @param {String} fullName User full name
 * @param {*} email User email
 * @param {String} API_ENDPOINT Depend on the app running localy or server
 * @param {String} token Generated unique code
 * @returns
 */
const forgotPasswordEmailTemplate = (reset_code) => `
  <!DOCTYPE html>
  <!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      h1 {
        font-size: 24px;
        margin-top: 0;
        color: #2da680; /* Couleur principale */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      .card {
        background-color: #f9f9f9;
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .code {
        font-size: 20px; /* Taille de police plus grande pour une meilleure lisibilité */
        color: #333; /* Couleur foncée pour un contraste élevé avec le code */
        font-weight: bold; /* Gras pour souligner l'importance */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Réinitialisez votre mot de passe</h1>
      <div class="card">
        <p>
          Veuillez utiliser le code suivant pour réinitialiser votre mot de
          passe :
        </p>
        <p class="code">${reset_code}</p>
        <p>
          Ce code expirera dans 30 minutes. Saisissez-le rapidement pour
          réinitialiser votre mot de passe.
        </p>
      </div>
      <p>
        Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez
        ignorer cet email ou contactez-nous si vous avez des préoccupations
        concernant la sécurité de votre compte.
      </p>
      <p>
        Merci d'utiliser The Landlord. Nous sommes là pour vous offrir la
        meilleure expérience possible.
      </p>
      <p>L'équipe de The Landlord</p>
    </div>
  </body>
</html>

  `;

/**
 * Confirmation email after successful reset password
 * @param {String} fullName User full name
 * @returns
 */
const resetPasswordConfirmationEmailTemplate = (fullName) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>
        Confirmation de réinitialisation du mot de passe
      </title>
    </head>
    <body>
      <div>
        <p>Bonjour ${fullName},</p>
        <p>Votre mot de passe a été réinitialisé avec succès.</p>
        <p>
          Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
        </p>
        <p>Cordialement,</p>
      </div>
      <hr />
    </body>
  </html>
  `;

const sendConfirmationMail = (fullName, code) => `
<!DOCTYPE html>
<html>
<head>
	<style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        /* text-align: center; */
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        /* text-align: center; */
        /* color: #2da680; Base Color */
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      button {
        background-color: #2da680; /* Complementary Color */
        border: none;
        color: #fff;
        padding: 10px 50px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        display: block;
        margin: 0 auto;
      }
      button:hover {
        background-color: #278eba; /* Accent Color */
      }
      .verification-code {
        font-size: 24px;
        font-weight: bold;
        text-decoration: underline;
      }
    </style>
</head>
<body>
	<div class="container">		
		<div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
		</div>
		<h1>Confirmez votre adresse email pour The Landlord</h1>
    <h2>${fullName ? `Bonjour ${fullName}` : ``}</h2>
		<p>Nous sommes ravis de vous accueillir sur The Landlord. Avant de commencer, nous devons confirmer votre adresse email</p>
  
     <p>Voici votre code</p>
     <p>${code}</p>
    
      <p> En confirmant votre email, vous pourrez profiter pleinement de nos services et rester informé des dernières nouveautés et offres exclusives.</p>
    <p> Si vous n'avez pas créé de compte sur The Landlord, veuillez ignorer cet email ou nous en informer.</p>
    <p> Nous sommes impatients de vous offrir la meilleure expérience possible.</p>
    <p> Raise Your Expectations, 
L'équipe de The Landlord</p>
	</div>
</body>
</html>
`;
const sendNotificationReservation = (
  date_from,
  date_to,
  propertyName,
  property_id,
  price,
  reservation_id,
  clientName,
  clientPhone,
  clientEmail
) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Nouvelle Réservation sur The Landlord</title>
    <style>
      body {
        background-color: #f1f1f1;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      h1 {
        font-size: 24px;
        margin-top: 0;
        /* text-align: center; */
        color: #2da680; /* Base Color */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        /* text-align: center; */
        /* color: #2da680; Base Color */
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .logo img {
        max-width: 200px;
        height: auto;
      }
      button {
        background-color: #2da680; /* Complementary Color */
        border: none;
        color: #fff;
        padding: 10px 50px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        display: block;
        margin: 0 auto;
      }
      button:hover {
        background-color: #278eba; /* Accent Color */
      }
      .reservation-details {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .house-link {
        color: #2da680;
        text-decoration: underline;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Nouvelle Réservation sur The Landlord</h1>
      <p>Une nouvelle réservation a été effectuée :</p>
      <div class="reservation-details">
       
          ${clientName ? ` <p><strong>Client :</strong> ${clientName}</p>` : ""}
        <p><strong>Email :</strong> ${clientEmail}</p>
        ${clientPhone ? `<p><strong>Phone :</strong> ${clientPhone}</p>` : ""}
      
        <p><strong>Date de début :</strong> ${date_from}</p>
        <p><strong>Date de fin :</strong>  ${date_to}</p>
        <p>
          <strong>Nom de la maison :</strong>
          <a href="${
            process.env.LANDLORD_WEB
          }/#/property-details/${property_id}" class="house-link">${propertyName}</a>
        </p>
        <p><strong>Prix :</strong> ${price} DT</p>
        <p>
          <strong>ID de la réservation :</strong>
          
            ${reservation_id}
          
        </p>
      </div>
      <p>
        Veuillez prendre les mesures nécessaires pour préparer cette réservation
        et informer le client de tous les détails pertinents.
      </p>

      <p>Cordialement, L'équipe de The Landlord</p>
    </div>
  </body>
</html>

`;
const sendConfirmedReservationBreakdown = (mappedPriceTotal, foundProperty) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reservation Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: auto;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        color: white;
        text-align: center;
        padding: 20px;
      }
      .header img {
        width: 100px;
        margin-bottom: 20px;
      }
      .content {
        padding: 20px;
      }
      .details {
        margin-top: 20px;
      }
      .details h2 {
        text-align: center;
        color: #2da680;
      }
      .price-details table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .price-details th,
      .price-details td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
      }
      .price-details th {
        color: #999;
      }
      .price-details td {
        color: #333;
      }
      .price-details td:last-child {
        text-align: right;
      }
      .footer {
        background-color: #f5f5f5;
        text-align: center;
        padding: 20px;
      }
      .footer h2 {
        color: #333;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord Logo" />
        <h1>Internal Notification: Reservation Confirmed</h1>
      </div>
      <div class="content">
        <h2>Reservation Details</h2>
        <p>
          A reservation with id ${
            mappedPriceTotal.reservation_id
          } has been confirmed for the property
          <strong>${foundProperty.name}</strong> for <strong>${
  mappedPriceTotal.name
}<strong> ${mappedPriceTotal.email}, contact via ${
  mappedPriceTotal.phone_number
}.

        </p>
        <p>
          **Reservation Dates**: From
          <strong>${mappedPriceTotal.dateFrom}</strong> to
          <strong>${mappedPriceTotal.dateTo}</strong><br />
          **Number of Nights**: <strong>${mappedPriceTotal.dayNumber}</strong>
        </p>

        <div class="details">
          <h2>Price Breakdown</h2>
          <table class="price-details">
            <tr>
              <th>Nightly Rate</th>
              <td>${mappedPriceTotal.dayPrice} TND</td>
            </tr>
            <tr>
              <th>Total Stay</th>
              <td>${mappedPriceTotal.priceStaying} TND</td>
            </tr>
            <tr>
              <th>Cleaning Fee</th>
              <td>${mappedPriceTotal.cleaning} TND</td>
            </tr>
            <tr>
              <th>Subtotal</th>
              <td>${mappedPriceTotal.priceBrut} TND</td>
            </tr>
            <tr>
              <th>Service Fees</th>
              <td>${mappedPriceTotal.feesPrice} TND</td>
            </tr>
            ${
              mappedPriceTotal.couponPercentage != null
                ? `
                  <tr>
              <th>Coupon Discount (${mappedPriceTotal.couponPercentage}%)</th>
              <td>
                ${mappedPriceTotal.coupon ? mappedPriceTotal.coupon : "N/A"} TND
              </td>
            </tr>
              `
                : ``
            }
            ${
              mappedPriceTotal.remisePrice != null
                ? ` <tr>
              <th>Remise</th>
              <td>
                ${mappedPriceTotal.remisePrice} TND
              </td>
            </tr>`
                : ``
            }
           
            <tr>
              <th>Total Payment</th>
              <td>${mappedPriceTotal.priceClient} TND</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="footer">
        <h2>Internal Use Only</h2>
        <p>Please review the details of this confirmed reservation.</p>
      </div>
    </div>
  </body>
</html>

`;

const contratHtml = () => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
  <head>
    <title>The LandLord</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <!-- Bootstrap CSS -->
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
      integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
      crossorigin="anonymous"
    />
    <!-- Signature Pad CSS -->
    <link rel="stylesheet" href="../../public/css/signature-pad.css" />

    <style>
      /* Inline CSS styles */
      input[type="radio"],
      input[type="checkbox"] {
        margin: 4px -17px 0 !important;
        margin-top: 1px;
        line-height: normal;
      }

      h3,
      h4 {
        color: #30ba98 !important;
        font-family: "roboto_regular", Arial, sans-serif;
      }

      p {
        text-align: justify !important;
        line-height: 2.2 !important;
        font-family: "roboto_regular", Arial, sans-serif;
        font-size: 0.899em !important;
        color: #414856;
      }

      .sig {
        visibility: hidden !important;
      }

      .footext {
        text-align: center;
        display: flex !important;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
      }

      /* .kbw-signature {
        width: 400px;
        height: 150px;
      } */

      .footer {
        text-align: center;
        margin-top: 50px; /* Adjust the margin as needed for spacing */
        display: flex !important;
        flex-direction: column;
      }

      #success_tic .page-body {
        max-width: 300px;
        background-color: #ffffff;
        margin: 10% auto;
      }

      #success_tic .page-body .head {
        text-align: center;
      }

      #success_tic .close {
        opacity: 1;
        position: absolute;
        right: 0px;
        font-size: 30px;
        padding: 3px 15px;
        margin-bottom: 10px;
      }

      #success_tic .checkmark-circle {
        width: 150px;
        height: 150px;
        position: relative;
        display: inline-block;
        vertical-align: top;
      }

      .checkmark-circle .background {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background: #1ab394;
        position: absolute;
      }

      #success_tic .checkmark-circle .checkmark {
        border-radius: 5px;
      }

      #success_tic .checkmark-circle .checkmark.draw:after {
        -webkit-animation-delay: 300ms;
        -moz-animation-delay: 300ms;
        animation-delay: 300ms;
        -webkit-animation-duration: 1s;
        -moz-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-timing-function: ease;
        -moz-animation-timing-function: ease;
        animation-timing-function: ease;
        -webkit-animation-name: checkmark;
        -moz-animation-name: checkmark;
        animation-name: checkmark;
        -webkit-transform: scaleX(-1) rotate(135deg);
        -moz-transform: scaleX(-1) rotate(135deg);
        -ms-transform: scaleX(-1) rotate(135deg);
        -o-transform: scaleX(-1) rotate(135deg);
        transform: scaleX(-1) rotate(135deg);
        -webkit-animation-fill-mode: forwards;
        -moz-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
      }

      #success_tic .checkmark-circle .checkmark:after {
        opacity: 1;
        height: 75px;
        width: 37.5px;
        -webkit-transform-origin: left top;
        -moz-transform-origin: left top;
        -ms-transform-origin: left top;
        -o-transform-origin: left top;
        transform-origin: left top;
        border-right: 15px solid #fff;
        border-top: 15px solid #fff;
        border-radius: 2.5px !important;
        content: "";
        left: 35px;
        top: 80px;
        position: absolute;
      }

      @-webkit-keyframes checkmark {
        0% {
          height: 0;
          width: 0;
          opacity: 1;
        }
        20% {
          height: 0;
          width: 37.5px;
          opacity: 1;
        }
        40% {
          height: 75px;
          width: 37.5px;
          opacity: 1;
        }
        100% {
          height: 75px;
          width: 37.5px;
          opacity: 1;
        }
      }
      #loader {
        width: 3rem;
        height: 3rem;
      }
    </style>
  </head>

  <body>
    <br />
    <br />
    <div class="container mt-5">
      <img src="data:image/png;base64,${logoBase64}" width="30%" />
      <br />
      <br />
      <b
        ><h3 style="text-align: center">
          SHORT-TERM RENTAL AGREEMENT
          <hr /></h3
      ></b>
      <br />

      <b> <h4>I.DESIGNATION OF THE PARTIES</h4></b>
      <p style="text-align: justify !important; line-height: 2.2">
        This contract is concluded between the undersigned:
      </p>
      <p style="text-align: justify; line-height: 2.2">
        - Name and first name of the representative
        <b
          >:Company The Landlord, 1631526V, located at the Résidence du Lac, Rue
          du Lac Victoria, Bloc C bureau 34, 1053 Les Berges du Lac, whose
          activity is short-term rental</b
        >
      </p>

      <p class="mt-1" style="text-align: justify; line-height: 2.2">
        Name and first name of the tenant :
        <b> client.name</b>, passport number / Identity card number:
        <b>client.cin, client.pays </b>.
      </p>
      <b> <h4>II. OBJECT OF THE CONTRACT</h4></b>
      <p
        class="mt-1"
        style="text-align: justify !important; line-height: 2.2 !important"
      >
        The object of this contract is the rental of accommodation named:
        <strong>property.name</strong> . Located at :
        <strong>property.street</strong> It was agreed and stopped as follows :
        It has been agreed and decided as follows: The Lessor gives rent to the
        Tenant the premises asa short term accomodation
      </p>
      <b><h4>III. EFFECTIVE DATE AND DURATION OF THE CONTRACT</h4></b>
      <p
        class="mt-1"
        style="text-align: justify !important; line-height: 2.2 !important"
      >
        The duration of the contract and its effective date are thus defined :
        <br />
        <strong>A.</strong> The duration of the contract and its effective date
        are thus defined:<br />
        <strong>B.</strong> Duration of the contract: This rental is granted for
        a period of <b> dayDiff </b>days from
        <strong>reservation.dateFrom </strong>
        . to end on
        <b> reservation.dateTo</b>
        .The lease automatically ceases at the expiration of this term without
        it being necessary for the lessor to notify the termination. It cannot
        be extended without the prior agreement of the lessor or its
        representative.
      </p>
      <b>
        <h4>IV. RENT</h4>
      </b>
      <p>
        This contract is fixed for an amount of :
        <strong> ///TODO check price depending from currency </strong>
      </p>
      <b><h4>V.GENERAL CONDITIONS</h4></b>
      <p style="text-align: justify !important; line-height: 2.2 !important">
        This rental is made under the following charges and conditions that the
        Tenant undertakes to execute and fulfill, namely:
        <strong>1.</strong> Only occupy the premises as a dwelling, the exercise
        of any trade, profession or industry being formally prohibited. The
        Tenant recognizing that the premises covered by this contract are only
        rented as a temporary residence . <strong>2.</strong> Respect the
        accommodation capacity of the home as descripted on the website .
        <strong>3.</strong> Respect the destination of the home and not make any
        changes to the arrangement of furniture and places;
        <strong>4.</strong> It is forbidden to substitute for any person
        whatsoever, or to sublet, in whole or in part, even free of charge, the
        rented places, except with the written agreement of the lessor.
        <strong>5.</strong> Refrain from throwing in the washbasins, bathtubs,
        bidets, sinks objects likely to obstruct the pipes, failing which he
        will be liable for the costs incurred for the return to service of this
        equipment <strong>6.</strong>Make any complaints concerning the
        installations within 48 hours of entering the accommodation. Otherwise,
        it cannot be admitted. <strong>7. </strong>Notify the Lessor as soon as
        possible of any damage affecting the home, its furniture or its
        equipment. Repairs made necessary by negligence or poor maintenance
        during the rental will be the responsibility of the tenant.
        <strong>8.</strong>Authorize the Lessor, or any third party appointed by
        him for this purpose, to carry out, during the rental period, any
        repairs ordered by emergency. The Tenant may not claim any reduction in
        rent in the event that urgent repairs incumbent on the lessor appear
        during the rental <strong>9.</strong> Avoid any noise or behavior, of
        his own making, of his family or of his acquaintances, likely to disturb
        the neighbors. <strong>10.</strong>Respect, in the event of a rental in
        an apartment building, the condominium regulations.
        <strong>11.</strong> Renounce any recourse against the Lessor in the
        event of theft and depredation in the leased premises.
        <strong>12.</strong> Maintain the rented accommodation and return it in
        a good state of cleanliness and rental repairs at the end of the rental
        period. If items in the inventory are damaged, the Lessor may claim
        their replacement value. <strong> 13.</strong> Smoking is prohibited in
        the accommodation. Any smell of cigarettes in the accommodation will be
        penalized in an amount of 500DT withheld directly from the security
        deposit. <strong>14.</strong> Party or event are forbidden. If this
        condition is not respected, the reservation will be immediatly be
        cancelled and the total amount of the deposit as well as the rest of the
        reservation will not be reimbursed.
      </p>
      <b><h4>VI. GUARANTEES</h4></b>
      <p style="text-align: justify; line-height: 2.2 !important">
        To guarantee the performance of the tenant's obligations, a security
        deposit of an amount of : <strong>caution</strong>. A Cheklist detailing
        the condition of the villa will be signed by both parties upon check-in.
        During the check-out, the inventory and the inventory will be made on
        the basis of this document.
      </p>
      <b><h4>VII. Cancelation</h4></b>
      <p style="text-align: justify; line-height: 2.2 !important">
        Full refund for cancellations made within 48 hours of booking, if the
        check-in date is at least 14 days away. 50% refund for cancellations
        made at least 7 days before check-in. No refunds for cancellations made
        within 7 days of check-in. <br />
        In case of force majeure, no refund will be made. The client will have a
        credit of the full amount paid, that could be spent within 12 months
        from the check-in day in the contract. The credit can only be used for
        the property described in this contract.
      </p>
      <div class="row mt-5" style="width: 100%">
        <div class="col">
          <h3 class="tag-ingo">Signature and stamp of the representative</h3>
          <img src="data:image/png;base64,${logoBase64Sig}" />
        </div>
        <div class="col" id="changethis">
          <div class="panel panel-default" style="width: 350px">
            <div class="panel-body center-text">
              <div id="signArea" class="mb-3">
                <h3 class="tag-ingo">Tenant Signature</h3>
                <div class="" style="height: auto">
                  <div id="signature-pad" class="signature-pad">
                    <div class="signature-pad--body" id="signatureContainer">
                      <canvas style="height: 200px"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-group form-check">
                <label class="form-check-label">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="remember"
                    required
                  />
                  Read and approved
                  <div class="valid-feedback">Approved</div>
                  <div class="invalid-feedback">
                    Please check the following box.
                  </div>
                </label>
              </div>
              <div class="d-flex align-items-center">
                <button id="clear" class="btn btn-warning mr-2">Clear</button>
                <button id="save" type="submit" class="btn btn-success">
                  Save Signature
                </button>
            <span
              id="loader"
              class="ml-2 spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              style="display: none;"
            ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="footer">
        <p class="footext">The Landlord</p>
        <p class="footext">Code T.V.A: 1631526MA000</p>
        <p class="footext">contact@thelandlord.tn</p>
        <p class="footext">+216 58 59 59 00</p>
      </div>
    </footer>
  </body>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
  />
  <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
  />
  <script
    src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"
    type="module"
  ></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
  <script src="../../public/javascripts/signature-touch.js"></script>
  <script src="../../public/javascripts/signature_pad.js"></script>
  <script>
    $(document).ready(function () {
      console.log("Document ready"); // Add this line for debugging

      // Initialize Signature Pad
      var canvas = document.querySelector("canvas");
      var signaturePad = new SignaturePad(canvas);

      // Clear signature
      $("#clear").click(function () {
        signaturePad.clear();
      });

      // Save signature
      $("#save").click(function () {
        // Check if "Read and approved" checkbox is checked
        if ($("input[name='remember']").is(":checked")) {
          if (!signaturePad.isEmpty()) {
            // Convert signature to PNG data URL
            var dataURL = signaturePad.toDataURL();
            // Disable the "Save Signature" button
            $("#save").prop("disabled", true);
            $("#clear").prop("disabled", false);
            $("#loader").show();
            $.ajax({
              type: "POST",
              url: "/api/client/create-contract",
              data: {
                signatureDataURL: dataURL,
              },
              success: function (response) {
                // Handle success response from the server
                console.log("Signature saved successfully:", response);
                if (response.success) {
                  // Replace the signature pad with the saved image
                  var signatureImage = new Image();
                  signatureImage.src = dataURL;
                  $("#signArea").replaceWith(signatureImage);

                  // Disable the "Save Signature" button
                  $("#loader").hide();
                  $("#save").prop("disabled", true);
                  $("#clear").prop("disabled", false);
                  // Show success message
                  alert("PDF created and saved successfully");
                } else {
                  $("#clear").prop("disabled", false);
                  $("#save").prop("disabled", false);
                  $("#loader").hide();
                  // Show error message
                  alert("Failed to create PDF. Please try again later.");
                }
              },
              error: function (xhr, status, error) {
                // Handle error response from the server
                console.error("Error saving signature:", error);
                $("#loader").hide();
                $("#clear").prop("disabled", false);
                $("#save").prop("disabled", false);
                alert("Failed to create PDF. Please try again later.");
              },
            });
          } else {
            alert("Please provide a signature first.");
          }
        } else {
          alert("Please read and approve before saving.");
        }
      });
    });
  </script>
</html>

`;
const contactUsMail = (email, name, subject, body, phone) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contact Us - The Landlord</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f1f1f1;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      .header {
        background-color: #2da680;
        color: #fff;
        padding: 10px 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      h1 {
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
      }
      .footer p {
        font-size: 14px;
        color: #888;
      }
      .logo img {
        max-width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .button {
        background-color: #2da680;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #278eba;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord Logo" class="logo" />
      </div>
      <div class="content">
        <h1>New Contact Us Form Submission</h1>
        <p>Dear Team,</p>
        <p>
          A new message has been received from the contact us form on the
          website. Here are the details:
        </p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Subject:</strong> ${subject}</li>
          <li>
            <strong>Message:</strong> ${body}
          </li>
        </ul>
        <p>Please respond to this inquiry as soon as possible.</p>
      </div>
      <div class="footer">
        <p>Thank you,<br />The Landlord Team</p>
      </div>
    </div>
  </body>
</html>

`;
const approbationHouse = (propertyLink, clientName) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Confirmation de l'approbation de votre maison - The Landlord</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f1f1f1;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      .header {
        background-color: #2da680;
        color: #fff;
        padding: 10px 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      h1 {
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
      }
      .footer p {
        font-size: 14px;
        color: #888;
      }
      .logo img {
        max-width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .button-container {
        text-align: center;
        margin-top: 20px;
      }
      .button {
        background-color: #2da680;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
      }
      .button:hover {
        background-color: #278eba;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord Logo" class="logo" />
      </div>
      <div class="content">
        <h1>Votre maison a été approuvée</h1>
        <p>Bonjour ${clientName},</p>
        <p>
          Nous sommes ravis de vous informer que votre maison a été approuvée
          par l'équipe de The Landlord. Elle est désormais disponible sur notre
          plateforme et peut être consultée par les utilisateurs.
        </p>
        <p>
          Vous pouvez maintenant accéder à votre maison et gérer vos annonces
          directement depuis votre compte.
        </p>
        <div class="button-container">
          <a href="${propertyLink}" class="button">Voir ma maison</a>
        </div>
        <p>
          Si vous avez des questions ou avez besoin de plus d'informations,
          n'hésitez pas à nous contacter.
        </p>
      </div>
      <div class="footer">
        <p>Merci,<br />L'équipe The Landlord</p>
      </div>
    </div>
  </body>
</html>


`;

const contactUsProperties = (
  email,
  name,
  subject,
  body,
  phone,
  properties,
  source
) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contactez-nous - The Landlord</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f1f1f1;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
      .header {
        background-color: #2da680;
        color: #fff;
        padding: 10px 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      h1 {
        font-size: 24px;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
      }
      .footer p {
        font-size: 14px;
        color: #888;
      }
      .logo img {
        max-width: 150px;
        height: auto;
        display: block;
        margin: 0 auto;
      }
      .button {
        background-color: #2da680;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
        margin-top: 20px;
      }
      .button:hover {
        background-color: #278eba;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord Logo" class="logo" />
      </div>
      <div class="content">
        <h1>Ajouter plusieurs maisons</h1>
        <p>Chère Équipe,</p>
        <p>
          Une demande d'ajout de plusieurs maison depuis un autre site à été
          faite sur le site
        </p>
        <ul>
          <li><strong>Nom :</strong> ${name}</li>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Téléphone :</strong> ${phone}</li>
          <li><strong>Sujet :</strong> ${subject}</li>
          <li><strong>Message :</strong> ${body}</li>
          <li><strong>Nombre de maisons :</strong> ${properties}</li>
          <li><strong>Source :</strong> ${source}</li>
        </ul>
        <p>Veuillez répondre à cette demande dès que possible.</p>
      </div>
      <div class="footer">
        <p>Merci,<br />L'équipe The Landlord</p>
      </div>
    </div>
  </body>
</html>

`;

const expiredRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        padding: 40px;
        text-align: center;
      }
      .header img {
        width: 180px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 25px;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        background-color: #2da680;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .villa-info {
        padding: 30px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 12px;
      }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .contact-info {
        text-align: center;
        margin-top: 20px;
      }
      .contact-info a {
        display: block;
        margin: 10px 0;
        color: #2da680;
        font-size: 18px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Demande de réservation expirée</h1>
        <p>
          Nous avons le regret de vous informer que votre demande de réservation pour le bien
          <strong>${name}</strong> du
          <strong>${booking.date_from}</strong> au
          <strong>${booking.date_to}</strong> n’a pas été confirmée par le propriétaire
          dans le délai requis de 24 heures.
        </p>
        <p>
          Vous pouvez consulter d’autres biens disponibles ou contacter notre équipe
          pour obtenir de l’aide. Nous sommes là pour vous aider à trouver le séjour idéal.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">Voir les biens disponibles</a>
      </div>
      <div class="content">
        <h2>Besoin d’aide ?</h2>
        <p>
          Notre équipe est disponible 24h/24 et 7j/7 pour vous assister dans votre prochaine réservation
          ou répondre à vos questions.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Merci d’utiliser The Landlord. Nous espérons vous accueillir très bientôt !
      </div>
    </div>
  </body>
</html>
`;

const expiredRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        padding: 40px;
        text-align: center;
      }
      .header img {
        width: 180px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 25px;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        background-color: #2da680;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .villa-info {
        padding: 30px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 12px;
      }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .contact-info {
        text-align: center;
        margin-top: 20px;
      }
      .contact-info a {
        display: block;
        margin: 10px 0;
        color: #2da680;
        font-size: 18px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Demande de réservation expirée</h1>
        <p>
          Vous n’avez pas confirmé la demande de réservation pour votre bien
          <strong>${name}</strong> du
          <strong>${booking.date_from}</strong> au
          <strong>${booking.date_to}</strong> dans le délai requis de 24 heures.
        </p>
        <p>
          En conséquence, la demande a expiré et le client a été notifié.
          Nous vous encourageons à répondre rapidement aux futures demandes afin d’éviter de manquer des opportunités.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}" class="button">Voir le bien</a>
      </div>
      <div class="content">
        <h2>Besoin d’aide ?</h2>
        <p>
          Notre équipe est disponible 24h/24 et 7j/7 pour vous aider à gérer vos annonces et améliorer votre taux de réponse.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Merci de collaborer avec The Landlord. Gardons votre calendrier toujours rempli !
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        padding: 40px;
        text-align: center;
      }
      .header img {
        width: 180px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 25px;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        background-color: #2da680;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .villa-info {
        padding: 30px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 12px;
      }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .contact-info {
        text-align: center;
        margin-top: 20px;
      }
      .contact-info a {
        display: block;
        margin: 10px 0;
        color: #2da680;
        font-size: 18px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Votre demande de réservation a expiré</h1>
        <p>
          Le propriétaire de <strong>${name}</strong> a accepté votre demande de réservation du
          <strong>${booking.date_from}</strong> au <strong>${booking.date_to}</strong>.
        </p>
        <p>
          Cependant, nous n’avons pas reçu votre confirmation dans un délai de 24 heures.
          La réservation a donc expiré et ne sera pas traitée.
        </p>
        <p>
          Vous pouvez consulter d’autres biens disponibles ou contacter notre équipe pour obtenir de l’aide.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">Voir les biens</a>
      </div>
      <div class="content">
        <h2>Besoin d’aide ?</h2>
        <p>
          Notre équipe est disponible 24h/24 et 7j/7 pour vous aider à trouver le séjour idéal ou répondre à vos questions.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Merci d’utiliser The Landlord. Nous espérons vous accueillir très bientôt !
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        padding: 40px;
        text-align: center;
      }
      .header img {
        width: 180px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 25px;
      }
      .button-container {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        background-color: #2da680;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .villa-info {
        padding: 30px;
        text-align: center;
      }
      .villa-info img {
        width: 100%;
        border-radius: 12px;
      }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .contact-info {
        text-align: center;
        margin-top: 20px;
      }
      .contact-info a {
        display: block;
        margin: 10px 0;
        color: #2da680;
        font-size: 18px;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Le client n’a pas confirmé la réservation</h1>
        <p>
          Vous avez accepté la demande de réservation pour votre bien
          <strong>${name}</strong> du
          <strong>${booking.date_from}</strong> au
          <strong>${booking.date_to}</strong>, mais le client n’a pas confirmé dans les 24 heures.
        </p>
        <p>
          En conséquence, la demande a expiré. Vous pouvez remettre ces dates en ligne ou examiner d’autres demandes en attente.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/owner/requests/\${booking.id}" class="button">Voir la demande de réservation</a>
      </div>
      <div class="content">
        <h2>Détails de la réservation</h2>
        <p><strong>Bien :</strong> ${name}</p>
        <p><strong>Dates :</strong> ${booking.date_from} → ${booking.date_to}</p>
        <p><strong>ID de la demande :</strong> ${booking.id}</p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Merci de collaborer avec The Landlord.
      </div>
    </div>
  </body>
</html>
`;

const prearrivalClient = (booking, name) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #2da680;
        padding: 40px;
        text-align: center;
      }
      .header img { width: 180px; }
      .content { padding: 30px; text-align: center; }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
      }
      .content p { font-size: 18px; line-height: 1.6; margin-bottom: 16px; }
      .button-container { text-align: center; margin: 30px 0; }
      .button {
        display: inline-block;
        padding: 15px 30px;
        font-size: 18px;
        color: #fff;
        background-color: #2da680;
        text-decoration: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .villa-info { padding: 30px; text-align: center; }
      .villa-info img { width: 100%; border-radius: 12px; }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .contact-info { text-align: center; margin-top: 20px; }
      .contact-info a {
        display: block; margin: 10px 0; color: #2da680;
        font-size: 18px; text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- En-tête / Logo -->
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>

      <!-- Titre & rappel -->
      <div class="content">
        <h1>Plus que 2 jours avant votre arrivée</h1>
        <p>Petit rappel : votre séjour commence dans 48 heures.</p>
      </div>

      <!-- Image du logement -->
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2 style="margin-top:16px; color:#2da680;">${name}</h2>
      </div>

      <!-- Détails de la réservation -->
      <div class="content">
        <h2 style="color:#2da680; font-size:22px; margin-bottom:12px;">Détails de la réservation</h2>
        <p>Logement : ${name}</p>
        <p>Dates : ${booking.date_from} → ${booking.date_to}</p>
        ${booking.duration ? `<p>Nuits : ${booking.duration}</p>` : ``}
       
      </div>
      <!-- Contacts -->
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>

      <!-- Pied de page -->
      <div class="footer">
        Nous restons à votre disposition pour toute assistance.
      </div>
    </div>
  </body>
</html>
`;

// export module
module.exports = {
  sendConfirmationMail,
  forgotPasswordEmailTemplate,
  resetPasswordConfirmationEmailTemplate,
  contratHtml,
  contractMail,
  emailReservationForCheckin,
  sendNotificationReservation,
  contactUsMail,
  notificationMessage,
  newPartnerMail,
  mailToOwnerIsthelandlord,
  mailToClienIsthelandlord,
  emailPicture,
  mailNewPropertyHost,
  mailNewPropertyLandlord,
  contactUsProperties,
  approbationHouse,
  errorMailReservation,
  sendConfirmedReservationBreakdown,
  checkRuSyncDiscrepancyEmail,
  //clear expired requests
  expiredRequestClient,
  expiredRequestOwner,
  expiredConfirmedRequestClient,
  expiredConfirmedRequestOwner,
  prearrivalClient,
};
