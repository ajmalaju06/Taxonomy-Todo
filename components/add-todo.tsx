"use client"

import React, { useState } from "react"
import { TodoListStatusEnum } from "@/models/TodoList.interface"

import useRequest from "@/hooks/use-request"
import { Button } from "@/components/ui/button"
import TodoForm from "@/components/ui/todo-form"

interface AddTodoProps {
  handleSubmit?: () => void
}

const AddTodo: React.FC<AddTodoProps> = ({ handleSubmit }) => {
  const [isAddItemOpen, setIsAddItemOpen] = useState<boolean>(false)

  const { POST_DATA } = useRequest()

  /**
   * Close Modal of ADD Form
   */
  const closeDialog = () => {
    setIsAddItemOpen(false)
  }

  /**
   * Server API call for Create new todo
   * @param value
   */
  const addItem = async (value: string) => {
    const payload = { todoName: value, status: TodoListStatusEnum.PENDING }
    const data = await POST_DATA("/api/todo", payload)
    if (data) {
      if (handleSubmit) handleSubmit()
    }
  }

  return (
    <div className="flex mt-[2rem]">
      <span className="text-3xl font-bold  flex-1">Todo list</span>
      <Button className="h-[35px]" onClick={() => setIsAddItemOpen(true)}>
        Add Todo
      </Button>
      <TodoForm
        isOpen={isAddItemOpen}
        handleClose={() => closeDialog()}
        handleSubmitBtn={(item) => addItem(item)}
      />
    </div>
  )
}

export default AddTodo
