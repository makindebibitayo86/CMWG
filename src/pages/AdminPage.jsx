import { useState, useEffect, useRef } from 'react'

// ─── AUTH ─────────────────────────────────────────────────────────────────────

const HASHED_USER = '576e2fcd4689573c23734124d347cfd24a2c96fdb91fa632bd6e802892e2f2f9'
const HASHED_PASS = 'ad1277823788f0ccc4385af97ce54a9875b8806f0ca60684f2a4e257d817a4bb'

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function LoginScreen({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const [hu, hp] = await Promise.all([sha256(user), sha256(pass)])
    if (hu === HASHED_USER && hp === HASHED_PASS) {
      onLogin()
    } else {
      setError('Invalid credentials')
    }
    setLoading(false)
  }

  const onKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#05050a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes gridPulse { 0%,100%{opacity:.04} 50%{opacity:.09} }
        @keyframes loginIn { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes errorShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
      `}</style>

      {/* Background grid */}
      <div style={{
        position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(201,168,76,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.07) 1px,transparent 1px)',
        backgroundSize:'60px 60px', animation:'gridPulse 4s ease-in-out infinite',
      }} />
      {/* Radial vignette */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 60% at 50% 50%,transparent 30%,#05050a 100%)'}} />

      <div style={{ position:'relative', width:400, animation:'loginIn .5s cubic-bezier(.16,1,.3,1) both' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:44 }}>
          <a href="/"><img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height:48, marginBottom:20 }} /></a>
          <div style={{ display:'flex', alignItems:'center', gap:12, justifyContent:'center' }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg,transparent,#2a2a2a)' }} />
            <span style={{ color:'#3a3a3a', fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase' }}>Admin Portal</span>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg,#2a2a2a,transparent)' }} />
          </div>
        </div>

        {/* Card */}
        <div style={{
          background:'linear-gradient(145deg,#0c0c12,#080810)',
          border:'1px solid #1a1a28',
          borderRadius:12,
          padding:'40px 36px',
          boxShadow:'0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.03)',
        }}>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.2em', color:'#3a3a4a', textTransform:'uppercase', marginBottom:8 }}>Username</label>
            <input
              value={user} onChange={e=>setUser(e.target.value)} onKeyDown={onKey}
              autoComplete="username"
              onFocus={()=>setFocused('user')} onBlur={()=>setFocused(null)}
              style={{
                width:'100%', background:focused==='user'?'#0f0f1a':'#0a0a10',
                border:`1px solid ${focused==='user'?'#c9a84c':'#1e1e30'}`,
                borderRadius:8, color:'#e8e0d0',
                fontFamily:"'DM Mono',monospace", fontSize:13,
                padding:'12px 14px', boxSizing:'border-box', outline:'none',
                transition:'all .2s', letterSpacing:'0.04em',
              }}
            />
          </div>
          <div style={{ marginBottom:28 }}>
            <label style={{ display:'block', fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.2em', color:'#3a3a4a', textTransform:'uppercase', marginBottom:8 }}>Password</label>
            <input
              type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={onKey}
              autoComplete="current-password"
              onFocus={()=>setFocused('pass')} onBlur={()=>setFocused(null)}
              style={{
                width:'100%', background:focused==='pass'?'#0f0f1a':'#0a0a10',
                border:`1px solid ${focused==='pass'?'#c9a84c':'#1e1e30'}`,
                borderRadius:8, color:'#e8e0d0',
                fontFamily:"'DM Mono',monospace", fontSize:13,
                padding:'12px 14px', boxSizing:'border-box', outline:'none',
                transition:'all .2s', letterSpacing:'0.04em',
              }}
            />
          </div>

          {error && (
            <p style={{
              color:'#e57373', fontFamily:"'DM Mono',monospace", fontSize:11,
              marginBottom:16, textAlign:'center', letterSpacing:'0.05em',
              animation:'errorShake .4s ease',
            }}>{error}</p>
          )}

          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width:'100%',
              background: loading ? '#8a7030' : 'linear-gradient(135deg,#c9a84c,#e8c96a)',
              border:'none', color:'#060608',
              padding:'13px', borderRadius:8, cursor: loading?'not-allowed':'pointer',
              fontFamily:"'DM Mono',monospace", fontSize:11,
              fontWeight:600, letterSpacing:'0.18em',
              textTransform:'uppercase', transition:'all .2s',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(201,168,76,.35)',
            }}
          >
            {loading ? '··· Verifying' : 'Enter Dashboard'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const INIT = {
  hero: {
    eyebrow: 'Explore Africa Differently',
    title1: 'Travel. Explore.',
    title2: 'Experience.',
    text: "Book trips, plan excursions, and discover unforgettable destinations across Africa's most cinematic landscapes.",
    cards: [
      { heading: 'Book Trips', sub: 'Curated travel packages', href: '#destinations' },
      { heading: 'Excursions', sub: 'Guided local experiences', href: '#destinations' },
      { heading: 'Merch', sub: 'Travel essentials & gear', href: '#shop' },
    ],
    videoUrl: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/droneshots.webm',
  },
  destinations: [
    { id: 1, title: 'Lagos City Escape', desc: 'Urban energy, beaches, nightlife', tagline: "Africa's most electric city — where hustle meets the ocean.", price: '', img: 'https://res.cloudinary.com/dgjcl0te0/image/upload/q_auto/f_auto/v1780581204/lagos_bo1dux.png', category: 'West Africa' },
    { id: 2, title: 'Ghana Heritage Journey', desc: 'Culture, history, and coastal rhythm', tagline: 'Walk through centuries of history along the Gold Coast.', price: '', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', category: 'West Africa' },
    { id: 3, title: 'Benin Royal Experience', desc: 'Ancient kingdoms and rich traditions', tagline: 'The cradle of royal art, ceremony, and ancient power.', price: '', img: 'https://res.cloudinary.com/dgjcl0te0/image/upload/v1780581557/benin_rihdlk.jpg', category: 'West Africa' },
    { id: 4, title: 'Tanzania Safari Expedition', desc: 'Wildlife, savannahs, and national parks', tagline: 'Witness the greatest wildlife spectacle on earth.', price: '', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', category: 'East Africa' },
    { id: 5, title: 'Cape Town Coastline', desc: 'Mountains meeting the ocean', tagline: 'Where dramatic peaks dissolve into two oceans.', price: '', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80', category: 'Southern Africa' },
    { id: 6, title: 'Zanzibar Escape', desc: 'Turquoise waters and island calm', tagline: 'Ivory sands, clove-scented breeze, and infinite blue.', price: '', img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', category: 'East Africa' },
  ],
  merch: [
    { id: 1, name: 'CMWG Explorer Tee', price: '$35', tag: 'Bestseller', desc: 'Lightweight cotton tee with embroidered CMWG crest. Built for the road.', category: 'Clothing',
      imgs: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80'],
      fields: ['sleeve','size','height','age','note'] },
    { id: 2, name: 'Safari Hoodie', price: '$75', tag: 'New', desc: 'Midweight fleece hoodie in earthy gold. Perfect for cool savannah nights.', category: 'Clothing',
      imgs: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'],
      fields: ['size','height','age','note'] },
    { id: 3, name: 'CMWG Snapback Cap', price: '$28', tag: '', desc: 'Structured snapback with gold CMWG logo embroidery on a black crown.', category: 'Clothing',
      imgs: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80'],
      fields: ['age','note'] },
    { id: 4, name: 'Adventure Duffel', price: '$110', tag: 'New', desc: '40L waxed canvas duffel with leather handles and CMWG patch. Weekend-ready.', category: 'Travel Gear',
      imgs: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&w=800&q=80'],
      fields: ['note'] },
    { id: 5, name: 'Expedition Bottle', price: '$42', tag: '', desc: 'Insulated 750ml steel bottle. Keeps cold 24hrs, hot 12hrs. CMWG laser-etched.', category: 'Travel Gear',
      imgs: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80'],
      fields: ['note'] },
    { id: 6, name: 'Passport Wallet', price: '$55', tag: 'Bestseller', desc: 'Full-grain leather passport holder with card slots and CMWG gold foil stamp.', category: 'Travel Gear',
      imgs: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1606503153255-59d5e417b073?auto=format&fit=crop&w=800&q=80','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
      fields: ['note'] },
  ],
  about: {
    heading: 'We exist to make sure you actually go.',
    para1: "How many times have you said \"I want to travel\" and let it stay a dream? CMWG — Come Make We Go — was built as an invitation, a challenge, and a promise all at once.",
    para2: "We plan the trips so you don't have to. You just show up, be present, and leave changed. From the beaches of West Africa to the souks of Marrakech, every destination we choose is somewhere that demands you feel something.",
    para3: "This isn't a travel agency. It's a movement for people who are done waiting for the right time.",
    ctaLabel: 'See Destinations',
    pillars: [
      { icon: '✦', title: 'Curated Experiences', body: 'Every trip is hand-picked — not tour-operator packages, but real adventures built around how we actually travel.' },
      { icon: '◈', title: 'Community First', body: 'CMWG is a crew, not a company. You travel with people who feel like old friends by the second day.' },
      { icon: '◎', title: 'Culture Over Comfort', body: 'We move with intention. Immersive, off-the-beaten-path, fully present. Not a resort holiday — a life moment.' },
    ],
  },
  navbar: {
    logoUrl: 'https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png',
    ctaLabel: 'Plan a Trip',
    ctaHref: '#plan',
    links: [
      { label: 'Destinations', href: '#destinations' },
      { label: 'Merch', href: '#shop' },
      { label: 'About', href: '#about' },
    ],
  },
  footer: {
    instagramHref: 'https://instagram.com/cmwg_tour',
    twitterHref: 'https://x.com/CmwgTours',
    whatsappHref: 'https://wa.me/2348160786498',
    youtubeHref: 'https://youtube.com/@ayanniyiayantayo907',
    emailHref: 'mailto:cmwg.worldwide@gmail.com',
    links: {
      Explore: [
        { label: 'Destinations', href: '#destinations' },
        { label: 'Experiences', href: '#experiences' },
        { label: 'Itineraries', href: '#itineraries' },
        { label: 'Travel Guides', href: '#guides' },
      ],
      Company: [
        { label: 'About CMWG', href: '#about' },
        { label: 'Our Story', href: '#story' },
        { label: 'Press', href: '#press' },
        { label: 'Careers', href: '#careers' },
      ],
      Legal: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Use', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
      ],
    },
  },
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)) }

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ msg, ok }) {
  return (
    <div style={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      display:'flex', alignItems:'center', gap:10,
      background: ok ? 'rgba(10,18,10,.97)' : 'rgba(18,8,8,.97)',
      border:`1px solid ${ok?'rgba(76,175,80,.4)':'rgba(244,67,54,.4)'}`,
      color: ok?'#81c784':'#e57373',
      padding:'13px 18px', borderRadius:10,
      fontFamily:"'DM Mono',monospace", fontSize:12,
      boxShadow:`0 20px 60px rgba(0,0,0,.5), 0 0 0 1px ${ok?'rgba(76,175,80,.08)':'rgba(244,67,54,.08)'}`,
      animation:'toastIn .25s cubic-bezier(.16,1,.3,1)',
      backdropFilter:'blur(12px)',
    }}>
      <span style={{ fontSize:16 }}>{ok?'✓':'✗'}</span>
      {msg}
    </div>
  )
}

// ─── FIELD ────────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type='text', rows, placeholder }) {
  const [focused, setFocused] = useState(false)
  const base = {
    width:'100%', background: focused?'#0d0d16':'#090910',
    border:`1px solid ${focused?'#c9a84c':'#1a1a28'}`,
    borderRadius:7, color:'#d8d0c8',
    fontFamily:"'DM Mono',monospace", fontSize:12,
    padding:'10px 12px', boxSizing:'border-box', outline:'none',
    transition:'all .18s', lineHeight:1.6,
    letterSpacing:'0.02em',
  }
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{
        display:'block', fontSize:9, letterSpacing:'0.22em',
        color:'#3a3a50', textTransform:'uppercase', marginBottom:6,
        fontFamily:"'DM Mono',monospace", fontWeight:500,
      }}>{label}</label>
      {rows
        ? <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows}
            placeholder={placeholder}
            style={{ ...base, resize:'vertical' }}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)}
            placeholder={placeholder}
            style={base}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
      }
    </div>
  )
}

// ─── CLOUDINARY UPLOAD ───────────────────────────────────────────────────────

const CLOUDINARY_CLOUD = 'dgjcl0te0'
const CLOUDINARY_PRESET = 'doxjq87c'

function CloudinaryUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY_PRESET)
    fd.append('folder', 'cmwg')
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd })
      const data = await res.json()
      if (data.secure_url) {
        onChange(data.secure_url)
      } else {
        setError('Upload failed')
      }
    } catch {
      setError('Upload failed')
    }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:9, letterSpacing:'0.22em', color:'#3a3a50', textTransform:'uppercase', marginBottom:6, fontFamily:"'DM Mono',monospace", fontWeight:500 }}>{label}</label>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start', flexDirection:'column' }}>
        {/* URL input */}
        <input
          type="text" value={value} onChange={e=>onChange(e.target.value)}
          placeholder="https://... or upload below"
          style={{
            width:'100%', background:'#090910', border:'1px solid #1a1a28',
            borderRadius:7, color:'#d8d0c8', fontFamily:"'DM Mono',monospace",
            fontSize:12, padding:'10px 12px', boxSizing:'border-box', outline:'none',
            transition:'all .18s', letterSpacing:'0.02em',
          }}
          onFocus={e=>e.target.style.borderColor='#c9a84c'}
          onBlur={e=>e.target.style.borderColor='#1a1a28'}
        />
        {/* Upload button */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button
            onClick={()=>inputRef.current?.click()}
            disabled={uploading}
            style={{
              background: uploading ? 'rgba(201,168,76,.1)' : 'transparent',
              border:'1px solid rgba(201,168,76,.35)',
              color: uploading ? '#8a7030' : '#c9a84c',
              padding:'6px 14px', borderRadius:6, cursor: uploading?'not-allowed':'pointer',
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.14em',
              display:'flex', alignItems:'center', gap:6, transition:'all .15s',
            }}
          >
            {uploading
              ? <><span style={{ display:'inline-block', width:8, height:8, border:'1px solid #8a7030', borderTop:'1px solid #c9a84c', borderRadius:'50%', animation:'spin .6s linear infinite' }} /> Uploading…</>
              : <>↑ Upload Image</>
            }
          </button>
          {error && <span style={{ color:'#e57373', fontFamily:"'DM Mono',monospace", fontSize:10 }}>{error}</span>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
        {/* Preview */}
        {value && (
          <div style={{ width:'100%', borderRadius:7, overflow:'hidden', height:100, marginTop:2 }}>
            <img src={value} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
          </div>
        )}
      </div>
    </div>
  )
}



function Pill({ label }) {
  if (!label) return null
  const styles = {
    Bestseller: { bg:'rgba(201,168,76,.15)', color:'#c9a84c', border:'rgba(201,168,76,.25)' },
    New: { bg:'rgba(76,175,80,.12)', color:'#81c784', border:'rgba(76,175,80,.25)' },
  }
  const s = styles[label] || { bg:'rgba(255,255,255,.05)', color:'#555', border:'rgba(255,255,255,.1)' }
  return (
    <span style={{
      fontSize:9, padding:'3px 9px', borderRadius:20,
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      fontFamily:"'DM Mono',monospace", fontWeight:600,
      letterSpacing:'0.12em', textTransform:'uppercase',
    }}>{label}</span>
  )
}

// ─── SECTION BUTTONS ─────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { key:'hero', label:'Hero', icon:'◈', desc:'Landing section' },
  { key:'destinations', label:'Destinations', icon:'◎', desc:'Trip listings' },
  { key:'merch', label:'Shop', icon:'✦', desc:'Merch catalog' },
  { key:'about', label:'About', icon:'❧', desc:'Brand story' },
  { key:'navbar', label:'Navbar', icon:'≡', desc:'Navigation' },
  { key:'footer', label:'Footer', icon:'⌘', desc:'Footer links' },
]

const OPS_SECTIONS = [
  { key:'destinations', label:'Destinations', icon:'◎', desc:'Trip listings' },
  { key:'merch', label:'Shop', icon:'✦', desc:'Merch catalog' },
  { key:'bookings', label:'Bookings', icon:'📅', desc:'Trip reservations' },
]

const CONFIG_SECTIONS = [
  { key:'hero', label:'Hero', icon:'◈', desc:'Landing section' },
  { key:'about', label:'About', icon:'❧', desc:'Brand story' },
  { key:'navbar', label:'Navbar', icon:'≡', desc:'Navigation' },
  { key:'footer', label:'Footer', icon:'⌘', desc:'Footer links' },
]

function SideNav({ active, onSelect, data }) {
  const [configOpen, setConfigOpen] = useState(false)

  const NavBtn = ({ s }) => {
    const isActive = active === s.key
    const isComingSoon = s.key === 'bookings'
    return (
      <button
        key={s.key}
        onClick={() => !isComingSoon && onSelect(s.key)}
        style={{
          display:'flex', alignItems:'center', gap:12,
          width:'100%', padding:'9px 10px', marginBottom:2,
          background: isActive ? 'linear-gradient(90deg,rgba(201,168,76,.1),rgba(201,168,76,.03))' : 'transparent',
          border:'none',
          borderLeft:`2px solid ${isActive?'#c9a84c':'transparent'}`,
          borderRadius:'0 7px 7px 0',
          color: isActive?'#c9a84c': isComingSoon ? '#2a2a3a' : '#444',
          cursor: isComingSoon ? 'default' : 'pointer',
          textAlign:'left',
          transition:'all .15s',
          opacity: isComingSoon ? 0.6 : 1,
        }}
        onMouseEnter={e=>{ if(!isActive && !isComingSoon){ e.currentTarget.style.background='rgba(255,255,255,.02)'; e.currentTarget.style.color='#777' } }}
        onMouseLeave={e=>{ if(!isActive && !isComingSoon){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#444' } }}
      >
        <span style={{ fontSize:15, width:20, textAlign:'center', flexShrink:0 }}>{s.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:isActive?600:400, letterSpacing:'0.01em', lineHeight:1.2 }}>{s.label}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', color:isActive?'rgba(201,168,76,.5)':'#2a2a3a', marginTop:1 }}>{s.desc}</div>
        </div>
        {isComingSoon && (
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.1em', color:'#2a2a3a', background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', padding:'2px 6px', borderRadius:4, flexShrink:0 }}>soon</span>
        )}
      </button>
    )
  }

  return (
    <div style={{
      width:220, flexShrink:0,
      background:'#060610',
      borderRight:'1px solid rgba(255,255,255,.04)',
      display:'flex', flexDirection:'column',
      paddingTop:0,
    }}>
      {/* Logo area */}
      <div style={{
        padding:'20px 18px 16px',
        borderBottom:'1px solid rgba(255,255,255,.04)',
      }}>
        <a href="/"><img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height:34 }} /></a>
        <p style={{ color:'#2a2a40', fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', margin:'10px 0 0' }}>Content Admin</p>
      </div>

      {/* Nav items */}
      <div style={{ flex:1, padding:'12px 10px', overflowY:'auto' }}>

        {/* Operations group */}
        <p style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', padding:'4px 8px 10px', opacity:0.6 }}>Operations</p>
        {OPS_SECTIONS.map(s => <NavBtn key={s.key} s={s} />)}

        {/* Site Config group — collapsible */}
        <div style={{ marginTop:16 }}>
          <button
            onClick={() => setConfigOpen(o => !o)}
            style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              width:'100%', background:'transparent', border:'none', cursor:'pointer',
              padding:'4px 8px 10px',
            }}
          >
            <span style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', opacity:0.6 }}>Site Config</span>
            <span style={{
              color:'#c9a84c', fontSize:9, opacity:0.6,
              transition:'transform .2s',
              display:'inline-block',
              transform: configOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}>▾</span>
          </button>

          {configOpen && (
            <div style={{ animation:'fadeIn .15s ease' }}>
              {CONFIG_SECTIONS.map(s => <NavBtn key={s.key} s={s} />)}
            </div>
          )}

          {!configOpen && (
            <p style={{ color:'#1e1e2e', fontFamily:"'DM Mono',monospace", fontSize:9, padding:'0 10px 4px', letterSpacing:'0.06em' }}>
              Hero · About · Navbar · Footer
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding:'14px 18px 20px', borderTop:'1px solid rgba(255,255,255,.04)' }}>
        <p style={{ color:'#252535', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:12 }}>Quick stats</p>
        {[
          ['Destinations', data.destinations.length, '◎'],
          ['Merch items', data.merch.length, '✦'],
          ['Nav links', data.navbar.links.length, '≡'],
        ].map(([label, count, icon]) => (
          <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'#2e2e42', fontFamily:"'DM Mono',monospace", fontSize:10, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:10, color:'#3a3a50' }}>{icon}</span>{label}
            </span>
            <span style={{
              color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:600,
              background:'rgba(201,168,76,.08)', padding:'1px 8px', borderRadius:4,
            }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const S = {
  sectionTitle: {
    color:'#e8e0d0',
    fontFamily:"'DM Serif Display',serif",
    fontSize:26, fontWeight:400,
    margin:'0 0 6px',
    letterSpacing:'-0.02em',
    lineHeight:1.1,
  },
  sectionSub: {
    color:'#2e2e48',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, letterSpacing:'0.18em',
    textTransform:'uppercase',
    margin:'0 0 28px',
  },
  subHead: {
    color:'#c9a84c',
    fontFamily:"'DM Mono',monospace",
    fontSize:9, letterSpacing:'0.26em',
    textTransform:'uppercase',
    margin:'24px 0 12px',
    display:'flex', alignItems:'center', gap:8,
  },
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 18px' },
  grid3: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px' },
  card: {
    background:'rgba(255,255,255,.02)',
    border:'1px solid rgba(255,255,255,.05)',
    borderRadius:10, padding:'16px 18px',
  },
  addBtn: {
    background:'transparent',
    border:'1px solid rgba(201,168,76,.35)',
    color:'#c9a84c', padding:'7px 16px',
    borderRadius:7, cursor:'pointer',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, letterSpacing:'0.12em',
    transition:'all .15s',
  },
  saveBtn: {
    background:'linear-gradient(135deg,#c9a84c,#e8c96a)',
    border:'none', color:'#060608',
    padding:'10px 22px', borderRadius:7,
    cursor:'pointer',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, fontWeight:700,
    letterSpacing:'0.14em',
    boxShadow:'0 4px 16px rgba(201,168,76,.3)',
  },
  cancelBtn: {
    background:'transparent',
    border:'1px solid rgba(255,255,255,.08)',
    color:'#555', padding:'10px 18px',
    borderRadius:7, cursor:'pointer',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, letterSpacing:'0.1em',
  },
  editBtn: {
    background:'transparent',
    border:'1px solid rgba(255,255,255,.07)',
    color:'#666', padding:'5px 13px',
    borderRadius:5, cursor:'pointer',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, transition:'all .15s',
  },
  delBtn: {
    background:'transparent',
    border:'1px solid rgba(244,67,54,.15)',
    color:'rgba(244,67,54,.5)',
    padding:'5px 10px', borderRadius:5,
    cursor:'pointer',
    fontFamily:"'DM Mono',monospace",
    fontSize:10, transition:'all .15s',
  },
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
      <div>
        <h2 style={S.sectionTitle}>{title}</h2>
        <p style={S.sectionSub}>{sub}</p>
      </div>
      {action}
    </div>
  )
}

// ─── HERO EDITOR ─────────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }) {
  const upd = (k,v) => onChange({ ...data, [k]:v })
  const updCard = (i,k,v) => {
    const cards = [...data.cards]; cards[i]={...cards[i],[k]:v}; onChange({...data,cards})
  }
  return (
    <div>
      <SectionHeader title="Hero Section" sub="Landing page — first impression" />
      <div style={S.grid2}>
        <Field label="Eyebrow text" value={data.eyebrow} onChange={v=>upd('eyebrow',v)} placeholder="Explore Africa Differently" />
        <Field label="Video URL" value={data.videoUrl} onChange={v=>upd('videoUrl',v)} placeholder="https://..." />
      </div>
      <div style={S.grid2}>
        <Field label="Title line 1" value={data.title1} onChange={v=>upd('title1',v)} />
        <Field label="Title line 2 (gold highlight)" value={data.title2} onChange={v=>upd('title2',v)} />
      </div>
      <Field label="Subtitle text" value={data.text} onChange={v=>upd('text',v)} rows={2} />

      <div style={S.subHead}><span>◈</span> Quick Action Cards</div>
      {data.cards.map((c,i) => (
        <div key={i} style={{ ...S.card, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.18em', color:'#c9a84c', textTransform:'uppercase' }}>Card {i+1}</span>
          </div>
          <div style={S.grid3}>
            <Field label="Heading" value={c.heading} onChange={v=>updCard(i,'heading',v)} />
            <Field label="Subtitle" value={c.sub} onChange={v=>updCard(i,'sub',v)} />
            <Field label="Link href" value={c.href} onChange={v=>updCard(i,'href',v)} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── DESTINATIONS EDITOR ─────────────────────────────────────────────────────

function DestinationsEditor({ data, onChange }) {
  const [editing, setEditing] = useState(null)

  const form = editing ? data.find(d => d.id === editing) : null

  const openEdit = (item) => setEditing(item.id)
  const closeEdit = () => setEditing(null)
  const updateForm = (patch) => onChange(data.map(d => d.id === editing ? { ...d, ...patch } : d))
  const deleteItem = (id) => { if (editing === id) setEditing(null); onChange(data.filter(d=>d.id!==id)) }
  const addNew = () => {
    const n = { id:Date.now(), title:'New Destination', desc:'', tagline:'', price:'', img:'', category:'West Africa' }
    onChange([...data,n]); openEdit(n)
  }

  const CATS = ['West Africa','East Africa','Southern Africa','North Africa']

  return (
    <div>
      <SectionHeader
        title="Destinations"
        sub="Trip listings shown on homepage"
        action={<button onClick={addNew} style={S.addBtn}>+ Add Destination</button>}
      />

      {editing && form && (
        <div style={{ ...S.card, marginBottom:24, border:'1px solid rgba(201,168,76,.25)', background:'rgba(201,168,76,.03)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <div style={{ width:3, height:16, background:'#c9a84c', borderRadius:2 }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.16em', color:'#c9a84c', textTransform:'uppercase' }}>Editing: {form.title}</span>
          </div>
          <div style={S.grid2}>
            <Field label="Title" value={form.title} onChange={v=>updateForm({title:v})} />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:9, letterSpacing:'0.22em', color:'#3a3a50', textTransform:'uppercase', marginBottom:6, fontFamily:"'DM Mono',monospace" }}>Category</label>
              <select value={form.category} onChange={e=>updateForm({category:e.target.value})} style={{
                width:'100%', background:'#090910', border:'1px solid #1a1a28',
                borderRadius:7, color:'#d8d0c8', fontFamily:"'DM Mono',monospace",
                fontSize:12, padding:'10px 12px', outline:'none', cursor:'pointer',
              }}>
                {CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <Field label="Short description" value={form.desc} onChange={v=>updateForm({desc:v})} />
          <Field label="Tagline (shown on card)" value={form.tagline} onChange={v=>updateForm({tagline:v})} rows={2} />
          <div style={S.grid2}>
            <Field label="Price (optional)" value={form.price} onChange={v=>updateForm({price:v})} placeholder="e.g. $1,200" />
          </div>
          <CloudinaryUpload label="Destination Image" value={form.img} onChange={v=>updateForm({img:v})} />
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={closeEdit} style={S.cancelBtn}>Done</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map((dest,idx) => (
          <div key={dest.id} style={{
            ...S.card,
            display:'flex', alignItems:'center', gap:14,
            transition:'all .15s',
          }}>
            <span style={{ color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, width:20, textAlign:'center', flexShrink:0 }}>{idx+1}</span>
            {dest.img
              ? <img src={dest.img} alt="" style={{ width:72, height:48, objectFit:'cover', borderRadius:6, flexShrink:0 }} onError={e=>e.target.style.display='none'} />
              : <div style={{ width:72, height:48, borderRadius:6, background:'rgba(255,255,255,.03)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#2a2a38', fontSize:18 }}>◎</span>
                </div>
            }
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:'#e8e0d0', fontSize:13, fontWeight:500, margin:'0 0 3px', fontFamily:"'DM Sans',sans-serif" }}>{dest.title}</p>
              <p style={{ color:'#3a3a50', fontSize:11, margin:0, fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{dest.desc}</p>
            </div>
            <span style={{
              fontSize:9, letterSpacing:'0.1em', color:'#444',
              background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)',
              padding:'3px 10px', borderRadius:4,
              fontFamily:"'DM Mono',monospace", flexShrink:0,
            }}>{dest.category}</span>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              <button onClick={()=>openEdit(dest)} style={S.editBtn}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#aaa'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#666'}}>
                Edit
              </button>
              <button onClick={()=>deleteItem(dest.id)} style={S.delBtn}
                onMouseEnter={e=>{e.currentTarget.style.color='#e57373';e.currentTarget.style.borderColor='rgba(244,67,54,.4)'}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(244,67,54,.5)';e.currentTarget.style.borderColor='rgba(244,67,54,.15)'}}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MERCH EDITOR ────────────────────────────────────────────────────────────

function MerchEditor({ data, onChange }) {
  const [editing, setEditing] = useState(null)

  // form reads directly from data — no separate form state
  const form = editing ? data.find(d => d.id === editing) : null

  const openEdit = (item) => setEditing(item.id)
  const closeEdit = () => setEditing(null)

  // Every field change writes directly into parent data immediately
  const updateForm = (patch) => {
    onChange(data.map(d => d.id === editing ? { ...d, ...patch } : d))
  }

  const deleteItem = (id) => { if (editing === id) setEditing(null); onChange(data.filter(d=>d.id!==id)) }
  const addNew = () => {
    const n = { id:Date.now(), name:'New Product', price:'$0', tag:'', desc:'', category:'Travel Gear', imgs:[], fields:['note'] }
    onChange([...data, n]); openEdit(n)
  }

  const ALL_FIELDS = ['sleeve','size','height','age','note']
  const updateImg = (i,v) => { const imgs=[...(form.imgs||[])]; imgs[i]=v; updateForm({imgs}) }
  const addImg = () => updateForm({imgs:[...(form.imgs||[]),'']})
  const removeImg = (i) => updateForm({imgs:(form.imgs||[]).filter((_,idx)=>idx!==i)})
  const toggleField = (f) => {
    const fields = (form.fields||[]).includes(f)?(form.fields||[]).filter(x=>x!==f):[...(form.fields||[]),f]
    updateForm({fields})
  }

  return (
    <div>
      <SectionHeader
        title="Merch & Shop"
        sub="Product catalog and order form fields"
        action={<button onClick={addNew} style={S.addBtn}>+ Add Product</button>}
      />

      {editing && form && (
        <div style={{ ...S.card, marginBottom:24, border:'1px solid rgba(201,168,76,.25)', background:'rgba(201,168,76,.03)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
            <div style={{ width:3, height:16, background:'#c9a84c', borderRadius:2 }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.16em', color:'#c9a84c', textTransform:'uppercase' }}>Editing: {form.name}</span>
          </div>
          <div style={S.grid3}>
            <Field label="Product name" value={form.name} onChange={v=>updateForm({name:v})} />
            <Field label="Price" value={form.price} onChange={v=>updateForm({price:v})} placeholder="$35" />
            <Field label="Tag (Bestseller / New)" value={form.tag} onChange={v=>updateForm({tag:v})} />
          </div>
          <div style={S.grid2}>
            <Field label="Category" value={form.category} onChange={v=>updateForm({category:v})} placeholder="Clothing / Travel Gear" />
          </div>
          <Field label="Description" value={form.desc} onChange={v=>updateForm({desc:v})} rows={2} />

          <div style={S.subHead}><span>⬡</span> Product Images (up to 3)</div>
          {(form.imgs||[]).map((img,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
              <div style={{ flex:1 }}>
                <CloudinaryUpload label={`Image ${i+1}`} value={img} onChange={v=>updateImg(i,v)} />
              </div>
              <button onClick={()=>removeImg(i)} style={{ ...S.delBtn, marginTop:22 }}>✕</button>
            </div>
          ))}
          {(form.imgs||[]).length < 3 && <button onClick={addImg} style={{ ...S.addBtn, fontSize:9, marginBottom:20 }}>+ Add Image</button>}

          <div style={S.subHead}><span>⊡</span> Order Form Fields</div>
          <p style={{ color:'#2e2e48', fontSize:10, fontFamily:"'DM Mono',monospace", marginBottom:12, letterSpacing:'0.06em' }}>Toggle which fields appear in the order form</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {ALL_FIELDS.map(f => (
              <button key={f} onClick={()=>toggleField(f)} style={{
                padding:'6px 16px', borderRadius:20,
                border:`1px solid ${(form.fields||[]).includes(f)?'rgba(201,168,76,.4)':'rgba(255,255,255,.08)'}`,
                background: (form.fields||[]).includes(f)?'rgba(201,168,76,.1)':'transparent',
                color: (form.fields||[]).includes(f)?'#c9a84c':'#3a3a50',
                fontFamily:"'DM Mono',monospace", fontSize:10, cursor:'pointer',
                textTransform:'capitalize', letterSpacing:'0.1em', transition:'all .15s',
              }}>{f}</button>
            ))}
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={closeEdit} style={S.cancelBtn}>Done</button>
          </div>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map((item,idx) => (
          <div key={item.id} style={{ ...S.card, display:'flex', alignItems:'center', gap:14 }}>
            <span style={{ color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, width:20, textAlign:'center', flexShrink:0 }}>{idx+1}</span>
            {item.imgs && item.imgs[0]
              ? <img src={item.imgs[0]} alt="" style={{ width:52, height:52, objectFit:'cover', borderRadius:6, flexShrink:0 }} onError={e=>e.target.style.display='none'} />
              : <div style={{ width:52, height:52, borderRadius:6, background:'rgba(255,255,255,.03)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#2a2a38', fontSize:16 }}>✦</span>
                </div>
            }
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <p style={{ color:'#e8e0d0', fontSize:13, fontWeight:500, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{item.name}</p>
                <Pill label={item.tag} />
              </div>
              <p style={{ color:'#3a3a50', fontSize:11, margin:0, fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.desc}</p>
            </div>
            <span style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:13, fontWeight:600, flexShrink:0 }}>{item.price}</span>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              <button onClick={()=>openEdit(item)} style={S.editBtn}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#aaa'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#666'}}>
                Edit
              </button>
              <button onClick={()=>deleteItem(item.id)} style={S.delBtn}
                onMouseEnter={e=>{e.currentTarget.style.color='#e57373';e.currentTarget.style.borderColor='rgba(244,67,54,.4)'}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(244,67,54,.5)';e.currentTarget.style.borderColor='rgba(244,67,54,.15)'}}>
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ABOUT EDITOR ─────────────────────────────────────────────────────────────

function AboutEditor({ data, onChange }) {
  const upd = (k,v) => onChange({ ...data, [k]:v })
  const updPillar = (i,k,v) => {
    const pillars=[...data.pillars]; pillars[i]={...pillars[i],[k]:v}; onChange({...data,pillars})
  }
  return (
    <div>
      <SectionHeader title="About Section" sub="Brand story and values" />
      <Field label="Main heading" value={data.heading} onChange={v=>upd('heading',v)} />
      <Field label="Paragraph 1" value={data.para1} onChange={v=>upd('para1',v)} rows={3} />
      <Field label="Paragraph 2" value={data.para2} onChange={v=>upd('para2',v)} rows={3} />
      <Field label="Paragraph 3" value={data.para3} onChange={v=>upd('para3',v)} rows={3} />
      <Field label="CTA button label" value={data.ctaLabel} onChange={v=>upd('ctaLabel',v)} />

      <div style={S.subHead}><span>❧</span> Pillars</div>
      {data.pillars.map((p,i) => (
        <div key={i} style={{ ...S.card, marginBottom:10 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.18em', color:'#c9a84c', textTransform:'uppercase', display:'block', marginBottom:12 }}>{p.icon} Pillar {i+1}</span>
          <div style={S.grid2}>
            <Field label="Icon (emoji/symbol)" value={p.icon} onChange={v=>updPillar(i,'icon',v)} />
            <Field label="Title" value={p.title} onChange={v=>updPillar(i,'title',v)} />
          </div>
          <Field label="Body text" value={p.body} onChange={v=>updPillar(i,'body',v)} rows={2} />
        </div>
      ))}
    </div>
  )
}

// ─── NAVBAR EDITOR ────────────────────────────────────────────────────────────

function NavbarEditor({ data, onChange }) {
  const upd = (k,v) => onChange({ ...data, [k]:v })
  const updLink = (i,k,v) => { const links=[...data.links]; links[i]={...links[i],[k]:v}; onChange({...data,links}) }
  const addLink = () => onChange({ ...data, links:[...data.links,{label:'New Link',href:'#'}] })
  const delLink = (i) => onChange({ ...data, links:data.links.filter((_,idx)=>idx!==i) })
  return (
    <div>
      <SectionHeader title="Navbar" sub="Navigation and branding" />
      <div style={S.grid2}>
        <Field label="Logo image URL" value={data.logoUrl} onChange={v=>upd('logoUrl',v)} />
        <Field label="CTA button label" value={data.ctaLabel} onChange={v=>upd('ctaLabel',v)} />
      </div>
      <Field label="CTA button href" value={data.ctaHref} onChange={v=>upd('ctaHref',v)} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'20px 0 12px' }}>
        <div style={S.subHead}><span>≡</span> Nav Links</div>
        <button onClick={addLink} style={S.addBtn}>+ Add Link</button>
      </div>
      {data.links.map((link,i) => (
        <div key={i} style={{ ...S.card, display:'flex', gap:14, alignItems:'flex-end', marginBottom:8 }}>
          <div style={{ flex:1 }}><Field label="Label" value={link.label} onChange={v=>updLink(i,'label',v)} /></div>
          <div style={{ flex:1 }}><Field label="Href" value={link.href} onChange={v=>updLink(i,'href',v)} /></div>
          <button onClick={()=>delLink(i)} style={{ ...S.delBtn, marginBottom:16 }}>✕</button>
        </div>
      ))}
    </div>
  )
}

// ─── FOOTER EDITOR ────────────────────────────────────────────────────────────

function FooterEditor({ data, onChange }) {
  const upd = (k,v) => onChange({ ...data, [k]:v })
  const updLink = (group,i,k,v) => {
    const links={...data.links}; links[group]=[...links[group]]; links[group][i]={...links[group][i],[k]:v}
    onChange({...data,links})
  }
  const SOCIALS = [
    ['Instagram', 'instagramHref', '📸'],
    ['X / Twitter', 'twitterHref', '𝕏'],
    ['WhatsApp', 'whatsappHref', '💬'],
    ['YouTube', 'youtubeHref', '▶'],
    ['Email (mailto:)', 'emailHref', '✉'],
  ]
  return (
    <div>
      <SectionHeader title="Footer" sub="Social links and footer navigation" />
      <div style={S.subHead}><span>⌘</span> Social Links</div>
      <div style={S.grid2}>
        {SOCIALS.map(([label, key]) => (
          <Field key={key} label={label} value={data[key]} onChange={v=>upd(key,v)} />
        ))}
      </div>
      {Object.entries(data.links).map(([group,links]) => (
        <div key={group}>
          <div style={S.subHead}><span>→</span> {group} Links</div>
          {links.map((link,i) => (
            <div key={i} style={{ ...S.card, display:'flex', gap:14, alignItems:'flex-end', marginBottom:8 }}>
              <div style={{ flex:1 }}><Field label="Label" value={link.label} onChange={v=>updLink(group,i,'label',v)} /></div>
              <div style={{ flex:2 }}><Field label="Href" value={link.href} onChange={v=>updLink(group,i,'href',v)} /></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── PREVIEW PANEL ────────────────────────────────────────────────────────────

function PreviewPanel({ active, data }) {
  return (
    <div style={{
      width:260, flexShrink:0,
      background:'#040408',
      borderLeft:'1px solid rgba(255,255,255,.04)',
      padding:'20px 16px', overflowY:'auto',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
        <div style={{ width:6, height:6, borderRadius:'50%', background:'#c9a84c', boxShadow:'0 0 8px rgba(201,168,76,.5)' }} />
        <span style={{ color:'#2a2a40', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.28em', textTransform:'uppercase' }}>Live Preview</span>
      </div>

      {active==='hero' && (
        <div>
          <p style={{ color:'#3a3a50', fontSize:9, letterSpacing:'0.16em', fontFamily:"'DM Mono',monospace", textTransform:'uppercase', marginBottom:6 }}>{data.hero.eyebrow}</p>
          <h3 style={{ color:'#e8e0d0', fontFamily:"'DM Serif Display',serif", fontSize:20, fontWeight:400, margin:'0 0 8px', lineHeight:1.2 }}>
            {data.hero.title1}<br /><span style={{ color:'#c9a84c' }}>{data.hero.title2}</span>
          </h3>
          <p style={{ color:'#2e2e48', fontSize:11, lineHeight:1.6, marginBottom:14, fontFamily:"'DM Sans',sans-serif" }}>{data.hero.text}</p>
          {data.hero.cards.map((c,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.05)', padding:'9px 11px', marginBottom:6, borderRadius:6 }}>
              <p style={{ color:'#d8d0c8', fontSize:10, fontWeight:600, margin:'0 0 2px', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif" }}>{c.heading}</p>
              <p style={{ color:'#3a3a50', fontSize:9, margin:0, fontFamily:"'DM Mono',monospace" }}>{c.sub}</p>
            </div>
          ))}
        </div>
      )}

      {active==='destinations' && (
        <div>
          {data.destinations.map(d => (
            <div key={d.id} style={{ marginBottom:14 }}>
              {d.img && <div style={{ borderRadius:7, overflow:'hidden', height:72, marginBottom:7 }}>
                <img src={d.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
              </div>}
              <p style={{ color:'#e8e0d0', fontSize:11, fontWeight:500, margin:'0 0 2px', fontFamily:"'DM Sans',sans-serif" }}>{d.title}</p>
              <p style={{ color:'#3a3a50', fontSize:10, margin:0, fontFamily:"'DM Mono',monospace" }}>{d.desc}</p>
            </div>
          ))}
        </div>
      )}

      {active==='merch' && (
        <div>
          {data.merch.map(m => (
            <div key={m.id} style={{ ...S.card, marginBottom:8, padding:'10px 12px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <p style={{ color:'#e8e0d0', fontSize:11, fontWeight:500, margin:0, fontFamily:"'DM Sans',sans-serif" }}>{m.name}</p>
                <Pill label={m.tag} />
              </div>
              <p style={{ color:'#c9a84c', fontSize:11, fontWeight:700, margin:'0 0 3px', fontFamily:"'DM Mono',monospace" }}>{m.price}</p>
              <p style={{ color:'#2e2e48', fontSize:10, margin:0, lineHeight:1.5, fontFamily:"'DM Mono',monospace" }}>{m.desc}</p>
            </div>
          ))}
        </div>
      )}

      {active==='about' && (
        <div>
          <h3 style={{ color:'#e8e0d0', fontFamily:"'DM Serif Display',serif", fontSize:16, fontWeight:400, margin:'0 0 10px', lineHeight:1.3 }}>{data.about.heading}</h3>
          <p style={{ color:'#3a3a50', fontSize:10, lineHeight:1.7, marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>{data.about.para1}</p>
          {data.about.pillars.map((p,i) => (
            <div key={i} style={{ borderLeft:'2px solid rgba(201,168,76,.2)', paddingLeft:10, marginBottom:10 }}>
              <p style={{ color:'#c9a84c', fontSize:11, margin:'0 0 2px', fontFamily:"'DM Sans',sans-serif" }}>{p.icon} {p.title}</p>
              <p style={{ color:'#2e2e48', fontSize:9, margin:0, lineHeight:1.6, fontFamily:"'DM Mono',monospace" }}>{p.body}</p>
            </div>
          ))}
        </div>
      )}

      {active==='navbar' && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, padding:'10px 12px', background:'rgba(255,255,255,.02)', borderRadius:7 }}>
            <img src={data.navbar.logoUrl} alt="logo" style={{ height:24 }} onError={e=>e.target.style.display='none'} />
          </div>
          {data.navbar.links.map((l,i) => (
            <div key={i} style={{ color:'#555', fontSize:10, fontFamily:"'DM Mono',monospace", padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)', letterSpacing:'0.08em' }}>
              {l.label} <span style={{ color:'#2a2a38' }}>→ {l.href}</span>
            </div>
          ))}
          <div style={{ marginTop:12, display:'inline-block', border:'1px solid rgba(201,168,76,.4)', color:'#c9a84c', padding:'6px 14px', fontSize:9, fontFamily:"'DM Mono',monospace", letterSpacing:'0.12em', borderRadius:5 }}>{data.navbar.ctaLabel}</div>
        </div>
      )}

      {active==='footer' && (
        <div>
          <p style={{ color:'#2e2e48', fontSize:9, fontFamily:"'DM Mono',monospace", marginBottom:10, letterSpacing:'0.12em', textTransform:'uppercase' }}>Social</p>
          {[['Instagram',data.footer.instagramHref],['Twitter/X',data.footer.twitterHref],['WhatsApp',data.footer.whatsappHref],['YouTube',data.footer.youtubeHref],['Email',data.footer.emailHref]].map(([name,href]) => (
            <p key={name} style={{ fontSize:9, color:'#2e2e48', fontFamily:"'DM Mono',monospace", margin:'0 0 5px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              <span style={{ color:'#c9a84c' }}>{name}</span>{' '}{href}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'

function AdminPage() {
  const [data, setData] = useState(deepClone(INIT))
  const [active, setActive] = useState('destinations')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const upd = (key) => (val) => { setData(prev => ({ ...prev, [key]: val })); setDirty(true) }

  const showToast = (msg, ok=true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2800)
  }

  // Set tab title
  useEffect(() => {
    document.title = 'CMWG Admin'
    return () => { document.title = 'CMWG Travel — Explore the World' }
  }, [])

  // Warn on tab close / refresh when there are unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  useEffect(() => {
    Promise.all([
      fetch(`${SCRIPT_URL}?t=${Date.now()}`).then(r=>r.json()),
      fetch(`${SCRIPT_URL}?type=merch&t=${Date.now()}`).then(r=>r.json()),
    ])
      .then(([destRes, merchRes]) => {
        setData(prev => ({
          ...prev,
          ...(destRes.data?.length ? { destinations: destRes.data.map(d=>({...d,id:d.id||Date.now()})) } : {}),
          ...(merchRes.data?.length ? { merch: merchRes.data.map(m=>({...m,id:m.id||Date.now()})) } : {}),
        }))
      })
      .catch(()=>{})
      .finally(()=>setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    showToast('Saving to Google Sheets…', true)
    try {
      await Promise.all([
        fetch(SCRIPT_URL, { method:'POST', body:JSON.stringify({ type:'save_destinations', destinations:data.destinations }) }),
        fetch(SCRIPT_URL, { method:'POST', body:JSON.stringify({ type:'save_merch', merch:data.merch }) }),
      ])
      showToast('Changes saved successfully ✓')
      setDirty(false)
    } catch {
      showToast('Save failed — check console', false)
    }
    setSaving(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset all changes to original data?')) {
      setData(deepClone(INIT)); setDirty(false); showToast('Reset to defaults')
    }
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' })
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='cmwg-content.json'; a.click()
    showToast('JSON exported')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#05050a', color:'#e8e0d0', fontFamily:"'DM Sans',sans-serif", display:'flex', flexDirection:'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1e1e2e; border-radius:2px; }
        input, textarea, select { color-scheme:dark; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>

      {/* TOP BAR */}
      <div style={{
        height:52, flexShrink:0,
        background:'rgba(5,5,12,.95)',
        borderBottom:'1px solid rgba(255,255,255,.05)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 20px',
        backdropFilter:'blur(20px)',
        position:'sticky', top:0, zIndex:100,
      }}>
        {/* Left: breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <a href="/">
            <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height:40, display:'block' }} />
          </a>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,.06)' }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.2em', color:'#3a3a50', textTransform:'uppercase' }}>Admin Edit/Create</span>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,.06)' }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#444', letterSpacing:'0.02em' }}>
            {[...OPS_SECTIONS, ...CONFIG_SECTIONS].find(s=>s.key===active)?.label}
          </span>
        </div>

        {/* Right: actions */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={exportJson} style={{
            background:'transparent', border:'1px solid rgba(255,255,255,.07)', color:'#444',
            padding:'6px 14px', borderRadius:6, cursor:'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.14em',
            transition:'all .15s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#888'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#444'}}>
            ↓ Export
          </button>
          <button onClick={handleReset} style={{
            background:'transparent', border:'1px solid rgba(255,255,255,.07)', color:'#444',
            padding:'6px 14px', borderRadius:6, cursor:'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.14em',
            transition:'all .15s',
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#888'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#444'}}>
            Reset
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving?'rgba(201,168,76,.2)':'linear-gradient(135deg,#c9a84c,#e8c96a)',
            border: dirty && !saving ? '1px solid #e8c96a' : 'none',
            color: saving?'#c9a84c':'#050508',
            padding:'7px 18px', borderRadius:6, cursor: saving?'not-allowed':'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700,
            letterSpacing:'0.16em', textTransform:'uppercase',
            boxShadow: saving?'none': dirty ? '0 2px 20px rgba(201,168,76,.55)' : '0 2px 14px rgba(201,168,76,.3)',
            transition:'all .2s',
            display:'flex', alignItems:'center', gap:6,
          }}>
            {dirty && !saving && <span style={{ width:5, height:5, borderRadius:'50%', background:'#050508', flexShrink:0 }} />}
            {saving ? '··· Saving' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        <SideNav active={active} onSelect={setActive} data={data} />

        {/* MAIN EDITOR */}
        <div style={{
          flex:1, padding:'36px 40px',
          overflowY:'auto', minWidth:0,
          animation:'fadeIn .2s ease',
        }}>
          {active==='hero' && <HeroEditor data={data.hero} onChange={upd('hero')} />}
          {active==='destinations' && <DestinationsEditor data={data.destinations} onChange={upd('destinations')} />}
          {active==='merch' && <MerchEditor data={data.merch} onChange={upd('merch')} />}
          {active==='about' && <AboutEditor data={data.about} onChange={upd('about')} />}
          {active==='navbar' && <NavbarEditor data={data.navbar} onChange={upd('navbar')} />}
          {active==='footer' && <FooterEditor data={data.footer} onChange={upd('footer')} />}
        </div>

        <PreviewPanel active={active} data={data} />
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div style={{
          position:'fixed', inset:0, zIndex:200,
          background:'rgba(5,5,12,.92)',
          backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center',
          flexDirection:'column', gap:16,
        }}>
          <div style={{ width:28, height:28, border:'2px solid rgba(201,168,76,.15)', borderTop:'2px solid #c9a84c', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
          <p style={{ color:'#3a3a50', fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', animation:'pulse 1.5s ease infinite' }}>Loading content</p>
        </div>
      )}

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  )
}

// ─── AUTH GATE ────────────────────────────────────────────────────────────────

export default function AdminPageWithAuth() {
  const [authed, setAuthed] = useState(false)
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <AdminPage />
}
