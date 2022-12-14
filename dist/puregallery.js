/**
 * 
 * PUREGALLERY-JS
 * 
 * @file: puregallery.js
 * @author: Arthur 'ArTDsL' Dias dos Santos Lasso
 * @version: 1.0b
 * @create: 2022-08-08
 * @update: 2022-08-09
 * @copyright: Copyright (c) 2022. Arthur 'ArTDsL' Dias dos Santos Lasso. All rights reserved.
 *
 * Distributed with no costs (FREE) on: https://github.com/ArTDsL/puregallery-js
 * under MIT License, DO NOT REMOVE THIS HEADER.
 *
 */
/*
	-----------------------------------------------------------------------
	-- DEV PARAMS DATASHEET --
	-----------------------------------------------------------------------
	data-pg-gallery     Gallery ID    -----------------(SET BY USER)
	data-pg-size        Gallery Size  -----------------(SET BY USER)
	data-pg-image       Image URL     -----------------(SET BY USER)
	data-pg-gid         Gallery ID    -----------------(SET BY USER)
	data-pg-pos         Image position em Gallery -----(SET BY USER)
	data-pg-timer       Time to auto swipe image  -----(SET BY USER) | OPTIONAL
	data-pg-box         Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tbox-gid    Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tb-gid      Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tb-pos      Image position em Gallery Thumbnail ---(SET AUTOM.)
	-----------------------------------------------------------------------
*/
var dm_pos = { l:0,  x: 0};
var act_dm = -1;
var gallery_marker = [];
//var gallery_autothrottle = [];
function load_puregallery(){
	//get all galleries
	document.querySelectorAll("#puregallery").forEach(function(element){
		gallery_marker[element.getAttribute("data-pg-gallery")] = 1; //set '1' as default image to BACK/NEXT function
		__PRG_CreateGalleryStructure(element.getAttribute("data-pg-gallery"), element.getAttribute("data-pg-size"));
	});
}
function puregallery_nextImage(gallery_id){
	__PRG_HideImages(gallery_id);
	if(__PRG_CheckIfImageExists(gallery_id, (gallery_marker[gallery_id] + 1)) === 1){
		gallery_marker[gallery_id] += 1;
		puregallery_showImage(gallery_id, gallery_marker[gallery_id]);
	}else{
		gallery_marker[gallery_id] = 1;
		puregallery_showImage(gallery_id, gallery_marker[gallery_id]);
	}
}
function puregallery_backImage(gallery_id){
	__PRG_HideImages(gallery_id);
	if(__PRG_CheckIfImageExists(gallery_id, (gallery_marker[gallery_id] - 1)) === 1){
		gallery_marker[gallery_id] -= 1;
		puregallery_showImage(gallery_id, gallery_marker[gallery_id]);
	}else{
		var countImages = document.querySelectorAll("[data-pg-gid='" + gallery_id + "']").length;
		gallery_marker[gallery_id] = countImages;
		puregallery_showImage(gallery_id, gallery_marker[gallery_id]);
	}
}
function puregallery_showImage(gallery_id, image_id){
	//hide images/show images
	__PRG_HideImages(gallery_id);
	__PRG_ShowImage(gallery_id, image_id);
	//highlight the thumbnail image
	__PRG_HighlightThumbnail(gallery_id, image_id);
	//update current image marker
	gallery_marker[gallery_id] = image_id;
}
document.addEventListener('mousedown', function(e){
	if(e.target && e.target.classList == "puregallery-thumbnail-box"){
		act_dm = e.target.attributes["data-pg-tbox-gid"].value;
		dm_pos = {
			l : document.querySelector("[data-pg-tbox-gid='" + act_dm + "']").scrollLeft,
			x : e.clientX
		};
		e.target.style.cursor = 'grabbing';
	}
});
document.addEventListener('mousemove', function(e){
	if(e.target && e.target.classList == "puregallery-thumbnail-box" && e.target.attributes["data-pg-tbox-gid"].value == act_dm){
		var mx = e.clientX - dm_pos.x;
	    document.querySelector("[data-pg-tbox-gid='" + act_dm + "']").scrollLeft = dm_pos.l - mx;
	}
});
document.addEventListener('mouseup', function(e){
	if(e.target && e.target.classList == "puregallery-thumbnail-box" && e.target.attributes["data-pg-tbox-gid"].value == act_dm){
		e.target.style.cursor = 'grab';
		dm_pos = {
			l : 0,
			x : 0
		};
		act_dm = -1;
	}
});
/*
	===================================================
	PRG stands for (P)u(R)e(G)allery...
	Functions under this comment are **internal only**,
	that means =>  if you mess with something MAYBE the
	code will stop work... BE CAREFUL!
	===================================================
*/
function __PRG_CreateGalleryStructure(gallery_id, gallery_ImgSize){
	//Gallery images gonna have the same size as the size given in "data-size"
	var galleryElem = document.createElement("div");
	galleryElem.setAttribute("class", "box-puregallery");
	galleryElem.setAttribute("data-pg-box", gallery_id);
	document.querySelector("[data-pg-gallery='" + gallery_id + "']").appendChild(galleryElem);
	var gallerySize = gallery_ImgSize.split('x');
	document.querySelector("[data-pg-box='" + gallery_id + "']").setAttribute("style", "max-width: " + gallerySize[0] + "px; min-width:" + gallerySize[0] + "px; max-height:" + gallerySize[1] + "px; min-height:" + gallerySize[1] + "px;");
	document.querySelector("[data-pg-gallery='" + gallery_id + "']").setAttribute("style", "max-width: " + gallerySize[0] + "px; min-width:" + gallerySize[0] + "px; max-height:" + gallerySize[1] + "px; min-height:" + gallerySize[1] + "px;");
	__PRG_LoadGalleryData(gallery_id, gallery_ImgSize);
}
function __PRG_LoadGalleryData(gallery_id, gallery_ImgSize){
	var i = 0;
	document.querySelectorAll("[data-pg-gid='" + gallery_id + "']").forEach(function(element){
		i++;
		var imgElem = document.createElement("div");
		imgElem.setAttribute("class", "puregallery-loaded-img");
		imgElem.setAttribute("data-pg-pos", element.attributes['data-pg-pos'].value);
		imgElem.setAttribute("data-pg-gid", element.attributes['data-pg-gid'].value);
		if(i == 1){
			imgElem.setAttribute("style", "background-image: url('" + element.attributes['data-pg-img'].value + "');");
		}else{
			imgElem.setAttribute("style", "background-image: url('" + element.attributes['data-pg-img'].value + "'); display: none;");
		}
		document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(imgElem);
		element.remove();
	});
	var countImages = document.querySelectorAll("[data-pg-gid='" + gallery_id + "']").length;
	__PRG_LoadGalleryThumbnails(gallery_id, countImages);
}
function __PRG_LoadGalleryThumbnails(gallery_id, countImages){
	var thumbElem = document.createElement("div");
	thumbElem.setAttribute("class", "puregallery-thumbnail-box");
	thumbElem.setAttribute("data-pg-tbox-gid", gallery_id);
	document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(thumbElem);
	for(var i = 1; i <= countImages; i++){
		var thumbnail = document.createElement("div");
		if(i == 1){
			thumbnail.setAttribute("class", "puregallery-thumbnail puregallery-active");
		}else{
			thumbnail.setAttribute("class", "puregallery-thumbnail puregallery-selected");
		}
		thumbnail.setAttribute("data-pg-tb-gid", gallery_id);
		thumbnail.setAttribute("data-pg-tb-pos", i);
		thumbnail.setAttribute("OnClick", "puregallery_showImage(" + gallery_id + ", " + i + ");")
		var src_image = document.querySelector("[data-pg-gid='" + gallery_id + "'][data-pg-pos='" + i + "']").style.backgroundImage;
		thumbnail.setAttribute("style", "background-image: " + src_image);
		document.querySelector("[data-pg-tbox-gid='" + gallery_id + "']").appendChild(thumbnail);
		__PRG_FinishGalleryLoading(gallery_id);
	};
}
function __PRG_FinishGalleryLoading(gallery_id){
	if(document.querySelector("[data-pg-box='" + gallery_id + "']").querySelector(".puregallery-cpr") == null){
		var cpr = document.createElement("div");
		cpr.setAttribute("class", "puregallery-cpr");
		cpr.setAttribute("onClick", "window.open('https://github.com/ArTDsL/puregallery-js/', '_blank');");
		document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(cpr);
	}
	if(document.querySelector("[data-pg-box='" + gallery_id + "']").querySelector(".puregallery-btn-left") == null){
		var btn_left = document.createElement("div");
		btn_left.setAttribute("class", "puregallery-btn-left");
		btn_left.setAttribute("onClick", "puregallery_backImage(" + gallery_id + ");");
		document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(btn_left);
	}
	if(document.querySelector("[data-pg-box='" + gallery_id + "']").querySelector(".puregallery-btn-right") == null){
		var btn_right = document.createElement("div");
		btn_right.setAttribute("class", "puregallery-btn-right");
		btn_right.setAttribute("onClick", "puregallery_nextImage(" + gallery_id + ");");
		document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(btn_right);
	}
}
/*function __PRG_AutoSwipe(){ //change images after 'x' seconds (must be set as 'data-pg-timer="seconds"')
	
}*/
function __PRG_HideImages(gallery_id){
	//this should run first (because he hides all gallery images)
	document.querySelectorAll("[data-pg-gid='" + gallery_id + "']").forEach(function(element){
		element.style.display = "none";
	});
}
function __PRG_ShowImage(gallery_id, image_id){
	document.querySelector("[data-pg-gid='" + gallery_id + "'][data-pg-pos='" + image_id + "']").style.display = 'block';
}
function __PRG_HighlightThumbnail(gallery_id, thumbnail_pos){
	//remove highlights
	document.querySelectorAll("[data-pg-tb-gid='" + gallery_id + "']").forEach(function(element){
		element.classList.replace("puregallery-active", "puregallery-selected");
	});
	//set highlight on clicked image
	document.querySelector("[data-pg-tb-gid='" + gallery_id + "'][data-pg-tb-pos='" + thumbnail_pos + "']").classList.replace("puregallery-selected", "puregallery-active");
}
function __PRG_CheckIfImageExists(gallery_id, image_id){
	if(document.querySelector("[data-pg-gid='" + gallery_id + "'][data-pg-pos='" + image_id + "']") !== null){
		return 1;
	}else{
		return 0;
	}
}
