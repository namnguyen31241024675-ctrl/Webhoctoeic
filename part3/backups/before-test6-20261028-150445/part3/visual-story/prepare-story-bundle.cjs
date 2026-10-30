/* Build the file:// registry from the same per-conversation JSON used over HTTP. */
const fs=require('fs'),path=require('path');
const {inspectManifest}=require('./manifest-validator.js');
const manifests={},transcripts={};let errors=0;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
for(const entry of fs.readdirSync(__dirname,{withFileTypes:true}).filter(e=>e.isDirectory()&&/^t[1-5]-\d+$/.test(e.name)).sort()){
 const base=path.join(__dirname,entry.name),source=path.join(base,'scenes.json');if(!fs.existsSync(source))continue;
 const m=read(source);if(m.status!=='ready'||m.enabled!==true)continue;
 const report=inspectManifest(m,{assetExists:src=>fs.existsSync(path.resolve(base,src))});
 if(report.errors.length||!report.ready){console.error(entry.name,JSON.stringify(report));errors++;continue;}
 const t=read(path.resolve(base,m.transcriptSrc));
 if(t.conversationId!==m.conversationId||!t.utterances?.length){console.error(entry.name,'Transcript mismatch');errors++;continue;}
 const known=new Map(t.utterances.map(u=>[u.id,u]));let invalid=false;
 for(const scene of m.scenes)for(const spot of scene.hotspots)for(const id of spot.utteranceIds||[]){const line=known.get(id);if(!line||line.start>=scene.end||line.end<=scene.start){console.error(entry.name,'Hotspot points to an unknown or out-of-scene utterance:',id);errors++;invalid=true;}}
 if(invalid)continue;
 manifests[m.conversationId]=m;transcripts[m.conversationId]=t;
}
if(errors)process.exit(1);
if(!Object.keys(manifests).length)throw Error('No ready photographic stories');
if(!process.argv.includes('--check')){
 const output='window.TOEIC_VISUAL_STORY_MANIFESTS = '+JSON.stringify(manifests)+';\nwindow.TOEIC_VISUAL_STORY_TRANSCRIPTS = '+JSON.stringify(transcripts)+';\n';
 fs.writeFileSync(path.join(__dirname,'all-scenes.bundle.js'),output,'utf8');
}
console.log(Object.keys(manifests).length+' ready stories validated'+(process.argv.includes('--check')?'':'; registry written'));
