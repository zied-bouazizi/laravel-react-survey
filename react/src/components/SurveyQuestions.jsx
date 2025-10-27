import { PlusIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import QuestionEditor from "./QuestionEditor";

export default function SurveyQuestions({questions, errors, onQuestionsUpdate}) {
  const addQuestion = (index) => {
    const newQuestion = {
      _uuid: uuidv4(),
      type: "text",
      question: "",
      description: "",
      data: {},
      is_required: false,
    };

    const newQuestions = [...questions];
    newQuestions.splice(index ?? questions.length, 0, newQuestion);

    onQuestionsUpdate(newQuestions);
  };

  const questionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    onQuestionsUpdate(newQuestions);
  };

  const deleteQuestion = (index) => {
    onQuestionsUpdate(questions.filter((_, i) => i !== index));
  };
  
  return (
     <>
      <div className="flex justify-between py-2">
        <h3 className="text-2xl font-bold">Questions</h3>
        <button
          type="button"
          className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
          onClick={() => addQuestion()}
        >
          <PlusIcon className="w-4 mr-2"/>
          Add Question
        </button>
      </div>
      {questions.length ? (
        questions.map((q, ind) => (
          <QuestionEditor
            key={q._uuid}
            index={ind}
            question={q}
            errors={errors}
            questionChange={questionChange}
            addQuestion={addQuestion}
            deleteQuestion={deleteQuestion}
          />
        ))
      ) : (
        <div className="text-gray-400 text-center py-4">
          You don't have any questions created
        </div>
      )}
    </>
  )
}
