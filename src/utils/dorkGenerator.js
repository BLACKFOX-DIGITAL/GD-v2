function cleanDomain(domain) {
  return domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
    .toLowerCase()
    .trim();
}

function extractName(domain) {
  const cleaned = cleanDomain(domain);
  return cleaned.split('.')[0];
}

export { cleanDomain };

export function generateDorks(rawDomain) {
  const domain = cleanDomain(rawDomain);
  const name = extractName(domain);

  return [
    {
      id: 'company',
      label: 'Company Identity',
      color: 'blue',
      dorks: [
        `site:${domain}`,
        `"${domain}" -site:${domain}`,
        `"${domain}" "about us" OR "who we are" OR "our story"`,
        `"${name}" company overview OR headquarters OR founded OR employees`,
        `"${name}" CEO OR founder OR president OR owner`,
        `"${name}" "company size" OR "number of employees" OR "team size"`,
      ],
    },
    {
      id: 'emails',
      label: 'Emails',
      color: 'green',
      dorks: [
        `site:${domain} "@${domain}"`,
        `"@${domain}" filetype:pdf OR filetype:xlsx OR filetype:csv OR filetype:docx`,
        `intext:"@${domain}"`,
        `"@${domain}" -site:${domain}`,
        `"${domain}" "email" OR "contact" -site:${domain}`,
        `"${name}" "@${domain}" site:linkedin.com`,
        `"${name}" email list OR directory filetype:xls OR filetype:csv`,
      ],
    },
    {
      id: 'phones',
      label: 'Phone Numbers',
      color: 'orange',
      dorks: [
        `site:${domain} "phone" OR "tel:" OR "call us"`,
        `site:${domain} intitle:contact`,
        `"${domain}" "+1" OR "phone:" OR "fax:"`,
        `"${name}" "phone number" OR "contact number" OR "direct line"`,
        `"${domain}" "(800)" OR "(888)" OR "(877)" OR "(866)"`,
        `site:${domain} "schedule a call" OR "book a meeting"`,
      ],
    },
    {
      id: 'linkedin-company',
      label: 'LinkedIn — Company Page',
      color: 'indigo',
      dorks: [
        `site:linkedin.com/company "${name}"`,
        `site:linkedin.com "${domain}" company`,
        `site:linkedin.com/company "${name}" employees OR overview OR about`,
        `site:linkedin.com "${name}" headquarters OR industry OR founded`,
      ],
    },
    {
      id: 'linkedin-people',
      label: 'LinkedIn — Employees',
      color: 'purple',
      dorks: [
        `site:linkedin.com/in "${name}"`,
        `site:linkedin.com/in "@${domain}"`,
        `site:linkedin.com/in "${domain}"`,
        `site:linkedin.com/in "${name}" manager OR director OR sales OR VP OR head`,
        `site:linkedin.com/in "${name}" CEO OR president OR founder OR owner`,
        `site:linkedin.com/in "${name}" marketing OR business development OR operations`,
      ],
    },
    {
      id: 'social',
      label: 'Social Media',
      color: 'pink',
      dorks: [
        `site:facebook.com "${name}"`,
        `site:twitter.com "${name}"`,
        `site:instagram.com "${name}"`,
        `site:youtube.com "${name}"`,
        `site:tiktok.com "${name}"`,
        `site:reddit.com "${name}" OR "${domain}"`,
        `"${domain}" site:facebook.com OR site:twitter.com OR site:instagram.com OR site:youtube.com`,
      ],
    },
    {
      id: 'jobs',
      label: 'Job Postings',
      color: 'cyan',
      dorks: [
        `site:linkedin.com/jobs "${name}"`,
        `site:indeed.com "${name}"`,
        `site:glassdoor.com/job "${name}"`,
        `site:${domain} "careers" OR "we are hiring" OR "join our team" OR "job openings"`,
        `"${name}" "hiring" OR "job opening" OR "open position" 2024 OR 2025`,
        `"${name}" site:lever.co OR site:greenhouse.io OR site:workable.com`,
      ],
    },
    {
      id: 'news',
      label: 'News & Press',
      color: 'yellow',
      dorks: [
        `"${name}" site:businesswire.com OR site:prnewswire.com`,
        `"${name}" "press release" OR "news release" OR "announcement"`,
        `"${name}" news 2024 OR 2025`,
        `"${domain}" site:techcrunch.com OR site:forbes.com OR site:businessinsider.com`,
        `"${name}" "award" OR "partnership" OR "expansion" OR "launch"`,
        `"${name}" "acquired" OR "merger" OR "funding" OR "raised"`,
      ],
    },
    {
      id: 'business',
      label: 'Business Info',
      color: 'teal',
      dorks: [
        `site:crunchbase.com "${name}"`,
        `site:bloomberg.com "${name}"`,
        `site:zoominfo.com "${name}"`,
        `"${name}" "annual revenue" OR "revenue" OR "ARR" OR "MRR"`,
        `"${name}" "series A" OR "series B" OR "funding round" OR "raised $"`,
        `"${name}" "headquartered in" OR "based in" OR "offices in"`,
        `"${name}" site:dnb.com OR site:hoovers.com`,
      ],
    },
    {
      id: 'reviews',
      label: 'Reviews & Reputation',
      color: 'amber',
      dorks: [
        `site:glassdoor.com "${name}" reviews`,
        `site:trustpilot.com "${name}"`,
        `site:g2.com "${name}"`,
        `site:capterra.com "${name}"`,
        `site:yelp.com "${name}"`,
        `"${name}" reviews OR rating OR reputation -site:${domain}`,
        `"${name}" complaints OR "better business bureau" OR BBB`,
      ],
    },
    {
      id: 'techstack',
      label: 'Tech Stack & Tools',
      color: 'violet',
      dorks: [
        `site:${domain} "powered by" OR "built with" OR "we use"`,
        `"${name}" site:stackshare.io`,
        `"${domain}" site:builtwith.com`,
        `site:${domain} "Salesforce" OR "HubSpot" OR "Marketo" OR "Shopify"`,
        `site:${domain} "AWS" OR "Azure" OR "Google Cloud"`,
        `"${name}" "technology" OR "platform" OR "software" OR "tools we use"`,
      ],
    },
    {
      id: 'documents',
      label: 'Exposed Documents',
      color: 'red',
      dorks: [
        `site:${domain} filetype:pdf OR filetype:docx OR filetype:xlsx`,
        `site:${domain} filetype:xls OR filetype:csv`,
        `"${domain}" "staff directory" OR "employee list" OR "team" filetype:pdf`,
        `"${name}" filetype:pdf "contact" OR "directory" OR "roster"`,
        `site:${domain} filetype:ppt OR filetype:pptx "confidential" OR "internal"`,
        `"${name}" filetype:xlsx OR filetype:csv "email" OR "phone"`,
      ],
    },
  ];
}

export function generateEnrichmentDorks(rawDomain, companyName, personName) {
  const domain = cleanDomain(rawDomain);
  const sections = [];

  if (companyName.trim()) {
    sections.push({
      id: 'enrich-company',
      label: `Company: "${companyName}"`,
      color: 'teal',
      dorks: [
        `"${companyName}" site:linkedin.com/in`,
        `"${companyName}" "@${domain}"`,
        `"${companyName}" email OR contact OR phone`,
        `"${companyName}" employees OR staff OR team site:linkedin.com`,
        `"${companyName}" headquarters OR address OR location`,
        `"${companyName}" CEO OR founder OR director OR president`,
        `"${companyName}" revenue OR "number of employees" OR "company size"`,
        `"${companyName}" site:crunchbase.com OR site:bloomberg.com OR site:zoominfo.com`,
        `"${companyName}" "press release" OR news 2024 OR 2025`,
      ],
    });
  }

  if (personName.trim()) {
    sections.push({
      id: 'enrich-person',
      label: `Person: "${personName}"`,
      color: 'rose',
      dorks: [
        `"${personName}" site:linkedin.com`,
        `"${personName}" "@${domain}"`,
        `"${personName}" "${companyName || domain}" contact OR email OR phone`,
        `"${personName}" "${companyName || domain}" site:linkedin.com/in`,
        `"${personName}" email OR phone OR contact`,
        `"${personName}" site:twitter.com OR site:facebook.com OR site:instagram.com`,
        `"${personName}" interview OR "guest post" OR speaker OR podcast`,
        `"${personName}" "${companyName || name}" title OR role OR position`,
      ],
    });
  }

  return sections;
}
