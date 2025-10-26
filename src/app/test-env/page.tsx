export default function TestEnv() {
  // Debug: Log all environment variables
  console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  console.log('All env keys:', Object.keys(process.env).filter(key => key.includes('SUPABASE') || key.includes('ADMIN')));
  console.log('===================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Environment Variables Test</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">NODE_ENV:</h2>
            <p className="text-slate-300">{process.env.NODE_ENV || 'Not set'}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Supabase URL:</h2>
            <p className="text-slate-300 break-all">
              {supabaseUrl || 'Not set'}
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Supabase Anon Key:</h2>
            <p className="text-slate-300 break-all">
              {supabaseAnonKey ? 
                `${supabaseAnonKey.substring(0, 20)}...` : 
                'Not set'
              }
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Service Role Key:</h2>
            <p className="text-slate-300 break-all">
              {serviceRoleKey ? 
                `${serviceRoleKey.substring(0, 20)}...` : 
                'Not set'
              }
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Admin Email:</h2>
            <p className="text-slate-300">
              {adminEmail || 'Not set'}
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-slate-800 rounded-xl">
          <p className="text-slate-300 text-sm">
            Check the server console for debug logs. If any of these show "Not set", there might be an issue with your .env.local file.
          </p>
        </div>
      </div>
    </div>
  );
}
