/* Optional file:// adapter preparation. scenes.json is the source of truth. */
const fs=require('fs'),path=require('path');
const {inspectManifest}=require('./manifest-validator.js');
const base=path.join(__dirname,'t1-32'),source=path.join(base,'scenes.json');
const manifest=JSON.parse(fs.readFileSync(source,'utf8').replace(/^\uFEFF/,''));
const report=inspectManifest(manifest,{assetExists:src=>fs.existsSync(path.resolve(base,src))});
console.log(JSON.stringify(report,null,2));
if(report.errors.length)process.exit(1);
if(process.argv.includes('--check'))process.exit(0);
if(!report.ready){console.error('Chưa tạo bundle: manifest chưa đủ ảnh/cảnh đã duyệt.');process.exit(3);}
const output='window.TOEIC_VISUAL_STORY_MANIFESTS = '+JSON.stringify({[manifest.conversationId]:manifest})+';\n';
fs.writeFileSync(path.join(base,'scenes.bundle.js'),output,'utf8');
console.log('Đã tạo scenes.bundle.js từ scenes.json đã duyệt.');
