
const orderConfEmail = `

   <!DOCTYPE html>
     <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Order Confirmation</title>
   <style>
    /* Reset & base styles */
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header {
      background-color: #4CAF50;
      color: #fff;
      text-align: center;
      padding: 20px;
    }

    .header h1 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 20px 30px;
    }

    .content h2 {
      color: #4CAF50;
      font-size: 20px;
      margin-top: 0;
    }

    .content p {
      line-height: 1.6;
    }

    .order-details {
      margin: 20px 0;
      border-collapse: collapse;
      width: 100%;
    }

    .order-details th,
    .order-details td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    .order-details th {
      background-color: #f7f7f7;
    }

    .total {
      font-weight: bold;
      font-size: 18px;
      text-align: right;
      padding-top: 10px;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 20px;
      border-top: 1px solid #eee;
    }

    /* Responsive */
    @media screen and (max-width: 600px) {
      .content {
        padding: 15px 20px;
      }
      .header h1 {
        font-size: 20px;
      }
      .order-details th, .order-details td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Order Confirmation</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Thank you for your order, {{customerName}}!</h2>
      <p>We're happy to let you know that your order <strong>#{{orderId}}</strong> has been successfully received on {{orderDate}}.</p>

      <!-- Order Summary -->
      <table class="order-details">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {{#each orderItems}}
          <tr>
            <td>{{name}}</td>
            <td>{{quantity}}</td>
            <td>{{price}}</td>
          </tr>
          {{/each}}
        </tbody>
      </table>

      <p class="total">Total: {{totalPrice}}</p>

      <!-- Shipping Info -->
      <h3>Shipping Address</h3>
      <p>
        {{shippingAddress.name}}<br>
        {{shippingAddress.street}}<br>
        {{shippingAddress.city}}, {{shippingAddress.state}} {{shippingAddress.zip}}<br>
        {{shippingAddress.country}}
      </p>

      <p>If you have any questions about your order, feel free to contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>

      <p>Thank you for shopping with us!</p>
    </div>

    <!-- Footer -->
    <div class="footer">
      &copy; {{currentYear}} YourCompany. All rights reserved.
    </div>
  </div>
</body>
</html>`

module.exports = orderConfEmail;