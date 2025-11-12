import { SupabaseTest } from './components/SupabaseTest';

function App() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">Family Command Center</h1>
      <p className="mt-4 text-gray-600">Tailwind is working.</p>
      <div className="mt-8">
        <SupabaseTest />
      </div>
    </div>
  );
}

export default App;
