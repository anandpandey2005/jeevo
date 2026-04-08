const nodemailer = require('nodemailer');

const BRAND = {
  name: 'Jeevo',
  tagline: 'Locate. Donate. Celeberate.',
  primary: '#be123c',
  primaryDark: '#9f1239',
  ink: '#111827',
  muted: '#6b7280',
  bg: '#f1f1f1',
  card: '#ffffff',
  border: '#e5e7eb',
  header: '#0b0b0b'
};

const isEmailConfigured = () =>
  !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

const formatDateTime = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const formatDonationType = (value = '') =>
  String(value).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const resolveClientUrl = (value = '') => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  const base = process.env.CLIENT_URL || '';
  if (!base) return value;
  return `${base.replace(/\/+$/, '')}/${String(value).replace(/^\/+/, '')}`;
};

const buildDetailCard = (rows) => {
  if (!rows || rows.length === 0) return '';
  return `
    <div style="background: ${BRAND.card}; padding: 16px; border-radius: 12px; border: 1px solid ${BRAND.border}; margin: 18px 0;">
      ${rows
        .map((row) => `<p style=\"margin: 6px 0;\"><strong>${row.label}:</strong> ${row.value}</p>`)
        .join('')}
    </div>
  `;
};

const buildEmailLayout = ({ heading, lead, content, ctaUrl, ctaLabel, footer }) => `
  <div style="font-family: Arial, sans-serif; background: ${BRAND.bg}; padding: 24px;">
    <div style="max-width: 620px; margin: 0 auto; background: ${BRAND.card}; border: 1px solid ${BRAND.border}; border-radius: 16px; overflow: hidden;">
      <div style="background: ${BRAND.header}; padding: 24px; text-align: center;">
        <div style="color: #ffffff; font-size: 20px; letter-spacing: 4px; font-weight: 700;">JEEVO</div>
        <div style="color: #d1d5db; margin-top: 6px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">${BRAND.tagline}</div>
      </div>
      <div style="padding: 24px;">
        ${heading ? `<h2 style=\"color: ${BRAND.ink}; margin: 0 0 10px;\">${heading}</h2>` : ''}
        ${lead ? `<p style=\"color: ${BRAND.muted}; line-height: 1.6; margin: 0 0 16px;\">${lead}</p>` : ''}
        ${content || ''}
        ${ctaUrl ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${ctaUrl}" style="background: ${BRAND.primary}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; display: inline-block;">${ctaLabel || 'View Details'}</a>
          </div>
        ` : ''}
        ${footer ? `<p style=\"color: #9ca3af; font-size: 12px; margin-top: 20px;\">${footer}</p>` : ''}
      </div>
    </div>
  </div>
`;

const buildNotificationTemplate = ({ user, title, message, actionUrl, actionLabel }) => {
  const safeTitle = title || 'Notification';
  const safeMessage = message || 'You have a new update from Jeevo.';
  const recipientName = user?.firstName || 'there';
  const resolvedUrl = resolveClientUrl(actionUrl);
  const ctaLabel = actionLabel || 'View Details';

  const content = `
    <p style="color: ${BRAND.muted}; line-height: 1.6;">${safeMessage}</p>
    ${buildDetailCard([{ label: 'Update', value: safeTitle }])}
  `;

  return {
    subject: `${safeTitle} - Jeevo`,
    html: buildEmailLayout({
      heading: `Hello ${recipientName},`,
      lead: 'Here is the latest update from your Jeevo account.',
      content,
      ctaUrl: resolvedUrl,
      ctaLabel,
      footer: 'Thank you for supporting Jeevo.'
    })
  };
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const templates = {
  welcome: (user) => ({
    subject: 'Welcome to Jeevo - Your Journey to Save Lives Begins',
    html: buildEmailLayout({
      heading: `Welcome, ${user.firstName}!`,
      lead: 'Thank you for joining Jeevo. You are now part of a community dedicated to saving lives through blood donation.',
      content: `
        <p style="color: ${BRAND.muted}; line-height: 1.6;">
          ${user.role === 'donor'
            ? 'As a donor, you can help multiple patients with every successful donation.'
            : 'We are here to help you find the support you need quickly and efficiently.'}
        </p>
      `,
      ctaUrl: resolveClientUrl('/dashboard'),
      ctaLabel: 'Go to Dashboard',
      footer: 'You are receiving this email because you created a Jeevo account.'
    })
  }),

  bloodRequest: (donor, request) => ({
    subject: `Urgent: ${request.bloodGroup} Blood Needed - Can You Help?`,
    html: buildEmailLayout({
      heading: `Hello ${donor.firstName},`,
      lead: `A patient urgently needs ${request.bloodGroup} blood. Your blood type is compatible.`,
      content: buildDetailCard([
        { label: 'Blood Group', value: request.bloodGroup },
        { label: 'Units Required', value: request.unitsRequired },
        { label: 'Urgency', value: String(request.urgency || '').toUpperCase() || 'N/A' },
        { label: 'Hospital', value: request.hospitalName },
        { label: 'Needed By', value: new Date(request.requiredBy).toLocaleDateString() }
      ]),
      ctaUrl: resolveClientUrl(`/requests/${request._id}`),
      ctaLabel: 'View Request & Respond',
      footer: 'Every donation can save multiple lives. Thank you for being there when it matters.'
    })
  }),

  requestApproved: (user, request) => ({
    subject: 'Good News! Your Blood Request Has Been Approved',
    html: buildEmailLayout({
      heading: `Hello ${user.firstName},`,
      lead: `Your blood request for ${request.bloodGroup} has been approved.`,
      content: `
        <p style="color: ${BRAND.muted}; line-height: 1.6;">
          We are actively matching compatible donors. You will receive updates as donors respond.
        </p>
      `,
      ctaUrl: resolveClientUrl(`/requests/${request._id}`),
      ctaLabel: 'Track Request',
      footer: 'Thank you for trusting Jeevo with your request.'
    })
  }),

  donationReminder: (donor, schedule) => ({
    subject: 'Reminder: Your Blood Donation Appointment Tomorrow',
    html: buildEmailLayout({
      heading: `Hello ${donor.firstName},`,
      lead: 'This is a friendly reminder about your upcoming blood donation appointment.',
      content: `
        ${buildDetailCard([
          { label: 'Date', value: new Date(schedule.date).toLocaleDateString() },
          { label: 'Time', value: schedule.time },
          { label: 'Location', value: schedule.venue?.name || 'N/A' },
          { label: 'Address', value: schedule.venue?.address || 'N/A' }
        ])}
        <p style="color: ${BRAND.ink}; font-weight: 600; margin: 0 0 8px;">Before your donation</p>
        <ul style="color: ${BRAND.muted}; line-height: 1.8; margin: 0; padding-left: 18px;">
          <li>Get a good night's sleep</li>
          <li>Eat a healthy meal before donating</li>
          <li>Drink plenty of water</li>
          <li>Bring a valid ID</li>
          <li>Wear comfortable clothes with sleeves that can be rolled up</li>
        </ul>
      `,
      ctaUrl: resolveClientUrl('/schedules/my-appointments'),
      ctaLabel: 'View Appointment',
      footer: 'Thank you for your commitment to saving lives.'
    })
  }),

  eligibilityRestored: (donor) => ({
    subject: 'Great News! You Are Eligible to Donate Again',
    html: buildEmailLayout({
      heading: `Hello ${donor.firstName},`,
      lead: 'The waiting period since your last donation has passed. You are now eligible to donate again.',
      content: `
        <p style="color: ${BRAND.muted}; line-height: 1.6;">
          There are patients waiting for your generous gift. Consider scheduling your next donation today.
        </p>
      `,
      ctaUrl: resolveClientUrl('/schedules'),
      ctaLabel: 'Schedule Donation',
      footer: 'Thank you for continuing to support the Jeevo community.'
    })
  }),

  passwordReset: (user, resetUrl) => ({
    subject: 'Password Reset Request - Jeevo',
    html: buildEmailLayout({
      heading: `Hello ${user.firstName},`,
      lead: 'We received a request to reset your password. Click the button below to create a new password.',
      content: '',
      ctaUrl: resolveClientUrl(resetUrl),
      ctaLabel: 'Reset Password',
      footer: 'This link will expire in 10 minutes. If you did not request this, please ignore this email.'
    })
  }),

  emailOtp: ({ code, expiresInMinutes }) => ({
    subject: 'Your Jeevo verification code',
    html: buildEmailLayout({
      heading: 'Email verification',
      lead: 'Use the code below to verify your email address and continue creating your Jeevo account.',
      content: `
        <div style="background: ${BRAND.header}; color: #ffffff; font-size: 28px; letter-spacing: 6px; text-align: center; padding: 16px; border-radius: 10px; margin: 24px 0;">
          ${code}
        </div>
      `,
      footer: `This code expires in ${expiresInMinutes} minutes. If you did not request this, you can ignore this email.`
    })
  }),

  loginAlert: ({ user, meta }) => ({
    subject: 'New login to your Jeevo account',
    html: buildEmailLayout({
      heading: `Hello ${user.firstName || 'there'},`,
      lead: 'Your Jeevo account was just used to sign in. If this was you, no action is needed.',
      content: buildDetailCard([
        { label: 'Time', value: formatDateTime(meta?.time) },
        { label: 'IP Address', value: meta?.ip || 'N/A' },
        { label: 'Device', value: meta?.userAgent || 'N/A' }
      ]),
      footer: 'If you did not sign in, please reset your password immediately.'
    })
  }),

  donationReceipt: ({ donor, donation, hospital }) => ({
    subject: `Donation Receipt - ${donation?.donationId || 'Jeevo'}`,
    html: buildEmailLayout({
      heading: `Hello ${donor?.firstName || 'Donor'},`,
      lead: 'This email confirms your recent blood donation has been recorded. Please keep it as a receipt.',
      content: buildDetailCard([
        { label: 'Receipt ID', value: donation?.donationId || 'N/A' },
        { label: 'Donor', value: `${donor?.firstName || ''} ${donor?.lastName || ''}`.trim() || 'N/A' },
        { label: 'Blood Group', value: donation?.bloodGroup || 'N/A' },
        { label: 'Donation Type', value: formatDonationType(donation?.donationType) || 'N/A' },
        { label: 'Donation Date', value: formatDateTime(donation?.donationDate) },
        { label: 'Hospital', value: hospital?.name || 'N/A' },
        { label: 'Bag Number', value: donation?.collection?.bagNumber || 'N/A' },
        { label: 'Status', value: donation?.status || 'N/A' }
      ]),
      footer: 'If any of these details are incorrect, please contact the hospital team.'
    })
  }),

  notification: (payload) => buildNotificationTemplate(payload)
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    if (!isEmailConfigured()) {
      return { success: false, skipped: true, message: 'Email service not configured' };
    }

    const transporter = createTransporter();
    const templateFn = templates[template];
    if (!templateFn) {
      throw new Error(`Email template '${template}' not found`);
    }

    const { subject, html } = Array.isArray(data) ? templateFn(...data) : templateFn(data);

    const mailOptions = {
      from: `"${BRAND.name}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmail = async (recipients, template, dataFn) => {
  const results = [];
  for (const recipient of recipients) {
    const result = await sendEmail(recipient.email, template, dataFn(recipient));
    results.push({ email: recipient.email, ...result });
  }
  return results;
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
};
