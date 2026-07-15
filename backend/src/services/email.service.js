import nodemailer from "nodemailer";
import prisma from "../config/prisma.js";

// Helper to determine color based on status
function getStatusColor(status) {
  switch (status) {
    case "DELIVERED":
      return "#10b981"; // green
    case "FAILED":
      return "#ef4444"; // red
    case "PENDING":
      return "#f59e0b"; // amber
    case "ASSIGNED":
      return "#8b5cf6"; // purple
    case "PICKED_UP":
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return "#3b82f6"; // blue
    default:
      return "#6b7280"; // gray
  }
}

// Generate a clean, responsive HTML email template
function generateOrderStatusHTML(order, status, remarks) {
  const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
  const statusColor = getStatusColor(status);
  
  // Create tracking timeline step highlights
  const statuses = ["PENDING", "ASSIGNED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];
  if (status === "FAILED") {
    // replace DELIVERED with FAILED for display
    statuses[5] = "FAILED";
  }
  const currentIdx = statuses.indexOf(status);

  let timelineHtml = `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;"><tr>`;
  statuses.forEach((s, idx) => {
    const isActive = idx <= currentIdx;
    const isCurrent = s === status;
    const bulletColor = isCurrent ? statusColor : (isActive ? "#3b82f6" : "#d1d5db");
    const textColor = isCurrent ? "#111827" : (isActive ? "#4b5563" : "#9ca3af");
    const fontWeight = isCurrent ? "bold" : "normal";

    timelineHtml += `
      <td style="text-align: center; width: 16%; padding: 4px;">
        <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${bulletColor}; margin: 0 auto 6px auto;"></div>
        <div style="font-size: 10px; color: ${textColor}; font-weight: ${fontWeight}; word-break: break-all;">${s.replace("_", " ")}</div>
      </td>
    `;
  });
  timelineHtml += `</tr></table>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #374151; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #1e3a8a, #2563eb); color: #ffffff; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 30px 20px; }
        .status-banner { background-color: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 15px; border-radius: 4px; margin-bottom: 25px; }
        .status-title { font-size: 18px; font-weight: 700; color: ${statusColor}; margin: 0 0 5px 0; }
        .status-text { margin: 0; font-size: 14px; color: #4b5563; }
        .details-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .details-table th, .details-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .details-table th { color: #6b7280; font-weight: 600; width: 140px; }
        .details-table td { color: #1f2937; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>LastMile Logistics</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">Dear ${customerName},</p>
          <p style="font-size: 14px; line-height: 1.5; color: #4b5563;">
            We are writing to inform you that your consignment status has been updated. Please find the details of your tracking information below.
          </p>

          <div class="status-banner">
            <h2 class="status-title">Order Status: ${status.replace("_", " ")}</h2>
            <p class="status-text"><strong>Remarks:</strong> ${remarks || "No additional remarks."}</p>
          </div>

          <h3 style="font-size: 14px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 10px;">Fulfillment Progress</h3>
          ${timelineHtml}

          <h3 style="font-size: 14px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; margin-bottom: 10px;">Consignment Details</h3>
          <table class="details-table">
            <tr>
              <th>Order Number</th>
              <td><strong>${order.orderNumber}</strong></td>
            </tr>
            <tr>
              <th>Pickup Address</th>
              <td>${order.pickupAddressLine} (${order.pickupPincode})</td>
            </tr>
            <tr>
              <th>Drop Address</th>
              <td>${order.dropAddressLine} (${order.dropPincode})</td>
            </tr>
            <tr>
              <th>Weight (Billable)</th>
              <td>${order.billableWeight} kg</td>
            </tr>
            <tr>
              <th>Service Mode</th>
              <td>${order.orderType}</td>
            </tr>
            <tr>
              <th>Payment Type</th>
              <td>${order.paymentType}</td>
            </tr>
            ${order.assignedAgent ? `
            <tr>
              <th>Assigned Agent</th>
              <td>${order.assignedAgent.firstName} ${order.assignedAgent.lastName} ${order.assignedAgent.agentProfile ? `(${order.assignedAgent.agentProfile.vehicleType}: ${order.assignedAgent.agentProfile.vehicleNumber})` : ''}</td>
            </tr>
            ` : ''}
            <tr>
              <th>Total Charge</th>
              <td>₹${Number(order.totalAmount).toFixed(2)}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:5173/customer-dashboard" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">
              Track on Dashboard
            </a>
          </div>
        </div>
        <div class="footer">
          This is an automated notification, please do not reply directly to this email.<br>
          &copy; 2026 LastMile Logistics. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an email notification to the customer regarding their order status updates.
 * Falls back to logging to console if SMTP variables are not configured in .env.
 * Logs email logs into database Notification table regardless.
 * 
 * @param {number} orderId - The database ID of the Order
 * @param {string} status - The OrderStatus value
 * @param {string} remarks - Update description/remarks
 */
export async function sendOrderStatusEmail(orderId, status, remarks) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        assignedAgent: {
          include: {
            agentProfile: true
          }
        }
      }
    });

    if (!order) {
      console.error(`[Email Service] Order not found for ID: ${orderId}`);
      return;
    }

    const customerEmail = order.customer.email;
    const orderNumber = order.orderNumber;
    const subject = `[LastMile Logistics] Update on Consignment ${orderNumber} - Status: ${status.replace("_", " ")}`;
    const htmlContent = generateOrderStatusHTML(order, status, remarks);
    
    // Check SMTP config
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || `"LastMile Logistics" <noreply@lastmile.com>`;

    const isSmtpConfigured = host && user && pass;

    if (!isSmtpConfigured) {
      // Simulation / Console fallback mode
      console.log(`
========================================================================
[SIMULATED EMAIL DISPATCH]
To: ${customerEmail}
Subject: ${subject}
From: ${from}
Status Color: ${getStatusColor(status)}
Remarks: ${remarks || "None"}
------------------------------------------------------------------------
HTML Body Preview (rendered summary):
- Order: ${orderNumber}
- Customer: ${order.customer.firstName} ${order.customer.lastName}
- Status Change: ${status}
- Total Amount: ₹${Number(order.totalAmount).toFixed(2)}
- Pickup: ${order.pickupAddressLine}
- Drop: ${order.dropAddressLine}
========================================================================
      `);

      // Write notification record in DB (as simulated / logged)
      await prisma.notification.create({
        data: {
          userId: order.customerId,
          orderId: order.id,
          type: "EMAIL",
          message: `[Simulated SMTP] Subject: ${subject}. Status updated to ${status}. Remarks: ${remarks || 'None'}`,
          status: "Simulated",
          isSent: true,
          sentAt: new Date()
        }
      });
      return;
    }

    // Real Nodemailer dispatch
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from,
      to: customerEmail,
      subject,
      html: htmlContent
    });

    console.log(`[Email Service] Email sent successfully to ${customerEmail}: ${info.messageId}`);

    // Log to DB Notification table
    await prisma.notification.create({
      data: {
        userId: order.customerId,
        orderId: order.id,
        type: "EMAIL",
        message: `Email notification sent successfully. Subject: ${subject}`,
        status: `Sent: ${info.messageId}`,
        isSent: true,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error(`[Email Service] Failed to send order status email:`, error);
    // Log failed email attempt in the database
    try {
      // Find customer ID to associate notification
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      if (order) {
        await prisma.notification.create({
          data: {
            userId: order.customerId,
            orderId: order.id,
            type: "EMAIL",
            message: `Failed to send email for status ${status}. Error: ${error.message}`,
            status: `Error: ${error.message.substring(0, 100)}`,
            isSent: false
          }
        });
      }
    } catch (dbErr) {
      console.error(`[Email Service] Also failed to log email error to DB:`, dbErr);
    }
  }
}
