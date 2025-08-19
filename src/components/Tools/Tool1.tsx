import { useState } from 'react';
import { ArrowLeft, Play, Copy, Check, Key, FileText, User, Briefcase, Eye, Code, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import ReactMarkdown from 'react-markdown';
import { TOOL1_ROUTE } from './Constants';

const Tool1 = () => {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [resumeViewMode, setResumeViewMode] = useState<'markdown' | 'raw'>('markdown');
  const [coverLetterViewMode, setCoverLetterViewMode] = useState<'markdown' | 'raw'>('markdown');

  // Form data
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [personalInfo, setPersonalInfo] = useState('');

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setIsApiKeySet(true);
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription || !skills || !personalInfo) {
      alert('Please fill in all fields before generating');
      return;
    }

    setIsGenerating(true);
    setGeneratedResume('');
    setGeneratedCoverLetter('');

    try {
      // Initialize the ChatGoogleGenerativeAI model
      const model = new ChatGoogleGenerativeAI({
        apiKey: apiKey,
        model: "gemini-2.5-flash-lite",
        temperature: 0.7,
        maxRetries: 3
      });

      // Create output parser
      const outputParser = new StringOutputParser();

      // Resume Prompt Template - Updated for Markdown
      const resumePromptTemplate = PromptTemplate.fromTemplate(
        "You are a professional resume generator agent. Your task is to create an ATS-friendly resume in MARKDOWN format. Generate only the resume content without any conversational elements or introductory text.\n\nInput Data:\nPersonal Information & Experience: {personalInfo}\nJob Requirements & Skills to Highlight: {skills}\nJob Description/Target Role: {jobDescription}\n\nAgent Instructions:\n- Generate ONLY the resume content in MARKDOWN format\n- Use proper markdown headers (# ## ###) for sections\n- Use bullet points (-) for lists\n- Use **bold** for emphasis on key achievements\n- Use STAR format in narrative style for experiences\n- Include quantifiable achievements using: \"accomplished [X] as measured by [Y], by doing [Z]\"\n- Align content with job requirements\n- Keep it concise and ATS-friendly\n\nRequired Markdown Structure:\n```\n# [Full Name]\n**Email:** [email] | **Phone:** [phone] | **Location:** [location] | **LinkedIn:** [linkedin]\n\n## Professional Summary\n[2-3 sentence summary]\n\n## Skills\n- Skill 1\n- Skill 2\n- Skill 3\n\n## Work Experience\n### Job Title - Company Name\n**Duration:** [dates]\n- Achievement 1 using STAR format\n- Achievement 2 using STAR format\n\n## Education\n### Degree - Institution\n**Year:** [year]\n\n## Projects\n### Project Name\n- Project description with impact\n```\n\nOutput the resume content directly in markdown format without any additional commentary.",
      );

      // Cover Letter Prompt Template - Updated for Markdown
      const coverLetterPromptTemplate = PromptTemplate.fromTemplate(
        "You are a professional cover letter generator agent. Your task is to create a compelling cover letter in MARKDOWN format. Generate only the cover letter content without any conversational elements or introductory text.\n\nInput Data:\nPersonal Information & Experience: {personalInfo}\nJob Requirements & Skills to Highlight: {skills}\nJob Description/Target Role: {jobDescription}\n\nAgent Instructions:\n- Generate ONLY the cover letter content in MARKDOWN format\n- Use proper markdown formatting\n- Use **bold** for emphasis on key points\n- Address the specific role mentioned in job description\n- Highlight relevant skills matching job requirements\n- Show enthusiasm for the position\n- Maintain professional tone\n- Keep to 3-4 paragraphs maximum\n\nRequired Markdown Structure:\n```\n# Cover Letter\n\n**[Your Name]**  \n[Your Address]  \n[City, State, ZIP]  \n[Your Email]  \n[Your Phone]  \n\n**Date:** [Current Date]\n\n**[Hiring Manager's Name]**  \n[Company Name]  \n[Company Address]  \n\n**Dear [Hiring Manager/Hiring Team],**\n\n[Opening paragraph - express interest and mention specific role]\n\n[Body paragraph 1 - highlight relevant experience and skills]\n\n[Body paragraph 2 - show enthusiasm and cultural fit]\n\n[Closing paragraph - call to action and professional closing]\n\n**Sincerely,**  \n**[Your Name]**\n```\n\nOutput the cover letter content directly in markdown format without any additional commentary."
      );

      // Create chains
      const resumeChain = RunnableSequence.from([
        resumePromptTemplate,
        model,
        outputParser
      ]);

      const coverLetterChain = RunnableSequence.from([
        coverLetterPromptTemplate,
        model,
        outputParser
      ]);

      // Prepare input data
      const inputData = {
        personalInfo,
        skills,
        jobDescription
      };

      // Execute both chains simultaneously
      const [resumeResult, coverLetterResult] = await Promise.all([
        resumeChain.invoke(inputData),
        coverLetterChain.invoke(inputData)
      ]);

      setGeneratedResume(resumeResult);
      setGeneratedCoverLetter(coverLetterResult);
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedResume('Error: Failed to generate resume. Please check your API key and try again.');
      setGeneratedCoverLetter('Error: Failed to generate cover letter. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResume = () => {
    const contentToCopy = resumeViewMode === 'markdown' ? generatedResume : generatedResume;
    navigator.clipboard.writeText(contentToCopy);
    setCopiedResume(true);
    setTimeout(() => setCopiedResume(false), 2000);
  };

  const handleCopyCoverLetter = () => {
    const contentToCopy = coverLetterViewMode === 'markdown' ? generatedCoverLetter : generatedCoverLetter;
    navigator.clipboard.writeText(contentToCopy);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const openPrintPage = () => {
    const printWindow = window.open('', '_blank');
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
            ${generatedResume ? generatedResume.replace(/\n/g, '<br>').replace(/#{1}\s+/g, '<h1>').replace(/<br><h1>/g, '<h1>').replace(/#{2}\s+/g, '</h1><h2>').replace(/<br><h2>/g, '<h2>').replace(/#{3}\s+/g, '</h2><h3>').replace(/<br><h3>/g, '<h3>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/- /g, '<li>').replace(/<br><li>/g, '<li>').replace(/(<li>.*?)(<br>)/g, '$1</li>$2') : ''}
          </div>
          <div class="page-break"></div>
          <div class="cover-letter-section">
            ${generatedCoverLetter ? generatedCoverLetter.replace(/\n/g, '<br>').replace(/#{1}\s+/g, '<h1>').replace(/<br><h1>/g, '<h1>').replace(/#{2}\s+/g, '</h1><h2>').replace(/<br><h2>/g, '<h2>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') : ''}
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
    setIsApiKeySet(false);
    setApiKey('');
    setGeneratedResume('');
    setGeneratedCoverLetter('');
    setJobDescription('');
    setSkills('');
    setPersonalInfo('');
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

        {/* API Key Setup */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">API Key Required</h2>
            <p className="text-muted-foreground">
              This tool uses Google's Generative AI to create personalized resumes and cover letters. 
              Please enter your Google AI API key to continue.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Google AI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google AI API key..."
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50"
              />
            </div>
            
            <button
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim()}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Continue
            </button>

            <div className="text-xs text-muted-foreground text-center">
              <p>Your API key is stored locally and never sent to our servers.</p>
              <p>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></p>
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
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset API Key
        </button>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Personal Information & Experience</h3>
            </div>
            <textarea
              value={personalInfo}
              onChange={(e) => setPersonalInfo(e.target.value)}
              placeholder="Enter your personal information (name, email, phone, location, LinkedIn) and your work experience, education, projects, skills, certifications, etc..."
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
              disabled={isGenerating || !jobDescription || !skills || !personalInfo}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Play className="h-4 w-4" />
              {isGenerating ? 'Generating Documents...' : 'Generate Documents'}
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
                {(generatedResume && generatedCoverLetter) && (
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
                    onClick={() => setResumeViewMode('markdown')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      resumeViewMode === 'markdown'
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => setResumeViewMode('raw')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      resumeViewMode === 'raw'
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
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
                    {copiedResume ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedResume ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-muted-foreground">Generating resume...</span>
                </div>
              ) : generatedResume ? (
                resumeViewMode === 'markdown' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{generatedResume}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{generatedResume}</pre>
                )
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the information and click generate to create your resume</p>
                </div>
              )}
            </div>
          </div>

          {/* Cover Letter Output */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Generated Cover Letter</h3>
                {(generatedResume && generatedCoverLetter) && (
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
                    onClick={() => setCoverLetterViewMode('markdown')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      coverLetterViewMode === 'markdown'
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => setCoverLetterViewMode('raw')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      coverLetterViewMode === 'raw'
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
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
                    {copiedCoverLetter ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedCoverLetter ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
              {isGenerating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-muted-foreground">Generating cover letter...</span>
                </div>
              ) : generatedCoverLetter ? (
                coverLetterViewMode === 'markdown' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{generatedCoverLetter}</ReactMarkdown>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">{generatedCoverLetter}</pre>
                )
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the information and click generate to create your cover letter</p>
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
              <span>No data sent to our servers</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Direct Google AI communication</span>
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

export default Tool1;