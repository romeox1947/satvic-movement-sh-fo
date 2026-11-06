'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, ExternalLink, IndianRupee, Leaf, Lightbulb, MapPin, Star, Store, Utensils, UserRound, UsersRound } from 'lucide-react';
import { getPlaceGuide, getPlaceMapUrl } from './placeGuides';

let placeMediaRequest;
function loadPlaceMedia() {
  if (!placeMediaRequest) {
    placeMediaRequest = fetch('/api/discover').then(response => response.ok ? response.json() : { items: [] }).then(data => data.items || []).catch(() => []);
  }
  return placeMediaRequest;
}

function normalisePlace(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export default function VisitDock({ place, area, guide, category, mediaUrl, mediaType = 'image', photoCredit, isOpen, onClose, className = '', closeLabel = 'Back' }) {
  const [allMedia, setAllMedia] = useState([]);
  const [activeMedia, setActiveMedia] = useState(0);
  const galleryRef = useRef(null);
  const placeGuide = guide || getPlaceGuide(place);
  const mapUrl = getPlaceMapUrl(place, area);
  const activityLabel = placeGuide?.restaurantType ? 'What to order' : placeGuide?.shopCategory ? 'What to buy' : 'What to do';
  const title = placeGuide?.name || place;
  const categoryLabel = placeGuide?.restaurantType && placeGuide?.shopCategory ? 'Cafe & speciality store' : category || 'Pune guide';
  const tags = [...new Set([placeGuide?.restaurantType, placeGuide?.shopCategory, categoryLabel].filter(Boolean))];
  const monogram = title.split(/\s+/).filter(word => !/^(and|&|-|cafe|store)$/i.test(word)).slice(0, 2).map(word => word[0]).join('').toUpperCase();
  const hoursRows = placeGuide?.hoursSchedule || (placeGuide?.hours ? [['Hours', placeGuide.hours]] : []);
  const detailRows = [
    [placeGuide?.restaurantType ? <Utensils size={15}/> : placeGuide?.shopCategory ? <Store size={15}/> : <Leaf size={15}/>, activityLabel, placeGuide?.activity || 'Explore the photos and reels shared by the Satvic community.'],
    placeGuide?.whatToBuy && [<Store size={15}/>, 'In the shop', placeGuide.whatToBuy],
    placeGuide?.audience && [<UsersRound size={15}/>, 'Who will love it', placeGuide.audience],
    placeGuide?.tip && [<Lightbulb size={15}/>, 'Local tip', placeGuide.tip],
    placeGuide?.whySatvic && [<Leaf size={15}/>, 'Why it is Satvic', placeGuide.whySatvic],
  ].filter(Boolean);
  const planRows = [
    placeGuide?.timing && [<CalendarDays size={15}/>, 'Best time to go', placeGuide.timing],
    placeGuide?.spend && [<IndianRupee size={15}/>, 'Spend per person', placeGuide.spend],
  ].filter(Boolean);
  useEffect(() => {
    let cancelled = false;
    if (isOpen) loadPlaceMedia().then(items => { if (!cancelled) setAllMedia(items); });
    return () => { cancelled = true; };
  }, [isOpen]);
  const fallbackMedia = mediaUrl ? [{ id: mediaUrl, url: mediaUrl, kind: mediaType === 'video' ? 'reel' : 'photo', creator: '' }] : [];
  const placeItems = allMedia.filter(item => placeGuide?.matches?.test(item.place) || normalisePlace(item.place) === normalisePlace(placeGuide?.name || place));
  const gallery = [...new Map((placeItems.length ? placeItems : fallbackMedia).map(item => [item.url, item])).values()]
    .sort((first, second) => (first.kind === 'photo' ? 0 : 1) - (second.kind === 'photo' ? 0 : 1));
  const currentMedia = gallery[Math.min(activeMedia, Math.max(0, gallery.length - 1))];
  const galleryIndex = Math.min(activeMedia, Math.max(0, gallery.length - 1));
  function selectMedia(index) {
    galleryRef.current?.scrollTo({ left: galleryRef.current.clientWidth * index, behavior: 'smooth' });
    setActiveMedia(index);
  }
  return <section className={`visit-dock ${className} ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
    <div className="visit-dock-inner">
      <div className="visit-dock-header"><button className="visit-back" onClick={onClose} aria-label={closeLabel}><ArrowLeft size={18}/><span>{closeLabel}</span></button><span className="visit-kicker"><Leaf size={12}/> SATVIC FIELD GUIDE</span></div>
      <div className="place-identity"><span className="place-emblem"><b>{monogram}</b><Leaf size={13}/></span><div><span className="place-overline">SATVIC GUIDE / PUNE</span><h2>{title}</h2><p className="visit-subtitle"><MapPin size={14}/>{placeGuide?.area || area || 'Pune, Maharashtra'}</p></div></div>
      <div className="visit-tags">{tags.flatMap(tag => tag.split(' / ')).map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="place-hero-frame">
        <div className="visit-feature visit-gallery" role="group" aria-label={`${gallery.length} photos and reels from ${title}`} ref={galleryRef} onScroll={event => setActiveMedia(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>
        {gallery.length ? gallery.map((item, index) => <div className="visit-gallery-slide" key={`${item.url}-${index}`}>
          {item.kind === 'reel' ? <video src={item.url} muted playsInline loop controls preload="metadata" aria-label={`Reel ${index + 1} from ${title}`}/> : <img src={item.url} alt={`${title}, photo ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'}/>}
        </div>) : <div className="visit-feature-empty"><MapPin size={24}/><b>{title}</b><span>Place media coming soon</span></div>}
        </div>
        {gallery.length > 1 && <div className="visit-gallery-controls" aria-label={`Media ${galleryIndex + 1} of ${gallery.length}`}><span>{galleryIndex + 1}<i>/</i>{gallery.length}</span><div>{gallery.map((item, index) => <button key={`${item.url}-dot`} className={galleryIndex === index ? 'active' : ''} onClick={() => selectMedia(index)} aria-label={`Show ${item.kind === 'reel' ? 'reel' : 'photo'} ${index + 1}`}/>)}</div></div>}
        <div className="visit-media-meta"><div className="creator-mark" aria-hidden="true">{currentMedia?.kind === 'reel' ? <UserRound size={15}/> : <MapPin size={15}/>}</div><div className="visit-media-credit">{currentMedia?.kind === 'reel' ? <><small>REEL BY</small><b>@{(currentMedia.creator || '').replace(/^@/, '') || 'Satvic community'}</b></> : <><small>PHOTO CREDIT</small><b>Google Maps contributor photo</b></>}</div></div>
      </div>
      <div className="place-action-row"><a className="visit-maps-link" href={mapUrl} target="_blank" rel="noopener noreferrer"><span className="maps-pin-mark"><MapPin size={18}/></span><span><b>Google Maps</b><small>Directions to this address</small></span><ExternalLink size={15}/></a><span className="visit-status"><span className="visit-status-dot"/> Not visited yet</span></div>
      <section className="visit-table-section"><h3><span>01</span> Place overview</h3><div className="visit-data-table" role="table" aria-label="Place overview">{placeGuide?.restaurantType && <div className="visit-data-row" role="row"><span role="cell">Type</span><b role="cell">{placeGuide.restaurantType}</b></div>}{placeGuide?.shopCategory && <div className="visit-data-row" role="row"><span role="cell">Store</span><b role="cell">{placeGuide.shopCategory}</b></div>}{placeGuide?.status && <div className="visit-data-row" role="row"><span role="cell">Status</span><b role="cell">{placeGuide.status}</b></div>}{placeGuide?.rating && <div className="visit-data-row" role="row"><span role="cell"><Star size={13}/> Rating</span><b role="cell">{placeGuide.rating}</b></div>}</div></section>
      {hoursRows.length > 0 && <section className="visit-table-section"><h3><span>02</span> Opening hours</h3><div className="visit-data-table visit-hours-table" role="table" aria-label="Opening hours"><div className="visit-data-heading" role="row"><span role="columnheader">DAY</span><span role="columnheader">HOURS</span></div>{hoursRows.map(([day, hours]) => <div className="visit-data-row" role="row" key={day}><span role="cell"><Clock3 size={13}/>{day}</span><b role="cell">{hours}</b></div>)}</div></section>}
      <section className="visit-table-section"><h3><span>{hoursRows.length ? '03' : '02'}</span> Place guide</h3><div className="visit-data-table" role="table" aria-label="Place recommendations">{detailRows.map(([Icon, label, value]) => <div className="visit-data-row" role="row" key={label}><span role="cell">{Icon}{label}</span><b role="cell">{value}</b></div>)}</div></section>
      {planRows.length > 0 && <section className="visit-table-section"><h3><span>{hoursRows.length ? '04' : '03'}</span> Plan your visit</h3><div className="visit-data-table" role="table" aria-label="Visit planning">{planRows.map(([Icon, label, value]) => <div className="visit-data-row" role="row" key={label}><span role="cell">{Icon}{label}</span><b role="cell">{value}</b></div>)}</div></section>}
      {placeGuide && <div className="visit-official-links">{placeGuide.website && <a href={placeGuide.website} target="_blank" rel="noopener noreferrer">Official website <ExternalLink size={12}/></a>}{placeGuide.instagram && <a href={placeGuide.instagram} target="_blank" rel="noopener noreferrer">{placeGuide.instagramLabel || 'Instagram'} <ExternalLink size={12}/></a>}</div>}
    </div>
  </section>;
}
