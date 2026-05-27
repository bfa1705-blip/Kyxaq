'use client';

import { useEffect, useState } from 'react';
import { FolderPlus, Rocket } from 'lucide-react';

export default function DashboardPage() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProject(data.project);
    setLoading(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: projectName }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        fetchProject();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create project');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full text-zinc-500 font-medium">Loading...</div>
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-white mb-10">Dashboard</h1>

      {!project ? (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <FolderPlus className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Initialiser votre projet</h2>
          </div>
          <p className="text-zinc-400 mb-8 text-lg">
            Chaque développeur dispose d'un nœud de projet dédié pour distribuer ses assets.
          </p>
          
          <form onSubmit={handleCreateProject} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Nom du projet"
              className="input-field max-w-sm"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
            <button 
              type="submit"
              disabled={isCreating}
              className="btn-primary"
            >
              {isCreating ? 'Initialisation...' : 'Lancer le Projet'}
            </button>
          </form>
          {error && <p className="text-red-500 mt-6 font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-lg inline-block">{error}</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-6">Informations</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-white mb-2 tracking-tight">{project.name}</p>
                <p className="text-sm text-zinc-500 font-bold">ID: #{project.id}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
                <Rocket className="text-blue-500" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card flex flex-col justify-center">
            <div className="flex justify-between items-end mb-4">
              <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Utilisation</p>
              <p className="text-white font-black">1 / 1</p>
            </div>
            <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-zinc-800">
              <div className="bg-blue-600 h-full w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
