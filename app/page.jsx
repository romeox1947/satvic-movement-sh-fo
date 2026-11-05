'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Heart, MessageCircle, Send, Bookmark, Plus, House, Search, CirclePlus, UsersRound, Leaf, MoreHorizontal, Clapperboard, UserRound, Signal, Wifi, BatteryFull } from 'lucide-react';

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
  { name: 'satvic.community', place: 'Rishikesh, Uttarakhand', image: 'photo-1470770841072-f978cf4d019e', caption: 'A little reminder to pause, breathe, and come back to yourself. 🌿', likes: '2,481', avatar: 'photo-1534528741775-53994a69daeb' },
  { name: 'earthy.with.isha', place: 'Community kitchen', image: 'photo-1547592180-85f173990554', caption: 'Simple ingredients, a nourishing plate, and a grateful heart. What’s on your plate today?', likes: '896', avatar: 'photo-1531123897727-8f129e1688ce' },
];

function Avatar({ image, className = '' }) {
  return <span className={`avatar ${className}`} style={{ backgroundImage: image ? `url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=120&h=120&q=80)` : undefined }}>{!image && <Leaf size={19} />}</span>;
}

function FeedPost({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return <article className="post-card">
    <div className="post-head"><Avatar image={post.avatar} /><div className="post-user"><strong>{post.name}</strong><span>{post.place}</span></div><button className="icon-button" aria-label="More options"><MoreHorizontal size={21}/></button></div>
    <div className="post-photo" style={{ backgroundImage: `url(https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=1000&q=85)` }} role="img" aria-label="A moment from the Satvic community" />
    <div className="post-actions"><div><button onClick={() => setLiked(!liked)} className={`icon-button ${liked ? 'liked' : ''}`} aria-label={liked ? 'Unlike' : 'Like'}><Heart size={23} fill={liked ? 'currentColor' : 'none'}/></button><button className="icon-button" aria-label="Comment"><MessageCircle size={22}/></button><button className="icon-button" aria-label="Share"><Send size={21}/></button></div><button onClick={() => setSaved(!saved)} className="icon-button" aria-label={saved ? 'Remove bookmark' : 'Save post'}><Bookmark size={22} fill={saved ? 'currentColor' : 'none'}/></button></div>
    <div className="post-copy"><strong>{post.likes} likes</strong><p><b>{post.name}</b> {post.caption}</p><button className="comments">View all 38 comments</button><span className="post-time">2 HOURS AGO</span></div>
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
    {active === 'Reels' ? <ReelsScreen previewReel={previewReel} selectedReel={selectedReel} onVisit={() => setActive('Search')} /> : active === 'Search' ? <ExploreScreen onOpenReel={openExploreReel} /> : active === 'Home' ? <><section className="stories" aria-label="Stories"><div className="stories-row">{stories.map((story) => <button className="story" key={story.name}><span className={`story-ring ${story.own ? 'own' : ''}`}><Avatar image={story.image} /></span><span className="story-name">{story.own ? 'Your story' : story.name}</span>{story.own && <span className="story-add"><Plus size={12}/></span>}</button>)}</div></section><div className="feed-label"><span>From your community</span><button>For you <span>⌄</span></button></div><section className="feed">{posts.map(post => <FeedPost key={post.name} post={post}/>)}</section></> : <section className="simple-tab"><div className="simple-tab-icon">{active === 'Community' ? <UsersRound size={28}/> : active === 'Account' ? <UserRound size={28}/> : <CirclePlus size={28}/>}</div><h1>{active}</h1><p>{active === 'Community' ? 'Find mindful places, people, and experiences shared by the Satvic community.' : active === 'Account' ? 'Your Satvic profile and saved moments.' : 'Choose a video to share with the community.'}</p>{active === 'Upload' && <button className="upload-cta" onClick={() => document.getElementById('reel-upload')?.click()}><Plus size={18}/> Choose a video</button>}</section>}
    <nav className="bottom-nav" aria-label="Main navigation">{[[House,'Home'],[Search,'Search'],[CirclePlus,'Upload'],[Clapperboard,'Reels'],[null,'Account']].map(([Icon,label]) => <button key={label} onClick={() => navTo(label)} className={active === label ? 'selected' : ''} aria-label={label} title={label}>{Icon ? <Icon size={label === 'Upload' ? 25 : 23} strokeWidth={active === label ? 2.5 : 1.9}/> : <Avatar image="photo-1534528741775-53994a69daeb" className="nav-avatar"/>}<span>{label}</span></button>)}</nav>
  </main>;
}
