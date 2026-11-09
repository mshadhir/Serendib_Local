import React,{useEffect,useState} from 'react';
import {places} from '../../shared/places.mjs';

export default function PlaceNoteQueue({api}) {
  const [status,setStatus]=useState('pending'),[page,setPage]=useState(0),[rev,setRev]=useState(0);
  const [data,setData]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[deleting,setDeleting]=useState('');
  useEffect(()=>{
    let active=true;setData(null);setError('');setDeleting('');
    api('place-notes?status='+status+'&offset='+page*20).then(d=>{
      if(!active)return;
      if(page>0&&!d.items.length)setPage(page-1);else setData(d);
    }).catch(e=>{if(active)setError(e.message)});
    return ()=>{active=false};
  },[status,page,rev]);
  async function change(id,method,next) {
    setBusy(true);setError('');
    try{await api('place-notes/'+id,method,next?{status:next}:null);setRev(n=>n+1)}
    catch(e){setError(e.message)}finally{setBusy(false)}
  }
  return <section className="place-note-queue"><h2>Visitor notes</h2><p>Publish firsthand tips about the place, including critical feedback. Leave out spam, contact details and material about other people. Published notes appear under the corresponding destination.</p>
    <div className="filters">{['pending','published'].map(s=><button key={s} className={s===status?'active':''} aria-pressed={s===status} onClick={()=>{setPage(0);setStatus(s)}}>{s==='pending'?'Awaiting review':'Published'}</button>)}<button onClick={()=>setRev(n=>n+1)}>Refresh notes</button></div>
    {error&&<p role="alert" className="form-error">{error}</p>}
    {!data&&!error&&<p role="status">Loading notes…</p>}
    {data&&<><p>{data.total} {status==='pending'?'awaiting review':'published'}</p><div className="enquiries">{data.items.map(n=><article key={n.id}>
      <p className="eyebrow">{n.created.slice(0,10)} · {n.name}</p><h3>{places.find(p=>p.id===n.place)?.name}</h3>
      <p className="visitor-note-text">{n.note}</p><small>Reference: {n.id}</small>
      <div className="button-row"><button disabled={busy} className="button small" onClick={()=>change(n.id,'PATCH',status==='pending'?'published':'pending')}>{status==='pending'?'Publish note':'Unpublish'}</button>
        {deleting!==n.id?<button className="text-link" disabled={busy} onClick={()=>setDeleting(n.id)}>Delete</button>:<><button disabled={busy} className="button danger small" onClick={()=>change(n.id,'DELETE')}>Permanently delete</button><button className="text-link" onClick={()=>setDeleting('')}>Keep</button></>}
      </div>
    </article>)}</div>{data.total>20&&<div className="pagination"><button disabled={!page} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page+1}</span><button disabled={(page+1)*20>=data.total} onClick={()=>setPage(page+1)}>Next</button></div>}</>}
  </section>;
}
