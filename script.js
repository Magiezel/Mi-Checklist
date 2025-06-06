const calendar = document.getElementById('calendar');
const messageArea = document.getElementById('messageArea');
const monthLabel = document.getElementById('monthLabel');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
let currentDate = new Date();

function renderCalendar() {
  calendar.innerHTML = '';
  monthLabel.textContent = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  for (let i = 1; i <= 31; i++) {
    const dayBox = document.createElement('div');
    dayBox.className = 'day';

    const title = document.createElement('h4');
    title.textContent = `${i}`;
    dayBox.appendChild(title);

    const progress = document.createElement('div');
    progress.className = 'progress-bar';
    const fill = document.createElement('div');
    fill.className = 'progress-bar-fill';
    progress.appendChild(fill);
    dayBox.appendChild(progress);

    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks';
    const tasks = getTasks(i);
    let completed = 0;
    tasks.forEach(task => {
      if (task.done) completed++;
      tasksContainer.appendChild(createTaskElement(task.text, task.done, i, task.priority));
    });
    fill.style.width = `${(completed / (tasks.length || 1)) * 100}%`;

    dayBox.appendChild(tasksContainer);

    const addBtn = document.createElement('button');
    addBtn.className = 'add-task';
    addBtn.textContent = '+ Agregar tarea';
    addBtn.onclick = () => addTask(i);
    dayBox.appendChild(addBtn);

    calendar.appendChild(dayBox);
  }
}

function createTaskElement(text, done, day, priority = false) {
  const wrapper = document.createElement('div');
  wrapper.className = 'task';
  wrapper.dataset.priority = priority;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = done;
  checkbox.onchange = () => {
    saveTask(day, text, checkbox.checked, priority);
    renderCalendar();
    if (checkbox.checked) {
      showMessage();
      launchConfetti();
    }
  };

  const label = document.createElement('label');
  label.textContent = text;

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  return wrapper;
}

function addTask(day) {
  const taskText = prompt('Escribe tu tarea u objetivo:');
  if (taskText) {
    const isPriority = confirm('¿Es una tarea prioritaria?');
    saveTask(day, taskText, false, isPriority);
    renderCalendar();
  }
}

function saveTask(day, text, done, priority) {
  const key = getStorageKey();
  let allTasks = JSON.parse(localStorage.getItem(key)) || {};
  if (!allTasks[day]) allTasks[day] = [];
  const index = allTasks[day].findIndex(t => t.text === text);
  if (index !== -1) {
    allTasks[day][index].done = done;
    allTasks[day][index].priority = priority;
  } else {
    allTasks[day].push({ text, done, priority });
  }
  localStorage.setItem(key, JSON.stringify(allTasks));
}

function getTasks(day) {
  const key = getStorageKey();
  const allTasks = JSON.parse(localStorage.getItem(key)) || {};
  return allTasks[day] || [];
}

function getStorageKey() {
  return `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
}

function showMessage() {
  const messages = [
    '¡Vas muy bien!',
    '¡Lo estás logrando!',
    '¡Sigue así, un paso a la vez!',
    '¡Meta a meta, día a día!'
  ];
  const random = Math.floor(Math.random() * messages.length);
  messageArea.textContent = messages[random];
  messageArea.style.display = 'block';
  setTimeout(() => {
    messageArea.style.display = 'none';
  }, 3000);
}

function launchConfetti() {
  const colors = ['#6c63ff', '#f06292', '#81c784', '#ffd54f'];
  let particles = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight / 2,
      dx: Math.random() * 4 - 2,
      dy: Math.random() * -5 - 1,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100
    });
  }

  function animate() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p, i) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y -= p.dy;
      p.dy -= 0.1;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0) requestAnimationFrame(animate);
  }

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  animate();
}

document.getElementById('prevMonth').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

document.getElementById('nextMonth').onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
