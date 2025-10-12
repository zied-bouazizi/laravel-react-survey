import { ArrowTopRightOnSquareIcon, PencilIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";

export default function Surveys() {
  const { surveys } = useStateContext()

  const onDeleteClick = (ev) => {
    ev.preventDefault()
  }

  return (
    <PageComponent title='Surveys'
                   buttons={(<TButton color="green" to="/surveys/create">
                     <PlusCircleIcon className="w-6 h-6 mr-2" />
                     Create new
                   </TButton>)}>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {surveys.map(survey => (
          <div key={survey.id} className="flex flex-col py-4 px-6 shadow-md bg-white hover:bg-gray-50 h-[470px]">
            <img
              src={survey.image_url ||
                'https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg'}
              alt={survey.title}
              className="w-full h-48 object-cover"
            />
            <h4 className="mt-4 text-lg font-bold">{survey.title}</h4>
            <div dangerouslySetInnerHTML={{__html: survey.description}} className="overflow-hidden flex-1"></div>

            <div className="flex justify-between items-center mt-3">
              <TButton to={`surveys/${survey.id}`}>
                <PencilIcon className="w-5 h-5 mr-2 " />
                Edit
              </TButton>
              <div className="flex items-center">
                <TButton href={`/view/survey/${survey.slug}`} circle link>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </TButton>

                {survey.id && <TButton onClick={onDeleteClick} circle link color="red">
                  <TrashIcon className="w-5 h-5" />
                </TButton>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageComponent>
  )
}
