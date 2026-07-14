const cfg = window.MYPROMPT_CONFIG || {};
const configured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes('PASTE_') && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.includes('PASTE_');
const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

const defaults = [
 {title:'產品融入場景',category:'修圖',description:'將產品自然合成到指定背景，統一透視、光影與反射。',tags:['場景融合','商品攝影','光影'],favorite:true,prompt:'對產品圖像進行精細化後期處理。首先精準去除產品的背景，確保產品輪廓完整、細節無損，同時完整保留背景的原始色調。修正畫面中任何不自然的重疊關係與視覺接縫，使產品與背景的銜接乾淨俐落。統一產品與場景的光影邏輯，為產品賦予與環境光一致的自然照明，使其色調、亮度與飽和度與背景完美匹配。在產品與地板的接觸面，呈現真實且柔和的投射陰影。最終實現產品與場景在透視關係、光線方向及反射映射上的完整物理融合，達到商業級攝影作品的呈現標準。'},
 {title:'模糊圖片高清',category:'修圖',description:'提升清晰度、細節與動態範圍，同時保持原圖不變形。',tags:['高清','4K','修復'],favorite:false,prompt:'基於提供的參考圖片進行嚴格的超高解析度 4K 增強。必須絕對忠實於原始面部結構、比例與身份特徵。在表情、視線、姿勢、相機角度、畫面構圖及透視關係上保持零偏差。服裝、頭髮、皮膚以及背景元素的結構、位置與設計必須完全保持不變。恢復微觀層級細節，呈現自然寫實效果。增強毛孔、細紋、髮絲、睫毛、織物紋理、縫線以及材質邊緣，但不得加入任何風格化處理。色彩科學、白平衡以及整體色調關係必須與原圖完全一致。光線方向、光線強度、對比度及明暗表現必須精確匹配原始圖片，只允許提升清晰度與擴展動態範圍。禁止重新布光。禁止改變物體形狀。'},
 {title:'精修產品',category:'電商',description:'商業級產品精修，適合電商主圖與商品頁。',tags:['產品精修','白底圖','電商'],favorite:true,prompt:'對產品進行高精度商業級精修處理。產品置於純白背景上，採用正視圖、水平方向視角進行 3D 渲染表現。精準還原產品原始色彩及包裝材質：玻璃部分呈現晶瑩通透質感；塑膠部分保留柔和霧面效果；金屬部件呈現細膩光澤與反射。重點強化產品高光反射與陰影層次，使光影立體感更加鮮明。徹底清除表面的指紋、灰塵與細微瑕疵，讓產品保持全新狀態。瓶身標籤與所有文字資訊保持極致銳利清晰。整體光線柔和均勻，突顯產品精緻感與高級質感。最終成品符合高品質電商主圖的商業視覺標準。'},
 {title:'圖片變手繪線稿',category:'風格',description:'將產品轉為工業設計黑白線稿與藍圖風格。',tags:['手繪','線稿','工業設計'],favorite:false,prompt:'智慧提取目標物體的空間透視與三維輪廓。一鍵轉換為具有工業設計美感的黑白概念線稿。精準勾勒空氣動力學邊緣、機械傳動部件及裝配接縫。背景自動生成專業流體力學輔助線、透視網格及尺寸標註排版。採用精準的馬克筆筆觸與細緻灰階排線表現截面體積。呈現頂級工業設計師手繪藍圖質感。圖片比例保持 3:4，不變形。輸出解析度 2K。'},
 {title:'移除物品',category:'修圖',description:'完整移除指定物品，並自然修補背景與材質。',tags:['移除','修補','背景'],favorite:false,prompt:'移除圖片中的指定產品，以及其陰影、反光與所有相關投影。產品原本所在位置依照周圍環境自然填補，例如延伸背景圖案、延續材質紋理或還原原始表面。不得留下任何刪除痕跡。畫面中其他所有元素的位置、形狀、色彩與細節必須保持 100% 不變。'},
 {title:'增加光效',category:'光影特效',description:'加入科技感霓虹燈光、粒子與高速動態效果。',tags:['霓虹','粒子','科技感'],favorite:true,prompt:'嚴格保持主體外輪廓不變。將背景調整為深色氛圍。把產品外殼轉換為半透明黑透材質，清楚展現內部精密散熱銅管與電路結構。於渦輪吸入口核心注入充滿能量感的霓虹雙色動態光效，例如電光藍搭配核心橘。在風扇周圍生成符合空氣動力學的懸浮發光粒子與高速旋轉光暈拖尾。整體呈現強烈科技感、未來感與高性能硬派競技風格。圖片比例維持 3:4。輸出解析度 2K。'}
];

let user=null,prompts=[],filter='all',editingId=null,viewingId=null;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1500)}
function showAuth(msg=''){ $('#loading').classList.add('hidden');$('#appView').classList.add('hidden');$('#authView').classList.remove('hidden');$('#authMessage').textContent=msg; }
function showApp(){ $('#loading').classList.add('hidden');$('#authView').classList.add('hidden');$('#appView').classList.remove('hidden'); }
function modal(id,on=true){$('#'+id).classList.toggle('hidden',!on);document.body.style.overflow=on?'hidden':''}
$$('[data-close]').forEach(b=>b.onclick=()=>modal(b.dataset.close,false));$$('.modal').forEach(m=>m.onclick=e=>{if(e.target===m)modal(m.id,false)});

async function init(){
 if(!configured){showAuth('尚未設定 Supabase。請先依照 SETUP.md 填入 config.js。');return;}
 const {data:{session}}=await sb.auth.getSession(); user=session?.user||null;
 sb.auth.onAuthStateChange(async(_,session)=>{user=session?.user||null;if(user){showApp();await loadPrompts()}else showAuth()});
 if(user){showApp();await loadPrompts()}else showAuth();
}

$('#loginBtn').onclick=async()=>{const email=$('#authEmail').value.trim(),password=$('#authPassword').value;const {error}=await sb.auth.signInWithPassword({email,password});$('#authMessage').textContent=error?error.message:''};
$('#signupBtn').onclick=async()=>{const email=$('#authEmail').value.trim(),password=$('#authPassword').value;const {error}=await sb.auth.signUp({email,password});$('#authMessage').textContent=error?error.message:'帳號已建立。若啟用 Email 驗證，請先到信箱確認。'};
$('#logoutBtn').onclick=()=>sb.auth.signOut();

async function loadPrompts(){
 const {data,error}=await sb.from('prompts').select('*').order('updated_at',{ascending:false});
 if(error){toast(error.message);return}
 prompts=data||[];
 if(prompts.length===0){const rows=defaults.map(x=>({...x,user_id:user.id}));const r=await sb.from('prompts').insert(rows).select();if(!r.error)prompts=r.data||[]}
 render();
}
function cats(){return [...new Set(prompts.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hant'))}
function visible(){let a=[...prompts];if(filter==='favorites')a=a.filter(p=>p.favorite);else if(filter.startsWith('cat:'))a=a.filter(p=>p.category===filter.slice(4));const q=$('#searchInput').value.trim().toLowerCase();if(q)a=a.filter(p=>[p.title,p.category,p.description,p.prompt,(p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q));return a}
function renderNav(){
 $('#countAll').textContent=prompts.length;$('#countFav').textContent=prompts.filter(p=>p.favorite).length;
 $('#categoryNav').innerHTML=cats().map(c=>`<button class="nav" data-filter="cat:${esc(c)}"><span>📁 ${esc(c)}</span><b>${prompts.filter(p=>p.category===c).length}</b></button>`).join('');
 $$('.nav').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('.nav').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
}
function render(){renderNav();const a=visible();$('#sectionTitle').textContent=filter==='all'?'全部提示詞':filter==='favorites'?'我的收藏':filter.slice(4);$('#resultCount').textContent=`${a.length} 筆`;$('#promptGrid').innerHTML=a.length?a.map(p=>`<article class="card"><div class="card-top"><span class="cat">${esc(p.category)}</span><button class="star" onclick="toggleFavorite('${p.id}')">${p.favorite?'★':'☆'}</button></div><h4>${esc(p.title)}</h4><p>${esc(p.description)}</p><div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="card-actions"><button class="ghost" onclick="openViewer('${p.id}')">查看</button><button class="primary" onclick="copyPrompt('${p.id}')">複製</button></div></article>`).join(''):'<div class="empty">找不到符合條件的提示詞。</div>'}
window.toggleFavorite=async id=>{const p=prompts.find(x=>x.id===id);const {error}=await sb.from('prompts').update({favorite:!p.favorite}).eq('id',id);if(!error){p.favorite=!p.favorite;render()}};
window.copyPrompt=async id=>{const p=prompts.find(x=>x.id===id);await navigator.clipboard.writeText(p.prompt);toast('已複製提示詞')};
window.openViewer=id=>{const p=prompts.find(x=>x.id===id);viewingId=id;$('#viewerTitle').textContent=p.title;$('#viewerMeta').textContent=`${p.category} · ${(p.tags||[]).join('、')}`;$('#viewerText').textContent=p.prompt;modal('viewerModal')};
$('#viewerCopy').onclick=()=>copyPrompt(viewingId);$('#viewerEdit').onclick=()=>{modal('viewerModal',false);openEditor(viewingId)};
function openEditor(id=null){editingId=id;const p=id?prompts.find(x=>x.id===id):null;$('#editorTitle').textContent=p?'編輯 Prompt':'新增 Prompt';$('#fTitle').value=p?.title||'';$('#fCategory').value=p?.category||'';$('#fDescription').value=p?.description||'';$('#fTags').value=(p?.tags||[]).join(', ');$('#fPrompt').value=p?.prompt||'';$('#deleteBtn').classList.toggle('hidden',!p);modal('editorModal')}
$('#addBtn').onclick=()=>openEditor();
$('#saveBtn').onclick=async()=>{const row={title:$('#fTitle').value.trim(),category:$('#fCategory').value.trim(),description:$('#fDescription').value.trim(),tags:$('#fTags').value.split(/[,，]/).map(x=>x.trim()).filter(Boolean),prompt:$('#fPrompt').value.trim()};if(!row.title||!row.category||!row.prompt){toast('請填寫標題、分類與 Prompt');return}let r;if(editingId)r=await sb.from('prompts').update(row).eq('id',editingId);else r=await sb.from('prompts').insert({...row,user_id:user.id});if(r.error){toast(r.error.message);return}modal('editorModal',false);await loadPrompts();toast(editingId?'已更新':'已新增')};
$('#deleteBtn').onclick=async()=>{if(!editingId||!confirm('確定刪除這個 Prompt？'))return;const {error}=await sb.from('prompts').delete().eq('id',editingId);if(!error){modal('editorModal',false);await loadPrompts();toast('已刪除')}};
$('#searchInput').oninput=render;
$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('myprompt_theme',document.body.classList.contains('dark')?'dark':'light')};if(localStorage.getItem('myprompt_theme')==='dark')document.body.classList.add('dark');
$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(prompts.map(({user_id,...x})=>x),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='myprompt-backup.json';a.click();URL.revokeObjectURL(a.href)};
$('#importFile').onchange=async e=>{try{const raw=JSON.parse(await e.target.files[0].text());if(!Array.isArray(raw))throw new Error();const rows=raw.map(({id,created_at,updated_at,user_id,...x})=>({...x,user_id:user.id}));const {error}=await sb.from('prompts').insert(rows);if(error)throw error;await loadPrompts();toast('匯入完成')}catch(err){toast('匯入失敗：'+err.message)}e.target.value=''};
init();
