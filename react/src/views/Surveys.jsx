import { PlusCircleIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import { useStateContext } from "../contexts/ContextProvider";
import SurveyListItem from "../components/SurveyListItem";

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
          <SurveyListItem key={survey.id} survey={survey} onDeleteClick={onDeleteClick} />
        ))}
      </div>
    </PageComponent>
  )
}
