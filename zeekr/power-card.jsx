(function () {
const { Easing, CompositionStage, useComposition } = window;
const cl = (v) => Math.max(0, Math.min(1, v));
const seg = (p, a, b, e = Easing.easeInOutCubic) => e(cl((p - a) / (b - a)));
const countUp = (str, k) => String(str).replace(/\d+(?:[.,]\d+)?/g, (m) => {
  const dec = (m.split(/[.,]/)[1] || '').length, sep = m.includes(',') ? ',' : '.';
  return (parseFloat(m.replace(',', '.')) * k).toFixed(dec).replace('.', sep);
});
const SILVER = { background: 'linear-gradient(180deg,#ffffff 0%,#e4e5e7 55%,#a9abaf 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };

function Engine({ p, O }) {
  const d = seg(p, .14, .4);
  const glow = seg(p, .56, .62) * (1 - seg(p, .62, .78));
  const dash = { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - d };
  return <svg viewBox="0 0 60 46" width="150" height="115" style={{ overflow: 'visible', display: 'block', filter: `drop-shadow(0 0 ${10 * glow}px ${O})` }}>
    <g fill="none" stroke={O} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 H39" {...dash} />
      <path d="M30 3 V10" {...dash} />
      <path d="M16 10 H42 L46 16 H50 L56 10 V40 L50 34 H46 V42 H24 L16 34 V30 H10 V36 H5 V16 H10 V22 H16 Z" {...dash} />
    </g>
  </svg>;
}

function Card({ t }) {
  const { T, authoredTotal } = useComposition();
  const p = authoredTotal > 0 ? (((T % authoredTotal) + authoredTotal) % authoredTotal) / authoredTotal : 0;
  const O = t.accent || '#ff6b0f';
  const out = t.fadeOut ? seg(p, .9, .99) : 0;
  const inn = seg(p, 0, .14, Easing.easeOutCubic);
  const bar = seg(p, .06, .3, Easing.easeOutCubic);
  const lbl = seg(p, .2, .34, Easing.easeOutCubic);
  const k = seg(p, .26, .62, Easing.easeOutCubic);
  const val = seg(p, .26, .34, Easing.easeOutCubic);
  const sub = seg(p, .48, .6, Easing.easeOutCubic);
  const shine = seg(p, .6, .8, Easing.easeInOutCubic);
  const rise = (v, y = 18) => ({ opacity: v, transform: `translateY(${(1 - v) * y}px)` });
  return <div style={{ position: 'absolute', inset: 0, background: t.greenScreen ? '#00b140' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 1032, height: 496, position: 'relative', borderRadius: 26, overflow: 'hidden', opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 40 + out * -20}px) scale(${.97 + .03 * inn})`, background: 'linear-gradient(160deg,#232427 0%,#141517 45%,#0b0c0d 100%)', boxShadow: t.greenScreen ? 'inset 0 0 0 2px rgba(255,255,255,.06)' : '0 30px 80px rgba(0,0,0,.55), inset 0 0 0 2px rgba(255,255,255,.06)', fontFamily: '"Saira", sans-serif', fontStretch: '125%' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: 40, width: `${bar * 100}%`, background: `linear-gradient(90deg, ${O} 0%, #ffa24a 55%, ${O} 100%)`, boxShadow: `0 6px 26px ${O}88` }}></div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(105deg, transparent ${shine * 140 - 30}%, rgba(255,255,255,.07) ${shine * 140 - 15}%, transparent ${shine * 140}%)`, opacity: shine > 0 && shine < 1 ? 1 : 0 }}></div>
      <div style={{ position: 'absolute', left: 82, top: 112 }}><Engine p={p} O={O} /></div>
      <div style={{ position: 'absolute', left: 316, top: 92, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...rise(lbl, 12), fontSize: 56, fontWeight: 500, letterSpacing: `${.08 + (1 - lbl) * .12}em`, lineHeight: 1.1, ...SILVER }}>{t.label}</div>
        <div style={{ ...rise(val, 24), fontSize: 104, fontWeight: 600, lineHeight: 1.15, marginTop: 14, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', ...SILVER }}>{countUp(t.value, k)}</div>
        <div style={{ ...rise(sub, 14), fontSize: 62, fontWeight: 400, lineHeight: 1.15, marginTop: 4, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: '#d7d8db' }}>{countUp(t.sub, k)}</div>
      </div>
    </div>
  </div>;
}

function PowerCardApp(props) {
  const t = { label: 'POWER', value: '400 kW', sub: '(544 hp)', accent: '#ff6b0f', fadeOut: true, transparent: false, ...props };
  React.useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const id = setTimeout(fire, 300);
    return () => clearTimeout(id);
  }, []);
  return <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={t.greenScreen ? '#00b140' : '#000'}>
    <Card t={t} />
  </CompositionStage>;
}
window.PowerCardApp = PowerCardApp;
})();
