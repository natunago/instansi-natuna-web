const assessments = [
  {type:'utama',title:'Penilaian Kinerja PTSP dan PPB',agency:'Kementerian Investasi dan Hilirisasi/BKPM',description:'Penilaian khusus atas kinerja pelayanan terpadu satu pintu dan percepatan pelaksanaan berusaha pemerintah daerah.',portal:'https://penilaiankinerja.bkpm.go.id/',portalLabel:'Buka Penkin BKPM',focus:['Kelembagaan dan kewenangan PTSP','Pelaksanaan OSS serta layanan perizinan','Pengawasan, pengaduan, dan percepatan berusaha']},
  {type:'utama',title:'PEKPPP / Indeks Pelayanan Publik',agency:'Kementerian PANRB',description:'Pemantauan dan evaluasi kualitas penyelenggaraan pelayanan publik pada unit lokus yang ditetapkan.',portal:'https://pekppp.menpan.go.id/',portalLabel:'Buka PEKPPP',focus:['Kebijakan dan standar pelayanan','Profesionalisme SDM serta sarana-prasarana','SKM, FKP, pengaduan, inovasi, dan inklusivitas']},
  {type:'utama',title:'Evaluasi Penyelenggaraan MPP',agency:'Kementerian PANRB',description:'Evaluasi kualitas penyelenggaraan Mal Pelayanan Publik, integrasi tenant, aksesibilitas, dan pengalaman pengguna.',portal:'https://mpp.menpan.go.id/',portalLabel:'Buka Monev MPP',focus:['Kelembagaan dan integrasi layanan','Tenant, sarana, antrean, dan aksesibilitas','Pengaduan dan kepuasan pengguna MPP']},
  {type:'utama',title:'MCSP KPK',agency:'Komisi Pemberantasan Korupsi',description:'Pemantauan pencegahan korupsi pemerintah daerah. DPMPTSP mendukung area pelayanan publik dan perizinan.',portal:'https://jaga.id/',portalLabel:'Buka JAGA KPK',focus:['Transparansi perizinan dan pelayanan publik','Pengendalian gratifikasi dan benturan kepentingan','Bukti pelaksanaan yang dikoordinasikan Inspektorat']},
  {type:'utama',title:'Penilaian Maladministrasi Pelayanan Publik',agency:'Ombudsman Republik Indonesia',description:'Penilaian kepatuhan, kualitas layanan, persepsi pengguna, dan potensi maladministrasi pada penyelenggara pelayanan.',portal:'https://ombudsman.go.id/produk/listview?c=19&s=LP',portalLabel:'Lihat Hasil Ombudsman',focus:['Komponen standar pelayanan','Kompetensi petugas dan pengelolaan pengaduan','Persepsi pengguna serta tindak lanjut Ombudsman']},
  {type:'pendukung',title:'Survei Penilaian Integritas (SPI)',agency:'Komisi Pemberantasan Korupsi',description:'Survei integritas pemerintah daerah melalui responden pegawai, pengguna layanan, dan ahli.',portal:'https://spi.kpk.go.id/dashboard/hasil/history',portalLabel:'Buka Dashboard SPI',focus:['Kesiapan data populasi internal dan eksternal','Pengalaman pengguna layanan DPMPTSP','Tindak lanjut risiko integritas']},
  {type:'pendukung',title:'SKM / Indeks Kepuasan Masyarakat',agency:'DPMPTSP Kabupaten Natuna',description:'Pengukuran kepuasan masyarakat yang dilaksanakan dan dipublikasikan unit pelayanan secara berkala.',portal:'../#kinerja',portalLabel:'Lihat Statistik & SKM',focus:['Instrumen dan periode survei','Pengolahan nilai serta jumlah responden','Publikasi hasil dan rencana perbaikan']},
  {type:'pendukung',title:'KIPP / SINOVIK',agency:'Kementerian PANRB',description:'Kompetisi dan pengembangan inovasi pelayanan publik yang dapat diikuti oleh inovasi unggulan DPMPTSP.',portal:'https://sinovik.menpan.go.id/',portalLabel:'Buka SINOVIK',focus:['Kebaruan dan efektivitas inovasi','Dampak, replikasi, dan keberlanjutan','Proposal, bukti, serta dokumentasi inovasi']},
  {type:'pendukung',title:'Indeks Inovasi Daerah / IGA',agency:'BSKDN Kementerian Dalam Negeri',description:'Pengukuran inovasi pemerintah daerah. Data inovasi DPMPTSP disampaikan melalui admin pemerintah kabupaten.',portal:'https://indeks.inovasi.bskdn.kemendagri.go.id/login',portalLabel:'Buka Portal IID',focus:['Profil dan kematangan inovasi','Dokumen indikator serta bukti penerapan','Koordinasi dengan Bapperida/admin Pemkab']},
  {type:'pendukung',title:'Penilaian Pendukung Pemkab',agency:'Bagian Organisasi, Inspektorat, Bapperida, Diskominfo, dan PPID Utama',description:'Kontribusi DPMPTSP pada SAKIP, Reformasi Birokrasi, SPBE, dan keterbukaan informasi pemerintah daerah.',portal:'',portalLabel:'',focus:['IKU, LKjIP, dan tindak lanjut kinerja','Layanan digital dan dukungan SPBE','Dokumen keterbukaan informasi melalui PPID Utama']}
].map(item=>({...item,status:'Perlu konfirmasi',pic:'Belum ditetapkan',schedule:'Mengikuti surat resmi',score:'Belum dicatat'}));

const grid=document.querySelector('#assessmentGrid');
const search=document.querySelector('#searchInput');
const typeFilter=document.querySelector('#typeFilter');
const statusFilter=document.querySelector('#statusFilter');
const count=document.querySelector('#resultCount');
const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu-toggle');

function escapeHtml(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}

function render(){
  const query=search.value.trim().toLowerCase();
  const selectedType=typeFilter.value;
  const selectedStatus=statusFilter.value;
  const filtered=assessments.filter(item=>{
    const searchable=`${item.title} ${item.agency} ${item.description} ${item.focus.join(' ')}`.toLowerCase();
    return (!query||searchable.includes(query))&&(selectedType==='all'||item.type===selectedType)&&(selectedStatus==='all'||item.status===selectedStatus);
  });
  count.textContent=`Menampilkan ${filtered.length} dari ${assessments.length} agenda penilaian.`;
  if(!filtered.length){grid.innerHTML='<div class="empty-filter">Tidak ada penilaian yang cocok dengan pencarian atau filter.</div>';return;}
  grid.innerHTML=filtered.map(item=>`<article class="assessment-card">
    <div class="card-topline"><span class="type-badge">${item.type==='utama'?'Penilaian utama':'Pendukung'}</span><span class="status-badge">${escapeHtml(item.status)}</span></div>
    <h3>${escapeHtml(item.title)}</h3><p class="agency">${escapeHtml(item.agency)}</p><p class="description">${escapeHtml(item.description)}</p>
    <div class="meta-grid"><div><span>PIC</span><strong>${escapeHtml(item.pic)}</strong></div><div><span>Jadwal</span><strong>${escapeHtml(item.schedule)}</strong></div><div><span>Nilai terakhir</span><strong>${escapeHtml(item.score)}</strong></div><div><span>Status</span><strong>${escapeHtml(item.status)}</strong></div></div>
    <details><summary>Fokus dan bukti awal</summary><ul>${item.focus.map(f=>`<li>${escapeHtml(f)}</li>`).join('')}</ul></details>
    <div class="card-actions">${item.portal?`<a class="portal-button" href="${escapeHtml(item.portal)}" ${item.portal.startsWith('http')?'target="_blank" rel="noopener"':''}>${escapeHtml(item.portalLabel)} ↗</a>`:'<span class="disabled-button">Koordinasi PIC Pemkab</span>'}</div>
  </article>`).join('');
}

[search,typeFilter,statusFilter].forEach(control=>control.addEventListener(control===search?'input':'change',render));

menuButton.addEventListener('click',()=>{const open=header.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.site-header nav a').forEach(link=>link.addEventListener('click',()=>{header.classList.remove('open');menuButton.setAttribute('aria-expanded','false');}));

document.querySelector('#downloadCsv').addEventListener('click',()=>{
  const rows=[['Kelompok','Penilaian','Penyelenggara','PIC','Jadwal','Status','Nilai terakhir','Portal'],...assessments.map(item=>[item.type,item.title,item.agency,item.pic,item.schedule,item.status,item.score,item.portal||'Koordinasi PIC Pemkab'])];
  const csv='\uFEFF'+rows.map(row=>row.map(value=>`"${String(value).replaceAll('"','""')}"`).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download=`daftar-penilaian-dpmptsp-natuna-${new Date().getFullYear()}.csv`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

document.querySelector('#totalCount').textContent=assessments.length;
document.querySelector('#portalCount').textContent=assessments.filter(item=>item.portal).length;
document.querySelector('#picCount').textContent=assessments.filter(item=>item.pic==='Belum ditetapkan').length;
document.querySelector('#scheduleCount').textContent=assessments.filter(item=>item.schedule==='Mengikuti surat resmi').length;
document.querySelector('#year').textContent=new Date().getFullYear();
render();
