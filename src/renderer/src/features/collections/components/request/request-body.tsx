import { formatCode } from '@/utils/editor-util';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { REQUEST_BODY_TYPE } from '@/types/collection';
import { ScrollArea } from '@/components/common/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';
import { BeautifyButton } from '@/components/app/button/beautify-button';
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
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end gap-2 mx-2 mb-1 ">
        <p className="text-muted-foreground my-1 flex-1">Body</p>
        <BodyTypeSelector />
        <BeautifyButton onClick={formatRequestData} />
      </div>
      <div className="flex-1 mx-2 mb-2 border rounded-lg" style={{ height: 'calc(100% - 6rem)' }}>
        <ScrollArea className="p-0.5 min-h-full h-full">
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
              />
            )}
          />
        </ScrollArea>
      </div>
    </div>
  );
}

export default RequestBody;
