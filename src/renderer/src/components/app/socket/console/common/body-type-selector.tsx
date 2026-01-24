import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/select';

interface BodyTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}

export function BodyTypeSelector({ value, onValueChange, options }: BodyTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" className="h-6! w-22 ">
        <SelectValue placeholder="Type" />
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((option) => (
          <SelectItem className="h-6 rounded-md" key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
