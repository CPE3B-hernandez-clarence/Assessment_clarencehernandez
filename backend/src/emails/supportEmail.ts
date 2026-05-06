import { escapeHtml } from '../utils/escapeHtml';

type SupportEmailHtmlParams = {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
};

export const buildSupportEmailHtml = ({
  name,
  email,
  message,
  submittedAt,
}: SupportEmailHtmlParams) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
  const submittedDate = submittedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Support request</title>
  </head>
  <body style="margin:0; padding:0; background:#ffffff; color:#5c7180; font-family:Inter, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px; overflow:hidden; background:#eafafa; border:1px solid #bddfe0; border-radius:8px; box-shadow:0 20px 38px rgba(8,129,151,0.18), -10px 10px 22px rgba(8,161,120,0.10);">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 12px; color:#088b83; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                  Live preview
                </p>
                <h1 style="margin:0 0 18px; color:#0c2f38; font-size:28px; line-height:1.18; font-weight:750;">
                  Support request
                </h1>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff; border:1px solid #bddfe0; border-radius:8px; box-shadow:0 20px 38px rgba(8,129,151,0.18), -10px 10px 22px rgba(8,161,120,0.10);">
                  <tr>
                    <td style="padding:22px;">
                      <p style="margin:0 0 6px; color:#5e8790; font-size:12px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                        From
                      </p>
                      <p style="margin:0 0 4px; color:#0c2f38; font-size:20px; line-height:1.2; font-weight:700;">
                        ${safeName}
                      </p>
                      <p style="margin:0;">
                        <a href="mailto:${safeEmail}" style="color:#088b83; text-decoration:none; word-break:break-word;">
                          ${safeEmail}
                        </a>
                      </p>

                      <div style="height:22px; line-height:22px;">&nbsp;</div>

                      <p style="margin:0 0 6px; color:#5e8790; font-size:12px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">
                        Message
                      </p>
                      <p style="margin:0; color:#0c2f38; font-size:15px; line-height:1.5; word-break:break-word;">
                        ${safeMessage}
                      </p>

                      <div style="height:22px; line-height:22px;">&nbsp;</div>

                      <p style="margin:0; color:#5e8790; font-size:12px;">
                        Submitted ${escapeHtml(submittedDate)}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
