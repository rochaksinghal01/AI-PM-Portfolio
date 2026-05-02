import { useState } from 'react';
import { FloatingButton } from '@/components/kyo/FloatingButton';
import { KyoPopup } from '@/components/kyo/KyoPopup';
import { TeamsHomeDemo } from '@/components/entry-points/TeamsHomeDemo';
import { TeamsChatDemo } from '@/components/entry-points/TeamsChatDemo';
import { MeetingDemo } from '@/components/entry-points/MeetingDemo';
import { GmailDemo } from '@/components/entry-points/GmailDemo';
import { HuddleDemo } from '@/components/entry-points/HuddleDemo';
import { currentUser, teamQuestions } from '@/data/mockData';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">K</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Ask Kyo</h1>
              <p className="text-xs text-muted-foreground">AI Assistant Prototype</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Click any <span className="font-semibold text-primary">K</span> button to open Ask Kyo
          </p>
        </div>
      </header>

      {/* Entry Points Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">Entry Points</h2>
          <p className="text-sm text-muted-foreground">
            Ask Kyo lives natively inside Microsoft Teams and Gmail. Click the floating buttons to interact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teams Home */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(252,59%,50%)]" />
              Teams Home Screen
            </h3>
            <TeamsHomeDemo onFloatingClick={handleOpenPopup} />
          </div>

          {/* Teams Chat */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(252,59%,50%)]" />
              Teams Chat (Companion Mode)
            </h3>
            <TeamsChatDemo onFloatingClick={handleOpenPopup} />
          </div>

          {/* Meeting */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(252,59%,50%)]" />
              Teams Meeting
            </h3>
            <MeetingDemo onFloatingClick={handleOpenPopup} />
          </div>

          {/* Huddle */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(252,59%,50%)]" />
              Huddle Mode
            </h3>
            <HuddleDemo onFloatingClick={handleOpenPopup} />
          </div>

          {/* Gmail */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Gmail Sidebar
            </h3>
            <GmailDemo onFloatingClick={handleOpenPopup} />
          </div>
        </div>
      </main>

      {/* Global Floating Button */}
      <FloatingButton onClick={() => setIsPopupOpen(!isPopupOpen)} isOpen={isPopupOpen} />

      {/* Popup */}
      <KyoPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        user={currentUser}
        questions={teamQuestions[currentUser.team]}
      />

      <Toaster />
    </div>
  );
};

export default Index;
