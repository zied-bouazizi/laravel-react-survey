import { useParams } from "react-router-dom";
import axiosClient from "../axios";
import { useEffect, useState } from "react";
import PublicQuestionView from "../components/PublicQuestionView";
import NotFound from "./NotFound";
import Head from "../components/Head";

export default function SurveyPublicView() {
    const { slug } = useParams();
    const [survey, setSurvey] = useState({
        questions: []
    });
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [isExpired, setIsExpired] = useState(false);
    const [surveyFinished, setSurveyFinished] = useState(false);
    const answers = {};

    useEffect(() => {
        axiosClient.get(`/survey/get-by-slug/${slug}`)
        .then(({ data }) => {
            setSurvey(data.data);
            if (data.expired) {
                setIsExpired(true);
            }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
              setNotFound(true);
          }
      })
      .finally(() => {
        setLoading(false);
      });
    }, []);

    if (notFound) {
     return <NotFound />;
    }

    function answerChanged(question, value) {
        answers[question.id] = value;
    }

    function onSubmit(ev) {
        ev.preventDefault();
        
        axiosClient.post(`/survey/${survey.id}/answer`, { answers })
            .then(() => {
                setSurveyFinished(true);
            });
    }

    return (
        <>
            <Head title={survey.title} />
            <div className="py-2">
                {loading && <div className="flex justify-center">Loading...</div>}
                {!loading && (
                    <form onSubmit={onSubmit} className="container mx-auto p-4">
                        <div className="grid grid-cols-6 mb-4">
                            <div className="mr-4">
                            <img src={survey.image_url} alt="" />
                            </div>

                            <div className="col-span-5">
                            <h1 className="text-3xl mb-3">{survey.title}</h1>
                            {survey.expire_date && (
                                <p>Expire Date: {survey.expire_date}</p>
                            )}
                            <p className="text-gray-500 text-sm mb-3">{survey.description}</p>
                            </div>
                        </div>
                        {isExpired && (
                            <div className="py-8 px-6 bg-red-500 text-white max-w-lg w-full mx-auto">
                                This survey has expired and is no longer accepting responses.
                            </div>
                        )}
                        {surveyFinished && (
                            <div className="py-8 px-6 bg-emerald-500 text-white max-w-lg w-full mx-auto">
                                Thank you for participating in the survey
                            </div>
                        )}
                        {!surveyFinished && !isExpired && (
                            <>
                                <div>
                                    {survey.questions.map((question, index) => (
                                        <PublicQuestionView 
                                            key={question.id} 
                                            question={question} 
                                            index={index} 
                                            answerChanged={(val) => answerChanged(question, val)} 
                                        />
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                >
                                    Submit
                                </button>
                            </>
                        )}
                    </form>
                )}
            </div>
        </>
    )
}
