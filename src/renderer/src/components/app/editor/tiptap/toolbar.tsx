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
  Highlighter,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu';
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
      heading: ctx.editor.isActive('heading', { level: 1 })
        ? 'H1'
        : ctx.editor.isActive('heading', { level: 2 })
          ? 'H2'
          : ctx.editor.isActive('heading', { level: 3 })
            ? 'H3'
            : 'P',
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
    }),
  });

  if (!editor || !state) {
    return null;
  }

  const getFontLabel = () => {
    const font = FONT_FAMILIES.find((f) => state.fontFamily === f.value);
    return font ? font.label : 'Font';
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-1 border-b">
      <ButtonGroup>
        <ToolbarButton tooltip="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo}>
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton tooltip="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo}>
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </ButtonGroup>

      <ButtonGroup>
        <DropdownMenu modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 px-2 font-bold min-w-[3.5rem] h-7 text-sm">
                  {state.heading}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-card [&_svg]:invisible text-xs">
              Text Style
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="min-w-48" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className="text-sm">
              <Pilcrow className="h-4 w-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="text-sm"
            >
              <Heading1 className="h-4 w-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="text-sm"
            >
              <Heading2 className="h-4 w-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="text-sm"
            >
              <Heading3 className="h-4 w-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()} className="text-sm">
              <ListOrdered className="h-4 w-4 mr-2" />
              Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()} className="text-sm">
              <List className="h-4 w-4 mr-2" />
              Bulleted List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()} className="text-sm">
              <ListChecks className="h-4 w-4 mr-2" />
              Check List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <ButtonGroup>
        <DropdownMenu modal={false}>
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 px-3 h-7 text-sm min-w-[6rem] justify-between">
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
          <AlignLeft className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Align Center"
          pressed={state.isAlignCenter}
          onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Align Right"
          pressed={state.isAlignRight}
          onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Justify"
          pressed={state.isAlignJustify}
          onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Bold"
          pressed={state.isBold}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Italic"
          pressed={state.isItalic}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Underline"
          pressed={state.isUnderline}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Strikethrough"
          pressed={state.isStrike}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Quote"
          pressed={state.isQuote}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarToggle
          tooltip="Code Block"
          pressed={state.isCodeBlock}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </ToolbarToggle>
      </ButtonGroup>

      <ButtonGroup>
        <ToolbarButton
          tooltip="Link"
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else if (url === '') {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={cn(state.isLink && 'bg-accent text-accent-foreground')}
        >
          <Link className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarToggle
          tooltip="Highlight"
          pressed={state.isHighlight}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarToggle>
        <ToolbarToggle
          tooltip="Inline Code"
          pressed={state.isCode}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarToggle>
      </ButtonGroup>
    </div>
  );
}
