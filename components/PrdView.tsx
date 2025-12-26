import React from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface PrdViewProps {
  markdown: string;
  title?: string;
  icon?: React.ReactNode;
}

export const PrdView: React.FC<PrdViewProps> = ({ 
  markdown, 
  title = "Opportunity Analysis & PRD",
  icon = <span className="text-purple-600 text-xl">🚀</span>
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-gray-900 pb-2 border-b">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3 text-gray-800">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-gray-800">{line.replace('### ', '')}</h3>;
      if (line.startsWith('#### ')) return <h4 key={i} className="text-lg font-semibold mt-3 mb-1 text-gray-800">{line.replace('#### ', '')}</h4>;
      
      if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc pl-1 mb-1 text-gray-700">{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
      if (line.trim().match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal pl-1 mb-1 text-gray-700">{line.replace(/^\d+\. /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>;
      if (line.trim().startsWith('> ')) return <blockquote key={i} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">{line.replace('> ', '')}</blockquote>;

      if (line.trim() === '') return <br key={i} />;
      
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      return (
        <p key={i} className="mb-2 text-gray-700 leading-relaxed">
          {parts.map((part, j) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="text-gray-900">{part.slice(2, -2)}</strong>;
             }
             if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={j} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-500">{part.slice(1, -1)}</code>;
             }
             return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          {icon} {title}
        </h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      
      <div className="p-8 bg-white overflow-y-auto markdown-body flex-grow">
        <div className="prose max-w-none">
          {renderContent(markdown)}
        </div>
      </div>
    </div>
  );
};
