import React, { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export default function Documents(){
  const [docs,setDocs]=useState([]),[file,setFile]=useState(null),[form,setForm]=useState({title:'',category:'SOP',description:'',department:'All'}),[msg,setMsg]=useState('');
  async function load(){ const r=await api('/documents'); setDocs(r.documents); }
  useEffect(()=>{load().catch(e=>setMsg(e.message))},[]);
  async function upload(e){ e.preventDefault(); if(!file) return setMsg('Choose file'); const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); fd.append('file',file); try{await api('/documents',{method:'POST',body:fd}); setFile(null); setForm({title:'',category:'SOP',description:'',department:'All'}); await load(); setMsg('Document uploaded');}catch(err){setMsg(err.message)} }
  return <section className="page"><div className="pageTitle"><div><h2>Document Center</h2></div></div>{msg&&<p className="info">{msg}</p>}<form className="formGrid card" onSubmit={upload}><input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['SOP','Product Rules','Vendor Agreement','Invoice','Screenshot','Company Document','Other'].map(x=><option key={x}>{x}</option>)}</select><input placeholder="Department" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/><input type="file" onChange={e=>setFile(e.target.files[0])}/><textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><button className="primary">Upload Document</button></form><div className="cardsGrid">{docs.map(d=><article className="card" key={d._id}><h3>{d.title}</h3><p>{d.category} • {d.department}</p><p>{d.description}</p><a href={`http://localhost:5000${d.path}`} target="_blank">Open File</a></article>)}</div></section>;
}
