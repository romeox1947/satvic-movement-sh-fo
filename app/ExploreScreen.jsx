'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Play, Image as ImageIcon, Video, X } from 'lucide-react';
import VisitDock from './VisitDock';

const categories = [
  { label: 'Experiences', folder: 'Experiences' },
  { label: 'Places to visit', folder: 'Places to eat' },
  { label: 'Places to shop', folder: 'Places to shop' },
];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function VideoStill({ src }) {
  const [still, setStill] = useState('');
  function seekToFrame(event) {
    const video = event.currentTarget;
    if (video.duration) video.currentTime = Math.min(0.5, video.duration * 0.1);
  }
  function captureFrame(event) {
    const video = event.currentTarget;
    if (!video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    try { setStill(canvas.toDataURL('image/jpeg', 0.82)); } catch {}
  }
  return still ? <img className="place-photo-image" src={still} alt="A still from this place's video"/> : <video className="place-photo-image" src={src} muted playsInline preload="metadata" onLoadedData={seekToFrame} onSeeked={captureFrame}/>;
}

export default function ExploreScreen({ onOpenReel, initialSearch = '' }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Experiences');
  const [searchAcrossCategories, setSearchAcrossCategories] = useState(false);
  const [cityMenu, setCityMenu] = useState(false);
  const [city, setCity] = useState('Pune');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [visitPlace, setVisitPlace] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/discover', { signal: controller.signal })
      .then(response => response.ok ? response.json() : { items: [] })
      .then(data => setItems(shuffle(data.items || [])))
      .catch(error => { if (error.name !== 'AbortError') setItems([]); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      setSearchAcrossCategories(true);
    }
  }, [initialSearch]);

  const filtered = useMemo(() => {
    const selectedCategory = categories.find(option => option.label === category)?.folder;
    return items.filter(item => {
      const matchesCity = city === 'All locations' || item.city === city;
      const matchesCategory = searchAcrossCategories || item.category === selectedCategory;
      const text = `${item.title} ${item.place} ${item.creator} ${item.city}`.toLowerCase();
      return matchesCity && matchesCategory && text.includes(search.toLowerCase().trim());
    });
  }, [items, city, category, search, searchAcrossCategories]);

  const places = useMemo(() => {
    const grouped = new Map();
    filtered.forEach(item => {
      if (!grouped.has(item.place)) grouped.set(item.place, []);
      grouped.get(item.place).push(item);
    });
    return [...grouped.entries()].map(([place, media]) => ({ place, media }));
  }, [filtered]);

  return <section className="explore-screen" aria-label="Search and explore">
    <div className="explore-search"><Search size={18}/><input aria-label="Search places, people, videos" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search places, people, videos"/></div>
    <div className="explore-toolbar"><h1>Popular</h1><div className="city-filter-wrap"><button className="city-filter" onClick={() => setCityMenu(!cityMenu)}><MapPin size={14}/>{city}<span>⌄</span></button>{cityMenu && <div className="city-menu">{['Pune', 'All locations'].map(option => <button key={option} onClick={() => { setCity(option); setCityMenu(false); }}>{option}{city === option && <span>✓</span>}</button>)}</div>}</div></div>
    <div className="place-category-tabs" role="tablist" aria-label="Explore a category">{categories.map(option => <button key={option.label} role="tab" aria-selected={category === option.label} className={category === option.label ? 'active' : ''} onClick={() => { setCategory(option.label); setSearch(''); setSearchAcrossCategories(false); }}>{option.label}</button>)}</div>
    <div className="place-groups">{places.map(({ place, media }) => {
      const photo = media.find(item => item.kind === 'photo');
      const reel = media.find(item => item.kind === 'reel');
      return <section className="place-group" key={place}>
        <div className="place-group-heading"><div><span className="section-eyebrow">{category.toUpperCase()}</span><h2>{place}</h2></div><button className="place-visit-button" onClick={() => setVisitPlace({ place, media })}><MapPin size={13}/>Visit</button></div>
        <div className="place-group-media">
          <div className="place-media-column"><h3><ImageIcon size={13}/> Photo</h3>{photo ? <button className="place-media-tile" onClick={() => setPhotoPreview(photo)}><img className="place-photo-image" src={photo.url} alt={`${place}`} loading="lazy"/><span className="place-media-caption">A moment here</span><span className="image-credit">© Google Maps</span></button> : reel ? <div className="place-media-tile place-generated-photo"><VideoStill src={reel.url}/><span className="place-media-caption">Place preview</span></div> : <div className="place-media-empty"><ImageIcon size={18}/><span>Photo coming soon</span></div>}</div>
          <div className="place-media-column"><h3><Video size={13}/> Reel</h3>{reel ? <button className="place-media-tile" onClick={() => onOpenReel({ ...reel, video: reel.url })}><video className="place-photo-image" src={reel.url} muted playsInline preload="metadata"/><span className="place-play"><Play size={16} fill="currentColor"/></span><span className="place-media-caption">@{reel.creator}</span></button> : <div className="place-media-empty"><Video size={18}/><span>Reel coming soon</span></div>}</div>
        </div>
      </section>;
    })}</div>
    {filtered.length === 0 && search.trim() && <p className="explore-empty">No {category.toLowerCase()} match that search yet.</p>}
    {photoPreview && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={photoPreview.title} onClick={() => setPhotoPreview(null)}><button aria-label="Close photo"><X size={22}/></button><img src={photoPreview.url} alt={photoPreview.title}/><span>@{photoPreview.creator} · {photoPreview.place}</span></div>}
    {visitPlace && <VisitDock place={visitPlace.place} area="Pune, Maharashtra, India" category={category} mediaUrl={visitPlace.media.find(item => item.kind === 'photo')?.url || visitPlace.media.find(item => item.kind === 'reel')?.url} mediaType={visitPlace.media.some(item => item.kind === 'photo') ? 'image' : 'video'} isOpen onClose={() => setVisitPlace(null)} className="explore-place-dock" closeLabel="Back"/>}
  </section>;
}
