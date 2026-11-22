import React from "react";

/*
  VillageScene: decorative animated illustration of village life.
  Original characters, pure SVG + CSS, no extra packages.
  This is decoration only. It does not show any data.
*/

const css = `
.vs{
  --sky1:#bfe3ff;--sky2:#fdfbf2;--hill:#bfe0b4;--ground:#a9d79c;--soil:#cba57d;
  --crop:#4f9d4f;--road:#e8d6b6;--water:#79c3ee;--wall:#fff6e6;--roof:#d9634c;
  --door:#9a6b4b;--win:#9fd3f5;--tree:#4c9a5b;--tree2:#5db06c;--trunk:#8a6a4b;
  --sun:#ffd24a;--ray:#ffc83a;--rayo:.9;--cloud:#ffffff;--bird:#3b4a5a;
  --pump:#6e7b88;--bucket:#c9784a;--str:#6e6e73;
  --rock:#a8b2ad;--rock2:#8e9a95;--foam:#ffffff;--brass:#f2c14e;
  border-radius:24px;overflow:hidden;line-height:0;background:var(--sky1);
}
@media (prefers-color-scheme: dark){
  .vs{
    --sky1:#0b1a2e;--sky2:#1d3150;--hill:#1f3b2c;--ground:#19321f;--soil:#4a3a2c;
    --crop:#3f8a4a;--road:#3a3328;--water:#2a5f8f;--wall:#d8cdbd;--roof:#9c4a3b;
    --door:#5f4533;--win:#6f9fc4;--tree:#2f6f45;--tree2:#3a7f50;--trunk:#5a4632;
    --sun:#f1e9c4;--ray:#f1e9c4;--rayo:0;--cloud:#2c3e5a;--bird:#c7d2e0;
    --pump:#8f9aa6;--bucket:#a2603b;--str:#aab4c0;
    --rock:#4a5660;--rock2:#39444d;--foam:#cfe6f5;--brass:#c9a13e;
  }
}
.vs svg{display:block;width:100%;height:auto}
.vs-full{position:fixed;inset:0;z-index:0;border-radius:0;pointer-events:none}
.vs-full svg{position:absolute;left:0;bottom:0;width:100%;height:100%}
.vs .s1{stop-color:var(--sky1)} .vs .s2{stop-color:var(--sky2)}
.vs .f-hill{fill:var(--hill)} .vs .f-ground{fill:var(--ground)} .vs .f-soil{fill:var(--soil)}
.vs .f-road{fill:var(--road)} .vs .f-water{fill:var(--water)} .vs .f-wall{fill:var(--wall)}
.vs .f-roof{fill:var(--roof)} .vs .f-door{fill:var(--door)} .vs .f-win{fill:var(--win)}
.vs .f-tree{fill:var(--tree)} .vs .f-tree2{fill:var(--tree2)} .vs .f-trunk{fill:var(--trunk)}
.vs .f-sun{fill:var(--sun)} .vs .f-cloud{fill:var(--cloud);opacity:.92}
.vs .f-pump{fill:var(--pump)} .vs .f-bucket{fill:var(--bucket)}
.vs .ray{stroke:var(--ray);stroke-width:3;stroke-linecap:round;opacity:var(--rayo)}
.vs .crop{stroke:var(--crop);stroke-width:6;stroke-dasharray:4 5;stroke-linecap:round;fill:none}
.vs .channel{stroke:var(--water);stroke-width:4;stroke-dasharray:7 6;fill:none;animation:flow 1.6s linear infinite}
.vs .bird{stroke:var(--bird);stroke-width:1.6;fill:none;stroke-linecap:round}
.vs .drip{fill:var(--water)}
.vs .f-rock{fill:var(--rock)} .vs .f-rock2{fill:var(--rock2)} .vs .f-foam{fill:var(--foam)}
.vs .f-brass{fill:var(--brass)}
.vs .fall{stroke:var(--foam);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:10 8;fill:none;opacity:.9;animation:fall .7s linear infinite}
.vs .fall.fall2{stroke-dasharray:6 10;animation-duration:.9s}
.vs .splash{fill:var(--foam);opacity:.7;transform-box:fill-box;transform-origin:center bottom;animation:splash 1s ease-out infinite}
.vs .flag{transform-box:fill-box;transform-origin:left center;animation:flagwave 1.2s ease-in-out infinite alternate}
.vs .stream{stroke:var(--water);stroke-width:5;stroke-linecap:round;fill:none}

.vs .w-move{animation:wMove var(--dur) linear infinite}
.vs .w-flip{animation:wFlip var(--dur) linear infinite}
.vs .leg-a{animation:legSwing .7s ease-in-out infinite}
.vs .leg-b{animation:legSwing .7s ease-in-out infinite;animation-delay:-.35s}
.vs .arm-a{animation:armSwing .7s ease-in-out infinite;animation-delay:-.35s}
.vs .arm-b{animation:armSwing .7s ease-in-out infinite}
.vs .hoe{animation:hoe .9s ease-in-out infinite alternate}
.vs .pump-handle{animation:pump 1.2s ease-in-out infinite}
.vs .bob{animation:bob 1.2s ease-in-out infinite}
.vs .drip{animation:drip .9s ease-in infinite}
.vs .drip.d2{animation-delay:-.45s}
.vs .kite{animation:kite 5s ease-in-out infinite alternate}
.vs .cloud{animation:drift var(--dur) linear infinite}
.vs .flybird{animation:fly var(--dur) linear infinite}
.vs .flap{transform-box:fill-box;transform-origin:center;animation:flap .5s ease-in-out infinite alternate}
.vs .rays{animation:spin 80s linear infinite}
.vs .ripple{transform-box:fill-box;transform-origin:center;fill:none;stroke:#fff;stroke-opacity:.6;stroke-width:1.2;animation:ripple 3s ease-out infinite}
.vs .ripple.r2{animation-delay:-1.5s}

@keyframes wMove{0%{transform:translateX(0)}50%{transform:translateX(var(--dist))}100%{transform:translateX(0)}}
@keyframes wFlip{0%,49.9%{transform:scaleX(var(--f1))}50%,99.9%{transform:scaleX(var(--f2))}100%{transform:scaleX(var(--f1))}}
@keyframes legSwing{0%,100%{transform:rotate(26deg)}50%{transform:rotate(-26deg)}}
@keyframes armSwing{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}
@keyframes hoe{0%{transform:rotate(-45deg)}100%{transform:rotate(2deg)}}
@keyframes pump{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-10deg)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
@keyframes drip{0%{transform:translateY(0);opacity:1}100%{transform:translateY(12px);opacity:0}}
@keyframes kite{0%{transform:rotate(-5deg)}100%{transform:rotate(5deg)}}
@keyframes drift{0%{transform:translateX(-180px)}100%{transform:translateX(1080px)}}
@keyframes fly{0%{transform:translateX(-60px)}100%{transform:translateX(980px)}}
@keyframes flap{0%{transform:scaleY(1)}100%{transform:scaleY(.55)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes flow{to{stroke-dashoffset:-26}}
@keyframes fall{to{stroke-dashoffset:-18}}
@keyframes splash{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.5);opacity:0}}
@keyframes flagwave{0%{transform:scaleX(1) skewY(-4deg)}100%{transform:scaleX(.8) skewY(4deg)}}
@keyframes ripple{0%{transform:scale(.4);opacity:1}100%{transform:scale(1.15);opacity:0}}

@media (prefers-reduced-motion: reduce){
  .vs *{animation:none !important}
}
`;

function Person({
  shirt = "#0071e3",
  pants = "#3b3f4a",
  skin = "#c68a5a",
  hair = "#2b2118",
  walking = false,
  scale = 1,
  children,
}) {
  return (
    <g transform={`scale(${scale})`}>
      <g transform="translate(-2.6 -18)">
        <line
          className={walking ? "leg-a" : ""}
          x1="0" y1="0" x2="0" y2="18"
          stroke={pants} strokeWidth="3.6" strokeLinecap="round"
        />
      </g>
      <g transform="translate(2.6 -18)">
        <line
          className={walking ? "leg-b" : ""}
          x1="0" y1="0" x2="0" y2="18"
          stroke={pants} strokeWidth="3.6" strokeLinecap="round"
        />
      </g>
      <rect x="-6" y="-41" width="12" height="24" rx="5" fill={shirt} />
      <circle cx="0" cy="-48" r="6" fill={skin} />
      <path d="M-6 -49 A6 6 0 0 1 6 -49 Z" fill={hair} />
      {walking ? (
        <>
          <g transform="translate(0 -37)">
            <line className="arm-a" x1="0" y1="0" x2="0" y2="14" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          </g>
          <g transform="translate(0 -37)">
            <line className="arm-b" x1="0" y1="0" x2="0" y2="14" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <>
          <line x1="-6" y1="-37" x2="-7.5" y2="-25" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          <line x1="6" y1="-37" x2="7.5" y2="-25" stroke={skin} strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {children}
    </g>
  );
}

function Walker({ x, y, dist, dur = 20, delay = 0, children }) {
  const f1 = dist < 0 ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="w-move"
        style={{ "--dist": `${dist}px`, "--dur": `${dur}s`, animationDelay: `${delay}s` }}
      >
        <g
          className="w-flip"
          style={{ "--f1": f1, "--f2": -f1, "--dur": `${dur}s`, animationDelay: `${delay}s` }}
        >
          {children}
        </g>
      </g>
    </g>
  );
}

function House({ x, y, w = 58, h = 38 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="f-wall" x="0" y={-h} width={w} height={h} rx="3" />
      <polygon className="f-roof" points={`-6,${-h} ${w / 2},${-h - 24} ${w + 6},${-h}`} />
      <rect className="f-door" x={w / 2 - 6} y="-20" width="12" height="20" rx="2" />
      <rect className="f-win" x="8" y={-h + 10} width="12" height="10" rx="2" />
      <rect className="f-win" x={w - 20} y={-h + 10} width="12" height="10" rx="2" />
    </g>
  );
}

function Tree({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect className="f-trunk" x="-3" y="-22" width="6" height="22" rx="2" />
      <circle className="f-tree" cx="0" cy="-34" r="17" />
      <circle className="f-tree2" cx="-11" cy="-26" r="11" />
      <circle className="f-tree2" cx="11" cy="-27" r="11" />
    </g>
  );
}

function Cloud({ y, dur, delay }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="cloud" style={{ "--dur": `${dur}s`, animationDelay: `${delay}s` }}>
        <ellipse className="f-cloud" cx="0" cy="0" rx="34" ry="11" />
        <ellipse className="f-cloud" cx="-16" cy="-8" rx="18" ry="11" />
        <ellipse className="f-cloud" cx="14" cy="-10" rx="20" ry="12" />
      </g>
    </g>
  );
}

function Bird({ y, dur, delay }) {
  return (
    <g transform={`translate(0 ${y})`}>
      <g className="flybird" style={{ "--dur": `${dur}s`, animationDelay: `${delay}s` }}>
        <path className="bird flap" d="M0 0 q5 -6 10 0 q5 -6 10 0" />
      </g>
    </g>
  );
}

function Waterfall({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon className="f-rock2" points="-58,0 -46,-52 -22,-72 20,-64 46,0" />
      <polygon className="f-rock" points="-58,0 -46,-52 -22,-72 -6,-60 -14,0" />
      <rect className="f-water" x="-5" y="-66" width="14" height="66" rx="3" />
      <line className="fall" x1="-1" y1="-66" x2="-1" y2="-2" />
      <line className="fall fall2" x1="4" y1="-66" x2="4" y2="-2" />
      <line className="fall" x1="8" y1="-64" x2="8" y2="-2" style={{ animationDelay: "-.3s" }} />
      <ellipse className="f-water" cx="2" cy="4" rx="20" ry="6" />
      <ellipse className="splash" cx="2" cy="1" rx="14" ry="5" />
    </g>
  );
}

function TownHall({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="f-wall" x="0" y="-46" width="96" height="46" rx="2" />
      <polygon className="f-roof" points="-6,-46 48,-72 102,-46" />
      <rect className="f-brass" x="28" y="-62" width="40" height="10" rx="2" />
      <text
        x="48" y="-54.5" textAnchor="middle" fontSize="6.5" fontWeight="700"
        fill="#2b1d12" style={{ fontFamily: "system-ui, sans-serif" }}
      >
        PANCHAYAT
      </text>
      {[8, 22, 68, 82].map((cx) => (
        <rect key={cx} className="f-door" x={cx} y="-44" width="6" height="44" rx="1" />
      ))}
      <rect className="f-door" x="40" y="-26" width="16" height="26" rx="3" />
      <rect className="f-road" x="-4" y="-3" width="104" height="5" rx="1" />
      <line x1="48" y1="-72" x2="48" y2="-96" style={{ stroke: "var(--pump)" }} strokeWidth="1.6" />
      <g transform="translate(48 -96)">
        <g className="flag">
          <polygon points="0,0 20,5 0,10" fill="#ff3b30" />
        </g>
      </g>
    </g>
  );
}

function WaterTank({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="-9" y1="-24" x2="-12" y2="0" style={{ stroke: "var(--pump)" }} strokeWidth="2.4" />
      <line x1="9" y1="-24" x2="12" y2="0" style={{ stroke: "var(--pump)" }} strokeWidth="2.4" />
      <line x1="-10" y1="-8" x2="10" y2="-18" style={{ stroke: "var(--pump)" }} strokeWidth="1.4" />
      <rect className="f-pump" x="-14" y="-46" width="28" height="22" rx="6" />
      <rect className="f-water" x="-11" y="-41" width="22" height="6" rx="3" opacity=".75" />
      <polygon className="f-roof" points="-16,-46 0,-56 16,-46" />
    </g>
  );
}

export default function VillageScene({ className = "", fullPage = false }) {
  return (
    <div
      className={`vs ${fullPage ? "vs-full" : ""} ${className}`}
      role="img"
      aria-label="Decorative illustration of villagers farming, carrying water and walking through a village."
    >
      <style>{css}</style>
      <svg
        viewBox="0 0 900 280"
        preserveAspectRatio={fullPage ? "xMidYMax meet" : "xMidYMid meet"}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vsSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="s1" />
            <stop offset="1" className="s2" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect x="0" y="0" width="900" height="280" fill="url(#vsSky)" />

        {/* sun */}
        <g transform="translate(790 56)">
          <g className="rays">
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} className="ray" x1="0" y1="-30" x2="0" y2="-40" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle className="f-sun" r="21" />
        </g>

        {/* clouds and birds */}
        <Cloud y={52} dur={110} delay={-20} />
        <Cloud y={96} dur={150} delay={-90} />
        <Bird y={40} dur={34} delay={-6} />
        <Bird y={72} dur={44} delay={-24} />
        <Bird y={30} dur={52} delay={-40} />

        {/* hills and ground */}
        <path className="f-hill" d="M0 186 Q120 130 240 172 T480 160 T720 166 T900 150 V210 H0 Z" />
        <rect className="f-ground" x="0" y="184" width="900" height="96" />
        <path className="f-road" d="M0 266 Q300 244 900 266 V280 H0 Z" />

        {/* field */}
        <rect className="f-soil" x="30" y="200" width="330" height="62" rx="12" />
        {[212, 223, 234, 245, 256].map((yy) => (
          <line key={yy} className="crop" x1="46" y1={yy} x2="344" y2={yy} />
        ))}

        {/* waterfall feeding the pond */}
        <Waterfall x={590} y={196} />
        <path className="stream" d="M592 202 Q604 212 616 222" />

        {/* irrigation channel and pond */}
        <path className="channel" d="M556 240 Q452 262 364 250" />
        <ellipse className="f-water" cx="628" cy="234" rx="78" ry="20" />
        <ellipse className="ripple" cx="610" cy="234" rx="30" ry="8" />
        <ellipse className="ripple r2" cx="650" cy="236" rx="30" ry="8" />

        {/* panchayat town hall and water tank */}
        <TownHall x={150} y={202} />
        <WaterTank x={338} y={202} />

        {/* buildings and trees */}
        <Tree x={392} y={204} s={1} />
        <House x={414} y={204} />
        <House x={486} y={200} w={50} h={34} />
        <Tree x={760} y={206} s={1.05} />
        <House x={782} y={208} w={52} h={34} />
        <Tree x={872} y={212} s={0.85} />

        {/* hand pump with man pumping */}
        <g transform="translate(722 252)">
          <rect className="f-pump" x="-3" y="-38" width="6" height="38" rx="2" />
          <rect className="f-pump" x="-9" y="-4" width="18" height="4" rx="1" />
          <rect className="f-pump" x="3" y="-20" width="12" height="3" rx="1" />
          <rect className="f-bucket" x="10" y="-8" width="12" height="8" rx="2" />
          <g transform="translate(0 -34)">
            <g className="pump-handle">
              <line x1="0" y1="0" x2="-28" y2="-6" stroke="var(--pump)" strokeWidth="3.4" strokeLinecap="round" />
              <circle cx="-28" cy="-6" r="2.6" fill="var(--pump)" />
            </g>
          </g>
          <circle className="drip" cx="13" cy="-15" r="1.8" />
          <circle className="drip d2" cx="13" cy="-15" r="1.8" />
        </g>
        <g transform="translate(688 252)">
          <g className="bob">
            <Person shirt="#34c759" pants="#2f3a4a" skin="#b9794c">
              <line x1="6" y1="-37" x2="14" y2="-40" stroke="#b9794c" strokeWidth="3" strokeLinecap="round" />
            </Person>
          </g>
        </g>

        {/* farmers hoeing in the field */}
        <g transform="translate(120 246)">
          <Person shirt="#ff9500" pants="#4a4036" skin="#c68a5a">
            <g transform="translate(0 -36)">
              <g className="hoe">
                <line x1="0" y1="0" x2="24" y2="36" stroke="#8a6a4b" strokeWidth="2.6" strokeLinecap="round" />
                <path d="M20 35 h11 l-2 6 h-9 z" fill="#8e96a0" />
              </g>
            </g>
          </Person>
        </g>
        <g transform="translate(250 234)">
          <g style={{ animationDelay: "-0.4s" }}>
            <Person shirt="#af52de" pants="#3d3a4f" skin="#a8704a">
              <g transform="translate(0 -36)">
                <g className="hoe" style={{ animationDelay: "-0.45s" }}>
                  <line x1="0" y1="0" x2="24" y2="36" stroke="#8a6a4b" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M20 35 h11 l-2 6 h-9 z" fill="#8e96a0" />
                </g>
              </g>
            </Person>
          </g>
        </g>

        {/* woman carrying water pot between pond and house */}
        <Walker x={640} y={254} dist={-150} dur={22}>
          <Person walking shirt="#ff6b9d" pants="#c2476f" skin="#b9794c" hair="#1f1812">
            <line x1="0" y1="-37" x2="-5" y2="-55" stroke="#b9794c" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="0" cy="-60" rx="6" ry="5" fill="#c9784a" />
            <rect x="-3" y="-66" width="6" height="3" rx="1" fill="#a85f38" />
          </Person>
        </Walker>

        {/* farmer carrying crop bundle along the road */}
        <Walker x={90} y={272} dist={300} dur={32} delay={-8}>
          <Person walking shirt="#0071e3" pants="#3b3f4a" skin="#c68a5a">
            <ellipse cx="0" cy="-60" rx="11" ry="6" fill="#e5c258" />
            <path d="M-9 -60 q9 -8 18 0" stroke="#c9a53d" strokeWidth="1.5" fill="none" />
          </Person>
        </Walker>

        {/* child flying a kite */}
        <g transform="translate(818 258)">
          <Person scale={0.72} shirt="#ff9500" pants="#3b3f4a" skin="#c68a5a">
            <line x1="5" y1="-37" x2="7" y2="-48" stroke="#c68a5a" strokeWidth="3" strokeLinecap="round" />
          </Person>
        </g>
        <g transform="translate(823 231)">
          <g className="kite">
            <line x1="0" y1="0" x2="-70" y2="-130" stroke="var(--str)" strokeWidth="1" />
            <g transform="translate(-70 -130)">
              <polygon points="0,-14 9,0 0,14 -9,0" fill="#ff3b30" />
              <polygon points="0,-14 9,0 0,0" fill="#ffcc00" />
              <path d="M0 14 q-5 7 0 13 t0 13" stroke="#ff3b30" strokeWidth="1.4" fill="none" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
