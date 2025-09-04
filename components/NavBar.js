import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function NavBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    }
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{
        maxWidth: 980,
        margin: '0 auto',
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/"><a style={{ fontWeight: 700 }}>Live News</a></Link>
          <Link href="/write"><a>Write</a></Link>
          <Link href="/admin"><a>Admin</a></Link>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 13 }}>{user.email}</span>
              <button onClick={signOut} className="btn">Sign out</button>
            </>
          ) : (
            <Link href="/login"><a className="btn btn-primary">Login</a></Link>
          )}
        </div>
      </div>
    </header>
  );
}
