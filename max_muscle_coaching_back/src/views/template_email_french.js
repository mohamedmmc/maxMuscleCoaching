/**
 * Email template generator (French).
 *
 * Exports functions that build HTML emails as strings.
 */
const fs = require("fs");
const path = require("path");
const { getDate } = require("../helper/date_utils");
const logoPath = path.join(
  __dirname,
  "../../public/images/logo_thelandlord.png"
);
const logoData = fs.readFileSync(logoPath);
const logoBase64 = Buffer.from(logoData).toString("base64");
const logoPathSig = path.join(__dirname, "../../public/images/sign-admin.png");
const logoDataSig = fs.readFileSync(logoPathSig);
const logoBase64Sig = Buffer.from(logoDataSig).toString("base64");

const acceptedRequestBooking = (booking) => `
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
      .contact-info i {
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Votre demande de réservation est confirmée !</h1>
        <p>
          Nous sommes ravis de vous informer que votre demande de réservation
          pour la maison <strong>${booking.property_name}</strong> du
          <strong>${booking.dateom}</strong> au
          <strong>${booking.date_to}</strong> a été approuvée.
        </p>
        <p>
          Nous avons pris soin de préparer votre séjour pour qu'il soit à la
          hauteur de vos attentes. Vous trouverez ci-dessous toutes les
          informations essentielles concernant votre réservation. N'hésitez pas
          à nous contacter en cas de besoin.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}?dateom=${booking.dateom}&date_to=${booking.date_to}&id=${booking.id}" class="button">Voir ma réservation</a>
      </div>
      <div class="content">
        <h2>Informations importantes</h2>
        <p><strong>Adresse :</strong> ${booking.location}</p>
        <p>
          <strong>Check-in :</strong> ${booking.dateom} à partir de 16h
        </p>
        <p><strong>Check-out :</strong> ${booking.date_to} avant 12h</p>
        <p>
          Pour toute question ou assistance, notre équipe reste disponible
          24h/24.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn"
          ><i class="fas fa-envelope"></i>contact@thelandlord.tn</a
        >
        <a href="https://wa.me/+21658595900"
          ><i class="fas fa-phone"></i>+216 58 595 900</a
        >
        <a href="https://www.thelandlord.tn" target="_blank"
          ><i class="fas fa-globe"></i>www.thelandlord.tn</a
        >
      </div>
      <div class="footer">
        Merci d'avoir choisi The Landlord.<br />
        Nous avons hâte de vous accueillir !
      </div>
    </div>
  </body>
</html>
`;

const refusedRequestBooking = (booking) => `
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
        color: #d9534f;
      }
      .content p {
        font-size: 18px;
        line-height: 1.6;
        margin-bottom: 25px;
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
      .contact-info i {
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Votre réservation a été refusée</h1>
        <p>
          Nous sommes désolés de vous informer que votre demande de réservation
          pour la maison <strong>${booking.name}</strong> du
          <strong>${booking.dateom}</strong> au
          <strong>${booking.date_to}</strong> n'a pas pu être acceptée.
        </p>
        <p>
          Cette décision peut être due à une indisponibilité soudaine du
          logement ou à d'autres contraintes. Nous vous encourageons à explorer
          d'autres options disponibles sur notre plateforme.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="content">
        <h2>Besoin d'aide ?</h2>
        <p>
          Notre équipe est à votre disposition pour vous aider à trouver une
          alternative qui correspond à vos besoins.
        </p>
        <p>N'hésitez pas à nous contacter pour toute assistance.</p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn"
          ><i class="fas fa-envelope"></i>contact@thelandlord.tn</a
        >
        <a href="https://wa.me/+21658595900"
          ><i class="fas fa-phone"></i>+216 58 595 900</a
        >
        <a href="https://www.thelandlord.tn" target="_blank"
          ><i class="fas fa-globe"></i>www.thelandlord.tn</a
        >
      </div>
      <div class="footer">
        Merci d'avoir choisi The Landlord.<br />
        Nous espérons vous accompagner dans votre prochaine réservation.
      </div>
    </div>
  </body>
</html>

`;
const demandeBooking = (booking, owner) => `
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
      .villa-info, .client-info {
        padding: 30px;
        text-align: center;
      }
      .villa-info img, .client-info img {
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
      .contact-info i {
        margin-right: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Nouvelle demande de réservation</h1>
        <p>Bonjour <strong>${owner.name}</strong>,</p>
        <p>Une nouvelle demande de réservation a été reçue pour votre logement <strong>${
          booking.property_name
        }</strong> situé à <strong>${booking.location}</strong> du <strong>${
  booking.dateom
}</strong> au <strong>${booking.date_to}</strong>.</p>
        <p>Veuillez examiner la demande et l'accepter ou la refuser dès que possible.</p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.property_name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="client-info">
        <h2>Informations sur le client</h2>
        <img src="cid:client" alt="Photo du client" />
        <p><strong>Nom :</strong> ${booking.client_name}</p>
        <p><strong>Email :</strong> <a href="mailto:${booking.email}">${
  booking.email
}</a></p>
${
  booking.phone_number
    ? `<p><strong>Téléphone :</strong> <a href="tel:${booking.phone_number}">${booking.phone_number}</a></p>`
    : ""
}
      </div>
      <div class="button-container">
        <a href="${
          process.env.LANDLORD_WEB
        }" class="button">Gérer la demande</a>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn"><i class="fas fa-envelope"></i>contact@thelandlord.tn</a>
        <a href="https://wa.me/+21658595900"><i class="fas fa-phone"></i>+216 58 595 900</a>
        <a href="https://www.thelandlord.tn" target="_blank"><i class="fas fa-globe"></i>www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Merci d'utiliser The Landlord.<br />
        Nous sommes là pour vous accompagner dans la gestion de vos réservations.
      </div>
    </div>
  </body>
</html>
`;
const canceledReservationClient = (booking) => `
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
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Votre réservation a été annulée</h1>
        <p>
          Nous vous confirmons que votre réservation pour la maison 
          <strong>${booking.property_name}</strong> du 
          <strong>${booking.dateom}</strong> au 
          <strong>${booking.date_to}</strong> a bien été annulée.
        </p>
        <p>
          Nous espérons vous revoir bientôt pour une nouvelle réservation.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        Merci d'avoir utilisé The Landlord.<br />
        À bientôt !
      </div>
    </div>
  </body>
</html>
`;
const canceledReservationOwner = (booking) => `
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
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <div class="content">
        <h1>Une réservation a été annulée</h1>
        <p>
          Le client <strong>${
            booking.client_name
          }</strong> a annulé sa réservation 
          pour votre maison <strong>${booking.property_name}</strong> du 
          <strong>${booking.dateom}</strong> au 
          <strong>${booking.date_to}</strong>.
          motif <strong>${booking.motif}</strong>.
        </p>
        <p>
          Voici ses coordonnées :
        </p>
        <p>
          <strong>Email :</strong> <a href="mailto:${booking.client_email}">${
  booking.client_email
}</a><br>
          ${
            booking.client_phone
              ? `<strong>Téléphone :</strong> <a href="tel:${booking.client_phone}">${booking.client_phone}</a>`
              : ""
          }
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        Connectez-vous à The Landlord pour voir vos autres réservations.
      </div>
    </div>
  </body>
</html>
`;
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
              <span class="middle-text">${reservation.dateom}</span><br />
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
const addCohostEmail = (houses) => `
<!DOCTYPE html>
<html>
  <head>
    <title>Invitation à devenir co-hôte sur The Landlord</title>
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
        color: #2da680;
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
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      table th,
      table td {
        border: 1px solid #ddd;
        text-align: left;
        padding: 8px;
      }
      table th {
        background-color: #2da680;
        color: white;
      }
      .house-image {
        width: 60px;
        height: auto;
        border-radius: 5px;
      }
      button {
        background-color: #2da680;
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
        background-color: #278eba;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Invitation à devenir co-hôte sur The Landlord</h1>
      <p>Vous avez été invité à devenir co-hôte pour les propriétés suivantes :</p>
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom de la maison</th>
            <th>Privilège</th>
          </tr>
        </thead>
        <tbody>
          ${houses
            .map(
              (house) => `
          <tr>
            <td>
              <img
                src="api.thelandlord.tn/public/properties/${house.images}"
                alt="${house.name}"
                class="house-image"
              />
            </td>
            <td>${house.name}</td>
            <td>${house.privilege === "all" ? "Tous" : "Limité"}</td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <p>
        Veuillez accepter ou refuser cette invitation en vous connectant à votre compte sur
        <a
          href="${process.env.LANDLORD_WEB}"
          style="color: #2da680; text-decoration: underline"
          >The Landlord</a
        >.
      </p>
      <p>Cordialement, L'équipe de The Landlord</p>
    </div>
  </body>
</html>
`;
const mailToOwnerIsthelandlord = (
  property,
  client,
  reservation,
  isPriceChanged
) => `
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
              }
               </h1>
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
                    reservation.dateom
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
              ${
                isPriceChanged
                  ? ``
                  : `
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
              </tr>`
              }
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
      .owner-details {
        margin-top: 10px;
        font-size: 14px;
        color: #555;
      }
      .owner-details span {
        display: block;
        margin-bottom: 5px;
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
        <img class="small-image" src="cid:property" alt="Image de la maison" />
        <p>${property.address}</p>
        <div class="owner-details">
          <span><strong>Email:</strong> ${owner.email}</span>
          <span><strong>Téléphone:</strong> ${owner.phone_number}</span>
        </div>
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
      <h1>Bienvenue dans le partenariat The Landlord</h1>
      <div class="card">
        <p>Cher partenaire,</p>
        <p>
          C'est avec grand enthousiasme que nous vous accueillons en tant que notre nouveau partenaire ! Cette collaboration marque le début d'un voyage prometteur, et nous nous engageons à en assurer le succès. Dans le cadre de notre partenariat, nous sommes heureux de vous fournir l'accès à la documentation de notre API via Swagger. Cet outil facilitera une intégration fluide et l'exploration de nos points de terminaison API, vous permettant de tirer parti du plein potentiel de nos services.
        </p>
        <p>
          Veuillez cliquer sur le lien suivant pour accéder à Swagger et explorer nos
          points de terminaison API :
          <a class="link" href="https://api.thelandlord.tn/swagger"
            >Documentation Swagger</a
          >
        </p>
        <p>Voici vos identifiants de connexion pour accéder à Swagger :</p>
        <ul>
          <li>Email : ${email}</li>
          <li>Mot de passe : ${password}</li>
        </ul>
      </div>
      <p>
       Veuillez suivre le lien fourni pour accéder à l'interface Swagger et vous plonger dans la documentation complète que nous avons préparée pour vous. Si vous avez besoin d'aide ou si vous avez des questions, n'hésitez pas à nous contacter.
      </p>
      <p>
        Nous attendons avec impatience un partenariat fructueux et durable.
      </p>
      <p>Bien cordialement,</p>
      <p>L'équipe de The Landlord</p>
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
  dateom,
  date_to,
  propertyName,
  property_id,
  price,
  reservation_id,
  clientName,
  clientPhone,
  clientEmail,
  currency
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
         
            ${
              clientName
                ? ` <p><strong>Client :</strong> ${clientName}</p>`
                : ""
            }
          <p><strong>Email :</strong> ${clientEmail}</p>
          ${clientPhone ? `<p><strong>Phone :</strong> ${clientPhone}</p>` : ""}
        
          <p><strong>Date de début :</strong> ${dateom}</p>
          <p><strong>Date de fin :</strong>  ${date_to}</p>
          <p>
            <strong>Nom de la maison :</strong>
            <a href="${
              process.env.LANDLORD_WEB
            }/property-details/${property_id}" class="house-link">${propertyName}</a>
          </p>
          <p><strong>Prix :</strong> ${price} ${currency}</p>
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
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmation de Réservation</title>
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
          <h1>Notification interne : Réservation confirmée</h1>
        </div>
        <div class="content">
          <h2>Détails de la réservation</h2>
          <p>
            Une réservation avec l'ID ${
              mappedPriceTotal.reservation_id
            } a été confirmée pour la propriété
            <strong>${foundProperty.name}</strong> pour
            <strong>${mappedPriceTotal.email}</strong>
        ${
          mappedPriceTotal.phone_number != null
            ? `<strong> contact via ${mappedPriceTotal.phone_number}</strong>.`
            : ""
        }    
  
          </p>
          <p>
            **Dates de la réservation** : Du
            <strong>${mappedPriceTotal.dateFrom}</strong> au
            <strong>${mappedPriceTotal.dateTo}</strong><br />
            **Nombre de nuits** : <strong>${mappedPriceTotal.dayNumber}</strong>
          </p>
  
          <div class="details">
            <h2>Détail des prix</h2>
            <table class="price-details">
              <tr>
                <th>Taux de la nuitée</th>
                <td>${mappedPriceTotal.dayPrice} TND</td>
              </tr>
              <tr>
                <th>Total du séjour</th>
                <td>${mappedPriceTotal.priceStaying} TND</td>
              </tr>
              <tr>
                <th>Frais de nettoyage</th>
                <td>${mappedPriceTotal.cleaning} TND</td>
              </tr>
              <tr>
                <th>Sous-total</th>
                <td>${mappedPriceTotal.priceBrut} TND</td>
              </tr>
              ${
                mappedPriceTotal.feesPrice != null
                  ? `
                  <tr>
                <th>Frais de service</th>
                <td>${mappedPriceTotal.feesPrice} TND</td>
              </tr>`
                  : ""
              }
            
              ${
                mappedPriceTotal.couponPercentage != null
                  ? `
                    <tr>
                <th>Réduction sur le coupon (${
                  mappedPriceTotal.couponPercentage
                }%)</th>
                <td>
                  ${
                    mappedPriceTotal.coupon ? mappedPriceTotal.coupon : "N/A"
                  } TND
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
                <th>Montant total à payer</th>
                <td>${mappedPriceTotal.priceClient} TND</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="footer">
          <h2>Utilisation interne uniquement</h2>
          <p>Veuillez vérifier les détails de cette réservation confirmée.</p>
        </div>
      </div>
    </body>
  </html>
  `;
const contactUsMail = (email, name, subject, body, phone) => `
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
          <h1>Nouvelle soumission du formulaire de contact</h1>
          <p>Chère équipe,</p>
          <p>
            Un nouveau message a été reçu via le formulaire de contact sur le
            site web. Voici les détails :
          </p>
          <ul>
            <li><strong>Nom :</strong> ${name}</li>
            <li><strong>Email :</strong> ${email}</li>
            <li><strong>Téléphone :</strong> ${phone}</li>
            <li><strong>Sujet :</strong> ${subject}</li>
            <li>
              <strong>Message :</strong> ${body}
            </li>
          </ul>
          <p>Merci de répondre à cette demande dès que possible.</p>
        </div>
        <div class="footer">
          <p>Merci,<br />L'équipe de The Landlord</p>
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
const sendClientReviewRequestEmail = (clientName, ownerName, reviewLink) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f1f1f1; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; }
    .container { max-width: 600px; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); }
    h1 { font-size: 24px; color: #2da680; }
    p { font-size: 16px; line-height: 1.5; }
    .logo { text-align: center; margin-bottom: 20px; }
    .logo img { max-width: 200px; }
    a.button { background-color: #2da680; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    a.button:hover { background-color: #278eba; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="cid:landlordlogo" alt="The Landlord" />
    </div>
    <h1>Parlez-nous de votre séjour</h1>
    <h2>Bonjour ${clientName},</h2>
    <p>Nous espérons que vous avez passé un excellent séjour dans une propriété gérée par <strong>${ownerName}</strong>.</p>
    <p>Nous aimerions beaucoup connaître votre avis ! Prenez une minute pour laisser un commentaire.</p>
    <a href="${reviewLink}" class="button">Laisser un avis</a>
    <p>Vos retours nous aident à améliorer nos services et à garantir leur qualité sur toute notre plateforme.</p>
    <p>Merci encore d'avoir choisi The Landlord !</p>
  </div>
</body>
</html>
`;
const sendOwnerReviewRequestEmail = (ownerName, clientName, reviewLink) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background-color: #f1f1f1; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; }
    .container { max-width: 600px; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); }
    h1 { font-size: 24px; color: #2da680; }
    p { font-size: 16px; line-height: 1.5; }
    .logo { text-align: center; margin-bottom: 20px; }
    .logo img { max-width: 200px; }
    a.button { background-color: #2da680; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
    a.button:hover { background-color: #278eba; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="cid:landlordlogo" alt="The Landlord" />
    </div>
    <h1>Laissez un avis sur votre récent invité</h1>
    <h2>Bonjour ${ownerName},</h2>
    <p>Merci d’avoir hébergé <strong>${clientName}</strong> avec The Landlord. Votre avis nous aide à maintenir une expérience de haute qualité pour tous.</p>
    <p>Veuillez prendre un moment pour laisser un avis sur votre expérience avec cet invité.</p>
    <a href="${reviewLink}" class="button">Laisser un avis</a>
    <p>Nous apprécions votre temps et vos efforts pour faire prospérer notre communauté !</p>
    <p>L'équipe The Landlord</p>
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
        <p>Petit rappel : votre séjour commence dans 2 jours.</p>
        <p>Nous vous remercions de bien vouloir préparer le montant de la caution</p>
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

const checkinPlus1DayForStaff = (reservations) => `
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
        max-width: 1400px;
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
      }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .table-wrapper {
        width: 100%;
        overflow-x: auto;
        margin: 20px 0;
      }
      table {
        width: 100%;
        min-width: 1300px;
        border-collapse: collapse;
        font-size: 12px;
      }
      thead {
        background-color: #2da680;
        color: white;
      }
      th {
        padding: 12px 6px;
        text-align: left;
        font-weight: bold;
        border: 1px solid #ddd;
        font-size: 11px;
      }
      td {
        padding: 10px 6px;
        border: 1px solid #ddd;
      }
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      tbody tr:hover {
        background-color: #e8f5f1;
      }
      .net-a-payer {
        color: #2da680;
        font-weight: bold;
      }
      .breakdown-section {
        background-color: #333;
        color: white;
        padding: 8px;
        font-size: 11px;
        line-height: 1.8;
      }
      .breakdown-section strong {
        color: #2da680;
      }
      .breakdown-line {
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
      }
      .breakdown-total {
        border-top: 1px solid #555;
        margin-top: 5px;
        padding-top: 5px;
        font-weight: bold;
      }
      .footer {
        background-color: #2da680;
        padding: 30px;
        text-align: center;
        color: white;
        font-size: 16px;
        border-radius: 0 0 12px 12px;
      }
      .note {
        background-color: #e8f5f1;
        padding: 15px;
        border-left: 4px solid #2da680;
        margin: 20px 0;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>

      <div class="content">
        <h1>Récapitulatif Check-in J+1</h1>
        <p>Bonjour,</p>
        <p>Voici un récapitulatif des réservations qui ont eu leur <strong>check-in</strong> hier et dont le séjour est toujours en cours :</p>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Logement</th>
              <th>Client</th>
              <th>Email Client</th>
              <th>Tél Client</th>
              <th>Propriétaire</th>
              <th>Email Proprio</th>
              <th>Tél Proprio</th>
              <th>RIB</th>
              <th>Banque</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Net à donner</th>
              <th>Détails de paiement</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.map(r => `
              <tr>
                <td>${r.id}</td>
                <td>${r.propertyName}</td>
                <td>${r.clientName}</td>
                <td>${r.clientEmail}</td>
                <td>${r.clientPhone}</td>
                <td>${r.ownerName}</td>
                <td>${r.ownerEmail}</td>
                <td>${r.ownerPhone}</td>
                <td>${r.ownerRib}</td>
                <td>${r.ownerBankName}</td>
                <td>${r.dateFrom}</td>
                <td>${r.dateTo}</td>
                <td class="net-a-payer">${r.toPay.toFixed(2)} TND</td>
                <td>
                  <div class="breakdown-section">
                    <div class="breakdown-line">
                      <span>Prix/nuit:</span>
                      <strong>${r.priceNight.toFixed(2)} TND</strong>
                    </div>
                    <div class="breakdown-line">
                      <span>Durée:</span>
                      <strong>${r.duration} nuit${r.duration > 1 ? 's' : ''}</strong>
                    </div>
                    <div class="breakdown-line">
                      <span>Frais de ménage:</span>
                      <strong>${r.cleaning.toFixed(2)} TND</strong>
                    </div>
                    <div class="breakdown-line">
                      <span>Frais TL (client):</span>
                      <strong>${r.clientFees.toFixed(2)} TND</strong>
                    </div>
                    <div class="breakdown-line breakdown-total">
                      <span>Prix total séjour:</span>
                      <strong>${r.priceStaying.toFixed(2)} TND</strong>
                    </div>
                    <div class="breakdown-line">
                      <span>- Frais TL (proprio):</span>
                      <strong>-${r.ownerFees.toFixed(2)} TND</strong>
                    </div>
                    <div class="breakdown-line breakdown-total">
                      <span>= Net à donner:</span>
                      <strong style="color: #2da680;">${r.toPay.toFixed(2)} TND</strong>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="content">
        <div class="note">
          <strong>Note :</strong> Le montant "Net à donner" est calculé selon la formule suivante :<br>
          <strong>Prix total séjour - Frais TheLandlord (propriétaire) = Net à donner au propriétaire</strong>
          <br><br>
          Consultez la colonne "Détails de paiement" pour voir le calcul détaillé de chaque réservation.
        </div>

        <p>Veuillez consulter le tableau ci-dessus pour un récapitulatif complet des réservations concernées.</p>
      </div>

      <div class="footer">
        Cordialement,<br>L'équipe The Landlord
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
  //contractMail,
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
  addCohostEmail,
  acceptedRequestBooking,
  refusedRequestBooking,
  demandeBooking,
  canceledReservationClient,
  canceledReservationOwner,
  sendClientReviewRequestEmail,
  sendOwnerReviewRequestEmail,
  // Clear expired request
  expiredRequestClient,
  expiredRequestOwner,
  expiredConfirmedRequestClient,
  expiredConfirmedRequestOwner,
  prearrivalClient,
  checkinPlus1DayForStaff,
};
