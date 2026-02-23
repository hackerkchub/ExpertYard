import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  PageWrapper,
  CalendarContainer,
  HeaderSection,
  TitleSection,
  CalendarIcon,
  Title,
  DateDisplay,
  NavControls,
  NavButton,
  MonthYearDisplay,
  TodayButton,
  CalendarGrid,
  WeekDays,
  WeekDay,
  DaysGrid,
  DayCell,
  DayNumber,
  TaskIndicator,
  TaskDot,
  TaskCount,
  TasksSection,
  TasksHeader,
  SelectedDateTitle,
  AddTaskButton,
  TasksList,
  TaskItem,
  TaskCheckbox,
  TaskContent,
  TaskTitle,
  TaskMeta,
  TaskTime,
  TaskPriority,
  TaskActions,
  TaskActionBtn,
  EmptyState,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalForm,
  FormGroup,
  Label,
  Input,
  TextArea,
  Select,
  ModalActions,
  ModalButton,
  Spinner,
} from "./Calendar.styles";

// Helper functions
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const formatDate = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const formatDisplayDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

// Priority options
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#40e0d0' },
  { value: 'medium', label: 'Medium', color: '#ffb020' },
  { value: 'high', label: 'High', color: '#ff4d4d' }
];

// Week days
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '12:00',
    priority: 'medium'
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const selectedDateKey = formatDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  // Load tasks from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const savedTasks = localStorage.getItem('calendar_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      localStorage.setItem('calendar_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return tasks[selectedDateKey] || [];
  }, [tasks, selectedDateKey]);

  // Check if a date has tasks
  const hasTasks = useCallback((year, month, day) => {
    const dateKey = formatDate(year, month, day);
    return tasks[dateKey] && tasks[dateKey].length > 0;
  }, [tasks]);

  // Get task count for a date
  const getTaskCount = useCallback((year, month, day) => {
    const dateKey = formatDate(year, month, day);
    return tasks[dateKey]?.length || 0;
  }, [tasks]);

  // Check if a date is today
  const isToday = useCallback((year, month, day) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  }, []);

  // Check if a date is selected
  const isSelected = useCallback((year, month, day) => {
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  }, [selectedDate]);

  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Date selection
  const handleDateClick = (day) => {
    setSelectedDate(new Date(year, month, day));
  };

  // Modal handlers
  const openAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      time: '12:00',
      priority: 'medium'
    });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      time: task.time,
      priority: task.priority
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add/Edit task
  const handleSubmitTask = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;

    const newTask = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      time: formData.time,
      priority: formData.priority,
      completed: editingTask?.completed || false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => {
      const dateTasks = prev[selectedDateKey] || [];
      
      if (editingTask) {
        // Edit existing task
        const updatedTasks = dateTasks.map(task => 
          task.id === editingTask.id ? newTask : task
        );
        return { ...prev, [selectedDateKey]: updatedTasks };
      } else {
        // Add new task
        return { ...prev, [selectedDateKey]: [...dateTasks, newTask] };
      }
    });

    closeModal();
  };

  // Toggle task completion
  const toggleTaskComplete = (taskId) => {
    setTasks(prev => {
      const dateTasks = prev[selectedDateKey] || [];
      const updatedTasks = dateTasks.map(task =>
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      return { ...prev, [selectedDateKey]: updatedTasks };
    });
  };

  // Delete task
  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => {
        const dateTasks = prev[selectedDateKey] || [];
        const updatedTasks = dateTasks.filter(task => task.id !== taskId);
        
        if (updatedTasks.length === 0) {
          const { [selectedDateKey]: _, ...rest } = prev;
          return rest;
        }
        
        return { ...prev, [selectedDateKey]: updatedTasks };
      });
    }
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      if (isValidDay) {
        const hasTasksOnDay = hasTasks(year, month, dayNumber);
        const taskCount = getTaskCount(year, month, dayNumber);
        const isTodayDay = isToday(year, month, dayNumber);
        const isSelectedDay = isSelected(year, month, dayNumber);

        days.push(
          <DayCell
            key={i}
            $isToday={isTodayDay}
            $isSelected={isSelectedDay}
            $hasTasks={hasTasksOnDay}
            onClick={() => handleDateClick(dayNumber)}
          >
            <DayNumber $isSelected={isSelectedDay}>
              {dayNumber}
            </DayNumber>
            {hasTasksOnDay && (
              <TaskIndicator>
                {taskCount <= 3 ? (
                  // Show individual dots for up to 3 tasks
                  tasks[formatDate(year, month, dayNumber)]
                    ?.slice(0, 3)
                    .map((task, idx) => (
                      <TaskDot key={idx} $priority={task.priority} />
                    ))
                ) : (
                  // Show count for more than 3 tasks
                  <TaskCount $isSelected={isSelectedDay}>
                    +{taskCount}
                  </TaskCount>
                )}
              </TaskIndicator>
            )}
          </DayCell>
        );
      } else {
        // Empty cell
        days.push(<DayCell key={i} style={{ opacity: 0.3 }} />);
      }
    }

    return days;
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
    return option ? option.label : priority;
  };

  if (loading) {
    return (
      <PageWrapper>
        <CalendarContainer>
          <Spinner />
        </CalendarContainer>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <CalendarContainer>
        {/* Header Section */}
        <HeaderSection>
          <TitleSection>
            <CalendarIcon>📅</CalendarIcon>
            <Title>Calendar</Title>
            <DateDisplay>
              <span>{formatDisplayDate(new Date())}</span>
            </DateDisplay>
          </TitleSection>

          <NavControls>
            <NavButton onClick={goToPreviousMonth}>←</NavButton>
            <MonthYearDisplay>
              {currentDate.toLocaleString('default', { month: 'long' })} {year}
            </MonthYearDisplay>
            <NavButton onClick={goToNextMonth}>→</NavButton>
            <TodayButton onClick={goToToday}>
              📍 Today
            </TodayButton>
          </NavControls>
        </HeaderSection>

        {/* Calendar Grid */}
        <CalendarGrid>
          <WeekDays>
            {WEEK_DAYS.map(day => (
              <WeekDay key={day}>{day}</WeekDay>
            ))}
          </WeekDays>
          <DaysGrid>
            {renderCalendarDays()}
          </DaysGrid>
        </CalendarGrid>

        {/* Tasks Section */}
        <TasksSection>
          <TasksHeader>
            <SelectedDateTitle>
              Tasks for {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
              <span>{selectedDateTasks.length} tasks</span>
            </SelectedDateTitle>
            <AddTaskButton onClick={openAddModal}>
              + Add New Task
            </AddTaskButton>
          </TasksHeader>

          <TasksList>
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => (
                <TaskItem key={task.id} $priority={task.priority}>
                  <TaskCheckbox 
                    $completed={task.completed}
                    onClick={() => toggleTaskComplete(task.id)}
                  >
                    {task.completed && '✓'}
                  </TaskCheckbox>
                  
                  <TaskContent>
                    <TaskTitle $completed={task.completed}>
                      {task.title}
                    </TaskTitle>
                    <TaskMeta>
                      <TaskTime>🕐 {task.time}</TaskTime>
                      <TaskPriority $priority={task.priority}>
                        ● {getPriorityLabel(task.priority)}
                      </TaskPriority>
                    </TaskMeta>
                    {task.description && (
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '8px'
                      }}>
                        {task.description}
                      </div>
                    )}
                  </TaskContent>

                  <TaskActions>
                    <TaskActionBtn onClick={() => openEditModal(task)}>
                      ✎
                    </TaskActionBtn>
                    <TaskActionBtn $delete onClick={() => deleteTask(task.id)}>
                      🗑
                    </TaskActionBtn>
                  </TaskActions>
                </TaskItem>
              ))
            ) : (
              <EmptyState>
                <span>📋</span>
                No tasks for this day
                <br />
                <small style={{ fontSize: '14px', opacity: 0.5 }}>
                  Click "Add New Task" to create one
                </small>
              </EmptyState>
            )}
          </TasksList>
        </TasksSection>
      </CalendarContainer>

      {/* Add/Edit Task Modal */}
      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </ModalTitle>
              <ModalClose onClick={closeModal}>✕</ModalClose>
            </ModalHeader>

            <ModalForm onSubmit={handleSubmitTask}>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description (optional)"
                />
              </FormGroup>

              <FormGroup>
                <Label>Time</Label>
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Priority</Label>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  {PRIORITY_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <ModalActions>
                <ModalButton type="button" onClick={closeModal}>
                  Cancel
                </ModalButton>
                <ModalButton type="submit" $primary>
                  {editingTask ? 'Update' : 'Add'} Task
                </ModalButton>
              </ModalActions>
            </ModalForm>
          </Modal>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}