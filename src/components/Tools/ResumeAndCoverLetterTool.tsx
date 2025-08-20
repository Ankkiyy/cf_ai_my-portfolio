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
  Plus,
  Trash2,
  GraduationCap,
  Building,
  Calendar,
  MapPin,
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
  setPortfolioUrl,
  setApiToken,
  clearApiToken,
  resetAll,
  resetPersonalInfo,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addEducation,
  updateEducation,
  removeEducation,
  type WorkExperience,
  type Education,
} from "@reducers/resumeSlice";

const ResumeAndCoverLetterTool = () => {
  const dispatch = useAppDispatch();
  const { personalInfo, workExperience, education, apiToken } = useAppSelector((state) => state.resume);

  // Initialize state from Redux store
  const [isApiKeySet, setIsApiKeySet] = useState(false);

  // Local state for form inputs before saving - ensure all fields are always defined
  const [localPersonalInfo, setLocalPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  // Check if API key exists and saved personal info is complete
  useEffect(() => {
    const requiredFieldsFilled =
      (personalInfo?.fullName || "").trim() &&
      (personalInfo?.email || "").trim() &&
      (personalInfo?.phone || "").trim() &&
      (personalInfo?.location || "").trim() &&
      (personalInfo?.linkedinUrl || "").trim();

    if (apiToken && apiToken.trim() && requiredFieldsFilled) {
      setIsApiKeySet(true);
    } else {
      setIsApiKeySet(false);
    }
  }, [personalInfo, apiToken]);

  // Load saved data into local state when component mounts - with proper fallbacks
  useEffect(() => {
    if (personalInfo) {
      setLocalPersonalInfo({
        fullName: personalInfo.fullName || "",
        email: personalInfo.email || "",
        phone: personalInfo.phone || "",
        location: personalInfo.location || "",
        linkedinUrl: personalInfo.linkedinUrl || "",
        githubUrl: personalInfo.githubUrl || "",
        portfolioUrl: personalInfo.portfolioUrl || "",
      });
    }
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

  // Form data - simplified to just job description and skills
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");

  // Work Experience handlers
  const handleAddWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    dispatch(addWorkExperience(newExperience));
  };

  const handleUpdateWorkExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    const experience = (workExperience || []).find(exp => exp.id === id);
    if (experience) {
      const updatedExperience = { ...experience, [field]: value };
      dispatch(updateWorkExperience(updatedExperience));
    }
  };

  const handleRemoveWorkExperience = (id: string) => {
    dispatch(removeWorkExperience(id));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      gpa: "",
      description: "",
    };
    dispatch(addEducation(newEducation));
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    const edu = (education || []).find(e => e.id === id);
    if (edu) {
      const updatedEducation = { ...edu, [field]: value };
      dispatch(updateEducation(updatedEducation));
    }
  };

  const handleRemoveEducation = (id: string) => {
    dispatch(removeEducation(id));
  };

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
    if (!jobDescription || !skills) {
      alert("Please fill in job description and skills before generating");
      return;
    }

    if (!workExperience || workExperience.length === 0) {
      alert("Please add at least one work experience entry");
      return;
    }

    setIsGenerating(true);
    setGeneratedResume("");
    setGeneratedCoverLetter("");

    try {
      // Use the stored work experience and education data along with job description and skills
      const experienceData = (workExperience || []).map(exp => ({
        title: exp.title,
        company: exp.company,
        from: exp.startDate,
        to: exp.current ? "Present" : exp.endDate,
        description: exp.description.split('\n').filter(line => line.trim()),
      }));

      const educationData = (education || []).map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        from: edu.startDate,
        to: edu.current ? "Present" : edu.endDate,
        gpa: edu.gpa,
        description: edu.description,
      }));

      // Initialize the ChatGoogleGenerativeAI model
      const llm = new ChatGoogleGenerativeAI({
        apiKey: apiToken!,
        model: "gemini-2.5-flash-lite",
        temperature: 0.7,
        maxRetries: 3,
      });

      // Create final resume directly from stored data
      interface CompleteResume {
        personalInfo: {
          name: string;
          email: string;
          phone: string;
          location: string;
          linkedin: string;
          github?: string;
          portfolio?: string;
        };
        professionalSummary: string;
        experience: typeof experienceData;
        education: typeof educationData;
        skills: string[];
      }

      const finalResumeOutputParser = new JsonOutputParser<CompleteResume>();

      const finalResumeInputVariables = [
        "personalInfo",
        "experienceData",
        "educationData",
        "jobDescription",
        "skills",
        "format_instructions",
      ];

      const finalResumeFormatInstructions = `Respond with a complete resume JSON object with sections: personalInfo, professionalSummary, experience, education, and skills. Tailor the professional summary and optimize experience descriptions based on the job description and required skills.`;

      const final_resume_template = new PromptTemplate({
        inputVariables: finalResumeInputVariables,
        template: `Create a complete, ATS-friendly resume by optimizing the provided experience and education data for the target job.

Personal Information: {personalInfo}
Experience Data: {experienceData}
Education Data: {educationData}
Job Description: {jobDescription}
Skills to Highlight: {skills}

Instructions:
1. Create a compelling professional summary based on the experience and target job
2. Optimize experience descriptions to include relevant keywords from the job description
3. Organize skills by relevance to the job requirements
4. Ensure ATS-friendly formatting
5. Use STAR (Situation, Task, Action, Result) method for experience descriptions and rewrite them to more suit the job description. Ex: X was slow and Y needed optimization, so I implemented Z, resulting in improved XYZ.
6. Use Metrics to quantify achievements and enhance impact in descriptions with keywords of metrics (e.g., "Increased sales by 20%").

Format Instructions: {format_instructions}
`,
      });

      const partialedFinalPrompt = await final_resume_template.partial({
        format_instructions: finalResumeFormatInstructions,
      });

      const final_resume_chain = partialedFinalPrompt.pipe(llm).pipe(finalResumeOutputParser);

      // Generate final resume
      const finalResumeOutput = await final_resume_chain.invoke({
        personalInfo: JSON.stringify(personalInfo),
        experienceData: JSON.stringify(experienceData),
        educationData: JSON.stringify(educationData),
        jobDescription: jobDescription,
        skills: skills,
      });

      console.log("Final Resume:", finalResumeOutput);
      setGeneratedResume(JSON.stringify(finalResumeOutput, null, 2));

    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedResume(
        "Error: Failed to generate resume. Please check your API key and try again."
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
    // Reset the entire Redux state
    dispatch(resetAll());
    
    // Also clear the persisted storage directly
    localStorage.removeItem('persist:root');
    
    // Force local state to false
    setIsApiKeySet(false);
    
    // Clear other local states
    setGeneratedResume("");
    setGeneratedCoverLetter("");
    setJobDescription("");
    setSkills("");
    
    // Force a page reload to ensure clean state (optional)
    // window.location.reload();
  };

  const handleSavePersonalInfo = () => {
    // Save all local personal info to Redux
    dispatch(setFullName(localPersonalInfo.fullName));
    dispatch(setEmail(localPersonalInfo.email));
    dispatch(setPhone(localPersonalInfo.phone));
    dispatch(setLocation(localPersonalInfo.location));
    dispatch(setLinkedinUrl(localPersonalInfo.linkedinUrl));
    dispatch(setGithubUrl(localPersonalInfo.githubUrl));
    dispatch(setPortfolioUrl(localPersonalInfo.portfolioUrl));
  };

  // If API key is not set, show the setup view
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
            <h2 className="text-2xl font-bold mb-2">Setup Your Profile</h2>
            <p className="text-muted-foreground">
              Fill in your details once, then generate tailored resumes for different jobs
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
                value={localPersonalInfo.fullName || ""}
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
                value={localPersonalInfo.email || ""}
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
                value={localPersonalInfo.phone || ""}
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
                value={localPersonalInfo.location || ""}
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
                value={localPersonalInfo.linkedinUrl || ""}
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
                value={localPersonalInfo.githubUrl || ""}
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                name="portfolioUrl"
                value={localPersonalInfo.portfolioUrl || ""}
                onChange={(e) =>
                  setLocalPersonalInfo((prev) => ({
                    ...prev,
                    portfolioUrl: e.target.value,
                  }))
                }
                placeholder="Enter your portfolio URL..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="border-t border-border pt-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Work Experience</h3>
              </div>
              <button
                onClick={handleAddWorkExperience}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {(workExperience || []).map((exp) => (
                <div key={exp.id} className="bg-background/50 border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Experience #{(workExperience || []).indexOf(exp) + 1}</h4>
                    <button
                      onClick={() => handleRemoveWorkExperience(exp.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title || ""}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'title', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company || ""}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'company', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location || ""}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'location', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <div className="flex gap-2">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={exp.startDate || ""}
                        onChange={(e) => handleUpdateWorkExperience(exp.id, 'startDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                      />
                      {!exp.current && (
                        <input
                          type="month"
                          placeholder="End Date"
                          value={exp.endDate || ""}
                          onChange={(e) => handleUpdateWorkExperience(exp.id, 'endDate', e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onChange={(e) => handleUpdateWorkExperience(exp.id, 'current', e.target.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground">
                      I currently work here
                    </label>
                  </div>

                  <textarea
                    placeholder="Job description, achievements, responsibilities..."
                    value={exp.description || ""}
                    onChange={(e) => handleUpdateWorkExperience(exp.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none h-24"
                  />
                </div>
              ))}
              
              {(!workExperience || workExperience.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No work experience added yet. Click "Add Experience" to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="border-t border-border pt-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold">Education</h3>
              </div>
              <button
                onClick={handleAddEducation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </div>

            <div className="space-y-6">
              {(education || []).map((edu) => (
                <div key={edu.id} className="bg-background/50 border border-border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">Education #{(education || []).indexOf(edu) + 1}</h4>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, 'location', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="GPA (Optional)"
                      value={edu.gpa || ""}
                      onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                      className="px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <input
                        type="month"
                        placeholder="Start Date"
                        value={edu.startDate || ""}
                        onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                      />
                      {!edu.current && (
                        <input
                          type="month"
                          placeholder="End Date"
                          value={edu.endDate || ""}
                          onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-edu-${edu.id}`}
                      checked={edu.current}
                      onChange={(e) => handleUpdateEducation(edu.id, 'current', e.target.checked)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <label htmlFor={`current-edu-${edu.id}`} className="text-sm text-muted-foreground">
                      I'm currently studying here
                    </label>
                  </div>

                  <textarea
                    placeholder="Additional details, achievements, coursework..."
                    value={edu.description || ""}
                    onChange={(e) => handleUpdateEducation(edu.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none h-20"
                  />
                </div>
              ))}
              
              {(!education || education.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
              )}
            </div>
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

              {/* Combined Save & Continue Button */}
              <button
                type="submit"
                disabled={!apiToken?.trim()}
                onClick={() => handleSavePersonalInfo()}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
              >
                Save Profile & Continue to Resume Generator
              </button>
            </form>

            <div className="text-xs text-muted-foreground text-center mt-4">
              <p>
                Your information is stored locally and encrypted in browser storage.
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
              Welcome, {(personalInfo?.fullName) || "User"}!
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

      {/* Simplified Input Form - Only Job Description and Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
              className="w-full h-40 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Job Requirements */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Skills & Requirements</h3>
            </div>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List the skills, technologies, qualifications, and requirements mentioned in the job posting that you want to highlight..."
              className="w-full h-40 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription || !skills}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Play className="h-4 w-4" />
              {isGenerating ? "Generating Resume..." : "Generate Resume"}
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