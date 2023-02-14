// @ts-nocheck
window.onload = () => {
   const submitButton = document.querySelector('.form__button')


   const StickerFormTitle = document.querySelector('.form__titleForSticker')
   const StickerFormDesc = document.querySelector('.form__descForSticker')

   const checkboxFormTitle = document.querySelector('.form__titleForCheckbox')

   const nodeForStickers = document.querySelector('.stickers')
   const nodeForCheckboxes = document.querySelector('.checkboxes')
   const nodeForUncompletedCheckboxes = document.querySelector('.checkboxes__uncompleted__content')
   const nodeForCompletedCheckboxes = document.querySelector('.checkboxes__completed__content')

   const createStickerBtn = document.querySelector('.create__Sticker')
   const userCreateSelect = document.querySelector('.form__select');

   let counterForStickerEdit = 0;
   let counterForCheckboxesEdit = 0;
   let taskList = [];

   if (localStorage.taskList) { //Render data
      showLocalData(JSON.parse(localStorage.taskList));
      taskList = JSON.parse(localStorage.taskList)
   }

   //Pop up

   createStickerBtn.addEventListener('click', () => {
      document.querySelector('.popUp').classList.remove('disabled')
   })



   //Stickers Block

   function Sticker(title, content) {
      this.class = "Sticker";
      this.title = title;
      this.content = content;
      this.id = Date.now();
   }

   function setStickerDataToHTML(sticker) {
      return `
      <div data-id="${sticker.id}" class="sticker">

            <div class="sticker__title">${sticker.title}</div>
            <div class="sticker__content">${sticker.content}</div>

         <div class="sticker__buttons">
            <button class="sticker__delete btn">Delete</button>
            <button class="sticker__edit btn">Edit</button>
         </div>
      </div>`
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

   //Checkboxes

   function Checkbox(content) {
      this.class = 'Checkbox';
      this.content = content;
      this.id = Date.now();
      this.state = false;
   }

   function checkboxToggle(target) {
      let temp = null;
      taskList.forEach(item => {
         if (item.class == 'Checkbox' && target.dataset.id == item.id) {
            temp = item;
         }
      })
      temp.state = !temp.state
      completeCheckbox(target, temp)
      setDataToLocalStorage()
   }

   function setCheckboxDataToHtml(item, state) {
      return `<div class="checkbox__item" data-id='${item.id}'>
               <input type="checkbox" class="checkbox" ${state ? "checked" : ""} data-id='${item.id}'>
               <div class="checkbox__content ${state ? "completed" : ''}" lang='ru'>${item.content}</div>
               <div class="checkbox__buttons">
                  <button class="checkbox__edit btn">Edit</button>
                  <button class="checkbox__delete btn">Delete</button>
               </div>
              </div>`
   }

   function completeCheckbox(itemHTML, item) {
      if (item.state) {
         itemHTML.nextElementSibling.classList.add('completed')
      } else {
         itemHTML.nextElementSibling.classList.remove('completed')
      }
      showLocalData(taskList)
   }

   function editCheckbox(checkbox) {
      let itemID = checkbox.closest('.checkbox__item').dataset.id
      let editBtn = checkbox.nextElementSibling.firstElementChild
      let editedContent = null;

      if (counterForCheckboxesEdit == 0) {
         counterForCheckboxesEdit = 1
         replaceTag(checkbox, 'textarea')
         editBtn.textContent = 'Apply'
         if (checkbox.classList.contains('completed')) {
            checkbox.classList.remove('completed')
         }
      } else if (counterForCheckboxesEdit == 1) {
         counterForCheckboxesEdit = 0
         editedContent = checkbox.value
         replaceTag(checkbox, 'div')
         editBtn.textContent = 'Edit'
         if (!checkbox.classList.contains('completed')) {
            checkbox.classList.add('completed')
         }
         for (let item of taskList) {
            if (item.id == itemID) {
               if (editedContent) {
                  checkboxSetter(item, 'content', editedContent)
               }
            }
         }
         setDataToLocalStorage()
         showLocalData(taskList)
      }



   }

   function deleteCheckbox(checkbox) {
      taskList.forEach(item => {
         if (item.class == 'Checkbox' && item.id == checkbox.dataset.id) {
            taskList.splice(taskList.indexOf(item), 1)
         }
      })
      setDataToLocalStorage()
      showLocalData(taskList)
   }

   function checkboxSetter(checkbox, variable, data) {
      checkbox[variable] = data
   }
   // Data Block

   function replaceTag(target, tag) {
      target.outerHTML = `<${tag} class="${target.classList}">` + target.innerHTML + `</${tag}>`
   }

   function showLocalData(localData) {
      nodeForUncompletedCheckboxes.innerHTML = '';
      nodeForCompletedCheckboxes.innerHTML = '';
      nodeForStickers.innerHTML = '';

      let checkboxesArray = [];
      let stickerArray = [];

      if (localData) {
         localData.forEach(item => {
            if (item.class == "Sticker") {
               if (!stickerArray.includes(setStickerDataToHTML(item.id))) {
                  stickerArray.push(setStickerDataToHTML(item))
               }
            }

            if (item.class == 'Checkbox') {
               checkboxesArray.push(item)
            }
         })
      }

      stickerArray.forEach(item => nodeForStickers.insertAdjacentHTML('beforeend', item))

      checkboxesArray.forEach(item => {
         if (item.state == true) {
            nodeForCompletedCheckboxes.insertAdjacentHTML('beforeend', setCheckboxDataToHtml(item, item.state))
         }
         if (item.state == false) {
            nodeForUncompletedCheckboxes.insertAdjacentHTML('beforeend', setCheckboxDataToHtml(item, item.state))
         }
      })

      document.querySelectorAll('.sticker__delete').forEach(button => {
         button.addEventListener('click', () => {
            deleteSticker(button.closest('.sticker'))
         })
      })

      document.querySelectorAll('.sticker__edit').forEach(button => {
         button.addEventListener('click', () => {
            editSticker(button.closest('.sticker'))
         })
      })

      document.querySelectorAll('.checkbox').forEach(item => {
         item.addEventListener('change', () => {
            checkboxToggle(item)
         })
      })

      document.querySelectorAll('.checkbox__delete').forEach(item => {
         item.addEventListener('click', () => {
            deleteCheckbox(item.closest('.checkbox__item'))
         })
      })

      document.querySelectorAll('.checkbox__edit').forEach(item => {
         item.addEventListener('click', () => {
            editCheckbox(item.parentElement.previousElementSibling)
         })
      })
   }

   function setDataToLocalStorage() {
      localStorage.taskList = JSON.stringify(taskList);
   }

   userCreateSelect.addEventListener('change', () => {
      if (userCreateSelect.value == 'Sticker') {
         document.querySelector('.form__forStickers').classList.remove('disabled')
         document.querySelector('.form__forCheckboxes').classList.add('disabled')
      }
      if (userCreateSelect.value == 'Checkbox') {
         document.querySelector('.form__forStickers').classList.add('disabled')
         document.querySelector('.form__forCheckboxes').classList.remove('disabled')
      }
      if (userCreateSelect.value == 'None') {
         document.querySelector('.form__forStickers').classList.add('disabled')
         document.querySelector('.form__forCheckboxes').classList.add('disabled')
      }
   })

   submitButton.addEventListener('click', () => {
      let temp = null;
      if (StickerFormTitle.value == 'admin' && StickerFormDesc.value == 'admin' || checkboxFormTitle.value == 'admin') {
         document.querySelector('.admin__panel').classList.remove('disabled')
      } else {
         if (userCreateSelect.value == 'Sticker') {
            if (StickerFormTitle.value || StickerFormDesc.value) {
               let title = StickerFormTitle.value.match(/[^</>]/g)?.join('')
               let content = StickerFormDesc.value.match(/[^</>]/g)?.join('')
               temp = new Sticker(title, content)

               taskList.push(temp)
               StickerFormTitle.value = null;
               StickerFormDesc.value = null;
            }
         } else if (userCreateSelect.value == 'Checkbox') {
            if (checkboxFormTitle.value) {
               let title = checkboxFormTitle.value.match(/[^</>]/g)?.join('')

               temp = new Checkbox(title)
               taskList.push(temp)

               checkboxFormTitle.value = null;
            }
         }
      }
      userCreateSelect.value = 'None'
      document.querySelector('.form__forStickers').classList.add('disabled')
      document.querySelector('.form__forCheckboxes').classList.add('disabled')


      setDataToLocalStorage()
      showLocalData(taskList)
      document.querySelector('.popUp').classList.add('disabled')
   })

   StickerFormTitle.addEventListener('paste', (e) => { e.preventDefault() })
   StickerFormDesc.addEventListener('paste', (e) => { e.preventDefault() })
   checkboxFormTitle.addEventListener('paste', (e) => { e.preventDefault() })

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
