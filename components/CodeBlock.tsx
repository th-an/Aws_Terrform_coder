import React, { useState, useEffect, useRef } from 'react';
import { CopyIcon } from './icons/CopyIcon';

// Add hljs to the window interface to avoid TypeScript errors
declare global {
  interface Window {
    hljs: any;
  }
}

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Ensure hljs is loaded and the ref is attached
    if (codeRef.current && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
        aria-label="Copy code"
      >
        {isCopied ? (
            <span className="text-sm">Copied!</span>
        ) : (
            <CopyIcon className="w-5 h-5" />
        )}
      </button>
      <pre className="p-4 text-sm overflow-x-auto">
        {/* The language-terraform class enables HCL syntax highlighting */}
        <code ref={codeRef} className="language-terraform">
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;