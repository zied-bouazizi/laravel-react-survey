<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSurveyAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; 
    }

 /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        $survey = $this->route('survey');
        $rules = [
            'answers' => 'array', 
        ];

        if ($survey && $survey->questions) {
            foreach ($survey->questions as $question) {
                if ($question->is_required) {
                    if ($question->type === 'checkbox') {
                        $rules['answers.' . $question->id] = 'required|array|min:1';
                    } else {
                        $rules['answers.' . $question->id] = 'required';
                    }
                }
            }
        }

        return $rules;
    }

    public function messages()
    {
        $messages = [];
        $survey = $this->route('survey');

        if ($survey && $survey->questions) {
            foreach ($survey->questions as $question) {
                if ($question->is_required) {
                    $messages['answers.' . $question->id . '.required'] = 'This question is required.';
                }
            }
        }

        return $messages;
    }
}
