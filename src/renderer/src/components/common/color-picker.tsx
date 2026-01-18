import * as React from 'react';
import { Pipette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = React.useState(color);

  React.useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(val)) {
      onChange(val);
    }
  };

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      console.warn('EyeDropper API is not supported in this browser');
      return;
    }
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-3 select-none" onPointerDown={(e) => e.stopPropagation()}>
      <div className="custom-picker">
        <HexColorPicker color={color} onChange={onChange} className="w-full! h-40!" />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleEyeDropper}
          className="shrink-0 h-8 w-8 bg-transparent"
          disabled={!window.EyeDropper}
        >
          <Pipette size={14} />
        </Button>
        <div className="flex-1 flex items-center rounded-md border px-2 h-8 bg-transparent!">
          <span className="text-sm text-muted-foreground mr-2 uppercase">HEX</span>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            className="border-none bg-transparent! h-6 p-0 text-sm focus-visible:ring-0 uppercase shadow-none!"
            spellCheck={false}
          />
        </div>
      </div>

      <style>
        {`
        .custom-picker .react-colorful {
          width: 100%;
          border-radius: 8px;
        }
        .custom-picker .react-colorful__saturation {
          border-radius: 6px 6px 0 0;
          border-bottom: none;
        }
        .custom-picker .react-colorful__hue {
          height: 12px;
          border-radius: 10px;
          margin-top: 12px;
        }
        .custom-picker .react-colorful__hue-pointer,
        .custom-picker .react-colorful__saturation-pointer {
          width: 16px;
          height: 16px;
        }
      `}
      </style>
    </div>
  );
}

declare global {
  interface Window {
    EyeDropper: {
      new (): {
        open: () => Promise<{ sRGBHex: string }>;
      };
    };
  }
}
