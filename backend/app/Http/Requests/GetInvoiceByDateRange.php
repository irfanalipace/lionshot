<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GetInvoiceByDateRange extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fromDate' => 'required | date | date_format:m/d/Y',
            'toDate' => 'required | date | date_format:m/d/Y',
            'page' => 'required | integer',
        ];
    }
}
