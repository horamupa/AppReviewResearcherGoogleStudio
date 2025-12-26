import React, { useState } from 'react';
import { analyzeAppUrl } from './services/geminiService';
import { AnalysisState, TabOption } from './types';
import { InputSection } from './components/InputSection';
import { FeatureList } from './components/FeatureList';
import { PrdView } from './components/PrdView';
import { ReviewList } from './components/ReviewList';
import { ThumbsUp, ThumbsDown, FileText, LayoutDashboard, MessageSquare, Scale } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.LIKED);

  const handleAnalyze = async (url: string) => {
    setState({ isLoading: true, error: null, result: null });
    try {
      const result = await analyzeAppUrl(url);
      setState({ isLoading: false, error: null, result });
      setActiveTab(TabOption.LIKED);
    } catch (err: any) {
      setState({
        isLoading: false,
        error: err.message || "An unexpected error occurred",
        result: null,
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header / Input Area */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 z-10">
        <InputSection onAnalyze={handleAnalyze} isLoading={state.isLoading} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          
          {/* Error State */}
          {state.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r mb-6 shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!state.result && !state.isLoading && !state.error && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <LayoutDashboard size={64} className="mb-4 opacity-50" />
              <p className="text-lg">Waiting to analyze your next target app.</p>
            </div>
          )}

          {/* Results Area */}
          {state.result && (
            <div className="flex flex-col gap-6 animate-fade-in-up pb-10">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                  Analysis Results for: <span className="text-primary">{state.result.appName}</span>
                </h2>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-1 rounded-xl bg-gray-200 p-1 self-start w-full md:w-auto">
                <button
                  onClick={() => setActiveTab(TabOption.LIKED)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    activeTab === TabOption.LIKED
                      ? 'bg-white text-green-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  }`}
                >
                  <ThumbsUp size={16} className={activeTab === TabOption.LIKED ? 'fill-current' : ''} />
                  Top Liked
                </button>
                <button
                  onClick={() => setActiveTab(TabOption.DISLIKED)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    activeTab === TabOption.DISLIKED
                      ? 'bg-white text-red-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  }`}
                >
                  <ThumbsDown size={16} className={activeTab === TabOption.DISLIKED ? 'fill-current' : ''} />
                  Most Disliked
                </button>
                <button
                  onClick={() => setActiveTab(TabOption.REVIEWS)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    activeTab === TabOption.REVIEWS
                      ? 'bg-white text-blue-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  }`}
                >
                  <MessageSquare size={16} className={activeTab === TabOption.REVIEWS ? 'fill-current' : ''} />
                  Source Reviews
                </button>
                 <button
                  onClick={() => setActiveTab(TabOption.PRD_RULES)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    activeTab === TabOption.PRD_RULES
                      ? 'bg-white text-orange-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  }`}
                >
                  <Scale size={16} className={activeTab === TabOption.PRD_RULES ? 'fill-current' : ''} />
                  PRD Rules
                </button>
                <button
                  onClick={() => setActiveTab(TabOption.PRD)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    activeTab === TabOption.PRD
                      ? 'bg-white text-purple-700 shadow'
                      : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                  }`}
                >
                  <FileText size={16} className={activeTab === TabOption.PRD ? 'fill-current' : ''} />
                  Blueprint (PRD)
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-2 min-h-[400px]">
                {activeTab === TabOption.LIKED && (
                  <FeatureList features={state.result.likedFeatures} type="LIKED" />
                )}
                {activeTab === TabOption.DISLIKED && (
                  <FeatureList features={state.result.dislikedFeatures} type="DISLIKED" />
                )}
                {activeTab === TabOption.REVIEWS && (
                  <ReviewList reviews={state.result.reviews} />
                )}
                {activeTab === TabOption.PRD_RULES && (
                  <PrdView 
                    markdown={state.result.prdRulesMarkdown} 
                    title="PRD Methodology & Rules"
                    icon={<span className="text-orange-600 text-xl">⚖️</span>}
                  />
                )}
                {activeTab === TabOption.PRD && (
                  <PrdView 
                    markdown={state.result.competitorPrdMarkdown} 
                    title="Competitor Blueprint (PRD)"
                    icon={<span className="text-purple-600 text-xl">🚀</span>}
                  />
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
