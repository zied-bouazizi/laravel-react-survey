import { v4 as uuidv4 } from "uuid";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useStateContext } from "../contexts/ContextProvider";

export default function QuestionEditor({
  index = 0,
  question,
  errors,
  addQuestion,
  deleteQuestion,
  questionChange,
}) {
  const { questionTypes } = useStateContext();
  const options = question.data?.options || [];

  function upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function shouldHaveOptions(type) {
    return ["select", "radio", "checkbox"].includes(type);
  }

  function onTypeChange(ev) {
    const newType = ev.target.value;

    let newData = question.data || {};

    if (!shouldHaveOptions(question.type) && shouldHaveOptions(newType)) {
      newData = {
        ...newData,
        options: [{ _uuid: uuidv4(), text: "" }],
      };
    }

    if (shouldHaveOptions(question.type) && !shouldHaveOptions(newType)) {
      newData = {};
    }

    questionChange(index, {
      ...question,
      type: newType,
      data: newData,
    });
  }

  function addOption() {
    questionChange(index, {
      ...question,
      data: {
        ...question.data,
        options: [
          ...(question.data.options || []),
          { _uuid: uuidv4(), text: "" }
        ]
      }
    });
  }
  function deleteOption(op) {
    questionChange(index, {
      ...question,
      data: {
        ...question.data,
        options: question.data.options.filter(o => o._uuid !== op._uuid)
      }
    });
  }

  function isOptionsValid(question) {
    if (!["select", "radio", "checkbox"].includes(question.type)) return true;
    
    const min = ["radio", "select"].includes(question.type) ? 2 : 1;
    return question.data?.options?.length >= min;
  }

  const optionErrors = Object.keys(errors?.[index] || {})
    .filter(key => key.startsWith('data.options'))
    .map(key => errors[index][key]);

  const optionValues = options.map(op => op.text.trim()).filter(v => v !== "");
  const duplicatesExist = optionValues.some((v, i) => optionValues.indexOf(v) !== i);

  const showOptionError = duplicatesExist || (errors?.[index]?.['data.options']);

  return (
    <>
      <div id={`question-${index}`} className="py-2">
        <div className="flex justify-between items-start mb-3">
          <h4 className="flex-1 min-w-0 break-words">
            <span className="whitespace-nowrap">{index + 1}.&nbsp;</span>
            {question.question}
            {question.is_required && <span className="text-red-600">*</span>}
          </h4>
          <div className="flex items-center ml-2">
            <button
              type="button"
              className="
                flex
                items-center
                text-xs
                py-1
                px-3
                mr-2
                rounded-sm
                text-white
                bg-gray-600
                hover:bg-gray-700"
              onClick={() => addQuestion(index + 1)}
            >
              <PlusIcon className="w-4 mr-1" />
              Add
            </button>
            <button
              type="button"
              className="
                flex
                items-center
                text-xs
                py-1
                px-3
                rounded-sm
                border border-transparent
                text-red-600
                hover:border-red-600
                font-semibold
                "
              onClick={() => deleteQuestion(index)}
            >
              <TrashIcon className="w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
        <div className="flex gap-3 justify-between mb-3">
          {/* Question Text */}
          <div className="flex-1">
            <label
              htmlFor={`question-text-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Question
            </label>
              <input
                type="text"
                name="question_text"
                id={`question-text-${index}`}
                value={question.question}
                onChange={ev =>
                  questionChange(index, {
                    ...question,
                    question: ev.target.value
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                required
              />
            {showOptionError && (
              <div className="text-xs text-red-600 mt-1">
                {duplicatesExist 
                  ? "This question has duplicate option values." 
                  : optionErrors.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
          </div>
          {/* Question Text */}

          {/* Question Type */}
          <div>
            <label
              htmlFor={`question-type-${index}`}
              className="block text-sm font-medium text-gray-700 w-40"
            >
              Question Type
            </label>
            <select
              id={`question-type-${index}`}
              name="question_type"
              value={question.type}
              onChange={onTypeChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            >
              {questionTypes.map((type) => (
                <option value={type} key={type}>
                  {upperCaseFirst(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Question Type */}

        {/* Required Checkbox */}
        <div className="flex items-start mb-3">
          <div className="flex h-5 items-center">
              <input
              id={`question-required-${index}`}
              name="question_required"
              type="checkbox"
              checked={question.is_required}
              onChange={(ev) =>
                questionChange(index, {
                  ...question,
                  is_required: ev.target.checked,
                })
              }
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
          </div>
          <div className="ml-2 text-sm">
              <label htmlFor={`question-required-${index}`} className="font-medium text-gray-700">
              Required
              </label>
          </div>
        </div>

        {/*Description*/}
        <div className="mb-3">
          <label
            htmlFor={`question-description-${index}`}
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="question_description"
            id={`question-description-${index}`}
            value={question.description || ""}
            onChange={(ev) =>
              questionChange(index, {
                ...question,
                description: ev.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
          ></textarea>
        </div>
        {/*Description*/}

        <div>
        {shouldHaveOptions(question.type) && (
          <div>
            <h4 className="text-sm font-semibold mb-1 flex justify-between items-center ">
              Options
              <button
                onClick={addOption}
                type="button"
                className="flex
                items-center
                text-xs
                py-1
                px-2
                rounded-sm
                text-white
                bg-gray-600
                hover:bg-gray-700"
              >
                Add
              </button>
            </h4>

            {options.length === 0 && (
              <div className="text-xs text-gray-600 text-center py-3">
                You don't have any options defined
              </div>
            )}
            {options.length > 0 && (
              <div>
                {options.map((op, ind) => (
                  <div key={op._uuid} className="flex items-center mb-1">
                    <label
                      htmlFor={`question-${index}-option-${ind}`}
                      className="sr-only"
                    >
                      Option {ind + 1} for Question {index + 1}
                    </label>
                    <span className="w-6 text-sm">{ind + 1}.</span>
                    <input
                      type="text"
                      id={`question-${index}-option-${ind}`}
                      name={`question-${index}-option-${ind}`}
                      value={op.text}
                      onChange={(ev) => {
                        const newOptions = options.map(o =>
                          o._uuid === op._uuid
                            ? { ...o, text: ev.target.value }
                            : o
                        );

                        questionChange(index, {
                          ...question,
                          data: {
                            ...question.data,
                            options: newOptions,
                          },
                        });
                      }}
                      className="w-full
                      rounded-sm
                      py-1
                      px-2
                      text-xs
                      border border-gray-300
                      focus:border-sky-500"
                      required
                    />
                    <button
                      onClick={() => deleteOption(op)}
                      type="button"
                      className="            h-6
                        w-6
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border border-transparent
                        transition-colors
                        hover:border-red-100"
                    >
                      <TrashIcon className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {!isOptionsValid(question) && !errors?.[index]?.['data.options'] && (
              <p className="text-xs text-red-600">
                This question needs at least {question.type === 'checkbox' ? 1 : 2} option{question.type === 'checkbox' ? '' : 's'}.
              </p>
            )}
          </div>
        )}
        </div> 
      </div>
      <hr />
    </>
  );
}