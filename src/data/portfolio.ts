
export interface Client {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  services: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  image: string;
  github?: string;
  demo?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  challenge: string;
  solution: string;
  results: string[];
  duration: string;
  image: string;
}

export const clients: Client[] = [
  {
    id: "1",
    name: "SecureBank Corp",
    logo: "🏦",
    industry: "Financial Services",
    description: "Leading financial institution requiring comprehensive security audit and penetration testing.",
    services: ["Penetration Testing", "Security Audit", "Compliance Assessment"]
  },
  {
    id: "2",
    name: "TechFlow Solutions",
    logo: "⚡",
    industry: "Technology",
    description: "Cloud-first company needing robust security architecture and threat detection systems.",
    services: ["Cloud Security", "Threat Detection", "Security Architecture"]
  },
  {
    id: "3",
    name: "MediSecure",
    logo: "🏥",
    industry: "Healthcare",
    description: "Healthcare provider requiring HIPAA compliance and data protection solutions.",
    services: ["HIPAA Compliance", "Data Protection", "Incident Response"]
  },
  {
    id: "4",
    name: "CyberDefense Inc",
    logo: "🛡️",
    industry: "Cybersecurity",
    description: "Security consulting firm partnering for advanced threat hunting and forensics.",
    services: ["Threat Hunting", "Digital Forensics", "Malware Analysis"]
  },
  {
    id: "5",
    name: "GlobalTrade Ltd",
    logo: "🌐",
    industry: "E-commerce",
    description: "International e-commerce platform requiring secure payment processing and fraud prevention.",
    services: ["Payment Security", "Fraud Prevention", "Web Application Security"]
  }
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Advanced Threat Detection System",
    description: "ML-powered threat detection system using behavioral analysis and anomaly detection to identify zero-day attacks.",
    technologies: ["Python", "TensorFlow", "Elasticsearch", "Kibana", "Docker"],
    category: "Threat Detection",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Secure Communication Platform",
    description: "End-to-end encrypted messaging platform with perfect forward secrecy and zero-knowledge architecture.",
    technologies: ["React", "Node.js", "WebRTC", "Signal Protocol", "PostgreSQL"],
    category: "Secure Communications",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Vulnerability Assessment Tool",
    description: "Automated vulnerability scanner with custom exploit modules and comprehensive reporting dashboard.",
    technologies: ["Python", "Nmap", "Metasploit", "Django", "Redis"],
    category: "Vulnerability Assessment",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Incident Response Platform",
    description: "Real-time incident response and forensics platform with automated threat containment capabilities.",
    technologies: ["Go", "MongoDB", "YARA", "Volatility", "Kubernetes"],
    category: "Incident Response",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "Blockchain Security Auditor",
    description: "Smart contract security auditing tool with static analysis and formal verification capabilities.",
    technologies: ["Solidity", "Web3.js", "Mythril", "Slither", "Truffle"],
    category: "Blockchain Security",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop"
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Major Banking Breach Prevention",
    client: "SecureBank Corp",
    challenge: "Potential APT attack targeting customer financial data through sophisticated social engineering and zero-day exploits.",
    solution: "Implemented comprehensive threat hunting program, deployed advanced endpoint detection, and established 24/7 SOC monitoring with custom threat intelligence feeds.",
    results: [
      "Prevented potential $50M+ data breach",
      "Reduced incident response time by 75%",
      "Achieved SOC 2 Type II compliance",
      "Zero successful attacks in 18 months"
    ],
    duration: "6 months",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "Cloud Infrastructure Hardening",
    client: "TechFlow Solutions",
    challenge: "Rapid cloud migration left security gaps in multi-cloud architecture with inadequate access controls and monitoring.",
    solution: "Designed zero-trust architecture, implemented infrastructure as code security, and established continuous compliance monitoring across AWS, Azure, and GCP.",
    results: [
      "99.9% reduction in security misconfigurations",
      "Achieved ISO 27001 certification",
      "Improved security posture score to 98%",
      "Reduced security overhead by 60%"
    ],
    duration: "4 months",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    title: "Healthcare Data Protection",
    client: "MediSecure",
    challenge: "HIPAA compliance gaps and legacy systems vulnerabilities exposing sensitive patient data to potential breaches.",
    solution: "Implemented comprehensive data loss prevention, encrypted all data at rest and in transit, and established robust access controls with multi-factor authentication.",
    results: [
      "Achieved full HIPAA compliance",
      "Reduced data exposure risk by 95%",
      "Improved audit readiness",
      "Zero compliance violations"
    ],
    duration: "8 months",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    title: "Advanced Persistent Threat Hunt",
    client: "CyberDefense Inc",
    challenge: "Suspected nation-state actor infiltration with sophisticated techniques evading traditional security controls.",
    solution: "Conducted comprehensive threat hunting using advanced behavioral analysis, memory forensics, and custom IOC development to identify and eliminate the threat.",
    results: [
      "Identified and removed APT group",
      "Prevented intellectual property theft",
      "Improved threat detection capabilities",
      "Enhanced incident response procedures"
    ],
    duration: "3 months",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    title: "E-commerce Security Transformation",
    client: "GlobalTrade Ltd",
    challenge: "Growing fraud attacks and payment security vulnerabilities affecting customer trust and revenue.",
    solution: "Implemented AI-powered fraud detection, PCI DSS compliance program, and comprehensive web application security testing framework.",
    results: [
      "Reduced fraud by 85%",
      "Achieved PCI DSS Level 1 compliance",
      "Improved customer trust metrics",
      "Increased secure transaction volume by 200%"
    ],
    duration: "5 months",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop"
  }
];
