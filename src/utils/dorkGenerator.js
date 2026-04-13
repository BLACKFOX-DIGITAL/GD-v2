function cleanDomain(domain) {
  const trimmed = domain.trim();
  try {
    const withProto = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const url = new URL(withProto);
    return url.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return trimmed.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
  }
}

function extractName(domain) {
  return domain.split('.')[0];
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
        { query: `site:${domain}`,                                          desc: 'All indexed pages on their website' },
        { query: `"${name}" CEO OR founder OR president OR owner`,          desc: 'Find leadership / decision makers' },
        { query: `"${domain}" "about us" OR "our team" OR "who we are"`,    desc: 'About page — company overview & key people' },
        { query: `"${name}" "headquartered in" OR "based in" OR "offices"`, desc: 'Office locations & HQ address' },
      ],
    },
    {
      id: 'emails',
      label: 'Emails',
      color: 'green',
      dorks: [
        { query: `"@${domain}" -site:${domain}`,                                          desc: 'Emails mentioned on other websites (most useful)' },
        { query: `"@${domain}" filetype:pdf OR filetype:xlsx OR filetype:csv`,            desc: 'Emails leaked in public documents or spreadsheets' },
        { query: `intext:"@${domain}" -site:${domain}`,                                   desc: 'Pages outside their site containing email addresses' },
        { query: `site:${domain} intext:"@${domain}" intitle:contact OR intitle:team`,    desc: 'Contact or team page on their own site' },
      ],
    },
    {
      id: 'phones',
      label: 'Phone Numbers',
      color: 'orange',
      dorks: [
        { query: `site:${domain} intitle:contact OR intitle:"contact us"`,  desc: 'Their contact page — most likely has a phone number' },
        { query: `site:${domain} "tel:" OR "phone:" OR "call us"`,          desc: 'Phone number formatted links on their site' },
        { query: `"${domain}" "+1" OR "(800)" OR "(888)" -site:${domain}`,  desc: 'Phone numbers mentioned on other sites' },
      ],
    },
    {
      id: 'linkedin-company',
      label: 'LinkedIn — Company Page',
      color: 'indigo',
      dorks: [
        { query: `site:linkedin.com/company "${name}"`,                     desc: 'Official LinkedIn company profile' },
        { query: `site:linkedin.com/company "${name}" -intitle:"${name}"`,  desc: 'Related LinkedIn company pages (subsidiaries, similar names)' },
      ],
    },
    {
      id: 'linkedin-people',
      label: 'LinkedIn — Employees',
      color: 'purple',
      dorks: [
        { query: `site:linkedin.com/in "${name}" CEO OR president OR owner OR founder`,          desc: 'C-suite & founders — top decision makers' },
        { query: `site:linkedin.com/in "${name}" VP OR director OR manager OR head`,             desc: 'Mid-to-senior level — likely buying decision makers' },
        { query: `site:linkedin.com/in "${name}" sales OR "business development" OR account`,   desc: 'Sales team — useful to know who you\'re competing with' },
        { query: `site:linkedin.com/in "${domain}"`,                                             desc: 'Profiles that list the domain (strong match)' },
      ],
    },
    {
      id: 'social',
      label: 'Social Media',
      color: 'pink',
      dorks: [
        { query: `site:facebook.com/pages "${name}" OR site:facebook.com "${domain}"`, desc: 'Facebook business page' },
        { query: `site:twitter.com "${name}"`,                                          desc: 'Twitter / X profile' },
        { query: `site:instagram.com "${name}"`,                                        desc: 'Instagram profile' },
        { query: `site:youtube.com "${name}"`,                                          desc: 'YouTube channel' },
      ],
    },
    {
      id: 'business',
      label: 'Business Info',
      color: 'teal',
      dorks: [
        { query: `site:crunchbase.com/organization "${name}"`,                  desc: 'Crunchbase profile — funding rounds, investors, team size' },
        { query: `site:zoominfo.com/c "${name}"`,                               desc: 'ZoomInfo — estimated revenue, employee count, contacts' },
        { query: `"${name}" "annual revenue" OR "ARR" OR "MRR" OR "revenue"`,  desc: 'Revenue mentions across the web — helps qualify the lead' },
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
        { query: `"${companyName}" site:linkedin.com/in`,                                    desc: 'All LinkedIn profiles mentioning this company name' },
        { query: `"${companyName}" "@${domain}"`,                                            desc: 'Email addresses linked to this company name' },
        { query: `"${companyName}" CEO OR founder OR director OR president`,                 desc: 'Decision makers at this specific company' },
        { query: `"${companyName}" site:crunchbase.com OR site:zoominfo.com`,                desc: 'Business intelligence profiles (funding, headcount, revenue)' },
        { query: `"${companyName}" "press release" OR "news" 2024 OR 2025`,                 desc: 'Recent news — good for warm outreach context' },
      ],
    });
  }

  if (personName.trim()) {
    sections.push({
      id: 'enrich-person',
      label: `Person: "${personName}"`,
      color: 'rose',
      dorks: [
        { query: `"${personName}" site:linkedin.com/in`,                                        desc: 'Their LinkedIn profile' },
        { query: `"${personName}" "@${domain}"`,                                                desc: 'Their work email address' },
        { query: `"${personName}" "${companyName || domain}" email OR phone OR contact`,        desc: 'Contact details linked to this person' },
        { query: `"${personName}" site:twitter.com OR site:instagram.com`,                      desc: 'Personal social media presence' },
        { query: `"${personName}" interview OR speaker OR podcast OR "guest post"`,             desc: 'Public content — great for personalizing your pitch' },
      ],
    });
  }

  return sections;
}
