import React, { useState, useEffect } from 'react';
import schoolLogo from '../assets/images/logo3.png';
import {
  BookOpen,
  Calendar,
  Award,
  Download,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  Printer,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Eye,
  GraduationCap,
  Layers,
  HelpCircle,
  X,
  FileCheck
} from 'lucide-react';
import { AnimatedText } from './AnimatedText';
import {
  AcademicPdfDocument,
  getStoredPdfDocuments,
  subscribeToPdfDocuments,
  triggerPdfDownload,
} from '../utils/academicsStore';

interface AcademicsPageProps {
  initialTab?: 'syllabus' | 'timetable' | 'results';
  onBackToHome: () => void;
  onOpenAdmission: () => void;
}

interface SyllabusItem {
  id: string;
  grade: string;
  subject: string;
  code: string;
  term: 'Term 1' | 'Term 2' | 'Annual';
  topicsCount: number;
  fileSize: string;
  description: string;
  keyTopics: string[];
}

interface ExamScheduleItem {
  id: string;
  examName: string;
  grade: string;
  date: string;
  day: string;
  time: string;
  subject: string;
  room: string;
  duration: string;
  maxMarks: number;
  status: 'Upcoming' | 'Concluded';
}

interface StudentResult {
  rollNo: string;
  admissionNo: string;
  studentName: string;
  fatherName: string;
  grade: string;
  section: string;
  session: string;
  term: string;
  attendance: string;
  subjects: {
    name: string;
    maxMarks: number;
    theoryMarks: number;
    practicalMarks: number;
    totalMarks: number;
    grade: string;
  }[];
  rankInClass: string;
  teacherRemarks: string;
}

const mockSyllabusData: SyllabusItem[] = [
  {
    id: 'syl-1',
    grade: 'Class 1',
    subject: 'English & Phonics',
    code: 'ENG-101',
    term: 'Term 1',
    topicsCount: 8,
    fileSize: '1.4 MB',
    description: 'Vowels, Consonant blends, Sight words, Short stories, Rhyming poetry, and introductory handwriting.',
    keyTopics: ['Phonic Sounds & Diagraphs', 'Naming Words (Nouns)', 'Action Words (Verbs)', 'Picture Reading & Short Sentences', 'Spelling & Vocabulary Drills'],
  },
  {
    id: 'syl-2',
    grade: 'Class 2',
    subject: 'Mathematics & Numeracy',
    code: 'MTH-101',
    term: 'Term 1',
    topicsCount: 7,
    fileSize: '1.8 MB',
    description: 'Counting 1-100, number lines, 2D shapes, basic single-digit addition and subtraction with tactile objects.',
    keyTopics: ['Number Sense 1 to 100', 'Place Value (Tens & Ones)', 'Single Digit Addition & Subtraction', 'Basic Geometrical Shapes', 'Patterns & Skip Counting by 2s and 5s'],
  },
  {
    id: 'syl-3',
    grade: 'Class 3',
    subject: 'Environmental Studies (EVS)',
    code: 'EVS-101',
    term: 'Term 1',
    topicsCount: 6,
    fileSize: '1.2 MB',
    description: 'My Family, Parts of the Body, Healthy Habits, Plants in our Garden, Animals around Us, and Seasons.',
    keyTopics: ['All About Myself & Family', 'Human Body & 5 Senses', 'Healthy Food & Hygiene Habits', 'Plants & Trees Around Us', 'Seasons & Weather Observations'],
  },
  {
    id: 'syl-4',
    grade: 'Class 4',
    subject: 'English Grammar & Literature',
    code: 'ENG-201',
    term: 'Term 1',
    topicsCount: 9,
    fileSize: '1.6 MB',
    description: 'Nouns, Pronouns, Punctuation, Reading comprehension paragraphs, Paragraph framing, and moral fables.',
    keyTopics: ['Singular and Plural Nouns', 'Pronouns & Adjectives', 'Simple Present & Past Tense', 'Reading Comprehension Passages', 'Creative 4-line Paragraph Writing'],
  },
  {
    id: 'syl-5',
    grade: 'Class 5',
    subject: 'Mathematics & Mental Math',
    code: 'MTH-201',
    term: 'Term 1',
    topicsCount: 8,
    fileSize: '2.1 MB',
    description: 'Numbers up to 500, Word problems, Multiplication tables (2 to 10), Time reading and basic Indian currency.',
    keyTopics: ['3-Digit Numbers & Place Value', 'Multiplication Tables (2 to 10)', 'Word Problems with Borrowing', 'Telling Time (Half & Full hours)', 'Money & Simple Transactions'],
  },
  {
    id: 'syl-6',
    grade: 'Class 6',
    subject: 'General Science & Experiments',
    code: 'SCI-301',
    term: 'Term 1',
    topicsCount: 7,
    fileSize: '2.4 MB',
    description: 'Living vs Non-living things, Plant parts & photosynthesis basics, Animal habitats, Soil, and Water cycle.',
    keyTopics: ['Living & Non-Living Characteristics', 'Parts of a Plant & Seed Germination', 'Animal Feeding Habits & Habitats', 'Properties of Water & Water Cycle', 'Air, Atmosphere & Weather'],
  },
  {
    id: 'syl-7',
    grade: 'Class 7',
    subject: 'Social Studies & World Around Us',
    code: 'SST-401',
    term: 'Term 1',
    topicsCount: 8,
    fileSize: '2.0 MB',
    description: 'The Globe and Maps, Physical features of India, Northern Plains, Indian Heritage, and Local Self Governance.',
    keyTopics: ['Continents, Oceans & Globe Navigation', 'Physical Divisions of India', 'Climate & Natural Resources', 'Cultural Heritage & Monuments', 'Rights and Duties of a Citizen'],
  },
  {
    id: 'syl-8',
    grade: 'Class 8',
    subject: 'Computer & AI Foundations',
    code: 'ICT-501',
    term: 'Term 1',
    topicsCount: 6,
    fileSize: '1.9 MB',
    description: 'Computer Hardware vs Software, Safe Internet browsing, Visual block programming (Scratch), and Presentation tools.',
    keyTopics: ['Computer Systems & Memory Units', 'Document Formatting & Tables in MS Word', 'Basics of Scratch Visual Coding', 'Internet Safety & Cyber Etiquette', 'Introduction to Artificial Intelligence'],
  },
];

const mockTimeTableData: ExamScheduleItem[] = [
  {
    id: 'tt-1',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Class 1 to 5',
    date: 'Sep 15, 2026',
    day: 'Monday',
    time: '08:30 AM – 11:30 AM',
    subject: 'English Language & Reading',
    room: 'Hall A & B',
    duration: '2.5 Hours',
    maxMarks: 50,
    status: 'Upcoming',
  },
  {
    id: 'tt-2',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Class 1 to 5',
    date: 'Sep 17, 2026',
    day: 'Wednesday',
    time: '08:30 AM – 11:30 AM',
    subject: 'Mathematics & Mental Ability',
    room: 'Hall A & B',
    duration: '2.5 Hours',
    maxMarks: 50,
    status: 'Upcoming',
  },
  {
    id: 'tt-3',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Class 1 to 5',
    date: 'Sep 19, 2026',
    day: 'Friday',
    time: '08:30 AM – 11:30 AM',
    subject: 'Hindi / Regional Language',
    room: 'Hall A & B',
    duration: '2.5 Hours',
    maxMarks: 50,
    status: 'Upcoming',
  },
  {
    id: 'tt-4',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Class 1 to 5',
    date: 'Sep 22, 2026',
    day: 'Monday',
    time: '08:30 AM – 11:30 AM',
    subject: 'Environmental Studies / Science',
    room: 'Main Academic Wing',
    duration: '2.5 Hours',
    maxMarks: 50,
    status: 'Upcoming',
  },
  {
    id: 'tt-5',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Class 3 to 5',
    date: 'Sep 24, 2026',
    day: 'Wednesday',
    time: '08:30 AM – 11:00 AM',
    subject: 'Computer & General Knowledge',
    room: 'ICT & AV Lab',
    duration: '2.0 Hours',
    maxMarks: 50,
    status: 'Upcoming',
  },
  {
    id: 'tt-6',
    examName: 'Mid-Term Assessment 2026',
    grade: 'Playgroup to UKG',
    date: 'Sep 25, 2026',
    day: 'Thursday',
    time: '09:00 AM – 11:00 AM',
    subject: 'Art, Craft & Sensory Expression',
    room: 'Kindergarten Studio',
    duration: '2.0 Hours',
    maxMarks: 30,
    status: 'Upcoming',
  },
];

const mockStudentResults: Record<string, StudentResult> = {
  '101': {
    rollNo: '101',
    admissionNo: 'TSH-2026-101',
    studentName: 'Aarav Sharma',
    fatherName: 'Mr. Vivek Sharma',
    grade: 'Class 3',
    section: 'A',
    session: '2025-2026',
    term: 'Half Yearly Examination',
    attendance: '96.5%',
    rankInClass: '1st in Class',
    teacherRemarks: 'Outstanding intellectual curiosity, excellent logical reasoning, and helpful peer leadership in team activities.',
    subjects: [
      { name: 'English Literature & Grammar', maxMarks: 100, theoryMarks: 76, practicalMarks: 20, totalMarks: 96, grade: 'A+' },
      { name: 'Mathematics & Mental Math', maxMarks: 100, theoryMarks: 78, practicalMarks: 20, totalMarks: 98, grade: 'A+' },
      { name: 'General Science & EVS', maxMarks: 100, theoryMarks: 74, practicalMarks: 19, totalMarks: 93, grade: 'A+' },
      { name: 'Hindi Language & Varnamala', maxMarks: 100, theoryMarks: 71, practicalMarks: 19, totalMarks: 90, grade: 'A' },
      { name: 'Computer & Digital Literacy', maxMarks: 100, theoryMarks: 77, practicalMarks: 20, totalMarks: 97, grade: 'A+' },
      { name: 'General Knowledge & Moral Values', maxMarks: 50, theoryMarks: 38, practicalMarks: 10, totalMarks: 48, grade: 'A+' },
    ],
  },
  '102': {
    rollNo: '102',
    admissionNo: 'TSH-2026-102',
    studentName: 'Ananya Verma',
    fatherName: 'Mr. Rajesh Verma',
    grade: 'Class 2',
    section: 'B',
    session: '2025-2026',
    term: 'Half Yearly Examination',
    attendance: '94.0%',
    rankInClass: '2nd in Class',
    teacherRemarks: 'Brilliant artistic creativity and consistent academic diligence. Very polite and disciplined.',
    subjects: [
      { name: 'English Phonics & Reading', maxMarks: 100, theoryMarks: 73, practicalMarks: 19, totalMarks: 92, grade: 'A+' },
      { name: 'Mathematics & Numbers', maxMarks: 100, theoryMarks: 75, practicalMarks: 20, totalMarks: 95, grade: 'A+' },
      { name: 'Environmental Studies', maxMarks: 100, theoryMarks: 70, practicalMarks: 19, totalMarks: 89, grade: 'A' },
      { name: 'Hindi & Story Telling', maxMarks: 100, theoryMarks: 72, practicalMarks: 19, totalMarks: 91, grade: 'A+' },
      { name: 'Drawing & Craft Skills', maxMarks: 50, theoryMarks: 39, practicalMarks: 10, totalMarks: 49, grade: 'A+' },
    ],
  },
  '103': {
    rollNo: '103',
    admissionNo: 'TSH-2026-103',
    studentName: 'Rohan Gupta',
    fatherName: 'Mr. Sandeep Gupta',
    grade: 'Class 4',
    section: 'A',
    session: '2025-2026',
    term: 'Half Yearly Examination',
    attendance: '91.8%',
    rankInClass: '4th in Class',
    teacherRemarks: 'Active sports enthusiast with sharp analytical thinking. Shows great interest in science experiments.',
    subjects: [
      { name: 'English & Grammar', maxMarks: 100, theoryMarks: 68, practicalMarks: 18, totalMarks: 86, grade: 'A' },
      { name: 'Mathematics', maxMarks: 100, theoryMarks: 73, practicalMarks: 19, totalMarks: 92, grade: 'A+' },
      { name: 'General Science', maxMarks: 100, theoryMarks: 72, practicalMarks: 19, totalMarks: 91, grade: 'A+' },
      { name: 'Social Studies', maxMarks: 100, theoryMarks: 67, practicalMarks: 17, totalMarks: 84, grade: 'B+' },
      { name: 'Computer Studies', maxMarks: 100, theoryMarks: 74, practicalMarks: 20, totalMarks: 94, grade: 'A+' },
    ],
  },
};

export const AcademicsPage: React.FC<AcademicsPageProps> = ({
  initialTab = 'syllabus',
  onBackToHome,
  onOpenAdmission,
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'timetable' | 'results'>(initialTab);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [previewSyllabus, setPreviewSyllabus] = useState<SyllabusItem | null>(null);
  const [pdfDocuments, setPdfDocuments] = useState<AcademicPdfDocument[]>(() => getStoredPdfDocuments());

  useEffect(() => {
    const unsub = subscribeToPdfDocuments((updated) => {
      setPdfDocuments(updated);
    });
    return () => unsub();
  }, []);
  
  // Results search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedResult, setSearchedResult] = useState<StudentResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const triggerDownloadToast = (filename: string) => {
    setDownloadToast(`Downloading "${filename}"...`);
    setTimeout(() => {
      setDownloadToast(null);
    }, 3500);
  };

  const handleSearchRollNo = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('Please enter a valid Roll Number or Admission Number.');
      setSearchedResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    setTimeout(() => {
      setIsSearching(false);
      // Clean query (e.g. TSH-2026-101 -> 101 or directly 101)
      const cleanKey = query.replace(/^TSH-2026-/i, '').replace(/^roll[-_#]?/i, '').trim();
      const match = mockStudentResults[cleanKey] || mockStudentResults[query];

      if (match) {
        setSearchedResult(match);
        setSearchError(null);
      } else {
        setSearchedResult(null);
        setSearchError(`No score records found for "${query}". Try sample Roll Numbers: 101, 102, or 103 (or TSH-2026-101).`);
      }
    }, 450);
  };

  const filteredSyllabus = mockSyllabusData.filter((item) => {
    const matchesGrade = selectedGrade === 'all' || item.grade.toLowerCase().includes(selectedGrade.toLowerCase());
    const matchesTerm = selectedTerm === 'all' || item.term === selectedTerm;
    return matchesGrade && matchesTerm;
  });

  const calculateTotal = (student: StudentResult) => {
    let totalScored = 0;
    let totalMax = 0;
    student.subjects.forEach((s) => {
      totalScored += s.totalMarks;
      totalMax += s.maxMarks;
    });
    const percentage = ((totalScored / totalMax) * 100).toFixed(1);
    return { totalScored, totalMax, percentage };
  };

  return (
    <div className="bg-[#F8F9FE] min-h-screen pb-24 relative">
      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111638] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-400/30 animate-bounce">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{downloadToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#6355EE] via-[#5446e8] to-[#4839de] text-white pt-10 pb-20 px-4 sm:px-8 relative overflow-hidden">
        {/* Background Subtle Circles */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb / Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-white/40 text-xs font-bold">/</span>
            <span className="text-amber-300 text-xs font-bold">Academics & Examination</span>
          </div>

          {/* Title Area */}
          <div className="max-w-3xl">
            <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-sm border border-white/10 spotlight-text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Comprehensive Academic Portal</span>
              </div>
            </AnimatedText>
            <AnimatedText
              tag="h1"
              delay={0.15}
              distance={22}
              direction="up"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 spotlight-text-white"
            >
              Academics, Datesheets & Results
            </AnimatedText>
            <AnimatedText
              tag="p"
              delay={0.25}
              distance={18}
              direction="up"
              className="text-base sm:text-lg text-white/85 font-normal leading-relaxed spotlight-text-white"
            >
              Access up-to-date class syllabus blueprints, download upcoming examination time-tables, and securely verify student term report cards online.
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Main Filter Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-indigo-950/5 border border-indigo-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-0.5">
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'syllabus'
                  ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Curriculum & Syllabus</span>
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'timetable'
                  ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Exam Time-Table</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'results'
                  ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>Online Exam Results</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 pr-2 shrink-0">
            <GraduationCap className="w-4 h-4 text-[#6355EE]" />
            <span>Academic Session 2026–2027</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12">
        {/* ======================================================== */}
        {/* TAB 1: SYLLABUS & CURRICULUM */}
        {/* ======================================================== */}
        {activeTab === 'syllabus' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-indigo-50 shadow-sm">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#111638] leading-tight mb-1 spotlight-text-dark">
                  Class Syllabus & Study Blueprints
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 spotlight-text-slate">
                  Structured learning units, textbook chapters, and term weightage designed by educational experts.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6355EE]"
                >
                  <option value="all">All Classes</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                </select>

                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6355EE]"
                >
                  <option value="all">All Terms</option>
                  <option value="Term 1">Term 1 (April–Sept)</option>
                  <option value="Term 2">Term 2 (Oct–March)</option>
                </select>

                <button
                  onClick={() => triggerDownloadToast('Complete_Academic_Syllabus_2026-27.pdf')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ED5B2D] hover:bg-[#d94a1d] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Booklet</span>
                </button>
              </div>
            </div>

            {/* Syllabus Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSyllabus.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5 transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#6355EE] text-xs font-black">
                        {item.grade}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {item.code} • {item.term}
                      </span>
                    </div>

                    {/* Subject Title */}
                    <h3 className="text-lg font-black text-[#111638] group-hover:text-[#6355EE] transition-colors leading-snug mb-2 spotlight-text-dark">
                      {item.subject}
                    </h3>
                    <p className="text-xs text-slate-600 font-normal leading-relaxed mb-4 line-clamp-2 spotlight-text-slate">
                      {item.description}
                    </p>

                    {/* Key Topics List */}
                    <div className="space-y-1.5 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Core Syllabus Modules
                      </div>
                      {item.keyTopics.slice(0, 3).map((topic, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{topic}</span>
                        </div>
                      ))}
                      {item.keyTopics.length > 3 && (
                        <div className="text-[11px] font-bold text-[#6355EE] pt-1">
                          + {item.keyTopics.length - 3} more sub-units
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewSyllabus(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6355EE] hover:text-indigo-800 transition-colors cursor-pointer py-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => triggerDownloadToast(`${item.grade}_${item.subject}_Syllabus.pdf`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#6355EE] hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF ({item.fileSize})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EXAM TIME-TABLE */}
        {/* ======================================================== */}
        {activeTab === 'timetable' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Instructions */}
            <div className="bg-gradient-to-br from-indigo-900 to-[#6355EE] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-indigo-950/10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Official Datesheet • Mid-Term Assessment 2026</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2 spotlight-text-white">
                  Examination Schedule & Routine
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal spotlight-text-white">
                  Students are requested to be seated in their allotted examination rooms by 08:15 AM sharp with their Student ID Card and stationery pouch.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                <button
                  onClick={() => triggerDownloadToast('Mid_Term_Datesheet_2026_Official.pdf')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ED5B2D] hover:bg-[#d94a1d] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-950/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Datesheet (PDF)</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Routine</span>
                </button>
              </div>
            </div>

            {/* Official Uploaded Timetable PDF Documents */}
            {pdfDocuments.filter(d => d.category === 'timetable').length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#111638] flex items-center gap-2 spotlight-text-dark">
                    <FileText className="w-5 h-5 text-[#6355EE]" />
                    Official Downloadable Timetable PDFs
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    Published by School Examination Office
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pdfDocuments.filter(d => d.category === 'timetable').map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-white p-5 rounded-2xl border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-[10px] font-black uppercase">
                              {pdf.classGrade}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {pdf.term} • {pdf.academicYear}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-[#6355EE] transition-colors truncate">
                            {pdf.title}
                          </h4>
                          {pdf.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {pdf.description}
                            </p>
                          )}
                          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                            <span><b>Size:</b> {pdf.fileSize}</span>
                            <span>•</span>
                            <span><b>Published:</b> {pdf.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          await triggerPdfDownload(pdf);
                          triggerDownloadToast(pdf.fileName || `${pdf.title}.pdf`);
                        }}
                        className="p-2.5 rounded-xl bg-indigo-50 hover:bg-[#6355EE] text-[#6355EE] hover:text-white transition-all shrink-0 cursor-pointer shadow-xs"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time-Table Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#111638] spotlight-text-dark">
                    Upcoming Exam Timings & Venues
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    Academic Year 2026-27 • Semester 1
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Status: Published & Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-4 px-6">Date & Day</th>
                      <th className="py-4 px-6">Class / Grade</th>
                      <th className="py-4 px-6">Subject & Code</th>
                      <th className="py-4 px-6">Timings & Duration</th>
                      <th className="py-4 px-6">Room / Hall</th>
                      <th className="py-4 px-6 text-right">Max Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                    {mockTimeTableData.map((row) => (
                      <tr key={row.id} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#111638]">
                          <div>{row.date}</div>
                          <span className="text-xs font-semibold text-slate-400">{row.day}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-[#6355EE] font-bold text-xs">
                            {row.grade}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-black text-slate-800">
                          {row.subject}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 font-bold text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{row.time}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">Duration: {row.duration}</span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-600">
                          {row.room}
                        </td>
                        <td className="py-4 px-6 text-right font-black text-[#6355EE]">
                          {row.maxMarks} Marks
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exam Day Guidelines Card */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-7">
              <div className="flex items-center gap-2 text-amber-900 font-black text-base mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>Important Guidelines for Parents & Students</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-amber-900/90 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Reporting time is 08:15 AM. Late entries beyond 08:35 AM will not be permitted into the exam hall.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Original Student ID Card and Admit Card must be brought every single examination day.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>School bus transport will operate normally as per scheduled morning and afternoon routes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>For any medical leaves, an official medical certificate must be submitted to the Principal's office within 24 hours.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ONLINE EXAM RESULTS */}
        {/* ======================================================== */}
        {activeTab === 'results' && (
          <div className="space-y-8 animate-fade-in">
            {/* Search Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xl shadow-indigo-950/5">
              <div className="max-w-2xl mx-auto text-center mb-8">
                <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-[#6355EE] text-xs font-black uppercase tracking-wider mb-2 inline-block">
                  Student Verification Portal
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111638] tracking-tight leading-tight mb-2 spotlight-text-dark">
                  Check Student Term Result & Marksheet
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 spotlight-text-slate">
                  Enter your student's Roll Number or Admission Number to instantly view their detailed academic progress card.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSearchRollNo} className="max-w-xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2 rounded-2xl border-2 border-indigo-100 focus-within:border-[#6355EE] transition-all">
                  <div className="flex-1 flex items-center gap-2 px-3 w-full">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Roll No (e.g., 101, 102, 103)"
                      className="w-full bg-transparent text-sm sm:text-base font-bold text-[#111638] placeholder:text-slate-400 focus:outline-none py-2"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#6355EE] hover:bg-[#5244dc] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
                  >
                    {isSearching ? (
                      <span>Searching...</span>
                    ) : (
                      <>
                        <span>Get Result</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Helper hint */}
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400 font-semibold">
                  <span>Demo search tries:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('101');
                    }}
                    className="text-[#6355EE] hover:underline font-bold"
                  >
                    Roll 101
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('102');
                    }}
                    className="text-[#6355EE] hover:underline font-bold"
                  >
                    Roll 102
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('103');
                    }}
                    className="text-[#6355EE] hover:underline font-bold"
                  >
                    Roll 103
                  </button>
                </div>
              </form>

            {/* Error state */}
            {searchError && (
              <div className="max-w-xl mx-auto mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {/* Official Uploaded Result PDF Gazettes */}
            {pdfDocuments.filter(d => d.category === 'results').length > 0 && (
              <div className="mt-8 pt-8 border-t border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#111638] flex items-center gap-2 spotlight-text-dark">
                      <GraduationCap className="w-5 h-5 text-[#6355EE]" />
                      <span>Official Examination Result Gazettes & Promotion Lists</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Download complete verified batch result PDFs uploaded by the examination office.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pdfDocuments.filter(d => d.category === 'results').map((pdf) => (
                    <div
                      key={pdf.id}
                      className="bg-slate-50 hover:bg-indigo-50/50 p-5 rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition-all flex items-start justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                              {pdf.classGrade}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {pdf.term} • {pdf.academicYear}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-[#6355EE] transition-colors truncate">
                            {pdf.title}
                          </h4>
                          {pdf.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {pdf.description}
                            </p>
                          )}
                          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                            <span><b>Size:</b> {pdf.fileSize}</span>
                            <span>•</span>
                            <span><b>Published:</b> {pdf.uploadDate}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          await triggerPdfDownload(pdf);
                          triggerDownloadToast(pdf.fileName || `${pdf.title}.pdf`);
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-[#6355EE] text-[#6355EE] hover:text-white transition-all shrink-0 cursor-pointer shadow-xs border border-indigo-100"
                        title="Download Result PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

            {/* Display Found Marksheet */}
            {searchedResult && (
              <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-2xl shadow-indigo-950/10 overflow-hidden animate-fade-in">
                {/* Official School Header in Marksheet */}
                <div className="bg-[#6355EE] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-indigo-400/30">
                  <div className="flex items-center gap-3">
                    <img src={schoolLogo} alt="School Logo" className="h-12 w-auto max-w-[200px] object-contain" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-black leading-tight">
                        The Silver Hills School
                      </h3>
                      <p className="text-xs text-white/80 font-medium">
                        Official Academic Progress Report • {searchedResult.session}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerDownloadToast(`Report_Card_${searchedResult.studentName}.pdf`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#6355EE] hover:bg-slate-100 text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="p-4 sm:p-6 md:p-8 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Student Name</span>
                    <span className="font-black text-[#111638] text-base">{searchedResult.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Father's Name</span>
                    <span className="font-bold text-slate-700">{searchedResult.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Class & Section</span>
                    <span className="font-bold text-slate-700">{searchedResult.grade} - Section {searchedResult.section}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Roll / Adm No</span>
                    <span className="font-bold text-[#6355EE]">Roll #{searchedResult.rollNo} ({searchedResult.admissionNo})</span>
                  </div>
                </div>

                {/* Subject Marksheet Table */}
                <div className="p-4 sm:p-8 overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200">
                        <th className="py-3.5 px-4">Subject</th>
                        <th className="py-3.5 px-4 text-center">Max Marks</th>
                        <th className="py-3.5 px-4 text-center">Theory</th>
                        <th className="py-3.5 px-4 text-center">Practical / Activity</th>
                        <th className="py-3.5 px-4 text-center">Total Marks</th>
                        <th className="py-3.5 px-4 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700 font-medium">
                      {searchedResult.subjects.map((sub, sIdx) => (
                        <tr key={sIdx} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{sub.name}</td>
                          <td className="py-3.5 px-4 text-center text-slate-500">{sub.maxMarks}</td>
                          <td className="py-3.5 px-4 text-center text-slate-700">{sub.theoryMarks}</td>
                          <td className="py-3.5 px-4 text-center text-slate-700">{sub.practicalMarks}</td>
                          <td className="py-3.5 px-4 text-center font-black text-[#6355EE]">{sub.totalMarks}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Summary Totals & Remarks */}
                  {(() => {
                    const stats = calculateTotal(searchedResult);
                    return (
                      <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Aggregate Score</span>
                          <span className="text-2xl font-black text-[#6355EE]">
                            {stats.totalScored} / {stats.totalMax}
                          </span>
                        </div>

                        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Overall Percentage</span>
                          <span className="text-2xl font-black text-emerald-700">
                            {stats.percentage}%
                          </span>
                        </div>

                        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 text-center">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Class Position & Attendance</span>
                          <span className="text-base font-black text-amber-900 block mt-1">
                            {searchedResult.rankInClass} • {searchedResult.attendance}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Teacher Feedback */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Class Teacher's Evaluative Remark:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 italic font-medium">
                      "{searchedResult.teacherRemarks}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Syllabus Quick Details Modal */}
      {previewSyllabus && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-indigo-100 relative animate-fade-in">
            <button
              onClick={() => setPreviewSyllabus(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-[#6355EE] text-xs font-black">
                {previewSyllabus.grade}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {previewSyllabus.code} • {previewSyllabus.term}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#111638] mb-2">
              {previewSyllabus.subject}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              {previewSyllabus.description}
            </p>

            <div className="space-y-2 mb-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Detailed Learning Outcomes & Modules
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {previewSyllabus.keyTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-[#6355EE] shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                File format: PDF ({previewSyllabus.fileSize})
              </span>
              <button
                onClick={() => {
                  triggerDownloadToast(`${previewSyllabus.grade}_${previewSyllabus.subject}_Syllabus.pdf`);
                  setPreviewSyllabus(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6355EE] hover:bg-[#5244dc] text-white text-xs sm:text-sm font-black shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
