import type { CommandType } from '../../types/layout';

const RequestIcon = ({ commandType }: { commandType: CommandType }) => {
  return (
    <div className="text-xs font-semibold text-end">
      {commandType === 'command' ? (
        <span className="text-yellow-600">CMD</span>
      ) : (
        <span className="text-green-600">QRY</span>
      )}
    </div>
  );
};

export default RequestIcon;
