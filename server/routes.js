import express from 'express';
import { Task } from './models.js';
import { Op } from 'sequelize';

const router = express.Router();

// Helper to standardise error handling
const handleError = (res, error, status = 500) => {
  console.error(error);
  return res.status(status).json({
    success: false,
    message: error.message || 'An internal server error occurred',
  });
};

// 1. Get dashboard statistics
router.get('/tasks/stats', async (req, res) => {
  try {
    const total = await Task.count();
    const completed = await Task.count({ where: { isCompleted: true } });
    const pending = total - completed;
    const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;

    const lowPriority = await Task.count({ where: { priority: 'low' } });
    const mediumPriority = await Task.count({ where: { priority: 'medium' } });
    const highPriority = await Task.count({ where: { priority: 'high' } });

    res.json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        percentCompleted,
        priorityBreakdown: {
          low: lowPriority,
          medium: mediumPriority,
          high: highPriority,
        }
      }
    });
  } catch (error) {
    handleError(res, error);
  }
});

// 2. Read tasks with optional filtering, search, and sorting
router.get('/tasks', async (req, res) => {
  try {
    const { status, search, category, priority, sortBy } = req.query;
    const whereClause = {};

    // Filter by completed status
    if (status === 'completed') {
      whereClause.isCompleted = true;
    } else if (status === 'active') {
      whereClause.isCompleted = false;
    }

    // Search filter (title or description)
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      whereClause.priority = priority;
    }

    // Sort definition
    let orderClause = [['createdAt', 'DESC']]; // default order
    if (sortBy === 'dueDate') {
      // Put tasks with no due date at the end
      orderClause = [
        [sequelize => sequelize.literal('dueDate IS NULL'), 'ASC'],
        ['dueDate', 'ASC']
      ];
    } else if (sortBy === 'priority') {
      // Custom order: high -> medium -> low
      orderClause = [
        [
          Task.sequelize.literal(`
            CASE priority 
              WHEN 'high' THEN 1 
              WHEN 'medium' THEN 2 
              WHEN 'low' THEN 3 
              ELSE 4 
            END
          `),
          'ASC'
        ],
        ['createdAt', 'DESC']
      ];
    } else if (sortBy === 'title') {
      orderClause = [['title', 'ASC']];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      order: orderClause,
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// 3. Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
      isCompleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// 4. Update task details
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted, priority, category, dueDate } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update attributes if they are present in the request body
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (isCompleted !== undefined) task.isCompleted = isCompleted;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    
    // Allow setting due date to null or setting a date string
    if (dueDate !== undefined) {
      task.dueDate = dueDate === '' ? null : dueDate;
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// 5. Delete an individual task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    handleError(res, error);
  }
});

// 6. Bulk delete all completed tasks
router.post('/tasks/clear-completed', async (req, res) => {
  try {
    const deletedCount = await Task.destroy({
      where: {
        isCompleted: true,
      },
    });

    res.json({
      success: true,
      message: `${deletedCount} completed tasks cleared successfully`,
      deletedCount,
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
