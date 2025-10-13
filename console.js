let imagesActuelles=[];let indexImageActive=0;let infosActuelles=[];const numeroWhatsApp=atob("MjI4OTEyNjk3MTY=");const container=document.getElementById("console-container");fetch("consoles.json").then(response=>response.json()).then(consoles=>{consoles.forEach((console,index)=>{const card=document.createElement("div");card.className="carte-produit";if(console.etat==="vendu"){card.classList.add("produit-vendu")}
const sliderId=`swiper-${index}`;let imagesHTML=`<div class="swiper" id="${sliderId}"><div class="swiper-wrapper">`;console.images.forEach(img=>{imagesHTML+=`
          <div class="swiper-slide">
            <img src="${img}" alt="${console.title}" onclick="ouvrirLightbox('${img}')">
          </div>`;imagesActuelles.push(img);infosActuelles.push({title:console.title,price:console.price})});imagesHTML+=`</div></div>`;const badgeHTML=console.badge?`<span class="badge-produit ${console.badge.toLowerCase()}">${console.badge}</span>`:"";const boutonWhatsApp=console.etat==="vendu"?"":`<a href="https://wa.me/${numeroWhatsApp}?text=Je veux commander ${encodeURIComponent(console.title)}" class="btn-whatsapp">📱 Commander</a>`;card.innerHTML=`
        ${badgeHTML}
        ${imagesHTML}
        <h3>${console.title}</h3>
        <p class="prix">${console.price}</p>
        ${boutonWhatsApp}
      `;container.appendChild(card);new Swiper(`#${sliderId}`,{loop:!0,autoplay:{delay:3000},effect:'slide'})})}).catch(error=>console.error("Erreur de chargement JSON :",error));function ouvrirLightbox(src){indexImageActive=imagesActuelles.indexOf(src);if(indexImageActive===-1)return;afficherImageLightbox();document.getElementById("lightbox").style.display="flex"}
function afficherImageLightbox(){document.getElementById("lightbox-img").src=imagesActuelles[indexImageActive];document.getElementById("lightbox-title").textContent=infosActuelles[indexImageActive].title;document.getElementById("lightbox-price").textContent=infosActuelles[indexImageActive].price}
function imageSuivante(){indexImageActive=(indexImageActive+1)%imagesActuelles.length;afficherImageLightbox()}
function imagePrecedente(){indexImageActive=(indexImageActive-1+imagesActuelles.length)%imagesActuelles.length;afficherImageLightbox()}
function fermerLightbox(){document.getElementById("lightbox").style.display="none"}
let startX=0;document.getElementById("lightbox").addEventListener("touchstart",e=>{startX=e.touches[0].clientX});document.getElementById("lightbox").addEventListener("touchend",e=>{let endX=e.changedTouches[0].clientX;if(startX-endX>50)imageSuivante();else if(endX-startX>50)imagePrecedente();})
