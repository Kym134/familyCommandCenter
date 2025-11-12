import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function SupabaseTest() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Test connection
    supabase
      .from('families')
      .select('count')
      .then(() => setConnected(true))
      .catch(() => setConnected(false));
  }, []);

  return (
    <div className="p-4 rounded bg-gray-100">
      <h2 className="font-bold">Supabase Connection:</h2>
      {connected === null && <p>Testing...</p>}
      {connected === true && <p className="text-green-600">✓ Connected</p>}
      {connected === false && <p className="text-red-600">✗ Not connected</p>}
    </div>
  );
}
