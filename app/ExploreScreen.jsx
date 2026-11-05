'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, SlidersHorizontal, Play, Image as ImageIcon, Video, X } from 'lucide-react';

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export default function ExploreScreen({ onOpenReel }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [cityMenu, setCityMenu] = useState(false);
  const [city, setCity] = useState('Pune');
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/discover', { signal: controller.signal })
      .then(response => response.ok ? response.json() : { items: [] })
      .then(data => setItems(shuffle(data.items || [])))
      .catch(error => { if (error.name !== 'AbortError') setItems([]); });
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => items.filter(item => {
    const matchesCity = city === 'All locations' || item.city === city;
    const matchesType = type === 'All' || (type === 'Photos' ? item.kind === 'photo' : item.kind === 'reel');
    const text = `${item.title} ${item.place} ${item.creator} ${item.city}`.toLowerCase();
    return matchesCity && matchesType && text.includes(search.toLowerCase().trim());
  }), [items, city, type, search]);

  const photos = filtered.filter(item => item.kind === 'photo');
  const reels = filtered.filter(item => item.kind === 'reel');
  const showPhotoPlaceholder = photos.length === 0 && (type === 'All' || type === 'Photos');
  const showReelPlaceholder = reels.length === 0 && (type === 'All' || type === 'Reels');

  return <section className="explore-screen" aria-label="Search and explore">
    <div className="explore-search"><Search size={18}/><input aria-label="Search places, people, videos" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search places, people, videos"/><button type="button" aria-label="Open filters" onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17}/></button></div>
    {showFilters && <div className="filter-panel"><b>Show</b>{['All', 'Photos', 'Reels'].map(option => <button key={option} className={type === option ? 'active' : ''} onClick={() => setType(option)}>{option}</button>)}<span><MapPin size={12}/> Pune</span></div>}
    <div className="explore-toolbar"><h1>Popular</h1><div className="city-filter-wrap"><button className="city-filter" onClick={() => setCityMenu(!cityMenu)}><MapPin size={14}/>{city}<span>⌄</span></button>{cityMenu && <div className="city-menu">{['Pune', 'All locations'].map(option => <button key={option} onClick={() => { setCity(option); setCityMenu(false); }}>{option}{city === option && <span>✓</span>}</button>)}</div>}</div></div>
    <div className="explore-filters" role="tablist" aria-label="Media filters">{['All', 'Photos', 'Reels'].map(option => <button key={option} role="tab" aria-selected={type === option} className={type === option ? 'active' : ''} onClick={() => setType(option)}>{option}</button>)}</div>
    <div className="explore-columns">
      {(type === 'All' || type === 'Photos') && <section className="explore-column"><h2><ImageIcon size={14}/> Photos</h2><div className="explore-tiles">{photos.map((item, index) => <button className={`explore-tile photo-tile tile-${index % 3}`} key={item.id} onClick={() => setPhotoPreview(item)}><img src={item.url} alt={`${item.title} in ${item.city}`} loading="lazy"/><span className="tile-label"><b>@{item.creator}</b><small>{item.place}</small></span></button>)}{showPhotoPlaceholder && <div className="explore-placeholder photo-placeholder"><ImageIcon size={23}/><span>Photos you add<br/>will show here</span></div>}</div></section>}
      {(type === 'All' || type === 'Reels') && <section className="explore-column"><h2><Video size={14}/> Reels</h2><div className="explore-tiles">{reels.map((item, index) => <button className={`explore-tile reel-tile tile-${index % 3}`} key={item.id} onClick={() => onOpenReel({ ...item, video: item.url })}><video src={item.url} muted playsInline preload="metadata"/><span className="tile-play"><Play size={18} fill="currentColor"/></span><span className="tile-label"><b>@{item.creator}</b><small>{item.place}</small></span></button>)}{showReelPlaceholder && <button className="explore-placeholder reel-placeholder" onClick={() => onOpenReel(null)}><Video size={23}/><span>ARAI Hills · 1<br/>@what.on.more</span><small>Drop a video into Experiences to add a reel</small></button>}</div></section>}
    </div>
    {filtered.length === 0 && !showPhotoPlaceholder && !showReelPlaceholder && <p className="explore-empty">No Pune posts match that search yet.</p>}
    {photoPreview && <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={photoPreview.title} onClick={() => setPhotoPreview(null)}><button aria-label="Close photo"><X size={22}/></button><img src={photoPreview.url} alt={photoPreview.title}/><span>@{photoPreview.creator} · {photoPreview.place}</span></div>}
  </section>;
}
