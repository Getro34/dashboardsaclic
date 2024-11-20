import { useEffect, useState } from 'react';
    import { supabase } from '../utils/supabaseClient';

    export default function Admin() {
      const [users, setUsers] = useState([]);

      useEffect(() => {
        const fetchUsers = async () => {
          const { data, error } = await supabase.from('users').select('*');
          if (error) console.error('Error fetching users:', error.message);
          else setUsers(data);
        };

        fetchUsers();
      }, []);

      const handleValidateUser = async (userId) => {
        const { error } = await supabase.from('users').update({ validated: true }).eq('id', userId);
        if (error) console.error('Error validating user:', error.message);
      };

      return (
        <div>
          <h1>Admin Dashboard</h1>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.email} - {user.validated ? 'Validated' : 'Pending'}
                {!user.validated && (
                  <button onClick={() => handleValidateUser(user.id)}>Validate</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }
