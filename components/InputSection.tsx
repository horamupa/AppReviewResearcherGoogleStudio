import React, { useState } from 'react';
import { Search, Loader2, Link as LinkIcon } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            App Store Analyst
          </h1>
          <p className="text-gray-500 text-lg">
            Paste an App Store link to uncover user sentiment and generate a winning strategy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 pointer-events-none">
            <LinkIcon size={20} />
          </div>
          <input
            type="url"
            placeholder="https://apps.apple.com/us/app/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
            className="w-full pl-12 pr-36 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-700 placeholder-gray-400 text-lg"
          />
          <div className="absolute right-2 top-2 bottom-2">
            <button
              type="submit"
              disabled={isLoading || !url}
              className={`h-full px-6 rounded-lg font-semibold text-white transition-all flex items-center gap-2 ${
                isLoading || !url
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-blue-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Analyzing</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        {isLoading && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400 animate-pulse">
              Reading reviews, identifying patterns, and formulating strategy...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
