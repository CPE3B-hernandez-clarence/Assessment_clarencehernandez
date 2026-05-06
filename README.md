# Contact Support Feature Explanation

This document explains the functionality of the `contactSupportController.ts` file, which handles the "Contact Support" feature of the backend API.

## Overview
This controller is responsible for receiving messages from users who need help, securely saving those messages to a database, and optionally sending an email notification to the support team.

## How the Code Works (Step-by-Step)

1. **Receiving Data (`req.body`)**: 
   The function `createContactSupportMessage` receives the `name`, `email`, and `message` that the user submitted via the frontend form.
2. **Validation**: 
   It checks if any of the required fields are missing. If the user forgot to provide their name, email, or message, the code stops processing and immediately sends a `400 Bad Request` error back.
3. **Data Preparation**: 
   It captures the exact time the message was submitted (`submittedAt`) and generates a formatted HTML email template using a helper function (`buildSupportEmailHtml`).
4. **Database Storage**: 
   It securely saves the user's submission into the database using `ContactSupport.create()`.
5. **Email Notification**: 
   If email sending is enabled (`canSendMail`) and configured (`env.supportEmail`), it uses an email transporter to forward the user's message to the official support email address. 
6. **Success Response**: 
   Finally, it sends a `201 Created` HTTP status back to the frontend, along with the saved data, letting the user know their message was successfully received.

## Potential Teacher Questions & Answers

**Q: What happens if the database is down or an error occurs while saving?**
**A:** The entire code block is wrapped in a `try...catch` block. If saving to the database fails, the code jumps to the `catch` block at the bottom, logs the error for developers to investigate, and sends a `500 Internal Server Error` to the user so the application doesn't completely crash.

**Q: What happens if the email fails to send? Will the user see an error?**
**A:** No, the user will not see an error. The email sending portion has its own inner `try...catch` block. If the email fails, it just logs the error (`console.error`), but the user still gets a success message. This is because their support ticket was already successfully saved in our database, so no data was lost.

**Q: Why are you using `async` and `await`?**
**A:** Saving data to a database and sending an email are asynchronous tasks—they take time to complete. Using `await` pauses the execution of this specific function until those background tasks finish, without freezing the rest of the server. This allows the server to concurrently handle other users' requests.

**Q: How do you handle HTTP responses?**
**A:** We use standard HTTP status codes to communicate the result clearly: `400` for user errors (missing fields), `201` for successful creation in the database, and `500` for unexpected server problems. The response payload is always structured in JSON format.