'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Bold, Italic, Link, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write content…',
  className,
  minHeight = '200px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  return (
    <div className={cn('overflow-hidden rounded-md border border-zinc-800', className)}>
      <div className="flex flex-wrap gap-1 border-b border-zinc-800 bg-zinc-900/60 p-1.5">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('bold')}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('italic')}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('insertUnorderedList')}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => exec('insertOrderedList')}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={insertLink}>
          <Link className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline
        data-placeholder={placeholder}
        onInput={handleInput}
        className="prose prose-invert max-w-none px-4 py-3 text-sm outline-none empty:before:text-zinc-500 empty:before:content-[attr(data-placeholder)]"
        style={{ minHeight }}
        suppressContentEditableWarning
      />
    </div>
  );
}
