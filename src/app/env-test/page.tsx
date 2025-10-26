export default function EnvTest() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Simple Environment Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">NODE_ENV:</h2>
            <p className="text-slate-300">{process.env.NODE_ENV || 'Not set'}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">NEXT_PUBLIC_SUPABASE_URL:</h2>
            <p className="text-slate-300 break-all">
              {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Raw process.env keys:</h2>
            <p className="text-slate-300 text-xs break-all">
              {JSON.stringify(Object.keys(process.env).filter(key => key.includes('SUPABASE') || key.includes('ADMIN') || key.includes('NEXT')), null, 2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


