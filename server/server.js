const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const forwardedHosts = (req.get('x-forwarded-host') || '')
    .split(',')
    .map((host) => host.trim());
  const hosts = [req.get('host'), ...forwardedHosts].filter(Boolean);
  const forwardedProtocols = (req.get('x-forwarded-proto') || '')
    .split(',')
    .map((protocol) => protocol.trim());
  const protocols = [req.protocol, ...forwardedProtocols].filter(Boolean);
  const origin = req.get('origin');
  const sameOrigin = origin && hosts.some((host) =>
    protocols.some((protocol) => origin === `${protocol}://${host}`),
  );

  cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin) || sameOrigin) {
        return callback(null, true);
      }
      return callback(new Error('Origin is not allowed by CORS.'));
    },
  })(req, res, next);
});
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '20kb' }));

const serviceCatalog = [
  {
    slug: 'bookkeeping-accounting',
    title: 'Bookkeeping & Accounting',
    shortDescription: 'Organised financial records and day-to-day bookkeeping support.',
    audience: 'Self-employed professionals, small businesses and growing organisations.',
  },
  {
    slug: 'annual-accounts',
    title: 'Annual Accounts & Reporting',
    shortDescription: 'Financial statements and year-end reporting support.',
    audience: 'Businesses preparing annual reporting and year-end administration.',
  },
  {
    slug: 'tax-advisory',
    title: 'Tax Advisory & Compliance',
    shortDescription: 'Tax-related advice and assistance with applicable filings.',
    audience: 'Business owners seeking guidance on tax obligations and reporting.',
  },
  {
    slug: 'financial-management',
    title: 'Financial Management',
    shortDescription: 'Financial administration and business finance guidance.',
    audience: 'Business owners who need a clearer financial overview.',
  },
  {
    slug: 'payroll',
    title: 'Payroll Administration',
    shortDescription: 'Payroll support, subject to confirmation of service scope.',
    audience: 'Businesses seeking structured payroll support.',
  },
  {
    slug: 'international-tax',
    title: 'International Tax',
    shortDescription: 'Cross-border tax matters, subject to confirmation of service scope.',
    audience: 'Businesses with international activities and tax considerations.',
  },
];

const insights = [
  {
    slug: 'bookkeeping-mistakes-small-businesses-avoid',
    category: 'Bookkeeping',
    title: '5 Bookkeeping Mistakes Small Businesses Should Avoid',
    excerpt: 'Good financial habits reduce avoidable errors and make reporting more manageable.',
    author: 'Kontinue Consultancy',
    date: '2026-01-15',
  },
  {
    slug: 'understanding-btw-vat-returns-in-the-netherlands',
    category: 'Dutch Taxation',
    title: 'Understanding BTW and VAT Returns in the Netherlands',
    excerpt: 'A practical overview of what to understand before filing and managing obligations.',
    author: 'Kontinue Consultancy',
    date: '2026-02-04',
  },
  {
    slug: 'why-annual-accounts-matter',
    category: 'Annual Accounts',
    title: 'Why Annual Accounts Matter for Your Business',
    excerpt: 'Annual accounts support transparency, compliance and a clearer view of performance.',
    author: 'Kontinue Consultancy',
    date: '2026-02-18',
  },
  {
    slug: 'maintain-healthy-cash-flow',
    category: 'Business Finance',
    title: 'How to Maintain Healthy Cash Flow',
    excerpt: 'Cash flow clarity helps keep financial obligations visible and manageable.',
    author: 'Kontinue Consultancy',
    date: '2026-03-05',
  },
  {
    slug: 'financial-records-business-owners-should-maintain',
    category: 'Business Finance',
    title: 'Financial Records Every Business Owner Should Maintain',
    excerpt: 'A practical record-keeping system makes financial administration clearer.',
    author: 'Kontinue Consultancy',
    date: '2026-03-20',
  },
  {
    slug: 'understanding-payroll-administration',
    category: 'Payroll',
    title: 'Understanding Payroll Administration',
    excerpt: 'Payroll administration depends on structure, consistency and clear communication.',
    author: 'Kontinue Consultancy',
    date: '2026-04-02',
  },
];

const mailConfigured = Boolean(
  process.env.SMTP_HOST
  && process.env.SMTP_FROM
  && process.env.CONTACT_RECIPIENT,
);

const mailTransport = mailConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      ...(process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } }
        : {}),
    })
  : null;

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please wait a little before trying again.' },
});

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  return next();
};

const requiredText = (field, label, maxLength) =>
  body(field)
    .isString()
    .withMessage(`${label} must be text.`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${label} is required.`)
    .bail()
    .isLength({ max: maxLength })
    .withMessage(`${label} must be ${maxLength} characters or fewer.`);

const emailField = body('email')
  .isEmail()
  .withMessage('Enter a valid email address.')
  .bail()
  .normalizeEmail();

const optionalText = (field, label, maxLength) =>
  body(field)
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage(`${label} must be text.`)
    .bail()
    .trim()
    .isLength({ max: maxLength })
    .withMessage(`${label} must be ${maxLength} characters or fewer.`);

const deliverMail = async ({ subject, replyTo, lines }) => {
  if (!mailTransport) {
    return false;
  }

  await mailTransport.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_RECIPIENT,
    replyTo,
    subject,
    text: lines.join('\n'),
  });
  return true;
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kontinu-api' });
});

app.get('/api/services', (req, res) => {
  res.json(serviceCatalog);
});

app.get('/api/insights', (req, res) => {
  res.json(insights);
});

app.post(
  '/api/contact',
  submitLimiter,
  [
    requiredText('name', 'Name', 120),
    emailField,
    requiredText('message', 'Message', 5000),
    optionalText('company', 'Company', 160),
    optionalText('phone', 'Phone', 40),
    optionalText('service', 'Service', 160),
    body('consent').custom((value) => value === true).withMessage('Consent is required to submit an enquiry.'),
  ],
  validateRequest,
  async (req, res) => {
    if (!mailConfigured) {
      return res.status(503).json({
        message: 'Enquiry submission is not configured yet. Please contact the site administrator.',
      });
    }

    const { name, email, company, phone, service, message } = req.body;
    try {
      await deliverMail({
        subject: `Website enquiry from ${name}`,
        replyTo: email,
        lines: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || 'Not provided'}`,
          `Phone: ${phone || 'Not provided'}`,
          `Service: ${service || 'Not specified'}`,
          '',
          'Message:',
          message,
        ],
      });
      return res.status(202).json({ message: 'Thank you. Your enquiry has been sent successfully.' });
    } catch (error) {
      console.error('Unable to deliver contact enquiry:', error.message);
      return res.status(502).json({
        message: 'We could not deliver your enquiry right now. Please try again later.',
      });
    }
  },
);

app.post(
  '/api/consultation',
  submitLimiter,
  [
    requiredText('name', 'Name', 120),
    emailField,
    body('preferredDate')
      .isISO8601()
      .withMessage('Enter a valid preferred date.'),
    body('preferredTime')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('Enter a valid preferred time.'),
    optionalText('company', 'Company', 160),
    optionalText('phone', 'Phone', 40),
    optionalText('service', 'Service', 160),
    optionalText('message', 'Message', 5000),
  ],
  validateRequest,
  async (req, res) => {
    if (!mailConfigured) {
      return res.status(503).json({
        message: 'Consultation requests are not configured yet. Please contact the site administrator.',
      });
    }

    const { name, email, company, phone, service, preferredDate, preferredTime, message } = req.body;
    try {
      await deliverMail({
        subject: `Consultation request from ${name}`,
        replyTo: email,
        lines: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || 'Not provided'}`,
          `Phone: ${phone || 'Not provided'}`,
          `Service: ${service || 'Not specified'}`,
          `Preferred date: ${preferredDate}`,
          `Preferred time: ${preferredTime}`,
          '',
          'Message:',
          message || 'No message provided.',
        ],
      });
      return res.status(202).json({ message: 'Thank you. Your consultation request has been sent successfully.' });
    } catch (error) {
      console.error('Unable to deliver consultation request:', error.message);
      return res.status(502).json({
        message: 'We could not deliver your request right now. Please try again later.',
      });
    }
  },
);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request is too large.' });
  }
  console.error('API request failed:', error.message);
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Kontinue API listening on port ${PORT}`);
  });
}

module.exports = app;
