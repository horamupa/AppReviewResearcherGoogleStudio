import React from 'react';
import { Copy, Check } from 'lucide-react';

interface PrdViewProps {
  markdown: string;
}

export const PrdView: React.FC<PrdViewProps> = ({ markdown }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple formatter to make markdown look decent without external heavy libs for this specific scope
  // Handling headers, bolding, lists for a clean read.
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-gray-900 pb-2 border-b">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-gray-800">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-gray-800">{line.replace('### ', '')}</h3>;
      
      // List items
      if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc pl-1 mb-1 text-gray-700">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
      if (line.trim().match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal pl-1 mb-1 text-gray-700">{line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
      
      // Empty lines
      if (line.trim() === '') return <br key={i} />;
      
      // Regular text with bold support
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-2 text-gray-700 leading-relaxed">
          {parts.map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="text-gray-900">{part.slice(2, -2)}</strong>;
             }
             return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="text-purple-600">🚀</span> Opportunity Analysis & PRD
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy PRD'}
        </button>
      </div>
      
      <div className="p-8 bg-white max-h-[600px] overflow-y-auto markdown-body">
        <div className="prose max-w-none">
          {renderContent(markdown)}
        </div>
      </div>
    </div>
  );
};
