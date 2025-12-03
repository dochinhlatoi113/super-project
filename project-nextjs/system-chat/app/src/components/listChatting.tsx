import Avatar from './avatar';
import { BriefcaseIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
interface ChattingProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  content?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}
const ListChatting = ({
  src,
  alt = 'Avatar',
  size = 'lg',
  name,
  content,
  status,
  className = '',
}: ChattingProps) => {
  name = 'henshin';
  content = 'Hello! How can I assist you today cccccccccccccccc?';
  return (
    <div className="px-4 py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex flex-row items-center gap-3 cursor-pointer">
        <div className="flex-shrink-0">
          <Avatar src={src} alt={alt} size={size} status={status} className={className} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[15px] font-semibold text-gray-800">{name}</h1>
          <div className="text-[13px] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
            {content}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 px-2 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
        <div className="flex flex-col items-center gap-1">
          <BriefcaseIcon className="w-4 h-4 text-indigo-600" />
          <p className="text-[11px] font-medium text-gray-700">Công việc</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ClockIcon className="w-4 h-4 text-blue-600" />
          <p className="text-[11px] font-medium text-gray-700">2:00 PM</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CalendarIcon className="w-4 h-4 text-purple-600" />
          <p className="text-[11px] font-medium text-gray-700">31/11/2025</p>
        </div>
      </div>
    </div>
  );
};
export default ListChatting;
