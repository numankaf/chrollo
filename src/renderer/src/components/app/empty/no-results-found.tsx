import { SearchX } from 'lucide-react';

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/common/empty';

interface NoResultsFoundProps {
  searchTerm: string;
}

function NoResultsFound({ searchTerm }: NoResultsFoundProps) {
  return (
    <Empty className="p-3!">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchX size={30} />
        </EmptyMedia>
        <EmptyTitle>
          No results found for <span className="ml-1 font-semibold">"{searchTerm}"</span>
        </EmptyTitle>
        <EmptyDescription>
          No items match the current search criteria. Adjust your search or reset the filter.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default NoResultsFound;
