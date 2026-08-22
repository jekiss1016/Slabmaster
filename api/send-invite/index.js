const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
const senderAddress = process.env.SENDER_EMAIL_ADDRESS || "DoNotReply@99b6c148-9385-4bbb-bcd3-f52a77404e05.azurecomm.net";

module.exports = async function (context, req) {
  try {
    const { email, fullName, role, companyName, scopedRegions } = req.body || {};

    if (!email) {
      context.res = {
        status: 400,
        body: { error: "Recipient email address is required" }
      };
      return;
    }

    const emailClient = new EmailClient(connectionString);

    const message = {
      senderAddress: senderAddress,
      content: {
        subject: `Welcome to SlabMaster - Invitation for ${fullName || email}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">SlabMaster</h1>
              <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Stone Fabrication & Installation Field Dispatch Portal</p>
            </div>
            
            <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">You're Invited to SlabMaster</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Hello <strong>${fullName || 'Team Member'}</strong>,
            </p>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              An account has been provisioned for you in the SlabMaster portal. Here are your account credentials & scope:
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Assigned Role:</td>
                  <td style="padding: 6px 0; color: #2563eb; font-weight: 700;">${role || 'EXTERNAL_FIELD_INSTALLER'}</td>
                </tr>
                ${companyName ? `
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Company / Crew:</td>
                  <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${companyName}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Plant Territory Scope:</td>
                  <td style="padding: 6px 0; color: #059669; font-weight: 700;">${(scopedRegions && scopedRegions.join(', ')) || 'Authorized Plants'}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://lively-forest-037af051e.7.azurestaticapps.net/.auth/login/aad" 
                 style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                Sign In with Microsoft SSO & Activate
              </a>
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-bottom: 0;">
              If you did not request this invitation, please ignore this email or contact your Plant Administrator.
            </p>
          </div>
        `
      },
      recipients: {
        to: [{ address: email, displayName: fullName || email }]
      }
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    context.res = {
      status: 200,
      body: { 
        success: true, 
        messageId: result.id, 
        recipient: email,
        status: result.status 
      }
    };
  } catch (error) {
    context.log.error("Failed to send email via Azure Communication Services:", error);
    context.res = {
      status: 500,
      body: { 
        error: "Failed to send email", 
        details: error.message 
      }
    };
  }
};
