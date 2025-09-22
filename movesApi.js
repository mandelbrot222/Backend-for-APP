// Front-end API for Boat/Trailer Moves via Google Apps Script.
// After you deploy the Apps Script Web App, paste its /exec URL below.
const APPS_SCRIPT_URL = https://script.google.com/macros/s/AKfycbzN-EcreIywIVX7mM-P50HkOV06AU3oairA6C0iEUObgFYMahglm8fENmDUMw9GmMsn_Q/exec;

function qs(params){
  const u = new URL(APPS_SCRIPT_URL);
  Object.entries(params||{}).forEach(([k,v])=>{ if(v!=null) u.searchParams.set(k,v); });
  return u.toString();
}

async function listMoves(rangeStartISO, rangeEndISO){
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes(https://script.google.com/macros/s/AKfycbzN-EcreIywIVX7mM-P50HkOV06AU3oairA6C0iEUObgFYMahglm8fENmDUMw9GmMsn_Q/exec)) return [];
  const url = qs({ resource:'moves', start: rangeStartISO||'', end: rangeEndISO||'' });
  const res = await fetch(url, { method:'GET', mode:'cors' });
  if (!res.ok) throw new Error('listMoves failed');
  const data = await res.json();
  return Array.isArray(data) ? data.filter(r => String(r.Deleted).toLowerCase() !== 'true') : [];
}

async function createMove(record){
  const res = await fetch(APPS_SCRIPT_URL, {
    method:'POST', mode:'cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ action:'create', resource:'moves', record })
  });
  if(!res.ok) throw new Error('createMove failed');
  return await res.json();
}

async function updateMove(record){
  const res = await fetch(APPS_SCRIPT_URL, {
    method:'POST', mode:'cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ action:'update', resource:'moves', record })
  });
  if(!res.ok) throw new Error('updateMove failed');
  return await res.json();
}

async function deleteMove(id){
  const res = await fetch(APPS_SCRIPT_URL, {
    method:'POST', mode:'cors', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ action:'delete', resource:'moves', id })
  });
  if(!res.ok) throw new Error('deleteMove failed');
  return await res.json();
}
