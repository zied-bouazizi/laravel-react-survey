import { ArrowTopRightOnSquareIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import TButton from "./core/TButton";

export default function SurveyListItem({ survey, onDeleteClick }) {
  return (
    <div className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
        <img
            src={survey.image_url}
            alt={survey.title}
            className="w-full h-56 object-cover"
        />
        <h4 className="mt-4 text-lg font-bold">{survey.title}</h4>
        <div dangerouslySetInnerHTML={{__html: survey.description}} className="overflow-hidden flex-1"></div>

        <div className="flex justify-between items-center mt-3">
            <TButton color="sky" to={`/surveys/${survey.id}`}>
            <PencilIcon className="w-5 h-5 mr-2 " />
            Edit
            </TButton>
            <div className="flex items-center">
            {survey.status && <TButton color="sky" href={`/survey/public/${survey.slug}`} circle link>
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </TButton>}

            {survey.id && <TButton onClick={() => onDeleteClick(survey.id)} circle link color="red">
                <TrashIcon className="w-5 h-5" />
            </TButton>}
            </div>
        </div>
    </div>
  )
}
