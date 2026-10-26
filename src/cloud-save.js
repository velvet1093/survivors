// Cloud copy of the save, kept in the artifact's database under the player's own
// private `data/users/<id>/` area so it survives republished game versions and
// follows the player between devices. Browser storage stays the fast local copy;
// this layer is skipped silently wherever the page runs without the claude.ai viewer.
const CHUNK=180*1024;
const timeout=(promise,ms)=>Promise.race([promise,new Promise(resolve=>setTimeout(()=>resolve(null),ms))]);

export async function connectCloud({wait=10000,host=globalThis.claude}={}){
 try{
  if(typeof host?.use!=='function')return null;
  const [db,user]=await timeout(Promise.all([host.use('db'),host.use('user')]),wait)||[];
  if(!db||!user)return null;
  const uid=await timeout(user.id(),wait);
  return uid?{db,uid}:null;
 }catch{return null;}
}
const manifestRef=(cloud,key)=>cloud.db.doc(`data/users/${cloud.uid}/${key}`);
const chunkRef=(cloud,key,i)=>cloud.db.doc(`data/users/${cloud.uid}/${key}~${i}`);

// Reads one key: {key,value,revision,updatedAt,deleted,chunks} or null when the
// cloud has nothing usable. A copy caught mid-write (chunks from another revision)
// is ignored rather than stitched together.
export async function readCloudRecord(cloud,key){
 const snap=await manifestRef(cloud,key).get();if(!snap.exists)return null;
 const m=snap.data()||{},revision=Number(m.revision)||0,chunks=Math.max(0,Math.floor(Number(m.chunks)||0));
 if(!revision)return null;
 if(m.deleted===true)return {key,value:null,revision,updatedAt:Number(m.updatedAt)||0,deleted:true,chunks:0};
 const parts=[];
 for(let i=0;i<chunks;i++){const c=await chunkRef(cloud,key,i).get(),d=c.exists?c.data():null;if(!d||Number(d.revision)!==revision||typeof d.text!=='string')return null;parts.push(d.text);}
 return {key,value:parts.join(''),revision,updatedAt:Number(m.updatedAt)||0,deleted:false,chunks};
}
// Writes chunks first and the manifest last, so a reader never trusts a half-written copy.
export async function writeCloudRecord(cloud,record,previousChunks=0){
 const {key}=record;
 if(record.deleted||record.value===null){
  await manifestRef(cloud,key).set({revision:record.revision,updatedAt:record.updatedAt,deleted:true,chunks:0});
  for(let i=0;i<previousChunks;i++)await chunkRef(cloud,key,i).delete().catch(()=>{});
  return 0;
 }
 const text=String(record.value),count=Math.max(1,Math.ceil(text.length/CHUNK));
 for(let i=0;i<count;i++)await chunkRef(cloud,key,i).set({revision:record.revision,text:text.slice(i*CHUNK,(i+1)*CHUNK)});
 await manifestRef(cloud,key).set({revision:record.revision,updatedAt:record.updatedAt,deleted:false,chunks:count});
 for(let i=count;i<previousChunks;i++)await chunkRef(cloud,key,i).delete().catch(()=>{});
 return count;
}
