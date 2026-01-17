import * as React from 'react';
import { useEditorState, type Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { ButtonGroup } from '@/components/common/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
import { Input } from '@/components/common/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/popover';
import { Toggle } from '@/components/common/toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip';

interface ToolbarButtonProps extends React.ComponentProps<typeof Button> {
  tooltip: string;
}

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ tooltip, children, className, ...props }, ref) => {
    return (
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Button ref={ref} variant="outline" size="icon-sm" className={className} {...props}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
);
ToolbarButton.displayName = 'ToolbarButton';

interface ToolbarToggleProps extends React.ComponentProps<typeof Toggle> {
  tooltip: string;
}

const ToolbarToggle = React.forwardRef<HTMLButtonElement, ToolbarToggleProps>(
  ({ tooltip, pressed, onPressedChange, children, className, ...props }, ref) => {
    return (
      <Tooltip delayDuration={1000}>
        <TooltipTrigger asChild>
          <Toggle
            {...props}
            ref={ref}
            data-state={pressed ? 'on' : 'off'}
            pressed={pressed}
            onPressedChange={onPressedChange}
            className={className}
            size="icon-sm"
            variant="outline"
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
);
ToolbarToggle.displayName = 'ToolbarToggle';

const HEADINGS = [
  { level: 1, label: 'Heading 1', icon: Heading1 },
  { level: 2, label: 'Heading 2', icon: Heading2 },
  { level: 3, label: 'Heading 3', icon: Heading3 },
  { level: 4, label: 'Heading 4', icon: Heading4 },
] as const;

const LIST_TYPES = [
  { name: 'bulletList', label: 'Bulleted List', icon: List },
  { name: 'orderedList', label: 'Numbered List', icon: ListOrdered },
  { name: 'taskList', label: 'Check List', icon: ListChecks },
] as const;

const FONT_FAMILIES = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Courier New', value: 'Courier New' },
];

export function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
      heading: HEADINGS.find(({ level }) => ctx.editor.isActive('heading', { level }))?.label ?? 'Paragraph',
      activeList: LIST_TYPES.find(({ name }) => ctx.editor.isActive(name)),
      fontFamily: ctx.editor.getAttributes('textStyle').fontFamily,
      isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
      isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
      isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
      isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
      isBold: ctx.editor.isActive('bold'),
      isItalic: ctx.editor.isActive('italic'),
      isUnderline: ctx.editor.isActive('underline'),
      isStrike: ctx.editor.isActive('strike'),
      isQuote: ctx.editor.isActive('blockquote'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isLink: ctx.editor.isActive('link'),
      isHighlight: ctx.editor.isActive('highlight'),
      isCode: ctx.editor.isActive('code'),
      isImage: ctx.editor.isActive('image'),
      linkUrl: ctx.editor.getAttributes('link').href || '',
    }),
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!editor || !state) {
    return null;
  }

  const getFontLabel = () => {
    if (!state.fontFamily) return 'Arial';
    const font = FONT_FAMILIES.find((f) => state.fontFamily === f.value);
    return font ? font.label : 'Arial';
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 border-b">
      <ButtonGroup>
        <ToolbarButton tooltip="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton tooltip="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
          <Redo size={16} />
        </ToolbarButton>
      </ButtonGroup>

      <ButtonGroup>
        <DropdownMenu modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7">
                  <span className="truncate">{state.heading}</span>
                  <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
              Text Style
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="min-w-48" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn('text-sm', state.heading === 'Paragraph' && 'bg-accent')}
            >
              <Pilcrow className="h-4 w-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            {HEADINGS.map(({ level, label, icon: Icon }) => (
              <DropdownMenuItem
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level: level }).run()}
                className={cn('text-sm', state.heading === label && 'bg-accent')}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <ButtonGroup>
        <DropdownMenu modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7">
                  <div className="flex items-center gap-2 truncate">
                    {state.activeList ? (
                      <>
                        <state.activeList.icon className="h-4 w-4 shrink-0" />
                      </>
                    ) : (
                      <>
                        <List className="h-4 w-4 shrink-0" />
                      </>
                    )}
                  </div>
                  <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
              Lists
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="min-w-40" onCloseAutoFocus={(e) => e.preventDefault()}>
            {LIST_TYPES.map(({ name, label, icon: Icon }) => (
              <DropdownMenuItem
                key={name}
                onClick={() => {
                  if (name === 'bulletList') editor.chain().focus().toggleBulletList().run();
                  if (name === 'orderedList') editor.chain().focus().toggleOrderedList().run();
                  if (name === 'taskList') editor.chain().focus().toggleTaskList().run();
                }}
                className={cn('text-sm', state.activeList?.name === name && 'bg-accent')}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <ButtonGroup>
        <DropdownMenu modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7">
                  <span className="truncate">{getFontLabel()}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
              Font Family
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="min-w-40" onCloseAutoFocus={(e) => e.preventDefault()}>
            {FONT_FAMILIES.map((font) => (
              <DropdownMenuItem
                key={font.value}
                onClick={() => editor.chain().focus().setFontFamily(font.value).run()}
                className={cn('text-sm', state.fontFamily === font.value && 'bg-accent')}
              >
                {font.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Align Left"
          pressed={state.isAlignLeft}
          onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Align Center"
          pressed={state.isAlignCenter}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Align Right"
          pressed={state.isAlignRight}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Justify"
          pressed={state.isAlignJustify}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify size={16} />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Bold"
          pressed={state.isBold}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Italic"
          pressed={state.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Underline"
          pressed={state.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Strikethrough"
          pressed={state.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={16} />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Quote"
          pressed={state.isQuote}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Code Block"
          pressed={state.isCodeBlock}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Inline Code"
          pressed={state.isCode}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={16} />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Highlight"
          pressed={state.isHighlight}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter size={16} />
        </ToolbarToggle>
      </ButtonGroup>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

      <ButtonGroup>
        <Popover modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon-sm">
                  <Link size={16} />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
              Link
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-3" align="start" sideOffset={8}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const url = formData.get('url') as string;
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                } else {
                  editor.chain().focus().unsetLink().run();
                }
              }}
              className="flex gap-2"
            >
              <Input name="url" placeholder="Enter URL" defaultValue={state.linkUrl} className="h-7 flex-1" autoFocus />
              <Button type="submit" size="sm" className="h-7">
                Apply
              </Button>
            </form>
          </PopoverContent>
        </Popover>
        <ToolbarButton tooltip="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton tooltip="Image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={16} />
        </ToolbarButton>
      </ButtonGroup>
    </div>
  );
}
