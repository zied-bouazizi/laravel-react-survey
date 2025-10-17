import { PlusCircleIcon } from "@heroicons/react/24/outline";
import TButton from "../components/core/TButton";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import PaginationLinks from "../components/PaginationLinks";

export default function Surveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({});

  const onDeleteClick = (ev) => {
    ev.preventDefault()
  }

  const onPageClick = (link) => {
    getSurveys(link.url);
  };

  const getSurveys = (url) => {
    url = url || "/survey";
    setLoading(true);
    axiosClient.get(url).then(({ data }) => {
      setSurveys(data.data);
      setMeta(data.meta);
      setLoading(false);
    });
  };

  useEffect(() => {
    getSurveys();
  }, []);

  return (
    <PageComponent title='Surveys'
                   buttons={(<TButton color="green" to="/surveys/create">
                     <PlusCircleIcon className="w-6 h-6 mr-2" />
                     Create new
                   </TButton>)}>
      
      {loading && <div className="text-center text-lg">loading...</div>}
      {!loading && (
        <div>
          {surveys.length === 0 && 
            <div className="py-8 text-center text-gray-700">
              You don't have surveys created
            </div>
          }
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {surveys.map(survey => (
              <SurveyListItem key={survey.id} survey={survey} onDeleteClick={onDeleteClick} />
            ))}
          </div>
          {surveys.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
        </div>
      )}
    </PageComponent>
  )
}
