import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Icon } from '@iconify/react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your post...",
  minHeight = "400px"
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Get current cursor position
  const getCursorPosition = () => {
    if (!textareaRef.current) return { start: 0, end: 0 };
    return {
      start: textareaRef.current.selectionStart,
      end: textareaRef.current.selectionEnd
    };
  };

  // Set cursor position
  const setCursorPosition = (start: number, end?: number) => {
    if (!textareaRef.current) return;
    textareaRef.current.setSelectionRange(start, end || start);
    textareaRef.current.focus();
  };

  // Insert text at cursor position
  const insertText = useCallback((before: string, after: string = '', defaultText: string = '') => {
    if (!textareaRef.current) return;

    const { start, end } = getCursorPosition();
    const selectedText = value.substring(start, end);
    const textToWrap = selectedText || defaultText;
    
    const newText = value.substring(0, start) + before + textToWrap + after + value.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToWrap.length + after.length;
      setCursorPosition(newCursorPos);
    }, 0);
  }, [value, onChange]);

  // Insert text at beginning of line(s)
  const insertLinePrefix = useCallback((prefix: string) => {
    if (!textareaRef.current) return;

    const { start, end } = getCursorPosition();
    const lines = value.split('\n');
    let currentPos = 0;
    let startLine = 0;
    let endLine = 0;

    // Find which lines are selected
    for (let i = 0; i < lines.length; i++) {
      if (currentPos <= start && start <= currentPos + lines[i].length) {
        startLine = i;
      }
      if (currentPos <= end && end <= currentPos + lines[i].length) {
        endLine = i;
        break;
      }
      currentPos += lines[i].length + 1; // +1 for newline
    }

    // Apply prefix to selected lines
    for (let i = startLine; i <= endLine; i++) {
      if (lines[i].startsWith(prefix)) {
        lines[i] = lines[i].substring(prefix.length);
      } else {
        lines[i] = prefix + lines[i];
      }
    }

    onChange(lines.join('\n'));
  }, [value, onChange]);

  // Markdown formatting functions
  const formatBold = () => insertText('**', '**', 'bold text');
  const formatItalic = () => insertText('*', '*', 'italic text');
  const formatCode = () => insertText('`', '`', 'code');
  const formatCodeBlock = () => insertText('\n```\n', '\n```\n', 'code block');
  const formatQuote = () => insertLinePrefix('> ');
  const formatH1 = () => insertLinePrefix('# ');
  const formatH2 = () => insertLinePrefix('## ');
  const formatH3 = () => insertLinePrefix('### ');
  const formatUnorderedList = () => insertLinePrefix('- ');
  const formatOrderedList = () => insertLinePrefix('1. ');

  // Insert link
  const insertLink = () => {
    if (linkUrl.trim()) {
      const linkMarkdown = `[${linkText || 'link text'}](${linkUrl})`;
      insertText(linkMarkdown);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  // Render markdown preview
  const renderMarkdownPreview = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Handle headings
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-[rgb(var(--color-foreground))]">
            {paragraph.substring(2)}
          </h1>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-[rgb(var(--color-foreground))]">
            {paragraph.substring(3)}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-[rgb(var(--color-foreground))]">
            {paragraph.substring(4)}
          </h3>
        );
      }

      // Handle code blocks
      if (paragraph.startsWith('```')) {
        const lines = paragraph.split('\n');
        const language = lines[0].substring(3);
        const code = lines.slice(1, -1).join('\n');
        return (
          <div key={index} className="my-4">
            <pre className="bg-[rgb(var(--color-muted))] p-4 rounded-lg overflow-x-auto border border-[rgb(var(--color-border))]">
              <code className="text-sm text-[rgb(var(--color-foreground))]">
                {code}
              </code>
            </pre>
          </div>
        );
      }

      // Handle blockquotes
      if (paragraph.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-[rgb(var(--color-primary))] pl-4 my-4 italic text-[rgb(var(--color-muted-foreground))]">
            {paragraph.substring(2)}
          </blockquote>
        );
      }

      // Handle lists
      if (paragraph.includes('- ') || paragraph.includes('1. ')) {
        const items = paragraph.split('\n').filter(line => line.trim());
        const isOrdered = items[0]?.match(/^\d+\./);
        
        return React.createElement(
          isOrdered ? 'ol' : 'ul',
          { 
            key: index, 
            className: `my-4 ${isOrdered ? 'list-decimal' : 'list-disc'} list-inside space-y-1` 
          },
          items.map((item, idx) => (
            <li key={idx} className="text-[rgb(var(--color-muted-foreground))]">
              {item.replace(/^[\d\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}
            </li>
          ))
        );
      }

      // Regular paragraphs
      if (paragraph.trim() && !paragraph.startsWith('---')) {
        const formattedText = paragraph
          .replace(/\*\*(.*?)\*\*/g, '<strong className="font-semibold text-[rgb(var(--color-foreground))]">$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code className="bg-[rgb(var(--color-muted))] px-1 py-0.5 rounded text-sm">$1</code>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" className="text-[rgb(var(--color-primary))] underline">$1</a>');

        return (
          <p 
            key={index} 
            className="mb-4 text-[rgb(var(--color-muted-foreground))] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }

      return null;
    });
  };

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    active?: boolean;
  }> = ({ onClick, icon, title, active }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        active
          ? 'bg-[rgb(var(--color-primary))] text-white'
          : 'text-[rgb(var(--color-muted-foreground))] hover:text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))]'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <>
      <div className="markdown-editor border border-[rgb(var(--color-border))] rounded-lg overflow-hidden bg-[rgb(var(--color-background))]">
        {/* Toolbar */}
        <div className="border-b border-[rgb(var(--color-border))] p-3 bg-[rgb(var(--color-muted))]">
          <div className="flex flex-wrap items-center gap-1">
            {/* Text Formatting */}
            <div className="flex items-center gap-1 mr-3">
              <ToolbarButton
                onClick={formatBold}
                icon={<Icon icon="lucide:bold" width={16} height={16} />}
                title="Bold (**text**)"
              />
              <ToolbarButton
                onClick={formatItalic}
                icon={<Icon icon="lucide:italic" width={16} height={16} />}
                title="Italic (*text*)"
              />
              <ToolbarButton
                onClick={formatCode}
                icon={<Icon icon="lucide:code" width={16} height={16} />}
                title="Inline Code (`code`)"
              />
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 mr-3">
              <ToolbarButton
                onClick={formatH1}
                icon={<Icon icon="lucide:type" width={16} height={16} />}
                title="Heading 1 (# text)"
              />
              <ToolbarButton
                onClick={formatH2}
                icon={<Icon icon="lucide:type" width={14} height={14} />}
                title="Heading 2 (## text)"
              />
              <ToolbarButton
                onClick={formatH3}
                icon={<Icon icon="lucide:type" width={12} height={12} />}
                title="Heading 3 (### text)"
              />
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1 mr-3">
              <ToolbarButton
                onClick={formatUnorderedList}
                icon={<Icon icon="lucide:list" width={16} height={16} />}
                title="Bullet List (- item)"
              />
              <ToolbarButton
                onClick={formatOrderedList}
                icon={<Icon icon="lucide:list-ordered" width={16} height={16} />}
                title="Numbered List (1. item)"
              />
            </div>

            {/* Special Formatting */}
            <div className="flex items-center gap-1 mr-3">
              <ToolbarButton
                onClick={formatQuote}
                icon={<Icon icon="lucide:quote" width={16} height={16} />}
                title="Quote (> text)"
              />
              <ToolbarButton
                onClick={formatCodeBlock}
                icon={<Icon icon="lucide:code" width={16} height={16} />}
                title="Code Block (```)"
              />
            </div>

            {/* Links */}
            <div className="flex items-center gap-1 mr-3">
              <ToolbarButton
                onClick={() => setShowLinkDialog(true)}
                icon={<Icon icon="lucide:link" width={16} height={16} />}
                title="Insert Link"
              />
            </div>

            {/* Preview Toggle */}
            <div className="flex items-center gap-1 ml-auto">
              <ToolbarButton
                onClick={() => setShowPreview(!showPreview)}
                icon={<Icon icon="lucide:eye" width={16} height={16} />}
                title={showPreview ? "Edit" : "Preview"}
                active={showPreview}
              />
            </div>
          </div>
        </div>

        {/* Editor/Preview Content */}
        <div className="relative" style={{ minHeight }}>
          {!showPreview ? (
            // Markdown Editor
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full p-4 bg-transparent border-none outline-none resize-none text-[rgb(var(--color-foreground))] font-mono text-sm leading-relaxed"
              style={{ minHeight }}
              placeholder={placeholder}
            />
          ) : (
            // Markdown Preview
            <div className="p-4 prose prose-lg max-w-none" style={{ minHeight }}>
              {value ? (
                <div className="text-[rgb(var(--color-foreground))] leading-relaxed">
                  {renderMarkdownPreview(value)}
                </div>
              ) : (
                <p className="text-[rgb(var(--color-muted-foreground))] italic">
                  No content to preview...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[rgb(var(--color-card))] p-6 rounded-lg border border-[rgb(var(--color-border))] w-full max-w-md">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-foreground))] mb-4">
                Insert Link
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                    Link Text
                  </label>
                  <input
                    type="text"
                    placeholder="Enter link text..."
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[rgb(var(--color-foreground))] mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="Enter URL..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-[rgb(var(--color-border))] rounded-md bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        insertLink();
                      } else if (e.key === 'Escape') {
                        setShowLinkDialog(false);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 border border-[rgb(var(--color-border))] text-[rgb(var(--color-foreground))] rounded-md hover:bg-[rgb(var(--color-muted))]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={insertLink}
                  className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-md hover:bg-[rgb(var(--color-primary))]/90"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 