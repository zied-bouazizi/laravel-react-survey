<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class SurveyQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = is_array($this->data)
            ? $this->data
            : json_decode($this->data ?? '{}', true);

        if (isset($data['options']) && is_array($data['options'])) {
            $data['options'] = collect($data['options'])
                ->map(fn ($op) => [
                    'text' => $op['text'],
                ])
                ->values()
                ->all();
        }

        return [
            'id' => $this->id,
            'type' => $this->type,
            'question' => $this->question,
            'description' => $this->description,
            'data' => $data,
            'is_required' => $this->is_required,
        ];
    }
}
