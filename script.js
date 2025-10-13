let articles=[];let visibleCount=12;const whatsappEncoded="aHR0cHM6Ly93YS5tZS8yMjg5MTI2OTcxNg==";function getWhatsAppLink(articleTitle){const base=atob(whatsappEncoded);const message=`?text=Bonjour, je veux commander ${encodeURIComponent(articleTitle)}`;return base+message}
fetch("x7g3.json").then(res=>res.json()).then(data=>{articles=data;renderArticles();afficherArticlesFiltres(articles)}).catch(err=>{console.error("Erreur de chargement des articles :",err);const alertBox=document.getElementById("alert-container");alertBox.classList.remove("d-none")});document.getElementById("search-input").addEventListener("input",filtrerEtTrierArticles);document.getElementById("tri-select").addEventListener("change",filtrerEtTrierArticles);function getStatusLabel(status){if(status==="neuf")return"🟢 Neuf";if(status==="occasion")return"🟡 Occasion";if(status==="rupture")return"🔴 Rupture";return""}
function createArticleCard(article,index){const status=article.stock===0?"rupture":(article.etat||"");const card=document.createElement("div");card.className="col";const isPromo=article.promo===!0;const isNouveau=article.nouveau===!0;const cardInner=document.createElement("div");cardInner.className="card h-100"+(status==="rupture"?" rupture":"")+(isPromo?" promo":"")+(isNouveau?" nouveau":"");cardInner.innerHTML=`
  ${status ? `<div class="badge-status ${status}">${getStatusLabel(status)}</div>` : ""}
  ${isPromo ? `<div class="badge-promo">🔥 PROMO</div>` : ""}
  ${isNouveau ? `<div class="badge-nouveau">🆕 NOUVEAU</div>` : ""}
  <div id="carousel${index}" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="${article.images[0]}" class="d-block w-100" alt="${article.title}" onclick='openLightbox(${JSON.stringify(article.images)}, ${JSON.stringify(article)})'>
      </div>
      <div class="carousel-item">
        <img src="${article.images[1]}" class="d-block w-100" alt="${article.title}" onclick='openLightbox(${JSON.stringify(article.images)}, ${JSON.stringify(article)})'>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carousel${index}" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carousel${index}" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>
  <div class="card-body">
    <h5 class="card-title">${article.title}</h5>
    <p class="card-text">${article.desc}</p>
   ${isPromo && article.originalPrice
  ? `<p class="fw-bold"><span class="text-decoration-line-through text-muted me-2">${article.originalPrice}</span><span class="text-danger">${article.price}</span></p>`
  : `<p class="fw-bold">${article.price}</p>`}

${article.stock > 0 
  ? `<button onclick="ajouterAuPanier('${article.title}')" class="btn btn-outline-warning w-100 mb-2">🛒 Ajouter au panier</button><a href="${getWhatsAppLink(article.title)}" target="_blank" class="btn btn-success w-100">Commander</a><button onclick="partagerArticle('${article.title}')" class="btn btn-outline-info w-100 mt-2">📤 Partager</button>`
  : `<div class="btn btn-secondary w-100 disabled">Indisponible</div><div class="stock-message">🕒 Bientôt disponible/Réapprovisionnement en cours</div>`}


  </div>
`;const favBtn=document.createElement("button");favBtn.className="fav-btn";const favoris=JSON.parse(localStorage.getItem("favoris")||"[]");const estFavori=favoris.includes(article.title);favBtn.innerText=estFavori?"💔 Retirer":"❤️ Favori";favBtn.onclick=()=>{toggleFavori(article.title);favBtn.innerText=favBtn.innerText==="❤️ Favori"?"💔 Retirer":"❤️ Favori"};cardInner.appendChild(favBtn);const boutonFormulaire=document.createElement("a");boutonFormulaire.href=`commande.html?article=${encodeURIComponent(article.title)}&prix=${encodeURIComponent(article.price)}`;boutonFormulaire.className="btn btn-outline-light me-2";boutonFormulaire.innerText="📝 Formulaire";cardInner.appendChild(boutonFormulaire);card.appendChild(cardInner);return card}
function renderArticles(){const container=document.getElementById("article-container");container.innerHTML="";const triStock=(a,b)=>{if(a.stock===0&&b.stock>0)return 1;if(b.stock===0&&a.stock>0)return-1;return 0};const triés=[...articles].sort(triStock);for(let i=0;i<visibleCount&&i<triés.length;i++){container.appendChild(createArticleCard(triés[i],i+1))}}
function loadMore(){visibleCount+=4;renderArticles()}
function afficherArticlesFiltres(articles){const nouveauxContainer=document.getElementById("nouveaux-container");const promosContainer=document.getElementById("promos-container");const triStock=(a,b)=>{if(a.stock===0&&b.stock>0)return 1;if(b.stock===0&&a.stock>0)return-1;return 0};const nouveaux=articles.filter(a=>a.nouveau===!0).sort(triStock);const promos=articles.filter(a=>a.promo===!0).sort(triStock);nouveauxContainer.innerHTML="";promosContainer.innerHTML="";nouveaux.forEach((article,index)=>{const card=createArticleCard(article,index+100);nouveauxContainer.appendChild(card)});promos.forEach((article,index)=>{const card=createArticleCard(article,index+200);promosContainer.appendChild(card)})}
function openLightbox(images,article){const lightbox=document.getElementById("lightbox");const lightboxImg=document.getElementById("lightbox-img");const lightboxTitle=document.getElementById("lightbox-title");const lightboxPrice=document.getElementById("lightbox-price");const lightboxBadge=document.getElementById("lightbox-badge");let currentIndex=0;function updateLightbox(){lightboxImg.src=images[currentIndex];lightboxTitle.textContent=article.title;lightboxPrice.textContent=article.price;lightboxBadge.textContent=getStatusLabel(article.etat);lightboxBadge.className="badge-status "+article.etat}
document.getElementById("lightbox-prev").onclick=()=>{currentIndex=(currentIndex-1+images.length)%images.length;updateLightbox()};document.getElementById("lightbox-next").onclick=()=>{currentIndex=(currentIndex+1)%images.length;updateLightbox()};updateLightbox();lightbox.style.display="flex"}
function closeLightbox(){const lightbox=document.getElementById("lightbox");lightbox.style.display="none"}
function toggleServices(event){event.preventDefault();const section=document.getElementById("services");section.style.display=(section.style.display==="none"||section.style.display==="")?"block":"none"}
const canvas=document.getElementById("stars-canvas");const ctx=canvas.getContext("2d");let stars=[];function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight}
resizeCanvas();window.addEventListener("resize",resizeCanvas);function createStars(count){stars=[];for(let i=0;i<count;i++){stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:Math.random()*1.5+0.5,speed:Math.random()*0.5+0.2})}}
createStars(150);function animateStars(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#00ffea";for(let star of stars){ctx.beginPath();ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);ctx.fill();star.y+=star.speed;if(star.y>canvas.height){star.y=0;star.x=Math.random()*canvas.width}}
requestAnimationFrame(animateStars)}
animateStars();renderArticles();function filtrerEtTrierArticles(){const query=document.getElementById("search-input").value.toLowerCase();const tri=document.getElementById("tri-select").value;let resultats=articles.filter(article=>article.title.toLowerCase().includes(query)||article.desc.toLowerCase().includes(query));if(tri==="prix-asc"){resultats.sort((a,b)=>parseFloat(a.price)-parseFloat(b.price))}else if(tri==="prix-desc"){resultats.sort((a,b)=>parseFloat(b.price)-parseFloat(a.price))}else if(tri==="etat-neuf"){resultats=resultats.filter(a=>a.etat==="neuf")}else if(tri==="etat-occasion"){resultats=resultats.filter(a=>a.etat==="occasion")}else if(tri==="etat-rupture"){resultats=resultats.filter(a=>a.stock===0)}else if(tri==="nouveaux"){resultats=resultats.filter(a=>a.nouveau===!0)}
resultats.sort((a,b)=>{if(a.stock===0&&b.stock>0)return 1;if(b.stock===0&&a.stock>0)return-1;return 0});document.getElementById("result-count").innerText=`${resultats.length} article(s) trouvé(s)`;const container=document.getElementById("article-container");container.innerHTML="";resultats.forEach((article,i)=>{container.appendChild(createArticleCard(article,i+1))})}
afficherArticlesFiltres(articles);function ajouterAuPanier(titre){let panier=JSON.parse(localStorage.getItem("panier"))||[];if(!panier.includes(titre)){panier.push(titre);localStorage.setItem("panier",JSON.stringify(panier));alert(`✅ "${titre}" ajouté au panier`)}else{alert(`ℹ️ "${titre}" est déjà dans le panier`)}}
function afficherPanier(){const panier=JSON.parse(localStorage.getItem("panier"))||[];const container=document.getElementById("panier-container");const list=document.getElementById("panier-list");const whatsapp=document.getElementById("panier-whatsapp");if(panier.length===0){alert("🛒 Ton panier est vide");return}
list.innerHTML="";panier.forEach(item=>{const li=document.createElement("li");li.className="list-group-item";li.textContent=item;list.appendChild(li)});const base=atob(whatsappEncoded);const message=`?text=Bonjour, je veux commander : ${encodeURIComponent(panier.join(", "))}`;whatsapp.href=base+message;container.classList.remove("d-none")}
function viderPanier(){if(confirm("❌ Tu veux vraiment vider ton panier ?")){localStorage.removeItem("panier");document.getElementById("panier-container").classList.add("d-none");alert("🧹 Panier vidé !")}}
function toggleGlitchMode(){const body=document.body;body.classList.toggle("glitch-mode");const isActive=body.classList.contains("glitch-mode");localStorage.setItem("glitchMode",isActive?"on":"off")}
window.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem("glitchMode")==="on"){document.body.classList.add("glitch-mode")}});function partagerArticle(titre){const url=window.location.href;const message=`Regarde cet article sur ADAGAMING : ${titre}`;if(navigator.share){navigator.share({title:titre,text:message,url:url}).then(()=>{console.log("✅ Article partagé !")}).catch((err)=>{console.error("Erreur de partage :",err)})}else{navigator.clipboard.writeText(`${message} - ${url}`);alert("📋 Lien copié dans le presse-papier !")}}
document.addEventListener("contextmenu",e=>e.preventDefault());document.addEventListener("keydown",function(e){if((e.ctrlKey&&(e.key==="u"||e.key==="s"))||(e.key==="F12")){e.preventDefault()}});function toggleFavori(titre){let favoris=JSON.parse(localStorage.getItem("favoris")||"[]");if(favoris.includes(titre)){favoris=favoris.filter(item=>item!==titre)}else{favoris.push(titre)}
localStorage.setItem("favoris",JSON.stringify(favoris));alert(`Favoris mis à jour : ${favoris.length} article(s)`)}
function afficherFavoris(){const favoris=JSON.parse(localStorage.getItem("favoris")||"[]");const resultats=articles.filter(a=>favoris.includes(a.title));const container=document.getElementById("article-container");container.innerHTML="";resultats.forEach((article,i)=>{container.appendChild(createArticleCard(article,i+1))});document.getElementById("result-count").innerText=`${resultats.length} favori(s)`}

