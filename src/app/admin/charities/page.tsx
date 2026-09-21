'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/use-store';
import { 
  Heart, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { Charity, CharityEvent } from '@/types';

export default function AdminCharitiesPage() {
  const { charities, store } = useAppStore();

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Youth Development');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=400&fit=crop');
  const [logoUrl, setLogoUrl] = useState('https://images.unsplash.com/photo-1593111774642-a116f199857d?w=300&h=300&fit=crop');
  const [websiteUrl, setWebsiteUrl] = useState('https://example.org');
  const [featured, setFeatured] = useState(false);

  // Add Event Modal State
  const [eventCharity, setEventCharity] = useState<Charity | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFee, setEventFee] = useState('75');

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setCategory('Youth Development');
    setFeatured(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Charity) => {
    setEditingId(c.id);
    setName(c.name);
    setSlug(c.slug);
    setTagline(c.tagline);
    setDescription(c.description);
    setCategory(c.category);
    setBannerUrl(c.banner_url);
    setLogoUrl(c.logo_url);
    setWebsiteUrl(c.website_url || '');
    setFeatured(c.featured);
    setModalOpen(true);
  };

  const handleSaveCharity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingId) {
      store.updateCharity(editingId, {
        name,
        slug: generatedSlug,
        tagline,
        description,
        category,
        banner_url: bannerUrl,
        logo_url: logoUrl,
        website_url: websiteUrl,
        featured,
      });
    } else {
      store.addCharity({
        name,
        slug: generatedSlug,
        tagline,
        description,
        category,
        banner_url: bannerUrl,
        logo_url: logoUrl,
        website_url: websiteUrl,
        featured,
        events: [],
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, charityName: string) => {
    if (confirm(`Are you sure you want to remove ${charityName}?`)) {
      store.deleteCharity(id);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCharity) return;

    const newEvent: CharityEvent = {
      id: 'e_' + Math.random().toString(36).substring(2, 9),
      charity_id: eventCharity.id,
      title: eventTitle,
      date: eventDate,
      location: eventLocation,
      description: eventDescription,
      entry_fee: parseFloat(eventFee) || 0,
    };

    const currentEvents = eventCharity.events || [];
    store.updateCharity(eventCharity.id, {
      events: [...currentEvents, newEvent],
    });

    setEventCharity(null);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setEventDescription('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Surface 03 (§ 11)</span>
          <h2 className="text-2xl font-bold text-white mt-1">Charity & Media Management</h2>
          <p className="text-xs text-slate-400 mt-1">
            Add, update, or remove vetted charitable organizations, upload media banners, and schedule golf outings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:brightness-110 text-black font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Charity Listing</span>
        </button>
      </div>

      {/* Charities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="rounded-3xl bg-[#0f1522] border border-slate-800 overflow-hidden space-y-4 shadow-xl"
          >
            <div className="relative h-36 w-full">
              <img
                src={charity.banner_url}
                alt={charity.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1522] to-transparent" />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-black/70 text-emerald-300 border border-emerald-500/30">
                  {charity.category}
                </span>
                {charity.featured && (
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-black">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{charity.name}</h3>
                <span className="text-xs text-emerald-400 font-bold">
                  \${charity.total_raised.toLocaleString()} Raised
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{charity.tagline}</p>

              {/* Events count */}
              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>{charity.events?.length || 0} Golf Outings Scheduled</span>
                <button
                  onClick={() => setEventCharity(charity)}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <Calendar className="w-3.5 h-3.5" /> + Add Event
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(charity)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(charity.id, charity.name)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT CHARITY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#121824] border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingId ? 'Edit Charity Organization' : 'Create Charity Organization (§ 11.03)'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveCharity} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fairway to Future"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Category / Cause</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Youth Development, Veterans, Environment"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Short Tagline</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Empowering youth through golf and STEM mentorship."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed background and mission..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 uppercase block mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 uppercase block mb-1">Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-slate-300 font-semibold cursor-pointer">
                  Feature on Homepage Spotlight (§ 08.2)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:brightness-110 text-black font-bold"
                >
                  Save Charity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CHARITY EVENT MODAL */}
      {eventCharity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#121824] border border-slate-700 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Golf Outing for {eventCharity.name}</h3>
              <button onClick={() => setEventCharity(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Charity Scramble"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 uppercase block mb-1">Entry Fee (\$)</label>
                  <input
                    type="number"
                    value={eventFee}
                    onChange={(e) => setEventFee(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Course Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oakmont Pines Championship Course"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Event itinerary..."
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEventCharity(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold hover:brightness-110"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
