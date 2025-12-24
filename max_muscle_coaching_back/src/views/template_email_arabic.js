/**
 * Email template generator (Arabic).
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
<html lang="ar">
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
        direction: rtl; /* Right to left for Arabic */
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
        <h1>تم تأكيد طلب الحجز الخاص بك!</h1>
        <p>
          يسرنا أن نعلمك أن طلب الحجز الخاص بك للمنزل <strong>${booking.property_name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong> قد تم الموافقة عليه.
        </p>
        <p>
          لقد قمنا بالاهتمام بتحضير إقامتك لتلبية توقعاتك. أدناه ستجد جميع المعلومات الأساسية المتعلقة بحجزك. لا تتردد في الاتصال بنا إذا كنت بحاجة إلى المساعدة.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}?date_from=${booking.date_from}&date_to=${booking.date_to}&id=${booking.id}" class="button">عرض حجزتي</a>
      </div>
      <div class="content">
        <h2>معلومات هامة</h2>
        <p><strong>العنوان:</strong> ${booking.location}</p>
        <p>
          <strong>تسجيل الوصول:</strong> ${booking.date_from} من الساعة 4:00 مساءً
        </p>
        <p><strong>تسجيل المغادرة:</strong> ${booking.date_to} قبل الساعة 12:00 مساءً</p>
        <p>
          لأي استفسارات أو مساعدة، فريقنا متاح على مدار الساعة.
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
        شكراً لاختيارك The Landlord.<br />
        نحن نتطلع لاستقبالك!
      </div>
    </div>
  </body>
</html>
`;
const refusedRequestBooking = (booking) => `
<!DOCTYPE html>
<html lang="ar">
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
        direction: rtl; /* Right to left for Arabic */
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
        <h1>تم رفض حجزك</h1>
        <p>
          نأسف لإبلاغك أن طلب الحجز الخاص بك للمنزل <strong>${booking.name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong> لم يتم قبوله.
        </p>
        <p>
          قد يكون هذا القرار بسبب عدم توفر العقار فجأة أو بسبب قيود أخرى. نوصيك باستكشاف
          الخيارات الأخرى المتاحة على منصتنا.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="content">
        <h2>هل تحتاج إلى مساعدة؟</h2>
        <p>
          فريقنا متاح لمساعدتك في العثور على بديل يناسب احتياجاتك.
        </p>
        <p>لا تتردد في الاتصال بنا للحصول على أي مساعدة.</p>
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
        شكراً لاختيارك The Landlord.<br />
        نأمل أن نتمكن من مساعدتك في حجزك القادم.
      </div>
    </div>
  </body>
</html>

`;
const demandeBooking = (booking, owner) => `
<!DOCTYPE html>
<html lang="ar">
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
        direction: rtl; /* Right to left for Arabic */
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
        <h1>تم استلام طلب الحجز الجديد</h1>
        <p>مرحباً <strong>${owner.name}</strong>,</p>
        <p>تم استلام طلب حجز جديد لعقارك <strong>${
          booking.property_name
        }</strong> الواقع في <strong>${booking.location}</strong> من <strong>${
  booking.date_from
}</strong> إلى <strong>${booking.date_to}</strong>.</p>
        <p>يرجى مراجعة الطلب وقبوله أو رفضه في أقرب وقت ممكن.</p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.name}" />
        <h2>${booking.property_name}</h2>
        <p>${booking.location}</p>
      </div>
      <div class="client-info">
        <h2>معلومات العميل</h2>
        <img src="cid:client" alt="صورة العميل" />
        <p><strong>الاسم:</strong> ${booking.client_name}</p>
        <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${
          booking.email
        }">${booking.email}</a></p>
        ${
          booking.phone_number
            ? `<p><strong>الهاتف:</strong> <a href="tel:${booking.phone_number}">${booking.phone_number}</a></p>`
            : ""
        }
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}" class="button">إدارة الطلب</a>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn"><i class="fas fa-envelope"></i>contact@thelandlord.tn</a>
        <a href="https://wa.me/+21658595900"><i class="fas fa-phone"></i>+216 58 595 900</a>
        <a href="https://www.thelandlord.tn" target="_blank"><i class="fas fa-globe"></i>www.thelandlord.tn</a>
      </div>
      <div class="footer">
        شكراً لاستخدامك The Landlord.<br />
        نحن هنا لمساعدتك في إدارة حجوزاتك.
      </div>
    </div>
  </body>
</html>

`;
const canceledReservationClient = (booking) => `
<!DOCTYPE html>
<html lang="ar">
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
        direction: rtl; /* Right to left for Arabic */
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
        <h1>تم إلغاء حجزك</h1>
        <p>
          نؤكد لك أن الحجز الخاص بك للعقار <strong>${booking.property_name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong> تم إلغاؤه بنجاح.
        </p>
        <p>
          نأمل أن نراك مرة أخرى قريبًا لحجز جديد.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        شكرًا لاستخدامك The Landlord.<br />
        نراكم قريبًا!
      </div>
    </div>
  </body>
</html>

`;
const canceledReservationOwner = (booking) => `
<!DOCTYPE html>
<html lang="ar">
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
        <h1>تم إلغاء الحجز</h1>
        <p>
          العميل <strong>${booking.client_name}</strong> قد ألغى حجزه
          لخاصتك <strong>${booking.property_name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong>.
          السبب: <strong>${booking.motif}</strong>.
        </p>
        <p>
          فيما يلي تفاصيل الاتصال بهم:
        </p>
        <p>
          <strong>البريد الإلكتروني:</strong> <a href="mailto:${
            booking.client_email
          }">${booking.client_email}</a><br>
          ${
            booking.client_phone
              ? `<strong>الهاتف:</strong> <a href="tel:${booking.client_phone}">${booking.client_phone}</a>`
              : ""
          }
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${booking.property_name}" />
        <h2>${booking.property_name}</h2>
      </div>
      <div class="footer">
        قم بتسجيل الدخول إلى The Landlord لمراجعة حجوزاتك الأخرى.
      </div>
    </div>
  </body>
</html>

`;

const emailPicture = () => `
<html lang="ar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>عطلتك الصيفية في تونس</title>
    <style>
      a {
        color: black;
      }
      body {
        margin-top: -20px;
        margin: 0;
        padding: 0;
        text-align: center;
        direction: rtl; /* Right to left for Arabic */
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
      <img src="cid:background" alt="صورة العطلة" />
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
<html lang="ar">
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
        <h1>كل شيء جاهز لرحلتك</h1>
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
            <p>منزل كامل</p>
            ${
              owner.phone_number != null
                ? `   <div class="contact-info">
              <img src="cid:phone" alt="هاتف" />
              <span>${owner.phone_number}</span>
            </div>`
                : ""
            }
         
            <div class="contact-info">
              <img src="cid:email" alt="البريد الإلكتروني" />
              <span>${owner.email}</span>
            </div>
          </td>
          <td class="details-right">
            <img src="cid:owner" alt="المالك" />
          </td>
        </tr>
      </table>
      <h3>تسجيل الوصول / تسجيل المغادرة</h3>
      <table class="check-in-out-table">
        <tr>
          <td class="check-in-out-text">
            <img src="cid:checkin" alt="تسجيل الوصول" />
            <p>
              <span class="top-text">الوصول</span><br />
              <span class="middle-text">${reservation.date_from}</span><br />
              <span class="bottom-text">16:00</span>
            </p>

            <img src="cid:checkout" alt="تسجيل المغادرة" />
            <p>
              <span class="top-text">المغادرة</span><br />
              <span class="middle-text">${reservation.date_to}</span><br />
              <span class="bottom-text">12:00</span>
            </p>
          </td>
        </tr>
      </table>
      <h3>العنوان</h3>
      <div class="adresse">
        <div>${property.location}</div>
        <a
          href="https://www.google.com/maps/place/${property.latitude},${
  property.longitude
}"
        >
          <h3>احصل على الاتجاهات</h3>
        </a>
      </div>
      <div class="paiement">الدفع</div>
      <table class="payment-row">
        <tr>
          <td class="payment-date">تم الدفع في ${getDate()}</td>
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
    <title>دعوة لتصبح مساعد مضيف في The Landlord</title>
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
      <h1>دعوة لتصبح مساعد مضيف في The Landlord</h1>
      <p>تم دعوتك لتكون مساعد مضيف للعقارات التالية:</p>
      <table>
        <thead>
          <tr>
            <th>الصورة</th>
            <th>اسم العقار</th>
            <th>الامتيازات</th>
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
            <td>${house.privilege === "all" ? "الجميع" : "محدود"}</td>
          </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <p>
        يرجى قبول أو رفض هذه الدعوة عن طريق تسجيل الدخول إلى حسابك في
        <a
          href="${process.env.LANDLORD_WEB}"
          style="color: #2da680; text-decoration: underline"
          >The Landlord</a
        >.
      </p>
      <p>مع خالص التحيات، فريق The Landlord</p>
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
<html lang="ar">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>التأكيد</title>
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
            <h1 style="margin: 10px 0">تم تأكيد حجز ${
              client.name == null ? `${client.email}` : `${client.name}`
            }
             </h1>
            <p style="margin: 10px 0">تم تأكيد الحجز بنجاح</p>
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
                      <strong>${reservation.dayDiff} ليالٍ</strong>
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
                <h1 style="color: #2da680; text-align: center">الوصول</h1>
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
                <h1 style="color: #2da680; text-align: center">المغادرة</h1>
                <h2 style="color: black; text-align: center">${
                  reservation.date_to
                }</h2>
                
              </div>
            </td>
          </tr>
        </table>

        <div class="price-details">
          <h1>تفاصيل السعر</h1>
          <table>
            <tr>
              <th>الليالي</th>
              <td>${reservation.dayDiff}</td>
            </tr>
            ${
              isPriceChanged
                ? ``
                : `
            <tr>
              <th>${reservation.priceNight} TND x ${
                    reservation.dayDiff
                  } ليالٍ</th>
              <td>${reservation.totalCost} TND</td>
            </tr>
            
            ${
              reservation.remise != null
                ? `   <tr>
              <th>خصم أسبوعي بنسبة ${reservation.remise}%</th>
              <td>${reservation.remisePrice} TND</td>
                  </tr>`
                : ``
            }
         
            <tr>
              <th>رسوم التنظيف</th>
              <td>${reservation.cleaningFees} TND</td>
            </tr>
                 ${
                   reservation.couponPercentage != null
                     ? `   <tr>
              <th>القسيمة المستخدمة -${reservation.couponPercentage}%</th>
              <td>${reservation.coupon} TND</td>
                  </tr>`
                     : ``
                 }
         
            <tr>
              <th>المجموع الفرعي</th>
              <td>${reservation.subtotal} TND</td>
            </tr>
            <tr>
              <th>رسوم The Landlord</th>
              <td>-${reservation.thelandlordFees} TND</td>
            </tr>
            <tr>
              <th>رسوم ضريبة القيمة المضافة</th>
              <td>-${reservation.tvaFees} TND</td>
            </tr>`
            }
            <tr>
              <th>الإجمالي</th>
              <td>${reservation.priceTotal} TND</td>
            </tr>
            <tr>
              <th>طريقة الدفع</th>
              <td>بطاقة ائتمان</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="footer">
        <h1 style="color: #333">شكرًا</h1>
        <h1 style="color: #2da680">فريق The Landlord</h1>
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
      <h1>رسالة جديدة من The Landlord</h1>
      <div class="card">
        <h2>${sender.name}</h2>
        <p>${message}</p>
        <img
          class="small-image"
          src="${property.url}"
          alt="صورة صغيرة"
        />
      </div>
      <p>
        لقد تلقينا رسالة جديدة على The Landlord. يمكنك مشاهدة والرد على هذه الرسالة من خلال تسجيل الدخول إلى حسابك.
      </p>
      <p>
        إذا كانت لديك أي أسئلة أو استفسارات، لا تتردد في الاتصال بنا.
      </p>
      <p>
        شكراً لثقتك في The Landlord. نحن هنا لنقدم لك أفضل تجربة ممكنة.
      </p>
      <p>فريق The Landlord</p>
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
      <h1>شكراً لثقتك في The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img class="small-image" src="cid:property" alt="صورة العقار" />
        <p>${property.address}</p>
      </div>
      <p>
        تم إضافة عقارك بنجاح إلى The Landlord وهو الآن قيد المعالجة. يعمل فريقنا بنشاط للتحقق من تفاصيل عقارك، ولن يستغرق الأمر وقتًا طويلاً.
      </p>
      <p>
        سنتواصل معك في أقرب وقت ممكن لإبقائك على اطلاع بشأن التقدم ولأي توضيحات ضرورية.
      </p>
      <p>
        شكرًا مرة أخرى على ثقتك وصبرك. نحن هنا لتوفير أفضل تجربة ممكنة لك.
      </p>
      <p>
        مع خالص التحيات،<br />
        فريق The Landlord
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
      <h1>تم إضافة عقار جديد على The Landlord</h1>
      <div class="card">
        <h2>${owner.name}</h2>
        <img class="small-image" src="cid:property" alt="صورة العقار" />
        <p>${property.address}</p>
        <div class="owner-details">
          <span><strong>البريد الإلكتروني:</strong> ${owner.email}</span>
          <span><strong>الهاتف:</strong> ${owner.phone_number}</span>
        </div>
      </div>
      <p>
        تم إضافة عقار جديد على The Landlord. يُطلب من فريق The Landlord التحقق من تفاصيل العقار، تعديل المعلومات إذا لزم الأمر، الموافقة على النشر، والتواصل مع المضيف لأي توضيحات إضافية.
      </p>
      <p>
        شكراً لسرعتك واحترافيتك في التعامل مع هذا العقار الجديد.
      </p>
      <p>
        مع خالص التحيات،<br />
        فريق The Landlord
      </p>
    </div>
  </body>
</html>
`;
const emailReservationForCheckin = (propertyName, idReservation) => `
<!DOCTYPE html>
<html>
<head>
	<title>مرحباً بك في The Landlord</title>
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
        text-align: center;
        color: #2da680; /* اللون الأساسي */
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
        line-height: 1.5;
        text-align: center;
        /* اللون: #2da680؛ اللون الأساسي */
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
			<img src="cid:landlordlogo" alt="The Landlord" />
		</div>
		<h1>تأكيد حجزك في The Landlord</h1>
    
		<p>بالنيابة عن فريق The Landlord، يسرني أن أؤكد لك حجزك لـ “${propertyName}” وأرحب بك.</p>
		<p>لتسهيل وصولك وإقامتك، يرجى استخدام الرابط التالي لإجراء تسجيل الوصول عبر الإنترنت. ستحتاج فقط إلى إدخال رمز الحجز <strong>${idReservation}</strong> واتباع الخطوات الموضحة: 
    www.checkin.thelandlord.tn </p>
		<p>في The Landlord، نحن ملتزمون بتقديم أماكن إقامة عالية الجودة وخدمة لا تشوبها شائبة لعملائنا. راحتك ورضاك هما أولويتنا.</p>
		<p>ندعوك أيضًا لمشاركة تجربتك من خلال الرد على استبيان الرضا الذي سيتم تقديمه لك في يوم مغادرتك. ملاحظاتك قيمة وتساعدنا في تحسين خدماتنا بشكل مستمر.</p>
		<p>نتمنى لك إقامة ممتعة ونحن هنا لتقديم أفضل تجربة ممكنة لك.</p>
		<p>مع خالص التحيات،</p>
		<p>فاروق بن عاشور</p>
		<p>الرئيس التنفيذي</p>
		<p>رفع توقعاتك</p>
    
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
    <title>خطأ في إضافة الحجز</title>
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
      <h1>خطأ في إضافة الحجز</h1>

      <p>فريق <strong>The Landlord</strong> المحترم،</p>
      <p>
        حدث خطأ أثناء إضافة الحجز للعقار
        <strong>“${propertyName}”</strong>.
      </p>
      <p class="error-message">
        تفاصيل الخطأ: تعذر إضافة الحجز من ${dateFrom} إلى ${dateTo}.
      </p>
      <p>تفاصيل الحجز:</p>
      <ul>
        <li>
          العقار: <strong>${propertyName}</strong> (ID: ${propertyId})
        </li>
        <li>
          تواريخ الحجز: من <strong>${dateFrom}</strong> إلى
          <strong>${dateTo}</strong>
        </li>
        <li>سعر العميل: <strong>${clientPrice} TND</strong></li>
        <li>
          معرف الحجز: <strong>${idReservation}</strong>
        </li>
      </ul>
      <p>معلومات العميل:</p>
      <ul>
        <li>
          اسم العميل: <strong>${clientName ? clientName : "غير متوفر"}</strong>
        </li>
        <li>
          البريد الإلكتروني: <strong>${
            clientEmail ? clientEmail : "غير متوفر"
          }</strong>
        </li>
        <li>
          الهاتف: <strong>${
            clientPhoneNumber ? clientPhoneNumber : "غير متوفر"
          }</strong>
        </li>
      </ul>
      <p class="error-message">رسالة الخطأ: ${errorMessage}</p>
      <p>
        يرجى الاتصال بالعميل في أقرب وقت ممكن لحل هذه المشكلة.
        نعتذر عن الإزعاج ونحن متاحون لأي معلومات إضافية.
      </p>
      <p>مع خالص التحيات،</p>
      <p>فريق الدعم الفني في The Landlord</p>
      <p>رفع توقعاتك</p>
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
      }
      .small-image {
        max-width: 100px; /* Set the maximum width of the image */
        height: auto; /* Maintain aspect ratio */
        margin-bottom: 10px;
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
      <h1>مرحباً بك في برنامج الشراكة مع The Landlord</h1>
      <div class="card">
        <p>عزيزي الشريك،</p>
        <p>
          يسرنا أن نرحب بك كأحدث شريك لنا! هذه الشراكة تمثل بداية رحلة واعدة، ونحن ملتزمون بضمان نجاحها. كجزء من شراكتنا، يسرنا أن نوفر لك الوصول إلى وثائق API الخاصة بنا عبر Swagger. ستسهل هذه الأداة تكامل سلس واستكشاف نقاط نهاية API الخاصة بنا، مما يتيح لك الاستفادة الكاملة من خدماتنا.
        </p>
        <p>
          يرجى النقر على الرابط التالي للوصول إلى Swagger واستكشاف نقاط النهاية الخاصة بنا:
          <a class="link" href="https://api.thelandlord.tn/swagger"
            >توثيق Swagger</a
          >
        </p>
        <p>فيما يلي بيانات تسجيل الدخول الخاصة بك للوصول إلى Swagger:</p>
        <ul>
          <li>البريد الإلكتروني: ${email}</li>
          <li>كلمة المرور: ${password}</li>
        </ul>
      </div>
      <p>
        يرجى اتباع الرابط المقدم للوصول إلى واجهة Swagger والانغماس في التوثيق الشامل الذي أعددناه لك. إذا كنت بحاجة إلى أي مساعدة أو لديك أي أسئلة، لا تتردد في الاتصال بنا.
      </p>
      <p>
        نحن نتطلع إلى شراكة مثمرة ودائمة.
      </p>
      <p>مع خالص التحيات،</p>
      <p>فريق The Landlord</p>
    </div>
  </body>
</html>
`;
/**
 * إرسال بريد إلكتروني لإعادة تعيين كلمة المرور
 * @param {String} fullName الاسم الكامل للمستخدم
 * @param {*} email بريد المستخدم الإلكتروني
 * @param {String} API_ENDPOINT يعتمد على ما إذا كانت التطبيق يعمل محليًا أو على الخادم
 * @param {String} token رمز فريد تم إنشاؤه
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
        color: #2da680; /* اللون الأساسي */
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
        font-size: 20px; /* حجم الخط أكبر لسهولة القراءة */
        color: #333; /* لون داكن ليتناسب مع الكود */
        font-weight: bold; /* الخط العريض لتسليط الضوء على الأهمية */
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>
      <h1>إعادة تعيين كلمة المرور الخاصة بك</h1>
      <div class="card">
        <p>
          يرجى استخدام الرمز التالي لإعادة تعيين كلمة المرور الخاصة بك:
        </p>
        <p class="code">${reset_code}</p>
        <p>
          سينتهي هذا الرمز خلال 30 دقيقة. يرجى إدخاله بسرعة لإعادة تعيين كلمة المرور الخاصة بك.
        </p>
      </div>
      <p>
        إذا لم تطلب إعادة تعيين كلمة المرور الخاصة بك، يرجى تجاهل هذا البريد الإلكتروني أو الاتصال بنا إذا كانت لديك أي مخاوف بشأن أمان حسابك.
      </p>
      <p>
        شكرًا لك على استخدام The Landlord. نحن هنا لتقديم أفضل تجربة ممكنة لك.
      </p>
      <p>فريق The Landlord</p>
    </div>
  </body>
</html>
`;
/**
 * بريد إلكتروني للتأكيد بعد إعادة تعيين كلمة المرور بنجاح
 * @param {String} fullName الاسم الكامل للمستخدم
 * @returns
 */
const resetPasswordConfirmationEmailTemplate = (fullName) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>
        تأكيد إعادة تعيين كلمة المرور
      </title>
    </head>
    <body>
      <div>
        <p>مرحباً ${fullName},</p>
        <p>تم إعادة تعيين كلمة المرور بنجاح.</p>
        <p>
          يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
        </p>
        <p>مع خالص التحيات،</p>
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
          color: #2da680; /* اللون الأساسي */
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
          background-color: #2da680; /* اللون التكميلي */
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
          background-color: #278eba; /* لون التمييز */
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
          <h1>تأكيد عنوان بريدك الإلكتروني في The Landlord</h1>
      <h2>${fullName ? `مرحباً ${fullName}` : ``}</h2>
          <p>نحن متحمسون للترحيب بك في The Landlord. قبل أن تبدأ، نحتاج إلى تأكيد عنوان بريدك الإلكتروني.</p>
    
       <p>إليك رمزك:</p>
       <p>${code}</p>
      
        <p>من خلال تأكيد بريدك الإلكتروني، ستتمكن من الاستمتاع بكامل خدماتنا والبقاء على اطلاع بأحدث الأخبار والعروض الحصرية.</p>
      <p>إذا لم تكن قد أنشأت حساباً على The Landlord، يرجى تجاهل هذا البريد الإلكتروني أو إبلاغنا.</p>
      <p>نحن نتطلع إلى تقديم أفضل تجربة ممكنة لك.</p>
      <p>رفع توقعاتك، 
  فريق عمل The Landlord</p>
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
      <title>حجز جديد في The Landlord</title>
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
          color: #2da680; /* اللون الأساسي */
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
          background-color: #2da680; /* اللون التكميلي */
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
          background-color: #278eba; /* لون التمييز */
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
        <h1>حجز جديد في The Landlord</h1>
        <p>تم إجراء حجز جديد:</p>
        <div class="reservation-details">
         
            ${
              clientName ? ` <p><strong>العميل:</strong> ${clientName}</p>` : ""
            }
          <p><strong>البريد الإلكتروني:</strong> ${clientEmail}</p>
          ${clientPhone ? `<p><strong>الهاتف:</strong> ${clientPhone}</p>` : ""}
        
          <p><strong>تاريخ البداية:</strong> ${date_from}</p>
          <p><strong>تاريخ النهاية:</strong>  ${date_to}</p>
          <p>
            <strong>اسم العقار:</strong>
            <a href="${
              process.env.LANDLORD_WEB
            }/property-details/${property_id}" class="house-link">${propertyName}</a>
          </p>
          <p><strong>السعر:</strong> ${price} ${currency}</p>
          <p>
            <strong>معرف الحجز:</strong>
            
              ${reservation_id}
            
          </p>
        </div>
        <p>
          يرجى اتخاذ التدابير اللازمة لتحضير هذا الحجز
          وإبلاغ العميل بجميع التفاصيل ذات الصلة.
        </p>
  
        <p>مع أطيب التحيات، فريق The Landlord</p>
      </div>
    </body>
  </html>
  `;
const sendConfirmedReservationBreakdown = (mappedPriceTotal, foundProperty) => `
  <!DOCTYPE html>
  <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>تأكيد الحجز</title>
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
          <h1>إشعار داخلي: تم تأكيد الحجز</h1>
        </div>
        <div class="content">
          <h2>تفاصيل الحجز</h2>
          <p>
            تم تأكيد حجز بالرقم ${mappedPriceTotal.reservation_id} للعقار
            <strong>${foundProperty.name}</strong> لـ
            <strong>${mappedPriceTotal.email}</strong>
        ${
          mappedPriceTotal.phone_number != null
            ? `<strong> الاتصال عبر ${mappedPriceTotal.phone_number}</strong>.`
            : ""
        }    
  
          </p>
          <p>
            **تواريخ الحجز**: من
            <strong>${mappedPriceTotal.dateFrom}</strong> إلى
            <strong>${mappedPriceTotal.dateTo}</strong><br />
            **عدد الليالي**: <strong>${mappedPriceTotal.dayNumber}</strong>
          </p>
  
          <div class="details">
            <h2>تفاصيل الأسعار</h2>
            <table class="price-details">
              <tr>
                <th>السعر الليلي</th>
                <td>${mappedPriceTotal.dayPrice} TND</td>
              </tr>
              <tr>
                <th>إجمالي الإقامة</th>
                <td>${mappedPriceTotal.priceStaying} TND</td>
              </tr>
              <tr>
                <th>رسوم التنظيف</th>
                <td>${mappedPriceTotal.cleaning} TND</td>
              </tr>
              <tr>
                <th>المجموع الفرعي</th>
                <td>${mappedPriceTotal.priceBrut} TND</td>
              </tr>
              ${
                mappedPriceTotal.feesPrice != null
                  ? `
                  <tr>
                <th>رسوم الخدمة</th>
                <td>${mappedPriceTotal.feesPrice} TND</td>
              </tr>`
                  : ""
              }
            
              ${
                mappedPriceTotal.couponPercentage != null
                  ? `
                    <tr>
                <th>خصم القسيمة (${mappedPriceTotal.couponPercentage}%)</th>
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
                <th>الخصم</th>
                <td>
                  ${mappedPriceTotal.remisePrice} TND
                </td>
              </tr>`
                  : ``
              }
             
              <tr>
                <th>إجمالي الدفع</th>
                <td>${mappedPriceTotal.priceClient} TND</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="footer">
          <h2>للاستخدام الداخلي فقط</h2>
          <p>يرجى مراجعة تفاصيل هذه الحجز المؤكد.</p>
        </div>
      </div>
    </body>
  </html>
  `;
const contactUsMail = (email, name, subject, body, phone) => `
  <!DOCTYPE html>
  <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>تواصل معنا - The Landlord</title>
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
          margin-bottom: 20px;
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
          <h1>طلب جديد من نموذج التواصل</h1>
          <p>فريقنا العزيز،</p>
          <p>
            تم استلام رسالة جديدة عبر نموذج التواصل على الموقع. إليكم التفاصيل:
          </p>
          <ul>
            <li><strong>الاسم:</strong> ${name}</li>
            <li><strong>البريد الإلكتروني:</strong> ${email}</li>
            <li><strong>الهاتف:</strong> ${phone}</li>
            <li><strong>الموضوع:</strong> ${subject}</li>
            <li>
              <strong>الرسالة:</strong> ${body}
            </li>
          </ul>
          <p>يرجى الرد على هذا الاستفسار في أقرب وقت ممكن.</p>
        </div>
        <div class="footer">
          <p>شكراً لك،<br />فريق The Landlord</p>
        </div>
      </div>
    </body>
  </html>
  `;
const approbationHouse = (propertyLink, clientName) => `
  <!DOCTYPE html>
  <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>تأكيد موافقة عقارك - The Landlord</title>
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
          <h1>تمت الموافقة على عقارك</h1>
          <p>مرحبًا ${clientName},</p>
          <p>
            يسرنا أن نعلمك أنه قد تم الموافقة على عقارك من قبل فريق The Landlord. أصبح الآن متاحًا على منصتنا ويمكن للمستخدمين الاطلاع عليه.
          </p>
          <p>
            يمكنك الآن الوصول إلى عقارك وإدارة إعلاناتك مباشرة من حسابك.
          </p>
          <div class="button-container">
            <a href="${propertyLink}" class="button">عرض عقاري</a>
          </div>
          <p>
            إذا كانت لديك أي أسئلة أو تحتاج إلى مزيد من المعلومات، فلا تتردد في الاتصال بنا.
          </p>
        </div>
        <div class="footer">
          <p>شكرًا لك،<br />فريق The Landlord</p>
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
  <html lang="ar">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>تواصل معنا - The Landlord</title>
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
          <h1>إضافة عدة عقارات</h1>
          <p>فريقنا العزيز،</p>
          <p>
            تم استلام طلب لإضافة عدة عقارات من موقع آخر على الموقع.
          </p>
          <ul>
            <li><strong>الاسم:</strong> ${name}</li>
            <li><strong>البريد الإلكتروني:</strong> ${email}</li>
            <li><strong>الهاتف:</strong> ${phone}</li>
            <li><strong>الموضوع:</strong> ${subject}</li>
            <li><strong>الرسالة:</strong> ${body}</li>
            <li><strong>عدد العقارات:</strong> ${properties}</li>
            <li><strong>المصدر:</strong> ${source}</li>
          </ul>
          <p>يرجى الرد على هذا الطلب في أقرب وقت ممكن.</p>
        </div>
        <div class="footer">
          <p>شكراً لك،<br />فريق The Landlord</p>
        </div>
      </div>
    </body>
  </html>
  `;
const sendClientReviewRequestEmail = (clientName, ownerName, reviewLink) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <style>
    body { background-color: #f1f1f1; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; direction: rtl; }
    .container { max-width: 600px; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); text-align: right; }
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
    <h1>أخبرنا عن إقامتك</h1>
    <h2>مرحباً ${clientName}،</h2>
    <p>نأمل أن تكون قد قضيت تجربة رائعة في عقار يديره <strong>${ownerName}</strong>.</p>
    <p>نود معرفة رأيك! يرجى تخصيص دقيقة لترك تقييم.</p>
    <a href="${reviewLink}" class="button">اكتب تقييمًا</a>
    <p>ملاحظاتك تساعدنا في تحسين خدماتنا والحفاظ على جودتها في جميع أنحاء منصتنا.</p>
    <p>شكرًا مرة أخرى لاختيارك The Landlord!</p>
  </div>
</body>
</html>
`;
const sendOwnerReviewRequestEmail = (ownerName, clientName, reviewLink) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <style>
    body { background-color: #f1f1f1; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; padding: 20px; direction: rtl; }
    .container { max-width: 600px; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); text-align: right; }
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
    <h1>قيّم ضيفك الأخير</h1>
    <h2>مرحباً ${ownerName}،</h2>
    <p>شكرًا لك على استضافة <strong>${clientName}</strong> مع The Landlord. يساعدنا رأيك في الحفاظ على تجربة عالية الجودة للجميع.</p>
    <p>يرجى تخصيص لحظة لترك تقييم حول تجربتك مع الضيف.</p>
    <a href="${reviewLink}" class="button">اترك تقييمًا</a>
    <p>نحن نقدر وقتك وجهودك للحفاظ على ازدهار مجتمعنا!</p>
    <p>فريق The Landlord</p>
  </div>
</body>
</html>
`;

const expiredRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
        direction: rtl;
        text-align: right;
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
        line-height: 1.8;
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
        <h1>انتهت صلاحية طلب الحجز</h1>
        <p>
          نأسف لإبلاغك أن طلب الحجز الخاص بك للعقار
          <strong>${name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong> لم يتم تأكيده من قبل المالك
          خلال المهلة المحددة (24 ساعة).
        </p>
        <p>
          يمكنك تصفح عقارات أخرى متاحة أو التواصل مع فريقنا للحصول على المساعدة.
          نحن هنا لمساعدتك في العثور على الإقامة المثالية.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">تصفح العقارات</a>
      </div>
      <div class="content">
        <h2>هل تحتاج مساعدة؟</h2>
        <p>
          فريقنا متوفر على مدار الساعة طوال أيام الأسبوع لمساعدتك في حجزك القادم
          أو للإجابة عن أي استفسار.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        شكرًا لاستخدامك The Landlord. نتمنى أن نرحب بك قريبًا!
      </div>
    </div>
  </body>
</html>
`;

const expiredRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
        direction: rtl;
        text-align: right;
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
        <h1>انتهت صلاحية طلب الحجز</h1>
        <p>
          لم تقم بتأكيد طلب الحجز لعقاركم
          <strong>${name}</strong> من
          <strong>${booking.date_from}</strong> إلى
          <strong>${booking.date_to}</strong> خلال المهلة المحددة (24 ساعة).
        </p>
        <p>
          وبناءً على ذلك، انتهت صلاحية الطلب وتم إشعار العميل.
          ننصحكم بالرد بسرعة على الطلبات المستقبلية لتفادي ضياع الفرص.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/property-details/${booking.property_id}" class="button">عرض العقار</a>
      </div>
      <div class="content">
        <h2>هل تحتاجون إلى مساعدة؟</h2>
        <p>
          فريقنا متاح على مدار الساعة طوال أيام الأسبوع لمساعدتكم في إدارة إعلاناتكم وتحسين معدل استجابتكم.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        شكراً لتعاونكم مع The Landlord. لنحافظ على تقويمكم ممتلئاً دائماً!
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestClient = (booking, name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
        direction: rtl;
        text-align: right;
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
        <h1>انتهت صلاحية طلب الحجز الخاص بك</h1>
        <p>
          قام مالك العقار <strong>${name}</strong> بقبول طلب الحجز الخاص بك من
          <strong>${booking.date_from}</strong> إلى <strong>${booking.date_to}</strong>.
        </p>
        <p>
          ولكننا لم نتلقَ تأكيدك خلال 24 ساعة. لذلك، انتهت صلاحية الحجز ولن يتم معالجته.
        </p>
        <p>
          يمكنك تصفح عقارات أخرى متاحة أو التواصل مع فريقنا للحصول على المساعدة.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/properties" class="button">تصفح العقارات</a>
      </div>
      <div class="content">
        <h2>هل تحتاج إلى مساعدة؟</h2>
        <p>
          فريقنا متاح على مدار الساعة وطوال أيام الأسبوع لمساعدتك في العثور على الإقامة المثالية أو الإجابة عن أي استفسار.
        </p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        شكرًا لاستخدامك The Landlord. نأمل أن نرحب بك قريبًا!
      </div>
    </div>
  </body>
</html>
`;

const expiredConfirmedRequestOwner = (booking, name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
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
        direction: rtl;
        text-align: right;
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
        text-align: right;
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
        <h1>العميل لم يؤكد الحجز</h1>
        <p>
          لقد قبلت طلب الحجز لعقاركم
          <strong>${name}</strong>
          من
          <strong>${booking.date_from}</strong>
          إلى
          <strong>${booking.date_to}</strong>، لكن العميل لم يؤكد خلال 24 ساعة.
        </p>
        <p>
          نتيجة لذلك، انتهت صلاحية الطلب. يمكنك إعادة نشر هذه التواريخ أو النظر في الطلبات المعلقة الأخرى.
        </p>
      </div>
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2>${name}</h2>
      </div>
      <div class="button-container">
        <a href="${process.env.LANDLORD_WEB}/owner/requests/\${booking.id}" class="button">عرض طلب الحجز</a>
      </div>
      <div class="content">
        <h2>تفاصيل الحجز</h2>
        <p><strong>العقار:</strong> ${name}</p>
        <p><strong>التواريخ:</strong> ${booking.date_from} → ${booking.date_to}</p>
        <p><strong>معرّف الطلب:</strong> ${booking.id}</p>
      </div>
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>
      <div class="footer">
        شكراً لتعاونكم مع The Landlord.
      </div>
    </div>
  </body>
</html>
`;

const prearrivalClient = (booking, name) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Tahoma, Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        color: #333;
        direction: rtl;
        text-align: right;
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
      .content { padding: 30px; }
      .content h1 {
        font-size: 26px;
        margin-bottom: 20px;
        color: #2da680;
        text-align: center;
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
      @media (prefers-color-scheme: dark) {
        body { background-color: #0f0f0f; color: #eaeaea; }
        .container { background-color: #151515; }
        .content p { color: #eaeaea; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- الشعار -->
      <div class="header">
        <img src="cid:landlordlogo" alt="The Landlord" />
      </div>

      <!-- العنوان والتذكير -->
      <div class="content">
        <h1>تبقّى يومان على تسجيل الوصول</h1>
        <p>تذكير لطيف: تبدأ إقامتك خلال يومان.</p>
        <p>نرجو منكم التكرّم بتجهيز مبلغ التأمين</p>
      </div>

      <!-- صورة السكن -->
      <div class="villa-info">
        <img src="cid:property" alt="${name}" />
        <h2 style="margin-top:16px; color:#2da680;">${name}</h2>
      </div>

      <!-- تفاصيل الحجز -->
      <div class="content">
        <h2 style="color:#2da680; font-size:22px; margin-bottom:12px;">تفاصيل الحجز</h2>
        <p>السكن: ${name}</p>
        <p>التواريخ: من ${booking.date_from} إلى ${booking.date_to}</p>
        ${booking.duration ? `<p>عدد الليالي: ${booking.duration}</p>` : ``}

      </div>

      <!-- بيانات التواصل -->
      <div class="contact-info">
        <a href="mailto:contact@thelandlord.tn">contact@thelandlord.tn</a>
        <a href="tel:+21658595900">+216 58 595 900</a>
        <a href="https://www.thelandlord.tn">www.thelandlord.tn</a>
      </div>

      <!-- تذييل -->
      <div class="footer">
        نحن رهن الإشارة لأي مساعدة.
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
  //clear expired requests
  expiredRequestClient,
  expiredRequestOwner,
  expiredConfirmedRequestClient,
  expiredConfirmedRequestOwner,
  prearrivalClient,
};
