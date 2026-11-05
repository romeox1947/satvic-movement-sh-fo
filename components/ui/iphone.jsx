export function Iphone({ className = '', ...props }) {
  return (
    <div className={`magic-iphone-frame ${className}`} aria-hidden="true" {...props}>
      <svg viewBox="0 0 433 882" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="iphoneBody" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f7f7f7"/><stop offset=".14" stopColor="#777b7a"/><stop offset=".32" stopColor="#141817"/><stop offset=".72" stopColor="#050706"/><stop offset=".9" stopColor="#858a88"/><stop offset="1" stopColor="#e3e5e4"/>
          </linearGradient>
          <linearGradient id="iphoneInner" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#202322"/><stop offset=".45" stopColor="#030404"/><stop offset="1" stopColor="#252827"/>
          </linearGradient>
        </defs>
        <rect x="8" y="7" width="417" height="868" rx="70" fill="none" stroke="url(#iphoneBody)" strokeWidth="13"/>
        <rect x="15" y="14" width="403" height="854" rx="64" fill="none" stroke="url(#iphoneInner)" strokeWidth="3"/>
        <rect x="0" y="171" width="5" height="35" rx="2.5" fill="#626765"/>
        <rect x="0" y="235" width="5" height="70" rx="2.5" fill="#626765"/>
        <rect x="0" y="319" width="5" height="70" rx="2.5" fill="#626765"/>
        <rect x="428" y="280" width="5" height="105" rx="2.5" fill="#626765"/>
        <rect x="154" y="30" width="124" height="39" rx="20" fill="#020303"/>
        <circle cx="260" cy="49" r="8" fill="#080c18"/>
        <circle cx="260" cy="49" r="4" fill="#15213e"/>
      </svg>
    </div>
  );
}
