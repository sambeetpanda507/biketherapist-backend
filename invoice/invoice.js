module.exports = ({ name, amount, receiptId }) => {
  const today = new Date();
  return `
  <!doctype html>
  <html>
     <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        <style>
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap");
           .invoice-box {
           max-width: 800px;
           margin: auto;
           padding: 30px;
           border: 1px solid #eee;
           box-shadow: 0 0 10px rgba(0, 0, 0, .15);
           font-size: 16px;
           line-height: 24px;
           font-family: 'Helvetica Neue', 'Helvetica',
           color: #555;
           }
           .margin-top {
           margin-top: 50px;
           }
           .justify-center {
           text-align: center;
           }
           .invoice-box table {
           width: 100%;
           line-height: inherit;
           text-align: left;
           }
           .invoice-box table td {
           padding: 5px;
           vertical-align: top;
           }
           .invoice-box table tr td:nth-child(2) {
           text-align: right;
           }
           .invoice-box table tr.top table td {
           padding-bottom: 20px;
           }
           .invoice-box table tr.top table td.title {
           font-size: 45px;
           line-height: 45px;
           color: #333;
           }
           .invoice-box table tr.information table td {
           padding-bottom: 40px;
           }
           .invoice-box table tr.heading td {
           background: #eee;
           border-bottom: 1px solid #ddd;
           font-weight: bold;
           }
           .invoice-box table tr.details td {
           padding-bottom: 20px;
           }
           .invoice-box table tr.item td {
           border-bottom: 1px solid #eee;
           }
           .invoice-box table tr.item.last td {
           border-bottom: none;
           }
           .invoice-box table tr.total td:nth-child(2) {
           border-top: 2px solid #eee;
           font-weight: bold;
           }
           @media only screen and (max-width: 600px) {
           .invoice-box table tr.top table td {
           width: 100%;
           display: block;
           text-align: center;
           }
           .invoice-box table tr.information table td {
           width: 100%;
           display: block;
           text-align: center;
           }
           }
           .title{
            text-transform: capitalize;
            text-align: center;
            text-shadow: 0rem 1px 1px #000;
           }
           .title.bike{
            font-family: "Dancing Script", cursive;
            color:#fdd600;
           }
        </style>
     </head>
     <body>
        <div class="invoice-box">
           <u><h2 class="title"><span class="bike">Bike</span>Therapist</h2></u>
           <table cellpadding="0" cellspacing="0">
              <tr class="top">
                 <td colspan="2">
                    <table>
                    <tr>
                    <td class="title"><img  src="http://localhost:3000/android-chrome-192x192.png"
                             style="width:100%; max-width:156px;"></td>
                          <td>
                             Date: ${`${today.getDate()}. ${
                               today.getMonth() + 1
                             }. ${today.getFullYear()}.`}
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
              <tr class="information">
                 <td colspan="2">
                    <table>
                       <tr>
                          <td>
                             Customer name: ${name}
                          </td>
                          <td>
                             Receipt number: ${receiptId}
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
              <tr class="heading">
                 <td>Bought items:</td>
                 <td>Price</td>
              </tr>
              <tr class="item">
                 <td>First item:</td>
                 <td>₹ ${amount}/- </td>
              </tr>
           </table>
           <br />
           <h1 class="justify-center">Total price: ₹ ${parseInt(
             amount
           )} /- </h1>
        </div>
     </body>
  </html>
  `;
};
