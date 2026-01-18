import '@/components/app/editor/tiptap/tiptap.css';

import { useEffect, useRef, useState } from 'react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import js from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { createLowlight } from 'lowlight';
import ImageResize from 'tiptap-extension-resize-image';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/common/scroll-area';
import { CodeBlockView } from '@/components/app/editor/tiptap/code-block-view';
import { Toolbar } from '@/components/app/editor/tiptap/toolbar';

const lowlight = createLowlight();
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('javascript', js);
lowlight.register('typescript', ts);
lowlight.register('json', json);
lowlight.register('python', python);
lowlight.register('rust', rust);
lowlight.register('go', go);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('c', c);
lowlight.register('cpp', cpp);
lowlight.register('csharp', csharp);
lowlight.register('java', java);
lowlight.register('yaml', yaml);

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readonly?: boolean;
}

export function RichTextEditor({
  content,
  onContentChange,
  placeholder = 'Enter text...',
  className,
  readonly = false,
}: RichTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    editable: !readonly && isEditing,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: {
          openOnClick: true,
        },
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: false,
      }),
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      ImageResize.configure({
        allowBase64: true,
        resize: {
          enabled: true,
          alwaysPreserveAspectRatio: true,
        },
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (target.closest('[data-radix-popper-content-wrapper]')) {
          return;
        }

        setIsEditing(false);
        editor?.setEditable(false);
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, editor]);

  const handleContainerClick = () => {
    if (!readonly && !isEditing && editor) {
      setIsEditing(true);
      editor.setEditable(true);
      editor.commands.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={cn(
        'flex flex-col ',
        isEditing
          ? 'border rounded-md bg-background shadow-sm'
          : cn('border border-transparent bg-transparent rounded-md', !readonly && 'cursor-text hover:bg-card'),
        className
      )}
    >
      {isEditing && !readonly && <Toolbar editor={editor} />}
      <ScrollArea className={cn('p-2', isEditing && !readonly ? 'h-[calc(100%-2.5rem)]' : 'h-full')}>
        <EditorContent editor={editor} className="flex-1" />
      </ScrollArea>
    </div>
  );
}
