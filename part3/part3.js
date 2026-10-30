/* ETS audio/quiz controller with data-driven photographic learning scenes. */
(() => {
'use strict';
const data=window.TOEIC_PART3||[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector('#part3 '+s);
const labels={office:'Văn phòng',restaurant:'Nhà hàng',airport:'Sân bay',shop:'Cửa hàng',bank:'Ngân hàng',garden:'Khu vườn',library:'Thư viện',home:'Tòa nhà',factory:'Xưởng sản xuất',studio:'Phòng thu',train:'Nhà ga',construction:'Công trường',clinic:'Phòng khám'};
const shape=(type)=>{
const art={
 home:'<path d="m10 45 40-30 40 30" fill="#bb9ac4"/><rect x="20" y="44" width="60" height="40" fill="#d4b7ac"/><rect x="43" y="57" width="17" height="27" fill="#7e839d"/>',
 train:'<rect x="20" y="15" width="60" height="63" rx="12" fill="#92b8c5"/><rect x="28" y="25" width="44" height="24" rx="5" fill="#d1e3eb"/><circle cx="32" cy="64" r="5" fill="#ffe3ac"/><circle cx="68" cy="64" r="5" fill="#ffe3ac"/><path d="m30 79-10 12m50-12 10 12" stroke="#8d9ab4" stroke-width="6"/>',
 factory:'<path d="M12 83V41l24 12V30l24 19V16h15v34h13v33Z" fill="#94a5b7"/><path d="M24 66h10m12 0h10m12 0h10" stroke="#c4dbed" stroke-width="8"/>',
 cheese:'<path d="M17 66V35L73 17 89 66Z" fill="#ffcb66"/><path d="M17 35H89V66H17Z" fill="#f4ad43"/><circle cx="36" cy="49" r="6" fill="#d98829"/><circle cx="70" cy="53" r="4" fill="#d98829"/><circle cx="58" cy="28" r="3" fill="#e3a23b"/>',
 candy:'<path d="m25 42-15-12v40l15-13m50-15 15-12v40L75 57" fill="#f9a8d4"/><rect x="25" y="30" width="50" height="40" rx="15" fill="#db6ea7"/><path d="m40 31 15 38m2-38 15 33" stroke="#fbcfe8" stroke-width="7"/>',
 bread:'<path d="M18 68V44C8 19 92 19 82 44V68Z" fill="#c98b53"/><path d="M25 63V44C20 29 80 29 75 44V63Z" fill="#f2ce95"/><path d="m36 37 6 12m14-12 6 12" stroke="#d9a96c" stroke-width="4" stroke-linecap="round"/>',
 pasta:'<ellipse cx="50" cy="62" rx="39" ry="17" fill="#dce8ef"/><path d="M21 55c5-32 12 12 18-15s12 33 17 0 13 25 21 9" fill="none" stroke="#e7ae58" stroke-width="7"/><circle cx="43" cy="52" r="5" fill="#db6454"/><circle cx="62" cy="52" r="6" fill="#db6454"/>',
 document:'<rect x="25" y="15" width="50" height="65" rx="5" fill="#dfe6fa"/><path d="M35 32h30m-30 12h25m-25 12h30m-30 12h18" stroke="#8394c2" stroke-width="4"/>',
 phone:'<rect x="32" y="10" width="36" height="75" rx="8" fill="#6576ae"/><rect x="37" y="19" width="26" height="52" rx="3" fill="#c4d8ee"/><circle cx="50" cy="78" r="3" fill="#bcc7e9"/>',
 laptop:'<rect x="20" y="18" width="60" height="44" rx="5" fill="#6677ad"/><rect x="25" y="23" width="50" height="32" fill="#bad5ed"/><path d="m20 64-12 12h84L80 64Z" fill="#a5b0cc"/>',
 book:'<path d="M10 24q20-8 40 0 20-8 40 0v52q-20-8-40 0-20-8-40 0Z" fill="#e4bd90"/><path d="M50 25v50" stroke="#97755e" stroke-width="3"/><path d="M18 35h23m-23 11h23m18-11h23m-23 11h23" stroke="#b28e6b" stroke-width="3"/>',
 plant:'<path d="M50 58V26" stroke="#679c7b" stroke-width="5"/><ellipse cx="37" cy="30" rx="17" ry="9" transform="rotate(30 37 30)" fill="#82b893"/><ellipse cx="63" cy="43" rx="17" ry="9" transform="rotate(-30 63 43)" fill="#679c7b"/><path d="M30 57h40l-7 28H37Z" fill="#d79b85"/>',
 cup:'<path d="M25 28h48v40q-24 17-48 0Z" fill="#eac5a6"/><path d="M73 33q30 0 10 28H73" fill="none" stroke="#eac5a6" stroke-width="7"/><path d="M38 19q-6-6 0-12m17 12q-6-6 0-12" fill="none" stroke="#a1b3c9" stroke-width="3"/>',
 ticket:'<path d="M10 27h80v15q-12 7 0 14v15H10V56q12-7 0-14Z" fill="#d2bcf4"/><path d="M66 29v40" stroke="#8b77b0" stroke-width="3" stroke-dasharray="4 4"/>',
 box:'<path d="m16 31 34-15 34 15-34 16Z" fill="#ebc499"/><path d="M16 31v39l34 15V47Z" fill="#c79568"/><path d="M50 47v38l34-15V31Z" fill="#ddb084"/><path d="m33 24 35 15v16" fill="none" stroke="#f3dbb6" stroke-width="7"/>',
 chart:'<path d="M18 17v62h69" fill="none" stroke="#b7c6e4" stroke-width="4"/><rect x="27" y="46" width="12" height="26" rx="3" fill="#a99ad7"/><rect x="47" y="34" width="12" height="38" rx="3" fill="#7eacc2"/><rect x="67" y="21" width="12" height="51" rx="3" fill="#8dbba5"/>',
 people:'<circle cx="35" cy="29" r="13" fill="#e9bca5"/><circle cx="68" cy="34" r="11" fill="#bc8d79"/><path d="M12 79V63q23-35 46 0v16" fill="#9c8bc6"/><path d="M58 79V61q19-24 32 0v18" fill="#78a4b5"/>',
 calendar:'<rect x="18" y="22" width="64" height="59" rx="7" fill="#dbe6f5"/><path d="M18 39h64" stroke="#b39bd6" stroke-width="13"/><path d="M34 16v16m31-16v16" stroke="#8194bb" stroke-width="5"/><path d="M30 53h10m11 0h10m-31 14h10m11 0h10" stroke="#94a9c3" stroke-width="5"/>'
};return art[type]||art.document;
};
const icon=(type)=>'<svg viewBox="0 0 100 95" aria-hidden="true">'+shape(type)+'</svg>';
function person(id,x,y,index){
 const female=id.startsWith('W'),skin=['#d5a080','#bd896c','#e9b99c'][index%3],shirt=['#b09bd4','#7ca8b5','#ceab7a'][index%3];
 return `<g transform="translate(${x} ${y})"><g class="p3-person" data-speaker="${id}"><ellipse class="p3-halo" cx="0" cy="38" rx="77" ry="102" fill="${shirt}" opacity=".16"/><ellipse cx="0" cy="175" rx="64" ry="12" fill="#080f2225"/><path d="M-29 127-34 173H-8l10-53m7 0 9 53h25l-9-48" fill="#28344e"/><path d="M-48 116q-4-66 48-67 51 1 48 67l-8 22h-80Z" fill="${shirt}"/><path d="m-42 79-13 37 25 12m68-50 19 38-24 13" fill="none" stroke="${shirt}" stroke-width="20" stroke-linecap="round"/><g class="p3-hand"><path d="m40 114 17-15" stroke="${skin}" stroke-width="13" stroke-linecap="round"/></g><path d="M-11 39v19q11 14 22 0V39" fill="${skin}"/><path d="M-32 10q0-40 32-40t32 40v23q-2 29-32 29-30 0-32-29Z" fill="${female?'#3e3040':'#343039'}"/><ellipse cy="15" rx="27" ry="34" fill="${skin}"/><path d="M-29 5q-2-40 32-32Q33-24 30 5 11 1 1-13-8 2-29 5" fill="${female?'#3e3040':'#343039'}"/>${female?'<path d="M-31 10q-8 36 5 49l5-34m51-15q8 36-5 49l-5-34" fill="#3e3040"/>':''}<g class="p3-eyes"><ellipse cx="-9" cy="15" rx="2.5" ry="3" fill="#31303d"/><ellipse cx="10" cy="15" rx="2.5" ry="3" fill="#31303d"/></g><path d="M-12 7q3-2 6 0m13 0q3-2 6 0" stroke="#564038" stroke-width="2" fill="none"/><path class="p3-mouth" d="M-5 32q5 4 10 0" stroke="#805443" stroke-width="2.6" fill="none" stroke-linecap="round"/><rect x="-25" y="192" width="50" height="23" rx="11" fill="#14223b"/><text x="0" y="208" text-anchor="middle" font-size="11" fill="#cbd5e1">${id}</text></g></g>`;
}
function environment(type){
 const base='<rect x="0" y="0" width="800" height="490" fill="#21324c"/><rect y="337" width="800" height="153" fill="#18263b"/><path d="M0 337H800" stroke="#8da6bc" stroke-opacity=".15"/><rect x="280" y="62" width="240" height="170" rx="18" fill="#2c4160"/><circle cx="400" cy="146" r="55" fill="#374968"/><path d="M383 145q17-25 34 0m-34 20h34" fill="none" stroke="#b4a4d8" stroke-width="5" stroke-linecap="round"/>';
 if(!type)return base+'<circle cx="90" cy="160" r="90" fill="#a78bfa" opacity=".035"/><circle cx="710" cy="110" r="120" fill="#67e8f9" opacity=".035"/>';
 let art='<rect width="800" height="490" fill="#2d3e54"/><rect y="335" width="800" height="155" fill="#27354a"/>';
 const window='<rect x="72" y="65" width="170" height="171" rx="10" fill="#7dabc2"/><path d="M80 190 130 119l53 57 40-70v121H80Z" fill="#668da1"/><path d="M157 65v171M72 150h170" stroke="#bdd2da" stroke-width="7"/>';
 const shelf='<path d="M535 100h190m-190 76h190m-190 76h190" stroke="#bca48a" stroke-width="9"/><path d="M552 75h12v22h-12m27-37h13v37h-13m32-30h20v30h-20" fill="#a5adc0"/>';
 if(['office','clinic','bank'].includes(type))art+=window+'<rect x="520" y="93" width="175" height="91" rx="8" fill="#465777"/><path d="M550 155v-24m27 24v-39m27 39v-19m27 19v-49" stroke="#a2b8b6" stroke-width="11"/><rect x="138" y="318" width="520" height="16" rx="8" fill="#b3947f"/><path d="M167 334v76m460-76v76" stroke="#8b7e7d" stroke-width="12"/>';
 else if(type==='restaurant')art+=window+'<path d="M300 60v45m195-45v45m190-45v45" stroke="#a89a91" stroke-width="4"/><path d="M275 115q25-40 50 0m145 0q25-40 50 0m145 0q25-40 50 0" fill="#e1b88c"/><rect x="270" y="320" width="270" height="18" rx="9" fill="#bf9a7f"/><path d="M400 338v75" stroke="#a08b7d" stroke-width="14"/>';
 else if(['shop','library','factory'].includes(type))art+=shelf+'<g transform="translate(95 115) scale(1.2)">'+shape(type==='library'?'book':'box')+'</g><rect x="80" y="319" width="640" height="25" rx="5" fill="#a48f7d"/>';
 else if(['airport','train'].includes(type))art+='<rect x="45" y="70" width="710" height="175" rx="10" fill="#84adbe"/><path d="M200 70v175m200-175v175m200-175v175" stroke="#c2d1d4" stroke-width="10"/><path d="m555 160 73-20-25-25 12-4 43 24 65-14 10 6-72 28-16 25-10 2-1-24-74 10Z" fill="#c9d8dc"/><rect x="290" y="52" width="220" height="44" rx="8" fill="#192b43"/><circle cx="350" cy="74" r="10" fill="#b6a7d6"/><path d="M375 74h105" stroke="#b3c6d1" stroke-width="5"/>';
 else if(type==='garden')art+='<rect width="800" height="335" fill="#739695"/><path d="M0 260q180-170 370-15 240-180 430 15v76H0Z" fill="#4e776e"/><path d="M0 301q300-95 800 0v60H0Z" fill="#60856d"/><g transform="translate(70 180) scale(1.8)">'+shape('plant')+'</g><g transform="translate(600 180) scale(1.8)">'+shape('plant')+'</g>';
 else if(type==='home')art+=window+'<rect x="560" y="90" width="140" height="245" rx="5" fill="#8e807c"/><circle cx="675" cy="220" r="5" fill="#cdb79d"/><rect x="560" y="320" width="140" height="16" fill="#d3bba1"/>';
 else if(type==='studio')art+='<path d="M65 60h155v200H65Zm515 0h155v200H580Z" fill="#48506a"/><path d="M85 80v160m30-160v160m30-160v160m30-160v160m30-160v160m400-160v160m30-160v160m30-160v160m30-160v160" stroke="#303b54" stroke-width="10"/><rect x="225" y="320" width="350" height="20" rx="10" fill="#a48c7c"/>';
 else if(type==='construction')art+='<path d="M50 330V100h120m470 230V100H500" fill="none" stroke="#c4a476" stroke-width="14"/><path d="M50 130h120m470 0H500M50 220h120m470 0H500" stroke="#a89073" stroke-width="9"/><path d="M280 230 400 105l120 125" fill="none" stroke="#b6b0a0" stroke-width="20"/>';
 return '<g class="p3-environment">'+art+'</g>';
}
function sceneSVG(g,reveal=false,miniType=null){
 const speakers=[...new Set(g.turns.map(t=>t.speaker))];
 let svg=environment(miniType||(reveal?g.scene?.type:null));
 if(!miniType){
 const xs=speakers.length===3?[200,400,600]:[260,540];
 svg+=speakers.map((s,i)=>person(s,xs[i],180,i)).join('');
 if(reveal)svg+='<g class="p3-environment">'+(g.scene?.props||[]).slice(0,3).map((p,i)=>`<g transform="translate(${310+i*65} 302) scale(.6)">${shape(p)}</g>`).join('')+'</g>';
 }
 return '<svg viewBox="0 0 800 490" role="img" aria-label="'+esc(miniType?labels[miniType]:reveal?'Cảnh minh họa sau khi trả lời':'Nhân vật trung tính; bối cảnh được ẩn để tránh gợi ý đáp án')+'">'+svg+'</svg>';
}
const root=document.createElement('section');root.id='part3';root.setAttribute('aria-label','Part 3 Visual Conversations');
root.innerHTML=`<div class="p3-top"><div><div class="p3-eyebrow">ETS 2026 · Visual conversations</div><h1>Listen. Imagine. Understand.</h1><div class="p3-sub">Part 3 · ${new Set(data.map(g=>g.test)).size} Tests · ${data.length} hội thoại · ${data.length*3} câu hỏi</div></div><select class="p3-select" id="p3-test" aria-label="Chọn Test Part 3">${[...new Set(data.map(g=>g.test))].sort((a,b)=>a-b).map(n=>'<option value="'+n+'">Test '+n+'</option>').join('')}</select></div>
<div class="p3-study-toolbar"><div class="p3-learning-modes" aria-label="Chế độ học Part 3"><button type="button" data-learning-mode="sentences" aria-pressed="true">Học từng câu</button><button type="button" data-learning-mode="quiz" aria-pressed="false">Nghe & trả lời</button></div><div class="p3-view-tools"><button type="button" class="p3-tool" id="p3-transcript-toggle" aria-expanded="true" aria-controls="p3-panel-column">Ẩn lời thoại</button><span id="p3-hidden-list-slot"></span></div></div><div class="p3-layout"><div><div class="p3-keyword-dock" id="p3-keyword-dock" hidden></div><div class="p3-stage"><span class="p3-stage-tag" id="p3-tag"></span><div id="p3-scene"></div><div class="p3-stage-message"><span class="p3-live-dot"></span><span id="p3-caption">Bối cảnh được mở sau khi bạn trả lời.</span><span class="p3-wave" aria-hidden="true">${'<i></i>'.repeat(7)}</span></div></div><div class="p3-steps"><div class="p3-step" data-step="0">01 · Lắng nghe</div><div class="p3-step" data-step="1">02 · Chọn đáp án</div><div class="p3-step" data-step="2">03 · Khám phá cảnh</div></div>
<div class="p3-player"><div class="p3-player-row"><button class="p3-play" id="p3-play" aria-label="Phát audio gốc">▶</button><button type="button" class="p3-tool" id="p3-back-five" aria-label="Tua ngược 3 giây">−3s</button><button type="button" class="p3-tool" id="p3-forward-five" aria-label="Tua tới 3 giây">+3s</button><div class="p3-transport"><input id="p3-seek" type="range" min="0" max="100" step=".05" value="0" aria-label="Vị trí audio"><div class="p3-time"><span id="p3-time">0:00</span><span id="p3-duration">0:00</span></div></div><button class="p3-tool" id="p3-replay">↺ Nghe lại</button><select class="p3-select" id="p3-rate" aria-label="Tốc độ audio">${[.75,.9,1,1.1,1.25].map(n=>'<option '+(n===1?'selected':'')+' value="'+n+'">'+n+'×</option>').join('')}</select></div><label class="p3-sub" style="display:block;margin-top:10px"><input type="checkbox" id="p3-predict-mode"> Dừng sau lượt đầu để dự đoán phản hồi</label><p class="p3-player-note" id="p3-audio-note"></p><p class="p3-error" id="p3-error" role="alert" hidden></p></div>
<div class="p3-story" id="p3-story" hidden aria-label="Các bước của hội thoại"></div><details class="p3-transcript" id="p3-transcript" hidden><summary>Hội thoại · nghe lại từng lượt</summary><div id="p3-turns"></div><details><summary>Bản dịch từ tài liệu nguồn</summary><p class="p3-sub" id="p3-translation" style="white-space:pre-line;margin-top:12px"></p></details><p class="p3-source" id="p3-source"></p></details></div>
<div class="p3-panel-column" id="p3-panel-column"><div class="p3-top-list"><button type="button" class="p3-tool" id="p3-list-open">▦ Danh sách hội thoại</button></div><aside class="p3-panel" id="p3-question-panel" aria-label="Hoạt động học tập"></aside></div></div><div class="p3-next-row"><button class="p3-tool" id="p3-prev">← Hội thoại trước</button><button class="p3-tool" id="p3-next">Hội thoại tiếp →</button></div><div class="p3-list-summary"><span id="p3-progress"></span></div><dialog class="p3-library" id="p3-list-dialog" aria-label="Danh sách hội thoại"><div class="p3-list-header"><h2>Part 3 · Test <span id="p3-test-label">1</span></h2><button type="button" class="p3-tool" id="p3-list-close" aria-label="Đóng danh sách hội thoại">×</button></div><div class="p3-library-grid" id="p3-library"></div></dialog>`;
document.querySelector('.container').appendChild(root);
let photoStory=null,storyContinuous=false;
let learningMode=true,sentenceIndex=0,showSentenceText=false,repeatSentence=false,loopTimer=null;
let transcriptHidden=false;try{transcriptHidden=localStorage.getItem('toeic-part3-transcript-hidden')==='true';}catch{}
let test=1,index=0,qIndex=0,chosen={},submitted=false,listened=false,prediction=null,predictionShown=false,predictionWaiting=false,replayEnd=null,activeTurn=-1,observed=0,lastTime=null;
let results={};try{const saved=JSON.parse(localStorage.getItem('toeic-part3-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))results=saved;}catch{}
const audio=new Audio();audio.preload='metadata';let audioOffset=0,loadedAudioPath='',playbackRequest=0;
function setAudioSource(path,offset=0){audioOffset=offset;if(loadedAudioPath!==path){loadedAudioPath=path;audio.src='part3/'+path;audio.load();}audio.playbackRate=Number($('#p3-rate').value);}
const current=()=>data.filter(g=>g.test===test)[index];

function isPhotoStoryEnabled(){return learningMode&&!!current()?.id&&!!window.TOEICPhotoStoryPlayer&&window.TOEIC_VISUAL_STORY_MANIFESTS?.[current()?.id]?.enabled===true;}
function ensurePhotoStory(panel=$('#p3-question-panel')){
 if(!isPhotoStoryEnabled())return null;
 root.dataset.photoStory='true';
 if(!photoStory){photoStory=new window.TOEICPhotoStoryPlayer({container:$('#p3-scene'),keywordContainer:$('#p3-keyword-dock'),transcriptContainer:panel,manifestUrl:'part3/visual-story/'+current().id+'/scenes.json',bundledManifest:window.TOEIC_VISUAL_STORY_MANIFESTS[current().id],bundledTranscript:window.TOEIC_VISUAL_STORY_TRANSCRIPTS[current().id],getSourceTime:()=>audio.currentTime+audioOffset,getRepeat:()=>repeatSentence,playUtterance:i=>playSentence(i),previousUtterance:()=>moveSentence(-1),nextUtterance:()=>moveSentence(1),playScene:time=>playPhotoConversation(time),playConversation:()=>playPhotoConversation(),pause:()=>stop(),resume:()=>play(null,storyContinuous?current().sentences.at(-1).audioEnd:null)});}
 else photoStory.attachTranscript(panel);
 return photoStory;
}
function clearPhotoStory(){if(photoStory){photoStory.destroy();photoStory=null;}root.dataset.photoStory='false';}
function waitForAudioMetadata(){
 if(audio.readyState>=4)return Promise.resolve(true);
 if(audio.error)return Promise.resolve(false);
 return new Promise(resolve=>{let timer;const done=()=>{clearTimeout(timer);audio.removeEventListener('canplaythrough',done);audio.removeEventListener('error',done);resolve(audio.readyState>=4);};audio.addEventListener('canplaythrough',done);audio.addEventListener('error',done);timer=setTimeout(done,10000);});
}
async function playPhotoConversation(from=null){
 stop();storyContinuous=true;const g=current(),story=ensurePhotoStory(),request=playbackRequest;if(!story)return;
 if(!await story.ready||request!==playbackRequest||g!==current()||story!==photoStory||!isPhotoStoryEnabled())return;
 setAudioSource(g.audio,0);
 const ready=await waitForAudioMetadata();
 if(request!==playbackRequest||g!==current()||story!==photoStory||!isPhotoStoryEnabled())return;
 if(!ready){error('Chưa tải được audio gốc. Bấm nghe lại khi file đã sẵn sàng.');return;}
 const start=g.timing.segments[0].start,end=g.sentences.at(-1).audioEnd;audio.currentTime=from!==null&&from>=start&&from<end?from:start;lastTime=null;sync();play(null,end);
}

const sentenceSeconds=n=>Math.max(0,Number.isFinite(n)?n:0).toFixed(1)+'s';
const seconds=n=>Number.isFinite(n)?Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0'):'0:00';
function error(message){$('#p3-error').hidden=false;$('#p3-error').textContent=message;}
function save(){try{localStorage.setItem('toeic-part3-v1',JSON.stringify(results));}catch{error('Trình duyệt không lưu được tiến độ. Bạn vẫn có thể tiếp tục học trong phiên này.');}}
function stop(){playbackRequest++;clearTimeout(loopTimer);loopTimer=null;audio.pause();replayEnd=null;clearSpeaker();}
function clearSpeaker(){root.querySelectorAll('.speaking,.p3-turn.active').forEach(e=>e.classList.remove('speaking','active'));activeTurn=-1;}
function sync(){
 const g=current();if(!g)return;const sourceTime=audio.currentTime+audioOffset;
 const sentence=g.sentences?.[sentenceIndex],continuous=isPhotoStoryEnabled()&&storyContinuous,storyStart=g.timing?.segments[0]?.start||0,storyEnd=g.timing?.segments.at(-1)?.end||0;
 $('#p3-time').textContent=continuous?sentenceSeconds(Math.min(storyEnd-storyStart,sourceTime-storyStart)):learningMode?sentenceSeconds(audio.currentTime):seconds(sourceTime);$('#p3-duration').textContent=continuous?sentenceSeconds(storyEnd-storyStart):learningMode&&sentence?sentenceSeconds(Number.isFinite(audio.duration)?audio.duration:sentence.audioEnd-sentence.audioStart):seconds(audio.duration);$('#p3-seek').min=continuous?storyStart:learningMode&&sentence?sentence.audioStart:0;$('#p3-seek').max=continuous?storyEnd:learningMode&&sentence?(Number.isFinite(audio.duration)?audioOffset+audio.duration:sentence.audioEnd):Number.isFinite(audio.duration)?audio.duration:100;$('#p3-seek').value=sourceTime;
 if(!learningMode&&lastTime!==null&&!audio.paused){const delta=sourceTime-lastTime;if(delta>0&&delta<1)observed+=delta;}lastTime=sourceTime;
 if(!learningMode&&!submitted&&!predictionShown&&$('#p3-predict-mode').checked&&!audio.paused&&sourceTime>=g.timing?.segments[0]?.end){predictionShown=true;predictionWaiting=true;audio.pause();renderPanel();}
 if(!learningMode&&!listened&&sourceTime>=(g.timing?.segments.at(-1)?.end||audio.duration)-.1&&observed>=(g.timing?.segments.at(-1)?.end-g.timing?.segments[0]?.start||audio.duration)*.8){listened=true;renderPanel();}
 if(replayEnd!==null&&sourceTime>=replayEnd){audio.pause();replayEnd=null;}
 const playingSentence=!audio.paused?g.sentences?.find(x=>sourceTime>=x.start&&sourceTime<x.end):null;
 const segment=playingSentence?playingSentence.turn:g.timing?.validated&&!audio.paused?g.timing.segments.findIndex(s=>sourceTime>=s.start&&sourceTime<s.end):-1;
 if(segment!==activeTurn){clearSpeaker();activeTurn=segment;if(segment>=0){root.querySelector('[data-speaker="'+g.turns[segment].speaker+'"]')?.classList.add('speaking');root.querySelector('[data-turn="'+segment+'"]')?.classList.add('active');}}
 root.querySelectorAll('.p3-story [data-replay]').forEach(b=>b.classList.toggle('active',Number(b.dataset.replay)===activeTurn));
 if(!audio.paused)$('#p3-caption').textContent=activeTurn>=0?(submitted?g.turns[activeTurn].speaker+' · '+g.turns[activeTurn].text.slice(0,115)+(g.turns[activeTurn].text.length>115?'…':''):'Đang nghe · '+g.turns[activeTurn].speaker):'Audio gốc · lắng nghe ngữ cảnh';
 if(learningMode){$('#p3-caption').textContent='Câu '+(sentenceIndex+1)+' / '+g.sentences.length+' · '+sentence.speaker+(showSentenceText?' · '+sentence.text.slice(0,100):'');const sentencePlay=$('#p3-sentence-play');if(sentencePlay)sentencePlay.textContent=audio.paused&&loopTimer===null?'▶ Nghe câu này':'Ⅱ Tạm dừng';}
 if(isPhotoStoryEnabled()){if(continuous){const i=g.sentences.findIndex(line=>sourceTime>=line.start&&sourceTime<=line.end);if(i>=0)sentenceIndex=i;}photoStory?.sync(sourceTime,audio.paused);}
 const startButton=$('#p3-start');if(startButton)startButton.textContent=audio.paused?'▶ Bắt đầu nghe':'♫ Đang nghe…';
 $('#p3-play').textContent=audio.paused&&loopTimer===null?'▶':'Ⅱ';$('#p3-play').setAttribute('aria-label',audio.paused&&loopTimer===null?(continuous?'Phát hội thoại':learningMode?'Phát câu đang chọn':'Phát audio gốc'):'Tạm dừng audio');$('.p3-wave').classList.toggle('playing',!audio.paused);
}
async function play(from=null,end=null){
 if(predictionWaiting)return;
 if(from!==null){audio.currentTime=Math.max(0,from-audioOffset);lastTime=null;}
 replayEnd=end;
 const request=++playbackRequest;try{await audio.play();if(request===playbackRequest)$('#p3-error').hidden=true;}catch{if(request===playbackRequest)error('Không phát được MP3. Kiểm tra các thư mục audio trong part3 rồi bấm phát lại.');}sync();
}
function moveSentence(direction){
 const g=current(),time=audio.currentTime+audioOffset;
 const selected=storyContinuous?Math.max(0,g.sentences.findLastIndex(line=>line.start<=time)):sentenceIndex;
 playSentence(Math.max(0,Math.min(g.sentences.length-1,selected+direction)));
}
async function seekBy(seconds){
 const g=current(),wasPlaying=!audio.paused,sourceTime=audio.currentTime+audioOffset;stop();const request=playbackRequest;
 if(learningMode){storyContinuous=true;setAudioSource(g.audio,0);}
 if(!await waitForAudioMetadata()||request!==playbackRequest||g!==current())return;
 const start=learningMode?g.sentences[0].start:0,end=learningMode?g.sentences.at(-1).audioEnd:audio.duration;
 audio.currentTime=Math.max(start,Math.min(end-.02,sourceTime+seconds));lastTime=null;sync();if(wasPlaying)play(null,learningMode?end:null);
}
function renderLibrary(){
 const items=data.filter(g=>g.test===test);
 $('#p3-library').innerHTML=items.map((g,i)=>'<button class="'+(i===index?'current ':'')+(results[g.id]?'done':'')+'" data-open="'+i+'" aria-label="Hội thoại câu '+g.start+' đến '+g.end+(results[g.id]?', đã học':'')+'" '+(i===index?'aria-current="true"':'')+'>'+g.start+'–'+g.end+'</button>').join('');
 const completed=items.filter(g=>results[g.id]).length;$('#p3-progress').textContent=completed+' / '+items.length+' hội thoại đã hoàn thành · Tiến độ lưu riêng cho Part 3';$('#p3-test-label').textContent=test;
 $('#p3-prev').disabled=index===0;$('#p3-next').disabled=index>=items.length-1;
}
function turnIcon(text){const t=text.toLowerCase();if(/phone|call|calling/.test(t))return 'phone';if(/computer|software|online|e-mail|screen/.test(t))return 'laptop';if(/ticket|flight|train/.test(t))return 'ticket';if(/cheese/.test(t))return 'cheese';if(/coffee|food|recipe/.test(t))return 'cup';if(/book|library/.test(t))return 'book';if(/schedule|tomorrow|monday|meeting/.test(t))return 'calendar';if(/ship|deliver|material|order/.test(t))return 'box';if(/sale|budget|price|cost/.test(t))return 'chart';return 'document';}
function renderTranscript(){
 const g=current();$('#p3-transcript').hidden=!submitted||learningMode;
 $('#p3-turns').innerHTML=g.turns.map((t,i)=>'<div class="p3-turn" data-turn="'+i+'"><button data-replay="'+i+'" '+(!g.timing?.validated?'disabled':'')+' aria-label="Nghe lượt '+(i+1)+' của '+t.speaker+'">'+t.speaker+' ↻</button><span>'+esc(t.text)+'</span></div>').join('');
 $('#p3-translation').textContent=g.translation;
 $('#p3-story').hidden=!submitted||learningMode;$('#p3-story').innerHTML=g.turns.map((t,i)=>'<button data-replay="'+i+'" '+(!g.timing?.validated?'disabled':'')+' aria-label="Nghe lượt '+(i+1)+'">'+icon(turnIcon(t.text))+'<span>'+t.speaker+' · Lượt '+(i+1)+'</span></button>').join('');
 $('#p3-source').textContent='Nguồn: '+g.source.file.split(/[\\/]/).at(-1)+' · trang '+g.source.pages.join(', ')+(g.source.transcriptCorrection?' · Transcript sửa từ '+g.source.transcriptCorrection.file.split(/[\\/]/).at(-1)+' trang '+g.source.transcriptCorrection.pages.join(', '):'')+'. Mốc audio: '+(g.timing?.validated?'đo bằng nhận dạng lời nói và đối chiếu transcript.':'chưa đủ độ tin cậy để đồng bộ người nói.');
}
function renderSentencePanel(){
 const g=current(),sentence=g.sentences[sentenceIndex],panel=$('#p3-question-panel');if(isPhotoStoryEnabled()){ensurePhotoStory(panel);return;}
 root.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('active',Number(el.dataset.step)===0));
 panel.innerHTML='<div class="p3-eyebrow">MỖI LẦN MỘT CÂU</div><div class="p3-sentence-heading"><h2>Câu '+(sentenceIndex+1)+' <span>/ '+g.sentences.length+'</span></h2><span class="p3-speaker-badge">'+sentence.speaker+'</span></div><div class="p3-sentence-card">'+(showSentenceText?'<p>'+esc(sentence.text)+'</p>':'<div class="p3-sentence-listen" aria-label="Lời thoại đang ẩn">♫</div><p class="p3-sub">Nghe rồi tự nhắc lại câu này.</p>')+'</div><button type="button" class="p3-primary" id="p3-sentence-play">'+(audio.paused?'▶ Nghe câu này':'Ⅱ Tạm dừng')+'</button><div class="p3-sentence-settings"><label><input type="checkbox" id="p3-show-sentence" '+(showSentenceText?'checked':'')+'> Hiện câu tiếng Anh</label><label><input type="checkbox" id="p3-repeat-sentence" '+(repeatSentence?'checked':'')+'> Lặp câu này</label></div><div class="p3-next-row"><button type="button" class="p3-tool" id="p3-sentence-prev" '+(sentenceIndex===0?'disabled':'')+'>← Câu trước</button><button type="button" class="p3-tool" id="p3-sentence-next" '+(sentenceIndex===g.sentences.length-1?'disabled':'')+'>Câu tiếp →</button></div><p class="p3-player-note">'+'Lời chào và câu ngắn đi cùng phần nói tiếp theo trong cùng lượt nói. Dấu phẩy và khoảng nghỉ không tách đoạn audio.'+'</p><div class="p3-sentence-grid">'+g.sentences.map((x,i)=>'<button type="button" class="p3-sentence-chip '+(i===sentenceIndex?'active':'')+'" data-sentence="'+i+'" aria-label="Nghe câu '+(i+1)+' của '+x.speaker+'" aria-pressed="'+(i===sentenceIndex)+'"><b>'+(i+1)+'</b><span>'+x.speaker+'</span></button>').join('')+'</div>';
}
function playSentence(i=sentenceIndex){
 stop();storyContinuous=false;const g=current();sentenceIndex=Math.max(0,Math.min(g.sentences.length-1,i));predictionWaiting=false;const sentence=g.sentences[sentenceIndex];setAudioSource(sentence.audio,sentence.audioStart);audio.currentTime=0;renderPanel();play();
}
function updateTranscriptVisibility(){
 const hidden=learningMode&&transcriptHidden;root.dataset.transcriptHidden=String(hidden);$('#p3-panel-column').hidden=hidden;
 const toggle=$('#p3-transcript-toggle');toggle.textContent=hidden?'Hiện lời thoại':'Ẩn lời thoại';toggle.setAttribute('aria-expanded',String(!hidden));root.querySelector('.p3-view-tools').hidden=!learningMode;
 const destination=hidden?$('#p3-hidden-list-slot'):root.querySelector('.p3-panel-column .p3-top-list');destination.append($('#p3-list-open'));
 if(photoStory)photoStory.lastUtterance=-1;
}
function setLearningMode(enabled){
 stop();learningMode=enabled;root.dataset.learning=String(enabled);predictionWaiting=false;lastTime=null;
 const g=current();const photo=isPhotoStoryEnabled();root.querySelector('[data-learning-mode="sentences"]').textContent=window.TOEIC_VISUAL_STORY_MANIFESTS?.[current()?.id]?.enabled?'Visual Story':'Học từng câu';storyContinuous=photo;if(!photo&&photoStory){clearPhotoStory();$('#p3-scene').innerHTML=sceneSVG(g,submitted);}$('#p3-tag').textContent='TEST '+test+' / '+g.start+'–'+g.end+' · '+(enabled?g.sentences.length+' CÂU NGHE':g.turns.length+' LƯỢT NÓI');setAudioSource(photo?g.audio:enabled?g.sentences[sentenceIndex].audio:g.audio,photo?0:enabled?g.sentences[sentenceIndex].audioStart:0);audio.currentTime=photo?g.timing.segments[0].start:0;
 if(!enabled){$('#p3-caption').textContent=submitted?g.scene?.focus||'Xem lại hội thoại':'Bối cảnh được mở sau khi bạn trả lời.';if(!listened)observed=0;}
 root.querySelectorAll('[data-learning-mode]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.learningMode==='sentences')===enabled)));
 $('#p3-predict-mode').closest('label').hidden=enabled;
 $('#p3-audio-note').textContent=photo?'Audio ETS gốc · Ảnh và transcript đi theo vị trí đang nghe · Bấm vùng đánh dấu để học từ':enabled?'Mỗi câu là một đoạn audio riêng, trích nguyên từ bản gốc · Dấu phẩy và khoảng nghỉ không làm dừng câu':'Audio ETS gốc · Nghe cả hội thoại, sau đó trả lời 3 câu hỏi';
 renderPanel();renderTranscript();updateTranscriptVisibility();sync();
}
function renderPanel(){
 const g=current(),panel=$('#p3-question-panel');if(learningMode){renderSentencePanel();return;}root.querySelectorAll('[data-step]').forEach(el=>el.classList.toggle('active',Number(el.dataset.step)===(submitted?2:listened?1:0)));
 if(predictionWaiting){panel.innerHTML='<div class="p3-eyebrow">PREDICT · TỰ LUYỆN</div><h2>Người tiếp theo sẽ phản hồi thế nào?</h2><p class="p3-sub">Chọn dự đoán rồi nghe tiếp để tự đối chiếu. Hoạt động này không tính điểm ETS.</p><div class="p3-options" style="margin-top:16px">'+[['Đồng ý','people'],['Hỏi thêm','document'],['Đề xuất khác','phone'],['Trả lời / giải thích','chart']].map(([label,art])=>'<button class="p3-answer" data-predict="'+label+'">'+icon(art)+'<span>'+label+'</span></button>').join('')+'</div><button class="p3-primary" id="p3-skip-prediction">Bỏ qua · Nghe tiếp</button>';return;}
 if(!listened&&!submitted){panel.innerHTML='<div class="p3-eyebrow">LISTEN FIRST</div><h2>Chuyện gì đang diễn ra?</h2><div class="p3-intro-visual"><span class="p3-orb">◉</span><span class="p3-orb">♫</span><span class="p3-orb">?</span></div><p class="p3-sub">Chú ý ai đang nói, vấn đề họ gặp và điều họ định làm tiếp theo.</p><button class="p3-primary" id="p3-start">'+(audio.paused?'▶ Bắt đầu nghe':'♫ Đang nghe…')+'</button><p class="p3-player-note">Nghe hội thoại để mở 3 câu hỏi. Hình ảnh và lời giải được giữ kín trong lượt nghe đầu.</p>'+(g.questions.every(q=>'ABCD'.includes(results[g.id]?.answers?.[q.number]||'!'))?'<button class="p3-tool" id="p3-history" style="width:100%;margin-top:12px">Xem lần làm gần nhất</button>':'');return;}
 const q=g.questions[qIndex];
 panel.innerHTML='<div class="p3-eyebrow">'+(submitted?'DISCOVER & REPLAY':'YOUR TURN')+'</div><div class="p3-pager">'+g.questions.map((x,i)=>'<button data-question="'+i+'" class="'+(qIndex===i?'active':'')+'" aria-pressed="'+(qIndex===i)+'">'+x.number+' '+(submitted?(chosen[x.number]===x.answer?'✓':'×'):chosen[x.number]?'●':'○')+'</button>').join('')+'</div><h2>'+esc(q.text)+'</h2>'+(q.graphic?'<img class="p3-graphic" src="part3/'+esc(q.graphic)+'" alt="Đồ họa nguyên bản cho câu '+q.number+'">':'')+'<div class="p3-options">'+q.options.map((o,i)=>{const selected=chosen[q.number]===o.letter;return '<button class="p3-answer '+(selected?'selected ':'')+(submitted?(o.letter===q.answer?'correct':selected?'incorrect':''):'')+'" data-answer="'+o.letter+'" aria-pressed="'+selected+'" '+(submitted?'disabled':'')+'><span class="p3-letter">'+o.letter+(submitted&&o.letter===q.answer?' · ✓ Đáp án đúng':'')+'</span>'+(q.illustrations?.[i]?icon(q.illustrations[i]):q.sceneOptions?.[i]?sceneSVG(g,false,q.sceneOptions[i]):'')+'<span>'+esc(o.text)+'</span></button>';}).join('')+'</div>';
 if(!submitted){const count=Object.keys(chosen).length;panel.innerHTML+='<button class="p3-primary" id="p3-submit" '+(count<3?'disabled':'')+'>Khám phá cảnh · Nộp '+count+'/3 câu</button>';if(count<3)panel.innerHTML+='<p class="p3-player-note">Chọn đáp án cho cả ba câu rồi mở lời giải.</p>';}
 else{
 const score=g.questions.filter(x=>chosen[x.number]===x.answer).length;
 panel.innerHTML+='<div class="p3-feedback" role="status">'+score+'/3 câu đúng · Câu '+q.number+': '+(chosen[q.number]===q.answer?'Bạn chọn đúng.':'Bạn chọn '+esc(chosen[q.number])+'. Đáp án: '+q.answer+'.')+'</div>';
 if(q.evidence?.length)panel.innerHTML+='<div class="p3-feedback"><b>Chi tiết cần nghe</b>'+q.evidence.map(i=>'<p style="margin-top:8px">'+esc(g.turns[i].text)+'</p><button class="p3-tool" data-replay="'+i+'" '+(!g.timing?.validated?'disabled':'')+'>↻ Nghe bằng chứng · '+g.turns[i].speaker+'</button>').join('')+'</div>';
 panel.innerHTML+='<div class="p3-next-row"><button class="p3-tool" id="p3-retry">Làm lại hội thoại</button><button class="p3-tool" id="p3-next-question">'+(qIndex<2?'Câu tiếp →':'Xem lại câu đầu')+'</button></div>';
 if(prediction)panel.innerHTML+='<details style="margin-top:14px"><summary>Dự đoán của bạn: '+esc(prediction)+'</summary><p class="p3-sub">Đối chiếu với phản hồi thực tế:</p><p style="font-size:12px">'+esc(g.turns[1]?.text)+'</p><button class="p3-tool" data-replay="1">↻ Nghe phản hồi</button></details>';
 if(g.scene?.settingVerified){const types=[g.scene.type,...Object.keys(labels).filter(t=>t!==g.scene.type)].slice(0,4);panel.innerHTML+='<details style="margin-top:18px"><summary>Nhớ lại: chọn bối cảnh hội thoại</summary><div class="p3-review-scenes">'+types.sort().map(t=>'<button data-setting="'+t+'" aria-label="'+labels[t]+'">'+sceneSVG(g,false,t)+labels[t]+'</button>').join('')+'</div><p class="p3-sub" id="p3-setting-feedback" aria-live="polite"></p></details>';}
 }
}
function load(i){
 stop();clearPhotoStory();storyContinuous=false;index=i;sentenceIndex=0;qIndex=0;chosen={};submitted=false;listened=false;observed=0;lastTime=null;prediction=null;predictionShown=false;predictionWaiting=false;
 const g=current();if(!g){error('Không có dữ liệu cho hội thoại này.');return;}
 $('#p3-error').hidden=true;setAudioSource(learningMode?g.sentences[0].audio:g.audio,learningMode?g.sentences[0].audioStart:0);
 $('#p3-tag').textContent='TEST '+test+' / '+g.start+'–'+g.end+' · '+g.turns.length+' LƯỢT NÓI';$('#p3-scene').innerHTML=sceneSVG(g);$('#p3-caption').textContent='Bối cảnh được mở sau khi bạn trả lời.';
 $('#p3-audio-note').textContent=g.timing?.validated?'Audio ETS gốc · Hoạt ảnh theo mốc lời nói đo từ audio · Phím Space: phát / dừng':'Audio ETS gốc · Chưa xác minh được mốc người nói; hoạt ảnh đồng bộ đang tắt.';
 renderTranscript();renderPanel();renderLibrary();setLearningMode(learningMode);sync();
}
root.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.id==='p3-transcript-toggle'){transcriptHidden=!transcriptHidden;try{localStorage.setItem('toeic-part3-transcript-hidden',String(transcriptHidden));}catch{}updateTranscriptVisibility();sync();}
 else if(b.id==='p3-list-open'){$('#p3-list-dialog').showModal();}
 else if(b.id==='p3-list-close'){$('#p3-list-dialog').close();}
 else if(b.id==='p3-back-five'){seekBy(-3);}
 else if(b.id==='p3-forward-five'){seekBy(3);}
 else if(b.dataset.learningMode){setLearningMode(b.dataset.learningMode==='sentences');}
 else if(b.dataset.sentence!==undefined){playSentence(Number(b.dataset.sentence));}
 else if(b.id==='p3-sentence-prev'){playSentence(sentenceIndex-1);}
 else if(b.id==='p3-sentence-next'){playSentence(sentenceIndex+1);}
 else if(b.id==='p3-sentence-play'){if(audio.paused&&loopTimer===null)playSentence();else{stop();sync();}}
 else if(b.dataset.predict||b.id==='p3-skip-prediction'){prediction=b.dataset.predict||null;predictionWaiting=false;renderPanel();play();}
 else if(b.id==='p3-play'){if(audio.paused&&loopTimer===null){if(isPhotoStoryEnabled()&&storyContinuous)playPhotoConversation(audio.currentTime+audioOffset);else if(learningMode)playSentence();else play();}else{stop();sync();}}
 else if(b.id==='p3-start'){if(audio.paused)play();}
 else if(b.id==='p3-replay'){if(isPhotoStoryEnabled()&&storyContinuous)playPhotoConversation();else if(learningMode)playSentence();else play(0);}
 else if(b.id==='p3-prev'){load(Math.max(0,index-1));}
 else if(b.id==='p3-next'){load(index+1);}
 else if(b.dataset.open!==undefined){$('#p3-list-dialog').close();load(Number(b.dataset.open));}
 else if(b.dataset.question!==undefined){qIndex=Number(b.dataset.question);renderPanel();}
 else if(b.dataset.answer&&!submitted){chosen[current().questions[qIndex].number]=b.dataset.answer;renderPanel();}
 else if(b.id==='p3-history'){const g=current();if(!g.questions.every(q=>'ABCD'.includes(results[g.id]?.answers?.[q.number]||'!')))return;stop();predictionWaiting=false;chosen={...results[g.id].answers};submitted=true;listened=true;$('#p3-scene').innerHTML=sceneSVG(g,true);$('#p3-caption').textContent=g.scene?.focus||'Nghe và xem lại hội thoại';renderPanel();renderTranscript();}
 else if(b.id==='p3-submit'&&Object.keys(chosen).length===3){stop();submitted=true;const g=current();results[g.id]={answers:{...chosen},score:g.questions.filter(q=>chosen[q.number]===q.answer).length,date:new Date().toISOString()};save();$('#p3-scene').innerHTML=sceneSVG(g,true);$('#p3-caption').textContent=g.scene?.focus||'Mở transcript và nghe lại các chi tiết bạn còn phân vân.';renderPanel();renderTranscript();renderLibrary();}
 else if(b.id==='p3-next-question'){qIndex=(qIndex+1)%3;renderPanel();}
 else if(b.id==='p3-retry'){load(index);}
 else if(b.dataset.replay!==undefined){const s=current().timing?.segments[Number(b.dataset.replay)];if(current().timing?.validated&&s)play(s.start,s.end);}
 else if(b.dataset.setting){const correct=b.dataset.setting===current().scene.type;b.classList.toggle('chosen',correct);$('#p3-setting-feedback').textContent=correct?'Đúng bối cảnh. Hãy nối hình ảnh với các chi tiết bạn nghe được.':'Thử nghe lại và chọn bối cảnh phù hợp hơn.';}
});
root.addEventListener('change',e=>{if(e.target.id==='p3-show-sentence'){showSentenceText=e.target.checked;renderPanel();sync();}else if(e.target.id==='p3-repeat-sentence'){repeatSentence=e.target.checked;if(!repeatSentence){clearTimeout(loopTimer);loopTimer=null;}}});
$('#p3-test').addEventListener('change',e=>{test=Number(e.target.value);load(0);});
$('#p3-rate').addEventListener('change',e=>{audio.playbackRate=Number(e.target.value);});
$('#p3-seek').addEventListener('input',e=>{audio.currentTime=Math.max(0,Number(e.target.value)-audioOffset);lastTime=null;replayEnd=isPhotoStoryEnabled()&&storyContinuous?current().sentences.at(-1).audioEnd:null;sync();});
['timeupdate','loadedmetadata','play','pause','ended'].forEach(type=>audio.addEventListener(type,sync));
audio.addEventListener('ended',()=>{
 if(!learningMode||storyContinuous||!document.body.classList.contains('p3-selected'))return;
 if(repeatSentence){
  loopTimer=setTimeout(()=>{loopTimer=null;if(learningMode&&repeatSentence&&!storyContinuous&&document.body.classList.contains('p3-selected'))playSentence();},500);
 }else if(sentenceIndex<current().sentences.length-1){
  playSentence(sentenceIndex+1);
 }
});
audio.addEventListener('error',()=>error('Thiếu hoặc không đọc được file '+loadedAudioPath+'. Giữ đúng cấu trúc thư mục part3.'));
let raf=null;function tick(){if(document.body.classList.contains('p3-selected')&&!audio.paused)sync();raf=requestAnimationFrame(tick);}tick();
window.addEventListener('pagehide',()=>{stop();clearPhotoStory();cancelAnimationFrame(raf);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('keydown',e=>{if(!document.body.classList.contains('p3-selected')||document.querySelector('dialog[open]'))return;if(e.target.matches('button,summary')&&!((e.code==='Space'&&e.target.matches('.vs-line,.vs-thumbnail,#p3-play,#p3-sentence-play'))||(learningMode&&['ArrowLeft','ArrowRight'].includes(e.code)))){e.stopImmediatePropagation();return;}if(e.target.matches('input,select,textarea')||e.target.isContentEditable)return;if(['Space','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();if(e.repeat)return;if(e.code==='Space'){if(audio.paused&&loopTimer===null){if(isPhotoStoryEnabled()&&storyContinuous)playPhotoConversation(audio.currentTime+audioOffset);else if(learningMode){if(audio.ended)playSentence();else play();}else play();}else stop();}else if(e.code==='ArrowLeft'){if(learningMode)moveSentence(-1);else if(!learningMode&&index>0)load(index-1);}else if(e.code==='ArrowRight'){if(learningMode)moveSentence(1);else if(!learningMode&&index<data.filter(g=>g.test===test).length-1)load(index+1);}}},true);
let previousTab='flashcard';
const originalSetPart=window.setQuizPart;
window.setQuizPart=function(part){
 if(part==='3'){
  if(currentTab!=='part3')previousTab=currentTab;
  stopPart2Audio();quizAudioToken++;window.speechSynthesis.cancel();document.body.classList.remove('p2-mode','p2-selected');document.body.classList.add('p3-selected');
  activeQuizPart='3';currentTab='part3';document.querySelectorAll('[data-quiz-part]').forEach(b=>{const yes=b.dataset.quizPart==='3';b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes));});
  if(!audio.src)load(0);else if(isPhotoStoryEnabled())renderPanel();
 }else{stop();clearPhotoStory();document.body.classList.remove('p3-selected');if(currentTab==='part3')currentTab=part==='1'?previousTab:'quiz';originalSetPart(part);document.querySelectorAll('.game-section').forEach(s=>s.classList.toggle('active',s.id===currentTab));document.querySelectorAll('.nav-tabs .tab-btn').forEach(b=>b.classList.toggle('active',b.getAttribute('onclick')?.includes("'"+currentTab+"'"))); }
};
const tabButton=document.createElement('button');tabButton.type='button';tabButton.dataset.quizPart='3';tabButton.setAttribute('aria-pressed','false');tabButton.textContent='Part 3 · Hội thoại trực quan';tabButton.onclick=()=>window.setQuizPart('3');document.querySelector('.main-part-tabs').appendChild(tabButton);
[...document.querySelectorAll('.toolbar button')].find(b=>b.textContent==='Giao diện')?.classList.add('p3-appearance');
document.querySelector('.logo span').textContent='Part 1 · Part 2 · Part 3 | Luyện nghe TOEIC';
window.TOEICPart3={open:()=>window.setQuizPart('3'),dataCount:data.length};
})();
