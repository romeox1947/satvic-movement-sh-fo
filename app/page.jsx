'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { getPlaceGuide } from './placeGuides';
import VisitDock from './VisitDock';
import { Heart, MessageCircle, Send, Bookmark, Plus, House, Search, CirclePlus, UsersRound, Leaf, MoreHorizontal, Clapperboard, UserRound, Signal, Wifi, BatteryFull, Settings2, MapPin, ImagePlus, Video, ChevronRight, ArrowUpRight } from 'lucide-react';

const ReelsScreen = dynamic(() => import('./ReelsScreen'), { ssr: false, loading: () => <section className="reels-loading">Loading reels…</section> });
const ExploreScreen = dynamic(() => import('./ExploreScreen'), { ssr: false, loading: () => <section className="explore-loading">Loading Pune…</section> });

const stories = [
  { name: 'Your day', image: '', own: true },
  { name: 'Aarav', image: 'photo-1500648767791-00dcc994a43e' },
  { name: 'Meera', image: 'photo-1534528741775-53994a69daeb' },
  { name: 'Rohan', image: 'photo-1506794778202-cad84cf45f1d' },
  { name: 'Ananya', image: 'photo-1531123897727-8f129e1688ce' },
  { name: 'Sahil', image: 'photo-1506794778202-cad84cf45f1d' },
];

const posts = [
  { name: 'countrysidekitchenofficial', place: 'Countryside Kitchen', images: [1, 2, 3, 4].map(number => `/assets/Places%20to%20eat/Countryside%20Kitchen/${number}.jpeg`), caption: 'Fresh, local ingredients and a little countryside calm. Come by for a nourishing meal.', likes: '2,481', avatar: 'photo-1534528741775-53994a69daeb' },
  { name: 'adrish.zerowaste', place: 'Adrish Zero Waste Organic Store', images: [1, 2, 3, 4].map(number => `/assets/Places%20to%20shop/Adrish%20Zero%20Waste%20Organic%20Store/${number}.jpeg`), caption: 'Thoughtful everyday essentials, chosen with the planet in mind.', likes: '896', avatar: 'photo-1531123897727-8f129e1688ce' },
];

function Avatar({ image, className = '' }) {
  return <span className={`avatar ${className}`} style={{ backgroundImage: image ? `url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=120&h=120&q=80)` : undefined }}>{!image && <Leaf size={19} />}</span>;
}

function FeedPost({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const carouselRef = useRef(null);
  const postImages = post.images || [`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1000&q=85`];
  const coverImage = postImages[activeImage] || postImages[0];
  const placeGuide = getPlaceGuide(post.place);
  const isKitchen = /kitchen|cafe/i.test(post.place);
  const isShop = /adrish|organic|shop/i.test(post.place);
  const guide = placeGuide || (isKitchen
    ? { activity: 'Try the seasonal thali with a local chutney.', audience: 'Friends or families looking for a relaxed meal.', tip: 'Sample tip: visit outside the lunch rush for a quieter table.', timing: 'Weekdays · 12:00–2:00 PM', spend: '₹300–₹500' }
    : isShop
      ? { activity: 'Browse organic pantry staples and refill-friendly goods.', audience: 'Someone looking for thoughtful, lower-waste essentials.', tip: 'Sample tip: bring your own shopping bags.', timing: 'Weekdays · 11:00 AM–5:00 PM', spend: 'Varies by purchase' }
      : { activity: 'Take a quiet walk and enjoy the view.', audience: 'Someone looking for a calm morning outdoors.', tip: 'Sample tip: arrive early before it gets busy.', timing: 'Weekdays · 6:00–8:00 AM', spend: 'Free' });
  return <article className="post-card">
    <div className="post-head"><Avatar image={post.avatar} /><div className="post-user"><strong>{post.name}</strong><span>{post.place}</span></div><button className="icon-button" aria-label="More options"><MoreHorizontal size={21}/></button></div>
    <div className="post-carousel-wrap"><div className="post-carousel" ref={carouselRef} onScroll={event => setActiveImage(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}>{postImages.map((image, index) => <div className="post-carousel-slide" key={image}><img src={image} alt={`${post.place}, photo ${index + 1} of ${postImages.length}`} loading={index === 0 ? 'eager' : 'lazy'} /><span className="image-credit">© Google Maps</span></div>)}</div>{postImages.length > 1 && <div className="post-carousel-dots" aria-label={`Photo ${activeImage + 1} of ${postImages.length}`}>{postImages.map((image, index) => <button key={image} className={activeImage === index ? 'active' : ''} aria-label={`Show photo ${index + 1}`} onClick={() => carouselRef.current?.scrollTo({ left: carouselRef.current.clientWidth * index, behavior: 'smooth' })}/>)}</div>}</div>
    <div className="post-actions"><button className="post-visit-button" onClick={() => setVisitOpen(true)}><MapPin size={14}/><span>Visit</span><ArrowUpRight size={13}/></button><div><button onClick={() => setLiked(!liked)} className={`icon-button ${liked ? 'liked' : ''}`} aria-label={liked ? 'Unlike' : 'Like'}><Heart size={23} fill={liked ? 'currentColor' : 'none'}/></button><button className="icon-button" aria-label="Comment"><MessageCircle size={22}/></button><button className="icon-button" aria-label="Share"><Send size={21}/></button></div><button onClick={() => setSaved(!saved)} className="icon-button" aria-label={saved ? 'Remove bookmark' : 'Save post'}><Bookmark size={22} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="post-copy"><strong>{post.likes} likes</strong><p><b>{post.name}</b> {post.caption}</p><button className="comments">View all 38 comments</button><span className="post-time">2 HOURS AGO</span></div>
    <VisitDock place={post.place} area={placeGuide?.area || "Pune, Maharashtra, India"} guide={guide} category={placeGuide?.shopCategory ? "Places to shop" : placeGuide?.restaurantType ? "Places to visit" : "Experiences"} mediaUrl={post.video || coverImage} mediaType={post.video ? "video" : "image"} photoCredit={placeGuide?.photoCredit || "Google Maps contributor photo"} isOpen={visitOpen} onClose={() => setVisitOpen(false)} className="post-place-dock" closeLabel="Back to post" />
  </article>;
}

export default function Page() {
  const [active, setActive] = useState('Home');
  const [previewReel, setPreviewReel] = useState(null);
  const [selectedReel, setSelectedReel] = useState(null);
  const [insidePhoneFrame, setInsidePhoneFrame] = useState(false);
  useEffect(() => {
    const framed = window.self !== window.top;
    setInsidePhoneFrame(framed);
    if (framed) {
      document.documentElement.classList.add('iphone-preview');
      document.body.classList.add('iphone-preview');
    }
    return () => {
      document.documentElement.classList.remove('iphone-preview');
      document.body.classList.remove('iphone-preview');
    };
  }, []);
  function navTo(label) {
    if (label === 'Reels') setSelectedReel(null);
    setActive(label);
    if (label === 'Upload') document.getElementById('reel-upload')?.click();
  }
  function openExploreReel(reel) { setSelectedReel(reel); setActive('Reels'); }
  return <main className="social-app">
    {insidePhoneFrame && <div className="phone-status-bar"><span>9:41</span><span><Signal size={13}/><Wifi size={14}/><BatteryFull size={17}/></span></div>}
    <header className="topbar"><a href="#home" className="wordmark">satvic</a><div className="top-actions"><button className="icon-button" aria-label="Activity"><Heart size={22}/></button><button className="icon-button messages" aria-label="Messages"><Send size={21}/></button></div></header>
    <input id="reel-upload" className="visually-hidden" type="file" accept="video/*" onChange={event => { const file = event.target.files?.[0]; if (file) { setPreviewReel({ title: file.name.replace(/\.[^.]+$/, ''), creator: 'you', video: URL.createObjectURL(file), place: 'Your new reel' }); setActive('Reels'); } }} />
    {active === 'Reels' ? <ReelsScreen previewReel={previewReel} selectedReel={selectedReel} onVisit={() => setActive('Search')} /> : active === 'Search' ? <ExploreScreen onOpenReel={openExploreReel} /> : active === 'Home' ? <><section className="stories" aria-label="Stories"><div className="stories-row">{stories.map((story) => <button className="story" key={story.name}><span className={`story-ring ${story.own ? 'own' : ''}`}><Avatar image={story.image} /></span><span className="story-name">{story.own ? 'Your story' : story.name}</span>{story.own && <span className="story-add"><Plus size={12}/></span>}</button>)}</div></section><div className="feed-label"><span>From your community</span><button>For you <span>⌄</span></button></div><section className="feed">{posts.map(post => <FeedPost key={post.name} post={post}/>)}</section></> : active === 'Account' ? <section className="profile-screen"><div className="profile-heading"><div><span className="section-eyebrow">YOUR SPACE</span><h1>Your profile</h1></div><button className="profile-settings" aria-label="Profile settings"><Settings2 size={19}/></button></div><div className="profile-identity"><Avatar image="photo-1534528741775-53994a69daeb"/><div><h2>Meera Sharma</h2><span>@meera.moves</span></div><button aria-label="Edit profile">Edit</button></div><p className="profile-bio">Finding balance in simple food, mindful movement, and time outdoors. <Leaf size={14}/></p><div className="profile-location"><MapPin size={14}/> Pune, India</div><div className="profile-stats"><div><b>18</b><span>Moments</span></div><div><b>642</b><span>Followers</span></div><div><b>318</b><span>Following</span></div></div><div className="profile-section-title"><div><span className="section-eyebrow">COLLECTED WITH CARE</span><h2>Saved moments</h2></div><button aria-label="View saved moments"><ChevronRight size={18}/></button></div><div className="profile-collections"><div style={{backgroundImage:'url(https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80)'}}><span>Quiet places</span></div><div style={{backgroundImage:'url(https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80)'}}><span>Everyday nourishment</span></div></div><button className="profile-share" onClick={() => navTo('Upload')}><Plus size={17}/> Share a moment</button></section> : active === 'Upload' ? <section className="upload-screen"><span className="section-eyebrow">SHARE WITH YOUR COMMUNITY</span><h1>A moment worth sharing.</h1><p>Little things can make someone’s day feel lighter. Add a video from a mindful place, meal, or moment.</p><button className="upload-dropzone" onClick={() => document.getElementById('reel-upload')?.click()}><span><Video size={22}/></span><b>Choose a video</b><small>MP4 or MOV · up to 60 seconds</small><em><ImagePlus size={17}/> Browse your device</em></button><div className="upload-note"><Leaf size={15}/><span>Keep it kind, uplifting, and true to your experience.</span></div></section> : <section className="simple-tab"><div className="simple-tab-icon"><UsersRound size={28}/></div><span className="section-eyebrow">GROW TOGETHER</span><h1>Community</h1><p>Find mindful places, people, and experiences shared by the Satvic community.</p><button className="upload-cta" onClick={() => navTo('Search')}><Search size={17}/> Explore places</button></section>}
    <nav className="bottom-nav" aria-label="Main navigation">{[[House,'Home'],[Search,'Search'],[CirclePlus,'Upload'],[Clapperboard,'Reels'],[null,'Account']].map(([Icon,label]) => <button key={label} onClick={() => navTo(label)} className={active === label ? 'selected' : ''} aria-label={label} title={label}>{Icon ? <Icon size={label === 'Upload' ? 25 : 23} strokeWidth={active === label ? 2.5 : 1.9}/> : <Avatar image="photo-1534528741775-53994a69daeb" className="nav-avatar"/>}<span>{label}</span></button>)}</nav>
  </main>;
}
