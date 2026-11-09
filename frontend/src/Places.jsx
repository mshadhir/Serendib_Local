import React,{useState,useEffect} from 'react';
import {ArrowRight,ArrowUpRight} from 'lucide-react';
import {regions,places} from '../../shared/places.mjs';
import {imageSources} from '../../shared/images.mjs';

function NoteForm({place,setPlace,c}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[reference,setReference]=useState('');
  const [ready,setReady]=useState(false);useEffect(()=>setReady(true),[]);
  async function submit(e) {
    e.preventDefault();
    if(c.preview||busy)return;
    const form=e.currentTarget, fields=new FormData(form);
    setError('');setBusy(true);
    try {
      const res=await fetch('/api/place-notes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        place,name:fields.get('name'),note:fields.get('note'),consent:fields.has('consent'),website:fields.get('website')
      })});
      const data=await res.json();
      if(!res.ok)throw Error(data.error||'Your note could not be sent.');
      form.reset();setPlace('');setReference(data.reference);
    } catch(err) {setError(err instanceof TypeError?'Could not reach the site. Your note is still here; please try again.':err.message)}
    finally {setBusy(false)}
  }
  if(reference)return <div className="place-feedback-result" role="status"><strong>Thank you for sharing your tip.</strong><p>It’s with the editor and isn’t public yet. Keep your reference in case you want the note removed: <code>{reference}</code>.</p><button className="text-link" onClick={()=>setReference('')}>Write another note</button></div>;
  if(c.preview)return <p>This is a preview. You can submit a visitor tip on the live website.</p>;
  return <form method="post" action="/api/place-notes" onSubmit={submit} className="place-feedback-form">
    <noscript>Enable JavaScript to use this form, or email your tip to <a href={'mailto:'+c.email}>{c.email}</a>.</noscript>
    <label>Which place did you visit?<select name="place" required value={place} onChange={e=>setPlace(e.target.value)}><option value="">Choose a place</option>{places.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
    <label>Your note<textarea name="note" required minLength={10} maxLength={500} rows={3} placeholder="What stayed with you? What do you wish you’d known?" /></label>
    <label>Public name (optional)<input name="name" maxLength={40} placeholder="First name or nickname"/><small>Leave blank to appear as “Anonymous traveller”.</small></label>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" autoComplete="off" tabIndex={-1}/></label></div>
    <label className="check-label"><input type="checkbox" name="consent" required/><span>I visited this place and agree to have this note and my chosen name published. <a href="/privacy">Privacy details</a>.</span></label>
    {error&&<p role="alert" className="form-error">{error}</p>}
    <button type="submit" className="button" disabled={busy||!ready}>{busy?'Sending…':'Send my visitor note'} <ArrowRight size={16}/></button>
  </form>;
}
function Photo({region}) {
  return <figure className="places-photo">
    <img src={region.image} srcSet={imageSources(region.image)} sizes="(max-width:760px) 94vw, 36vw" width="640" height="420" loading="lazy" decoding="async" alt={region.alt}/>
    <figcaption>{region.caption}{region.id==='cultural-triangle'&&<> · <a href="https://commons.wikimedia.org/wiki/File:Sigiriya_Lion_Rock_Aerial_(175658393).jpeg">Dronepicr</a>, <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> (cropped)</>}</figcaption>
  </figure>;
}
export default function Places({c}) {
  const [place,setPlace]=useState('');
  return <div className="places-page">
    <section className="container places-lead">
      <div><p className="eyebrow">THE SRI LANKA FIELD GUIDE</p><h1>Places to visit<br/><em>in Sri Lanka.</em></h1>
        <p>Would you rather climb Lion Rock, catch the morning drums in Kandy, or wander Galle’s walls at dusk? Start with seven stops you can build a route around.</p>
        <div className="places-intro-links"><a className="text-link" href="#cultural-triangle">Explore the places <ArrowRight size={16}/></a><a className="text-link" href="#share-a-tip">Share a visitor tip</a></div>
      </div>
      <figure className="places-cover"><img src="/images/train.webp" srcSet={imageSources('/images/train.webp')} sizes="(max-width:760px) 94vw, 48vw" alt="A train on the Nine Arch Bridge near Ella" width="1000" height="700" fetchPriority="high"/><figcaption>Ella <span>·</span> Nine Arch Bridge</figcaption></figure>
    </section>
    <div className="container places-index" role="navigation" aria-label="Browse by region">{regions.map((r,i)=><a key={r.id} href={'#'+r.id}><small>0{i+1}</small>{r.name}<ArrowRight size={14}/></a>)}</div>
    {regions.map((region,i)=><section className="container places-region" key={region.id} id={region.id}>
      <div className="places-region-heading"><p className="eyebrow">REGION 0{i+1}</p><h2>{region.name}</h2><p>{region.hint}</p>
        <Photo region={region}/><a href={'/routes/'+region.route} className="text-link">{region.routeLabel} <ArrowUpRight size={16}/></a>
      </div>
      <div>{places.filter(p=>p.region===region.id).map(p=><article key={p.id} className="place-entry" id={p.id}>
        <p className="eyebrow">{p.kind}</p><h3>{p.name}</h3><p>{p.description}</p>
        <div className="published-account"><strong>Independent traveller note</strong><p>{p.note}</p><a href={p.source}>Read the original by {p.by} <ArrowUpRight size={13}/></a></div>
        {(c.travellerNotes||[]).filter(n=>n.place===p.id).map((n,index)=><div className="visitor-note" key={index}><strong>Reader tip · {n.name}</strong><p>{n.note}</p></div>)}
        <div className="place-entry-links">{p.official&&<a href={p.official}>Destination information <ArrowUpRight size={13}/></a>}<a href="#share-a-tip" onClick={()=>setPlace(p.id)}>Add your tip</a></div>
      </article>)}</div>
    </section>)}
    <section className="places-feedback" id="share-a-tip"><div className="container places-feedback-grid"><div><p className="eyebrow">FROM PEOPLE WHO HAVE BEEN THERE</p><h2>What would you tell<br/><em>the next visitor?</em></h2>
      <p>The journal notes above summarise independent visits, not reviews of Serendib Local. If you’ve been to any of these places, we’d love to hear what stood out or what you’d do differently.</p>
      <p className="small-copy">We read submissions before sharing them. Please leave out contact details or other people’s names.</p></div>
      <NoteForm c={c} place={place} setPlace={setPlace}/></div></section>
    <section className="container places-next"><div><p className="eyebrow">MAKE IT YOUR JOURNEY</p><h2>Which stops are yours?</h2><p>Tell us your favourites and your dates. We’ll check how they fit together by road. Entrance tickets and specialist guides are separate from transport.</p></div><a className="button" href="/plan">Plan my route <ArrowUpRight size={17}/></a></section>
  </div>;
}
