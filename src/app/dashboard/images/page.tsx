'use client';

import { useEffect, useState } from 'react';
import { Upload, ImageIcon, Loader2, ExternalLink, Trash2, Search } from 'lucide-react';

export default function ImagesPage() {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [hasProject, setHasProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkProjectAndFetchImages();
  }, []);

  const checkProjectAndFetchImages = async () => {
    try {
      const projRes = await fetch('/api/projects');
      const projData = await projRes.json();
      
      if (projData.project) {
        setHasProject(true);
        const imgRes = await fetch('/api/images/upload');
        const imgData = await imgRes.json();
        setImages(imgData.images || []);
      } else {
        setHasProject(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImages(prev => [
          { id: Math.random().toString(), url: data.url, filename: file.name, created_at: new Date().toISOString() },
          ...prev
        ]);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const filteredImages = images.filter(img => 
    img.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full text-zinc-500 font-medium">Loading...</div>
  );

  if (!hasProject) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center">
        <ImageIcon size={48} className="text-zinc-800 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Aucun projet trouvé</h2>
        <p className="text-zinc-500 mb-8 max-w-sm">Vous devez d'abord initialiser un projet pour déployer vos assets.</p>
        <button onClick={() => window.location.href = '/dashboard'} className="btn-primary px-10 py-3">
          Initialiser maintenant
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Assets</h1>
          <p className="text-zinc-500 font-medium">Gérez vos fichiers sur le réseau KxStudios</p>
        </div>
        
        <label className="btn-primary flex items-center gap-3 cursor-pointer py-3 px-8">
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} strokeWidth={2.5} />}
          <span className="font-bold tracking-tight text-lg">{uploading ? 'Déploiement...' : 'Déployer'}</span>
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
        </label>
      </div>

      <div className="mb-10">
        <div className="relative max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Rechercher un asset..."
            className="input-field pl-12 py-3.5 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-5 rounded-xl mb-8 border border-red-500/20 font-bold flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-32 border border-zinc-800/50 rounded-2xl bg-zinc-900/20 shadow-inner">
          <p className="text-zinc-600 font-bold text-xl">Aucun asset déployé</p>
          <p className="text-zinc-700 mt-2">Initialisez votre bibliothèque en déployant votre première image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-8">
          {filteredImages.map((img) => (
            <div key={img.id} className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden group shadow-lg transition-all hover:border-zinc-700">
              <div className="aspect-square relative bg-black">
                <img src={img.url} alt={img.filename} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <a href={img.url} target="_blank" className="p-3 bg-white rounded-lg text-black hover:bg-zinc-200 transition-all hover:scale-110">
                    <ExternalLink size={20} strokeWidth={2.5} />
                  </a>
                  <button className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-all hover:scale-110">
                    <Trash2 size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm font-bold text-white truncate mb-1" title={img.filename}>
                  {img.filename}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Actif</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
                    {new Date(img.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
