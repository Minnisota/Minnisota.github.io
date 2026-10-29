(function () {
const { Easing, CompositionStage, useComposition } = window;
const E = Easing.easeOutCubic;
const cl = (v) => Math.max(0, Math.min(1, v));
const seg = (p, a, b, e = Easing.easeInOutCubic) => e(cl((p - a) / (b - a)));
const FONT = '"Saira", sans-serif';
const SILVER = { background: 'linear-gradient(180deg,#ffffff 0%,#e4e5e7 55%,#a9abaf 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' };
const LBL = { fontFamily: FONT, fontStretch: '125%', fontWeight: 500, fontSize: 40, letterSpacing: '.16em', lineHeight: 1.15, whiteSpace: 'nowrap', ...SILVER };
const VAL = { fontFamily: FONT, fontStretch: '125%', fontWeight: 600, fontSize: 84, lineHeight: 1.12, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', ...SILVER };
const BODY = { fontFamily: FONT, fontStretch: '100%', fontWeight: 400, fontSize: 44, lineHeight: 1.3, color: '#d4d5d8' };
const SIL = '#e6e7e9';
const rise = (v, y = 18) => ({ opacity: v, transform: `translateY(${(1 - v) * y}px)` });

function fmt(m, k) {
  const thou = /^\d{1,3}(,\d{3})+(\.\d+)?$/.test(m);
  const comma = !thou && m.includes(',');
  const clean = thou ? m.replace(/,/g, '') : m.replace(',', '.');
  const dec = (clean.split('.')[1] || '').length;
  const n = parseFloat(clean) * k;
  if (thou) return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const s = n.toFixed(dec);
  return comma ? s.replace('.', ',') : s;
}
const countUp = (str, k) => String(str ?? '').replace(/\d[\d,]*(?:\.\d+)?/g, (m) => fmt(m.replace(/,$/, ''), k) + (m.endsWith(',') ? ',' : ''));

function Count({ str, k }) {
  return <span style={{ display: 'inline-grid' }}>
    <span style={{ gridArea: '1/1', visibility: 'hidden' }}>{str}</span>
    <span style={{ gridArea: '1/1' }}>{countUp(str, k)}</span>
  </span>;
}
function Value({ str, k, style }) {
  const s = String(str ?? '');
  const m = s.match(/^([^A-Za-z\d]{0,2}\d[\d.,]*)(.*)$/);
  return <div style={style}>
    {m ? <><Count str={m[1]} k={k} /><span style={{ fontSize: '.74em', fontWeight: 500 }}>{m[2]}</span></> : s}
  </div>;
}

function Icon({ kind, p, color, size = 112 }) {
  const d = seg(p, .14, .42), f = seg(p, .36, .5);
  const glow = seg(p, .56, .62) * (1 - seg(p, .62, .8));
  const dash = { pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - d };
  const g = { fill: 'none', stroke: color, strokeWidth: 3.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  let vb = '0 0 60 60', body;
  if (kind === 'logo') body = <g {...g} strokeLinecap="square" strokeLinejoin="miter">
    <path d="M4 4 H56 V56 H4 Z" {...dash} />
    <path d="M24 4 V25 L36 37 V56" {...dash} />
  </g>;
  else if (kind === 'boltCircle') body = <g {...g}>
    <path d="M30 4 A26 26 0 1 1 29.99 4" {...dash} />
    <path d="M33 17 L23 32 H30 L27 43 L37 28 H30 Z" {...dash} strokeWidth="2.4" />
    <path d="M33 17 L23 32 H30 L27 43 L37 28 H30 Z" fill={color} stroke="none" opacity={f} />
  </g>;
  else if (kind === 'bolt') body = <g {...g}>
    <path d="M37 4 L14 34 H28 L22 56 L46 25 H32 Z" {...dash} />
    <path d="M37 4 L14 34 H28 L22 56 L46 25 H32 Z" fill={color} stroke="none" opacity={f} />
  </g>;
  else if (kind === 'gear') {
    let pts = [];
    for (let i = 0; i < 8; i++) { const a = i * 45; [[a - 9, 25], [a + 9, 25], [a + 15, 19], [a + 30, 19]].forEach(([ang, r]) => { const t = (ang - 90) * Math.PI / 180; pts.push(`${(30 + r * Math.cos(t)).toFixed(2)} ${(30 + r * Math.sin(t)).toFixed(2)}`); }); }
    body = <g {...g}>
      <path d={'M' + pts.join(' L') + ' Z'} {...dash} />
      <path d="M30 22 A8 8 0 1 1 29.99 22" {...dash} />
    </g>;
  }
  else if (kind === 'seat') body = <g {...g}>
    <path d="M15 4 H25 Q27 4 27 6 V11 Q27 13 25 13 H15 Q13 13 13 11 V6 Q13 4 15 4 Z" {...dash} />
    <path d="M13 18 L18 41 H44" {...dash} />
    <path d="M18 41 Q17 50 26 50 H46 Q51 50 50 45 Q49 41 44 41" {...dash} />
    <path d="M28 50 V56 M44 50 V56" {...dash} />
  </g>;
  else if (kind === 'shock') body = <g {...g} transform="rotate(32 30 30)">
    <path d="M30 -2 A3.5 3.5 0 1 1 29.99 -2" {...dash} />
    <path d="M30 5 V13" {...dash} />
    <path d="M24 13 H36 V31 H24 Z" {...dash} />
    <path d="M22 33 L38 36 L22 39 L38 42 L22 45 L38 48" {...dash} />
    <path d="M30 49 V55" {...dash} />
    <path d="M30 55 A3.5 3.5 0 1 1 29.99 55" {...dash} />
  </g>;
  else if (kind === 'engine') { vb = '0 -7 60 60'; body = <g {...g}>
    <path d="M21 3 H39" {...dash} /><path d="M30 3 V10" {...dash} />
    <path d="M16 10 H42 L46 16 H50 L56 10 V40 L50 34 H46 V42 H24 L16 34 V30 H10 V36 H5 V16 H10 V22 H16 Z" {...dash} />
  </g>; }
  return <svg viewBox={vb} width={size} height={size} style={{ overflow: 'visible', display: 'block', flex: 'none', filter: `drop-shadow(0 0 ${10 * glow}px ${color})` }}>{body}</svg>;
}

function Bars({ p, O, level }) {
  const k = seg(p, .36, .72, Easing.linear);
  return <svg viewBox="0 0 330 130" width="330" height="130" style={{ display: 'block', flex: 'none', overflow: 'visible' }}>
    {[0, 1, 2, 3, 4].map(i => {
      const w = 34, x = i * 58, h = 50 + i * 18, dx = h * .36, y = 128;
      const pts = `${x},${y} ${x + w},${y} ${x + w + dx},${y - h} ${x + dx},${y - h}`;
      const fr = cl(level * k - i), show = seg(p, .3 + i * .03, .4 + i * .03, E);
      return <g key={i} opacity={show} transform={`translate(0 ${(1 - show) * 14})`}>
        <clipPath id={`bc${i}`}><rect x={x} y={0} width={(w + dx) * fr} height="130" /></clipPath>
        <polygon points={pts} fill="#3d3f43" />
        <polygon points={pts} fill={O} clipPath={`url(#bc${i})`} />
      </g>;
    })}
  </svg>;
}

function Slashes({ p, O }) {
  return <svg viewBox="0 0 120 100" width="120" height="100" style={{ display: 'block', flex: 'none', overflow: 'visible' }}>
    {[0, 1].map(i => { const s = seg(p, .4 + i * .06, .56 + i * .06, E); return <polygon key={i} points={`${8 + i * 40},96 ${34 + i * 40},96 ${74 + i * 40},4 ${48 + i * 40},4`} fill={O} opacity={s} transform={`translate(${(1 - s) * 40} 0)`} />; })}
  </svg>;
}

function VDivider({ p, h = 150 }) {
  const s = seg(p, .3, .5, E);
  return <div style={{ width: 2, height: h, flex: 'none', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,.28) 20%, rgba(255,255,255,.28) 80%, transparent)', transform: `scaleY(${s})` }}></div>;
}
function Rule({ p, w }) {
  return <div style={{ height: 2, width: w, background: 'linear-gradient(90deg, rgba(255,255,255,.3), rgba(255,255,255,.08))', transform: `scaleX(${seg(p, .24, .46, E)})`, transformOrigin: 'left' }}></div>;
}

function Badge({ t }) {
  const { T, authoredTotal } = useComposition();
  const p = authoredTotal > 0 ? (((T % authoredTotal) + authoredTotal) % authoredTotal) / authoredTotal : 0;
  const O = t.accent || '#ff6b0f';
  const ic = t.iconColor === 'accent' ? O : SIL;
  const green = t.greenScreen === true || t.background === 'Green screen';
  const out = t.fadeOut ? seg(p, .9, .99) : 0;
  const inn = seg(p, 0, .14, E), bar = seg(p, .06, .3, E), lbl = seg(p, .2, .34, E);
  const val = seg(p, .26, .36, E), k = seg(p, .26, .62, E), sub = seg(p, .46, .6, E);
  const shine = seg(p, .6, .8), ph = seg(p, .16, .55, E);
  const label = <div style={{ ...LBL, ...rise(lbl, 12), letterSpacing: `${.16 + (1 - lbl) * .1}em` }}>{t.label}</div>;
  const stagger = (i, n) => seg(p, .34 + i * (.24 / Math.max(n, 1)), .46 + i * (.24 / Math.max(n, 1)), E);
  const items = String(t.items || '').split('|').map(s => s.trim()).filter(Boolean);
  const kind = t.kind;
  let content;
  if (kind === 'title') content = <>
    <Icon kind={t.icon} p={p} color={ic} size={112} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ ...rise(lbl, 16), display: 'flex', alignItems: 'baseline', gap: 36, whiteSpace: 'nowrap' }}>
        <span style={{ ...VAL, fontSize: t.wide ? 92 : 70, fontWeight: 500, letterSpacing: `${(t.wide ? .32 : .1) + (1 - lbl) * .12}em` }}>{t.value}</span>
        {t.accentText ? <span style={{ fontFamily: FONT, fontStretch: '125%', fontWeight: 500, fontSize: t.wide ? 78 : 60, letterSpacing: '.08em', color: O, ...rise(sub, 10) }}>{t.accentText}</span> : null}
      </div>
      <div style={{ ...LBL, fontSize: t.wide ? 32 : 44, letterSpacing: t.wide ? '.22em' : '.16em', fontWeight: 400, background: 'none', color: '#b9bbbf', ...rise(sub, 10) }}>{t.sub}</div>
    </div>
    {t.slashes ? <div style={{ marginLeft: 'auto', paddingLeft: 120 }}><Slashes p={p} O={O} /></div> : null}
  </>;
  else if (kind === 'split' || kind === 'energy') content = <>
    <Icon kind={t.icon} p={p} color={ic} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{label}<Value str={t.value} k={k} style={{ ...VAL, ...rise(val, 24) }} /></div>
    <div style={{ marginLeft: 40 }}><VDivider p={p} /></div>
    {kind === 'split'
      ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginLeft: 40 }}>
          <div style={{ ...LBL, ...rise(seg(p, .3, .44, E), 12) }}>{t.l2}</div>
          <Value str={t.v2} k={k} style={{ ...VAL, ...rise(seg(p, .34, .44, E), 24) }} />
        </div>
      : <div style={{ marginLeft: 60 }}><Bars p={p} O={O} level={Number(t.level ?? 2.5)} /></div>}
  </>;
  else if (kind === 'text') content = <>
    <Icon kind={t.icon} p={p} color={ic} size={130} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
      <div style={{ ...LBL, fontSize: 60, fontWeight: 600, ...rise(lbl, 12), letterSpacing: `${.1 + (1 - lbl) * .1}em` }}>{t.label}</div>
      <div style={{ ...BODY, maxWidth: 640, textWrap: 'pretty', ...rise(sub, 14) }}>{t.body}</div>
    </div>
  </>;
  else if (kind === 'features') content = <>
    <Icon kind={t.icon} p={p} color={ic} size={100} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {label}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {items.map((it, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 28, ...rise(stagger(i, items.length), 12) }}>
          {i > 0 ? <div style={{ width: 2, height: 38, background: 'rgba(255,255,255,.3)' }}></div> : null}
          <div style={{ ...BODY, fontSize: 38, whiteSpace: 'nowrap' }}>{it}</div>
        </div>)}
      </div>
    </div>
  </>;
  else if (kind === 'list' || kind === 'dims') {
    const cols = [[t.l1, t.v1], [t.l2, t.v2], [t.l3, t.v3]].filter(c => c[0] || c[1]);
    content = <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}><Icon kind={t.icon} p={p} color={ic} size={84} />{label}</div>
      <Rule p={p} w={kind === 'dims' ? 820 : 520} />
      {kind === 'list'
        ? <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {items.map((it, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, ...rise(stagger(i, items.length), 12) }}>
              <div style={{ width: 12, height: 12, background: O, flex: 'none' }}></div>
              <div style={{ ...BODY, fontSize: 40, whiteSpace: 'nowrap' }}>{it}</div>
            </div>)}
          </div>
        : <div style={{ display: 'flex', alignItems: 'stretch', gap: 44 }}>
            {cols.map((c, i) => <div key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 44, ...rise(stagger(i, cols.length), 16) }}>
              {i > 0 ? <div style={{ width: 2, background: 'rgba(255,255,255,.22)' }}></div> : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ ...LBL, fontSize: 28, fontWeight: 400, letterSpacing: '.12em' }}>{c[0]}</div>
                <Value str={c[1]} k={k} style={{ ...VAL, fontSize: 56 }} />
              </div>
            </div>)}
          </div>}
    </div>;
  }
  else content = <>
    <Icon kind={t.icon} p={p} color={ic} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label}
      <Value str={t.value} k={k} style={{ ...VAL, ...rise(val, 24) }} />
      {t.sub ? <Value str={t.sub} k={k} style={{ ...VAL, fontSize: 60, fontWeight: 400, ...rise(sub, 14) }} /> : null}
    </div>
  </>;
  if (kind === 'name') {
    const open = seg(p, .02, .2, E), brand = seg(p, .24, .38, E), nm = seg(p, .34, .52, E);
    const clip = `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 8px)`;
    return <div style={{ position: 'absolute', inset: 0, background: green ? '#00b140' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: 1146, height: 122, borderRadius: 8, clipPath: clip, opacity: 1 - out, transform: `translateY(${out * -16}px)`, background: 'linear-gradient(180deg,#3a3c40 0%,#26282b 30%,#1c1d20 70%,#141517 100%)', boxShadow: green ? 'none' : '0 20px 60px rgba(0,0,0,.5)' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 12, background: O, boxShadow: `0 4px 18px ${O}88` }}></div>
        <div style={{ position: 'absolute', left: '50%', top: -6, width: 360, height: 24, marginLeft: -180, background: 'radial-gradient(ellipse at center, rgba(255,230,180,.95) 0%, rgba(255,170,80,.4) 35%, transparent 70%)', opacity: .5 + .5 * seg(p, .2, .4) * (1 - seg(p, .5, .7)) }}></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 40, background: 'linear-gradient(176deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,.03) 60%, transparent 61%)' }}></div>
        <div style={{ position: 'absolute', left: '10%', right: '10%', bottom: 0, height: 2, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)' }}></div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(105deg, transparent ${shine * 140 - 30}%, rgba(255,255,255,.08) ${shine * 140 - 15}%, transparent ${shine * 140}%)`, opacity: shine > 0 && shine < 1 ? 1 : 0 }}></div>
        <div style={{ position: 'absolute', left: 28, right: 28, top: 12, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: t.textAlign === 'Right' ? 'flex-end' : t.textAlign === 'Center' ? 'center' : 'flex-start', gap: Number(t.gap ?? 30), transform: `translate(${Number(t.textX ?? 0)}px, ${Number(t.textY ?? 0)}px)` }}>
          {t.showLogo === false ? null : <Icon kind="logo" p={p} color={SIL} size={62} />}
          <div style={{ fontFamily: `"${t.brandFont || 'Saira'}", sans-serif`, fontStretch: (t.brandFont || 'Saira') === 'Saira' ? '125%' : '100%', fontWeight: 400, fontSize: Number(t.brandSize ?? 40), whiteSpace: 'nowrap', color: '#e9eaec', opacity: brand, letterSpacing: `${Number(t.brandSpacing ?? .3) + (1 - brand) * .3}em`, marginRight: -12 }}>{t.brand}</div>
          <div style={{ fontFamily: `"${t.nameFont || 'Saira'}", sans-serif`, fontWeight: Number(t.nameWeight ?? 600), fontSize: Number(t.nameSize ?? 40), letterSpacing: `${Number(t.nameSpacing ?? 0)}em`, whiteSpace: 'nowrap', marginLeft: 14, padding: '6px 0', clipPath: `inset(0 ${(1 - nm) * 100}% 0 0)`, transform: `translateX(${(1 - nm) * -16}px)`, ...SILVER }}>{t.name}</div>
        </div>
      </div>
    </div>;
  }
  const photoW = t.photoW || 660;
  return <div style={{ position: 'absolute', inset: 0, background: green ? '#00b140' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'relative', maxWidth: 1840, borderRadius: 24, overflow: 'hidden', opacity: inn * (1 - out), transform: `translateY(${(1 - inn) * 40 + out * -20}px) scale(${.97 + .03 * inn})`, background: 'linear-gradient(160deg,#232427 0%,#141517 45%,#0b0c0d 100%)', boxShadow: green ? 'none' : '0 30px 80px rgba(0,0,0,.55), inset 0 0 0 2px rgba(255,255,255,.06)' }}>
      {t.photo ? <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: photoW, backgroundImage: `url("${t.photo}")`, backgroundSize: t.photoSize || 'auto 100%', backgroundRepeat: 'no-repeat', backgroundPosition: t.photoPos || 'right center', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 35%)', maskImage: 'linear-gradient(90deg, transparent, #000 35%)', opacity: ph, transform: `translateX(${(1 - ph) * 60}px) scale(${1.06 - .06 * ph})`, transformOrigin: 'right center' }}></div> : null}
      <div style={{ position: 'absolute', left: 0, top: 0, height: 20, width: `${bar * 100}%`, background: `linear-gradient(90deg, ${O} 0%, #ffa24a 55%, ${O} 100%)`, boxShadow: `0 6px 26px ${O}88`, zIndex: 2 }}></div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `linear-gradient(105deg, transparent ${shine * 140 - 30}%, rgba(255,255,255,.07) ${shine * 140 - 15}%, transparent ${shine * 140}%)`, opacity: shine > 0 && shine < 1 ? 1 : 0 }}></div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 64, padding: '68px 88px 52px 68px', paddingRight: t.photo ? photoW * 1.05 : 88 }}>{content}</div>
    </div>
  </div>;
}

function BadgeApp(props) {
  const t = { accent: '#ff6b0f', fadeOut: true, background: 'Black', ...props };
  React.useEffect(() => { const id = setTimeout(() => window.dispatchEvent(new Event('resize')), 300); return () => clearTimeout(id); }, []);
  return <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={(t.greenScreen === true || t.background === 'Green screen') ? '#00b140' : '#000'}>
    <Badge t={t} />
  </CompositionStage>;
}
window.BadgeApp = BadgeApp;
})();
