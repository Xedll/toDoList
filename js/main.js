// @ts-nocheck
window.onload = () => {
   const submitButton = document.querySelector('.form__button')
   const todoTitle = document.querySelector('.form__title')
   const todoDesc = document.querySelector('.form__desc')
   const nodeForStickers = document.querySelector('.stickers')
   let counterForStickerEdit = 0;
   let taskList = [];

   if (localStorage.taskList) { //Render data
      showLocalData(JSON.parse(localStorage.taskList));
      taskList = JSON.parse(localStorage.taskList)
   }

   //Stickers Block

   function Sticker(title, content) {
      this.class = "Sticker";
      this.title = title;
      this.content = content;
      this.id = Date.now();
   }

   function setStickerDataToHTML(sticker) {
      return `<div data-id="${sticker.id}" class="sticker"><div class="sticker__title">${sticker.title}</div><div class="sticker__content">${sticker.content}</div><div class="sticker__buttons"><button class="sticker__delete">Delete</button><button class="sticker__edit">Edit</button></div></div>`
   }

   function stickerSetter(sticker, variable, data) {
      sticker[variable] = data;
   }

   function deleteSticker(sticker) {
      for (let item of taskList) {
         if (item.class == 'Sticker' && item.id == sticker.dataset.id) {
            taskList.splice(taskList.indexOf(item), 1)
         }
      }
      setDataToLocalStorage()
      showLocalData(taskList)
   }

   function editSticker(sticker) {
      let childrens = Array.from(sticker.children);

      let title = null;
      let content = null;
      let buttons = null
      let editButton = null;

      for (let item of childrens) {
         if (item.classList.contains('sticker__title')) {
            title = item
         }
         if (item.classList.contains('sticker__content')) {
            content = item
         }
         if (item.classList.contains('sticker__buttons')) {
            buttons = Array.from(item.children)
         }
      }

      for (let button of buttons) {
         if (button.classList.contains('sticker__edit')) {
            editButton = button;
         }
      }

      let titleEdited = title.textContent;
      let contentEdited = content.textContent;

      if (counterForStickerEdit == 0) {

         counterForStickerEdit = 1;

         replaceTag(title, 'textarea')
         replaceTag(content, 'textarea')

         editButton.textContent = 'Apply'

      } else if (counterForStickerEdit == 1) {

         counterForStickerEdit = 0;

         titleEdited = title.value
         contentEdited = content.value

         replaceTag(title, 'div')
         replaceTag(content, 'div')

         editButton.textContent = 'Edit'

         for (let item of taskList) {
            if (sticker.dataset.id == item.id) {
               if (titleEdited && contentEdited) {
                  stickerSetter(item, 'title', titleEdited)
                  stickerSetter(item, 'content', contentEdited)
               }
            }
         }

         setDataToLocalStorage()
         showLocalData(taskList)
      }

   }


   // Data Block

   function replaceTag(target, tag) {
      target.outerHTML = `<${tag} class="${target.classList}">` + target.innerHTML + `</${tag}>`
   }

   function showLocalData(localData) {
      nodeForStickers.innerHTML = '';
      let stickerArray = [];
      if (localData) {
         for (let item of localData) {
            if (item.class == "Sticker") {
               if (!stickerArray.includes(setStickerDataToHTML(item))) {
                  stickerArray.push(setStickerDataToHTML(item))
               }
            }
         }
      }

      for (let item of stickerArray) { //Render stickers
         nodeForStickers.insertAdjacentHTML('beforeend', item)
      }

      for (let button of document.querySelectorAll('.sticker__delete')) { //Handler for deleting stickers
         button.addEventListener('click', () => {
            deleteSticker(button.closest('.sticker'))
         })
      }

      for (let button of document.querySelectorAll(".sticker__edit")) {
         button.addEventListener('click', () => {
            editSticker(button.closest('.sticker'))
         })
      }

   }

   function setDataToLocalStorage() {
      localStorage.taskList = JSON.stringify(taskList);
   }






   submitButton.addEventListener('click', () => {
      let temp = null;
      if (todoTitle.value && todoDesc.value) {
         temp = new Sticker(todoTitle.value, todoDesc.value)
         taskList.push(temp);
         setDataToLocalStorage()
         showLocalData(taskList)
         todoTitle.value = null;
         todoDesc.value = null;
      }
   })

   document.querySelector('.resetLocal').addEventListener('click', () => {
      localStorage.taskList = ''
   })
   document.querySelector('.resetData').addEventListener('click', () => {
      taskList = [];
   })



   document.querySelector('.forConsoleLocal').addEventListener('click', () => {
      console.log(localStorage.taskList);
   })

   document.querySelector('.forConsoleData').addEventListener('click', () => {
      console.log(taskList);
   })
}
