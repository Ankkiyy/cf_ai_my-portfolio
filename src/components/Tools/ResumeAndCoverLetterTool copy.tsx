import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Play,
  Copy,
  Check,
  Key,
  FileText,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Code,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import ReactMarkdown from "react-markdown";
import { TOOL1_ROUTE } from "./Constants";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  setFullName,
  setEmail,
  setPhone,
  setLocation,
  setLinkedinUrl,
  setGithubUrl,
  setApiToken,
  clearApiToken,
  resetAll,
  resetPersonalInfo,
} from "@reducers/resumeSlice";

const ResumeAndCoverLetterTool = () => {
  const dispatch = useAppDispatch();
  const { personalInfo, apiToken } = useAppSelector((state) => state.resume);

  // Initialize state from Redux store
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  // Local state for form inputs before saving
  const [localPersonalInfo, setLocalPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  // Check if API key exists and saved personal info is complete
  useEffect(() => {
    const requiredFieldsFilled =
      personalInfo.fullName.trim() &&
      personalInfo.email.trim() &&
      personalInfo.phone.trim() &&
      personalInfo.location.trim() &&
      personalInfo.linkedinUrl.trim();

    if (apiToken && apiToken.trim() && requiredFieldsFilled) {
      setIsApiKeySet(true);
    } else {
      setIsApiKeySet(false);
    }
  }, [personalInfo, apiToken]);

  // Load saved data into local state when component mounts
  useEffect(() => {
    setLocalPersonalInfo(personalInfo);
  }, [personalInfo]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState("");
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState("");
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [resumeViewMode, setResumeViewMode] = useState<"markdown" | "raw">(
    "markdown"
  );
  const [coverLetterViewMode, setCoverLetterViewMode] = useState<
    "markdown" | "raw"
  >("markdown");

  // Form data
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");

  // Add state for API key visibility
  const [showApiKey, setShowApiKey] = useState(false);

  // Function to mask API key for display
  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "•".repeat(key.length);
    return (
      key.substring(0, 4) +
      "•".repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
  };

  const handleApiKeySubmit = (apiKey: string) => {
    if (apiKey.trim()) {
      dispatch(setApiToken(apiKey));
      setIsApiKeySet(true);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription || !skills || !experience) {
      alert("Please fill in all fields before generating");
      return;
    }

    setIsGenerating(true);
    setGeneratedResume("");
    setGeneratedCoverLetter("");

    try {
      // Initialize the ChatGoogleGenerativeAI model
      const llm = new ChatGoogleGenerativeAI({
        apiKey: apiToken!,
        model: "gemini-2.5-flash-lite",
        temperature: 0.7,
        maxRetries: 3,
      });

      // Create output parser
      // ✅ Define schema with zod
      interface ResumeExperience {
        title: string;
        company: string;
        from: string;
        to: string;
        description: string[];
      }

      const outputParser = new JsonOutputParser<ResumeExperience[]>();

      const inputVariables = [
        "experience",
        "jobSkills",
        "jobDescription",
        "format_instructions",
      ];

      const format_instructions = `Respond with a valid JSON object, containing an array of experience objects, each with the following fields: 'title', 'company', 'from', 'to', and 'description' where 'description' is an array of strings.`;

      const resume_prompt_template = new PromptTemplate({
        inputVariables: inputVariables,
        template: `You are a professional resume generator agent. Your task is to create an ATS-friendly resume without any conversational elements or introductory text.
    Note: 
    Please ensure that the descriptions are concise and follow the STAR (Situation, Task, Action, Result) format. Ex: X was slow and Y needed to speed up so I implemented Z. and got X% faster.
    Also each point should be a Measurable achievement. and use Skills Keywords that are needed in the Job Description. if u cant find a company name for something use [Company Name] as a placeholder.
    Input Data:
    Experience: {experience}
    Job Requirements & Skills to Highlight: {jobSkills}
    Job Description/Target Role: {jobDescription}

    Format Instructions: {format_instructions}
`,
      });

      const partialedPrompt = await resume_prompt_template.partial({
        format_instructions: format_instructions,
      });

      const resume_chain = partialedPrompt.pipe(llm).pipe(outputParser);

      const output = await resume_chain.invoke({
        experience: experience,
        jobSkills: skills,
        jobDescription: jobDescription,
      });

      console.log("Generated Resume:", output);
      setGeneratedResume(JSON.stringify(output, null, 2));
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedResume(
        "Error: Failed to generate resume. Please check your API key and try again."
      );
      setGeneratedCoverLetter(
        "Error: Failed to generate cover letter. Please check your API key and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResume = () => {
    const contentToCopy =
      resumeViewMode === "markdown" ? generatedResume : generatedResume;
    navigator.clipboard.writeText(contentToCopy);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleCopyCoverLetter = () => {
    const contentToCopy =
      coverLetterViewMode === "markdown"
        ? generatedCoverLetter
        : generatedCoverLetter;
    navigator.clipboard.writeText(contentToCopy);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const openPrintPage = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume & Cover Letter</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.4;
              color: #333;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.8in;
              background: white;
              font-size: 11pt;
            }
            h1 { 
              font-size: 18pt; 
              margin-bottom: 0.3em; 
              color: #2c3e50; 
              font-weight: bold;
            }
            h2 { 
              font-size: 14pt; 
              margin-top: 1.2em; 
              margin-bottom: 0.4em; 
              color: #34495e; 
              border-bottom: 1px solid #3498db; 
              padding-bottom: 0.1em; 
            }
            h3 { 
              font-size: 12pt; 
              margin-top: 1em; 
              margin-bottom: 0.3em; 
              color: #2c3e50; 
            }
            ul { 
              margin: 0.3em 0; 
              padding-left: 1em; 
            }
            li { 
              margin-bottom: 0.2em; 
              font-size: 11pt;
            }
            strong { 
              color: #2c3e50; 
              font-weight: 600;
            }
            p {
              margin: 0.4em 0;
              font-size: 11pt;
            }
            .page-break { 
              page-break-before: always; 
              margin-top: 1.5in; 
            }
            .contact-info { 
              margin-bottom: 0.8em; 
              font-size: 10pt; 
            }
            @media print {
              body { 
                margin: 0; 
                padding: 0.5in; 
                font-size: 10pt;
              }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="resume-section">
            ${
              generatedResume
                ? generatedResume
                    .replace(/\n/g, "<br>")
                    .replace(/#{1}\s+/g, "<h1>")
                    .replace(/<br><h1>/g, "<h1>")
                    .replace(/#{2}\s+/g, "</h1><h2>")
                    .replace(/<br><h2>/g, "<h2>")
                    .replace(/#{3}\s+/g, "</h2><h3>")
                    .replace(/<br><h3>/g, "<h3>")
                    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                    .replace(/- /g, "<li>")
                    .replace(/<br><li>/g, "<li>")
                    .replace(/(<li>.*?)(<br>)/g, "$1</li>$2")
                : ""
            }
          </div>
          <div class="page-break"></div>
          <div class="cover-letter-section">
            ${
              generatedCoverLetter
                ? generatedCoverLetter
                    .replace(/\n/g, "<br>")
                    .replace(/#{1}\s+/g, "<h1>")
                    .replace(/<br><h1>/g, "<h1>")
                    .replace(/#{2}\s+/g, "</h1><h2>")
                    .replace(/<br><h2>/g, "<h2>")
                    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                : ""
            }
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleReset = () => {
    // Reset only personal info and form data, keep API key
    dispatch(resetPersonalInfo());

    // Clear local state
    setGeneratedResume("");
    setGeneratedCoverLetter("");
    setJobDescription("");
    setSkills("");
    setExperience("");

    // Force isApiKeySet to false so user sees the form again
    setIsApiKeySet(false);
  };

  const handleSavePersonalInfo = () => {
    // Save all local personal info to Redux
    dispatch(setFullName(localPersonalInfo.fullName));
    dispatch(setEmail(localPersonalInfo.email));
    dispatch(setPhone(localPersonalInfo.phone));
    dispatch(setLocation(localPersonalInfo.location));
    dispatch(setLinkedinUrl(localPersonalInfo.linkedinUrl));
    dispatch(setGithubUrl(localPersonalInfo.githubUrl));
  };

  if (!isApiKeySet) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tools</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
              {TOOL1_ROUTE.icon}
            </div>
            <h1 className="text-3xl font-bold">{TOOL1_ROUTE.name}</h1>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
            <p className="text-muted-foreground">
              Fill in your personal details and API key to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={localPersonalInfo.fullName}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="Enter your full name..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={localPersonalInfo.email}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="Enter your email..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={localPersonalInfo.phone}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="Enter your phone number..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={localPersonalInfo.location}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="Enter your location..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={localPersonalInfo.linkedinUrl}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    linkedinUrl: e.target.value,
                  }))
                }
                placeholder="Enter your LinkedIn URL..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub URL (Optional)
              </label>
              <input
                type="url"
                name="githubUrl"
                value={localPersonalInfo.githubUrl}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    githubUrl: e.target.value,
                  }))
                }
                placeholder="Enter your GitHub URL..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Save Personal Info Button */}
          <div className="mb-8">
            <button
              onClick={handleSavePersonalInfo}
              className="w-full px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300 font-medium"
            >
              Save Personal Information
            </button>
          </div>

          {/* API Key Section */}
          <div className="border-t border-border pt-8">
            <div className="flex items-center gap-2 mb-4">
              <Key className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Google AI API Key</h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApiKeySubmit(apiToken || "");
              }}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  type="text"
                  name="apiToken"
                  value={
                    showApiKey ? apiToken || "" : maskApiKey(apiToken || "")
                  }
                  onChange={(e) => {
                    // Always update the API key value
                    if (showApiKey) {
                      dispatch(setApiToken(e.target.value));
                    }
                  }}
                  onFocus={() => setShowApiKey(true)}
                  onBlur={() => setShowApiKey(false)}
                  placeholder="Enter your Google AI API key..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 font-mono text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showApiKey ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={!apiToken?.trim()}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Continue to Resume Generator
              </button>
            </form>

            <div className="text-xs text-muted-foreground text-center mt-4">
              <p>
                Your information is stored locally and encrypted in browser
                storage.
              </p>
              <p>
                Get your API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 border border-border/50 rounded-lg hover:border-primary/30 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tools</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
              {TOOL1_ROUTE.icon}
            </div>
            <h1 className="text-3xl font-bold">{TOOL1_ROUTE.name}</h1>
            <div className="text-sm text-muted-foreground">
              Welcome, {personalInfo.fullName || "User"}!
            </div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset & Logout
        </button>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Work Experience */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">
                Work Experience & Background
              </h3>
            </div>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Describe your work experience, education, projects, achievements, etc..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Job Requirements */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Job Requirements & Skills</h3>
            </div>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List the skills, technologies, qualifications, and requirements mentioned in the job posting that you want to highlight..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Job Description */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Job Description</h3>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete job description or describe the role you're applying for in detail..."
              className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={
                isGenerating || !jobDescription || !skills || !experience
              }
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Play className="h-4 w-4" />
              {isGenerating ? "Generating Documents..." : "Generate Documents"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-8">
          {/* Resume Output */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Generated Resume</h3>
                {generatedResume && generatedCoverLetter && (
                  <button
                    onClick={openPrintPage}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300 font-medium backdrop-blur-sm text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Print/PDF Both Documents
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setResumeViewMode("markdown")}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      resumeViewMode === "markdown"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => setResumeViewMode("raw")}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      resumeViewMode === "raw"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code className="h-3 w-3" />
                    Raw
                  </button>
                </div>

                {generatedResume && (
                  <button
                    onClick={handleCopyResume}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300"
                  >
                    {copiedResume ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedResume ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-muted-foreground">
                    Generating resume...
                  </span>
                </div>
              ) : generatedResume ? (
                resumeViewMode === "markdown" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{generatedResume}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {generatedResume}
                  </pre>
                )
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Fill in the information and click generate to create your
                    resume
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter Output */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Generated Cover Letter</h3>
                {generatedResume && generatedCoverLetter && (
                  <button
                    onClick={openPrintPage}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300 font-medium backdrop-blur-sm text-sm"
                  >
                    <Download className="h-4 w-4" />
                    Print/PDF Both Documents
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setCoverLetterViewMode("markdown")}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      coverLetterViewMode === "markdown"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => setCoverLetterViewMode("raw")}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      coverLetterViewMode === "raw"
                        ? "bg-background text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Code className="h-3 w-3" />
                    Raw
                  </button>
                </div>

                {generatedCoverLetter && (
                  <button
                    onClick={handleCopyCoverLetter}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300"
                  >
                    {copiedCoverLetter ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedCoverLetter ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-muted-foreground">
                    Generating cover letter...
                  </span>
                </div>
              ) : generatedCoverLetter ? (
                coverLetterViewMode === "markdown" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{generatedCoverLetter}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {generatedCoverLetter}
                  </pre>
                )
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Fill in the information and click generate to create your
                    cover letter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Markdown formatted output</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Live preview and raw view toggle</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Simultaneous generation of both documents</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>AI-powered content generation</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>ATS-friendly formatting</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Job-specific customization</span>
            </li>
          </ul>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4">Privacy & Security</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>API key stored locally only</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Data sent to Google AI for processing</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>No personal data stored on our servers</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Your privacy protected</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeAndCoverLetterTool;
