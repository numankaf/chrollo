import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';

export function CodeBlockView({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}: NodeViewProps) {
  const languages = extension.options.lowlight.listLanguages() as string[];

  return (
    <NodeViewWrapper className="relative group">
      <div
        className="absolute right-2 top-5 z-50 opacity-0 group-hover:opacity-100 transition-opacity"
        contentEditable={false}
      >
        <Select
          value={defaultLanguage || 'auto'}
          onValueChange={(value) => updateAttributes({ language: value === 'auto' ? null : value })}
        >
          <SelectTrigger className="text-sm h-6! bg-[#252526]! border-[#3c3c3c]! text-[#d4d4d4]! hover:bg-[#37373d]! transition-none shadow-none">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="max-h-60 bg-[#1e1e1e] border-[#3c3c3c] text-[#d4d4d4] z-50 animate-none data-[state=open]:animate-none data-[state=closed]:animate-none duration-0"
          >
            <SelectItem className="text-sm h-7 rounded-none focus:bg-[#094771] focus:text-white" value="auto">
              AUTO
            </SelectItem>
            {languages.map((lang: string) => (
              <SelectItem
                className="text-sm h-7 rounded-none focus:bg-[#094771] focus:text-white"
                key={lang}
                value={lang}
              >
                {lang.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <pre>
        <NodeViewContent as="div" className="bg-transparent" />
      </pre>
    </NodeViewWrapper>
  );
}
