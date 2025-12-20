import { Avatar, AvatarFallback, AvatarImage } from '@/components/common/avatar';

interface ContributorProps {
  avatar: string;
  name: string;
  github: string;
}

function Contributor({ avatar, name, github }: ContributorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-2 py-1 w-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">{github}</span>
      </div>
    </div>
  );
}

export default Contributor;
