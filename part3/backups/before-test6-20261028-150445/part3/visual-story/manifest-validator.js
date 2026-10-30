/* Preparation contract only. No renderer, image generation or live-page hook. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TOEICVisualStoryContract=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const finite=x=>typeof x==='number'&&Number.isFinite(x);
 const text=x=>typeof x==='string'&&x.trim().length>0;
 function inspectManifest(m,options={}){
  const errors=[],missing=[];
  if(!m||typeof m!=='object'||Array.isArray(m))return {ready:false,errors:['Manifest phải là object JSON.'],missing:[]};
  if(m.schemaVersion!==1)errors.push('schemaVersion phải bằng 1.');
  if(!/^t[1-5]-(?:32|35|38|41|44|47|50|53|56|59|62|65|68)$/.test(m.conversationId))errors.push('conversationId phải là một hội thoại ETS 2026 Test 1–5.');
  if(!['awaiting-assets','draft','ready'].includes(m.status))errors.push('Trạng thái manifest không hợp lệ.');
  if(!m.audio||!text(m.audio.src)||m.audio.timebase!=='source-seconds'||!finite(m.audio.dialogueStart)||!finite(m.audio.dialogueEnd)||m.audio.dialogueStart<0||m.audio.dialogueEnd<=m.audio.dialogueStart)errors.push('Cần đường dẫn audio và khoảng hội thoại theo giây audio gốc.');
  if(!text(m.transcriptSrc))errors.push('Thiếu transcriptSrc.');
  if(options.assetExists&&text(m.audio?.src)&&!options.assetExists(m.audio.src))errors.push('Không tìm thấy audio gốc.');if(options.assetExists&&text(m.transcriptSrc)&&!options.assetExists(m.transcriptSrc))errors.push('Không tìm thấy transcript.');
  const images=Array.isArray(m.images)?m.images:[],scenes=Array.isArray(m.scenes)?m.scenes:[],words=Array.isArray(m.vocabulary)?m.vocabulary:[];
  if(!Array.isArray(m.images)||!Array.isArray(m.scenes)||!Array.isArray(m.vocabulary))errors.push('images, scenes và vocabulary phải là array.');
  const imageIds=new Set(),wordIds=new Set(),sceneIds=new Set();
  for(const image of images){
   if(!image||typeof image!=='object'){errors.push('Ảnh phải là object.');continue;}
   if(!text(image.id)||imageIds.has(image.id))errors.push('ID ảnh thiếu hoặc trùng.');imageIds.add(image.id);
   if(image.mediaType!=='photograph'||!text(image.src)||!/\.(jpe?g|png|webp|avif)$/i.test(image.src)||!text(image.alt))errors.push('Ảnh phải là ảnh chụp có đường dẫn raster và mô tả alt; không dùng SVG/emoji.');
   if(options.assetExists&&text(image.src)&&!options.assetExists(image.src))errors.push('Không tìm thấy ảnh: '+image.src);
  }
  for(const word of words){
   if(!word||typeof word!=='object'){errors.push('Từ vựng phải là object.');continue;}
   if(!text(word.id)||wordIds.has(word.id)||!text(word.en)||!text(word.vi))errors.push('Từ vựng cần ID duy nhất, tiếng Anh và nghĩa tiếng Việt.');wordIds.add(word.id);
   const p=word.pronunciation;if(!p||!(p.kind==='tts'&&text(p.lang)||p.kind==='audio'&&text(p.src)))errors.push('Cần nguồn phát âm TTS hoặc file audio rõ ràng.');
   if(p?.kind==='audio'&&options.assetExists&&!options.assetExists(p.src))errors.push('Không tìm thấy audio phát âm: '+p.src);
  }
  const speakers=new Set();
  if(m.speakers!==undefined){if(!Array.isArray(m.speakers))errors.push('speakers phải là array.');else for(const person of m.speakers){if(!person||!text(person.id)||speakers.has(person.id)||!text(person.label)){errors.push('Nhân vật thiếu ID, nhãn hoặc trùng ID.');continue;}speakers.add(person.id);const p=person.portrait;if(p!==null&&(!p||!imageIds.has(p.imageId)||![p.x,p.y,p.width,p.height].every(finite)||p.x<0||p.y<0||p.width<=0||p.height<=0||p.x+p.width>1||p.y+p.height>1))errors.push('Vùng ảnh nhân vật không hợp lệ.');}}
  let previousEnd=null;
  for(const scene of scenes){
   if(!scene||typeof scene!=='object'){errors.push('Cảnh phải là object.');continue;}
   if(!text(scene.id)||sceneIds.has(scene.id))errors.push('ID cảnh thiếu hoặc trùng.');sceneIds.add(scene.id);
   if(!imageIds.has(scene.imageId))errors.push('Cảnh tham chiếu imageId chưa khai báo.');
   if(!finite(scene.start)||!finite(scene.end)||scene.end<=scene.start)errors.push('Mốc cảnh phải là số giây gốc và end > start.');
   if(finite(scene.start)&&finite(scene.end)){
    if(previousEnd!==null&&scene.start<previousEnd)errors.push('Các cảnh phải đúng thứ tự và không chồng mốc.');
    if(m.audio&&(scene.start<m.audio.dialogueStart||scene.end>m.audio.dialogueEnd))errors.push('Cảnh phải nằm trong phần hội thoại, không phủ lời đọc câu hỏi.');
    if(finite(options.duration)&&scene.end>options.duration)errors.push('Cảnh vượt thời lượng MP3.');previousEnd=scene.end;
   }
   if(scene.transition?.type!=='fade'||!finite(scene.transition.duration)||scene.transition.duration<0||scene.transition.duration>1.5)errors.push('Cần cấu hình fade trong khoảng 0–1.5 giây.');
   for(const point of [scene.motion?.from,scene.motion?.to])if(!point||!finite(point.x)||!finite(point.y)||point.x<0||point.x>1||point.y<0||point.y>1||!finite(point.scale)||point.scale<1||point.scale>1.15)errors.push('Pan/zoom phải dùng tọa độ chuẩn hóa và scale 1–1.15.');
   if(scene.characters!==undefined){if(!Array.isArray(scene.characters))errors.push('characters phải là array.');else for(const person of scene.characters){if(!speakers.has(person.speaker)||![person.x,person.y,person.width,person.height].every(finite)||person.x<0||person.y<0||person.width<=0||person.height<=0||person.x+person.width>1||person.y+person.height>1)errors.push('Vùng nhân vật không hợp lệ hoặc không có speaker.');}}
   if(!Array.isArray(scene.hotspots))errors.push('hotspots phải là array.');
   for(const spot of Array.isArray(scene.hotspots)?scene.hotspots:[]){
    if(!spot||typeof spot!=='object'){errors.push('Hotspot phải là object.');continue;}
    if(spot.utteranceIds!==undefined&&(!Array.isArray(spot.utteranceIds)||spot.utteranceIds.some(id=>!text(id))||new Set(spot.utteranceIds).size!==spot.utteranceIds.length))errors.push('utteranceIds cần là danh sách ID lời thoại duy nhất.');
    if(!wordIds.has(spot.vocabularyId)||!text(spot.label)||!text(spot.id))errors.push('Hotspot thiếu ID, nhãn hoặc từ vựng hợp lệ.');
    if(![spot.x,spot.y,spot.width,spot.height].every(finite)||spot.x<0||spot.y<0||spot.width<=0||spot.height<=0||spot.x+spot.width>1||spot.y+spot.height>1)errors.push('Hotspot phải nằm trọn trong ảnh, tọa độ 0–1.');
   }
  }
  if(images.length<4||images.length>5)missing.push('Bộ 4–5 ảnh chụp đã chốt.');
  if(scenes.length<4||scenes.length>5)missing.push('Bốn hoặc năm cảnh có mốc chuyển ảnh chính thức.');
  if(m.imagesApproved!==true)missing.push('Xác nhận bộ ảnh chính thức.');if(m.timingReviewed!==true)missing.push('Duyệt mốc chuyển cảnh theo audio gốc.');if(m.hotspotsReviewed!==true||!words.length||!scenes.some(s=>Array.isArray(s?.hotspots)&&s.hotspots.length>0))missing.push('Từ vựng, nghĩa, vị trí hotspot và nguồn phát âm đã chốt.');
  if(m.status==='ready'&&(missing.length||!m.enabled))errors.push('Không được bật ready khi chưa đủ dữ liệu hoặc enabled=false.');
  return {ready:m.status==='ready'&&m.enabled===true&&errors.length===0&&missing.length===0,errors,missing};
 }
 function getSceneAt(manifest,sourceTime){
  if(!inspectManifest(manifest).ready||!finite(sourceTime))return null;
  const found=manifest.scenes.find(s=>sourceTime>=s.start&&sourceTime<s.end);
  if(found)return found;const last=manifest.scenes.at(-1);return sourceTime===last?.end?last:null;
 }
 return {inspectManifest,getSceneAt};
});
