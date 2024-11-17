document.todo={
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
    draw: function(filter=""){
        const taskList=document.getElementById("todo-list");
        taskList.innerHTML="";
        const filteredTasks=this.tasks.filter(task=>task[0].includes(filter));
        filteredTasks.forEach((task,index)=> {
            const li=document.createElement("li");
            li.classList.add("task-item");
            li.innerHTML=`
            <input type="checkbox">
            <span>${task[0]}</span>
            <span>${task[1] || "Brak daty"}</span>
            <button class="edit-btn" data-index="${index}">✏️</button>
            <button class="delete-btn" data-index="${index}">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    },
    editTask:function(index){
        const task=this.tasks[index];
        const li=document.querySelectorAll(".task-item")[index];
        //pole edycyjne
        li.innerHTML=`
            <input type="text" class="edit-task-name" value="${task[0]}">
            <input type="date" class="edit-task-date" value="${task[1]}">
            <button class="save-btn" data-index="${index}">zapisz</button>
            <button class="cancel-btn">anuluj</button>
        `;
    },  
    init:function(){
        const searchInput=document.getElementById("search");
        const newTaskInput=document.getElementById("new-task");
        const dueDateInput=document.getElementById("due-date");
        const addTaskBtn = document.getElementById("add-task-btn");
        this.draw();
        //dodawanie nowego zadanka
        addTaskBtn.addEventListener("click",()=>{
            const taskName=newTaskInput.value.trim();
            const dueDate=dueDateInput.value;
            if(taskName.length<3||taskName.length>255){
                alert("zadanie musi zawierac od 3 do 255 znakow");
                return;
            }
            if(dueDate&&new Date(dueDate)<new Date()){
                alert("data musi byc w przyszlosci");
                return;
            }
            this.tasks.push([taskName,dueDate]);
            localStorage.setItem("tasks",JSON.stringify(this.tasks));
            this.draw();
            newTaskInput.value="";
            dueDateInput.value="";
        });
        //usuwanie zadania
        document.getElementById("todo-list").addEventListener("click",(e)=>{
            const index=e.target.getAttribute("data-index");
            if(e.target.classList.contains("delete-btn")){
                this.tasks.splice(index,1);
                localStorage.setItem("tasks",JSON.stringify(this.tasks));
                this.draw();
            } else if (e.target.classList.contains("edit-btn")){
                this.editTask(index);
            } else if (e.target.classList.contains("save-btn")){
                const taskName=e.target.parentNode.querySelector(".edit-task-name").value.trim();
                const dueDate=e.target.parentNode.querySelector(".edit-task-date").value;
                if (taskName.length<3||taskName.length>255){
                    alert("zadanie musi zawierac od 3 do 255 znakow.");
                    return
                }
                if(dueDate&&new Date(dueDate)<new Date()){
                    alert("data musi byc w przyszlosci.");
                    return
                }
                this.tasks[index]=[taskName,dueDate];
                localStorage.setItem("tasks",JSON.stringify(this.tasks));
                this.draw()
            }   else if (e.target.classList.contains("cancel-btn")) {
                this.draw();
            }
        });
        //wyszukiwanie
        searchInput.addEventListener("input",()=>{
            const filter=searchInput.value.trim();
            if(filter.length>=2){
                this.draw(filter);
            }else{
                this.draw();
            }
        });
    }
};
//inicjalizacja todo
document.addEventListener("DOMContentLoaded",function(){
    document.todo.init();
});