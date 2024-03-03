import React, { useEffect } from "react"
import { TodoFormState, TodoListItemState } from "@/models/TodoList.interface"
import { Form, Formik } from "formik"
import * as yup from "yup"

import { Button } from "./button"
import { Dialog, DialogContent, DialogTitle } from "./dialog"
import { Input } from "./input"

/**
 * Interface for todo form
 */
interface TodoFormProps {
  isOpen: boolean
  handleClose: () => void
  handleSubmitBtn?: (value: string) => void
  formType?: "add" | "edit"
  formData?: TodoListItemState
}

const TodoForm: React.FC<TodoFormProps> = ({
  handleSubmitBtn,
  isOpen,
  handleClose,
  formType = "add",
  formData,
}) => {
  // initialization value for todo ADD/EDIT
  const initialValues: TodoFormState =
    formType === "add"
      ? { todoContent: "" }
      : { todoContent: formData?.todoName || "" }

  /**
   * Todo validation for content
   */
  const formSchema = yup.object().shape({
    todoContent: yup
      .string()
      .min(2, "Content is too short!")
      .required("Content is required"),
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent style={{ maxWidth: 450 }}>
        <DialogTitle>
          {formType === "add" ? "Add Todo" : "Edit Todo"}
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            onSubmit={(values, actions) => {
              if (handleSubmitBtn) handleSubmitBtn(values.todoContent)
              actions.setSubmitting(false)
              handleClose()
            }}
            validationSchema={formSchema}
          >
            {({ errors, values, handleChange }) => (
              <Form className="flex flex-col gap-4">
                <Input
                  placeholder="Type todo item"
                  name="todoContent"
                  value={values.todoContent}
                  onChange={handleChange}
                />

                {errors.todoContent && (
                  <span className="text-xs text-red-500">
                    {errors.todoContent}
                  </span>
                )}
                <div className="flex justify-end gap-4">
                  <Button
                    className="bg-red-700 hover:bg-red-700 text-white"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(TodoForm)
