window.addEventListener('DOMContentLoaded', () => {

   const todoBox = document.querySelector('#currentTasks'),
      completedBox = document.querySelector('#completedTasks'),
      form = document.querySelector('.form-add'),

      inputTitle = document.querySelector('#inputTitle'),
      inputText = document.querySelector('#inputText'),
      inputColor = document.querySelector('#inputColor'),
      checkInput = document.querySelectorAll('.form-check-input'),

      inputTitleChange = document.querySelector('#inputTitleChange'),
      inputTextChange = document.querySelector('#inputTextChange'),
      inputColorChange = document.querySelector('#inputColorChange'),
      checkInputChange = document.querySelectorAll('.form-check-input-change'),
      spanDontCangeDate = document.querySelector('.dont-cange-date'),

      allInput = document.querySelectorAll('.form-control'),
      todoTitle = document.querySelector('.todo-title'),
      bgColor = document.querySelector('#bgColorInput'),


      btnAddChange = document.querySelector('.btn-change'),
      btnNewToOld = document.querySelector('.new-to-old'),
      btnOldToNew = document.querySelector('.old-to-new');


   let taskList = [];

   if (localStorage.getItem('task')) {
      taskList = getAllData('task');
      upgradeView();
   }

   if (localStorage.getItem('color')) {
      let colorBG = localStorage.getItem('color');
      document.body.style.backgroundColor = colorBG;
   }

   // Color  background -------------------------- 
   bgColor.addEventListener('input', () => {
      const bgColorValue = bgColor.value;
      document.body.style.backgroundColor = bgColorValue;
      localStorage.setItem('color', bgColor.value);
      console.log(localStorage);
   });


   //LocalStorage--------------------------

   function saveAllData(id, data) {
      localStorage.setItem(id, JSON.stringify(data));
   }

   function getAllData(id) {
      let json = localStorage.getItem(id);
      return JSON.parse(json);
   }

   // Get time --------------------------------
   const addZero = (num) => {
      if (num <= 9) {
         return '0' + num;
      } else {
         return num;
      }
   };

   function getTaskDate(a) {
      const minutes = a.getMinutes(),
         hours = a.getHours(),
         day = a.getDate(),
         month = a.getMonth() + 1,
         year = a.getFullYear();

      return {
         'day': day,
         'month': month,
         'year': year,
         'hours': hours,
         'minutes': minutes
      };
   }

   // ---------------------------------------

   function getPriorityValue() {
      let chekedValue = '';
      checkInput.forEach(item => {
         if (item.checked) {
            chekedValue = item.value;
         } else {
            chekedValue = 'No priority';
         }
      });
      return chekedValue;
   }

   // -------------------------------------

   form.addEventListener('submit', (e) => {
      e.preventDefault();
      const { day, month, year, hours, minutes } = getTaskDate(new Date());

      taskList.push({
         title: inputTitle.value,
         priority: getPriorityValue(),
         text: inputText.value,
         color: inputColor.value,
         date: Date.parse(new Date()),
         taskDate: `${addZero(hours)}:${addZero(minutes)} - ${addZero(day)}.${addZero(month)}.${year}`,
         completed: false,
      });

      saveAllData('task', taskList);
      clearInputs();
      upgradeView();

   });

   btnAddChange.addEventListener('click', () => {
      taskList.push({
         title: inputTitleChange.value,
         priority: getPriorityValue(),
         text: inputTextChange.value,
         color: inputColorChange.value,
         date: Date.parse(new Date()),
         taskDate: spanDontCangeDate.textContent,
         completed: false,
      });

      console.log(getPriorityValue());
      upgradeView();
      localStorage.removeItem('task');
      saveAllData('task', taskList);
   });

   // -----------------------------------------------

   const clearInputs = () => {
      allInput.forEach(item => {
         if (item.getAttribute('type') == 'color') {
            item.setAttribute('value', '#ffffff');
         } else {
            item.value = '';
         }
      });
   };

   // Sort --------------------------------

   function sortByNew(arr) {
      const newOld = JSON.parse(JSON.stringify(arr));
      newOld.sort((a, b) => a.date < b.date ? 1 : -1);
      return newOld;
   }

   btnNewToOld.addEventListener('click', () => {
      taskList = sortByNew(taskList);
      upgradeView();
      localStorage.removeItem('task');
      saveAllData('task', taskList);

   });

   function sortByOld(arr) {
      const oldNew = JSON.parse(JSON.stringify(arr));
      oldNew.sort((a, b) => a.date > b.date ? 1 : -1);
      return oldNew;
   }

   btnOldToNew.addEventListener('click', () => {
      taskList = sortByOld(taskList);
      upgradeView();
      localStorage.removeItem('task');
      saveAllData('task', taskList);
   });

   // -------------------------------------------

   function upgradeView() {
      todoBox.innerHTML = '';
      completedBox.innerHTML = '';
      let numTask = 0;


      for (let index = 0; index < taskList.length; index++) {
         const taskItem = taskList[index];

         const todoItem = document.createElement('li');
         todoItem.className = 'list-group-item d-flex w-100 mb-2';

         if (!taskItem.completed) {
            todoBox.append(todoItem);
            numTask = numTask + 1;

         } else {
            completedBox.append(todoItem);
         }

         // Color  item ----------------------------------  
         todoItem.style.backgroundColor = taskItem.color;

         // Wrappers ----------------------------------
         const mainDiv = document.createElement('div');
         mainDiv.className = 'w-100 mr-3';
         todoItem.append(mainDiv);
         const taskDiv = document.createElement('div');
         taskDiv.className = 'd-flex w-100 justify-content-between';
         mainDiv.append(taskDiv);

         // Title ----------------------------------
         const h5 = document.createElement('h5');
         h5.className = 'mb-3';
         h5.textContent = taskItem.title;
         taskDiv.append(h5);

         // Wrappers ----------------------------------
         const dateDiv = document.createElement('div');
         taskDiv.append(dateDiv);
         const buttonDiv = document.createElement('div');
         buttonDiv.className = 'm-2';
         todoItem.append(buttonDiv);
         const btnWrap = document.createElement('div');
         btnWrap.className = 'd-flex flex-column align-items-end';
         buttonDiv.append(btnWrap);

         // Priority
         const smallPriority = document.createElement('small');
         smallPriority.className = 'mr-2';
         smallPriority.textContent = taskItem.priority;
         dateDiv.append(smallPriority);

         //Date
         const smallDate = document.createElement('small');
         smallDate.textContent = taskItem.taskDate;
         dateDiv.append(smallDate);

         //Description
         const text = document.createElement('p');
         text.className = 'mb-1 w-100';
         text.textContent = taskItem.text;
         mainDiv.append(text);

         // ------------------------------

         //Btn Success   
         const btnSuccess = document.createElement('button');
         btnSuccess.className = 'btn btn-success w-100 mb-2';
         btnSuccess.setAttribute('type', 'button');
         const iSuccess = document.createElement('i');
         iSuccess.className = 'fas fa-check';
         btnSuccess.append(iSuccess);
         //Btn Change
         const btnChange = document.createElement('button');
         btnChange.className = 'btn btn-info w-100 mb-2';
         btnChange.setAttribute('type', 'button');
         btnChange.setAttribute('data-toggle', 'modal');
         btnChange.setAttribute('data-target', '#changeModal');
         const iChange = document.createElement('i');
         iChange.className = 'far fa-edit';
         btnChange.append(iChange);
         //Btn Delete
         const btnDelete = document.createElement('button');
         btnDelete.className = 'btn btn-danger w-100';
         btnDelete.setAttribute('type', 'button');
         const iDelete = document.createElement('i');
         iDelete.className = 'far fa-trash-alt';
         btnDelete.append(iDelete);

         // Btn Resrore
         const btnRestore = document.createElement('button');
         btnRestore.className = 'btn btn-success w-100 mb-2';
         btnRestore.setAttribute('type', 'button');
         const iRestore = document.createElement('i');
         iRestore.className = 'fas fa-list-ul';
         btnRestore.append(iRestore);

         // -----------------------------------------

         if (!taskItem.completed) {

            btnWrap.append(btnSuccess);
            btnWrap.append(btnChange);
            btnWrap.append(btnDelete);

         } else {

            btnWrap.append(btnRestore);
            btnWrap.append(btnDelete);
         }

         // ----------------------------------------

         btnDelete.addEventListener('click', () => {
            taskList = taskList.filter(currentTodoItem => currentTodoItem !== taskItem);
            localStorage.removeItem('task');
            saveAllData('task', taskList);
            upgradeView();
         });

         btnChange.addEventListener('click', () => {
            btnAddChange.setAttribute('data-dismiss', 'modal');
            inputTitleChange.value = taskItem.title;
            inputTextChange.value = taskItem.text;
            inputColorChange.value = taskItem.color;
            spanDontCangeDate.textContent = taskItem.taskDate;

            taskList = taskList.filter(currentTodoItem => currentTodoItem !== taskItem);
            localStorage.removeItem('task');
            saveAllData('task', taskList);
            upgradeView();

         });

         btnSuccess.addEventListener('click', () => {
            taskItem.completed = true;
            localStorage.removeItem('task');
            saveAllData('task', taskList);
            upgradeView();
         });

         btnRestore.addEventListener('click', () => {
            taskItem.completed = false;
            localStorage.removeItem('task');
            saveAllData('task', taskList);
            upgradeView();
         });

      }

      todoTitle.textContent = `ToDo (${numTask})`;
   }
});