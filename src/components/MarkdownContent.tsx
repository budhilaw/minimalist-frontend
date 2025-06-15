import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-[rgb(var(--color-foreground))] mb-6 mt-0 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-[rgb(var(--color-foreground))] mb-4 mt-8 pb-2 border-b border-[rgb(var(--color-border))] first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-[rgb(var(--color-foreground))] mb-3 mt-6 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-2 mt-4 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold text-[rgb(var(--color-foreground))] mb-2 mt-3 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold text-[rgb(var(--color-foreground))] mb-2 mt-3 first:mt-0">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-[rgb(var(--color-muted-foreground))] leading-relaxed mb-4 last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-[rgb(var(--color-foreground))]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[rgb(var(--color-foreground))]">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 pl-4 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[rgb(var(--color-muted-foreground))] leading-relaxed">
              {children}
            </li>
          ),
          code: ({ children, ...props }) => {
            const isInline = !props.className?.includes('language-');
            if (isInline) {
              return (
                <code className="bg-[rgb(var(--color-muted))] text-[rgb(var(--color-primary))] px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] p-4 rounded-lg text-sm font-mono overflow-x-auto border border-[rgb(var(--color-border))] mb-4">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[rgb(var(--color-muted))] text-[rgb(var(--color-foreground))] p-4 rounded-lg text-sm font-mono overflow-x-auto border border-[rgb(var(--color-border))] mb-6">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[rgb(var(--color-primary))] pl-4 py-2 my-4 bg-[rgb(var(--color-muted))] rounded-r italic text-[rgb(var(--color-muted-foreground))]">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(var(--color-primary))] underline decoration-2 underline-offset-2 hover:text-[rgb(var(--color-primary))]/80 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-lg shadow-lg mb-6 border border-[rgb(var(--color-border))] max-w-full h-auto"
            />
          ),
          hr: () => (
            <hr className="border-[rgb(var(--color-border))] my-8" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full border-collapse border border-[rgb(var(--color-border))] rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[rgb(var(--color-muted))]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-[rgb(var(--color-border))]">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="border border-[rgb(var(--color-border))] px-4 py-2 text-left font-semibold text-[rgb(var(--color-foreground))]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[rgb(var(--color-border))] px-4 py-2 text-[rgb(var(--color-muted-foreground))]">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 