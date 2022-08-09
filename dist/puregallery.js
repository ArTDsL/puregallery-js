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
	data-pg-box         Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tbox-gid    Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tb-gid      Gallery ID ----------------------------(SET AUTOM.)
	data-pg-tb-pos      Image position em Gallery Thumbnail ---(SET AUTOM.)
	-----------------------------------------------------------------------
*/
var gallery_marker = [];
function load_puregallery(){
	//get all galleries
	document.querySelectorAll("#puregallery").forEach(function(element){
		gallery_marker[element.getAttribute("data-pg-gallery")] = 1; //set '1' as default image to BACK/NEXT function
		__PRG_CreateGalleryStructure(element.getAttribute("data-pg-gallery"), element.getAttribute("data-pg-size"));
	});
}
function puregallery_nextImage(gallery_id){
	__PRG__HideImages(gallery_id);
}
function puregallery_backImage(gallery_id){
	__PRG__HideImages(gallery_id);
}
function puregallery_showImage(gallery_id, image_id){
	//hide images/show images
	__PRG_HideImages(gallery_id);
	__PRG_ShowImage(gallery_id, image_id);
	//highlight the thumbnail image
	__PRG_HighlightThumbnail(gallery_id, image_id);
}
/*
	===================================================
	PRG stands for PuReGallery...
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
	var cpr = document.createElement("div");
	cpr.setAttribute("class", "puregallery-cpr");
	cpr.setAttribute("onClick", "window.location.href='https://github.com/ArTDsL/puregallery-js/';");
	document.querySelector("[data-pg-box='" + gallery_id + "']").appendChild(cpr);
}
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