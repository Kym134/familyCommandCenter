import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Family {
  id: string;
  name: string;
}

interface FamilyContextType {
  family: Family | null;
  loading: boolean;
}

const FamilyContext = createContext<FamilyContextType>({
  family: null,
  loading: true,
});

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, just get the first (only) family
    supabase
      .from('family')
      .select('*')
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setFamily(data);
        }
        setLoading(false);
      });
  }, []);

  return (
    <FamilyContext.Provider value={{ family, loading }}>
      {children}
    </FamilyContext.Provider>
  );
}

export const useFamily = () => useContext(FamilyContext);
