import { useState, useEffect, useRef } from 'react'

// ─── AUTH ─────────────────────────────────────────────────────────────────────

const ADMINS = [
  { name: 'admin',          user: '576e2fcd4689573c23734124d347cfd24a2c96fdb91fa632bd6e802892e2f2f9', pass: 'ad1277823788f0ccc4385af97ce54a9875b8806f0ca60684f2a4e257d817a4bb' },
  { name: 'bibitayouthman', user: '310f5adb9d9ba6b5d9fb83ef4fc1e08ba97eb79e210942ac259c7963ade68e9a', pass: '79e1b737b7800d8142fa495e26a72e0f081b554fa57910a67fa1e7d0997badcd' },
]

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
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const [hu, hp] = await Promise.all([sha256(user), sha256(pass)])
    const match = ADMINS.find(a => a.user === hu && a.pass === hp)
    if (match) {
      onLogin(match.name)
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
            <div style={{ position:'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={onKey}
                autoComplete="current-password"
                onFocus={()=>setFocused('pass')} onBlur={()=>setFocused(null)}
                style={{
                  width:'100%', background:focused==='pass'?'#0f0f1a':'#0a0a10',
                  border:`1px solid ${focused==='pass'?'#c9a84c':'#1e1e30'}`,
                  borderRadius:8, color:'#e8e0d0',
                  fontFamily:"'DM Mono',monospace", fontSize:13,
                  padding:'12px 42px 12px 14px', boxSizing:'border-box', outline:'none',
                  transition:'all .2s', letterSpacing:'0.04em',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', padding:4,
                  color: showPass ? '#c9a84c' : '#3a3a5a',
                  transition:'color .2s', lineHeight:1,
                }}
              >
                {showPass
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
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
      position:'fixed', bottom:'calc(28px + env(safe-area-inset-bottom))', right:16, left:16, zIndex:9999,
      maxWidth:360, margin:'0 auto',
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



// ─── CLOUDINARY VIDEO UPLOAD ─────────────────────────────────────────────────

function CloudinaryVideoUpload({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY_PRESET)
    fd.append('folder', 'cmwg')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/video/upload`)

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (data.secure_url) onChange(data.secure_url)
        else setError('Upload failed')
      } catch { setError('Upload failed') }
      setUploading(false)
      e.target.value = ''
    }

    xhr.onerror = () => { setError('Upload failed'); setUploading(false) }
    xhr.send(fd)
  }

  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', fontSize:9, letterSpacing:'0.22em', color:'#3a3a50', textTransform:'uppercase', marginBottom:6, fontFamily:"'DM Mono',monospace", fontWeight:500 }}>{label}</label>
      <div style={{ display:'flex', gap:8, alignItems:'flex-start', flexDirection:'column' }}>
        <input
          type="text" value={value} onChange={e=>onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/... or upload below"
          style={{
            width:'100%', background:'#090910', border:'1px solid #1a1a28',
            borderRadius:7, color:'#d8d0c8', fontFamily:"'DM Mono',monospace",
            fontSize:12, padding:'10px 12px', boxSizing:'border-box', outline:'none',
            transition:'all .18s', letterSpacing:'0.02em',
          }}
          onFocus={e=>e.target.style.borderColor='#c9a84c'}
          onBlur={e=>e.target.style.borderColor='#1a1a28'}
        />

        <div style={{ display:'flex', alignItems:'center', gap:10, width:'100%' }}>
          <button
            onClick={()=>inputRef.current?.click()}
            disabled={uploading}
            style={{
              background: uploading ? 'rgba(201,168,76,.1)' : 'transparent',
              border:'1px solid rgba(201,168,76,.35)',
              color: uploading ? '#8a7030' : '#c9a84c',
              padding:'6px 14px', borderRadius:6, cursor: uploading?'not-allowed':'pointer',
              fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.14em',
              display:'flex', alignItems:'center', gap:6, transition:'all .15s', flexShrink:0,
            }}
          >
            {uploading
              ? <><span style={{ display:'inline-block', width:8, height:8, border:'1px solid #8a7030', borderTop:'1px solid #c9a84c', borderRadius:'50%', animation:'spin .6s linear infinite' }} /> Uploading…</>
              : <>▶ Upload Video</>
            }
          </button>

          {/* Progress bar */}
          {uploading && (
            <div style={{ flex:1, height:3, background:'rgba(255,255,255,.06)', borderRadius:2, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:2,
                background:'linear-gradient(90deg,#c9a84c,#e8c96a)',
                width:`${progress}%`, transition:'width .2s ease',
              }} />
            </div>
          )}
          {uploading && (
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#c9a84c', flexShrink:0 }}>{progress}%</span>
          )}
          {error && <span style={{ color:'#e57373', fontFamily:"'DM Mono',monospace", fontSize:10 }}>{error}</span>}
        </div>

        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} style={{ display:'none' }} />

        {/* Preview */}
        {value && !uploading && (
          <div style={{ width:'100%', borderRadius:7, overflow:'hidden', height:100, marginTop:2, background:'#080810', position:'relative' }}>
            <video src={value} muted loop playsInline
              style={{ width:'100%', height:'100%', objectFit:'cover' }}
              onMouseEnter={e=>e.target.play()}
              onMouseLeave={e=>{ e.target.pause(); e.target.currentTime=0 }}
            />
            <div style={{
              position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              pointerEvents:'none',
            }}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background:'rgba(0,0,0,.55)', border:'1px solid rgba(201,168,76,.4)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <span style={{ color:'#c9a84c', fontSize:10, marginLeft:2 }}>▶</span>
              </div>
            </div>
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

const ICON_HERO     = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}><path fill="currentColor" d="M5 21V3h14v18zm1-1h12V4H6zm1.73-2.5h8.693l-2.757-3.654l-2.454 3.077l-1.589-1.884zM6 20V4z" /></svg>
const ICON_ABOUT    = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" style={{flexShrink:0}}><path fill="currentColor" fillRule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.179 42.667 256c0 117.82 95.513 213.334 213.333 213.334c117.822 0 213.334-95.513 213.334-213.334S373.822 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334c94.107 0 170.667 76.56 170.667 170.666S350.107 426.667 256 426.667m26.714-256c0 15.468-11.262 26.667-26.497 26.667c-15.851 0-26.837-11.2-26.837-26.963c0-15.15 11.283-26.37 26.837-26.37c15.235 0 26.497 11.22 26.497 26.666m-48 64h42.666v128h-42.666z" /></svg>
const ICON_NAVBAR   = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 3h16" /></svg>
const ICON_FOOTER   = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}><path fill="currentColor" d="M19.5 20h-15q-.213 0-.357-.143T4 19.5t.143-.357T4.5 19h15q.214 0 .357.143T20 19.5t-.143.357T19.5 20M5.616 16.616q-.691 0-1.153-.463T4 15V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616V15q0 .69-.462 1.153t-1.153.463zm0-1h12.769q.269 0 .442-.174Q19 15.27 19 15V5.616q0-.27-.173-.443T18.385 5H5.615q-.269 0-.442.173T5 5.616V15q0 .27.173.442q.173.173.443.173m-.616 0V5z" /></svg>
const ICON_DEST     = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="16" height="16" style={{flexShrink:0}}><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.5.5v13m0-13l9 4.5l-9 4.5" /></svg>
const ICON_SHOP     = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}><path fill="currentColor" fillRule="evenodd" d="M8 7V6a4 4 0 1 1 8 0v1h3c.552 0 1 .449 1 1.007v12.001c0 1.1-.895 1.992-1.994 1.992H5.994A1.994 1.994 0 0 1 4 20.008v-12C4 7.45 4.445 7 5 7zm1.2 0h5.6V6a2.8 2.8 0 0 0-5.6 0zM8 8.2H5.2v11.808c0 .436.356.792.794.792h12.012a.794.794 0 0 0 .794-.792V8.2H16V11h-1.2V8.2H9.2V11H8z" /></svg>
const ICON_BOOKINGS = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" style={{flexShrink:0}}><path fill="none" stroke="currentColor" d="M7.5 6V1m10 5V1m4 16v4.5h-18v-3m17.863-10H3.352M.5 18.25v.25h17.9l.15-.25l.234-.491A28 28 0 0 0 21.5 5.729V3.5h-18v2.128A28 28 0 0 1 .743 17.744z" /></svg>

const NAV_SECTIONS = [
  { key:'hero',         label:'Hero',         icon:ICON_HERO,     desc:'Landing section' },
  { key:'destinations', label:'Destinations', icon:ICON_DEST,     desc:'Trip listings' },
  { key:'merch',        label:'Shop',         icon:ICON_SHOP,     desc:'Merch catalog' },
  { key:'about',        label:'About',        icon:ICON_ABOUT,    desc:'Brand story' },
  { key:'navbar',       label:'Navbar',       icon:ICON_NAVBAR,   desc:'Navigation' },
  { key:'footer',       label:'Footer',       icon:ICON_FOOTER,   desc:'Footer links' },
]

const OPS_SECTIONS = [
  { key:'destinations', label:'Destinations', icon:ICON_DEST,     desc:'Trip listings' },
  { key:'merch',        label:'Shop',         icon:ICON_SHOP,     desc:'Merch catalog' },
  { key:'bookings',     label:'Bookings',     icon:ICON_BOOKINGS, desc:'Enquiries & orders' },
]

const CONFIG_SECTIONS = [
  { key:'hero',   label:'Hero',   icon:ICON_HERO,   desc:'Landing section' },
  { key:'about',  label:'About',  icon:ICON_ABOUT,  desc:'Brand story' },
  { key:'navbar', label:'Navbar', icon:ICON_NAVBAR, desc:'Navigation' },
  { key:'footer', label:'Footer', icon:ICON_FOOTER, desc:'Footer links' },
]

function SideNav({ active, onSelect, data, open, onToggle, isMobile, isTablet, isDesktop, activeUser, onLogout }) {
  const [configOpen, setConfigOpen] = useState(false)

  const NavBtn = ({ s }) => {
    const isActive = active === s.key
    return (
      <button
        key={s.key}
        onClick={() => { onSelect(s.key); if (isMobile) onToggle() }}
        title={!effectiveOpen ? s.label : undefined}
        style={{
          display:'flex', alignItems:'center', gap: effectiveOpen ? 12 : 0,
          width:'100%', padding: effectiveOpen ? '9px 10px' : '11px 0',
          justifyContent: effectiveOpen ? 'flex-start' : 'center',
          marginBottom:2,
          background: isActive ? 'linear-gradient(90deg,rgba(201,168,76,.1),rgba(201,168,76,.03))' : 'transparent',
          border:'none',
          borderLeft: effectiveOpen ? `2px solid ${isActive?'#c9a84c':'transparent'}` : 'none',
          borderRadius: effectiveOpen ? '0 7px 7px 0' : 8,
          color: isActive ? '#c9a84c' : '#444',
          cursor:'pointer',
          textAlign:'left',
          transition:'all .15s',
          position:'relative',
        }}
        onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background='rgba(255,255,255,.04)'; e.currentTarget.style.color='#777' } }}
        onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#444' } }}
      >
        <span style={{ width:20, textAlign:'center', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{s.icon}</span>
        {effectiveOpen && (
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:isActive?600:400, letterSpacing:'0.01em', lineHeight:1.2 }}>{s.label}</div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.1em', color:isActive?'rgba(201,168,76,.5)':'#2a2a3a', marginTop:1 }}>{s.desc}</div>
          </div>
        )}
      </button>
    )
  }

  // Tablet: always icon-only (collapsed), not toggleable from sidebar
  // Mobile: full drawer from hamburger
  // Desktop: toggleable expand/collapse
  const effectiveOpen = isDesktop ? open : (isTablet ? false : open)
  const sidebarWidth = effectiveOpen ? 220 : 52

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && open && (
        <div onClick={onToggle} style={{
          position:'fixed', inset:0, zIndex:149,
          background:'rgba(0,0,0,.6)',
          backdropFilter:'blur(4px)',
          animation:'fadeIn .2s ease',
        }} />
      )}

      <div style={{
        width: isMobile ? (open ? 260 : 0) : sidebarWidth,
        flexShrink:0,
        background:'#060610',
        borderRight:'1px solid rgba(255,255,255,.04)',
        display:'flex', flexDirection:'column',
        transition: isMobile ? 'none' : 'width .22s cubic-bezier(.4,0,.2,1)',
        overflow: isMobile ? 'visible' : 'hidden',
        // On mobile: fixed drawer that slides in from left
        ...(isMobile ? {
          position:'fixed', top:0, left:0, bottom:0, zIndex:150,
          width: open ? 260 : 0,
          overflow:'hidden',
          transition:'width .25s cubic-bezier(.4,0,.2,1)',
          boxShadow: open ? '4px 0 40px rgba(0,0,0,.6)' : 'none',
        } : {}),
      }}>
        <div style={{
          width: isMobile ? 260 : (effectiveOpen ? 220 : 52),
          display:'flex', flexDirection:'column', height:'100%',
          overflow:'hidden',
        }}>
          {/* Logo area — click to collapse/expand (desktop only) */}
          <button
            onClick={isDesktop ? onToggle : undefined}
            title={isDesktop ? (effectiveOpen ? 'Collapse sidebar' : 'Expand sidebar') : undefined}
            style={{
              padding: effectiveOpen ? '20px 18px 16px' : '16px 0',
              borderBottom:'1px solid rgba(255,255,255,.04)',
              display:'flex', alignItems:'center',
              justifyContent: effectiveOpen ? 'flex-start' : 'center',
              flexShrink:0, width:'100%',
              background:'transparent', border:'none', borderBottom:'1px solid rgba(255,255,255,.04)',
              cursor: isDesktop ? 'pointer' : 'default', textAlign:'left',
              transition:'background .15s',
            }}
            onMouseEnter={e => { if (isDesktop) e.currentTarget.style.background='rgba(255,255,255,.02)' }}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            {effectiveOpen
              ? <>
                  <div style={{ flex:1 }}>
                    <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height:34, display:'block' }} />
                    <p style={{ color:'#2a2a40', fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', margin:'10px 0 0' }}>Content Admin</p>
                  </div>
                  {isDesktop && <span style={{ color:'#2a2a40', fontSize:12, fontFamily:"'DM Mono',monospace", marginLeft:8 }}>‹</span>}
                </>
              : <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height:22, width:22, objectFit:'contain', opacity:0.5 }} />
            }
          </button>

          {/* Nav items */}
          <div style={{ flex:1, padding: effectiveOpen ? '12px 10px' : '12px 6px', overflowY:'auto' }}>
            {effectiveOpen && <p style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', padding:'4px 8px 10px', opacity:0.6 }}>Operations</p>}
            {!effectiveOpen && <div style={{ height:8 }} />}
            {OPS_SECTIONS.map(s => <NavBtn key={s.key} s={s} />)}

            {effectiveOpen ? (
              <div style={{ marginTop:16 }}>
                <button
                  onClick={() => setConfigOpen(o => !o)}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', background:'transparent', border:'none', cursor:'pointer', padding:'4px 8px 10px' }}
                >
                  <span style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', opacity:0.6 }}>Site Config</span>
                  <span style={{ color:'#c9a84c', fontSize:9, opacity:0.6, transition:'transform .2s', display:'inline-block', transform: configOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                </button>
                {configOpen
                  ? <div style={{ animation:'fadeIn .15s ease' }}>{CONFIG_SECTIONS.map(s => <NavBtn key={s.key} s={s} />)}</div>
                  : <p style={{ color:'#1e1e2e', fontFamily:"'DM Mono',monospace", fontSize:9, padding:'0 10px 4px', letterSpacing:'0.06em' }}>Hero · About · Navbar · Footer</p>
                }
              </div>
            ) : (
              <div style={{ marginTop:12, borderTop:'1px solid rgba(255,255,255,.04)', paddingTop:12 }}>
                {CONFIG_SECTIONS.map(s => <NavBtn key={s.key} s={s} />)}
              </div>
            )}
          </div>

          {/* Stats — only when expanded on desktop */}
          {effectiveOpen && isDesktop && (
            <div style={{ padding:'14px 18px 20px', borderTop:'1px solid rgba(255,255,255,.04)', flexShrink:0 }}>
              <p style={{ color:'#252535', fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:12 }}>Quick stats</p>
              {[
                ['Destinations', data.destinations.length, '◎'],
                ['Merch items', data.merch.length, '✦'],
                ['Nav links', data.navbar.links.length, '≡'],
                ['Bookings', data.bookingCount ?? '—', '◉'],
              ].map(([label, count, icon]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ color:'#2e2e42', fontFamily:"'DM Mono',monospace", fontSize:10, display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:10, color:'#3a3a50' }}>{icon}</span>{label}
                  </span>
                  <span style={{ color:'#c9a84c', fontFamily:"'DM Mono',monospace", fontSize:11, fontWeight:600, background:'rgba(201,168,76,.08)', padding:'1px 8px', borderRadius:4 }}>{count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Logout */}
          <div style={{ padding: effectiveOpen ? '10px 12px' : '10px 6px', borderTop:'1px solid rgba(255,255,255,.04)', flexShrink:0 }}>
            <button
              onClick={onLogout}
              title="Log out"
              style={{
                display:'flex', alignItems:'center', gap: effectiveOpen ? 10 : 0,
                justifyContent: effectiveOpen ? 'flex-start' : 'center',
                width:'100%', padding: effectiveOpen ? '8px 10px' : '8px 0',
                background:'transparent', border:'1px solid rgba(200,60,60,.12)',
                borderRadius:7, cursor:'pointer', color:'#5a2a2a',
                transition:'all .15s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background='rgba(200,60,60,.08)'; e.currentTarget.style.borderColor='rgba(200,60,60,.35)'; e.currentTarget.style.color='#e57373' }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(200,60,60,.12)'; e.currentTarget.style.color='#5a2a2a' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {effectiveOpen && (
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', lineHeight:1.2 }}>Log out</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.08em', color:'#3a2a2a', marginTop:2, textTransform:'none' }}>{activeUser}</div>
                </div>
              )}
            </button>
          </div>


        </div>
      </div>
    </>
  )
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const S = {
  sectionTitle: {
    color:'#e8e0d0',
    fontFamily:"'DM Serif Display',serif",
    fontSize:'clamp(20px, 4vw, 26px)', fontWeight:400,
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
  grid2: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'0 18px' },
  grid3: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:'0 16px' },
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

// ─── EDIT MODAL ──────────────────────────────────────────────────────────────

function EditModal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  return (
    <div onClick={onBackdrop} style={{
      position:'fixed', inset:0, zIndex:500,
      background:'rgba(0,0,0,.75)',
      backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding: window.innerWidth < 640 ? '0' : '24px',
      animation:'fadeIn .2s ease',
    }}>
      <div style={{
        width:'100%', maxWidth:680,
        maxHeight: window.innerWidth < 640 ? '100dvh' : '90vh',
        height: window.innerWidth < 640 ? '100dvh' : 'auto',
        background:'linear-gradient(145deg,#0c0c14,#080810)',
        border:'1px solid rgba(201,168,76,.2)',
        borderRadius: window.innerWidth < 640 ? 0 : 14,
        display:'flex', flexDirection:'column',
        boxShadow:'0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(201,168,76,.05)',
        overflow:'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'18px 24px',
          borderBottom:'1px solid rgba(255,255,255,.05)',
          flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:3, height:18, background:'#c9a84c', borderRadius:2 }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.2em', color:'#c9a84c', textTransform:'uppercase' }}>{title}</span>
          </div>
          <button onClick={onClose} style={{
            background:'transparent', border:'1px solid rgba(255,255,255,.08)',
            color:'#555', width:28, height:28, borderRadius:6,
            cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center',
            transition:'all .15s', fontFamily:"'DM Mono',monospace",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(244,67,54,.4)'; e.currentTarget.style.color='#e57373'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.08)'; e.currentTarget.style.color='#555'}}
          >✕</button>
        </div>
        {/* Scrollable body */}
        <div style={{ overflowY:'auto', padding:'24px', flex:1 }}>
          {children}
        </div>
        {/* Modal footer */}
        <div style={{
          padding:'14px 24px',
          borderTop:'1px solid rgba(255,255,255,.05)',
          display:'flex', justifyContent:'flex-end', gap:10,
          flexShrink:0,
          background:'rgba(0,0,0,.2)',
        }}>
          <button onClick={onClose} style={{
            background:'linear-gradient(135deg,#c9a84c,#e8c96a)',
            border:'none', color:'#060608',
            padding:'9px 28px', borderRadius:7, cursor:'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:700,
            letterSpacing:'0.14em', textTransform:'uppercase',
            boxShadow:'0 4px 16px rgba(201,168,76,.3)',
          }}>Done</button>
        </div>
      </div>
    </div>
  )
}

// ─── DEST ROW ─────────────────────────────────────────────────────────────────

function DestRow({ dest, idx, onEdit, onDelete }) {
  const [vw, setVw] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setVw(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMob = vw < 640

  return (
    <div style={{
      ...S.card,
      display:'flex', alignItems:'center',
      gap: isMob ? 10 : 14,
      minWidth:0, overflow:'hidden',
      transition:'all .15s',
    }}>
      {/* Index — hidden on mobile to save space */}
      {!isMob && (
        <span style={{ color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, width:20, textAlign:'center', flexShrink:0 }}>{idx+1}</span>
      )}

      {/* Thumbnail */}
      {dest.img
        ? <img src={dest.img} alt="" style={{ width: isMob ? 44 : 72, height: isMob ? 44 : 48, objectFit:'cover', borderRadius: isMob ? 5 : 6, flexShrink:0 }} onError={e=>e.target.style.display='none'} />
        : <div style={{ width: isMob ? 44 : 72, height: isMob ? 44 : 48, borderRadius: isMob ? 5 : 6, background:'rgba(255,255,255,.03)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#2a2a38', fontSize: isMob ? 14 : 18 }}>◎</span>
          </div>
      }

      {/* Title + desc — flex:1 minWidth:0 ensures it shrinks and clips, never wraps */}
      <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, overflow:'hidden' }}>
          <p style={{
            color:'#e8e0d0', fontSize: isMob ? 12 : 13, fontWeight:500, margin:0,
            fontFamily:"'DM Sans',sans-serif",
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            minWidth:0,
          }}>{dest.title}</p>
          {dest.video && !isMob && (
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:'0.1em', color:'#c9a84c', background:'rgba(201,168,76,.08)', border:'1px solid rgba(201,168,76,.2)', padding:'2px 6px', borderRadius:3, flexShrink:0 }}>▶</span>
          )}
        </div>
        <p style={{ color:'#3a3a50', fontSize: isMob ? 10 : 11, margin:'3px 0 0', fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{dest.desc}</p>
      </div>

      {/* Category badge — only on tablet+ */}
      {vw >= 640 && (
        <span style={{
          fontSize:9, letterSpacing:'0.1em', color:'#444',
          background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)',
          padding:'3px 10px', borderRadius:4,
          fontFamily:"'DM Mono',monospace", flexShrink:0,
          whiteSpace:'nowrap',
        }}>{dest.category}</span>
      )}

      {/* Actions */}
      <div style={{ display:'flex', gap: isMob ? 4 : 6, flexShrink:0 }}>
        <button onClick={()=>onEdit(dest)} style={{
          ...S.editBtn,
          padding: isMob ? '5px 10px' : '5px 13px',
          fontSize: isMob ? 10 : 10,
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#aaa'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#666'}}>
          Edit
        </button>
        <button onClick={()=>onDelete(dest.id)} style={S.delBtn}
          onMouseEnter={e=>{e.currentTarget.style.color='#e57373';e.currentTarget.style.borderColor='rgba(244,67,54,.4)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(244,67,54,.5)';e.currentTarget.style.borderColor='rgba(244,67,54,.15)'}}>
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── DESTINATIONS EDITOR ─────────────────────────────────────────────────────

function DestinationsEditor({ data, onChange }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)

  const openEdit = (item) => { setEditing(item.id); setForm({...item}) }
  const closeEdit = () => { setEditing(null); setForm(null) }
  const updateForm = (patch) => {
    const updated = { ...form, ...patch }
    setForm(updated)
    onChange(data.map(d => String(d.id) === String(editing) ? updated : d))
  }
  const deleteItem = (id) => { if (String(editing) === String(id)) closeEdit(); onChange(data.filter(d=>String(d.id)!==String(id))) }
  const addNew = () => {
    const n = { id:Date.now(), title:'New Destination', desc:'', tagline:'', price:'', img:'', video:'', category:'West Africa', highlights:[], bestTime:'', duration:'' }
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
        <EditModal key={editing} title={`Editing — ${form.title}`} onClose={closeEdit}>
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
          <CloudinaryVideoUpload label="Background Video (plays in modal)" value={form.video||''} onChange={v=>updateForm({video:v})} />
          <div style={S.grid2}>
            <Field label="Best time to visit" value={form.bestTime||''} onChange={v=>updateForm({bestTime:v})} placeholder="e.g. Nov – Feb" />
            <Field label="Trip duration" value={form.duration||''} onChange={v=>updateForm({duration:v})} placeholder="e.g. 3–5 days" />
          </div>
          <Field label="Highlights (pipe-separated)" value={Array.isArray(form.highlights) ? form.highlights.join('|') : (form.highlights||'')} onChange={v=>updateForm({highlights:v.split('|').map(s=>s.trim()).filter(Boolean)})} placeholder="Lekki Beach|Victoria Island|Street food culture" />
        </EditModal>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map((dest,idx) => (
          <DestRow key={dest.id} dest={dest} idx={idx} onEdit={openEdit} onDelete={deleteItem} />
        ))}
      </div>
    </div>
  )
}

// ─── MERCH ROW ────────────────────────────────────────────────────────────────

function MerchRow({ item, idx, onEdit, onDelete }) {
  const [vw, setVw] = useState(window.innerWidth)
  useEffect(() => {
    const h = () => setVw(window.innerWidth)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  const isMob = vw < 640

  return (
    <div style={{
      ...S.card,
      display:'flex', alignItems:'center',
      gap: isMob ? 10 : 14,
      minWidth:0, overflow:'hidden',
      transition:'all .15s',
    }}>
      {/* Index — hidden on mobile */}
      {!isMob && (
        <span style={{ color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, width:20, textAlign:'center', flexShrink:0 }}>{idx+1}</span>
      )}

      {/* Thumbnail */}
      {item.imgs && item.imgs[0]
        ? <img src={item.imgs[0]} alt="" style={{ width: isMob ? 44 : 52, height: isMob ? 44 : 52, objectFit:'cover', borderRadius: isMob ? 5 : 6, flexShrink:0 }} onError={e=>e.target.style.display='none'} />
        : <div style={{ width: isMob ? 44 : 52, height: isMob ? 44 : 52, borderRadius: isMob ? 5 : 6, background:'rgba(255,255,255,.03)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#2a2a38', fontSize: isMob ? 13 : 16 }}>✦</span>
          </div>
      }

      {/* Name + desc */}
      <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, overflow:'hidden' }}>
          <p style={{
            color:'#e8e0d0', fontSize: isMob ? 12 : 13, fontWeight:500, margin:0,
            fontFamily:"'DM Sans',sans-serif",
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            minWidth:0,
          }}>{item.name}</p>
          {!isMob && <Pill label={item.tag} />}
        </div>
        {!isMob && (
          <p style={{ color:'#3a3a50', fontSize:11, margin:'3px 0 0', fontFamily:"'DM Mono',monospace", whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.desc}</p>
        )}
      </div>

      {/* Price */}
      <span style={{
        color:'#c9a84c', fontFamily:"'DM Mono',monospace",
        fontSize: isMob ? 12 : 13, fontWeight:600, flexShrink:0,
      }}>{item.price}</span>

      {/* Actions */}
      <div style={{ display:'flex', gap: isMob ? 4 : 6, flexShrink:0 }}>
        <button onClick={()=>onEdit(item)} style={{
          ...S.editBtn,
          padding: isMob ? '5px 10px' : '5px 13px',
        }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#aaa'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#666'}}>
          Edit
        </button>
        <button onClick={()=>onDelete(item.id)} style={S.delBtn}
          onMouseEnter={e=>{e.currentTarget.style.color='#e57373';e.currentTarget.style.borderColor='rgba(244,67,54,.4)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(244,67,54,.5)';e.currentTarget.style.borderColor='rgba(244,67,54,.15)'}}>
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── MERCH EDITOR ────────────────────────────────────────────────────────────

function MerchEditor({ data, onChange }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)

  const openEdit = (item) => { setEditing(item.id); setForm({...item}) }
  const closeEdit = () => { setEditing(null); setForm(null) }
  const updateForm = (patch) => {
    const updated = { ...form, ...patch }
    setForm(updated)
    onChange(data.map(d => String(d.id) === String(editing) ? updated : d))
  }

  const deleteItem = (id) => { if (String(editing) === String(id)) closeEdit(); onChange(data.filter(d=>String(d.id)!==String(id))) }
  const addNew = () => {
    const n = { id:Date.now(), name:'New Product', price:'$0', tag:'', desc:'', category:'Travel Gear', imgs:[], fields:['note'] }
    onChange([...data, n]); openEdit(n)
  }

  const ALL_FIELDS = ['sleeve','size','height','age','note']
  const [activeImg, setActiveImg] = useState(0)
  const [uploadingSlots, setUploadingSlots] = useState(new Set())
  const imgInputRefs = useRef({})
  const addSlotRef = useRef(null)

  // Reset image state when switching to a different item
  useEffect(() => { setActiveImg(0); setUploadingSlots(new Set()); imgInputRefs.current = {} }, [editing])

  const updateImg = (i,v) => { const imgs=[...(form?.imgs||[])]; imgs[i]=v; updateForm({imgs}); setActiveImg(i) }
  const removeImg = (i) => {
    const imgs = [...(form?.imgs||[])]
    imgs[i] = ''
    updateForm({imgs})
    // stay on this slot so the empty upload prompt is immediately visible
  }
  const toggleField = (f) => {
    const fields = (form?.fields||[]).includes(f)?(form?.fields||[]).filter(x=>x!==f):[...(form?.fields||[]),f]
    updateForm({fields})
  }

  const setSlotLoading = (i, on) => setUploadingSlots(prev => {
    const s = new Set(prev); on ? s.add(i) : s.delete(i); return s
  })

  const uploadToCloudinary = async (file) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('upload_preset', CLOUDINARY_PRESET)
    fd.append('folder', 'cmwg')
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd })
    const d = await res.json()
    return d.secure_url || null
  }

  const handleImgFile = async (i, file) => {
    if (!file) return
    setSlotLoading(i, true)
    const url = await uploadToCloudinary(file).catch(()=>null)
    setSlotLoading(i, false)
    if (url) updateImg(i, url)
  }

  const handleAddFile = async (file) => {
    if (!file) return
    const next = (form?.imgs||[]).length
    updateForm({imgs:[...(form?.imgs||[]),'']})
    setActiveImg(next)
    setSlotLoading(next, true)
    const url = await uploadToCloudinary(file).catch(()=>null)
    setSlotLoading(next, false)
    if (url) { updateImg(next, url) }
  }

  return (
    <div>
      <SectionHeader
        title="Merch & Shop"
        sub="Product catalog and order form fields"
        action={<button onClick={addNew} style={S.addBtn}>+ Add Product</button>}
      />

      {editing && form && (
        <EditModal key={editing} title={`Editing — ${form.name}`} onClose={closeEdit}>
          <div style={S.grid3}>
            <Field label="Product name" value={form.name} onChange={v=>updateForm({name:v})} />
            <Field label="Price" value={form.price} onChange={v=>updateForm({price:v})} placeholder="$35" />
            <Field label="Tag (Bestseller / New)" value={form.tag} onChange={v=>updateForm({tag:v})} />
          </div>
          <div style={S.grid2}>
            <Field label="Category" value={form.category} onChange={v=>updateForm({category:v})} placeholder="Clothing / Travel Gear" />
          </div>
          <Field label="Description" value={form.desc} onChange={v=>updateForm({desc:v})} rows={2} />

          <div style={S.subHead}><span>⬡</span> Product Images (up to 6)</div>

          {/* ── GALLERY PREVIEW ── */}
          <div style={{ marginBottom:20 }}>
            {/* Main preview */}
            <div style={{
              position:'relative', width:'100%', height:220,
              background:'#080810', border:'1px solid rgba(255,255,255,.07)',
              borderRadius:8, overflow:'hidden', marginBottom:10,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {uploadingSlots.has(activeImg) ? (
                /* Full main shimmer while uploading */
                <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.03)', overflow:'hidden' }}>
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(90deg, transparent 0%, rgba(201,168,76,.08) 50%, transparent 100%)',
                    animation:'adminShimmer 1.4s infinite',
                  }} />
                  <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
                    <div style={{ width:28, height:28, border:'2px solid rgba(201,168,76,.15)', borderTop:'2px solid #c9a84c', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.2em', color:'rgba(201,168,76,.5)', textTransform:'uppercase' }}>Uploading…</span>
                  </div>
                </div>
              ) : (form?.imgs||[])[activeImg] ? (
                <img src={(form?.imgs||[])[activeImg]} alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              ) : (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.25 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.15em', color:'#c9a84c' }}>No image</span>
                </div>
              )}
              {/* Action buttons on main preview */}
              <input ref={el=>imgInputRefs.current[activeImg]=el} type="file" accept="image/*" style={{ display:'none' }}
                onChange={e=>{ handleImgFile(activeImg, e.target.files[0]); e.target.value='' }} />
              <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:6 }}>
                {/* Upload / replace button — always visible */}
                <button onClick={()=>imgInputRefs.current[activeImg]?.click()} style={{
                  background:'rgba(0,0,0,.7)', border:'1px solid rgba(201,168,76,.35)',
                  color:'rgba(201,168,76,.8)', width:26, height:26, borderRadius:5,
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all .15s',
                }} onMouseEnter={e=>{e.currentTarget.style.color='#c9a84c';e.currentTarget.style.borderColor='rgba(201,168,76,.7)'}}
                   onMouseLeave={e=>{e.currentTarget.style.color='rgba(201,168,76,.8)';e.currentTarget.style.borderColor='rgba(201,168,76,.35)'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </button>
                {/* Delete — only when slot has an image */}
                {(form?.imgs||[])[activeImg] && (
                  <button onClick={()=>removeImg(activeImg)} style={{
                    background:'rgba(0,0,0,.7)', border:'1px solid rgba(244,67,54,.3)',
                    color:'rgba(244,67,54,.7)', width:26, height:26, borderRadius:5,
                    cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center',
                    fontFamily:"'DM Mono',monospace", transition:'all .15s',
                  }} onMouseEnter={e=>{e.currentTarget.style.color='#e57373';e.currentTarget.style.borderColor='rgba(244,67,54,.6)'}}
                     onMouseLeave={e=>{e.currentTarget.style.color='rgba(244,67,54,.7)';e.currentTarget.style.borderColor='rgba(244,67,54,.3)'}}>✕</button>
                )}
              </div>
            </div>

            {/* Thumb strip */}
            <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4, scrollbarWidth:'none' }}>
              {(form?.imgs||[]).map((src,i) => {
                const isActive = activeImg === i
                return (
                  <div key={i} style={{
                    flex:'0 0 72px', height:72,
                    position:'relative', cursor:'pointer',
                    border:`1px solid ${isActive?'#c9a84c': uploadingSlots.has(i) ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.08)'}`,
                    borderRadius:5, overflow:'hidden',
                    background:'#080810', transition:'border-color .2s', flexShrink:0,
                  }}
                    onClick={() => setActiveImg(i)}
                  >
                    {uploadingSlots.has(i) ? (
                      /* Shimmer loading state */
                      <div style={{ width:'100%', height:'100%', background:'rgba(255,255,255,.04)', position:'relative', overflow:'hidden' }}>
                        <div style={{
                          position:'absolute', inset:0,
                          background:'linear-gradient(90deg, transparent 0%, rgba(201,168,76,.12) 50%, transparent 100%)',
                          animation:'adminShimmer 1.4s infinite',
                        }} />
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <div style={{ width:16, height:16, border:'1.5px solid rgba(201,168,76,.2)', borderTop:'1.5px solid #c9a84c', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
                        </div>
                      </div>
                    ) : src ? (
                      <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }} />
                    ) : (
                      <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Add slot */}
              {(form?.imgs||[]).length < 6 && (
                <div style={{
                  flex:'0 0 72px', height:72, flexShrink:0,
                  border:'1px dashed rgba(201,168,76,.3)',
                  borderRadius:5, cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
                  background:'rgba(201,168,76,.03)', transition:'all .18s',
                }}
                  onClick={()=>addSlotRef.current?.click()}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,.6)';e.currentTarget.style.background='rgba(201,168,76,.07)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,.3)';e.currentTarget.style.background='rgba(201,168,76,.03)'}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, letterSpacing:'0.12em', color:'rgba(201,168,76,.6)' }}>add</span>
                  <input ref={addSlotRef} type="file" accept="image/*" style={{ display:'none' }}
                    onChange={e=>{ handleAddFile(e.target.files[0]); e.target.value='' }} />
                </div>
              )}
            </div>
          </div>

          <div style={S.subHead}><span>⊡</span> Order Form Fields</div>
          <p style={{ color:'#2e2e48', fontSize:10, fontFamily:"'DM Mono',monospace", marginBottom:12, letterSpacing:'0.06em' }}>Toggle which fields appear in the order form</p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:8 }}>
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
        </EditModal>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {data.map((item,idx) => (
          <MerchRow key={item.id} item={item} idx={idx} onEdit={openEdit} onDelete={deleteItem} />
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

// ─── BOOKINGS EDITOR ─────────────────────────────────────────────────────────

// ─── RECORD DETAIL MODAL ─────────────────────────────────────────────────────

function RecordDetailModal({ record, type, onClose }) {
  const [vw, setVw] = useState(window.innerWidth)
  useEffect(() => {
    const handle = () => setVw(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const mob = vw < 600
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const fmtPhone = (v) => {
    if (!v) return v
    const s = String(v).trim().replace(/\s+/g, '')
    if (/^\d{10}$/.test(s)) return '0' + s
    return s
  }

  const fmt = (v) => {
    if (!v) return null
    if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(v).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
    }
    return v
  }

  const LabelValue = ({ label, value, gold, wide, span2 }) => {
    const display = fmt(value)
    if (!display) return null
    return (
      <div style={{
        gridColumn: wide ? '1 / -1' : span2 && !mob ? 'span 2' : undefined,
        background: 'rgba(255,255,255,.02)',
        border: '1px solid rgba(255,255,255,.05)',
        borderRadius: 8, padding: mob ? '10px 12px' : '12px 14px',
      }}>
        <p style={{
          fontFamily: "'DM Mono',monospace", fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#3a3a50', margin: '0 0 5px',
        }}>{label}</p>
        <p style={{
          fontFamily: gold ? "'DM Mono',monospace" : "'DM Sans',sans-serif",
          fontSize: gold ? (mob ? 13 : 15) : (mob ? 12 : 13),
          fontWeight: gold ? 600 : 400,
          color: gold ? '#c9a84c' : '#e8e0d0',
          margin: 0, lineHeight: 1.5, wordBreak: 'break-word',
        }}>{display}</p>
      </div>
    )
  }

  const SectionLabel = ({ children }) => (
    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#3a3a50', margin: '0 0 10px' }}>{children}</p>
  )

  const grid2 = { display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 18 }
  const grid3 = { display: 'grid', gridTemplateColumns: mob ? '1fr 1fr' : '1fr 1fr 1fr', gap: 8, marginBottom: 18 }

  const isBooking = type === 'bookings'

  // On mobile: bottom sheet anchored to bottom edge, full width, rounded top corners only
  const sheetStyle = mob ? {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    maxHeight: '92vh',
    background: 'linear-gradient(180deg,#0f0f18,#080810)',
    border: '1px solid rgba(201,168,76,.2)',
    borderBottom: 'none',
    borderRadius: '16px 16px 0 0',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 -24px 80px rgba(0,0,0,.9)',
    overflow: 'hidden',
    animation: 'slideUp .28s cubic-bezier(.16,1,.3,1)',
  } : {
    width: '100%', maxWidth: 620,
    maxHeight: '88vh',
    background: 'linear-gradient(145deg,#0d0d16,#080810)',
    border: '1px solid rgba(201,168,76,.25)',
    borderRadius: 16,
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 48px 120px rgba(0,0,0,.85), 0 0 0 1px rgba(201,168,76,.06)',
    overflow: 'hidden',
    animation: 'fadeIn .2s ease',
  }

  return (
    <>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
      <div onClick={onBackdrop} style={{
        position: 'fixed', inset: 0, zIndex: 600,
        background: 'rgba(0,0,0,.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: mob ? 'flex-end' : 'center',
        justifyContent: 'center',
        padding: mob ? 0 : '24px',
        animation: 'fadeIn .2s ease',
      }}>
        <div style={sheetStyle}>

          {/* Drag handle (mobile only) */}
          {mob && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.12)' }} />
            </div>
          )}

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: mob ? '10px 16px 12px' : '18px 24px',
            borderBottom: '1px solid rgba(255,255,255,.05)',
            flexShrink: 0,
            background: 'rgba(0,0,0,.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 3, height: 20, background: '#c9a84c', borderRadius: 2, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, letterSpacing: '0.24em', color: 'rgba(201,168,76,.5)', textTransform: 'uppercase', margin: '0 0 2px' }}>
                  {isBooking ? 'Trip Enquiry' : 'Merch Order'}
                </p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 13 : 15, fontWeight: 600, color: '#e8e0d0', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {isBooking ? (record.destination || 'Untitled') : (record.product || 'Untitled')}
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,.08)',
              color: '#555', width: 30, height: 30, borderRadius: 7, flexShrink: 0,
              cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s', fontFamily: "'DM Mono',monospace", marginLeft: 10,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,67,54,.4)'; e.currentTarget.style.color = '#e57373' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)'; e.currentTarget.style.color = '#555' }}
            >✕</button>
          </div>

          {/* Body */}
          <div style={{ overflowY: 'auto', padding: mob ? '16px' : '24px', flex: 1, WebkitOverflowScrolling: 'touch' }}>

            {isBooking ? (
              <>
                {record.timestamp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '7px 11px', background: 'rgba(201,168,76,.05)', border: '1px solid rgba(201,168,76,.12)', borderRadius: 7 }}>
                    <span style={{ color: '#c9a84c', fontSize: 11 }}>◷</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: mob ? 9 : 10, color: '#888', letterSpacing: '0.06em' }}>{fmt(record.timestamp)}</span>
                  </div>
                )}

                <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,.08), rgba(201,168,76,.03))', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, padding: mob ? '12px 14px' : '16px 18px', marginBottom: 18 }}>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(201,168,76,.5)', margin: '0 0 4px' }}>Destination</p>
                  <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: mob ? 18 : 22, color: '#c9a84c', margin: 0, letterSpacing: '-0.01em' }}>{record.destination || '—'}</p>
                </div>

                <SectionLabel>Contact</SectionLabel>
                <div style={grid2}>
                  <LabelValue label="Full Name" value={record.name} />
                  <LabelValue label="Phone" value={fmtPhone(record.phone)} />
                  <LabelValue label="Email" value={record.email} wide />
                </div>

                <SectionLabel>Trip Details</SectionLabel>
                <div style={grid3}>
                  <LabelValue label="Travel Date" value={record.date} />
                  <LabelValue label="Travellers" value={record.travellers} gold />
                  <LabelValue label="Budget" value={record.budget} gold span2 />
                </div>

                {record.message && (
                  <>
                    <SectionLabel>Message</SectionLabel>
                    <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderLeft: '3px solid rgba(201,168,76,.3)', borderRadius: '0 8px 8px 0', padding: mob ? '11px 13px' : '14px 16px', marginBottom: 8 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: '#c8c0b8', margin: 0, lineHeight: 1.7 }}>{record.message}</p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {record.timestamp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '7px 11px', background: 'rgba(201,168,76,.05)', border: '1px solid rgba(201,168,76,.12)', borderRadius: 7 }}>
                    <span style={{ color: '#c9a84c', fontSize: 11 }}>◷</span>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: mob ? 9 : 10, color: '#888', letterSpacing: '0.06em' }}>{fmt(record.timestamp)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: mob ? 'flex-start' : 'center', gap: 14, background: 'linear-gradient(135deg, rgba(201,168,76,.08), rgba(201,168,76,.03))', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, padding: mob ? '12px 14px' : '14px 18px', marginBottom: 18, flexWrap: mob ? 'wrap' : 'nowrap' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>✦</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(201,168,76,.5)', margin: '0 0 3px' }}>Product</p>
                    <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: mob ? 17 : 20, color: '#c9a84c', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.product || '—'}</p>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: '#555', margin: 0 }}>{record.category}</p>
                  </div>
                  {record.price && (
                    <div style={{ textAlign: mob ? 'left' : 'right', marginLeft: mob ? 34 : 'auto', marginTop: mob ? -4 : 0 }}>
                      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: '0.2em', color: '#3a3a50', textTransform: 'uppercase', margin: '0 0 3px' }}>Price</p>
                      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: mob ? 16 : 20, fontWeight: 700, color: '#c9a84c', margin: 0 }}>{record.price}</p>
                    </div>
                  )}
                </div>

                <SectionLabel>Order Specs</SectionLabel>
                <div style={grid3}>
                  <LabelValue label="Size" value={record.size} gold />
                  <LabelValue label="Sleeve" value={record.sleeve} gold />
                  <LabelValue label="Height" value={record.height} />
                  <LabelValue label="Age" value={record.age} />
                </div>

                <SectionLabel>Customer</SectionLabel>
                <div style={grid2}>
                  <LabelValue label="Name" value={record.name} />
                  <LabelValue label="Phone" value={fmtPhone(record.phone)} />
                  <LabelValue label="Email" value={record.email} wide />
                </div>

                {record.note && (
                  <>
                    <SectionLabel>Note</SectionLabel>
                    <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.06)', borderLeft: '3px solid rgba(201,168,76,.3)', borderRadius: '0 8px 8px 0', padding: mob ? '11px 13px' : '14px 16px', marginBottom: 8 }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: mob ? 12 : 13, color: '#c8c0b8', margin: 0, lineHeight: 1.7 }}>{record.note}</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: mob ? '12px 16px calc(12px + env(safe-area-inset-bottom))' : '14px 24px',
            borderTop: '1px solid rgba(255,255,255,.05)',
            display: 'flex', justifyContent: 'flex-end',
            flexShrink: 0,
            background: 'rgba(0,0,0,.2)',
          }}>
            <button onClick={onClose} style={{
              background: 'linear-gradient(135deg,#c9a84c,#e8c96a)',
              border: 'none', color: '#060608',
              padding: mob ? '11px 0' : '9px 28px',
              width: mob ? '100%' : 'auto',
              borderRadius: 7, cursor: 'pointer',
              fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              boxShadow: '0 4px 16px rgba(201,168,76,.3)',
            }}>Close</button>
          </div>
        </div>
      </div>
    </>
  )
}

function BookingsEditor({ onCount }) {
  const [bookings, setBookings] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('bookings')
  const [search, setSearch] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  // Reset page when tab or search changes
  useEffect(() => { setPage(1) }, [tab, search])

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'

  useEffect(() => {
    Promise.all([
      fetch(`${SCRIPT_URL}?type=bookings&t=${Date.now()}`).then(r=>r.json()).catch(()=>({ data:[] })),
      fetch(`${SCRIPT_URL}?type=orders&t=${Date.now()}`).then(r=>r.json()).catch(()=>({ data:[] })),
    ]).then(([bRes, oRes]) => {
      const b = Array.isArray(bRes.data) ? bRes.data.reverse() : []
      const o = Array.isArray(oRes.data) ? oRes.data.reverse() : []
      setBookings(b)
      setOrders(o)
      onCount && onCount(b.length + o.length)
    }).finally(() => setLoading(false))
  }, [])

  const rows = tab === 'bookings' ? bookings : orders
  const filtered = search
    ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
    : rows

  const cols = tab === 'bookings'
    ? ['destination','name','phone','email','date','travellers','budget','message']
    : ['product','category','price','name','phone','email','size','sleeve','height','age','note']

  const fmtPhone = (v) => {
    if (!v) return v
    const s = String(v).trim().replace(/\s+/g, '')
    // 10-digit number missing the leading 0 (Google Sheets strips it) → restore it
    if (/^\d{10}$/.test(s)) return '0' + s
    return s
  }

  const fmt = (v, col) => {
    if (!v) return <span style={{ color:'#2a2a38' }}>—</span>
    if (col === 'phone') return fmtPhone(v)
    if (typeof v === 'string' && v.match(/^\d{4}-\d{2}-\d{2}T/)) {
      return new Date(v).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
    }
    return v
  }

  const tabBtn = (key, label, count) => (
    <button onClick={()=>setTab(key)} style={{
      background: tab===key ? 'rgba(201,168,76,.12)' : 'transparent',
      border: `1px solid ${tab===key ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.06)'}`,
      color: tab===key ? '#c9a84c' : '#444',
      padding:'7px 18px', borderRadius:6, cursor:'pointer',
      fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.14em',
      display:'flex', alignItems:'center', gap:8, transition:'all .15s',
    }}>
      {label}
      <span style={{
        background: tab===key ? 'rgba(201,168,76,.2)' : 'rgba(255,255,255,.05)',
        color: tab===key ? '#c9a84c' : '#333',
        padding:'1px 7px', borderRadius:3, fontSize:9,
      }}>{count}</span>
    </button>
  )

  return (
    <div>
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          type={tab}
          onClose={() => setSelectedRecord(null)}
        />
      )}
      <div style={{ marginBottom:28 }}>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.22em', color:'#c9a84c', textTransform:'uppercase', margin:'0 0 8px', opacity:0.7 }}>Live data</p>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, fontWeight:400, color:'#e8e0d0', margin:'0 0 6px', letterSpacing:'-0.02em' }}>Bookings & Orders</h2>
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:'0.1em', color:'#3a3a50', margin:'0 0 20px', lineHeight:1.7 }}>
          Every trip enquiry and merch order submitted through the site lands here in real time.<br />
          Use this to follow up with leads, track demand, and close bookings.
        </p>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[
            { label:'Trip enquiries arrive when someone fills the booking form on a destination', icon:'◎' },
            { label:'Merch orders come in when someone submits their fit details on a product', icon:'✦' },
            { label:'Both also trigger an email to you via Formspree the moment they submit', icon:'✉' },
          ].map((tip, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', gap:10,
              background:'rgba(201,168,76,.04)', border:'1px solid rgba(201,168,76,.1)',
              borderRadius:8, padding:'10px 14px', flex:'1 1 220px',
            }}>
              <span style={{ color:'#c9a84c', fontSize:13, flexShrink:0, marginTop:1 }}>{tip.icon}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#555', letterSpacing:'0.04em', lineHeight:1.6 }}>{tip.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {tabBtn('bookings', 'Trip Enquiries', bookings.length)}
        {tabBtn('orders', 'Merch Orders', orders.length)}
      </div>

      {/* Search */}
      <div style={{ marginBottom:16, position:'relative' }}>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            width:'100%', background:'#090910', border:'1px solid #1a1a28',
            borderRadius:7, color:'#d8d0c8', fontFamily:"'DM Mono',monospace",
            fontSize:12, padding:'9px 12px 9px 34px', boxSizing:'border-box', outline:'none',
            transition:'border-color .18s',
          }}
          onFocus={e=>e.target.style.borderColor='#c9a84c'}
          onBlur={e=>e.target.style.borderColor='#1a1a28'}
        />
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#3a3a50', fontSize:12 }}>⌕</span>
      </div>

      {loading ? (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'40px 0', justifyContent:'center' }}>
          <div style={{ width:16, height:16, border:'1.5px solid rgba(201,168,76,.15)', borderTop:'1.5px solid #c9a84c', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#3a3a50', letterSpacing:'0.16em' }}>Loading submissions…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 0', color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:'0.14em' }}>
          {search ? 'No results found' : `No ${tab === 'bookings' ? 'bookings' : 'orders'} yet`}
        </div>
      ) : (
        <div style={{ overflowX:'auto' }}>
          <table className="bookings-table" style={{ width:'100%', borderCollapse:'collapse', fontFamily:"'DM Mono',monospace", fontSize:11 }}>
            <thead>
              <tr>
                {cols.map(col => (
                  <th key={col} style={{
                    padding:'8px 12px', textAlign:'left',
                    borderBottom:'1px solid rgba(255,255,255,.06)',
                    color:'#3a3a50', fontSize:9, letterSpacing:'0.18em',
                    textTransform:'uppercase', whiteSpace:'nowrap', fontWeight:500,
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE).map((row, i) => (
                <tr key={i} style={{
                  borderBottom:'1px solid rgba(255,255,255,.03)',
                  background: i%2===0 ? 'transparent' : 'rgba(255,255,255,.01)',
                  transition:'background .15s',
                  cursor:'pointer',
                  height: 44,
                }}
                  onClick={() => setSelectedRecord(row)}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,.04)'}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'rgba(255,255,255,.01)'}
                >
                  {cols.map(col => (
                    <td key={col} style={{
                      padding:'0 12px', color:'#c8c0b8',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      maxWidth: col==='message'||col==='note' ? 180 : col==='email' ? 160 : col==='timestamp' ? 140 : 'none',
                      height: 44,
                    }}>
                      {col==='destination'||col==='product'
                        ? <span style={{ color:'#c9a84c', fontWeight:500 }}>{fmt(row[col], col)}</span>
                        : fmt(row[col], col)
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (() => {
            const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
            return (
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 4px 4px',
                borderTop:'1px solid rgba(255,255,255,.04)',
                marginTop:4,
              }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:'#3a3a50', letterSpacing:'0.14em' }}>
                  {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div style={{ display:'flex', gap:4 }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    disabled={page===1}
                    style={{
                      background:'transparent',
                      border:'1px solid rgba(255,255,255,.07)',
                      color: page===1 ? '#252535' : '#666',
                      width:28, height:28, borderRadius:5, cursor: page===1 ? 'default' : 'pointer',
                      fontFamily:"'DM Mono',monospace", fontSize:11,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .15s',
                    }}
                    onMouseEnter={e=>{ if(page!==1){ e.currentTarget.style.borderColor='rgba(255,255,255,.18)'; e.currentTarget.style.color='#aaa' }}}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.color=page===1?'#252535':'#666' }}
                  >‹</button>

                  {Array.from({length: totalPages}, (_, i) => i+1)
                    .filter(n => n===1 || n===totalPages || Math.abs(n-page)<=1)
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx-1] > 1) acc.push('…')
                      acc.push(n)
                      return acc
                    }, [])
                    .map((n, idx) => n === '…'
                      ? <span key={`ellipsis-${idx}`} style={{ color:'#2a2a38', fontFamily:"'DM Mono',monospace", fontSize:11, padding:'0 2px', lineHeight:'28px' }}>…</span>
                      : <button key={n} onClick={() => setPage(n)} style={{
                          background: page===n ? 'rgba(201,168,76,.12)' : 'transparent',
                          border:`1px solid ${page===n ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.07)'}`,
                          color: page===n ? '#c9a84c' : '#555',
                          width:28, height:28, borderRadius:5, cursor:'pointer',
                          fontFamily:"'DM Mono',monospace", fontSize:10,
                          transition:'all .15s',
                        }}
                        onMouseEnter={e=>{ if(page!==n){ e.currentTarget.style.borderColor='rgba(255,255,255,.18)'; e.currentTarget.style.color='#aaa' }}}
                        onMouseLeave={e=>{ e.currentTarget.style.borderColor=page===n?'rgba(201,168,76,.4)':'rgba(255,255,255,.07)'; e.currentTarget.style.color=page===n?'#c9a84c':'#555' }}
                      >{n}</button>
                    )
                  }

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p+1))}
                    disabled={page===totalPages}
                    style={{
                      background:'transparent',
                      border:'1px solid rgba(255,255,255,.07)',
                      color: page===totalPages ? '#252535' : '#666',
                      width:28, height:28, borderRadius:5, cursor: page===totalPages ? 'default' : 'pointer',
                      fontFamily:"'DM Mono',monospace", fontSize:11,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      transition:'all .15s',
                    }}
                    onMouseEnter={e=>{ if(page!==totalPages){ e.currentTarget.style.borderColor='rgba(255,255,255,.18)'; e.currentTarget.style.color='#aaa' }}}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.color=page===totalPages?'#252535':'#666' }}
                  >›</button>
                </div>
              </div>
            )
          })()}
        </div>
      )}
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

function AdminPage({ activeUser, onLogout }) {
  const [data, setData] = useState(deepClone(INIT))
  const [active, setActive] = useState('destinations')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [vw, setVw] = useState(window.innerWidth)
  const isMobile = vw < 640
  const isTablet = vw >= 640 && vw < 1024
  const isDesktop = vw >= 1024
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop)

  useEffect(() => {
    const handle = () => {
      const w = window.innerWidth
      setVw(w)
      // On resize to desktop, open sidebar; on resize to tablet/mobile, close drawer
      if (w >= 1024) setSidebarOpen(true)
      else if (w < 640) setSidebarOpen(false)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

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
          ...(destRes.data?.length ? { destinations: destRes.data.map(d=>({...d,id:Number(d.id)||Date.now()})) } : {}),
          ...(merchRes.data?.length ? { merch: merchRes.data.map(m=>({...m,id:Number(m.id)||Date.now()})) } : {}),
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
        fetch(SCRIPT_URL, { method:'POST', body:JSON.stringify({ type:'save_merch', merch:data.merch.map(m=>({...m,imgs:(m.imgs||[]).filter(Boolean)})) }) }),
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
        @keyframes adminShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        /* Mobile: show only 3 columns — destination/product, name, phone */
        @media (max-width: 639px) {
          .bookings-table th:nth-child(n+4),
          .bookings-table td:nth-child(n+4) { display: none; }
        }
        @media (max-width: 639px) {
          input, textarea, select { font-size: 16px !important; }
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{
        height:52, flexShrink:0,
        background:'rgba(5,5,12,.95)',
        borderBottom:'1px solid rgba(255,255,255,.05)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding: isMobile ? '0 12px' : '0 20px',
        backdropFilter:'blur(20px)',
        position:'sticky', top:0, zIndex:100,
      }}>
        {/* Left: breadcrumb */}
        <div style={{ display:'flex', alignItems:'center', gap: isMobile ? 8 : 14 }}>
          {/* Hamburger — mobile: always, tablet: always, desktop: hidden (sidebar has its own toggle) */}
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(o => !o)}
              style={{
                background:'transparent',
                border:'1px solid rgba(255,255,255,.07)',
                color:'#666', width:32, height:32,
                borderRadius:7, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexDirection:'column', gap:4,
                flexShrink:0, transition:'all .15s',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(201,168,76,.4)'; e.currentTarget.style.color='#c9a84c' }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(255,255,255,.07)'; e.currentTarget.style.color='#666' }}
            >
              {sidebarOpen && isMobile
                ? <span style={{ fontSize:14, lineHeight:1, fontFamily:"'DM Mono',monospace" }}>✕</span>
                : <>
                    <span style={{ display:'block', width:14, height:1.5, background:'currentColor', borderRadius:1 }} />
                    <span style={{ display:'block', width:14, height:1.5, background:'currentColor', borderRadius:1 }} />
                    <span style={{ display:'block', width:10, height:1.5, background:'currentColor', borderRadius:1 }} />
                  </>
              }
            </button>
          )}
          <a href="/">
            <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" style={{ height: isMobile ? 36 : 48, display:'block' }} />
          </a>
          {!isMobile && <>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,.06)' }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.2em', color:'#3a3a50', textTransform:'uppercase' }}>Admin</span>
          </>}
          {isDesktop && <>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,.06)' }} />
            <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'#444', letterSpacing:'0.02em' }}>
              {[...OPS_SECTIONS, ...CONFIG_SECTIONS].find(s=>s.key===active)?.label}
            </span>
          </>}
        </div>

        {/* Right: actions */}
        <div style={{ display:'flex', gap: isMobile ? 6 : 8, alignItems:'center' }}>
          {!isMobile && (
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
          )}
          {!isMobile && (
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
          )}
          {isMobile && (
            <button onClick={exportJson} title="Export JSON" style={{
              background:'transparent', border:'1px solid rgba(255,255,255,.07)', color:'#444',
              width:32, height:32, borderRadius:6, cursor:'pointer',
              fontFamily:"'DM Mono',monospace", fontSize:13,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all .15s', flexShrink:0,
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.15)';e.currentTarget.style.color='#888'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,.07)';e.currentTarget.style.color='#444'}}>
              ↓
            </button>
          )}
          <button onClick={handleSave} disabled={saving} style={{
            background: saving?'rgba(201,168,76,.2)':'linear-gradient(135deg,#c9a84c,#e8c96a)',
            border: dirty && !saving ? '1px solid #e8c96a' : 'none',
            color: saving?'#c9a84c':'#050508',
            padding: isMobile ? '7px 14px' : '7px 18px',
            borderRadius:6, cursor: saving?'not-allowed':'pointer',
            fontFamily:"'DM Mono',monospace", fontSize:9, fontWeight:700,
            letterSpacing:'0.16em', textTransform:'uppercase',
            boxShadow: saving?'none': dirty ? '0 2px 20px rgba(201,168,76,.55)' : '0 2px 14px rgba(201,168,76,.3)',
            transition:'all .2s',
            display:'flex', alignItems:'center', gap:6,
            whiteSpace:'nowrap',
          }}>
            {dirty && !saving && <span style={{ width:5, height:5, borderRadius:'50%', background:'#050508', flexShrink:0 }} />}
            {saving ? '···' : isMobile ? 'Save' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex:1, display:'flex', minHeight:0, position:'relative' }}>
        <SideNav
          active={active}
          onSelect={setActive}
          data={data}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(o => !o)}
          isMobile={isMobile}
          isTablet={isTablet}
          isDesktop={isDesktop}
          activeUser={activeUser}
          onLogout={onLogout}
        />

        {/* MAIN EDITOR */}
        <div style={{
          flex:1, padding: isMobile ? '20px 16px' : isTablet ? '28px 28px' : '36px 40px',
          overflowY:'auto', minWidth:0,
          animation:'fadeIn .2s ease',
        }}>
          {active==='hero' && (activeUser === 'bibitayouthman' ? <HeroEditor data={data.hero} onChange={upd('hero')} /> : <ComingSoonGate section="Hero"><HeroEditor data={data.hero} onChange={upd('hero')} /></ComingSoonGate>)}
          {active==='destinations' && <DestinationsEditor data={data.destinations} onChange={upd('destinations')} />}
          {active==='merch' && <MerchEditor data={data.merch} onChange={upd('merch')} />}
          {active==='about' && (activeUser === 'bibitayouthman' ? <AboutEditor data={data.about} onChange={upd('about')} /> : <ComingSoonGate section="About"><AboutEditor data={data.about} onChange={upd('about')} /></ComingSoonGate>)}
          {active==='navbar' && (activeUser === 'bibitayouthman' ? <NavbarEditor data={data.navbar} onChange={upd('navbar')} /> : <ComingSoonGate section="Navbar"><NavbarEditor data={data.navbar} onChange={upd('navbar')} /></ComingSoonGate>)}
          {active==='footer' && (activeUser === 'bibitayouthman' ? <FooterEditor data={data.footer} onChange={upd('footer')} /> : <ComingSoonGate section="Footer"><FooterEditor data={data.footer} onChange={upd('footer')} /></ComingSoonGate>)}
          {active==='bookings' && <BookingsEditor onCount={c => setData(prev => ({...prev, bookingCount: c}))} />}
        </div>

        {isDesktop && active !== 'bookings' && <PreviewPanel active={active} data={data} />}
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

// ─── COMING SOON GATE ────────────────────────────────────────────────────────
// Wrap a section editor to show a "Coming Soon" overlay.
// The editor renders beneath it — content is visible but unreachable.
// TO UNLOCK: remove the <ComingSoonGate> wrapper around the relevant editor
// and delete this component once all sections are paid for and live.

function ComingSoonGate({ section, children }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* The real editor — rendered, visible, but covered */}
      <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>

      {/* Overlay — sits on top, no blur on the content underneath */}
      <div style={{
        position: 'absolute', inset: 0,
        zIndex: 10,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 60,
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: 'linear-gradient(145deg, #0c0c16, #09090f)',
          border: '1px solid rgba(201,168,76,.3)',
          borderRadius: 16,
          padding: '36px 36px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(201,168,76,.06)',
          textAlign: 'center',
          animation: 'fadeIn .25s ease',
        }}>
          {/* Lock icon */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(201,168,76,.08)',
            border: '1px solid rgba(201,168,76,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 22,
          }}>🔒</div>

          {/* Section tag */}
          <p style={{
            fontFamily: "'DM Mono',monospace", fontSize: 9,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,.5)', margin: '0 0 10px',
          }}>{section}</p>

          {/* Headline */}
          <h3 style={{
            fontFamily: "'DM Serif Display',serif", fontSize: 26,
            fontWeight: 400, color: '#e8e0d0',
            margin: '0 0 12px', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>Coming Soon</h3>

          {/* Subtext */}
          <p style={{
            fontFamily: "'DM Sans',sans-serif", fontSize: 13,
            color: '#4a4a62', lineHeight: 1.7, margin: '0 0 24px',
          }}>
            This section is not yet active. Unlock it to edit your{' '}
            <span style={{ color: '#c9a84c' }}>{section.toLowerCase()}</span>{' '}
            content and push changes live.
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,.05)', margin: '0 0 20px' }} />

          {/* CTA */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(201,168,76,.07)',
            border: '1px solid rgba(201,168,76,.2)',
            borderRadius: 8, padding: '10px 18px',
          }}>
            <span style={{ fontSize: 14 }}>✉</span>
            <span style={{
              fontFamily: "'DM Mono',monospace", fontSize: 10,
              color: '#c9a84c', letterSpacing: '0.06em', lineHeight: 1.5,
            }}>
              Contact us to unlock this section
            </span>
          </div>

          {/* Dev note — clearly marked for easy removal */}
          <div style={{
            marginTop: 22,
            background: 'rgba(244,67,54,.04)',
            border: '1px dashed rgba(244,67,54,.2)',
            borderRadius: 6, padding: '10px 14px',
            textAlign: 'left',
          }}>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9,
              letterSpacing: '0.14em', color: 'rgba(244,67,54,.5)',
              margin: '0 0 4px', textTransform: 'uppercase',
            }}>
              ◈ Dev note — remove to unlock
            </p>
            <p style={{
              fontFamily: "'DM Mono',monospace", fontSize: 9,
              color: '#2e2e42', margin: 0, lineHeight: 1.7, letterSpacing: '0.04em',
            }}>
              Wrap removed in <span style={{ color:'rgba(244,67,54,.4)' }}>/AdminPage.jsx</span> once client pays.{'\n'}
              Delete <span style={{ color:'rgba(244,67,54,.4)' }}>{'<ComingSoonGate>'}</span> + this component when all sections are live.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



export default function AdminPageWithAuth() {
  const [activeUser, setActiveUser] = useState(null)
  if (!activeUser) return <LoginScreen onLogin={(name) => setActiveUser(name)} />
  return <AdminPage activeUser={activeUser} onLogout={() => setActiveUser(null)} />
}
