import '@/components/app/editor/tiptap/tiptap.css';

import { useEffect, useRef, useState } from 'react';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import { Highlight } from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/common/scroll-area';
import { Toolbar } from '@/components/app/editor/tiptap/toolbar';

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
        link: {
          openOnClick: true,
        },
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
      Highlight,
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
