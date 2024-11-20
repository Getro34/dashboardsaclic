import { useEffect, useState } from 'react';
    import { supabase } from '../utils/supabaseClient';

    export default function AdminDashboard() {
      const [users, setUsers] = useState([]);
      const [registrationCode, setRegistrationCode] = useState('');

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

      const handleGenerateCode = async () => {
        const newCode = Math.random().toString(36).substring(2, 15);
        setRegistrationCode(newCode);
        // Save the code to the database or display it to the admin
      };

      return (
        <div className="p-4">
          <h1 className="header">Admin Dashboard</h1>
          <div className="card">
            <button onClick={handleGenerateCode} className="button">
              Generate Registration Code
            </button>
            <p>Registration Code: {registrationCode}</p>
          </div>
          <div className="card">
            <h2 className="subheader">User Management</h2>
            <ul>
              {users.map(user => (
                <li key={user.id} className="mb-2">
                  {user.email} - {user.validated ? 'Validated' : 'Pending'}
                  {!user.validated && (
                    <button onClick={() => handleValidateUser(user.id)} className="button ml-2">
                      Validate
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
