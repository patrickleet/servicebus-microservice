import { TodoList } from 'models/TodoList'

// digest and enqueue work with repositories - we don't have a repository in these tests 
TodoList.prototype.digest = jest.fn();
TodoList.prototype.enqueue = TodoList.prototype.emit;

describe.only('TodoList', () => {
  it('should construct with new items array, and inherit from Entity', () => {
    const todoList = new TodoList()

    expect(todoList.items.length).toBe(0)
    expect(typeof todoList.digest).toBe('function')
    expect(typeof todoList.on).toBe('function')
    expect(typeof todoList.emit).toBe('function')
  })

  it('should get initialized using initialize', (done) => {
    const todoList = new TodoList()
    const id = 1

    todoList.on('initialized', (list) => {
      expect(list.items.length).toBe(0)
      expect(list.id).toBe(id)
      expect(todoList.digest).toBeCalledWith('initialize', { id })
      done()
    })

    todoList.initialize({ id })
  })

  it('should add items with addItem', (done) => {
    const todoList = new TodoList()
    const newItem = {
      id: 'rocket-ship-54',
      todo: 'Make this',
      complete: false
    }

    todoList.on('item.added', (addedItem) => {
      expect(todoList.items.length).toBe(1)
      expect(addedItem.id).toBeDefined()
      expect(addedItem.todo).toEqual(newItem.todo)
      expect(addedItem.complete).toEqual(newItem.complete)
      expect(todoList.digest).toBeCalledWith('addItem', newItem)
      done()
    })

    todoList.addItem(newItem)
  })

  it('should throw an error when items are missing todo when calling addItem', () => {
    const todoList = new TodoList()
    const newItem = {
      id: 'rocket-ship-54',
      complete: false
    }

    expect(() => { todoList.addItem(newItem) }).toThrow()
    expect(() => { todoList.addItem() }).toThrow()
  })

  it('should generate and id when calling addItem', (done) => {
    const todoList = new TodoList()
    const newItem = {
      todo: 'this test'
    }

    todoList.on('item.added', (addedItem) => {
      expect(todoList.items.length).toBe(1)
      expect(addedItem.id).toBeDefined()
      done()
    })

    todoList.addItem(newItem)
  })

  it('should mark specified item as complete when markAsComplete is called', (done) => {
    const todoList = new TodoList()
    const newItem = {
      id: 'space-hat-31',
      todo: 'Make this',
      complete: false
    }

    todoList.on('item.completed', (completedItem) => {
      expect(todoList.items.length).toBe(1)
      expect(completedItem.id).toBe(newItem.id)
      expect(completedItem.complete).toBe(true)
      expect(todoList.digest).toBeCalledWith('addItem', newItem)
      done()
    })

    todoList.addItem(newItem)
    todoList.markItemAsComplete(newItem)
  })
})
