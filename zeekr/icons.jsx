(function () {
const { Easing, CompositionStage, useComposition, useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakSelect, TweakColor } = window;

const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
const cl = (v) => Math.max(0, Math.min(1, v));
const seg = (p, a, b, e = MOTION.draw) => e(cl((p - a) / (b - a)));
const bump = (p, a, b, c) => seg(p, a, b) * (1 - seg(p, b, c));
const S = '#d9dadd', G = '#34363a', W = '#f4f4f2';
const base = { fill: 'none', stroke: S, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' };
const drawP = (d, u = 0) => ({ pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: u > 0 ? -u : 1 - d, opacity: d > 0.003 && u < 0.997 ? 1 : 0 });
const sc = (s, cx, cy) => `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`;
const pt = (cx, cy, r, a) => { const t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
const arc = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
const BOLT = 'M55 30 L39 54 H50 L46 70 L62 46 H51 Z';

function CarSide({ sw = 4 }) {
  return <g fill="none" stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18 H2 V12 Q2 9 6 8.5 L10 8 L15 2.5 Q16.5 1 19 1 L26 1 Q29 1 31.5 3.5 L35 8 Q39 8.5 39 12 V18 H37" />
    <path d="M13 18 H27" /><path d="M10 8 H35" />
    <circle cx="8" cy="18" r="4" /><circle cx="32" cy="18" r="4" />
  </g>;
}
function CarFront({ sw = 3, lights = S, lightsOp = 1 }) {
  return <g fill="none" stroke={S} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 9 L10 3 Q11 1.5 13 1.5 H19 Q21 1.5 22 3 L25 9" />
    <path d="M4 9 H28 Q31 9 31 12 V18 H1 V12 Q1 9 4 9 Z" />
    <path d="M4 18 V21 H9 V18 M23 18 V21 H28 V18" />
    <path d="M1 9 H-1 M31 9 H33" />
    <path d="M4.5 13 H9 M23 13 H27.5" stroke={lights} opacity={lightsOp} />
  </g>;
}

function Tire({ p, O }) {
  const sw = seg(p, .06, .4) - seg(p, .84, .98);
  const pop = seg(p, .36, .5, MOTION.pop) * (1 - seg(p, .84, .96, MOTION.enter));
  const ring = seg(p, .5, .82, MOTION.enter);
  const cx = 42, cy = 50;
  return <g {...base}>
    <circle cx={cx} cy={cy} r="36" />
    <g strokeWidth="3.5">{[...Array(12)].map((_, i) => { const a = i * 30 + p * 30; const [x0, y0] = pt(cx, cy, 27, a), [x1, y1] = pt(cx, cy, 32, a); return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} />; })}</g>
    <circle cx={cx} cy={cy} r="20" />
    <line x1={cx} y1={cy} x2={cx} y2={cy - 13} strokeWidth="3.5" transform={`rotate(${-60 * sw} ${cx} ${cy})`} />
    <circle cx={cx} cy={cy} r="2.6" fill={S} stroke="none" />
    <g transform={sc(Math.max(pop, 0.001), 72, 70)} opacity={pop > 0.01 ? 1 : 0}>
      <circle cx="72" cy="70" r={14 + 10 * ring} stroke={O} strokeWidth="2" opacity={ring > 0 && ring < 1 ? (1 - ring) * .8 : 0} />
      <circle cx="72" cy="70" r="14" fill="#000" stroke={O} />
      <line x1="72" y1="63.5" x2="72" y2="70.5" stroke={W} />
      <circle cx="72" cy="76.5" r="2.2" fill={W} stroke="none" />
    </g>
  </g>;
}

function Docs({ p, O }) {
  const f = 1 - seg(p, .84, .96);
  return <g {...base}>
    <path d="M58 12 H28 Q22 12 22 18 V84 Q22 90 28 90 H72 Q78 90 78 84 V32" />
    <path d="M64 12 L78 26 H64 Z" />
    <g transform="translate(34 28)"><CarFront /></g>
    <g opacity={f}>
      <line x1="32" y1="62" x2="68" y2="62" stroke={O} {...drawP(seg(p, .08, .28))} />
      <line x1="32" y1="72" x2="68" y2="72" {...drawP(seg(p, .2, .4))} />
      <line x1="32" y1="82" x2="52" y2="82" {...drawP(seg(p, .32, .44))} />
      <line x1="58" y1="82" x2="68" y2="82" {...drawP(seg(p, .42, .5))} />
    </g>
  </g>;
}

function BattFull({ p, O }) {
  const f = 1 - seg(p, .86, .97);
  const glow = bump(p, .56, .62, .76);
  return <g {...base} transform={sc(1 + .03 * glow, 50, 50)}>
    <rect x="12" y="32" width="68" height="36" rx="5" />
    <rect x="80" y="43" width="7" height="14" rx="2" />
    {[0, 1, 2, 3, 4].map(i => { const h = 24 * seg(p, .06 + i * .09, .16 + i * .09, MOTION.pop); return <rect key={i} x={18.5 + i * 12.4} y={50 - h / 2} width="8.5" height={Math.max(0, h)} rx="1.5" fill={O} stroke="none" opacity={f} />; })}
    <rect x="81.5" y="45" width="4" height="10" rx="1" fill={O} stroke="none" opacity={glow * f} />
  </g>;
}

function Gauge({ p, O }) {
  const v = Math.max(0, seg(p, .06, .36, MOTION.pop) * (1 - seg(p, .68, .94)));
  return <g {...base}>
    <circle cx="50" cy="50" r="42" />
    <circle cx="50" cy="50" r="30" stroke={O} strokeWidth="7" strokeLinecap="butt" pathLength="100" strokeDasharray={`${25 * v} 100`} transform="rotate(-90 50 50)" opacity={v > .005 ? 1 : 0} />
    {[0, 135, 180, 225, 270, 315].map(a => { const [x0, y0] = pt(50, 50, 27.5, a), [x1, y1] = pt(50, 50, 32.5, a); return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} strokeWidth="4" />; })}
    <path d={BOLT} fill={S} strokeWidth="2" transform={sc(1 + .1 * v, 50, 50)} />
  </g>;
}

function Temp({ p, O }) {
  const l = .2 + .7 * (seg(p, .05, .45) - seg(p, .6, .95));
  const yTop = 70 - l * 44;
  return <g {...base}>
    <path d="M42 60 V24 A8 8 0 0 1 58 24 V60 A16 16 0 1 1 42 60 Z" />
    <rect x="47" y={yTop} width="6" height={74 - yTop} rx="3" fill={O} stroke="none" />
    <circle cx="50" cy="73.86" r="10" fill={O} stroke="none" />
    {[28, 38, 48, 58].map(y => <g key={y}>
      <line x1="66" y1={y} x2="78" y2={y} />
      <line x1="66" y1={y} x2="78" y2={y} stroke={O} opacity={cl((y - yTop + 2) / 4)} />
    </g>)}
  </g>;
}

function Bolt({ p, O }) {
  const s = 1 + .05 * bump(p, .34, .4, .56);
  return <g {...base}>
    <path d="M62 8 L26 56 H48 L38 92 L74 44 H52 Z" fill={S} strokeWidth="3" transform={sc(s, 50, 50)} />
    <line x1="82" y1="50" x2="55" y2="86" stroke={O} strokeWidth="4.5" {...drawP(seg(p, .1, .38), seg(p, .62, .88))} />
  </g>;
}

function BattLow({ p, O }) {
  const blink = p < .35 ? .3 + .7 * (.5 + .5 * Math.cos(2 * Math.PI * p / .175)) : 1;
  const g = seg(p, .42, .72, MOTION.enter) - seg(p, .86, .98);
  const h = 10 + 26 * g;
  const s = 1 + .16 * bump(p, .35, .41, .52);
  return <g {...base}>
    <rect x="30" y="22" width="40" height="64" rx="6" />
    <path d="M42 22 V14 H58 V22" />
    <rect x="37" y={79 - h} width="26" height={h} rx="2" fill={O} stroke="none" opacity={blink} />
    <g transform={sc(s, 50, 48)}>
      <path d="M53 34 L42 50 H50 L47 62 L58 46 H50 Z" fill={S} stroke="#000" strokeWidth="3" style={{ paintOrder: 'stroke' }} />
      <path d="M53 34 L42 50 H50 L47 62 L58 46 H50 Z" fill={O} stroke="none" opacity={g} />
    </g>
  </g>;
}

function ChargeLevel({ p, O }) {
  const fade = 1 - seg(p, .88, .98);
  const f = seg(p, .05, .62, MOTION.enter) * .95;
  const N = 15, n = f * N;
  return <g {...base}>
    <circle cx="50" cy="50" r="44" strokeWidth="3" />
    {[...Array(N)].map((_, i) => { const a0 = -135 + i * 18; return <g key={i} strokeWidth="7" strokeLinecap="butt">
      <path d={arc(50, 50, 33, a0 + 1.5, a0 + 16.5)} stroke={G} />
      <path d={arc(50, 50, 33, a0 + 1.5, a0 + 16.5)} stroke={O} opacity={cl(n - i) * fade} />
    </g>; })}
    <text x="50" y="54" textAnchor="middle" fill={W} stroke="none" fontFamily="Barlow, sans-serif" fontWeight="500" fontSize="17" opacity={seg(p, 0, .06) * fade}>{Math.round(f * 100)}%</text>
    <g strokeWidth="1.8">
      <rect x="38" y="63" width="22" height="10" rx="1.5" />
      <path d="M60 66 H62 V70 H60" />
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={40.2 + i * 3.6} y="65.2" width="2.6" height="5.6" fill={O} stroke="none" opacity={cl(f * 5 - i) * fade} />)}
    </g>
  </g>;
}

function Stats({ p, O }) {
  const back = 1 - seg(p, .82, .96);
  const tg = [16, 26, 12, 21];
  const kx = 22 + 32 * (.5 - .5 * Math.cos(2 * Math.PI * p));
  return <g {...base}>
    <rect x="8" y="22" width="84" height="56" rx="5" />
    <g transform="translate(15 36)"><CarSide sw="3" /></g>
    {tg.map((t, i) => { const h = t * Math.max(0, seg(p, .08 + .07 * i, .34 + .07 * i, MOTION.pop)) * back; return <rect key={i} x={62 + i * 6.5} y={60 - h} width="4" height={h} fill={O} stroke="none" />; })}
    <line x1="18" y1="69" x2="82" y2="69" stroke={G} strokeWidth="3" />
    <line x1={kx} y1="69" x2={kx + 24} y2="69" strokeWidth="3" />
  </g>;
}

function Aero({ p, O }) {
  const flows = ['M6 28 Q40 12 64 22 T96 32', 'M58 26 Q74 30 82 40 H96', 'M86 52 H96', 'M6 76 Q40 70 56 75 T96 70'];
  const bob = .5 * Math.sin(4 * Math.PI * p);
  return <g {...base}>
    <g transform={`translate(16 ${36 + bob}) scale(1.6)`}><CarSide sw={2.6} /></g>
    {flows.map((d, i) => { const s = (p * 2 + i * .27) % 1; return <g key={i} stroke={O}>
      <path d={d} opacity=".28" />
      <path d={d} pathLength="100" strokeDasharray="22 300" strokeDashoffset={22 - s * 122} />
    </g>; })}
  </g>;
}

function Mobile({ p, O }) {
  const pulses = [.08, .5];
  const s = 1 + .14 * Math.max(...pulses.map(a => bump(p, a, a + .05, a + .16)));
  const lights = Math.max(...pulses.map(a => bump(p, a, a + .05, a + .25)));
  return <g {...base}>
    <rect x="28" y="10" width="44" height="80" rx="8" />
    <line x1="44" y1="18" x2="56" y2="18" /><line x1="44" y1="82" x2="56" y2="82" />
    <g transform="translate(34 30)"><CarFront lights={O} lightsOp={.25 + .75 * lights} /></g>
    {pulses.map(a => { const r = seg(p, a + .04, a + .36, MOTION.enter); return <circle key={a} cx="50" cy="61" r={6 + 12 * r} stroke={O} strokeWidth="1.6" opacity={r > 0 && r < 1 ? (1 - r) * .7 : 0} />; })}
    <path d="M53 50 L44 62 H50 L47 72 L57 58 H51 Z" fill={O} stroke={O} strokeWidth="1.5" transform={sc(s, 50, 61)} />
  </g>;
}

function Eco({ p, O }) {
  const sw = Math.sin(2 * Math.PI * p);
  return <g {...base}>
    <g transform={`rotate(${-3 * sw} 44 80)`}>
      <path d="M44 36 Q60 22 88 20 Q90 56 66 74 Q56 82 44 80" />
      <line x1="50" y1="66" x2="76" y2="36" stroke={O} {...drawP(seg(p, .08, .42), seg(p, .8, .96))} />
    </g>
    <g transform={`rotate(${4 * sw} 30 82)`}>
      <path d="M30 82 Q12 66 18 38 Q38 48 36 68 Q35 77 30 82 Z" />
      <line x1="23" y1="48" x2="30" y2="74" strokeWidth="3" />
    </g>
  </g>;
}

function Wifi({ p, O }) {
  const fade = 1 - seg(p, .76, .92);
  const dot = 1 + .3 * bump(p, 0, .05, .16);
  return <g {...base} strokeWidth="5">
    {[14, 28, 42].map((r, i) => <g key={r}>
      <path d={arc(50, 74, r, -48, 48)} stroke={G} />
      <path d={arc(50, 74, r, -48, 48)} opacity={seg(p, .1 + .12 * i, .22 + .12 * i, MOTION.enter) * fade} />
    </g>)}
    <circle cx="50" cy="80" r="6" fill={O} stroke="none" transform={sc(dot, 50, 80)} />
  </g>;
}

function Plug({ x, O, glow }) {
  return <g transform={`translate(${x} 0)`}>
    <rect x="18" y="12" width="12" height="10" rx="2" />
    <path d="M14 22 H34 V40 L29 48 V54 H19 V48 L14 40 Z" />
    <line x1="17" y1="29" x2="31" y2="29" stroke={O} opacity={.45 + .55 * glow} />
  </g>;
}
function Cable({ p, O }) {
  const s = seg(p, .1, .7);
  const travel = 'M24 54 Q24 72 35 74 A17 17 0 1 1 65 74 Q76 72 76 54';
  return <g {...base} strokeWidth="3.5">
    <path d="M24 54 Q24 72 35 74" /><path d="M65 74 Q76 72 76 54" />
    <circle cx="50" cy="66" r="17" /><circle cx="50" cy="66" r="12" stroke={G} />
    <path d={travel} stroke={O} pathLength="100" strokeDasharray="10 300" strokeDashoffset={10 - s * 110} opacity={s > 0 && s < 1 ? 1 : 0} />
    <Plug x={0} O={O} glow={bump(p, .02, .1, .3)} />
    <Plug x={52} O={O} glow={bump(p, .64, .72, .92)} />
  </g>;
}

function Pin({ p, O }) {
  const x = seg(p, .12, .6, Easing.linear);
  const y = -12 * 4 * x * (1 - x);
  const sq = 1 - .07 * bump(p, .58, .62, .72);
  const rip = seg(p, .6, .92, MOTION.enter);
  const flash = bump(p, .6, .64, .8);
  return <g {...base}>
    <ellipse cx="50" cy="80" rx="30" ry="10" />
    <ellipse cx="50" cy="80" rx={30 + 14 * rip} ry={10 + 5 * rip} stroke={O} strokeWidth="2" opacity={rip > 0 && rip < 1 ? (1 - rip) * .8 : 0} />
    <g transform={`translate(0 ${y}) translate(50 82) scale(${1 / Math.sqrt(sq)} ${sq}) translate(-50 -82)`}>
      <path d="M50 82 L33 57 A24 24 0 1 1 67 57 Z" fill="#000" />
      <path d="M53 28 L43 43 H50 L47 54 L58 38 H51 Z" fill={O} stroke={O} strokeWidth="1.5" transform={sc(1 + .18 * flash, 50, 41)} />
    </g>
  </g>;
}

function Shield({ p, O }) {
  const d = seg(p, .04, .36), u = seg(p, .82, .97);
  const pulse = bump(p, .4, .48, .64);
  return <g {...base}>
    <path d="M50 10 L84 20 V46 Q84 74 50 90 Q16 74 16 46 V20 Z" transform={sc(1 + .04 * pulse, 50, 50)} />
    <path d="M26 31 V26 L50 19 L74 26 V31" stroke={O} {...drawP(d, u)} />
    <path d="M26 52 Q28 72 50 82 Q72 72 74 52" stroke={O} {...drawP(d, u)} />
    <path d={BOLT} fill={S} strokeWidth="2" />
    <path d={BOLT} fill={O} stroke={O} strokeWidth="2" opacity={pulse} />
  </g>;
}

function BattTemp({ p, O }) {
  const fade = 1 - seg(p, .84, .97);
  const l = seg(p, .06, .42) * fade;
  const yTop = 70 - l * 32;
  const th = 'M67 64 V38 A5 5 0 0 1 77 38 V64 A12 12 0 1 1 67 64 Z';
  return <g {...base}>
    <rect x="22" y="20" width="40" height="66" rx="6" />
    <path d="M34 20 V12 H50 V20" />
    <rect x="28" y="27" width="28" height="9" rx="1.5" fill={G} stroke="none" />
    {[69, 55, 41].map((y, i) => { const k = Math.max(0, seg(p, .06 + i * .1, .16 + i * .1, MOTION.pop)) * fade; return <rect key={y} x="28" y={y} width={28 * Math.min(k, 1.04)} height="10" rx="1.5" fill={O} stroke="none" opacity={k > .01 ? 1 : 0} />; })}
    <path d={th} fill="#000" stroke="#000" strokeWidth="10" />
    <path d={th} fill="#000" />
    <rect x="70.5" y={yTop} width="3" height={76 - yTop} rx="1.5" fill={O} stroke="none" />
    <circle cx="72" cy="74.9" r="7" fill={O} stroke="none" />
  </g>;
}

const ICONS = [
  ['Tire pressure', Tire], ['Vehicle documents', Docs], ['Battery full', BattFull], ['Power gauge', Gauge],
  ['Temperature', Temp], ['Charging', Bolt], ['Battery low', BattLow], ['Charge level', ChargeLevel],
  ['Vehicle stats', Stats], ['Aerodynamics', Aero], ['Mobile app', Mobile], ['Eco mode', Eco],
  ['Connectivity', Wifi], ['Charging cable', Cable], ['Station map', Pin], ['Battery protection', Shield],
  ['Battery temperature', BattTemp],
];

function Cell({ label, C, p, O, size, labels, labelSize }) {
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * .1 }}>
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: 'visible', display: 'block' }}><C p={p} O={O} /></svg>
    {labels && <div style={{ fontFamily: 'Barlow, sans-serif', fontSize: labelSize, letterSpacing: '.16em', textTransform: 'uppercase', color: '#8b8d91' }}>{label}</div>}
  </div>;
}

function Piece({ t }) {
  const { T, time, authoredTotal } = useComposition();
  const p0 = authoredTotal > 0 ? (((T % authoredTotal) + authoredTotal) % authoredTotal) / authoredTotal : 0;
  const focus = ICONS.find(([l]) => l === t.focus);
  return <div data-screen-label={`t=${Math.floor(time)}s`} style={{ position: 'absolute', inset: 0, background: t.greenScreen ? '#00b140' : '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {focus
      ? <Cell label={focus[0]} C={focus[1]} p={p0} O={t.accent} size={600} labels={t.labels} labelSize={28} />
      : <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 40, rowGap: 56, width: 1720 }}>
          {ICONS.map(([l, C], i) => <div key={l} style={{ width: 240, display: 'flex', justifyContent: 'center' }}>
            <Cell label={l} C={C} p={t.stagger ? (p0 + i * .06) % 1 : p0} O={t.accent} size={196} labels={t.labels} labelSize={15} />
          </div>)}
        </div>}
  </div>;
}

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  React.useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const r = requestAnimationFrame(() => requestAnimationFrame(fire));
    const id = setTimeout(fire, 300);
    return () => { cancelAnimationFrame(r); clearTimeout(id); };
  }, []);
  return <>
    <CompositionStage width={(window.ICON_STAGE || [1920, 1080])[0]} height={(window.ICON_STAGE || [1920, 1080])[1]} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg={t.greenScreen ? '#00b140' : '#000'}>
      <Piece t={t} />
    </CompositionStage>
    <TweaksPanel>
      <TweakSection label="Display" />
      <TweakSelect label="Show" value={t.focus} options={['All', ...ICONS.map(i => i[0])]} onChange={v => setTweak('focus', v)} />
      <TweakToggle label="Green screen" value={!!t.greenScreen} onChange={v => setTweak('greenScreen', v)} />
      <TweakToggle label="Labels" value={t.labels} onChange={v => setTweak('labels', v)} />
      <TweakToggle label="Offset loops" value={t.stagger} onChange={v => setTweak('stagger', v)} />
      <TweakColor label="Accent" value={t.accent} options={['#ff6b0f', '#ffb21f', '#2fc9b8', '#e9e9e6']} onChange={v => setTweak('accent', v)} />
      <TweakSection label="Timeline" />
      <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
    </TweaksPanel>
  </>;
}
window.IconsApp = App;
})();
