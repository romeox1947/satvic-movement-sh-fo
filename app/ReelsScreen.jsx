'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, MapPin, MessageCircle, Send, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const demoArai = {
  title: 'ARAI Hills · 1',
  creator: 'what.on.more',
  place: 'Vetal Tekdi (ARAI Hills)',
  caption: 'A little escape into the hills. 🌿',
  cover: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85',
};

let activeReel = null;

function Avatar({ image }) {
  return <span className="avatar" style={{ backgroundImage: `url(https://images.unsplash.com/${image}?auto=format&fit=crop&w=120&h=120&q=80)` }} />;
}

function ReelCard({ reel, onVisit }) {
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const manuallyPaused = useRef(false);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { manuallyPaused.current = false; video.play().then(() => setIsPlaying(true)).catch(() => {}); }
    else { manuallyPaused.current = true; video.pause(); setIsPlaying(false); }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const scrollArea = video.closest('.reels-scroll');
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        if (activeReel && activeReel.video !== video) {
          activeReel.video.pause();
          activeReel.video.muted = true;
          activeReel.resetMute();
        }
        activeReel = { video, resetMute: () => setMuted(true) };
        if (!manuallyPaused.current) video.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
        manuallyPaused.current = false;
        video.muted = true;
        setMuted(true);
        if (activeReel?.video === video) activeReel = null;
      }
    }, { root: scrollArea, threshold: [0, 0.6, 1] });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
      video.muted = true;
      if (activeReel?.video === video) activeReel = null;
    };
  }, [reel.video]);

  return <article className="reel">
    {reel.video ? <video ref={videoRef} className="reel-media" src={reel.video} playsInline loop muted={muted} preload="metadata" onClick={togglePlayback} /> : <div className="reel-media reel-cover" style={{ backgroundImage: `url(${reel.cover})` }} />}
    {reel.video && !isPlaying && <button className="reel-play-toggle" aria-label="Play reel" onClick={togglePlayback}><Play size={34} fill="currentColor"/></button>}
    <div className="reel-shade" />
    <div className="reel-top"><div className="reel-creator"><Avatar image={reel.avatar || 'photo-1500648767791-00dcc994a43e'}/><div><strong>@{reel.creator}</strong><span>{reel.place}</span></div></div><button className={`follow-button ${following ? 'following' : ''}`} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</button><button className="visit-button" onClick={onVisit}>Visit</button></div>
    <div className="reel-meta"><span><MapPin size={14}/>{reel.title}</span><p>{reel.caption || 'A quiet moment in nature. Take a breath and enjoy the view. 🌿'}</p></div>
    <div className="reel-actions"><button className="sound-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn sound on' : 'Mute video'}>{muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}</button><button className={liked ? 'reel-liked' : ''} onClick={() => setLiked(!liked)} aria-label={liked ? 'Unlike reel' : 'Like reel'}><Heart size={27} fill={liked ? 'currentColor' : 'none'}/><span>{liked ? '1.3k' : reel.likes || '1.2k'}</span></button><button aria-label="Comments"><MessageCircle size={25}/><span>{reel.comments || '36'}</span></button><button aria-label="Share reel" onClick={() => navigator.share?.({ title: reel.title, url: window.location.href })}><Send size={23}/><span>Share</span></button></div>
  </article>;
}

export default function ReelsScreen({ previewReel, selectedReel, onVisit }) {
  const [reels, setReels] = useState([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/reels', { signal: controller.signal })
      .then(response => response.ok ? response.json() : { reels: [] })
      .then(data => setReels(data.reels || []))
      .catch(error => { if (error.name !== 'AbortError') setReels([]); });
    return () => controller.abort();
  }, []);

  const araiReel = reels.find(reel => /arai|vetal tekdi/i.test(`${reel.title} ${reel.place}`));
  const firstReel = selectedReel || araiReel || demoArai;
  const queue = [firstReel, ...reels.filter(reel => reel !== araiReel && reel.video !== firstReel.video && reel.url !== firstReel.video)];
  if (previewReel) queue.splice(1, 0, previewReel);

  return <section className="reels-view" aria-label="Reels">
    <div className="reels-scroll">{queue.map((reel, index) => <ReelCard reel={reel} onVisit={onVisit} key={`${reel.src || reel.video || reel.title}-${index}`} />)}</div>
    <span className="reels-hint"><Play size={12} fill="currentColor"/> Swipe up for more</span>
  </section>;
}
