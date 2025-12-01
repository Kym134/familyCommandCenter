import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Family, User } from '../types/database.types';

export function SupabaseTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch family data
        const { data: familyData, error: familyError } = await supabase
          .from('families')
          .select('*')
          .single();

        if (familyError) throw familyError;
        setFamily(familyData);

        // Fetch family members
        const { data: membersData, error: membersError } = await supabase
          .from('users')
          .select('*')
          .eq('family_id', familyData.id)
          .order('created_at');

        if (membersError) throw membersError;
        setMembers(membersData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Test connection
    supabase
      .from('families')
      .select('count')
      .then(
    () => setConnected(true),      // success
    () => setConnected(false)      // error
  );
  }, []);

  if (loading) {
    return (
      <div className="p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Supabase Connection:</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded bg-gray-100">
        <h2 className="font-bold mb-2">Supabase Connection:</h2>
        <p className="text-red-600">✗ Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded bg-gray-100">
      <h2 className="font-bold mb-2">Supabase Connection:</h2>
      <p className="text-green-600 mb-4">✓ Connected</p>

      {family && (
        <div className="mb-4">
          <h3 className="font-semibold text-lg">{family.name}</h3>
        </div>
      )}

      {members.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Family Members:</h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 rounded"
                style={{ backgroundColor: `${member.color_primary}20` }}
              >
                <span className="text-2xl">{member.avatar_emoji}</span>
                <span
                  className="font-medium"
                  style={{ color: member.color_primary }}
                >
                  {member.display_name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
