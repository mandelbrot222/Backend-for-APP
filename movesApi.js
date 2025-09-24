// Front-end API for Boat/Trailer Moves via Google Apps Script (non-module version).
// Safe for GitHub Pages: POSTs use text/plain (no preflight).
// Backend URL deployed from Apps Script:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxcJQVDwBoD2md2Dza5lBEwTwlKEgrry0mvvMZx5nSEexsf_GElCHlJ_7WBE45CPDFxvQ/exec';

function qs(params){
  const u = new URL(APPS_SCRIPT_URL);
  Object.entries(params||{}).forEach(([k,v])=>{ if(v!=null) u.searchParams.set(k,v); });
  return u.toString();
}

function listMoves(rangeStartISO, rangeEndISO){
  const url = qs({ resource:'moves', start: rangeStartISO||'', end: rangeEndISO||'' });
  return fetch(url, { method:'GET' }).then(async res => {
    if (!res.ok) throw new Error('listMoves failed');
    const data = await res.json();
    return Array.isArray(data) ? data.filter(r => String(r.Deleted).toLowerCase() !== 'true') : [];
  });
}

function createMove(record){
  return fetch(APPS_SCRIPT_URL, {
    method:'POST',
    headers:{ 'Content-Type':'text/plain' },
    body: JSON.stringify({ action:'create', resource:'moves', record })
  }).then(async res => {
    if(!res.ok) throw new Error('createMove failed');
    return await res.json();
  });
}

function updateMove(record){
  return fetch(APPS_SCRIPT_URL, {
    method:'POST',
    headers:{ 'Content-Type':'text/plain' },
    body: JSON.stringify({ action:'update', resource:'moves', record })
  }).then(async res => {
    if(!res.ok) throw new Error('updateMove failed');
    return await res.json();
  });
}

function deleteMove(id){
  return fetch(APPS_SCRIPT_URL, {
    method:'POST',
    headers:{ 'Content-Type':'text/plain' },
    body: JSON.stringify({ action:'delete', resource:'moves', id })
  }).then(async res => {
    if(!res.ok) throw new Error('deleteMove failed');
    return await res.json();
  });
}

// Expose on window for schedule.js
window.listMoves = listMoves;
window.createMove = createMove;
window.updateMove = updateMove;
window.deleteMove = deleteMove;
