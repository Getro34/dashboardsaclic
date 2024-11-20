import { useEffect, useState } from 'react';
    import { supabase } from '../utils/supabaseClient';

    export default function Dashboard() {
      const [user, setUser] = useState(null);

      useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user ?? null);

        supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });
      }, []);

      if (!user) return <p>Loading...</p>;

      return (
        <div>
          <h1>Welcome, {user.email}</h1>
          {/* Add more dashboard features here */}
        </div>
      );
    }
