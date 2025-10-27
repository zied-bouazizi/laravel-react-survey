<?php

namespace App\Http\Requests;

use App\Enums\QuestionTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreSurveyRequest extends FormRequest
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

    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => $this->user()->id
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:1000',
            'image' => 'nullable|string',
            'status' => 'required|boolean',
            'description' => 'nullable|string',
            'expire_date' => 'nullable|date|after_or_equal:today',
            
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.type' => ['required', new Enum(QuestionTypeEnum::class)],
            'questions.*.description' => 'nullable|string',
            'questions.*.is_required' => 'boolean',

            'questions.*.data' => 'nullable|array',
            'questions.*.data.options' => 'nullable|array',
            'questions.*.data.options.*.text' => 'required_with:questions.*.data.options|string',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            foreach ($this->input('questions', []) as $index => $question) {
                $this->validateQuestionOptions($validator, $index, $question);
            }
        });
    }

    protected function validateQuestionOptions($validator, int $index, array $question): void
    {
        if (!in_array($question['type'], ['select', 'radio', 'checkbox'])) {
            return;
        }

        $options = $question['data']['options'] ?? [];
        $min = $question['type'] === 'checkbox' ? 1 : 2;
        $optionWord = ($question['type'] === 'checkbox') ? 'option' : 'options';

        if (count($options) < $min) {
            $validator->errors()->add(
                "questions.$index.data.options",
                "This question requires at least $min $optionWord."
            );
        }

        $texts = [];

        foreach ($options as $optionIndex => $option) {
            $text = strtolower(trim($option['text'] ?? ''));

            if (in_array($text, $texts)) {
                $validator->errors()->add(
                    "questions.$index.data.options.$optionIndex.text",
                    "This question has duplicate option values."
                );
            }

            $texts[] = $text;
        }
    }

    public function messages() {
        return [
            'questions.required' => 'Your survey must have at least one question.',
        ]; 
    }
}
