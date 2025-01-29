import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
  } from "@headlessui/react";
  import {
    ExclamationTriangleIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    PlusCircleIcon,
  } from "@heroicons/react/24/outline";
  import { CreateEditModalProps } from "../types";
  
  export default function CreateEditModal({
    mode,
    onClose,
    onConfirm,
  }: CreateEditModalProps) {
    const isEditMode = mode === "edit";
  
    return (
      <Dialog open={true} onClose={onClose} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
  
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex items-center justify-center">
          <DialogPanel className="bg-white rounded shadow-lg max-w-md w-full p-6">
            <div className="sm:flex sm:items-start">
              <div
                className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full ${
                  isEditMode ? "bg-yellow-100" : "bg-blue-100"
                } sm:mx-0 sm:size-10`}
              >
                {isEditMode ? (
                  <PencilSquareIcon
                    aria-hidden="true"
                    className="size-6 text-yellow-600"
                  />
                ) : (
                  <PlusCircleIcon
                    aria-hidden="true"
                    className="size-6 text-blue-600"
                  />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  {isEditMode ? "Edit Task" : "Create Task"}
                </DialogTitle>
                <div className="mt-2">
                  <form>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Description
                      </label>
                      <div className="mt-2">
                        <input
                          id="description"
                          name="description"
                          type="text"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="category"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Category
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="category"
                          name="category"
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                          <option>Work</option>
                          <option>Personal</option>
                          <option>Urgent</option>
                        </select>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={onConfirm}
                className={`inline-flex w-full justify-center rounded-md ${
                  isEditMode
                    ? "bg-yellow-600 hover:bg-yellow-500"
                    : "bg-blue-600 hover:bg-blue-500"
                } px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto`}
              >
                {isEditMode ? "Save Changes" : "Create"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    );
  }
  