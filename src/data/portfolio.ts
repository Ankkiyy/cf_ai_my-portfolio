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
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop",
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
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&h=600&fit=crop",
  },
  {
    id: "8",
    title: "Personal Remote Control & Streaming Eco System",
    description:
      "A cross-platform eco system for personal use, enabling remote control of my laptop from anywhere, live streaming, and real-time chat. Built with Electron.js for desktop and React Native (Expo) for mobile. Utilizes WebRTC for secure streaming and live control, similar to AnyDesk. Currently offline for a major version upgrade focused on enhanced security and new features.",
    technologies: [
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
    demo: "https://github.com/yourusername/crimesnap",
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
      "https://avatars.githubusercontent.com/u/166878038?s=200&v=4",
  },
  {
    id: "11",
    title: "Portfolio Website",
    description:
      "My personal portfolio website showcasing my projects, skills, and experience. Built with React, TypeScript, and Tailwind CSS for a modern and responsive design.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "GitHub Pages"],
    category: "Portfolio",
    image:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=600&fit=crop",
    demo: "https://ankkiyy.com",
  },
  {
    id: "12",
    title: "Minecraft Mods for Streamers: Particles & AI Integration",
    description:
      "Developed custom Minecraft mods for streamers, enabling advanced particle effects management and seamless AI integration within the game. Leveraged Java and deep game development expertise, utilizing CraftBench for efficient mod creation and deployment. Enhanced gameplay interactivity and visual experience for both streamers and their audiences.",
    technologies: [
      "Java 17",
      "Minecraft Forge",
      "CraftBench",
      "Game Development",
      "AI Integration"
    ],
    category: "Game Modding",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop"
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
    duration: "1 week",
    image:
      "https://images.unsplash.com/photo-1581093588401-4f8d4ce7d98b?w=800&h=600&fit=crop",
  },
];
