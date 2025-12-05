import { useAuth } from '../context/AuthContext';
import Avatar from './avatar';

const Footter = () => {
  const { user } = useAuth();
  return (
    console.log('User in Footer:', user),
    (
      <div className="pb-8">
        <Avatar name={user?.email || 'Guest'}></Avatar>
      </div>
    )
  );
};
export default Footter;
