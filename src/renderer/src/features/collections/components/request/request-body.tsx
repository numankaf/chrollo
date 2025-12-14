import { formatCode } from '@/utils/editor-util';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { REQUEST_BODY_TYPE } from '@/types/collection';
import { Button } from '@/components/common/button';
import { ScrollArea } from '@/components/common/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import CodeEditor from '@/components/app/editor/code-editor';

const BODY_TYPE_PROPERTY_KEY = 'body.type';
const BODY_DATA_PROPERTY_KEY = 'body.data';

function BodyTypeSelector() {
  const form = useFormContext();
  return (
    <Controller
      name={BODY_TYPE_PROPERTY_KEY}
      control={form.control}
      render={({ field, fieldState }) => (
        <Select name={field.name} value={field.value} onValueChange={field.onChange}>
          <SelectTrigger size="sm" className="text-sm h-6! w-22 " aria-invalid={fieldState.invalid}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(REQUEST_BODY_TYPE).map((value) => (
              <SelectItem className="text-sm h-6 rounded-md" key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}

function RequestBody() {
  const form = useFormContext();

  const bodyType = useWatch({
    control: form.control,
    name: BODY_TYPE_PROPERTY_KEY,
  });

  const formatRequestData = () => {
    const data = form.getValues(BODY_DATA_PROPERTY_KEY);
    const formatted = formatCode(bodyType, data);
    form.setValue(BODY_DATA_PROPERTY_KEY, formatted);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2 mx-2 mb-1 ">
        <p className="text-muted-foreground my-1 flex-1">Body</p>
        <BodyTypeSelector />
        <Button size="sm" className="h-6" variant="outline" type="button" onClick={formatRequestData}>
          Beautify
        </Button>
      </div>
      <ScrollArea className="mx-2 mb-2 border rounded-lg" style={{ height: 'calc(100% - 2.5rem)' }}>
        <Controller
          name={BODY_DATA_PROPERTY_KEY}
          control={form.control}
          render={({ field }) => (
            <CodeEditor
              value={field.value}
              bodyType={bodyType}
              onChange={(value) => {
                form.setValue(BODY_DATA_PROPERTY_KEY, value, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                // Check for Ctrl+S (Windows/Linux) or Cmd+S (Mac)
                if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                  e.preventDefault();
                  formatRequestData();
                }
              }}
            />
          )}
        />
      </ScrollArea>
    </>
  );
}

export default RequestBody;
