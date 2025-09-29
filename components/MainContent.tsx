import React, { useState, useEffect, useCallback } from 'react';
import { LearningModule, GenerationResult, ModuleId, FormField } from '../types';
import { generateTerraform } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import CodeBlock from './CodeBlock';
import { InfoIcon } from './icons/InfoIcon';

interface MainContentProps {
  module: LearningModule;
}

// Chevron icon for the accordion
const ChevronIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const IntroductionContent: React.FC = () => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    return (
        <div className="space-y-6 text-gray-300">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Welcome to the Terraform AWS Learner</h2>
            <p className="text-lg">
                This interactive tool is designed to help you master AWS infrastructure as code using Terraform.
                Select a module from the sidebar to get started.
            </p>
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-gray-100 mb-3">How it works:</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                    <li><span className="font-semibold text-gray-300">Select a Module:</span> Choose an AWS service you want to learn about from the left sidebar.</li>
                    <li><span className="font-semibold text-gray-300">Configure Options:</span> Fill in the simple form with your desired settings.</li>
                    <li><span className="font-semibold text-gray-300">Generate Code:</span> Click the "Generate" button.</li>
                    <li><span className="font-semibold text-gray-300">Learn & Explore:</span> Our AI will generate the Terraform code and a detailed explanation of how it works.</li>
                </ol>
            </div>

            {/* Accordion Section */}
            <div className="border border-gray-700 rounded-lg">
                <button
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    className="w-full flex justify-between items-center p-4 bg-gray-800 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-t-lg"
                    aria-expanded={isAccordionOpen}
                    aria-controls="terraform-explanation"
                >
                    <span className="text-lg font-semibold text-gray-100">What is Terraform?</span>
                    <ChevronIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isAccordionOpen ? 'rotate-180' : ''}`} />
                </button>
                {isAccordionOpen && (
                    <div id="terraform-explanation" className="p-6 bg-gray-800/50 border-t border-gray-700 text-gray-400 space-y-4 rounded-b-lg">
                        <p>
                            Terraform is an open-source <strong className="text-cyan-300">Infrastructure as Code (IaC)</strong> tool created by HashiCorp. It allows you to define and provision data center infrastructure using a high-level configuration language known as HashiCorp Configuration Language (HCL).
                        </p>
                        <h4 className="text-md font-semibold text-gray-200">Key Benefits for AWS:</h4>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong className="text-gray-300">Declarative Syntax:</strong> You describe the desired *end state* of your infrastructure, and Terraform figures out how to create, update, or delete resources to reach that state.</li>
                            <li><strong className="text-gray-300">State Management:</strong> Terraform keeps a state file to track your managed resources, making it easy to see changes and manage dependencies.</li>
                            <li><strong className="text-gray-300">Execution Plans:</strong> Run `terraform plan` to see exactly what changes will be made before you apply them, reducing the risk of errors.</li>
                            <li><strong className="text-gray-300">Reproducibility:</strong> Since your infrastructure is defined in code, you can easily replicate environments (e.g., development, staging, production) consistently and reliably.</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const ModuleContent: React.FC<{ module: LearningModule }> = ({ module }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Initialize form data when module changes
  useEffect(() => {
    const initialFormData = module.fields?.reduce((acc, field) => {
      acc[field.id] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, string>) || {};
    setFormData(initialFormData);
    setGenerationResult(null); // Clear previous results
    setError(null);
    setFormErrors({});
  }, [module]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (formErrors[name]) {
        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/;

    module.fields?.forEach(field => {
        const value = formData[field.id]?.trim();

        if (!value) {
            errors[field.id] = `${field.label} is required.`;
        } else if ((module.id === ModuleId.VPC || module.id === ModuleId.VPC_SUBNET) && field.id.includes('cidr_block')) {
            if (!cidrRegex.test(value)) {
                errors[field.id] = 'Invalid CIDR format (e.g., 10.0.0.0/16).';
            }
        }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationResult(null);
    try {
      const result = await generateTerraform(module, formData);
      setGenerationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [module, formData]);


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-100">{module.title}</h2>
        <p className="mt-1 text-gray-400">{module.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {module.fields?.map((field) => (
                <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-1">
                    {field.label}
                </label>
                {field.type === 'select' ? (
                    <select
                    id={field.id}
                    name={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${formErrors[field.id] ? 'border-red-500' : 'border-gray-600'}`}
                    >
                    {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                    </select>
                ) : (
                    <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 border rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 ${formErrors[field.id] ? 'border-red-500' : 'border-gray-600'}`}
                    />
                )}
                {field.info && (
                    <p className="mt-2 text-xs text-gray-400 flex items-start">
                        <InfoIcon className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" />
                        <span>{field.info}</span>
                    </p>
                )}
                {formErrors[field.id] && (
                    <p className="mt-1 text-xs text-red-400">{formErrors[field.id]}</p>
                )}
                </div>
            ))}
        </div>
        <div className="pt-2">
            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Code & Explanation'}
            </button>
        </div>
      </form>

      {isLoading && <LoadingSpinner />}
      
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {generationResult && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">Generated Terraform Code</h3>
            <CodeBlock code={generationResult.code} />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">Explanation</h3>
            <div
              className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-gray-300"
            >
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {generationResult.explanation}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const MainContent: React.FC<MainContentProps> = ({ module }) => {
  return (
    <div className="p-6 md:p-10">
      {module.id === ModuleId.INTRODUCTION ? (
        <IntroductionContent />
      ) : (
        <ModuleContent module={module} />
      )}
    </div>
  );
};

export default MainContent;