// ── Single source of truth for all site content ─────────────────────────────

export const PROFILE = {
  name: 'Shrivarshan Kasi Arul',
  handle: 'theloav',
  role: 'Security Engineer',
  tagline: 'Offensive Security Operator',
  company: 'InCorp Global',
  location: 'Avadi, Chennai, Tamil Nadu',
  email: 'shrivarshan81@gmail.com',
  phone: '+91 8637406402',
  education: 'BTech CSE (Cybersecurity) — Vel Tech University',
  bio: "Cybersecurity professional operating across penetration testing, threat intelligence, DevSecOps, digital forensics, and AI security. I don't just find vulnerabilities — I gate production releases, build automated security pipelines, and respond to live incidents.",
  subBio:
    'Focused on AI-powered threat detection and resilient, zero-trust architectures — breaking systems to make them harder to break.',
}

export const SOCIALS = {
  github: 'https://github.com/theloav',
  linkedin: 'https://www.linkedin.com/in/shri-arshan-743717270/',
  medium: 'https://medium.com/@shrivarshan81',
  email: 'mailto:shrivarshan81@gmail.com',
}

// Served from public/. `download` attr sets the saved filename.
export const RESUME = {
  href: '/Shrivarshan-Kasi-Arul-Resume.pdf',
  filename: 'Shrivarshan-Kasi-Arul-Resume.pdf',
}

export const EMAILJS = {
  serviceId: 'service_y9sqms7',
  templateId: 'template_9hqe4nr',
  publicKey: 'hu3A04Z6jKgiLamF6',
}

export const STATS = [
  { label: 'Vulnerabilities Found', value: 20, suffix: '+' },
  { label: 'Projects Secured', value: 10, suffix: '+' },
  { label: 'Certifications', value: 5, suffix: '+' },
  { label: 'Hall of Fame', value: 1, prefix: '#' },
]

export const CERTS = [
  { name: 'eJPT', full: 'eLearnSecurity Junior Penetration Tester', done: true },
  { name: 'CPT', full: 'Certified Penetration Tester — Red Team Hacker Academy', done: true },
  { name: 'Fortinet NSE', full: 'Fortinet Network Security Associate', done: true },
  { name: 'Windows Forensics', full: 'Windows Forensics with Belkasoft', done: true },
  { name: 'Advanced Forensics', full: 'Advanced Digital Forensics with Belkasoft', done: true },
  { name: 'Google Cybersecurity', full: 'Google Cybersecurity Professional Certificate', done: true },
  { name: 'CEH', full: 'Certified Ethical Hacker — In Progress', done: false },
]

export const SKILLS = [
  {
    title: 'Offensive Security',
    skills: ['Penetration Testing', 'Web App Security', 'Red Team Ops', 'Privilege Escalation', 'VAPT', 'Exploit Dev'],
  },
  {
    title: 'Defensive & Intelligence',
    skills: ['Threat Intelligence', 'Microsoft Sentinel', 'Defender for Cloud', 'KQL Hunting', 'SIEM', 'Incident Response'],
  },
  {
    title: 'DevSecOps',
    skills: ['Azure DevOps', 'GitHub Actions', 'SAST / DAST / SCA', 'IaC Security', 'Docker Security', 'Kubernetes'],
  },
  {
    title: 'Security Tooling',
    skills: ['Burp Suite', 'Metasploit', 'Nmap / Nessus', 'Wireshark', 'Darktrace', 'Semgrep / SonarQube'],
  },
  {
    title: 'Forensics & AI Security',
    skills: ['Digital Forensics', 'Reverse Engineering', 'Malware Analysis', 'OWASP LLM Top 10', 'AI Threat Modeling', 'Secure LLM Arch'],
  },
  {
    title: 'Languages & Platforms',
    skills: ['Python', 'Bash / PowerShell', 'Java', 'SQL', 'C', 'Active Directory'],
  },
]

export const EXPERIENCE = [
  {
    role: 'Security Engineer',
    company: 'InCorp Global',
    period: 'Aug 2025 — Present',
    location: 'Chennai, Tamil Nadu',
    active: true,
    highlights: [
      'Discovered PHP server malware — reverse engineered, sandboxed, and applied Zero Trust Architecture.',
      'Performed VAPT across all company projects; found SQLi, IDOR, RCE, XSS, DoS, Race Conditions & Buffer Overflows — gating production releases post-remediation.',
      'Built end-to-end CI/CD security pipelines on Azure DevOps & GitHub Actions (SAST, DAST, SCA, IaC, K8s/Docker) with Semgrep, SonarQube, Gitleaks, Kubesec.',
      'Ran threat intelligence via Microsoft Defender for Cloud + Sentinel with advanced KQL hunting queries.',
      'Operated Darktrace across Email, Cloud, Identity, and Attack Surface Management modules.',
      'Designed secure architecture for LLM products and conducted AI/LLM security testing (OWASP LLM Top 10).',
      'Collaborated with the UK (London) team on VAPT and led post-incident forensic investigations.',
    ],
  },
  {
    role: 'Security Auditor Intern',
    company: 'NTC Logistics India Pvt. Ltd.',
    period: 'Oct 2024 — Nov 2024',
    location: 'Chennai, Tamil Nadu',
    active: false,
    highlights: [
      'Reviewed firewall configurations and assessed effectiveness against unauthorized access.',
      'Evaluated server security posture — patch levels, hardening, and vulnerability scanning.',
      'Conducted web-app penetration testing and code review for OWASP Top 10 vulnerabilities.',
    ],
  },
  {
    role: 'Cybersecurity Intern',
    company: 'NIELIT',
    period: 'Jun 2024',
    location: 'Calicut',
    active: false,
    highlights: [
      'Executed Metasploit-based exploitation across targets in a controlled environment.',
      'Collaborated to track and trace regional attack patterns.',
      'Used Linux-based tooling for security visualization and analysis.',
    ],
  },
]

export const PROJECTS = [
  {
    title: 'Crucible',
    tag: 'AI Red Team',
    href: 'https://github.com/theloav/crucible',
    featured: true,
    desc: 'Agentic-first, open-source LLM purple-team platform. Drives multi-hop indirect prompt-injection → tool-misuse → exfiltration chains, scores action-harm, then auto-synthesizes guardrails, hardening patches & regression tests.',
    stack: ['Python', 'LLM Red Team', 'OWASP LLM Top 10', 'Agentic'],
    caseStudy: {
      problem:
        'LLM apps with tool access can be hijacked through indirect prompt injection — poisoned content in a retrieved doc or API response quietly redirects the agent into misusing its own tools and exfiltrating data. Most testing stops at single-turn jailbreak prompts and never exercises these multi-hop agentic chains.',
      build:
        'An agentic-first purple-team platform that autonomously drives multi-hop attack chains (indirect injection → tool-misuse → exfiltration), scores the real-world harm of each action rather than just the text output, and then closes the loop by auto-synthesizing guardrails, hardening patches, and regression tests from what it found.',
      impact:
        'Turns LLM security from a one-off manual jailbreak exercise into a repeatable, self-hardening pipeline — every discovered chain becomes a permanent regression test. Mapped to the OWASP LLM Top 10.',
    },
  },
  {
    title: 'Sandworm',
    tag: 'Malware RE',
    href: 'https://github.com/theloav/Sandworm',
    featured: true,
    desc: 'AI-powered malware reverse-engineering platform. Reconstructs a sample lifecycle from static, dynamic & memory evidence and emits defender-ready YARA + Sigma. Handles PE/ELF/webshells/macros — fully offline, 129 tests green.',
    stack: ['Python', 'Reverse Engineering', 'YARA', 'Sigma'],
    caseStudy: {
      problem:
        'Reverse-engineering a malware sample into deployable detections is slow, expert-heavy manual work — and sending samples to cloud services is a non-starter for sensitive investigations.',
      build:
        'A fully offline, AI-powered RE platform that fuses static, dynamic, and memory evidence to reconstruct a sample’s lifecycle, then emits defender-ready YARA and Sigma rules. Handles PE, ELF, webshells, and Office macros, backed by 129 passing tests.',
      impact:
        'Compresses hours of analyst effort into an automated pipeline that outputs detections you can ship straight to a SIEM/EDR — with zero data leaving the network.',
    },
  },
  {
    title: 'Purple Team Framework',
    tag: 'Detection Eng',
    href: 'https://github.com/theloav/purple-team-framework',
    desc: 'Full offensive→defensive loop: Caldera runs adversary sims (APT29/FIN7/Lazarus/Ransomware, 30+ techniques) → Elastic fires detections → ATT&CK coverage measured automatically, gaps flagged & exported to Navigator.',
    stack: ['Caldera', 'Elastic', 'MITRE ATT&CK'],
    caseStudy: {
      problem:
        'Blue teams rarely know which attacker techniques they can actually detect. Coverage is assumed, not measured, so real gaps only surface during an incident.',
      build:
        'A closed offensive→defensive loop: Caldera runs adversary emulations (APT29, FIN7, Lazarus, ransomware — 30+ ATT&CK techniques), Elastic fires the corresponding detections, and coverage is scored automatically with gaps flagged and exported to the ATT&CK Navigator.',
      impact:
        'Replaces guesswork with a measurable, repeatable coverage map — you can point at exactly which techniques are detected and which need new detection content.',
    },
  },
  {
    title: 'Threat-Intel Pipeline',
    tag: 'CTI',
    href: 'https://github.com/theloav/threat-intelligence-pipeline',
    desc: 'Full CTI lifecycle: OTX + Abuse.ch → MISP → enrich Sentinel/Elastic alerts → Slack IOC context, with VirusTotal & Shodan enrichment and MITRE ATT&CK attribution.',
    stack: ['Python', 'MISP', 'VirusTotal', 'Shodan'],
  },
  {
    title: 'Detection-as-Code',
    tag: 'SIEM',
    href: 'https://github.com/theloav/detection-as-a-code-pipeline',
    desc: 'Manage Microsoft Sentinel rules as code — write Sigma YAML, CI converts to KQL, deploys to production & tracks MITRE ATT&CK coverage on every merge.',
    stack: ['Sigma', 'KQL', 'Sentinel', 'CI/CD'],
  },
  {
    title: 'Semgrep Enterprise Rules',
    tag: 'AppSec / SAST',
    href: 'https://github.com/theloav/semgrep-enterprise-rules',
    desc: 'Production-grade Semgrep rules for real vuln classes (SSRF, JWT-none, deserialization, SQLi, command-injection) — each with TP/FP fixtures, a CI pipeline & an explanatory writeup.',
    stack: ['Semgrep', 'SAST', 'Detection Content'],
  },
  {
    title: 'LLM Security Tester',
    tag: 'AI Security',
    href: 'https://github.com/theloav/llm-security-framework',
    desc: 'Modular, pip-installable CLI that tests LLM apps across 5 attack categories / 25 curated cases — prompt injection, persona override, RAG poisoning — with scored results & CI integration.',
    stack: ['Python', 'CLI', 'CI-ready'],
  },
]

export const ACHIEVEMENTS = [
  {
    title: 'Hall of Fame #1 — Genxploit',
    badge: '#1 Ranked',
    tone: 'gold',
    desc: 'Responsible disclosure of two critical vulnerabilities — Sensitive Data Exposure (user-profile database leak) and Business Logic Errors — earning the #1 position on Genxploit’s Hall of Fame leaderboard.',
    tags: ['Bug Bounty', 'Responsible Disclosure', 'Data Exposure', 'Business Logic'],
  },
  {
    title: 'AI Security Research — Responsible Disclosures',
    badge: 'Disclosed',
    tone: 'term',
    desc: 'Discovered and disclosed prompt-injection & safety-bypass flaws in production AI platforms — Sakana AI (recognised & rewarded with official swag: hoodie, caps & notebook), Pokee.ai (persona-override → live infra exfiltration), and Kimi AI (Moonshot AI).',
    tags: ['Prompt Injection', 'LLM Red Team', 'AI Security', 'Responsible Disclosure'],
  },
  {
    title: 'Session Vulnerability Disclosure — TinyTax (UK)',
    badge: 'Disclosed',
    tone: 'cyan',
    desc: 'Identified and responsibly disclosed a session-management vulnerability in TinyTax (UK), helping harden their authentication flow.',
    tags: ['Session Security', 'Web AppSec', 'Responsible Disclosure', 'UK'],
  },
  {
    title: 'LDAP Vulnerability Discovery — Humphreys University, USA',
    badge: 'Appreciated',
    tone: 'cyan',
    desc: 'Identified and reported critical LDAP service vulnerabilities and account-security flaws at Humphreys University, USA. Received an official Letter of Appreciation for improving the university’s security posture.',
    tags: ['LDAP', 'Vulnerability Research', 'USA'],
  },
  {
    title: '2nd Place — Cryptic Quest (National Level)',
    badge: '2nd Place',
    tone: 'cyan',
    desc: 'Secured second place in a national-level cybersecurity competition at SRM Valliammai College — advanced problem-solving, ethical hacking, and cryptography under pressure.',
    tags: ['CTF', 'Cryptography', 'Ethical Hacking'],
  },
]

// Nav sections
export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Arsenal' },
  { id: 'experience', label: 'Missions' },
  { id: 'projects', label: 'Ops' },
  { id: 'achievements', label: 'Trophies' },
  { id: 'contact', label: 'Contact' },
]
