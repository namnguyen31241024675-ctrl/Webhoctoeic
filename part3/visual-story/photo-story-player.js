/* Photo-only Visual Story Player. Its clock comes from the existing ETS audio player. */
(function(root){
'use strict';
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
class PhotoStoryPlayer{
 constructor(options){
  this.showVietnamese=true;this.subtitleBlur='none';try{this.showVietnamese=localStorage.getItem('toeic-part3-show-vi')!=='false';this.subtitleBlur=localStorage.getItem('toeic-part3-subtitle-blur')||'none';}catch{}if(!['none','en','vi','both'].includes(this.subtitleBlur))this.subtitleBlur='none';
  this.showKeywordBoard=true;this.keywordBlur='none';try{this.showKeywordBoard=localStorage.getItem('toeic-part3-live-keywords')!=='false';this.keywordBlur=localStorage.getItem('toeic-part3-keyword-blur')||'none';}catch{}if(!['none','en','vi','both'].includes(this.keywordBlur))this.keywordBlur='none';
  this.options=options;this.container=options.container;this.panel=options.transcriptContainer;this.sceneIndex=-1;this.activeLayer=0;this.sourceTime=0;this.state='loading';this.destroyed=false;this.lastUtterance=-1;
  this.container.replaceChildren(make('div','vs-status','Đang tải bộ ảnh câu chuyện…'));
  this.ready=this.initialize().then(()=>true).catch(error=>{if(this.destroyed)return false;this.state='error';this.container.replaceChildren(make('div','vs-status','Không tải được bộ ảnh. Kiểm tra thư mục ảnh của hội thoại.'));this.renderTranscript();console.error('Visual Story:',error.message);return false;});
 }
 async initialize(){
  const base=new URL(this.options.manifestUrl,document.baseURI);this.base=base;
  if(location.protocol==='file:')this.manifest=this.options.bundledManifest;
  else{const response=await fetch(base,{cache:'no-store'});if(!response.ok)throw Error('scenes.json: '+response.status);this.manifest=await response.json();}
  const report=root.TOEICVisualStoryContract.inspectManifest(this.manifest);if(!report.ready)throw Error('Manifest chưa sẵn sàng: '+[...report.errors,...report.missing].join(' '));
  if(location.protocol==='file:')this.transcript=this.options.bundledTranscript;
  else{const response=await fetch(new URL(this.manifest.transcriptSrc,base),{cache:'no-store'});if(!response.ok)throw Error('Không tải được transcript.');this.transcript=await response.json();}
  if(!Array.isArray(this.transcript?.utterances)||this.transcript.conversationId!==this.manifest.conversationId)throw Error('Transcript không khớp hội thoại.');
  this.images=new Map();
  await Promise.all(this.manifest.images.map(async meta=>{const img=new Image();const url=new URL(meta.src,base).href;img.src=url;await new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)return resolve();img.onload=resolve;img.onerror=()=>reject(Error('Ảnh không đọc được: '+meta.src));});if(!img.naturalWidth)throw Error('Ảnh rỗng.');this.images.set(meta.id,{meta,img,url});}));
  if(this.destroyed)return;
  this.state='ready';this.build();this.renderTranscript();this.sync(this.options.getSourceTime(),true);
 }
 build(){
  this.container.replaceChildren();this.element=make('div','vs-player');this.viewport=make('div','vs-viewport');this.viewport.setAttribute('aria-label','Câu chuyện bằng ảnh chụp');
  this.layers=[make('div','vs-layer'),make('div','vs-layer')];this.layers.forEach(layer=>this.viewport.appendChild(layer));
  const top=make('div','vs-photo-heading');top.append(make('span','vs-photo-label','VISUAL STORY · TEST '+this.manifest.conversationId.match(/^t(\d+)-/)[1]+' · '+this.manifest.conversationId.split('-')[1]+'–'+(Number(this.manifest.conversationId.split('-')[1])+2)));this.counter=make('span','vs-counter','1 / '+this.manifest.scenes.length);top.append(this.counter);this.viewport.append(top);
  this.element.append(this.viewport);this.buildSpeakers();const nav=make('div','vs-scene-nav');nav.setAttribute('aria-label','Chọn cảnh');
  this.thumbnailButtons=this.manifest.scenes.map((scene,i)=>{const b=make('button','vs-thumbnail');b.type='button';b.setAttribute('aria-label','Nghe từ cảnh '+(i+1));const im=make('img');im.src=this.images.get(scene.imageId).url;im.alt='';b.append(im,make('span','',String(i+1)));b.onclick=()=>this.options.playScene(scene.start);nav.append(b);return b;});
  this.element.append(nav,make('div','vs-photo-tip','Bấm vùng đánh dấu trên ảnh để học từ vựng'));this.container.append(this.element);
  this.dialog=make('dialog','vs-word-dialog');this.dialog.addEventListener('close',()=>this.cancelPronunciation());this.dialog.addEventListener('click',event=>{if(event.target===this.dialog){const rect=this.dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)this.dialog.close();}});document.body.append(this.dialog);
  this.observer=new ResizeObserver(()=>this.resizeFrames());this.observer.observe(this.viewport);
  this.buildKeywordBoard();
 }
 buildKeywordBoard(){
  this.keywordDock=this.options.keywordContainer;if(!this.keywordDock)return;this.keywordDock.hidden=false;this.keywordDock.replaceChildren();this.keywordBoard=make('section','vs-live-keywords');this.keywordBoard.setAttribute('aria-label','Từ khóa theo audio');
  const header=make('div','vs-keyword-header');header.append(make('h2','','Từ khóa đang nghe'));const toggleLabel=make('label','vs-keyword-toggle');const toggle=make('input');toggle.type='checkbox';toggle.id='p3-live-keywords';toggle.checked=this.showKeywordBoard;toggle.setAttribute('aria-label','Hiện từ khóa theo audio');toggle.onchange=()=>{this.showKeywordBoard=toggle.checked;try{localStorage.setItem('toeic-part3-live-keywords',String(this.showKeywordBoard));}catch{}this.keywordContent.hidden=!this.showKeywordBoard;this.keywordBlurTools.hidden=!this.showKeywordBoard;this.keywordRenderedKey=null;this.syncKeywordBoard(this.options.getSourceTime(),this.audioPaused??true);};toggleLabel.append(toggle,document.createTextNode(' Hiện'));header.append(toggleLabel);this.keywordBoard.append(header);
  this.keywordBlurTools=make('div','vs-keyword-tools');const blurLabel=make('label','vs-blur-label','Che mờ');const blur=make('select','p3-select');blur.id='p3-keyword-blur';blur.setAttribute('aria-label','Che mờ bảng từ khóa');for(const [value,label] of [['none','Không che'],['en','Tiếng Anh'],['vi','Tiếng Việt'],['both','Cả hai']]){const option=make('option','',label);option.value=value;blur.append(option);}blur.value=this.keywordBlur;blur.onchange=()=>{this.keywordBlur=blur.value;try{localStorage.setItem('toeic-part3-keyword-blur',this.keywordBlur);}catch{}this.applyKeywordBlur();};blurLabel.append(blur);this.keywordBlurTools.append(blurLabel);this.keywordReveal=make('button','p3-tool','Xem tạm');this.keywordReveal.type='button';this.keywordReveal.setAttribute('aria-label','Xem tạm từ khóa');this.keywordReveal.onclick=()=>{const revealed=this.keywordBoard.classList.toggle('vs-keywords-revealed');this.keywordReveal.textContent=revealed?'Che lại':'Xem tạm';this.keywordReveal.setAttribute('aria-pressed',String(revealed));};this.keywordBlurTools.append(this.keywordReveal);this.keywordBlurTools.hidden=!this.showKeywordBoard;
  this.keywordContent=make('div','vs-keyword-content');this.keywordContent.hidden=!this.showKeywordBoard;this.keywordBoard.append(this.keywordBlurTools,this.keywordContent);this.keywordDock.append(this.keywordBoard);this.applyKeywordBlur();
 }
 applyKeywordBlur(){
  if(!this.keywordBoard)return;this.keywordBoard.dataset.keywordBlur=this.keywordBlur;this.keywordBoard.classList.remove('vs-keywords-revealed');this.keywordReveal.hidden=this.keywordBlur==='none';this.keywordReveal.textContent='Xem tạm';this.keywordReveal.setAttribute('aria-pressed','false');
 }
 syncKeywordBoard(sourceTime,paused){
  if(!this.keywordBoard||!this.showKeywordBoard)return;const index=this.transcript.utterances.findLastIndex(line=>line.start<=sourceTime),line=this.transcript.utterances[index];
  const cues=(line?.keywordCues||[]).filter(cue=>cue.start<=sourceTime).slice(-1),active=!paused?cues.find(cue=>sourceTime>=cue.start&&sourceTime<cue.end)?.id:null;
  const key=(line?.id||'')+':'+cues.map(cue=>cue.id).join(',')+':'+(active||'')+':'+paused;if(key===this.keywordRenderedKey)return;
  const revealKey=(line?.id||'')+':'+cues.map(cue=>cue.id).join(',');if(revealKey!==this.keywordRevealKey){this.applyKeywordBlur();this.keywordRevealKey=revealKey;}this.keywordRenderedKey=key;this.keywordContent.replaceChildren();
  if(!cues.length){this.keywordContent.append(make('p','vs-keyword-empty',line&&!line.keywordCues?.length?'Câu này chưa có mốc từ khóa đã xác minh. Bạn vẫn có thể nghe và xem lời thoại.':paused?'Bấm phát để hiện từ khóa khi được đọc đến.':'Đang nghe… từ khóa sẽ hiện khi được đọc đến.'));return;}
  const cards=make('div','vs-keyword-cards');cards.setAttribute('role','list');for(const cue of cues){const card=make('div','vs-keyword-card');card.setAttribute('role','listitem');card.dataset.keywordId=cue.id;card.classList.toggle('is-current',cue.id===active);const en=make('strong','vs-live-keyword-en',cue.en);en.lang='en';card.append(en);const vi=make('span','vs-live-keyword-vi',cue.vi.length?cue.vi.join(' · '):line.vi);vi.lang='vi';if(!cue.vi.length)card.append(make('span','vs-keyword-context-label','Nghĩa cả câu'));card.append(vi);cards.append(card);}this.keywordContent.append(cards);
 }
 updateKeywordClock(sourceTime,paused){
  this.audioPaused=paused;this.syncKeywordBoard(sourceTime,paused);if(paused){if(this.keywordFrame)cancelAnimationFrame(this.keywordFrame);this.keywordFrame=0;return;}if(this.keywordFrame)return;const tick=()=>{this.keywordFrame=0;if(this.destroyed||this.audioPaused)return;this.syncKeywordBoard(this.options.getSourceTime(),false);this.keywordFrame=requestAnimationFrame(tick);};this.keywordFrame=requestAnimationFrame(tick);
 }
 buildSpeakers(){
  this.speakerStrip=make('div','vs-speaker-strip');this.speakerStrip.setAttribute('aria-label','Nhân vật trong hội thoại');this.speakerCards=new Map();
  const cast=this.manifest.speakers||[...new Set(this.transcript.utterances.map(line=>line.speaker))].map(id=>({id,label:id}));
  [...cast].sort((a,b)=>(a.id.startsWith('M')?0:1)-(b.id.startsWith('M')?0:1)).forEach(person=>{const card=make('div','vs-speaker-card');card.dataset.speakerId=person.id;const portrait=make('div','vs-speaker-portrait');portrait.setAttribute('aria-hidden','true');const crop=person.portrait,image=crop&&this.images.get(crop.imageId);if(image){portrait.style.backgroundImage=`url("${image.url}")`;portrait.style.backgroundSize=`${100/crop.width}% ${100/crop.height}%`;portrait.style.backgroundPosition=`${crop.x/(1-crop.width)*100}% ${crop.y/(1-crop.height)*100}%`;}else portrait.textContent=person.id;const text=make('div','vs-speaker-info');text.append(make('b','',person.label+' · '+person.id),make('span','vs-speaker-state','Đang nghe'));card.append(portrait,text);this.speakerCards.set(person.id,card);this.speakerStrip.append(card);});
  this.speakerStatus=make('div','vs-speaking-status','Bấm phát để theo dõi người đang nói');this.speakerStatus.setAttribute('role','status');this.speakerStatus.setAttribute('aria-live','polite');this.element.append(this.speakerStrip,this.speakerStatus);const legend=make('div','vs-focus-legend');legend.append(make('span','vs-person-key','Người nói'),make('span','vs-object-key','Chi tiết liên quan'));this.element.append(legend);
 }
 updateSpeaker(speaker,paused){
  const key=this.sceneIndex+':'+(speaker||'')+':'+paused;if(key===this.speakerStateKey)return;this.speakerStateKey=key;
  const frame=this.layers[this.activeLayer]?.querySelector('.vs-photo-frame');let visible=false;
  frame?.querySelectorAll('.vs-character-focus').forEach(focus=>{const active=!!speaker&&!paused&&focus.dataset.characterSpeaker===speaker;focus.hidden=!active;if(active)visible=true;});
  this.speakerCards?.forEach((card,id)=>{const active=!paused&&id===speaker;card.classList.toggle('is-speaking',active);card.setAttribute('aria-current',active?'true':'false');card.querySelector('.vs-speaker-state').textContent=active?(visible?'Đang nói':'Đang nói · ngoài khung'):'Đang nghe';});
  if(this.speakerStatus)this.speakerStatus.textContent=paused?'Đã tạm dừng':speaker?'Đang nói: '+(this.manifest.speakers?.find(p=>p.id===speaker)?.label||speaker)+' · '+speaker+(visible?'':' · ngoài khung hình'):'Khoảng nghỉ giữa các lời thoại';
 }
 updateMentioned(utterance,paused){
  const line=utterance>=0?this.transcript.utterances[utterance]:null,key=this.sceneIndex+':'+(line?.id||'')+':'+paused;if(key===this.mentionedStateKey)return;this.mentionedStateKey=key;
  const scene=this.manifest.scenes[this.sceneIndex],active=new Set(!paused&&line?scene.hotspots.filter(spot=>spot.utteranceIds?.includes(line.id)).map(spot=>spot.id):[]);
  this.layers[this.activeLayer]?.querySelectorAll('.vs-hotspot').forEach(button=>{const mentioned=active.has(button.dataset.hotspotId);button.classList.toggle('is-mentioned',mentioned);button.dataset.mentioned=String(mentioned);});
 }
 attachTranscript(panel){if(this.panel!==panel){this.panel=panel;this.renderTranscript();}else if(!panel.querySelector('.vs-transcript-shell'))this.renderTranscript();}
 appendKeywordText(element,line,language='en'){
  const text=language==='vi'?line.vi:line.text,phrases=language==='vi'?(line.bilingualKeywords||[]).map(pair=>pair.vi):line.listeningKeywords||[];
  const ranges=[];for(const phrase of [...new Set(phrases)].sort((a,b)=>b.length-a.length)){let from=0,index;while(phrase&&(index=text.toLowerCase().indexOf(phrase.toLowerCase(),from))>=0){const end=index+phrase.length;if(!ranges.some(r=>index<r.end&&end>r.start))ranges.push({start:index,end});from=end;}}
  let offset=0;for(const range of ranges.sort((a,b)=>a.start-b.start)){element.append(document.createTextNode(text.slice(offset,range.start)),make('strong','vs-keyword',text.slice(range.start,range.end)));offset=range.end;}element.append(document.createTextNode(text.slice(offset)));
 }
 applySubtitleMode(){
  if(!this.list)return;this.list.dataset.subtitleBlur=this.subtitleBlur;this.list.classList.remove('vs-subtitles-revealed');
  this.list.querySelectorAll('.vs-line-vi').forEach(el=>el.hidden=!this.showVietnamese);
  if(this.revealSubtitles){this.revealSubtitles.hidden=this.subtitleBlur==='none';this.revealSubtitles.textContent='Xem tạm';this.revealSubtitles.setAttribute('aria-pressed','false');}
 }
 renderTranscript(){
  if(!this.panel)return;this.panel.replaceChildren();const shell=make('div','vs-transcript-shell');
  if(this.state==='ready'){
   const toolbar=make('div','vs-reading-tools');toolbar.append(make('h2','','Lời thoại'));const blurLabel=make('label','vs-blur-label','Che mờ');const blur=make('select','p3-select');blur.id='p3-subtitle-blur';blur.setAttribute('aria-label','Che mờ phụ đề');for(const [value,label] of [['none','Không che'],['en','Tiếng Anh'],['vi','Tiếng Việt'],['both','Cả hai']]){const option=make('option','',label);option.value=value;blur.append(option);}blur.value=this.subtitleBlur;blur.onchange=()=>{this.subtitleBlur=blur.value;if(['vi','both'].includes(this.subtitleBlur)){this.showVietnamese=true;subtitleToggle.checked=true;}try{localStorage.setItem('toeic-part3-subtitle-blur',this.subtitleBlur);localStorage.setItem('toeic-part3-show-vi',String(this.showVietnamese));}catch{}this.applySubtitleMode();};blurLabel.append(blur);toolbar.append(blurLabel);
   this.revealSubtitles=make('button','p3-tool vs-subtitle-reveal','Xem tạm');this.revealSubtitles.type='button';this.revealSubtitles.onclick=()=>{const revealed=this.list.classList.toggle('vs-subtitles-revealed');this.revealSubtitles.textContent=revealed?'Che lại':'Xem tạm';this.revealSubtitles.setAttribute('aria-pressed',String(revealed));};toolbar.append(this.revealSubtitles);shell.append(toolbar);
   this.list=make('div','vs-transcript-list');this.list.setAttribute('aria-label','Lời thoại đồng bộ với audio');this.lineButtons=this.transcript.utterances.map((line,i)=>{const b=make('button','vs-line');b.type='button';b.dataset.storyUtterance=i;b.setAttribute('aria-label','Nghe đoạn '+(i+1)+' của '+line.speaker);const text=make('span','vs-line-text'),english=make('span','vs-line-en');english.lang='en';this.appendKeywordText(english,line);text.append(english);if(line.vi){const vietnamese=make('span','vs-line-vi');vietnamese.lang='vi';this.appendKeywordText(vietnamese,line,'vi');text.append(vietnamese);}b.append(make('span','vs-line-speaker',line.speaker),text,make('span','vs-line-play','▶'));b.onclick=()=>this.options.playUtterance(i);this.list.append(b);return b;});shell.append(this.list);
   const controls=make('div','vs-reading-controls');const play=make('button','p3-primary','Nghe cả hội thoại');play.type='button';play.onclick=()=>this.options.playConversation();controls.append(play);
   const navigation=make('div','vs-utterance-navigation');this.previous=make('button','p3-tool','← Câu trước');this.previous.type='button';this.previous.onclick=()=>this.options.previousUtterance();this.next=make('button','p3-tool','Câu tiếp →');this.next.type='button';this.next.onclick=()=>this.options.nextUtterance();navigation.append(this.previous,this.next);controls.append(navigation);shell.append(controls);
   const settings=make('details','vs-study-settings');settings.append(make('summary','','Tùy chọn học & hướng dẫn'));
   const subtitleLabel=make('label','vs-subtitle-toggle');const subtitleToggle=make('input');subtitleToggle.type='checkbox';subtitleToggle.id='p3-show-vietnamese';subtitleToggle.checked=this.showVietnamese;subtitleToggle.onchange=()=>{this.showVietnamese=subtitleToggle.checked;try{localStorage.setItem('toeic-part3-show-vi',String(this.showVietnamese));}catch{}this.applySubtitleMode();};subtitleLabel.append(subtitleToggle,document.createTextNode(' Hiện phụ đề tiếng Việt'));settings.append(subtitleLabel);
   const repeat=make('label','vs-repeat-label');const input=make('input');input.type='checkbox';input.id='p3-repeat-sentence';input.checked=this.options.getRepeat?.()||false;repeat.append(input,document.createTextNode(' Lặp đoạn thoại được chọn'));settings.append(repeat,make('p','vs-transcript-note','Từ vàng: từ khóa tiếng Anh và nghĩa tiếng Việt tương ứng. Xem tạm sẽ được che lại khi sang câu mới.'),make('p','vs-transcript-note','Space: dừng/phát · ← / →: chuyển câu · −3s / +3s: tua audio'),make('p','vs-transcript-note','Audio ETS gốc · Từ khóa chưa có mốc đã xác minh chỉ hiện trong lời thoại. Lời chào và câu ngắn đi cùng ý tiếp theo.'));shell.append(settings);this.applySubtitleMode();
  }else{shell.append(make('p','p3-sub',this.state==='error'?'Bộ ảnh chưa tải được. Bài làm TOEIC vẫn có ở chế độ Nghe & trả lời.':'Đang chuẩn bị ảnh và hội thoại…'));}
  if(this.transcript?.translationSource?.note)shell.append(make('p','vs-transcript-note',this.transcript.translationSource.note));
  for(const note of [this.transcript?.source?.audioWordingNote,this.transcript?.source?.speakerLabelNote])if(note)shell.append(make('p','vs-transcript-note',note));this.panel.append(shell);this.lastUtterance=-1;
 }
 sync(sourceTime,paused){
  this.sourceTime=sourceTime;if(this.state!=='ready'||this.destroyed)return;this.updateKeywordClock(sourceTime,paused);
  let index=this.manifest.scenes.findIndex(scene=>sourceTime>=scene.start&&sourceTime<scene.end);
  if(index<0)index=sourceTime<this.manifest.scenes[0].start?0:this.manifest.scenes.length-1;
  if(index!==this.sceneIndex)this.changeScene(index);
  const scene=this.manifest.scenes[index],p=Math.max(0,Math.min(1,(sourceTime-scene.start)/(scene.end-scene.start))),from=scene.motion.from,to=scene.motion.to;
  const x=from.x+(to.x-from.x)*p,y=from.y+(to.y-from.y)*p,scale=from.scale+(to.scale-from.scale)*p;
  const frame=this.layers[this.activeLayer].querySelector('.vs-photo-frame');if(frame){const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;frame.style.transform=reduced?'none':`translate(${(.5-x)*100}%,${(.5-y)*100}%) scale(${scale})`;}
  let utterance=this.transcript.utterances.findIndex(line=>sourceTime>=line.start&&sourceTime<=line.end);
  if(utterance<0&&paused)utterance=this.transcript.utterances.findLastIndex(line=>line.start<=sourceTime);
  if(this.previous){const selected=Math.max(0,utterance);this.previous.disabled=selected===0;this.next.disabled=selected===this.transcript.utterances.length-1;}
  this.updateMentioned(utterance,paused);
  this.updateSpeaker(!paused&&utterance>=0?this.transcript.utterances[utterance].speaker:null,paused);
  if(utterance!==this.lastUtterance){if(utterance>=0&&this.list?.classList.contains('vs-subtitles-revealed'))this.applySubtitleMode();this.lastUtterance=utterance;this.lineButtons?.forEach((b,i)=>{b.classList.toggle('active',i===utterance);b.setAttribute('aria-current',i===utterance?'true':'false');});const row=this.lineButtons?.[utterance];if(row&&this.list&&this.list.clientHeight<this.list.scrollHeight){const top=row.getBoundingClientRect().top-this.list.getBoundingClientRect().top+this.list.scrollTop;if(top<this.list.scrollTop)this.list.scrollTop=top;else if(top+row.offsetHeight>this.list.scrollTop+this.list.clientHeight)this.list.scrollTop=top+row.offsetHeight-this.list.clientHeight;}}
 }
 changeScene(index){
  this.sceneIndex=index;const scene=this.manifest.scenes[index],next=1-this.activeLayer,layer=this.layers[next];layer.replaceChildren();const image=this.images.get(scene.imageId);
  const frame=make('div','vs-photo-frame');frame.dataset.imageId=scene.imageId;const img=make('img','vs-photo');img.src=image.url;img.alt=image.meta.alt;img.draggable=false;frame.append(img);
  (scene.characters||[]).forEach(person=>{const focus=make('div','vs-character-focus');focus.hidden=true;focus.dataset.characterSpeaker=person.speaker;Object.assign(focus.style,{left:person.x*100+'%',top:person.y*100+'%',width:person.width*100+'%',height:person.height*100+'%'});focus.append(make('span','vs-character-speaking','Đang nói · '+person.speaker));frame.append(focus);});
  this.speakerStateKey=null;this.mentionedStateKey=null;
  scene.hotspots.forEach((spot,i)=>{const b=make('button','vs-hotspot');b.type='button';b.dataset.hotspotId=spot.id;b.style.left=spot.x*100+'%';b.style.top=spot.y*100+'%';b.style.width=spot.width*100+'%';b.style.height=spot.height*100+'%';b.setAttribute('aria-label','Học từ: '+spot.label);b.setAttribute('aria-haspopup','dialog');b.append(make('span','vs-hotspot-number',String(i+1)),make('span','vs-hotspot-label',spot.label));b.onclick=()=>this.openVocabulary(spot.vocabularyId);frame.append(b);});
  layer.append(frame);this.activeLayer=next;this.resizeFrames();this.layers.forEach((l,i)=>{l.style.transitionDuration=scene.transition.duration+'s';l.classList.toggle('visible',i===next);l.setAttribute('aria-hidden',i===next?'false':'true');l.querySelectorAll('button').forEach(b=>b.tabIndex=i===next?0:-1);});
  this.counter.textContent=(index+1)+' / '+this.manifest.scenes.length;this.thumbnailButtons.forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});
 }
 resizeFrames(){if(!this.viewport?.clientWidth)return;const ratio=this.viewport.clientWidth/this.viewport.clientHeight;for(const frame of this.viewport.querySelectorAll('.vs-photo-frame')){const image=this.images.get(frame.dataset.imageId);if(!image)continue;const r=image.img.naturalWidth/image.img.naturalHeight;const width=r>ratio?100:r/ratio*100,height=r>ratio?ratio/r*100:100;Object.assign(frame.style,{width:width+'%',height:height+'%',left:(100-width)/2+'%',top:(100-height)/2+'%'});}}
 openVocabulary(id){
  const word=this.manifest.vocabulary.find(w=>w.id===id);if(!word)return;this.options.pause();this.cancelPronunciation();this.dialog.replaceChildren();const top=make('div','vs-word-heading');top.append(make('span','vs-word-tag','TỪ VỰNG TRONG CẢNH'));const close=make('button','vs-word-close','×');close.type='button';close.setAttribute('aria-label','Đóng từ vựng');close.onclick=()=>this.dialog.close();top.append(close);this.dialog.append(top,make('h2','',word.en),make('p','vs-word-meaning',word.vi));
  const pronounce=make('button','vs-word-pronounce','Nghe phát âm');pronounce.type='button';pronounce.onclick=()=>this.pronounce(word);const resume=make('button','vs-word-resume','Tiếp tục nghe');resume.type='button';resume.onclick=()=>{this.dialog.close();this.options.resume();};this.pronounceStatus=make('p','vs-word-status','');this.pronounceStatus.setAttribute('role','status');this.dialog.append(pronounce,resume,this.pronounceStatus);this.dialog.showModal();
 }
 pronounce(word){
  this.cancelPronunciation();const pronunciation=word.pronunciation;if(pronunciation.kind==='audio'){this.wordAudio=new Audio(new URL(pronunciation.src,this.base).href);this.wordAudio.play().catch(()=>{this.pronounceStatus.textContent='Chưa phát được bản thu từ vựng.';});return;}
  if(!('speechSynthesis' in window)){this.pronounceStatus.textContent='Trình duyệt chưa hỗ trợ giọng đọc từ vựng.';return;}
  const speech=new SpeechSynthesisUtterance(word.en);speech.lang=pronunciation.lang;speech.rate=.9;const voices=speechSynthesis.getVoices();const selected=document.querySelector('#voice-selector')?.value;const preferred=voices.find(v=>v.voiceURI===selected||v.name===selected)||voices.find(v=>v.lang===speech.lang)||voices.find(v=>/^en/i.test(v.lang));if(preferred)speech.voice=preferred;speech.onstart=()=>{this.pronounceStatus.textContent='Đang phát âm…';};speech.onend=()=>{this.pronounceStatus.textContent='Đã phát âm.';};speech.onerror=()=>{this.pronounceStatus.textContent='Chưa phát được giọng đọc. Bạn có thể bấm nghe lại.';};speechSynthesis.speak(speech);
 }
 cancelPronunciation(){if(this.wordAudio){this.wordAudio.pause();this.wordAudio=null;}if('speechSynthesis' in window)speechSynthesis.cancel();}
 destroy(){this.destroyed=true;if(this.keywordFrame)cancelAnimationFrame(this.keywordFrame);if(this.keywordDock){this.keywordDock.replaceChildren();this.keywordDock.hidden=true;}this.cancelPronunciation();this.observer?.disconnect();if(this.dialog?.open)this.dialog.close();this.dialog?.remove();this.container.replaceChildren();}
}
root.TOEICPhotoStoryPlayer=PhotoStoryPlayer;
})(window);
