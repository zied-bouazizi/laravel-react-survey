import { TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modal";
import TButton from "./core/TButton";

export default function DeleteSurveyModal({ surveyToDelete, closeModal, onDeleteClick }) {
  return (
    <Modal show={Boolean(surveyToDelete)} onClose={closeModal} maxWidth="xl">
      <div className="px-6 py-8 space-y-6">
        <h2 className="text-2xl font-semibold">
          Are you sure you want to delete this survey?
        </h2>

        <div className="flex justify-end gap-3">
          <TButton color="gray" onClick={closeModal}>
            <XCircleIcon className="h-6 w-6 mr-2" />
            Cancel
          </TButton>

          <TButton color="red" onClick={() => surveyToDelete && onDeleteClick(surveyToDelete.id)}>
            <TrashIcon className="h-5 w-5 mr-2" />
            Delete Survey
        </TButton>
        </div>
      </div>
    </Modal>
  );
}
