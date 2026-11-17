import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSectionCards } from './components/AboutSectionCards';
import { AboutAdmission } from './components/AboutAdmission';
import { LeadershipMessagesPage } from './components/LeadershipMessagesPage';
import { GalleryPage } from './components/GalleryPage';
import { AcademicsPage } from './components/AcademicsPage';
import { FacilitiesPage } from './components/FacilitiesPage';
import { LearningPrograms } from './components/LearningPrograms';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TeachersSection } from './components/TeachersSection';
import { StatsBanner } from './components/StatsBanner';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PartnerLogos } from './components/PartnerLogos';
import { QuickContactSection } from './components/QuickContactSection';
import { BlogNewsSection } from './components/BlogNewsSection';
import { Footer } from './components/Footer';
import { VideoModal, AdmissionModal, SearchModal } from './components/InteractiveModals';
import { AdminUpdateModal } from './components/AdminUpdateModal';
import { TextHoverHighlight } from './components/TextHoverHighlight';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'leadership-messages' | 'gallery' | 'academics' | 'facilities'
  >('home');
  const [academicsSubTab, setAcademicsSubTab] = useState<'syllabus' | 'timetable' | 'results'>('syllabus');
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string>('all');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('Preschool (02-03 years)');

  const handleOpenAdmissionWithProgram = (progTitle: string) => {
    setSelectedProgram(progTitle);
    setAdmissionModalOpen(true);
  };

  const handleOpenMessagesPage = (authorityId?: string) => {
    setSelectedAuthorityId(authorityId || 'all');
    setCurrentPage('leadership-messages');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenGalleryPage = () => {
    setCurrentPage('gallery');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAcademicsPage = (subTab?: 'syllabus' | 'timetable' | 'results') => {
    setAcademicsSubTab(subTab || 'syllabus');
    setCurrentPage('academics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFacilitiesPage = () => {
    setCurrentPage('facilities');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white text-slate-800 font-sans selection:bg-[#6355EE] selection:text-white flex flex-col">
      {/* 1. Top Orange Header Bar */}
      <TopBar
        onLearnMoreClick={handleLearnMore}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />

      {/* 2. Main Purple Navbar with Logo, Navigation Links, Search, and CTA */}
      <Navbar
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateGallery={handleOpenGalleryPage}
        onNavigateAcademics={handleOpenAcademicsPage}
        onNavigateFacilities={handleOpenFacilitiesPage}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmission={() => {
          setSelectedProgram('Preschool (02-03 years)');
          setAdmissionModalOpen(true);
        }}
      />

      {/* Main Content: Switches between Pages */}
      <main className="flex-1">
        {currentPage === 'leadership-messages' ? (
          <LeadershipMessagesPage
            initialAuthorityId={selectedAuthorityId}
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={() => {
              setSelectedProgram('General Inquiry / Leadership Desk');
              setAdmissionModalOpen(true);
            }}
          />
        ) : currentPage === 'gallery' ? (
          <GalleryPage
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={() => {
              setSelectedProgram('School Admissions / Gallery Visit');
              setAdmissionModalOpen(true);
            }}
          />
        ) : currentPage === 'academics' ? (
          <AcademicsPage
            initialTab={academicsSubTab}
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={() => {
              setSelectedProgram('Academic Inquiry / Admission 2026');
              setAdmissionModalOpen(true);
            }}
          />
        ) : currentPage === 'facilities' ? (
          <FacilitiesPage
            onBackToHome={() => {
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={() => {
              setSelectedProgram('Campus Visit / Facility Tour');
              setAdmissionModalOpen(true);
            }}
          />
        ) : (
          <>
            {/* 3. Hero Section: Boy with Books, Yellow Rings, Doodles, and CTAs */}
            <HeroSection
              onOpenAdmission={() => setAdmissionModalOpen(true)}
              onOpenVideo={() => setVideoModalOpen(true)}
            />

            {/* 4. About Section with 4 Cards: Our Mission, Our Vision, Today's Thought, News & Events */}
            <AboutSectionCards
              onOpenAdmission={() => setAdmissionModalOpen(true)}
              onOpenAdminModal={() => setAdminModalOpen(true)}
              onOpenEventModal={(eventTitle) => {
                setSelectedProgram(eventTitle);
                setAdmissionModalOpen(true);
              }}
            />

            {/* 5. About / Message from School Authorities Section */}
            <AboutAdmission
              onOpenAdmission={() => setAdmissionModalOpen(true)}
              onOpenMessagesPage={handleOpenMessagesPage}
              onOpenVideo={() => setVideoModalOpen(true)}
            />

            {/* 6. Learning Programs / Classes: Sensory Play, Reading & Phonics, Math & Numbers */}
            <LearningPrograms onJoinClass={handleOpenAdmissionWithProgram} />

            {/* 7. Why Choose Us: Creativity (90%), Experiences (70%), Hot Air Balloon */}
            <WhyChooseUs onOpenAdmission={() => setAdmissionModalOpen(true)} />

            {/* 8. Meet Our Caring Teachers: 3 Teachers with Yellow Ring Frames */}
            <TeachersSection />

            {/* 9. Purple Stats Banner: 27+ Years, 6500+ Classes, 100+ Instructors, 6549+ Students */}
            <StatsBanner />

            {/* 10. Testimonials: Loved by Parents, Enjoyed by Kids (Interactive Slider) */}
            <TestimonialsSection />

            {/* 11. Partner Brand Logos */}
            <PartnerLogos />

            {/* 12. Quick Contact for Parents with Director Quote and Contact Form */}
            <QuickContactSection />

            {/* 13. Functions & Activities Continuous Sliding Gallery */}
            <BlogNewsSection
              onViewAll={handleOpenGalleryPage}
              onReadArticle={(title) => {
                handleOpenGalleryPage();
              }}
            />
          </>
        )}
      </main>

      {/* 14. Footer with Brand, Contact Information, Links, and Whimsical Landscape Illustration */}
      <Footer
        onNavigateHome={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateAcademics={handleOpenAcademicsPage}
        onNavigateFacilities={handleOpenFacilitiesPage}
        onNavigateGallery={handleOpenGalleryPage}
      />

      {/* Interactive Modals */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onOpenAdmin={() => {
          setVideoModalOpen(false);
          setAdminModalOpen(true);
        }}
      />

      <AdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        defaultProgram={selectedProgram}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Staff Daily Updates Manager Modal */}
      <AdminUpdateModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />

      {/* Interactive Text Hover Highlight Circle */}
      <TextHoverHighlight />
    </div>
  );
}
