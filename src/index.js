import {
  toDate, isThisWeek, subDays, format, parseISO,
} from 'date-fns';
import Task from './task';
import Project from './project';


const localStorageProjectKey = 'list.projects';
const localStorageSelectedProjectKey = 'list.selectedProjectId';
const projects = JSON.parse(localStorage.getItem(localStorageProjectKey)) || [];
const localStorageDefaultProjectKey = 'list.defaultProjects';
const defaultProjects = JSON.parse(localStorage.getItem(localStorageDefaultProjectKey)) || [];
let selectedProjectId = localStorage.getItem(localStorageSelectedProjectKey);
const allProjects = [...defaultProjects, ...projects];
const addTask = document.getElementById('addTask');
console.log(localStorage);
const UI = (() => {
  const projectTitle = document.getElementById('projectTitle');
  const projectList = document.getElementById('projectList');
  const taskContainer = document.getElementById('taskContainer');
  const defaultProjectList = document.getElementById('defaultProjectList');
  projectList.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
      selectedProjectId = e.target.dataset.projectId;
      UI.saveAndRender();
      addTask.style.display = 'block';
    }
  });
  defaultProjectList.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'li') {
      selectedProjectId = e.target.dataset.projectId;
      UI.saveAndRender();
      console.log(selectedProjectId);
      if (selectedProjectId === 'today' || selectedProjectId === 'thisweek') {
        addTask.style.display = 'none';
      }
      if (selectedProjectId === 'inbox') {
        addTask.style.display = 'block';
      }
    }
  });
  const createTask = () => {
    const newTask = new Task(document.getElementById('task').value, document.getElementById('desc').value, document.getElementById('date').value);
    const selectedProject = allProjects.find((project) => project.id === selectedProjectId);
    const todayProject = defaultProjects.find((project) => project.id === 'today');
    const thisWeekProject = defaultProjects.find((project) => project.id === 'thisweek');
    selectedProject.tasks.push(newTask);
    const today = format(new Date(), 'yyyy-MM-dd');
    if (newTask.date === today) {
      todayProject.tasks.push(newTask);
    }
    if (isThisWeek(subDays(toDate(parseISO(newTask.date)), 1))) {
      thisWeekProject.tasks.push(newTask);
    }
  };
  const renderTask = (selectedProject) => {
    selectedProject.tasks.forEach((task) => {
      const thisTask = document.createElement('div');
      const checkBox = document.createElement('input');
      const group1 = document.createElement('div');
      group1.classList.add('task-element-group1');
      checkBox.type = 'checkbox';
      checkBox.name = "taskCheckBox";
      checkBox.id = "taskCheckBox";
      checkBox.addEventListener('mouseenter', (e) => {
        taskName.classList.add('task-done');
        taskDesc.classList.add('task-done');
        taskDate.classList.add('task-done');
      });
      checkBox.addEventListener('mouseleave', () => {
        taskName.classList.remove('task-done');
        taskDesc.classList.remove('task-done');
        taskDate.classList.remove('task-done');
      });
      thisTask.classList.add('task-element');
      const taskName = document.createElement('p');
      taskName.textContent = task.name;
      const taskDesc = document.createElement('p');
      taskDesc.classList.add('desc-text');
      taskDesc.textContent = task.desc;
      const taskDate = document.createElement('p');
      taskDate.classList.add('date-text');
      if (task.date !== '') {
        taskDate.textContent = `${format(parseISO(task.date), 'd LLL')}`;
      }
      checkBox.addEventListener('change', (e) => {
        if (e.target.checked) {
          e.target.parentNode.remove();
          allProjects.forEach((project) => {
            removeItemArr(project.tasks, task);
          });
        }
        saveAndRender();
      });
      group1.appendChild(checkBox);
      group1.appendChild(taskName);
      thisTask.appendChild(group1);
      thisTask.appendChild(taskDesc);
      thisTask.appendChild(taskDate);
      taskContainer.appendChild(thisTask);
    });
  };
  const createDefaultProjects = () => {
    if (defaultProjects.length === 0) {
      const inbox = new Project('Inbox');
      const today = new Project('Today');
      const thisWeek = new Project('This Week');
      inbox.id = 'inbox';
      today.id = 'today';
      thisWeek.id = 'thisweek';
      defaultProjects.push(inbox);
      defaultProjects.push(today);
      defaultProjects.push(thisWeek);
    }
  };
  const renderDefaultProjects = () => {
    defaultProjects.forEach((project) => {
      const projectElement = document.createElement('li');
      projectElement.dataset.id = project.id;
      projectElement.classList.add('project-element');
      projectElement.textContent = project.name;
      if (project.id === selectedProjectId) {
        projectElement.classList.add('selected-project');
        projectTitle.textContent = project.name;
      }
      projectElement.dataset.projectId = project.id;
      defaultProjectList.appendChild(projectElement);
    });
  };
  const createProject = () => {
    const newProject = new Project(document.getElementById('projectName').value);
    projects.push(newProject);
  };
  const clearElement = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };
  const render = () => {
    clearElement(projectList);
    clearElement(defaultProjectList);
    renderDefaultProjects();
    renderProjects();
    clearElement(taskContainer);
    const selectedProject = allProjects.find((project) => project.id === selectedProjectId);
    renderTask(selectedProject);
  };
  const renderProjects = () => {
    projects.forEach((project) => {
      const projectElement = document.createElement('li');
      projectElement.dataset.id = project.id;
      projectElement.classList.add('project-element');
      const removeBtn = document.createElement('button');
      removeBtn.classList.add('remove-btn');
      removeBtn.textContent = 'x';
      projectElement.textContent = project.name;
      projectElement.appendChild(removeBtn);
      if (project.id === selectedProjectId) {
        projectElement.classList.add('selected-project');
        projectTitle.textContent = project.name;
      }
      removeBtn.addEventListener('click', (e) => {
        e.target.parentNode.remove();
        console.log(e.target.parentNode);
        removeItemArr(projects, project);
        saveAndRender();
      });
      projectElement.dataset.projectId = project.id;
      projectList.appendChild(projectElement);
    });
  };
  const saveAndRender = () => {
    save();
    render();
  };
  const save = () => {
    localStorage.setItem(localStorageProjectKey, JSON.stringify(projects));
    localStorage.setItem(localStorageSelectedProjectKey, selectedProjectId);
    localStorage.setItem(localStorageDefaultProjectKey, JSON.stringify(defaultProjects));
  };
  const removeItemArr = (arr, value) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  return {
    createTask, createProject, saveAndRender, createDefaultProjects };
})();
const formHandler = (() => {
  const setInputDate = () => {
    const dateInput = document.getElementById('date');
    const today = new Date();
    dateInput.value = today.toISOString().substring(0, 10);
  };
  const taskModal = document.getElementById('taskModal');
  const cancelTask = document.getElementById('cancelTask');
  const taskForm = document.getElementById('taskForm');
  const projectForm = document.getElementById('projectForm');
  cancelTask.addEventListener('click', () => {
    taskModal.style.display = 'none';
    addTask.style.display = 'block';
  });
  addTask.addEventListener('click', (e) => {
    e.target.style.display = 'none';
    taskModal.style.display = 'inline';
    setInputDate();
    document.getElementById('task').select();
  });
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.createTask();
    UI.saveAndRender();
    taskModal.style.display = 'none';
    addTask.style.display = 'block';
    taskForm.reset();
  });
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.createProject();
    UI.saveAndRender();
    projectForm.reset();
    console.log(localStorage);
  });
})();
UI.createDefaultProjects();
UI.saveAndRender();
