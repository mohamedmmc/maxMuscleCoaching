/**
 * Email template generator (English).
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
<html lang="en">
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
        <h1>Your booking request is confirmed!</h1>
        <p>
          We are pleased to inform you that your booking request for the
          property <strong>${booking.property_name}</strong> from
          <strong>${booking.date_from}</strong> to
          <strong>${booking.date_to}</strong> has been approved.
        </p>
        <p>
          We have taken care to prepare your stay to meet your expectations.
          Below you will find all the essential information regarding your
          booking. Please feel free to contact us if needed.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}?date_from=${booking.date_from}&date_to=${booking.date_to}&id=${booking.id}" class="button">View my booking</a>
      </div>
      <div class="content">
        <h2>Important information</h2>
        <p><strong>Address:</strong> ${booking.location}</p>
        <p>
          <strong>Check-in:</strong> ${booking.date_from} from 4:00 PM
        </p>
        <p><strong>Check-out:</strong> ${booking.date_to} before 12:00 PM</p>
        <p>
          For any questions or assistance, our team is available 24/7.
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
        Thank you for choosing The Landlord.<br />
        We look forward to welcoming you!
      </div>
    </div>
  </body>
</html>
`;

const refusedRequestBooking = (booking) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Your booking has been declined</h1>
        <p>
          We are sorry to inform you that your booking request for the property <strong>${booking.name}</strong> from
          <strong>${booking.date_from}</strong> to
          <strong>${booking.date_to}</strong> could not be accepted.
        </p>
        <p>
          This decision may be due to a sudden unavailability of the property or other constraints. We encourage you to explore
          other available options on our platform.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="content">
        <h2>Need help?</h2>
        <p>
          Our team is available to assist you in finding an alternative that fits your needs.
        </p>
        <p>Feel free to contact us for any assistance.</p>
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
        Thank you for choosing The Landlord.<br />
        We hope to assist you with your next booking.
      </div>
    </div>
  </body>
</html>

`;
const demandeBooking = (booking, owner) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>New Booking Request</h1>
        <p>Hello <strong>${owner.name}</strong>,</p>
        <p>A new booking request has been received for your property <strong>${
          booking.property_name
        }</strong> located at <strong>${
  booking.location
}</strong> from <strong>${booking.date_from}</strong> to <strong>${
  booking.date_to
}</strong>.</p>
        <p>Please review the request and accept or decline it as soon as possible.</p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.property_name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="client-info">
        <h2>Client Information</h2>
        <img src="cid:client" alt="Client's photo" />
        <p><strong>Name:</strong> ${booking.client_name}</p>
        <p><strong>Email:</strong> <a href="mailto:${booking.email}">${
  booking.email
}</a></p>
        ${
          booking.phone_number
            ? `<p><strong>Phone:</strong> <a href="tel:${booking.phone_number}">${booking.phone_number}</a></p>`
            : ""
        }
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}" class="button">Manage Request</a>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn"><i class="fas fa-envelope"></i>contact@thelandlord.tn</a>
        <a href="https://wa.me/+21658595900"><i class="fas fa-phone"></i>+216 58 595 900</a>
        <a href="https://www.thelandlord.tn" target="_blank"><i class="fas fa-globe"></i>www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Thank you for using The Landlord.<br />
        We are here to assist you in managing your bookings.
      </div>
    </div>
  </body>
</html>
`;
const canceledReservationClient = (booking) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Your booking has been canceled</h1>
        <p>
          We confirm that your booking for the property 
          <strong>${booking.property_name}</strong> from 
          <strong>${booking.date_from}</strong> to 
          <strong>${booking.date_to}</strong> has been successfully canceled.
        </p>
        <p>
          We hope to see you again soon for a new booking.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        Thank you for using The Landlord.<br />
        See you soon!
      </div>
    </div>
  </body>
</html>

`;
const canceledReservationOwner = (booking) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>A reservation has been canceled</h1>
        <p>
          The client <strong>${
            booking.client_name
          }</strong> has canceled their booking 
          for your property <strong>${booking.property_name}</strong> from 
          <strong>${booking.date_from}</strong> to 
          <strong>${booking.date_to}</strong>.
          Reason: <strong>${booking.motif}</strong>.
        </p>
        <p>
          Here are their contact details:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:${booking.client_email}">${
  booking.client_email
}</a><br>
          ${
            booking.client_phone
              ? `<strong>Phone:</strong> <a href="tel:${booking.client_phone}">${booking.client_phone}</a>`
              : ""
          }
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        Log in to The Landlord to view your other bookings.
      </div>
    </div>
  </body>
</html>

`;
const emailPicture = () => `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Summer Vacation in Tunisia</title>
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
<html lang="en">
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
          alt="The Landlord"
        />
      </div>
      <div class="content">
        <h1>ALL SET FOR YOUR TRIP</h1>
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
            <p>Entire home</p>
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
            <img src="cid:owner" alt="Host" />
          </td>
        </tr>
      </table>
      <h3>Check IN / CHECK OUT</h3>
      <table class="check-in-out-table">
        <tr>
          <td class="check-in-out-text">
            <img src="cid:checkin" alt="Check In" />
            <p>
              <span class="top-text">ARRIVAL</span><br />
              <span class="middle-text">${reservation.date_from}</span><br />
              <span class="bottom-text">16:00</span>
            </p>

            <img src="cid:checkout" alt="Check Out" />
            <p>
              <span class="top-text">DEPARTURE</span><br />
              <span class="middle-text">${reservation.date_to}</span><br />
              <span class="bottom-text">12:00</span>
            </p>
          </td>
        </tr>
      </table>
      <h3>Address</h3>
      <div class="adresse">
        <div>${property.location}</div>
        <a
          href="https://www.google.com/maps/place/${property.latitude},${
  property.longitude
}"
        >
          <h3>Get Directions</h3>
        </a>
      </div>
      <div class="paiement">Payment</div>
      <table class="payment-row">
        <tr>
          <td class="payment-date">Payment made on ${getDate()}</td>
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
    <title>Invitation to Co-Host on The Landlord</title>
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
      <h1>Invitation to Co-Host on The Landlord</h1>
      <p>You have been invited to be a co-host for the following properties:</p>
      <table>
        <thead>
          <tr>
            <th>Picture</th>
            <th>House Name</th>
            <th>Privilege</th>
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
            <td>${house.privilege === "all" ? "All" : "Limited"}</td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <p>
        Please accept or decline this invitation by logging into your account on
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
            <h1 style="margin: 10px 0">The reservation of ${
              client.name == null ? `${client.email}` : `${client.name}`
            }
             </h1>
            <p style="margin: 10px 0">IS CONFIRMED</p>
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
                      <strong>${reservation.dayDiff} nights</strong>
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
                <h1 style="color: #2da680; text-align: center">Arrival</h1>
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
                <h1 style="color: #2da680; text-align: center">Departure</h1>
                <h2 style="color: black; text-align: center">${
                  reservation.date_to
                }</h2>
                
              </div>
            </td>
          </tr>
        </table>

        <div class="price-details">
          <h1>Price Details</h1>
          <table>
            <tr>
              <th>Nights</th>
              <td>${reservation.dayDiff}</td>
            </tr>
            ${
              isPriceChanged
                ? ``
                : `
            <tr>
              <th>${reservation.priceNight} TND x ${
                    reservation.dayDiff
                  } nights</th>
              <td>${reservation.totalCost} TND</td>
            </tr>
            
            ${
              reservation.remise != null
                ? `   <tr>
              <th>Weekly discount of ${reservation.remise}%</th>
              <td>${reservation.remisePrice} TND</td>
                  </tr>`
                : ``
            }
         
            <tr>
              <th>Cleaning fees</th>
              <td>${reservation.cleaningFees} TND</td>
            </tr>
                 ${
                   reservation.couponPercentage != null
                     ? `   <tr>
              <th>Coupon used -${reservation.couponPercentage}%</th>
              <td>${reservation.coupon} TND</td>
                  </tr>`
                     : ``
                 }
         
            <tr>
              <th>Subtotal</th>
              <td>${reservation.subtotal} TND</td>
            </tr>
            <tr>
              <th>The Landlord Fees</th>
              <td>-${reservation.thelandlordFees} TND</td>
            </tr>
            <tr>
              <th>VAT Fees</th>
              <td>-${reservation.tvaFees} TND</td>
            </tr>`
            }
            <tr>
              <th>Total gain</th>
              <td>${reservation.priceTotal} TND</td>
            </tr>
            <tr>
              <th>Payment type</th>
              <td>Credit Card</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="footer">
        <h1 style="color: #333">THANK YOU</h1>
        <h1 style="color: #2da680">The Landlord Team</h1>
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
      <h1>New message from The Landlord</h1>
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
        We have received a new message on The Landlord. You can view and respond to this message by logging into your account.
      </p>
      <p>
        If you have any questions or concerns, please feel free to contact us.
      </p>
      <p>
        Thank you for your trust in The Landlord. We are here to provide you with the best possible experience.
      </p>
      <p>The Landlord Team</p>
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
      <h1>Thank you for your trust in The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img class="small-image" src="cid:property" alt="Property Image" />
        <p>${property.address}</p>
      </div>
      <p>
        Your property has been successfully added to The Landlord and is currently being processed. Our team is actively working to verify your property details, and this will not take long.
      </p>
      <p>
        We will contact you as soon as possible to keep you updated on the progress and provide any necessary clarifications.
      </p>
      <p>
        Thank you again for your trust and patience. We are here to provide you with the best possible experience.
      </p>
      <p>
        Best regards,<br />
        The Landlord Team
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
      <h1>New Property Added on The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img class="small-image" src="cid:property" alt="Property Image" />
        <p>${property.address}</p>
        <div class="owner-details">
          <span><strong>Email:</strong> ${owner.email}</span>
          <span><strong>Phone:</strong> ${owner.phone_number}</span>
        </div>
      </div>
      <p>
        A new property has been added to The Landlord. The team at The
        Landlord is requested to verify the property details, modify the
        information if necessary, approve the listing, and contact the host for
        any additional clarification.
      </p>
      <p>
        Thank you for your promptness and professionalism in handling this new
        property.
      </p>
      <p>
        Best regards,<br />
        The Landlord Team
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
		<h1>Confirmation of Your Reservation at The Landlord</h1>
    
		<p>On behalf of the entire team at The Landlord, I am pleased to confirm your reservation for “${propertyName}” and to welcome you.</p>
		<p>To facilitate your arrival and stay, please use the following link to check in online. You will only need to enter your reservation code <strong>${idReservation}</strong> and follow the steps indicated: 
    www.checkin.thelandlord.tn </p>
		<p>At The Landlord, we are committed to offering our clients quality accommodations and impeccable service. Your comfort and satisfaction are our priorities.</p>
		<p>We also invite you to share your experience by responding to the satisfaction survey that will be provided on the day of your departure. Your feedback is valuable and helps us to continually improve our services.</p>
		<p>We wish you a pleasant stay and remain at your disposal for any requests or further information.</p>
		<p>Sincerely,</p>
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
    <title>Error when adding a reservation</title>
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
      <h1>Error when adding a reservation</h1>

      <p>Dear team at <strong>The Landlord</strong>,</p>
      <p>
        An error occurred while adding the reservation for the property
        <strong>“${propertyName}”</strong>.
      </p>
      <p class="error-message">
        Error details: Unable to add the reservation from ${dateFrom} to ${dateTo}.
      </p>
      <p>Reservation details:</p>
      <ul>
        <li>
          Property: <strong>${propertyName}</strong> (ID: ${propertyId})
        </li>
        <li>
          Reservation dates: from <strong>${dateFrom}</strong> to
          <strong>${dateTo}</strong>
        </li>
        <li>Client price: <strong>${clientPrice} TND</strong></li>
        <li>
          Reservation ID: <strong>${idReservation}</strong>
        </li>
      </ul>
      <p>Client information:</p>
      <ul>
        <li>
          Client name: <strong>${
            clientName ? clientName : "Not available"
          }</strong>
        </li>
        <li>
          Email: <strong>${clientEmail ? clientEmail : "Not available"}</strong>
        </li>
        <li>
          Phone: <strong>${
            clientPhoneNumber ? clientPhoneNumber : "Not available"
          }</strong>
        </li>
      </ul>
      <p class="error-message">Error message: ${errorMessage}</p>
      <p>
        Please contact the client as soon as possible to resolve this issue.
        We apologize for the inconvenience and are available for any further
        information.
      </p>
      <p>Sincerely,</p>
      <p>The technical team at The Landlord</p>
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
 * Send Email to reset password
 * @param {String} fullName User full name
 * @param {*} email User email
 * @param {String} APIDPOINT Depends on whether the app is running locally or on the server
 * @param {String} token Generated unique code
 * @returns
 */
const forgotPasswordEmailTemplate = (reset_code) => `
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
        color: #2da680; /* Main Color */
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
        font-size: 20px; /* Larger font size for better readability */
        color: #333; /* Dark color for high contrast with the code */
        font-weight: bold; /* Bold to highlight importance */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>Reset Your Password</h1>
      <div class="card">
        <p>
          Please use the following code to reset your password:
        </p>
        <p class="code">${reset_code}</p>
        <p>
          This code will expire in 30 minutes. Enter it quickly to reset your password.
        </p>
      </div>
      <p>
        If you did not request a password reset, please ignore this email or contact us if you have concerns about the security of your account.
      </p>
      <p>
        Thank you for using The Landlord. We are here to provide you with the best possible experience.
      </p>
      <p>The Landlord Team</p>
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
        Password Reset Confirmation
      </title>
    </head>
    <body>
      <div>
        <p>Hello ${fullName},</p>
        <p>Your password has been successfully reset.</p>
        <p>
          You can now log in with your new password.
        </p>
        <p>Best regards,</p>
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
          <h1>Confirm Your Email Address for The Landlord</h1>
      <h2>${fullName ? `Hello ${fullName}` : ``}</h2>
          <p>We are excited to welcome you to The Landlord. Before you get started, we need to confirm your email address.</p>
    
       <p>Here is your code:</p>
       <p>${code}</p>
      
        <p>By confirming your email, you will be able to fully enjoy our services and stay informed about the latest news and exclusive offers.</p>
      <p>If you did not create an account on The Landlord, please ignore this email or let us know.</p>
      <p>We look forward to offering you the best possible experience.</p>
      <p>Raise Your Expectations, 
  The Landlord Team</p>
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
  clientEmail,
  currency
) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>New Reservation on The Landlord</title>
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
        <h1>New Reservation on The Landlord</h1>
        <p>A new reservation has been made:</p>
        <div class="reservation-details">
         
            ${
              clientName ? ` <p><strong>Client:</strong> ${clientName}</p>` : ""
            }
          <p><strong>Email:</strong> ${clientEmail}</p>
          ${clientPhone ? `<p><strong>Phone:</strong> ${clientPhone}</p>` : ""}
        
          <p><strong>Start Date:</strong> ${date_from}</p>
          <p><strong>End Date:</strong>  ${date_to}</p>
          <p>
            <strong>Property Name:</strong>
            <a href="${
              process.env.LANDLORD_WEB
            }/property-details/${property_id}" class="house-link">${propertyName}</a>
          </p>
          <p><strong>Price:</strong> ${price} ${currency}</p>
          <p>
            <strong>Reservation ID:</strong>
            
              ${reservation_id}
            
          </p>
        </div>
        <p>
          Please take the necessary steps to prepare for this reservation
          and inform the client of all relevant details.
        </p>
  
        <p>Best regards, The Landlord Team</p>
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
            <strong>${foundProperty.name}</strong> for 
            <strong>${mappedPriceTotal.email}</strong>
        ${
          mappedPriceTotal.phone_number != null
            ? `<strong> contact via ${mappedPriceTotal.phone_number}</strong>.`
            : ""
        }    
  
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
              ${
                mappedPriceTotal.feesPrice != null
                  ? `
                  <tr>
                <th>Service Fees</th>
                <td>${mappedPriceTotal.feesPrice} TND</td>
              </tr>`
                  : ""
              }
            
              ${
                mappedPriceTotal.couponPercentage != null
                  ? `
                    <tr>
                <th>Coupon Discount (${mappedPriceTotal.couponPercentage}%)</th>
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
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmation of Your Property Approval - The Landlord</title>
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
          <h1>Your Property Has Been Approved</h1>
          <p>Hello ${clientName},</p>
          <p>
            We are pleased to inform you that your property has been approved by
            The Landlord team. It is now available on our platform and can be
            viewed by users.
          </p>
          <p>
            You can now access your property and manage your listings directly
            from your account.
          </p>
          <div class="button-container">
            <a href="${propertyLink}" class="button">View My Property</a>
          </div>
          <p>
            If you have any questions or need further information, please feel
            free to contact us.
          </p>
        </div>
        <div class="footer">
          <p>Thank you,<br />The Landlord Team</p>
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
          <h1>Add Multiple Properties</h1>
          <p>Dear Team,</p>
          <p>
            A request to add multiple properties from another website has been
            made on the site.
          </p>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Subject:</strong> ${subject}</li>
            <li><strong>Message:</strong> ${body}</li>
            <li><strong>Number of Properties:</strong> ${properties}</li>
            <li><strong>Source:</strong> ${source}</li>
          </ul>
          <p>Please respond to this request as soon as possible.</p>
        </div>
        <div class="footer">
          <p>Thank you,<br />The Landlord Team</p>
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
    body {
      background-color: #f1f1f1;
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
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
      color: #2da680;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 200px;
    }
    a.button {
      background-color: #2da680;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 20px;
    }
    a.button:hover {
      background-color: #278eba;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="cid:landlordlogo" alt="The Landlord" />
    </div>
    <h1>Tell Us About Your Stay</h1>
    <h2>Hello ${clientName},</h2>
    <p>We hope you had a great experience staying at a property managed by <strong>${ownerName}</strong>.</p>
    <p>We would love to hear your thoughts! Please take a minute to leave a review.</p>
    <a href="${reviewLink}" class="button">Write a Review</a>
    <p>Your feedback helps us improve and maintain quality across our platform.</p>
    <p>Thanks again for choosing The Landlord!</p>
  </div>
</body>
</html>
`;
const sendOwnerReviewRequestEmail = (ownerName, clientName, reviewLink) => `
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
      padding: 20px;
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
      color: #2da680;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-width: 200px;
    }
    a.button {
      background-color: #2da680;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 20px;
    }
    a.button:hover {
      background-color: #278eba;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="cid:landlordlogo" alt="The Landlord" />
    </div>
    <h1>Review Your Recent Guest</h1>
    <h2>Hello ${ownerName},</h2>
    <p>Thank you for hosting <strong>${clientName}</strong> with The Landlord. Your feedback helps maintain a high-quality experience for everyone.</p>
    <p>Please take a moment to leave a review about your experience with the guest.</p>
    <a href="${reviewLink}" class="button">Leave a Review</a>
    <p>We appreciate your time and effort to keep our community thriving!</p>
    <p>The Landlord Team</p>
  </div>
</body>
</html>
`;

const expiredRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Booking Request Expired</h1>
        <p>
          We regret to inform you that your booking request for the property
          <strong>${name}</strong> from
          <strong>${booking.date_from}</strong> to
          <strong>${booking.date_to}</strong> was not confirmed by the owner
          within the required 24-hour window.
        </p>
        <p>
          You can browse other available properties or contact our team for
          assistance. We’re here to help you find the perfect stay.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">Browse Properties</a>
      </div>
      <div class="content">
        <h2>Need Help?</h2>
        <p>
          Our team is available 24/7 to assist you with your next booking or
          answer any questions.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Thank you for using The Landlord. We hope to welcome you soon!
      </div>
    </div>
  </body>
</html>
`;

const expiredRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Booking Request Expired</h1>
        <p>
          You did not confirm the booking request for your property
          <strong>${name}</strong> from
          <strong>${booking.date_from}</strong> to
          <strong>${booking.date_to}</strong> within the required 24-hour window.
        </p>
        <p>
          As a result, the request has expired and the client has been notified.
          We encourage you to respond promptly to future requests to avoid missed opportunities.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}" class="button">View Property</a>
      </div>
      <div class="content">
        <h2>Need Help?</h2>
        <p>
          Our team is available 24/7 to assist you with managing your listings and improving your response rate.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Thank you for partnering with The Landlord. Let’s keep your calendar full!
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Your booking request has expired</h1>
        <p>
          The owner of <strong>${name}</strong> accepted your booking request for
          <strong>${booking.date_from}</strong> to <strong>${booking.date_to}</strong>.
        </p>
        <p>
          However, we did not receive your confirmation within 24 hours.
          The booking has now expired and will not be processed.
        </p>
        <p>
          You can browse other available properties or contact our team for assistance.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt=${name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">Browse properties</a>
      </div>
      <div class="content">
        <h2>Need help?</h2>
        <p>
          Our team is available 24/7 to help you find the perfect stay or answer any questions.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Thank you for using The Landlord. We hope to welcome you soon!
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="en">
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
        <h1>Client did not confirm the booking</h1>
        <p>
          You accepted the booking request for your property
          <strong>${name}</strong> from
          <strong>${booking.date_from}</strong> to
          <strong>${booking.date_to}</strong>, but the client did not confirm within 24 hours.
        </p>
        <p>
          As a result, the request has expired. You may relist these dates or consider other pending requests.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/owner/requests/\${booking.id}" class="button">View booking request</a>
      </div>
      <div class="content">
        <h2>Booking details</h2>
        <p><strong>Property:</strong> ${name}</p>
        <p><strong>Dates:</strong> ${booking.date_from} → ${booking.date_to}</p>
        <p><strong>Request ID:</strong> ${booking.id}</p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        Thank you for partnering with The Landlord.
      </div>
    </div>
  </body>
</html>
`;

// Client reminder: still 2 days before check-in (same design as your template)
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
        font-weight: bold;
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
      <!-- Header / Logo -->
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>

      <!-- Title & short reminder -->
      <div class="content">
        <h1>Still 2 days before your check-in</h1>
        <p>Friendly reminder: your stay begins in 2 days.</p>
        <p>We kindly request that you have the security deposit amount prepared.</p>
      </div>

      <!-- Hero image -->
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2 style="margin-top:16px; color:#2da680;">${name}</h2>
      </div>

      <!-- Reservation details -->
      <div class="content">
        <h2 style="color:#2da680; font-size:22px; margin-bottom:12px;">Reservation details</h2>
        <p><strong>Property:</strong> ${name}</p>
        <p><strong>Dates:</strong> ${booking.date_from} → ${booking.date_to}</p>
        ${
          booking.duration
            ? `<p><strong>Nights:</strong> ${booking.duration}</p>`
            : ``
        }
  
      </div>



      <!-- Contacts -->
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>

      <!-- Footer -->
      <div class="footer">
        We remain at your disposal for any assistance.
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
  //Clear old requests
  expiredRequestClient,
  expiredRequestOwner,
  expiredConfirmedRequestClient,
  expiredConfirmedRequestOwner,
  prearrivalClient,
};
