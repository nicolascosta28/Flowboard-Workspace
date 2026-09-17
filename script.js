const KEY='flowboard_v2_tasks';
const demo=[
{id:1,title:'Finalizar portfólio',description:'Revisar projetos e atualizar os links de demonstração.',status:'todo',priority:'alta',due:'2026-09-22'},
{id:2,title:'Estudar JavaScript',description:'Praticar manipulação do DOM e eventos.',status:'doing',priority:'media',due:'2026-09-20'},
{id:3,title:'Publicar Data Pulse',description:'Subir o dashboard no GitHub Pages.',status:'done',priority:'alta',due:'2026-09-17'},
{id:4,title:'Organizar README',description:'Documentar funcionalidades e aprendizados.',status:'todo',priority:'baixa',due:''}
];
let tasks=JSON.parse(localStorage.getItem(KEY)||'null')||structuredClone(demo);
let priorityFilter='all', query='';
const names={todo:'A FAZER',doing:'EM ANDAMENTO',done:'CONCLUÍDAS'};
const $=id=>document.getElementById(id);
function persist(){localStorage.setItem(KEY,JSON.stringify(tasks))}
function esc(s=''){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function visible(t){return(priorityFilter==='all'||t.priority===priorityFilter)&&(!query||(`${t.title} ${t.description}`).toLowerCase().includes(query))}
function render(){
 const filtered=tasks.filter(visible);
 $('board').innerHTML=['todo','doing','done'].map(s=>{
  const list=filtered.filter(t=>t.status===s);
  return `<section class="column"><div class="column-head"><b>${names[s]}</b><span>${list.length.toString().padStart(2,'0')}</span></div><div class="cards">${list.length?list.map(card).join(''):'<div class="empty">NENHUMA TAREFA</div>'}</div></section>`
 }).join('');
 document.querySelectorAll('.card-menu').forEach(b=>b.onclick=()=>openEdit(+b.dataset.id));
 document.querySelectorAll('.move button').forEach(b=>b.onclick=()=>move(+b.dataset.id,b.dataset.dir));
 stats();
}
function card(t){
 const idx=['todo','doing','done'].indexOf(t.status);
 return `<article class="card"><div class="card-top"><span class="priority ${t.priority}">${t.priority.toUpperCase()}</span><button class="card-menu" data-id="${t.id}" title="Editar">•••</button></div><h3>${esc(t.title)}</h3><p>${esc(t.description||'Sem descrição.')}</p><div class="meta"><span>${t.due?'PRAZO '+new Date(t.due+'T12:00:00').toLocaleDateString('pt-BR'):'SEM PRAZO'}</span><span>#${String(t.id).slice(-4)}</span></div><div class="move"><button data-id="${t.id}" data-dir="-1" ${idx===0?'disabled':''}>← VOLTAR</button><button data-id="${t.id}" data-dir="1" ${idx===2?'disabled':''}>AVANÇAR →</button></div></article>`
}
function stats(){
 const done=tasks.filter(t=>t.status==='done').length, doing=tasks.filter(t=>t.status==='doing').length, p=tasks.length?Math.round(done/tasks.length*100):0;
 $('statTotal').textContent=tasks.length;$('statDoing').textContent=doing;$('statDone').textContent=done;$('statProgress').textContent=p+'%';$('progressBar').style.width=p+'%';
}
function move(id,dir){const t=tasks.find(x=>x.id===id),arr=['todo','doing','done'],i=arr.indexOf(t.status);t.status=arr[Math.max(0,Math.min(2,i+Number(dir)))];persist();render()}
function openNew(){$('taskForm').reset();$('taskId').value='';$('priority').value='media';$('status').value='todo';$('modalMode').textContent='NOVA TAREFA';$('modalTitle').textContent='Criar tarefa';$('deleteTask').classList.add('hidden');$('taskModal').showModal()}
function openEdit(id){const t=tasks.find(x=>x.id===id);$('taskId').value=id;$('title').value=t.title;$('description').value=t.description;$('status').value=t.status;$('priority').value=t.priority;$('due').value=t.due||'';$('modalMode').textContent='EDITAR TAREFA';$('modalTitle').textContent=t.title;$('deleteTask').classList.remove('hidden');$('taskModal').showModal()}
$('taskForm').onsubmit=e=>{e.preventDefault();const id=+$('taskId').value,obj={title:$('title').value.trim(),description:$('description').value.trim(),status:$('status').value,priority:$('priority').value,due:$('due').value};if(id){Object.assign(tasks.find(x=>x.id===id),obj)}else tasks.push({id:Date.now(),...obj});persist();$('taskModal').close();render()}
$('deleteTask').onclick=()=>{const id=+$('taskId').value;if(id&&confirm('Excluir esta tarefa?')){tasks=tasks.filter(x=>x.id!==id);persist();$('taskModal').close();render()}}
$('newTask').onclick=openNew;$('closeModal').onclick=()=>$('taskModal').close();$('cancel').onclick=()=>$('taskModal').close();
$('search').oninput=e=>{query=e.target.value.toLowerCase().trim();render()}
document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{priorityFilter=b.dataset.priority;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));render()})
$('reset').onclick=()=>{if(confirm('Restaurar as tarefas demonstrativas?')){tasks=structuredClone(demo);persist();render()}}
render();