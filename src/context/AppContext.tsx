import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface LegalDocument {
  id: string;
  name: string;
  size: string;
  pages: number;
  status: 'Analyzed' | 'Processing' | 'Failed';
  uploadDate: string;
  summary: {
    overview: string;
    parties: string[];
    date: string;
    jurisdiction: string;
  };
  clauses: Array<{
    type: string;
    text: string;
    status: 'Present' | 'Missing' | 'Modified';
    confidence: number;
    explanation: string;
  }>;
  risks: Array<{
    level: 'High' | 'Medium' | 'Low';
    title: string;
    description: string;
    recommendation: string;
    reference: string;
  }>;
  missingClauses: Array<{
    type: string;
    criticality: 'High' | 'Medium' | 'Low';
    description: string;
    typicalText: string;
  }>;
  obligations: Array<{
    party: string;
    task: string;
    deadline: string;
    status: 'Active' | 'Pending' | 'Fulfilled';
  }>;
  definitions: Array<{
    term: string;
    definition: string;
    page: number;
  }>;
  memo: string;
  rawText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AppContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  ollamaModel: string;
  setOllamaModel: (model: string) => void;
  ollamaStatus: 'disconnected' | 'connected' | 'checking';
  checkOllamaConnection: () => Promise<void>;
  availableModels: string[];
  setAvailableModels: (models: string[]) => void;
  documents: LegalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<LegalDocument[]>>;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  uploadDocument: (file: File) => Promise<void>;
  analysisLoading: boolean;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  comparisonContracts: {
    contractA: LegalDocument | null;
    contractB: LegalDocument | null;
  };
  setComparisonContract: (side: 'A' | 'B', docId: string | null) => void;
  stats: {
    contractsAnalysed: number;
    risksFound: number;
    clausesVerified: number;
    missingClausesCount: number;
    reportsGenerated: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Google Fonts mapping for dynamic link inclusion
const GOOGLE_FONTS: Record<string, string> = {
  'Playfair Display': 'family=Playfair+Display:wght@400;500;600;700;800',
  'Lora': 'family=Lora:wght@400;500;600;700',
  'Fira Code': 'family=Fira+Code:wght@400;500;600;700',
  'Roboto': 'family=Roboto:wght@300;400;500;700',
  'Poppins': 'family=Poppins:wght@300;400;500;600;700',
  'Merriweather': 'family=Merriweather:wght@300;400;700',
};

// Font stack styles to inject into HTML CSS custom properties
const FONT_STACKS: Record<string, string> = {
  'Inter': "'Inter', system-ui, sans-serif",
  'Outfit': "'Outfit', system-ui, sans-serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Lora': "'Lora', Georgia, serif",
  'Fira Code': "'Fira Code', Consolas, Monaco, monospace",
  'Roboto': "'Roboto', 'Helvetica Neue', Arial, sans-serif",
  'Poppins': "'Poppins', 'Segoe UI', sans-serif",
  'Merriweather': "'Merriweather', Georgia, serif",
  'Times New Roman': "'Times New Roman', Times, Georgia, serif",
  'Georgia': "Georgia, serif",
  'System Sans': "system-ui, -apple-system, sans-serif"
};

// Sample initial documents for realistic data
const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-1',
    name: 'SaaS_Agreement_CloudTech_Final.pdf',
    size: '1.2 MB',
    pages: 14,
    status: 'Analyzed',
    uploadDate: '2026-06-25',
    summary: {
      overview: 'This is a Master Software-as-a-Service (SaaS) Agreement entered into between CloudTech Solutions Inc. ("Provider") and Global Enterprise Corp. ("Customer"). The agreement defines the terms under which Provider will supply enterprise cloud computing services, hosting support, and maintenance. Key areas covered include data processing, intellectual property allocation, service level standards (SLA), and liability limitations.',
      parties: ['CloudTech Solutions Inc. (Provider)', 'Global Enterprise Corp. (Customer)'],
      date: 'June 15, 2026',
      jurisdiction: 'State of Delaware, USA',
    },
    clauses: [
      {
        type: 'Confidentiality',
        text: 'Each Party agrees to protect the Confidential Information of the other party using the same degree of care (but no less than a reasonable degree of care) that it uses to protect its own confidential info. Confidential information shall not include information that is publicly known or becomes known through no fault of the receiving party.',
        status: 'Present',
        confidence: 98,
        explanation: 'Standard mutual non-disclosure clause. Contains appropriate definitions of confidential information, exclusions, and standard of care requirements.',
      },
      {
        type: 'Termination',
        text: 'Either party may terminate this Agreement: (a) for convenience upon ninety (90) days written notice to the other party; or (b) immediately if the other party breaches any material term of this Agreement and fails to cure such breach within thirty (30) days of receiving written notice.',
        status: 'Present',
        confidence: 95,
        explanation: 'Standard termination for cause and convenience. The cure period of 30 days is aligned with typical enterprise standards.',
      },
      {
        type: 'Limitation of Liability',
        text: 'IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. PROVIDER\'S TOTAL AGGREGATE LIABILITY ARISING OUT OF THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.',
        status: 'Modified',
        confidence: 92,
        explanation: 'The limitation is capped at 12 months fees, which is standard, but the unilateral nature of some exclusions may favor the Provider. Contains standard caps and exclusions of consequential damages.',
      },
      {
        type: 'Force Majeure',
        text: 'Neither party shall be liable for failure or delay in performing its obligations due to causes beyond its reasonable control, including acts of God, war, riot, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy, labor or materials.',
        status: 'Present',
        confidence: 97,
        explanation: 'Comprehensive Force Majeure list. It appropriately includes standard events like acts of God, strikes, and supply chain failures.',
      },
      {
        type: 'Governing Law',
        text: 'This Agreement shall be governed by, construed and enforced in accordance with the laws of the State of Delaware, without regard to its conflict of laws rules.',
        status: 'Present',
        confidence: 99,
        explanation: 'Specifies Delaware law, which is standard for corporate and tech SaaS agreements.',
      },
      {
        type: 'Intellectual Property',
        text: 'Provider retains all right, title, and interest in and to the SaaS services, software, documentation, and any derivative works. Customer retains all right, title, and interest in and to Customer Data uploaded into the system.',
        status: 'Present',
        confidence: 96,
        explanation: 'Protects the Provider\'s proprietary software assets while ensuring the Customer maintains complete ownership over uploaded client data.',
      }
    ],
    risks: [
      {
        level: 'High',
        title: 'Unilateral SLA Credits Structure',
        description: 'SLA service credits are the Customer\'s sole and exclusive remedy for downtime. Credit calculations are heavily weighted in favor of the Provider, capped at 10% of monthly fees.',
        recommendation: 'Negotiate higher credit tiers (up to 30% of monthly fees) and include a clause allowing termination for chronic SLA breaches (e.g., uptime below 95% for 3 consecutive months).',
        reference: 'Section 4.2 (Service Level Agreement)'
      },
      {
        level: 'Medium',
        title: 'Vague Data Protection Obligations',
        description: 'The agreement mentions standard security measures but lacks specific technical safeguards or references to GDPR, CCPA, or SOC2 compliance metrics.',
        recommendation: 'Insert a comprehensive Data Processing Addendum (DPA) specifying ISO 27001/SOC2 compliance, breach notification within 72 hours, and right to audit clauses.',
        reference: 'Section 7.3 (Data Security)'
      },
      {
        level: 'Low',
        title: 'Wide Definition of Provider IP',
        description: 'The definition of "Provider Intellectual Property" includes suggestions, feedback, and enhancement requests provided by the Customer.',
        recommendation: 'Clarify that customer feedback is licensed non-exclusively and does not transfer proprietary workflow ideas developed by the Customer.',
        reference: 'Section 8.4 (Intellectual Property Ownership)'
      }
    ],
    missingClauses: [
      {
        type: 'Data Breach Indemnification',
        criticality: 'High',
        description: 'Absence of an explicit indemnification provision for third-party claims resulting from a data breach caused by the Provider.',
        typicalText: 'Provider shall defend, indemnify, and hold harmless Customer from and against any and all claims, liabilities, damages, losses, and expenses arising out of a data breach of Customer Data caused by Provider\'s negligence or willful misconduct.'
      },
      {
        type: 'Compliance with Anti-Bribery Laws',
        criticality: 'Medium',
        description: 'No explicit commitment to comply with FCPA or UK Bribery Act guidelines.',
        typicalText: 'Each party represents and warrants that it is, and will remain, in compliance with all applicable anti-corruption laws, including the US Foreign Corrupt Practices Act.'
      }
    ],
    obligations: [
      {
        party: 'CloudTech Solutions (Provider)',
        task: 'Maintain system availability uptime of 99.9% excluding scheduled maintenance.',
        deadline: 'Monthly evaluation',
        status: 'Active'
      },
      {
        party: 'Global Enterprise Corp (Customer)',
        task: 'Pay all outstanding invoices within 30 days of receipt.',
        deadline: 'Within 30 days from Invoice Date',
        status: 'Active'
      },
      {
        party: 'CloudTech Solutions (Provider)',
        task: 'Conduct annual SOC 2 Type II audit and deliver copy to Customer upon request.',
        deadline: 'Within 30 days of audit report release',
        status: 'Pending'
      }
    ],
    definitions: [
      { term: 'Customer Data', definition: 'All electronic data, information, or records uploaded, processed, or stored by Customer in connection with the Services.', page: 2 },
      { term: 'SaaS Services', definition: 'The proprietary cloud computing platform, hosting infrastructure, and support services provided under this agreement.', page: 1 },
      { term: 'Confidential Information', definition: 'Any proprietary information disclosed by one party to the other that is marked as confidential or should reasonably be understood to be confidential.', page: 5 },
      { term: 'Service Credits', definition: 'The financial credits issued to Customer in the event Provider fails to meet the SLA performance metrics.', page: 4 }
    ],
    memo: `MEMORANDUM

TO: Senior Counsel, Global Enterprise Corp.
FROM: LexAI Assistant (Ollama Analysis Engine)
DATE: June 26, 2026
SUBJECT: Risk Assessment and Legal Review: SaaS Agreement with CloudTech Solutions Inc.

1. EXECUTIVE SUMMARY
This memorandum summarizes our review of the proposed Master SaaS Agreement between CloudTech Solutions Inc. ("Provider") and Global Enterprise Corp. ("Customer"). The agreement is primarily structured to protect the Provider, placing significant liability limitations on the vendor while restricting Customer's remedies for service failures. 

2. KEY AREAS OF RISK
• Service Level Agreement (SLA): Service credits are structured as the sole remedy. If downtime is frequent, Customer has no recourse other than small fee offsets.
• Data Privacy & Breach: There is an absence of a standard Data Processing Addendum (DPA) and data breach indemnification. Under current language, Customer would absorb third-party liability if Provider leaks client data.
• Limitation of Liability: A reciprocal cap is set at 12 months fees. However, given Customer's dependency on the hosting, a higher cap should be requested for data security incidents.

3. RECOMMENDATIONS
• Demand inclusion of a DPA detailing GDPR/CCPA compliance and 72-hour breach notification.
• Add a clause to the SLA granting termination rights if availability drops below 98% in any single month or 99% for three consecutive months.
• Carve out "breaches of confidentiality and data security" from the standard 12-month liability cap, or set a super-cap (e.g., 3x annual fees) for data breach claims.`,
    rawText: `MASTER SOFTWARE AS A SERVICE AGREEMENT
This Master Software as a Service Agreement (the "Agreement") is entered into as of June 15, 2026 (the "Effective Date"), by and between CloudTech Solutions Inc., a Delaware corporation with offices at 100 Cloud Way, San Francisco, CA ("Provider"), and Global Enterprise Corp., a Delaware corporation with offices at 500 Corporate Parkway, New York, NY ("Customer").
WHEREAS, Provider has developed and hosts an enterprise software solution for cloud resource optimization; and WHEREAS, Customer wishes to license access to such software;
NOW, THEREFORE, the parties agree as follows:
1. SaaS Services. Provider shall make the SaaS Services available to Customer pursuant to this Agreement...
2. Customer Data. Customer retains all ownership and intellectual property rights in and to the Customer Data...
3. Confidentiality. Each Party agrees to protect the Confidential Information of the other party...
4. SLA & Credits. Provider warrants a 99.9% uptime... SLA credits are the sole and exclusive remedy...
5. Fees & Payment. Customer shall pay all fees specified in the Order Form. All payments are due within thirty (30) days...
6. Limitation of Liability. IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, SPECIAL, OR CONSEQUENTIAL DAMAGES. LIABILITY IS CAPPED AT FEES PAID IN THE PAST 12 MONTHS...
7. Governing Law. Delaware law shall govern this Agreement...`
  },
  {
    id: 'doc-2',
    name: 'Employment_Contract_Executive_JohnDoe.docx',
    size: '850 KB',
    pages: 8,
    status: 'Analyzed',
    uploadDate: '2026-06-22',
    summary: {
      overview: 'Executive employment agreement between Apex Holdings Ltd. and John Doe, appointing him as Vice President of Operations. Covers executive duties, base salary, performance bonuses, equity incentives, restrictive covenants (non-compete, non-solicit), and severance terms.',
      parties: ['Apex Holdings Ltd. (Employer)', 'John Doe (Executive)'],
      date: 'June 20, 2026',
      jurisdiction: 'State of New York, USA',
    },
    clauses: [
      {
        type: 'Non-Compete',
        text: 'During the Employment Period and for a period of twelve (12) months following termination of employment for any reason, the Executive shall not, directly or indirectly, engage in or perform services for any business that competes with the Employer within the United States.',
        status: 'Modified',
        confidence: 90,
        explanation: 'The geographic scope ("within the United States") is extremely broad and may be legally unenforceable in New York unless narrowed to areas where the employer operates.',
      },
      {
        type: 'Termination',
        text: 'The Employer may terminate the Executive\'s employment at any time for Cause (as defined herein) without notice or severance. The Executive may terminate their employment upon sixty (60) days written notice.',
        status: 'Present',
        confidence: 96,
        explanation: 'Includes standard definitions for "Cause", including material breach of duty, felony conviction, or fraud.',
      },
      {
        type: 'Arbitration',
        text: 'Any dispute, controversy or claim arising out of or relating to this Agreement shall be settled by binding arbitration in New York, NY, in accordance with the employment arbitration rules of the American Arbitration Association (AAA).',
        status: 'Present',
        confidence: 98,
        explanation: 'Mandatory arbitration provision for employment disputes. Standard terms.',
      }
    ],
    risks: [
      {
        level: 'High',
        title: 'Overbroad Non-Compete Clause',
        description: 'A 12-month post-employment non-compete covering the entire United States is highly restrictive and likely unenforceable under current New York case law and FTC proposed rulings.',
        recommendation: 'Narrow the geographic scope to the NY Tri-State area and restrict only specific direct competitors of Apex Holdings.',
        reference: 'Section 9.1 (Restrictive Covenants)'
      },
      {
        level: 'Medium',
        title: 'Unilateral Severance Forfeiture',
        description: 'If terminated "for Cause", all accrued bonus and unvested stock options are immediately forfeited. "Cause" includes vague terms like "performance failure".',
        recommendation: 'Refine "Cause" to exclude ordinary performance issues, requiring written warning and a 30-day cure period for performance-related issues before termination.',
        reference: 'Section 6.3 (Termination Benefits)'
      }
    ],
    missingClauses: [
      {
        type: 'Golden Parachute Excise Tax Provision',
        criticality: 'Medium',
        description: 'Lacks a "280G cutback" or "gross-up" provision protect the executive from tax penalties on severance change-in-control payouts.',
        typicalText: 'In the event that any payment or benefit received by Executive would be subject to the excise tax imposed by Section 4999 of the Code, then such payments shall be reduced to the maximum amount that avoids such tax, if it yields a higher net-after-tax benefit.'
      }
    ],
    obligations: [
      {
        party: 'John Doe (Executive)',
        task: 'Devote full professional time and best efforts to Apex Holdings operations.',
        deadline: 'Continuous',
        status: 'Active'
      },
      {
        party: 'Apex Holdings Ltd.',
        task: 'Review base salary annually and determine discretionary cash performance bonus.',
        deadline: 'First Quarter of each calendar year',
        status: 'Pending'
      }
    ],
    definitions: [
      { term: 'Cause', definition: 'Material breach of employment terms, conviction of a felony, embezzlement, or failure to perform duties after written warning.', page: 4 },
      { term: 'Good Reason', definition: 'A material reduction in base salary, title, or authority, or relocation of primary workplace by more than 50 miles.', page: 4 }
    ],
    memo: `MEMORANDUM

TO: John Doe (Executive Client)
FROM: LexAI Legal Advisor
DATE: June 22, 2026
SUBJECT: Restrictive Covenants and Severance Review - Apex Employment Contract

We have reviewed your proposed Executive Employment Contract with Apex Holdings Ltd. While the compensation terms are competitive, two major legal risks stand out:

1. Non-Compete Scope: The 12-month US-wide restriction is overbroad. We must negotiate a narrower scope to prevent you from being locked out of the entire industry if you depart.
2. Definition of "Cause": The inclusion of "performance failure" in Cause is dangerous, as it allows Apex to terminate you without severance for subjective reasons. We will push to limit Cause to bad-faith actions (fraud, crimes, material breach).`,
    rawText: `EXECUTIVE EMPLOYMENT AGREEMENT
This Agreement is entered into on June 20, 2026 by Apex Holdings Ltd. ("Employer") and John Doe ("Executive").
1. Position. Executive is appointed as Vice President of Operations, reporting to the Chief Executive Officer...
2. Compensation. Base salary of $250,000 per annum, paid bi-weekly. Eligible for a 40% target performance bonus...
3. Termination for Cause. The Employer may terminate employment for Cause immediately...
4. Restrictive Covenants. Executive shall not compete with Employer for 12 months in the United States...
5. Arbitration. All disputes arising under this agreement shall be submitted to AAA arbitration...`
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [fontFamily, setFontFamilyState] = useState<string>(() => {
    return localStorage.getItem('lexai-font') || 'Inter';
  });

  const setFontFamily = (font: string) => {
    setFontFamilyState(font);
    localStorage.setItem('lexai-font', font);
  };
  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState<string>('qwen2.5-coder:7b');
  const [ollamaStatus, setOllamaStatus] = useState<'disconnected' | 'connected' | 'checking'>('disconnected');
  const [availableModels, setAvailableModels] = useState<string[]>(['qwen2.5-coder:7b', 'llama3:8b', 'mistral:latest']);
  const [documents, setDocuments] = useState<LegalDocument[]>(INITIAL_DOCUMENTS);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>('doc-1');
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [comparisonContracts, setComparisonContracts] = useState<{
    contractA: LegalDocument | null;
    contractB: LegalDocument | null;
  }>({ contractA: INITIAL_DOCUMENTS[0], contractB: INITIAL_DOCUMENTS[1] });

  // Statistics calculation helper
  const stats = {
    contractsAnalysed: documents.length,
    risksFound: documents.reduce((acc, doc) => acc + (doc.status === 'Analyzed' ? doc.risks.length : 0), 0),
    clausesVerified: documents.length > 0
      ? Math.round((documents.reduce((acc, doc) => acc + doc.clauses.filter(c => c.status === 'Present' || c.status === 'Modified').length, 0) /
        documents.reduce((acc, doc) => acc + doc.clauses.length, 0)) * 100)
      : 0,
    missingClausesCount: documents.reduce((acc, doc) => acc + (doc.status === 'Analyzed' ? doc.missingClauses.length : 0), 0),
    reportsGenerated: documents.filter(d => d.status === 'Analyzed').length * 2 + 15,
  };

  // Sync theme with HTML tag
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dynamically load Google Font and sync with CSS custom properties
  useEffect(() => {
    if (GOOGLE_FONTS[fontFamily]) {
      const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?${GOOGLE_FONTS[fontFamily]}&display=swap`;
        document.head.appendChild(link);
      }
    }

    const root = window.document.documentElement;
    const stack = FONT_STACKS[fontFamily] || FONT_STACKS['Inter'];
    root.style.setProperty('--font-family', stack);

    if (fontFamily === 'Outfit' || fontFamily === 'Inter') {
      root.style.setProperty('--font-heading', "'Outfit', sans-serif");
    } else {
      root.style.setProperty('--font-heading', stack);
    }
  }, [fontFamily]);

  // Toggle helper
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  // Check Ollama API server status and query available models
  const checkOllamaConnection = async () => {
    setOllamaStatus('checking');
    try {
      const response = await fetch(`${ollamaUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000), // Bounded timeout
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.models && Array.isArray(data.models)) {
          const names = data.models.map((m: any) => m.name);
          if (names.length > 0) {
            setAvailableModels(names);
          }
        }
        setOllamaStatus('connected');
      } else {
        setOllamaStatus('disconnected');
      }
    } catch (e) {
      setOllamaStatus('disconnected');
    }
  };

  // Run Ollama status check on mount and URL changes
  useEffect(() => {
    checkOllamaConnection();
  }, [ollamaUrl]);

  // Upload and parse mock AI document
  const uploadDocument = async (file: File) => {
    setAnalysisLoading(true);

    // Simulate upload delay and legal analysis parsing
    await new Promise((resolve) => setTimeout(resolve, 3500));

    const id = `doc-${Date.now()}`;
    const cleanName = file.name;
    const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const mockPages = Math.floor(Math.random() * 15) + 3;

    // Generate dynamic mock analysis based on file name or generic legal text
    const isNDA = cleanName.toLowerCase().includes('nda') || cleanName.toLowerCase().includes('disclosure') || cleanName.toLowerCase().includes('confidential');

    const newDoc: LegalDocument = {
      id,
      name: cleanName,
      size,
      pages: mockPages,
      status: 'Analyzed',
      uploadDate: new Date().toISOString().split('T')[0],
      summary: isNDA ? {
        overview: 'This is a Mutual Non-Disclosure Agreement (NDA) entered into by the disclosing and receiving parties to facilitate discussions regarding potential business relationships or transactions. It mandates that neither party may disclose trade secrets, customer records, or internal roadmap data without prior written authorization.',
        parties: ['Disclosing Party', 'Receiving Party'],
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        jurisdiction: 'State of California, USA',
      } : {
        overview: 'A legal services or vendor supply agreement details the deliverables, intellectual property ownership terms, payment specifications, and mutual covenants. The AI scan notes that payment terms are net-45 and includes standard warranty disclaimers.',
        parties: ['LexAI Client (Service Receiver)', 'Vendor Entity (Service Provider)'],
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        jurisdiction: 'State of Delaware, USA',
      },
      clauses: isNDA ? [
        {
          type: 'Confidentiality',
          text: 'Receiving party shall keep confidential all Disclosing party items and use them only for the purpose of the business engagement.',
          status: 'Present',
          confidence: 99,
          explanation: 'Standard confidentiality clause matches protection standards.'
        },
        {
          type: 'Termination',
          text: 'This agreement shall expire 3 years from the effective date, but confidentiality requirements shall persist for 5 years.',
          status: 'Present',
          confidence: 92,
          explanation: 'Standard term limit. Confidentially survival is appropriately established for 5 years.'
        },
        {
          type: 'Governing Law',
          text: 'This agreement is governed by the laws of California.',
          status: 'Present',
          confidence: 98,
          explanation: 'California governing law is standard.'
        }
      ] : [
        {
          type: 'Confidentiality',
          text: 'Each party shall maintain confidentiality of mutual trade secrets.',
          status: 'Present',
          confidence: 94,
          explanation: 'Standard NDA clauses included.'
        },
        {
          type: 'Governing Law',
          text: 'Governed by the laws of the State of Delaware.',
          status: 'Present',
          confidence: 99,
          explanation: 'Delaware law specifies solid protection standards.'
        },
        {
          type: 'Indemnity',
          text: 'Vendor shall indemnify Customer for intellectual property infringement claims.',
          status: 'Present',
          confidence: 88,
          explanation: 'Contains mutual or provider-specific indemnity for IP. Protects Customer.'
        }
      ],
      risks: isNDA ? [
        {
          level: 'Medium',
          title: 'Unilateral Definitional Exclusions',
          description: 'Exclusions from confidentiality lack requirements for standard written proof.',
          recommendation: 'Incorporate clauses requiring the receiving party to prove by written records that information was already in their possession.',
          reference: 'Section 2(b)'
        }
      ] : [
        {
          level: 'High',
          title: 'Net-45 Payment Penalty',
          description: 'Payment terms are Net-45 with an automatic 1.5% monthly compounding late fee charge.',
          recommendation: 'Renegotiate to standard Net-30 without compounding interest rate structures.',
          reference: 'Section 5.1'
        }
      ],
      missingClauses: isNDA ? [
        {
          type: 'Injunctive Relief',
          criticality: 'High',
          description: 'No explicit clause granting immediate equitable and injunctive relief in the event of a breach.',
          typicalText: 'Money damages would be insufficient in the event of a breach. Disclosing party is entitled to seek injunctive relief without posting a bond.'
        }
      ] : [
        {
          type: 'Force Majeure',
          criticality: 'Medium',
          description: 'No clause defining contract obligations in the event of disaster, pandemic, or labor actions.',
          typicalText: 'Neither party is liable for standard delays resulting from Acts of God, war, pandemic, or government directives.'
        }
      ],
      obligations: isNDA ? [
        {
          party: 'Receiving Party',
          task: 'Return or destroy all confidential materials within 10 days of request.',
          deadline: '10 Days post termination request',
          status: 'Active'
        }
      ] : [
        {
          party: 'Client Entity',
          task: 'Pay incoming invoices from vendor within 45 days.',
          deadline: 'Net-45',
          status: 'Active'
        }
      ],
      definitions: isNDA ? [
        { term: 'Confidential Info', definition: 'Any and all technical or commercial secrets marked or verbally disclosed.', page: 1 },
        { term: 'Purpose', definition: 'Evaluation of potential commercial collaboration between the parties.', page: 1 }
      ] : [
        { term: 'Services', definition: 'Software architecture design, API deployment, and frontend React setup.', page: 1 }
      ],
      memo: `MEMORANDUM

TO: Corporate Legal Lead
FROM: LexAI Ollama Auditor
DATE: ${new Date().toLocaleDateString('en-US')}
SUBJECT: Quick Scan Results: ${cleanName}

The uploaded document ${cleanName} was processed with high confidence.
• The document covers standard legal terms.
• We identified risks surrounding ${isNDA ? 'Confidentiality limitations' : 'Payment schedules'}.
• Please review detailed panels for full risk remediation guidance.`,
      rawText: `MEMORANDUM OF AGREEMENT\nThis contract is signed on ${new Date().toLocaleDateString('en-US')} between the parties...\nIntellectual property remains proprietary...`
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocumentId(id);
    setAnalysisLoading(false);
  };

  // Chat message query helper (with Ollama query and simulated streaming fallback)
  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    const activeDoc = documents.find(d => d.id === selectedDocumentId);

    // Enrich context for local Ollama instances
    const documentContext = activeDoc
      ? `You are discussing the legal document: "${activeDoc.name}".
Summary Overview: ${activeDoc.summary.overview}
Parties Involved: ${activeDoc.summary.parties.join(', ')}
Agreement Date: ${activeDoc.summary.date}
Governing Jurisdiction: ${activeDoc.summary.jurisdiction}
Clauses Audited:
${activeDoc.clauses.map(c => `- ${c.type} (${c.status}): ${c.text} (Audit Note: ${c.explanation})`).join('\n')}
Risks Found:
${activeDoc.risks.map(r => `- [${r.level} Risk] ${r.title}: ${r.description} (Rec: ${r.recommendation}) (Ref: ${r.reference})`).join('\n')}
Missing Clauses:
${activeDoc.missingClauses.map(m => `- ${m.type} (${m.criticality} Severity): ${m.description} (Proposed Text: "${m.typicalText}")`).join('\n')}
Extracted Obligations:
${activeDoc.obligations.map(o => `- ${o.party}: ${o.task} (Deadline: ${o.deadline}, Status: ${o.status})`).join('\n')}
Defined Terms:
${activeDoc.definitions.map(d => `- "${d.term}" (Page ${d.page}): ${d.definition}`).join('\n')}
Full Raw Document Excerpt:
${activeDoc.rawText}`
      : 'No active document selected.';

    // Construct AI message placeholder
    const aiMsgId = `msg-${Date.now()}-ai`;
    const placeholderMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: 'Analyzing document context...',
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, placeholderMsg]);

    if (ollamaStatus === 'connected') {
      try {
        const response = await fetch(`${ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [
              { role: 'system', content: `You are an expert legal AI assistant. Answer the user's questions specifically referencing the provided legal context. Always remain professional. Context: ${documentContext}` },
              { role: 'user', content: text }
            ],
            stream: false
          })
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponseText = data.message?.content || 'Unable to parse Ollama output.';
          setChatMessages((prev) =>
            prev.map(m => m.id === aiMsgId ? { ...m, text: aiResponseText } : m)
          );
          return;
        }
      } catch (e) {
        console.error('Ollama communication error, switching to legal simulation engine:', e);
      }
    }

    // High quality fallback simulated response (intelligent NLP parser)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let answer = '';
    const query = text.toLowerCase();
    const stopwords = new Set(['what', 'is', 'the', 'a', 'of', 'and', 'to', 'in', 'on', 'about', 'for', 'with', 'from', 'by', 'who', 'how', 'when', 'where', 'contract', 'agreement', 'document']);
    const queryTerms = query.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 3 && !stopwords.has(w));

    if (activeDoc) {
      // 1. Governing Law & Jurisdiction
      if (query.includes('governing law') || query.includes('jurisdiction') || query.includes('law governed') || query.includes('state of')) {
        answer = `The contract "${activeDoc.name}" specifies the governing law and jurisdiction as the **${activeDoc.summary.jurisdiction}**. 
        
This is referenced under the contract's primary metadata. If a dispute arises, it will be heard under these state laws.`;

        // 2. Parties
      } else if (query.includes('parties') || query.includes('party') || query.includes('who is involved') || query.includes('who signed')) {
        answer = `The contracting parties identified in "${activeDoc.name}" are:
${activeDoc.summary.parties.map((p, idx) => `• **Party ${idx + 1}**: ${p}`).join('\n')}

These parties are mutually bound to all provisions, representations, and warranties detailed in this contract.`;

        // 3. Date / Duration / Effective
      } else if (query.includes('date') || query.includes('effective') || query.includes('signed') || query.includes('signing')) {
        answer = `The agreement was signed/became effective on **${activeDoc.summary.date}**. 

All obligations and restrictive covenants start running from this effective date unless otherwise specified in individual clauses.`;

        // 4. Executive Summary / Overview
      } else if (query.includes('summary') || query.includes('summarize') || query.includes('overview') || query.includes('what is this') || query.includes('abstract')) {
        answer = `### Executive Summary of "${activeDoc.name}":
${activeDoc.summary.overview}

**Key Details:**
• **Signed Date:** ${activeDoc.summary.date}
• **Governing Jurisdiction:** ${activeDoc.summary.jurisdiction}
• **Parties:** ${activeDoc.summary.parties.join(' AND ')}`;

        // 5. Risks List
      } else if (query.includes('risk') || query.includes('danger') || query.includes('warn') || query.includes('threat') || query.includes('exposure')) {
        answer = `### Risk and Exposure Assessment for "${activeDoc.name}":
I identified **${activeDoc.risks.length} key risks** that warrant legal review:

${activeDoc.risks.map((r, i) => `${i + 1}. **${r.title}** (${r.level} Risk) - *Ref: ${r.reference}*
   - **Description:** ${r.description}
   - **Recommendation:** ${r.recommendation}`).join('\n\n')}`;

        // 6. Missing Clauses / Checklist
      } else if (query.includes('missing') || query.includes('lack') || query.includes('absent') || query.includes('checklist')) {
        answer = `### Missing Clauses Audit for "${activeDoc.name}":
I flagged **${activeDoc.missingClauses.length} missing provisions** that should be incorporated for standard compliance:

${activeDoc.missingClauses.map((m, i) => `${i + 1}. **${m.type}** (Criticality: **${m.criticality}**)
   - **Gap Description:** ${m.description}
   - **Recommended Typical Text to Insert:** 
     \`"${m.typicalText}"\``).join('\n\n')}`;

        // 7. Obligations / Tasks
      } else if (query.includes('obligation') || query.includes('task') || query.includes('deadline') || query.includes('todo') || query.includes('must do')) {
        answer = `### Active Covenants and Obligations in "${activeDoc.name}":
I extracted **${activeDoc.obligations.length} primary deliverables/obligations** for the contracting parties:

${activeDoc.obligations.map((o, i) => `${i + 1}. **${o.party}**
   - **Obligation:** ${o.task}
   - **Deadline:** ${o.deadline}
   - **Current Status:** \`${o.status}\``).join('\n\n')}`;

        // 8. Specific Definitions search
      } else if (query.includes('define') || query.includes('definition') || query.includes('mean') || query.includes('meaning') || query.includes('term') || query.includes('who is')) {
        // Find if any defined term is mentioned in the query
        const matchingDefs = activeDoc.definitions.filter(d =>
          query.includes(d.term.toLowerCase()) ||
          queryTerms.some(word => d.term.toLowerCase().includes(word))
        );

        if (matchingDefs.length > 0) {
          answer = `### Extracted Definition(s) from "${activeDoc.name}":
${matchingDefs.map(d => `• **${d.term}** (Page ${d.page}): ${d.definition}`).join('\n\n')}`;
        } else {
          answer = `### Key Defined Terms in "${activeDoc.name}":
Here are the primary terms defined in this agreement:

${activeDoc.definitions.map(d => `• **${d.term}** (Page ${d.page}): *${d.definition}*`).join('\n')}`;
        }

        // 9. Specific Clauses Search (Termination, Liability, Confidentiality, Force Majeure, etc.)
      } else {
        // Look if query matches any clause types in activeDoc
        const matchingClause = activeDoc.clauses.find(c =>
          query.includes(c.type.toLowerCase()) ||
          c.type.toLowerCase().split(/\s+/).some(w => w.length > 4 && query.includes(w))
        );

        if (matchingClause) {
          answer = `### Audited Clause: **${matchingClause.type}**
• **Status:** \`${matchingClause.status}\` (Confidence: ${matchingClause.confidence}%)
• **Text in Agreement:**
  *"${matchingClause.text}"*
• **AI Audit Evaluation:** 
  ${matchingClause.explanation}`;
        } else {
          // 10. Fallback keyword lookup in the raw text lines
          const rawLines = activeDoc.rawText.split('\n');
          const matchingLines: string[] = [];

          if (queryTerms.length > 0) {
            for (const line of rawLines) {
              if (queryTerms.some(word => line.toLowerCase().includes(word))) {
                matchingLines.push(line.trim());
              }
              if (matchingLines.length >= 3) break; // cap at 3 excerpts
            }
          }

          if (matchingLines.length > 0) {
            answer = `### Relevant Excerpt(s) found in "${activeDoc.name}":
${matchingLines.map(line => `> *"${line}"*`).join('\n\n')}

Let me know if you want me to expand on these or perform a deep dive into specific covenants.`;
          } else {
            // General response summarizing what's available
            answer = `Regarding "${activeDoc.name}": The contract is between **${activeDoc.summary.parties.join(' and ')}**, signed on **${activeDoc.summary.date}**. 

I identified **${activeDoc.risks.length} risks** (including a *${activeDoc.risks[0]?.title}*) and **${activeDoc.missingClauses.length} missing clauses** (such as *${activeDoc.missingClauses[0]?.type}*).

Can I provide specific information on Governing Law, Obligations, Definitions, or Risk Recommendations?`;
          }
        }
      }
    } else {
      answer = "Please select or upload an active document. Once loaded, I can answer questions about the governing law, parties, obligations, risks, definitions, and specific clauses of that agreement.";
    }

    setChatMessages((prev) =>
      prev.map(m => m.id === aiMsgId ? { ...m, text: answer } : m)
    );
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const setComparisonContract = (side: 'A' | 'B', docId: string | null) => {
    const doc = documents.find(d => d.id === docId) || null;
    setComparisonContracts((prev) => ({
      ...prev,
      [side === 'A' ? 'contractA' : 'contractB']: doc,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
        ollamaUrl,
        setOllamaUrl,
        ollamaModel,
        setOllamaModel,
        ollamaStatus,
        checkOllamaConnection,
        availableModels,
        setAvailableModels,
        documents,
        setDocuments,
        selectedDocumentId,
        setSelectedDocumentId,
        uploadDocument,
        analysisLoading,
        chatMessages,
        sendChatMessage,
        clearChat,
        comparisonContracts,
        setComparisonContract,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
