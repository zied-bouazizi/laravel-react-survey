<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SurveyResource::collection(Survey::where('user_id', $user->id)->orderBy('created_at', 'desc')->paginate(3));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();

        $data['user_id'] = $request->user()->id;

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);

        // Create new questions
        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;

            $question['data'] = json_encode($question['data'] ?? []);

            SurveyQuestion::create($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($survey->user_id !== $user->id) {
            return abort(403, 'Unauthorized action.');
        }

        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($survey->image) {
                $path = str_replace('storage/', '', $survey->image); 
                Storage::disk('public')->delete($path);
            }
        }

        // Update survey in the database
        $survey->update($data);

        // Get ids as plain array of existing questions
        $existingIds = $survey->questions()->pluck('id')->toArray();
        // Get ids as plain array of new questions
        $newIds = collect($data['questions'])
            ->pluck('id')
            ->filter()
            ->toArray();
        // Find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        //Find questions to add
        $toAdd = array_diff($newIds, $existingIds);

        // Delete questions by $toDelete array
        SurveyQuestion::destroy($toDelete);

        // Create new questions
        foreach ($data['questions'] as $question) {
           if (!isset($question['id'])) {
                $question['survey_id'] = $survey->id;
                $question['data'] = json_encode($question['data'] ?? []);
                SurveyQuestion::create($question);
            }
        }

        // Update existing questions
        $questionMap = collect($data['questions'])
            ->filter(fn ($q) => isset($q['id']))
            ->keyBy('id');

        foreach ($survey->questions as $question) {
            if (isset($questionMap[$question->id])) {
                $updatedQuestionData = $questionMap[$question->id];
                $updatedQuestionData['data'] = json_encode($updatedQuestionData['data'] ?? []);
                $question->update($updatedQuestionData);
            }
        }

        return new SurveyResource($survey);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($survey->user_id !== $user->id) {
            return abort(403, 'Unauthorized action.');
        }

        // If there is an old image, delete it
        if ($survey->image) {
            $path = str_replace('storage/', '', $survey->image); 
            Storage::disk('public')->delete($path);
        }

        $survey->delete();

        return response('', 204);
    }

    /**
     * Save image in local file system and return saved image path
     *
     * @param $image
     * @throws \Exception
     */
    private function saveImage($image)
    {
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $file = Str::random() . '.' . $type;

        Storage::disk('public')->put("images/{$file}", $image);

        return "storage/images/{$file}";
    }

    public function getBySlug(Survey $survey)
    {
        if (!$survey->status) {
            return response('', 404);
        }

        if ($survey->expire_date && Carbon::today()->gt(Carbon::parse($survey->expire_date))) {
            return (new SurveyResource($survey))
                ->additional(['expired' => true])
                ->response()
                ->setStatusCode(200);
        }

        return new SurveyResource($survey);
    }

    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey)
    {
        $surveyAnswer = SurveyAnswer::create([
            'survey_id' => $survey->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        $answers = $request->input('answers', []);

        foreach ($answers as $questionId => $answer) {
            if ($answer !== null && !(is_string($answer) && trim($answer) === '') && !(is_array($answer) && count($answer) === 0)) { 
                $data = [
                'survey_question_id' => $questionId,
                'survey_answer_id' => $surveyAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            SurveyQuestionAnswer::create($data);
            }
        }

        return response("", 201);
    }
}
