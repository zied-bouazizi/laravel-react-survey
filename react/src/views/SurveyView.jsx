import { LinkIcon, PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios.js";
import SurveyQuestions from "../components/SurveyQuestions.jsx";
import TButton from "../components/core/TButton.jsx";
import { v4 as uuidv4 } from "uuid";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import NotFound from "./NotFound.jsx";
import Unauthorized from "./Unauthorized.jsx";
import DeleteSurveyModal from "../components/DeleteSurveyModal.jsx";

export default function SurveyView() {
    const { showToast } = useStateContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const [survey, setSurvey] = useState({
        title: "",
        slug: "",
        status: false,
        description: "",
        image: null,
        image_url: null,
        expire_date: "",
        questions: []
    })
    const [savedStatus, setSavedStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [unauthorized, setUnauthorized] = useState(false);
    const [errors, setErrors] = useState("");
    const [surveyToDelete, setSurveyToDelete] = useState(null);

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setSurvey({
                ...survey,
                image: file,
                image_url: reader.result,
            });

            ev.target.value = "";
        };
        reader.readAsDataURL(file);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {...survey};
        if (payload.image) {
            payload.image = payload.image_url;
        }
        delete payload.image_url;

        let res = null;

        if (id) {
            res = axiosClient.put(`/survey/${id}`, payload);
        } else {
            res = axiosClient.post("/survey", payload);
        }
            res.then(() => {
                navigate("/surveys");
                if (id) {
                    showToast('The survey was updated');
                } else {
                    showToast('The survey was created');
                }
            })
            .catch((err) => {
                if (err && err.response) {
                setErrors(err.response.data.errors);
                window.scrollTo({ top: 0, behavior: "smooth" });
                }
            });
    }

    function onQuestionsUpdate(questions) {
        setSurvey({...survey, questions: questions});
    }

    const addQuestion = () => {
        survey.questions.push({
        id: uuidv4(),
        type: "text",
        question: "",
        description: "",
        data: {},
        });
        setSurvey({ ...survey });
    };

    const confirmSurveyDeletion = (survey) => {
        setSurveyToDelete(survey);
    };

    const closeModal = () => {
        setSurveyToDelete(null);
    };

    const onDeleteClick = (id) => {
        axiosClient.delete(`/survey/${id}`)
            .then(() => {
            navigate('/surveys');
            showToast('The survey was deleted');
            closeModal();
            });
    }

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient.get(`/survey/${id}`)
                .then(({ data }) => {
                    setSurvey(data.data);
                    setSavedStatus(data.data.status);
                }).catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setNotFound(true);
                    } else if (error.response && error.response.status === 403) {
                        setUnauthorized(true);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    if (notFound) {
        return <NotFound />;
    }

    if (unauthorized) {
        return <Unauthorized />;
    }

    return (
        <PageComponent 
            title={!id ? 'Create Survey' : 'Edit Survey'}
            buttons={id && (
                    <>
                        <div className="flex gap-2">
                            {savedStatus && <TButton color="sky" href={`/survey/public/${survey.slug}`}>
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Public Link
                            </TButton>}
                            <TButton color="red" onClick={() => confirmSurveyDeletion(survey)}>
                                <TrashIcon className="h-4 w-4 mr-2" />
                                Delete
                            </TButton>
                        </div>
                    </>
                )}
        >
            {loading && <div className="text-center text-lg">loading...</div>}
            {!loading && 
                <form action="#" method="POST" onSubmit={onSubmit}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                            {errors && (
                                <div className="bg-red-500 text-white py-3 px-3">
                                    {Object.keys(errors).map(key => (
                                        <p key={key}>{errors[key][0]}</p>
                                    ))}
                                </div>
                            )}

                            {/*Image*/}
                            <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <div className="mt-1 flex items-center">
                                {survey.image_url && (
                                    <img src={survey.image_url} alt="" className="w-32 h-32 object-cover" />
                                )}
                                {!survey.image_url && (
                                    <span
                                    className="flex justify-center  items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                                    <PhotoIcon className="w-8 h-8"/>
                                    </span>
                                )}
                                <button
                                type="button"
                                className="relative ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                >
                                <input type="file" className="absolute left-0 top-0 right-0 bottom-0 opacity-0" onChange={onImageChoose}/>
                                Change
                                </button>
                            </div>
                            </div>
                            {/*Image*/}

                            {/*Title*/}
                            <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={survey.title}
                                onChange={ev => setSurvey({...survey, title: ev.target.value})}
                                placeholder="Enter survey title"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                                required
                            />
                            </div>
                            {/*Title*/}

                            {/*Description*/}
                            <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={survey.description || ""}
                                onChange={ev => setSurvey({...survey, description: ev.target.value})}
                                placeholder="Describe your survey"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            ></textarea>
                            </div>
                            {/*Description*/}

                            {/*Expire Date*/}
                            <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="expire_date" className="block text-sm font-medium text-gray-700">
                                Expire Date
                            </label>
                            <input
                                type="date"
                                name="expire_date"
                                id="expire_date"
                                value={survey.expire_date || ""}
                                onChange={ev => setSurvey({...survey, expire_date: ev.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                            </div>
                            {/*Expire Date*/}

                            {/*Active*/}
                            <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                id="status"
                                name="status"
                                type="checkbox"
                                checked={survey.status}
                                onChange={ev => setSurvey({...survey, status: ev.target.checked})}
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="comments" className="font-medium text-gray-700">
                                Active
                                </label>
                                <p className="text-gray-500">Whether to make survey publicly available</p>
                            </div>
                            </div>
                            {/*Active*/}
                        </div>

                        <div className="px-4 py-5 sm:p-6">
                            <button
                                type="button" 
                                className="flex items-center text-sm py-1 px-4 rounded-sm text-white bg-gray-600 hover:bg-gray-700"
                                onClick={addQuestion}>
                                <PlusIcon className="w-4 mr-2"/>
                                Add Question
                            </button>
                            <SurveyQuestions questions={survey.questions} onQuestionsUpdate={onQuestionsUpdate} />   
                        </div>

                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <TButton color="sky">Save</TButton>
                        </div>
                    </div>
                </form>
            }
            <DeleteSurveyModal
                surveyToDelete={surveyToDelete}
                closeModal={closeModal}
                onDeleteClick={onDeleteClick}
            />
        </PageComponent>
    )
}
