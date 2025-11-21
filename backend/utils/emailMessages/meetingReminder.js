
const emailMessageHTML = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Software Development Group Work Meeting Reminder</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4; color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
          <!-- Header -->
          <tr>
            <td style="padding:20px; text-align:center; background-color:#2c3e50; color:#ffffff;">
              <h2 style="margin:0; font-size:24px;">Reminder: Software Development Group Work Meeting</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:20px;">
              <p>Dear Team,</p>
              <p>This is a <span style="color:#e74c3c; font-weight:bold;">friendly but important reminder</span> about our scheduled Software Development Group Work Meeting tomorrow.</p>

              <h3 style="color:#2c3e50;">Meeting Details:</h3>
              <p>
                <strong>Date:</strong> <span style="color:#2980b9; font-weight:bold;">November 14, 2025</span><br>
                <strong>Time:</strong> 10:00 AM Addis Ababa Time<br>
                <strong>Location:</strong> Room 301, Computer Science Department, AAU / Online via <a href="https://zoom.us/j/123456789" style="color:#2980b9; text-decoration:none;">Zoom</a>
              </p>

              <h3 style="color:#2c3e50;">Agenda:</h3>
              <ul style="padding-left:20px;">
                <li>Review progress on the group project modules.</li>
                <li>Discuss unresolved bugs and technical challenges.</li>
                <li>Plan for the next sprint and assign tasks.</li>
                <li>Ensure all deliverables are aligned with project milestones.</li>
              </ul>

              <h3 style="color:#2c3e50;">Action Required:</h3>
              <ul style="padding-left:20px;">
                <li>Come prepared with updates on your assigned modules.</li>
                <li>Have relevant code, diagrams, or documentation ready to share.</li>
                <li>Ensure your local development environment is set up for live testing, if required.</li>
                <li>If you cannot attend, notify the group immediately via email or WhatsApp.</li>
              </ul>

              <p style="margin-top:20px;">Your participation and punctuality are highly appreciated. Let’s make this session productive and successful!</p>

              <p style="margin-top:20px;">Best regards,<br>
                <strong>Mohammed Hassen</strong><br>
                Software Development Group Lead<br>
                <a href="mailto:mohammedhassen1829@gmail.com" style="color:#2980b9; text-decoration:none;">mohammedhassen1829@gmail.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:15px; text-align:center; font-size:12px; color:#777; background-color:#f0f0f0;">
              &copy; 2025 Software Development Group. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = emailMessageHTML;
