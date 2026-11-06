'use client';

import { ArrowLeft, ExternalLink, Leaf, MapPin, Play } from 'lucide-react';
import { getPlaceMapUrl } from './placeGuides';

export default function VisitDock({ place, area, guide, category, mediaUrl, mediaType = 'image', photoCredit, isOpen, onClose, className = '', closeLabel = 'Back' }) {
  const mapUrl = getPlaceMapUrl(place, area);
  const activityLabel = guide?.shopCategory ? 'What to buy' : guide?.restaurantType ? 'What to order' : 'What to do';
  const title = guide?.name || place;
  const tags = [...new Set([guide?.shopCategory || guide?.restaurantType || category || 'Pune guide', category].filter(Boolean))];
  return <section className={`visit-dock ${className} ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
    <div className="visit-dock-inner">
      <div className="visit-dock-header"><button className="visit-back" onClick={onClose} aria-label={closeLabel}><ArrowLeft size={19}/><span>{closeLabel}</span></button><span className="visit-kicker">A PLACE TO PAUSE</span></div>
      <h2>{title}</h2>
      <p className="visit-subtitle"><MapPin size={14}/>{guide?.area || area || 'Pune, Maharashtra'}</p>
      <div className="visit-tags">{tags.flatMap(tag => tag.split(' / ')).map(tag => <span key={tag}>{tag}</span>)}</div>
      <a className="visit-maps-link" href={mapUrl} target="_blank" rel="noopener noreferrer"><span className="maps-pin-mark"><MapPin size={19}/></span><span><b>Open in Google Maps</b><small>Search this place and address</small></span><ExternalLink size={15}/></a>
      {guide && <div className="visit-official-links">{guide.website && <a href={guide.website} target="_blank" rel="noopener noreferrer">Official website <ExternalLink size={12}/></a>}{guide.instagram && <a href={guide.instagram} target="_blank" rel="noopener noreferrer">{guide.instagramLabel || 'Instagram'} <ExternalLink size={12}/></a>}</div>}
      <div className="visit-feature" role="img" aria-label={`Photo of ${title}`}>
        {mediaUrl && (mediaType === 'video' ? <video className="visit-feature-video" src={mediaUrl} muted playsInline autoPlay loop/> : <img className="visit-feature-media" src={mediaUrl} alt={`Photo of ${title}`} />)}
        {!mediaUrl && <div className="visit-feature-empty"><MapPin size={24}/><b>{title}</b><span>Place media coming soon</span></div>}
        <span>{mediaType === 'video' ? <Play size={14} fill="currentColor"/> : <MapPin size={14}/>} {title}</span>
      </div>
      <p className="visit-photo-credit">{photoCredit || guide?.photoCredit || 'Photo: Google Maps contributor'}{mediaType === 'video' && <span> · Reel preview</span>}</p>
      <div className="visit-status"><MapPin size={13}/> Not visited yet</div>
      {guide && <div className="visit-facts" aria-label="At a glance">{guide.status && <div className={guide.status === 'Open' ? 'is-open' : ''}><span>Status</span><b>{guide.status}</b></div>}{guide.rating && <div><span>Rating</span><b>{guide.rating}</b></div>}{guide.shopCategory && <div className="wide"><span>Shop category</span><b>{guide.shopCategory}</b></div>}{guide.restaurantType && <div className="wide"><span>Restaurant type</span><b>{guide.restaurantType}</b></div>}{guide.hours && <div className="wide"><span>Opening hours</span><b>{guide.hours}</b></div>}</div>}
      <div className="visit-section-heading"><span>{category || 'LOCAL GUIDE'}</span><h3>Make it a good visit</h3><p>Thoughtful details to help you plan ahead.</p></div>
      <div className="visit-details" aria-label="Place guide details"><div className="guide-highlight"><span>{activityLabel}</span><b>{guide?.activity || 'Explore the photos and reels shared by the Satvic community.'}</b></div><div><span>Who will love it</span><b>{guide?.audience || 'Anyone looking for a mindful place to explore.'}</b></div><div><span>One useful tip</span><b>{guide?.tip || 'Check current details before you visit.'}</b></div><div><span>Best time to go</span><b>{guide?.timing || 'Choose a time that works for your day.'}</b></div><div><span>Rough spend for one person</span><b>{guide?.spend || 'Varies by place.'}</b></div></div>
      {guide?.whySatvic && <div className="visit-why"><Leaf size={16}/><div><b>Why it is Satvic</b><p>{guide.whySatvic}</p></div></div>}
    </div>
  </section>;
}
