"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  TodoListItemState,
  TodoListStatusEnum,
} from "@/models/TodoList.interface"
import { CheckedState } from "@radix-ui/react-checkbox"

import useRequest from "@/hooks/use-request"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import AddTodo from "../add-todo"
import { Button } from "./button"
import Loading from "./loading"
import TodoForm from "./todo-form"

const INITIAL: TodoListItemState = {
  status: 0,
  todoName: "",
  id: "",
}

const TodoList = () => {
  const [todoList, setTodoList] = useState<TodoListItemState[]>([])
  const [selectedItem, setSelectedItem] = useState<TodoListItemState>(INITIAL)
  const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false)
  const [isRemoveOpen, setIsRemoveOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { GET_DATA, PATCH_DATA, PUT_DATA, DELETE_DATA } = useRequest()
  const router = useRouter()

  /**
   * Closing Delete popover
   */
  const closeDeletePopover = () => {
    setSelectedItem(INITIAL)
  }
  /**
   * Closing Edit dialogue
   */
  const handleEditClose = () => {
    setIsEditFormOpen(false)
  }

  /**
   * Fetching get all todo from the server
   */
  const getAllTodoList = async () => {
    const data = await GET_DATA("/api/todo")
    if (data.length > 0) {
      const sortData = data.reverse().sort((a, b) => a.status - b.status)
      setTodoList(sortData)
    }
  }

  /**
   * Update todo status to the server
   *
   * @param item
   * @param value
   */
  const updateStatus = async (item: TodoListItemState, value: CheckedState) => {
    setIsLoading(true)
    const payload = {
      status: value ? TodoListStatusEnum.COMPLETED : TodoListStatusEnum.PENDING,
    }
    const data = await PATCH_DATA(`/api/todo/${item.id}`, payload)
    if (data) {
      getAllTodoList()
    }
    setIsLoading(false)
  }

  /**
   * Update todo content
   *
   * @param item
   * @param value
   */
  const updateTodo = async (item: TodoListItemState, value: string) => {
    setIsLoading(true)
    const payload = {
      todoName: value,
    }
    const data = await PUT_DATA(`/api/todo/${item.id}`, payload)
    if (data) {
      getAllTodoList()
    }
    setIsLoading(false)
  }

  /**
   * Delete todo item
   *
   * @param todoId
   */
  const deleteTodo = async (item: TodoListItemState) => {
    setIsLoading(true)
    const data = await DELETE_DATA(`/api/todo/${item.id}`)
    if (data) {
      getAllTodoList()
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      router.replace("/login")
    } else {
      getAllTodoList()
    }
  }, [])

  return (
    <div className="container flex h-full w-screen flex-col items-center justify-center">
      <div className="flex w-full flex-col">
        <AddTodo handleSubmit={() => getAllTodoList()} />
        <ul className="mt-[1.5rem] flex flex-col gap-4 transition duration-500 ease-in-out">
          {todoList.map((item) => {
            const isActive = selectedItem.id === item.id
            return (
              <Card
                className="flex items-center px-4 py-2 gap-3 shadow-md rounded-sm hover:scale-[1.01] hover:shadow-cyan-500/50 transition duration-500 ease-in-out cursor-pointer group"
                key={item.id}
              >
                <div className="flex items-center flex-1 gap-4">
                  {isActive && isLoading && <Loading />}
                  <Checkbox
                    defaultChecked={
                      item.status === TodoListStatusEnum.COMPLETED
                    }
                    onCheckedChange={(e) => updateStatus(item, e)}
                  />
                  <span
                    className={`flex-1 ${
                      item.status === TodoListStatusEnum.COMPLETED
                        ? "line-through"
                        : ""
                    }`}
                  >
                    {item.todoName}
                  </span>
                </div>

                {item.status === TodoListStatusEnum.PENDING && (
                  <div
                    className={`w-[90px] h-6 flex bg-[#27384b] rounded-full px-2 items-center gap-1 border-[0.5px solid gray]`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z"
                        fill="white"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>

                    <span className="text-sm flex-1 text-center">Pending</span>
                  </div>
                )}

                {item.status === TodoListStatusEnum.COMPLETED && (
                  <div
                    className={`w-[90px] h-6 flex bg-green-200 rounded-full px-2 items-center justify-center gap-1 border-[0.5px solid gray] text-green-700`}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      color="black"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.49991 0.877045C3.84222 0.877045 0.877075 3.84219 0.877075 7.49988C0.877075 11.1575 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1575 14.1227 7.49988C14.1227 3.84219 11.1576 0.877045 7.49991 0.877045ZM1.82708 7.49988C1.82708 4.36686 4.36689 1.82704 7.49991 1.82704C10.6329 1.82704 13.1727 4.36686 13.1727 7.49988C13.1727 10.6329 10.6329 13.1727 7.49991 13.1727C4.36689 13.1727 1.82708 10.6329 1.82708 7.49988ZM10.1589 5.53774C10.3178 5.31191 10.2636 5.00001 10.0378 4.84109C9.81194 4.68217 9.50004 4.73642 9.34112 4.96225L6.51977 8.97154L5.35681 7.78706C5.16334 7.59002 4.84677 7.58711 4.64973 7.78058C4.45268 7.97404 4.44978 8.29061 4.64325 8.48765L6.22658 10.1003C6.33054 10.2062 6.47617 10.2604 6.62407 10.2483C6.77197 10.2363 6.90686 10.1591 6.99226 10.0377L10.1589 5.53774Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>

                    <span className="text-sm text-black flex-1 text-center">
                      Done
                    </span>
                  </div>
                )}

                <div
                  className={`flex gap-3 w-0 h-6 bg-yellow items-center group-hover:w-[4rem] transition-all duration-700 ease-in-out overflow-hidden ${
                    isActive && isRemoveOpen ? "w-[4rem]" : "w-0"
                  }`}
                >
                  <div
                    className="w-4 transition duration-700 ease-in-out"
                    onClick={() => {
                      setSelectedItem(item)
                      setIsEditFormOpen(true)
                      setIsRemoveOpen(false)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      data-name="Layer 1"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3.5,24h15A3.51,3.51,0,0,0,22,20.487V12.95a1,1,0,0,0-2,0v7.537A1.508,1.508,0,0,1,18.5,22H3.5A1.508,1.508,0,0,1,2,20.487V5.513A1.508,1.508,0,0,1,3.5,4H11a1,1,0,0,0,0-2H3.5A3.51,3.51,0,0,0,0,5.513V20.487A3.51,3.51,0,0,0,3.5,24Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.455,10.544l-.789,3.614a1,1,0,0,0,.271.921,1.038,1.038,0,0,0,.92.269l3.606-.791a1,1,0,0,0,.494-.271l9.114-9.114a3,3,0,0,0,0-4.243,3.07,3.07,0,0,0-4.242,0l-9.1,9.123A1,1,0,0,0,9.455,10.544Zm10.788-8.2a1.022,1.022,0,0,1,1.414,0,1.009,1.009,0,0,1,0,1.413l-.707.707L19.536,3.05Zm-8.9,8.914,6.774-6.791,1.4,1.407-6.777,6.793-1.795.394Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <Popover open={isActive && isRemoveOpen}>
                    <PopoverTrigger
                      className="text-red-500 w-6 transition duration-700 ease-in-out"
                      onClick={() => {
                        setSelectedItem(item)
                        setIsRemoveOpen(true)
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                      >
                        <path
                          d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"
                          fill="currentColor"
                        />
                      </svg>
                    </PopoverTrigger>

                    <PopoverContent className="mr-7">
                      <div className="flex flex-col gap-5">
                        <span className="text-sm font-bold">
                          Are you sure, Do you want to delete?
                        </span>
                        <div className="flex justify-end gap-2">
                          <Button
                            className="text-xs p-1 h-auto bg-red-500 hover:bg-red-500 text-white"
                            onClick={() => closeDeletePopover()}
                          >
                            No
                          </Button>
                          <Button
                            className="text-xs p-1 h-auto"
                            onClick={() => {
                              closeDeletePopover()
                              deleteTodo(item)
                            }}
                          >
                            Yes
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </Card>
            )
          })}
        </ul>
      </div>

      <TodoForm
        formType="edit"
        isOpen={isEditFormOpen}
        handleClose={() => handleEditClose()}
        formData={selectedItem}
        handleSubmitBtn={(e) => updateTodo(selectedItem, e)}
      />
    </div>
  )
}

export default TodoList
