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
  view?: { [label: string]: string }; // [label, url]
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  industry: string;
  quote: string;
  rating: number;
  projectType: string;
  avatar?: string;
}

export const clients: Client[] = [
  {
    id: "1",
    name: "Angel Patil",
    logo: "💄",
    industry: "Fashion, Salons & Spas",
    description:
      "Leading fashion retailer offering personalized shopping experiences and appointment booking for in-store consultations.",
    services: ["Appointment Booking", "UX/UI Design", "Digital Marketing"],
  },
  {
    id: "2",
    name: "Bardoli Mother Dairy",
    logo: "🥛",
    industry: "Retail",
    description:
      "Experimental project for Mother Dairy branch: Developed a desktop app for in-store innovative display where customers could purchase items at fluctuating discounted prices for a 2-hour window.",
    services: [
      "Desktop App Development",
      "Dynamic Pricing",
      "Retail Innovation",
    ],
  },
  {
    id: "3",
    name: "Vishvanath Prasad",
    logo: "💈",
    industry: "Salons & Spas",
    description:
      "Chain of barber shops seeking to optimize resource management and customer experience. Developed an appointment booking app allowing customers to reserve slots for haircuts or other services with specific barbers, while also handling walk-ins efficiently.",
    services: [
      "Appointment Booking App",
      "Resource Optimization",
      "Walk-in Management",
    ],
  },
  {
    id: "4",
    name: "Amit Singh",
    logo: "🍻",
    industry: "Travel & Nightlife",
    description:
      "International client based in Budapest: Developed an online booking platform for pub crawl events, enabling seamless reservations and payment processing for tourists and locals.",
    services: [
      "Online Booking System",
      "Payment Integration",
      "Event Management",
    ],
  },
  {
    id: "5",
    name: "SNPITRC Bardoli",
    logo: "🎓",
    industry: "Education",
    description:
      "Developed a dedicated website for a one-day event at SNPITRC Bardoli College, providing event details, registration, and real-time updates for attendees.",
    services: [
      "Event Website Development",
      "Online Registration",
      "Live Updates",
    ],
  },
  {
    id: "6",
    name: "Shreya Sharma",
    logo: "🏠",
    industry: "Home Automation & IoT",
    description:
      "Implemented a secure home automation system using Home Assistant OS, integrating various IoT devices for remote management. Camera system was kept isolated for enhanced security. All lights and switches are controllable both online and manually, with click-to-toggle functionality.",
    services: [
      "Home Assistant OS Setup",
      "IoT Device Integration",
      "Remote Management",
      "Secure Camera System",
      "Smart Lighting Control",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "The Magic Mirror Salon",
    description:
      "A web and mobile platform for Angel Patil enabling customers to book personalized shopping appointments, manage schedules, and receive tailored recommendations.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML5", "CSS3"],
    category: "Appointment Booking",
    image:
      "/images/themagicmirrorsalon.png",
    demo: "https://themagicmirrorsalon.com",
  },
  {
    id: "2",
    title: "Bardoli Mother Dairy Desktop App",
    description:
      "A desktop application for Bardoli Mother Dairy, featuring real-time dynamic pricing and a visually engaging in-store display for time-limited discounts.",
    technologies: ["Electron", "React", "Node.js"],
    category: "Retail Innovation",
    image:
      "/images/bardolimotherdairy.png",
  },
  {
    id: "3",
    title: "Barber Shop Appointment & Walk-in Manager",
    description:
      "An appointment and walk-in management app for Vishvanath Prasad's barber shop chain, optimizing resource allocation and customer flow.",
    technologies: [
      "React",
      "Python",
      "TypeScript",
      "FastAPI",
      "AWS-Lambda",
      "GitHub Actions",
      "MongoDB",
      "Docker",
    ],
    category: "Salon Management",
    image:
      "/images/barbershopmanager.png",
  },
  {
    id: "4",
    title: "Budapest Pub Crawls",
    description:
      "Amit Singh's Budapest-based online booking system for pub crawl events, with integrated payment gateway and event management dashboard.",
    technologies: [
      "PHP",
      "Paypal",
      "PostgreSQL",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
    category: "Event Booking",
    image:
      "/images/budapestpubcrawls.png",
  },
  {
    id: "5",
    title: "College Event Website & Registration",
    description:
      "A dedicated event website for SNPITRC Bardoli, supporting event details, attendee registration, and live updates for a one-day college event.",
    technologies: [
      "AWS",
      "DynamoDB",
      "Redis",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "GitHub Actions",
      "Docker",
    ],
    category: "Event Website",
    image:
      "/images/technokrutisnpit.png",
  },
  {
    id: "6",
    title: "Home Automation & IoT Integration",
    description:
      "A secure home automation system for Shreya Sharma, integrating Home Assistant OS, IoT devices, and isolated camera systems for remote and manual control.",
    technologies: [
      "Home Assistant",
      "Raspberry Pi",
      "Python",
      "MQTT",
      "Zigbee",
    ],
    category: "Home Automation",
    image:
      "/images/homeautomation.jpg",
  },
  {
    id: "7",
    title: "Wireless Car IoT Control",
    description:
      "An IoT-enabled car project using Arduino and a WiFi module, allowing users to control the car remotely from anywhere in the world via a web-based remote interface.",
    technologies: [
      "Arduino",
      "ESP8266",
      "IoT",
      "WebSockets",
      "JavaScript",
      "HTML5",
      "CSS3",
    ],
    category: "IoT & Remote Control",
    image:
      "/images/wificar.webp",
  },
  {
    id: "8",
    title: "Personal Remote Control & Streaming Eco System",
    description:
      "A cross-platform eco system for personal use, enabling remote control of my laptop from anywhere, live streaming, and real-time chat. Built with Electron.js for desktop and React Native (Expo) for mobile. Utilizes WebRTC for secure streaming and live control, similar to AnyDesk. Currently offline for a major version upgrade focused on enhanced security and new features.",
    technologies:
      [
        "Electron.js",
        "React Native",
        "Expo",
        "WebRTC",
        "JavaScript",
        "TypeScript",
        "AWS Lambda",
        "Docker",
      ],
    category: "Remote Control & Streaming",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=600&fit=crop",
  },
  {
    id: "9",
    title: "CrimeSnap - Real-time Crime Reporting App",
    description:
      "An Android app built with React Native for the Odoo Hackathon, enabling three user roles: police admin, police officers, and citizens. Citizens can report crimes, upload images, and share their live location. Police officers receive instant alerts with user location and images, enabling rapid response. The app uses Firebase for authentication (including phone number verification), Firestore for storing reports, and Firebase Storage for uploaded images.",
    technologies: [
      "React Native",
      "Android",
      "Firebase Auth",
      "Firebase Firestore",
      "Firebase Storage",
      "Firebase Realtime Database",
      "Expo",
      "Google Maps API",
    ],
    category: "Crime Reporting & Public Safety",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=600&fit=crop",
    demo: "https://github.com/TriadByte/Oddo-2024",
  },
  {
    id: "10",
    title: "MagicUI – Open Source UI Components",
    description:
      "Contributed to MagicUI, a modern open-source UI component library. Implemented new components, improved accessibility, and enhanced documentation for better developer experience.",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Storybook",
      "Open Source",
    ],
    category: "UI Library",
    image:
      "/images/magicui.png",
  },
  {
    id: "11",
    title: "Portfolio Website",
    description:
      "My personal portfolio website showcasing my projects, skills, and experience. Built with React, TypeScript, and Tailwind CSS for a modern and responsive design.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GitHub Pages"],
    category: "Portfolio",
    image:
      "/images/portfolio.png",
    demo: "https://ankkiyy.com",
  },
  {
    id: "12",
    title: "Minecraft Mods for Streamers: Particles & AI Integration",
    description:
      "Developed custom Minecraft mods for streamers, enabling advanced particle effects management and seamless AI integration within the game. Leveraged Java and deep game development expertise, utilizing CraftBench for efficient mod creation and deployment. Enhanced gameplay interactivity and visual experience for both streamers and their audiences.",
    technologies:
      [
        "Java 17",
        "Minecraft Forge",
        "CraftBench",
        "Game Development",
        "AI Integration"
      ],
    category: "Game Modding",
    image:
      "/minecraft.png",
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Security Bug Discovery in Streaming Giant",
    client: "Spotify (Private Research)",
    challenge:
      "Unreported vulnerabilities affecting subscription timestamp and desktop app security, risking user trust and data integrity.",
    solution:
      "Identified epoch timestamp bug in mobile subscription system and script injection vulnerability in the desktop app. Responsibly disclosed findings to Spotify’s security team.",
    results: [
      "Patched epoch vulnerability preventing future billing anomalies",
      "Secured desktop app against XSS-style injection",
      "Enhanced Spotify's trust and user security",
      "Contributed to responsible disclosure ecosystem",
    ],
    duration: "2 hours",
    image:
      "https://wallpapers.com/images/hd/spotify-piano-and-headphones-psvd4nwl5u4foka8.jpg",
  },
  {
    id: "2",
    title: "Docker Misconfiguration Risk Discovery",
    client: "Confidential Client",
    challenge:
      "Exposed Docker socket (`/var/run/docker.sock`) detected in a live deployment, risking full container breakout and host control.",
    solution:
      "Conducted container security audit and identified critical misconfiguration. Demonstrated how attackers could gain root access through the exposed socket. Advised remediation steps to restrict access and isolate containers properly.",
    results: [
      "Mitigated a critical privilege escalation risk",
      "Educated dev teams on Docker security best practices",
      "Prevented full host compromise",
      "Initiated organization-wide container hardening effort",
    ],
    duration: "4 Days",
    image:
      "https://wallpapercave.com/dwp1x/wp8114669.jpg",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    clientName: "Angel Patil",
    clientTitle: "Store Owner",
    clientCompany: "The Magic Mirror Salon",
    industry: "Fashion & Beauty",
    quote: "The appointment booking platform revolutionized our customer experience. Bookings increased by 150% and customer satisfaction is at an all-time high. The personalized recommendations feature has been a game-changer for our business.",
    rating: 5,
    projectType: "Appointment Booking System",
    avatar: "💄"
  },
  {
    id: "2",
    clientName: "Ankit Naik",
    clientTitle: "Regional Manager",
    clientCompany: "Bardoli Mother Dairy",
    industry: "Retail",
    quote: "The dynamic pricing desktop application created an innovative shopping experience that our customers absolutely loved. Sales during the 2-hour discount windows increased by 300%. It was exactly the retail innovation we needed.",
    rating: 5,
    projectType: "Retail Innovation App",
    avatar: "🥛"
  },
  {
    id: "3",
    clientName: "Vishvanath Prasad",
    clientTitle: "Business Owner",
    clientCompany: "Prasad Barber Shops",
    industry: "Personal Care Services",
    quote: "The appointment and walk-in management system streamlined our operations perfectly. We can now handle 40% more customers daily while reducing wait times. The resource optimization features saved us thousands in operational costs.",
    rating: 5,
    projectType: "Resource Management System",
    avatar: "💈"
  },
  {
    id: "4",
    clientName: "Amit Singh",
    clientTitle: "Event Organizer",
    clientCompany: "Budapest Pub Crawls",
    industry: "Travel & Entertainment",
    quote: "The online booking platform with integrated payments transformed our business from manual bookings to automated efficiency. International customers can now book seamlessly, and our revenue increased by 200% in the first quarter.",
    rating: 5,
    projectType: "Event Booking Platform",
    avatar: "🍻"
  },
  {
    id: "5",
    clientName: "Mr. Vishal",
    clientTitle: "Event Coordinator",
    clientCompany: "SNPITRC Bardoli",
    industry: "Education",
    quote: "The event website and registration system made our college event management effortless. Real-time updates kept everyone informed, and the registration process was smooth for over 500 attendees. Professional execution from start to finish.",
    rating: 5,
    projectType: "Event Management Website",
    avatar: "🎓"
  },
  {
    id: "6",
    clientName: "Shreya Sharma",
    clientTitle: "Homeowner",
    clientCompany: "Smart Home Enthusiast",
    industry: "Home Automation",
    quote: "The home automation system exceeded all expectations. I can control everything remotely while maintaining perfect security. The isolated camera system gives me peace of mind, and the manual override options are brilliant for daily use.",
    rating: 5,
    projectType: "Smart Home Integration",
    avatar: "🏠"
  },
];

export interface About {
  intro: string;
  details: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  company: string[];
  date: string;
  image: string;
  url?: string;
}

export const about: About = {
  intro: "Ankit Prajapati – Cyber Security Expert and full-stack developer.",
  details:
    "With a background in penetration testing and secure application development, I help organizations defend their critical systems. My work spans web technologies, cloud security and threat hunting, delivering robust solutions for clients worldwide. I'm dedicated to improving digital resilience and regularly contribute to open-source security projects."
};

export const certificates: Certificate[] = [
  {
    id: "1",
    title: "PHP For Beginners",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Ankit_Prajapati-PHP-For-Beginners.jpg",
    url: "https://ankkiyy.com/certificates/Ankit_Prajapati-PHP-For-Beginners.pdf"
  },
  {
    id: "2",
    title: "Python for Non-Programmers",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Ankit_Prajapati-Python-For-Non-Programmers.jpg",
    url: "https://ankkiyy.com/certificates/Ankit_Prajapati-Python-For-Non-Programmers.pdf"
  },
  {
    id: "3",
    title: "Python Fundamentals",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Certificate---Python-Fundamentals-2.jpg",
    url: "https://ankkiyy.com/certificates/Certificate---Python-Fundamentals-2.pdf"
  },
  {
    id: "4",
    title: "Microsoft Security Essentials Professional Certificate",
    issuer: "Microsoft and LinkedIn",
    company: ["Microsoft", "LinkedIn"],
    date: "July 2025",
    image: "/certificates/CertificateOfCompletion_Microsoft-Security-Essentials-Professional-Certificate-by-Microsoft-and-LinkedIn-1.jpg",
    url: "https://ankkiyy.com/certificates/CertificateOfCompletion_Microsoft-Security-Essentials-Professional-Certificate-by-Microsoft-and-LinkedIn-1.pdf"
  },
  {
    id: "5",
    title: "Introduction to AWS Solutions",
    issuer: "W3Schools",
    company: ["W3Schools"],
    date: "September 2023",
    image: "/certificates/certificate_of_completion_introduction_to_aws_solutions-1.jpg",
    url: "https://verify.w3schools.com/1O3JTLRQ3T"
  },
  {
    id: "6",
    title: "Google Ads - Measurement Certification",
    issuer: "Google",
    company: ["Google"],
    date: "February 2024",
    image: "/certificates/Google-Ads---Measurement-Certification-1.jpg",
    url: "https://ankkiyy.com/certificates/Google-Ads---Measurement-Certification-1.pdf"
  },
  {
    id: "7",
    title: "Advanced Cyber Security - Threats and Governance",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Advanced-Cyber-Security-Threats-and-Governance.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Advanced-Cyber-Security-Threats-and-Governance.pdf"
  },
  {
    id: "8",
    title: "CSS Tutorial",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-CSS-Tutorial.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-CSS-Tutorial.pdf"
  },
  {
    id: "9",
    title: "Cyber Security Threats",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Cyber-Security-Threats.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Cyber-Security-Threats.pdf"
  },
  {
    id: "10",
    title: "Encryption Basics",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Encryption-Basics.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Encryption-Basics.pdf"
  },
  {
    id: "11",
    title: "Ethical Hacking",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Ethical-Hacking.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Ethical-Hacking.pdf"
  },
  {
    id: "12",
    title: "Front End Development - HTML",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Front-End-Dev-HTML.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Front-End-Dev-HTML.pdf"
  },
  {
    id: "13",
    title: "Introduction to Information Security",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Information-Security.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Information-Security.pdf"
  },
  {
    id: "14",
    title: "Introduction to Ethical Hacking",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Intro-Ethical-Hacking.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Intro-Ethical-Hacking.pdf"
  },
  {
    id: "15",
    title: "Introduction to Cyber Security",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Introduction-To-Cyber-Security.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Introduction-To-Cyber-Security.pdf"
  },
  {
    id: "16",
    title: "Introduction to Firewall",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Introduction-to-Firewall.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Introduction-to-Firewall.pdf"
  },
  {
    id: "17",
    title: "Python Fundamentals for Beginners",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Python-fundamentals.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Python-fundamentals.pdf"
  },
  {
    id: "18",
    title: "Types of Cyber Security",
    issuer: "Great Learning Academy",
    company: ["Great Learning"],
    date: "July 2023",
    image: "/certificates/Prajapati_Ankit_Kanaiyalal-Types-Of-Cyber-Security.jpg",
    url: "https://ankkiyy.com/certificates/Prajapati_Ankit_Kanaiyalal-Types-Of-Cyber-Security.pdf"
  }
];