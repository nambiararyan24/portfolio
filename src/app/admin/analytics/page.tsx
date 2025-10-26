import { getServices, getTools, getProjects, getLeads } from '@/lib/database';
import { 
  Briefcase, 
  Wrench, 
  FolderOpen, 
  MessageSquare, 
  TrendingUp,
  Users,
  Eye
} from 'lucide-react';

export default async function AnalyticsPage() {
  const [services, tools, projects, leads] = await Promise.all([
    getServices().catch(() => []),
    getTools().catch(() => []),
    getProjects().catch(() => []),
    getLeads().catch(() => []),
  ]);

  const unreadLeads = leads.filter(lead => !lead.read).length;
  const recentLeads = leads.slice(0, 5);
  const totalLeads = leads.length;

  // Calculate some basic analytics
  const leadsThisMonth = leads.filter(lead => {
    const leadDate = new Date(lead.created_at);
    const now = new Date();
    return leadDate.getMonth() === now.getMonth() && leadDate.getFullYear() === now.getFullYear();
  }).length;

  const projectTypes = leads.reduce((acc, lead) => {
    acc[lead.project_type] = (acc[lead.project_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Overview of your portfolio performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
              <p className="text-xs text-muted-foreground">
                {leadsThisMonth} this month
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unread Leads</p>
              <p className="text-2xl font-bold text-foreground">{unreadLeads}</p>
              <p className="text-xs text-muted-foreground">
                {unreadLeads > 0 ? 'Needs attention' : 'All caught up'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Projects</p>
              <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              <p className="text-xs text-muted-foreground">
                {projects.filter(p => p.external_link).length} live
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Services</p>
              <p className="text-2xl font-bold text-foreground">{services.length}</p>
              <p className="text-xs text-muted-foreground">
                Active offerings
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Types */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Project Types</h3>
          {Object.keys(projectTypes).length === 0 ? (
            <p className="text-muted-foreground text-sm">No project type data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(projectTypes)
                .sort(([,a], [,b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / totalLeads) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent activity</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.project_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                    {!lead.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-1 mx-auto"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Overview */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {tools.map((tool) => (
            <div key={tool.id} className="flex flex-col items-center space-y-2 p-3 bg-muted/50 rounded-lg">
              {tool.logo_url ? (
                <img
                  src={tool.logo_url}
                  alt={tool.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-primary" />
                </div>
              )}
              <span className="text-xs font-medium text-foreground text-center">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
