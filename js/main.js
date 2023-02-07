// @ts-nocheck
window.onload = () => {
   const submitButton = document.querySelector('.form__button')
   const todoTitle = document.querySelector('.form__title')
   const todoDesc = document.querySelector('.form__desc')
   const nodeForStickers = document.querySelector('.stickers')

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
      return `<div data-id="${sticker.id}" class="sticker"><div class="sticker__title">${sticker.title}</div><div class="sticker__content">${sticker.content}</div><button class="sticker__delete">Delete</button></div>`
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

   // Data Block

   function showLocalData(localData) {
      nodeForStickers.innerHTML = '';
      let stickerArray = [];
      if (localData) {
         for (let item of localData) {
            if (item.class == "Sticker") {
               if (!stickerArray.includes(setStickerDataToHTML(item.id))) {
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
