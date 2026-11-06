'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, MapPin, MessageCircle, Send, Volume2, VolumeX, Play, Leaf } from 'lucide-react';
import { getPlaceGuide } from './placeGuides';
import VisitDock from './VisitDock';

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
  const [visitOpen, setVisitOpen] = useState(false);

  function openVisit() {
    setVisitOpen(true);
    if (videoRef.current) videoRef.current.pause();
  }

  function closeVisit() {
    setVisitOpen(false);
    if (videoRef.current && !manuallyPaused.current) videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }

  const sourcePlaceText = reel.place || 'A mindful place';
  const isArai = /arai|vetal tekdi/i.test(`${reel.title || ''} ${sourcePlaceText}`);
  const placeText = isArai ? 'ARAI Hills' : sourcePlaceText;
  const isPashan = /pashan lake/i.test(`${reel.title || ''} ${sourcePlaceText}`);
  const isEmpress = /empress botanical/i.test(`${reel.title || ''} ${sourcePlaceText}`);
  const placeGuide = getPlaceGuide(sourcePlaceText);
  const displayPlace = isPashan ? 'Pashan Lake' : isEmpress ? 'Empress Botanical Garden' : placeGuide?.name || placeText;
  const isNaturePlace = /hills|tekdi|lake|garden/i.test(placeText);
  const isShop = /adrish|organic|shop/i.test(placeText);
  const isCountryside = /countryside kitchen/i.test(placeText);
  const isAdrish = /adrish/i.test(placeText);
  const fallbackGuide = isArai
    ? { activity: 'Visitors can engage in brisk walking, trail running, or casual hiking along the natural, unpaved pathways traversing the hill. The elevated landscape features clear viewpoints overlooking the city skyline, making it a popular spot for photography, bird watching, and peaceful outdoor meditation or yoga amidst the green surroundings.', audience: 'This location is perfect for the nature-oriented Satvic traveler, fitness enthusiasts, early morning walkers, and anyone seeking a quiet, meditative escape from the urban noise to connect deeply with nature and fresh air.', tip: 'The trails are unpaved, uneven, and can become slippery, so wearing sturdy sports or hiking shoes with good grip is highly recommended.', timing: 'Early mornings (6:00 AM to 8:00 AM) or late afternoons (4:30 PM to 6:30 PM). The monsoon and post-monsoon seasons (June to October) offer the most lush green landscapes.', spend: '₹0 (Free entry). There are no activity fees or commercial ticketing facilities at this natural site.', whySatvic: 'It serves as a sanctuary of peace, fostering a strong connection with nature through physical movement and mindfulness. The serene environment, fresh air, and lack of commercialization provide an ideal setting for mental rejuvenation and quiet contemplation.' }
    : isPashan
      ? { activity: 'Visitors can engage in peaceful birdwatching to spot migratory birds at this artificial lake. The designated trail alongside the water is ideal for quiet nature walks, running, or light jogging among bamboo plantations. The peaceful banks offer space for mindfulness, meditation, or resting by the water.', audience: 'Nature lovers, birdwatchers, photographers, and Satvic travelers looking for a calm escape from the city.', tip: 'Ask local residents or nearby shops for directions to the most accessible trail entrance; the main path can be tricky to find.', timing: 'Early winter mornings, November to February, are best for migratory birds and cooler weather.', spend: 'Free entry. No standard entry fees or formal activity charges.', whySatvic: 'The tranquil water, bamboo, and birdlife encourage a deep connection with nature, low-impact movement, and mental clarity.' }
      : isEmpress
        ? { activity: 'Explore winding paths beneath a dense canopy of century-old trees across this sprawling 39-acre estate. Discover the rose and Japanese gardens, historic greenhouse, palm groves, and seasonal beds. Look for weekend tree walks led by ecological experts, heritage walks, and Artful Sunday workshops.', audience: 'Plant enthusiasts, birdwatchers, families, and Satvic visitors seeking a quiet green space to slow down and reconnect with nature.', tip: 'Carry cash for entry and parking; the ticket counter and parking facilities do not accept digital or card payments.', timing: 'Winter mornings are best for cooler weather. Late January is a highlight for the annual Buds and Blooms flower show.', spend: '₹20 adult entry (₹60 during the January flower show). Parking: ₹10 two-wheeler, ₹20 car, ₹50 bus.', whySatvic: 'Its peaceful environment, mature tree canopy, and ecological activities invite visitors to slow down and connect mindfully with nature.' }
      : placeGuide ||
        (isNaturePlace
          ? { activity: 'Walk the shaded trail to the viewpoint.', audience: 'Someone looking for a calm morning outdoors.', tip: 'Sample tip: arrive early, before the trail gets busy.', timing: 'Weekdays · 6:00–8:00 AM', spend: 'Free' }
          : isShop
            ? { activity: 'Browse refill staples and locally made pantry goods.', audience: 'Someone who wants to make everyday shopping lower waste.', tip: 'Sample tip: bring your own bags and containers.', timing: 'Weekdays · 11:00 AM–5:00 PM', spend: 'Varies by purchase' }
          : { activity: 'Try the seasonal meal with a fresh local side.', audience: 'Friends or families looking for a relaxed meal.', tip: 'Sample tip: visit outside the lunch rush for a quieter table.', timing: 'Weekdays · 12:00–2:00 PM', spend: '₹300–₹500' });
  const sampleGuide = placeGuide || fallbackGuide;
  const placePhoto = reel.cover || (isCountryside ? '/assets/Places%20to%20eat/Countryside%20Kitchen/1.jpeg' : isAdrish ? '/assets/Places%20to%20shop/Adrish%20Zero%20Waste%20Organic%20Store/1.jpeg' : isArai || isPashan || isEmpress || placeGuide ? '' : 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85');
  const placeArea = isArai ? 'Rambaug Colony, Kothrud, Pune, Maharashtra 411038, India' : isPashan ? 'Pashan, Pune, Maharashtra 411021' : isEmpress ? 'Kavade Mala, Ghorpadi, near Pune Race Course, Pune, Maharashtra 411001, India' : placeGuide?.area || reel.area || reel.city || 'Pune';
  const visitCategory = isShop ? 'Places to shop' : isNaturePlace ? 'Experiences' : 'Places to visit';

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
    <div className="reel-top"><div className="reel-creator"><Avatar image={reel.avatar || 'photo-1500648767791-00dcc994a43e'}/><div><strong>@{reel.creator}</strong><span>{reel.place}</span></div></div><button className={`follow-button ${following ? 'following' : ''}`} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</button><button className="visit-button" onClick={openVisit}>Visit</button></div>
    <div className="reel-meta"><span><MapPin size={14}/>{reel.title}</span><p>{reel.caption || 'A quiet moment in nature. Take a breath and enjoy the view. 🌿'}</p></div>
    <div className="reel-actions"><button className="sound-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn sound on' : 'Mute video'}>{muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}</button><button className={liked ? 'reel-liked' : ''} onClick={() => setLiked(!liked)} aria-label={liked ? 'Unlike reel' : 'Like reel'}><Heart size={27} fill={liked ? 'currentColor' : 'none'}/><span>{liked ? '1.3k' : reel.likes || '1.2k'}</span></button><button aria-label="Comments"><MessageCircle size={25}/><span>{reel.comments || '36'}</span></button><button aria-label="Share reel" onClick={() => navigator.share?.({ title: reel.title, url: window.location.href })}><Send size={23}/><span>Share</span></button></div>
    <VisitDock place={displayPlace} area={placeArea} guide={sampleGuide} category={visitCategory} mediaUrl={placePhoto || reel.video} mediaType={placePhoto ? 'image' : 'video'} photoCredit={placeGuide?.photoCredit || (isArai || isPashan || isEmpress ? 'Google Maps contributor photo' : reel.creator ? `@${reel.creator}` : 'Google Maps contributor photo')} isOpen={visitOpen} onClose={closeVisit} closeLabel="Back" />
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
