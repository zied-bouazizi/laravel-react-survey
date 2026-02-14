<?php

namespace App\Notifications;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SurveyAnsweredNotification extends Notification
{
    use Queueable;

    public function __construct(private Survey $survey, private SurveyAnswer $surveyAnswer)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'survey_id' => $this->survey->id,
            'survey_answer_id' => $this->surveyAnswer->id,
            'survey_title' => $this->survey->title,
            'message' => "New response submitted for \"{$this->survey->title}\".",
        ];
    }
}

