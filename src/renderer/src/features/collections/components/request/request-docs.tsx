import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { RichTextEditor } from '@/components/app/editor/rich-text-editor';

function RequestDocs() {
  const form = useFormContext();
  const id = useWatch({ name: 'id', control: form.control });
  return (
    <div className="p-2 h-full ">
      <Controller
        name="documentation"
        control={form.control}
        render={({ field }) => (
          <RichTextEditor
            key={id}
            content={field.value || ''}
            onContentChange={(val) => field.onChange(val)}
            placeholder="Enter request documentation..."
            className="h-full"
          />
        )}
      />
    </div>
  );
}

export default RequestDocs;
