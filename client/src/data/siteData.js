export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Insights', to: '/insights' },
  { label: 'About Us', to: '/about' },
  { label: 'Case Studies', to: '/case-studies' },
];

// Shown in the mobile drawer and footer so these routes stay reachable.
export const secondaryNavLinks = [
  { label: 'Our Approach', to: '/approach' },
  { label: 'Contact', to: '/contact' },
];

// TODO(client): verify these figures before publishing.
export const aboutStats = [
  { value: 50, suffix: '+', label: 'Dedicated Specialists' },
  { value: 12, suffix: '+', label: 'Years of Impact' },
  { value: 300, suffix: '+', label: 'Clients Trust Us' },
];

export const kontinueValues = [
  { tag: 'Principle', title: 'Integrity First', description: 'Honest advice and transparent records, even when the answer is not the easy one.' },
  { tag: 'Partnership', title: 'Collaborative Mindset', description: 'We work alongside your team, sharing context so decisions are made together.' },
  { tag: 'Approach', title: 'Informed Agility', description: 'Grounded in detail, ready to adapt as regulations and your business change.' },
  { tag: 'Outcome', title: 'Sustainable Results', description: 'Structures and habits that keep your finances clear long after the work is done.' },
];

// Placeholder case studies: replace with approved client stories before publishing.
export const caseStudies = [
  {
    slug: 'retail-bookkeeping',
    sector: 'Retail',
    title: 'Bringing order to multi-location bookkeeping',
    summary: 'Consolidated records across three stores into one monthly reporting cycle.',
    result: 'Placeholder result',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'startup-annual-accounts',
    sector: 'Technology',
    title: 'First annual accounts for a growing start-up',
    summary: 'Prepared year-end statements and set up a clear process for the years ahead.',
    result: 'Placeholder result',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'cross-border-tax',
    sector: 'Professional Services',
    title: 'Clarifying cross-border tax obligations',
    summary: 'Mapped Dutch and international filing responsibilities into a single calendar.',
    result: 'Placeholder result',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
  },
];

export const serviceCatalog = [
  {
    slug: 'bookkeeping-accounting',
    title: 'Bookkeeping & Accounting',
    shortDescription: 'Organised financial records and day-to-day bookkeeping support.',
    longDescription:
      'Reliable bookkeeping and accounting support designed to keep your financial records accurate, clear and manageable.',
    audience: 'Self-employed professionals, small businesses and growing organisations.',
    activities: [
      'Daily transaction recording',
      'Accounts payable and receivable administration',
      'Bank reconciliation',
      'Maintaining general ledgers',
    ],
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Keep your business finances organised.',
  },
  {
    slug: 'annual-accounts',
    title: 'Annual Accounts & Reporting',
    shortDescription: 'Financial statements and year-end reporting support.',
    longDescription:
      'Support with annual accounts, reconciliation and year-end reporting to give you a clearer view of financial performance.',
    audience: 'Businesses preparing annual reporting and year-end financial administration.',
    activities: [
      'Annual account preparation',
      'Balance sheet and P&L review',
      'Reconciliation support',
      'Supporting documentation for filing requirements',
    ],
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Understand your financial performance.',
  },
  {
    slug: 'tax-advisory',
    title: 'Tax Advisory & Compliance',
    shortDescription: 'Tax-related advice and assistance with applicable tax filings.',
    longDescription:
      'General guidance on Dutch tax obligations and compliance matters, with a clear distinction between general information and personal advice.',
    audience: 'Business owners seeking practical information on tax obligations and reporting.',
    activities: [
      'BTW / Omzetbelasting guidance',
      'Inkomstenbelasting and relationship to obligations',
      'Compliance support',
      'General tax administration coordination',
    ],
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Navigate your tax responsibilities with confidence.',
  },
  {
    slug: 'financial-management',
    title: 'Financial Management',
    shortDescription: 'Financial administration and business finance guidance.',
    longDescription:
      'Support for financial organisation, business planning and better decision-making through clearer reporting and administration.',
    audience: 'Business owners who need a more structured financial overview.',
    activities: [
      'Financial administration review',
      'Budget review',
      'Cash-flow monitoring support',
      'Process improvement recommendations',
    ],
    image:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Better financial understanding for better decisions.',
  },
  {
    slug: 'payroll',
    title: 'Payroll Administration',
    shortDescription: 'Employee payroll and wage administration, subject to service confirmation.',
    longDescription:
      'Payroll administration support can include salary administration, payslip coordination and payroll reporting, subject to confirmed service scope.',
    audience: 'Businesses seeking structured payroll support.',
    activities: [
      'Monthly payroll processing',
      'Employee salary administration',
      'Payslip preparation',
      'Payroll reporting',
    ],
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Organised payroll. Better business administration.',
  },
  {
    slug: 'international-tax',
    title: 'International Tax',
    shortDescription: 'Cross-border tax and international business matters, subject to confirmation.',
    longDescription:
      'International tax matters are positioned carefully and should be confirmed in relation to the applicable entity and scope of advice.',
    audience: 'Businesses with international activities and cross-border tax considerations.',
    activities: [
      'International tax review',
      'General cross-border tax information',
      'Scope confirmation for advisory support',
      'Structured guidance where applicable',
    ],
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80',
    highlight: 'Subject to confirmation.',
  },
];

export const benefits = [
  {
    title: 'Experience',
    description: 'Established in 2001, with a long-standing presence in The Hague.',
  },
  {
    title: 'Professional Expertise',
    description: 'Accounting, bookkeeping and financial administration knowledge.',
  },
  {
    title: 'Personal Attention',
    description: 'An approachable service focused on understanding individual business needs.',
  },
  {
    title: 'Financial Clarity',
    description: 'Helping clients maintain organised records and understand their financial position.',
  },
];

export const processSteps = [
  {
    title: 'Understanding Your Needs',
    description: 'We begin by understanding your business, current financial administration and requirements.',
  },
  {
    title: 'Reviewing Your Financial Situation',
    description: 'We discuss the records, reporting requirements and services relevant to your business.',
  },
  {
    title: 'Providing Professional Support',
    description: 'We agree on the scope of work and provide the accounting or financial support required.',
  },
  {
    title: 'Ongoing Communication',
    description: 'We maintain communication and help you stay informed about your financial administration.',
  },
];

export const faqs = [
  {
    question: 'What services does Kontinue Consultancy provide?',
    answer:
      'We support businesses with bookkeeping, accounting, annual accounts, financial administration, payroll and business financial advice. Our services are tailored to the needs of each client.',
  },
  {
    question: 'Does Kontinue assist with bookkeeping for small businesses?',
    answer:
      'Yes. We provide bookkeeping and accounting support for businesses that need clear and reliable day-to-day financial administration.',
  },
  {
    question: 'Can Kontinue help prepare annual accounts?',
    answer:
      'Yes. Annual accounts and reporting support can be included based on the specific requirements of the business and the applicable reporting obligations.',
  },
  {
    question: 'Can I get assistance with VAT (BTW) returns?',
    answer:
      'Tax-related services may be available depending on the scope of work and the company’s confirmed service profile. We recommend confirming specific support before finalising engagement details.',
  },
  {
    question: 'Does Kontinue provide corporate and personal tax advisory services?',
    answer:
      'We can discuss the relevant support that may be appropriate to your situation. The exact scope should be agreed in advance.',
  },
  {
    question: 'Does Kontinue assist with payroll administration?',
    answer:
      'Payroll administration can be part of our support offering subject to confirmation of service scope and the specific needs of the client.',
  },
  {
    question: 'How can I become a client?',
    answer:
      'Start by contacting us with your business details and requirements. We will discuss your needs and recommend the most suitable support.',
  },
  {
    question: 'What documents are required to get started?',
    answer:
      'The required documents depend on the services needed. Typical information includes existing financial records, business details and any relevant reporting obligations.',
  },
  {
    question: 'Can I arrange an initial consultation?',
    answer:
      'Yes. We welcome an initial conversation to understand your business and discuss how we may support you.',
  },
  {
    question: 'How can I contact the office in The Hague?',
    answer:
      'You can reach our team through the contact page or by submitting an enquiry. We will respond to discuss your requirements.',
  },
];

export const teamMembers = [
  {
    name: 'Team profile to be added',
    designation: 'Professional Team Member',
    background: 'Profile information to be confirmed by the client.',
    qualifications: 'Qualifications to be added.',
  },
  {
    name: 'Team profile to be added',
    designation: 'Professional Team Member',
    background: 'Profile information to be confirmed by the client.',
    qualifications: 'Qualifications to be added.',
  },
  {
    name: 'Team profile to be added',
    designation: 'Professional Team Member',
    background: 'Profile information to be confirmed by the client.',
    qualifications: 'Qualifications to be added.',
  },
];

export const testimonials = [
  {
    quote: 'Verified client testimonial to be added.',
    name: 'Client testimonial placeholder',
  },
  {
    quote: 'Verified client testimonial to be added.',
    name: 'Client testimonial placeholder',
  },
  {
    quote: 'Verified client testimonial to be added.',
    name: 'Client testimonial placeholder',
  },
];

export const insights = [
  {
    slug: 'bookkeeping-mistakes-small-businesses-avoid',
    category: 'Bookkeeping',
    title: '5 Bookkeeping Mistakes Small Businesses Should Avoid',
    excerpt: 'Good financial habits reduce avoidable errors and make reporting more manageable.',
    author: 'Kontinue Consultancy',
    date: '2026-01-15',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    content: [
      'Bookkeeping should be consistent, not reactive. When records are left to pile up, errors are more likely and the true financial position becomes harder to interpret.',
      'A small business benefits from clear routines: recording transactions promptly, keeping supporting documents organised, and reviewing bank activity at regular intervals.',
      'By maintaining a reliable system, owners can spot issues sooner and make better decisions before deadlines arrive.',
    ],
  },
  {
    slug: 'understanding-btw-vat-returns-in-the-netherlands',
    category: 'Dutch Taxation',
    title: 'Understanding BTW and VAT Returns in the Netherlands',
    excerpt: 'A practical overview of what to understand before filing and managing tax-related obligations.',
    author: 'Kontinue Consultancy',
    date: '2026-02-04',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    content: [
      'VAT returns form a core part of many Dutch businesses’ administrative cycle. Good preparation makes the process more predictable and reduces avoidable stress.',
      'The key is not only to submit returns on time, but to maintain the necessary records and ensure that transactions are correctly categorised and reconciled.',
      'This article is for general information only and should not be treated as personal tax advice.',
    ],
    disclaimer: 'This article is for general information only and should not be treated as personal tax advice.',
  },
  {
    slug: 'why-annual-accounts-matter',
    category: 'Annual Accounts',
    title: 'Why Annual Accounts Matter for Your Business',
    excerpt: 'Annual accounts support transparency, compliance and a clearer understanding of performance.',
    author: 'Kontinue Consultancy',
    date: '2026-02-18',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    content: [
      'Annual accounts are more than a reporting requirement. They offer a structured snapshot of a business’s financial position over the year.',
      'When prepared with care, they help identify patterns, highlight areas for improvement and support better planning for the next period.',
      'The information also matters for internal decision-making and external communication with stakeholders.',
    ],
  },
  {
    slug: 'maintain-healthy-cash-flow',
    category: 'Business Finance',
    title: 'How to Maintain Healthy Cash Flow',
    excerpt: 'Cash flow clarity helps ensure your financial obligations remain manageable and predictable.',
    author: 'Kontinue Consultancy',
    date: '2026-03-05',
    image:
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    content: [
      'Cash flow management starts with visibility. Business owners need a simple and regular view of incoming and outgoing funds, not just an annual summary.',
      'When financial administration is organised, it becomes easier to forecast commitments, spot bottlenecks and act early if the business needs attention.',
      'Good cash-flow habits reduce surprise and create a stronger foundation for sustainable decisions.',
    ],
  },
  {
    slug: 'financial-records-business-owners-should-maintain',
    category: 'Business Finance',
    title: 'Financial Records Every Business Owner Should Maintain',
    excerpt: 'A well-structured record-keeping system keeps administration manageable and decision-making clearer.',
    author: 'Kontinue Consultancy',
    date: '2026-03-20',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    content: [
      'Financial records do more than support compliance. They create a practical history of the business and help owners understand what is happening in real time.',
      'A dependable system includes sales, purchases, bank activity, payroll records, tax documents and year-end statements. The easier these are to review, the easier it is to act.',
      'Organised records reduce duplication and support better conversations with advisers, lenders or stakeholders.',
    ],
  },
  {
    slug: 'understanding-payroll-administration',
    category: 'Payroll',
    title: 'Understanding Payroll Administration',
    excerpt: 'Payroll administration requires structure, consistency and clear communication.',
    author: 'Kontinue Consultancy',
    date: '2026-04-02',
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    content: [
      'A reliable payroll process supports both employee confidence and business clarity. Payroll administration depends on consistent data, clear processing cycles and careful review.',
      'Where payroll is not regularly monitored, small issues can become larger administrative problems. That is why clear responsibility and a structured workflow matter.',
      'This overview is general in nature and should be reviewed in relation to actual service scope and any applicable obligations.',
    ],
  },
];

export const legalPages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    summary: 'We are committed to handling personal information responsibly and with respect for privacy.',
    paragraphs: [
      'Kontinue Consultancy processes personal data only where necessary for providing professional services, responding to enquiries, or managing client communications. We aim to collect only the information needed to deliver our services effectively.',
      'Information may include contact details, basic business information, and relevant documents required for professional support. We keep such information confidential and store it securely in accordance with applicable legal and professional standards.',
      'We do not sell personal information. Data may be shared only with trusted service providers or professional advisers where required for the delivery of services or compliance obligations.',
      'Clients may request information about the personal data we hold, and they may also ask us to correct or update details. Please contact our office if you have any privacy-related questions.',
    ],
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    summary: 'This website may use cookies to improve functionality and understand how visitors interact with our content.',
    paragraphs: [
      'Cookies are small text files placed on your device to help improve website performance, remember preferences and understand site usage. We may use cookies for analytics, usability and security purposes where appropriate.',
      'Some cookies are essential for the website to function correctly, while others may be optional and used to improve the user experience. You can usually disable or delete cookies through your browser settings.',
      'We do not use cookies to sell personal information, and our goal is to maintain a user-friendly and compliant experience for visitors.',
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Disclaimer',
    summary: 'Information on this website is intended for general guidance and should not replace tailored professional advice.',
    paragraphs: [
      'Kontinue Consultancy provides general information and professional support for business financial administration, accounting and related services. The contents of this website are for informational purposes only and should not be treated as formal legal, tax or financial advice in any given case.',
      'Any services or advice offered are subject to client-specific agreements and service scope. The exact nature of tax, legal and compliance support should be confirmed with the company before being relied upon.',
      'While every effort has been made to provide accurate information, no guarantee is made that the content is complete, current or suitable for all circumstances. We recommend seeking direct professional advice for specific matters.',
    ],
  },
  {
    slug: 'company-details',
    title: 'Company Details',
    summary: 'Formal company information and business details should be verified against official records before publication.',
    paragraphs: [
      'Kontinue Consultancy is a professional business operating in The Hague, Netherlands. Formal legal and corporate details, including registration status and company number, should be confirmed with official records and relevant authorities.',
      'This website is intended to provide general information about the firm and its service offering. Any official legal references should be checked before making business decisions based on them.',
    ],
  },
];
