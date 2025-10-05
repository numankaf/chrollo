import type { CommandType } from '../../types/layout';

const RequestIcon = ({ commandType }: { commandType: CommandType }) => {
  return (
    <div className="text-3xs w-[40px] text-end mt-1">
      {commandType === 'command' ? (
        <span className="text-yellow-600">COMMAND</span>
      ) : (
        <span className="text-green-600">QUERY</span>
      )}
    </div>
  );
};

export default RequestIcon;
