// @ts-nocheck
window.onload = () => {
   const deleteButtonForSticker = document.querySelector('.sticker__delete')
   const submitButton = document.querySelector('.form__button')
   const todoTitle = document.querySelector('.form__title')
   const todoDesc = document.querySelector('.form__desc')
   const nodeForStickers = document.querySelector('.stickers')

   let taskList = [];

   if (localStorage.taskList) {
      showLocalData(JSON.parse(localStorage.taskList));
      taskList = JSON.parse(localStorage.taskList)
   }

   console.log(deleteButtonForSticker)

   function Sticker(title, content) {
      this.class = "Sticker";
      this.title = title;
      this.content = content;
      this.id = Date.now();
   }

   function setStickerDataToHTML(sticker) {
      return `<div class="sticker"><div class="sticker__title">${sticker.title}</div><div class="sticker__content">${sticker.content}</div><button class="sticker__delete">Delete</button></div>`
   }

   function deleteSticker(sticker) {
      console.log(sticker)
   }

   deleteButtonForSticker.addEventListener('click', () => {
      let sticker = e.target
      deleteSticker(12)
   })


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


      for (let item of stickerArray) {
         nodeForStickers.insertAdjacentHTML('beforeend', item)
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

   document.querySelector('.dataInLocal').addEventListener('click', () => {
      localStorage.taskList = JSON.stringify(taskList);
      console.log(localStorage.taskList)
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
