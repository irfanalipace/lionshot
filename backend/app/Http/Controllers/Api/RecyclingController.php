<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GetCustomerRequest;
use App\Http\Requests\GetInvoiceByDateRange;
use App\Http\Requests\GetInvoiceById;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class RecyclingController extends BaseController
{
    const ACCOUNT = '953292-sb1';
    const STATE = 'ykv2XLx1BpT5Q0F3MRPHb94j';
    const CLIENT_ID = '8ef7af7246bc8ff69a0242db7651a76f4b0940722ddbe56e78c045115ff5f5c2';
    const CLIENT_SECRET = 'f1568edf10a45bf711f2af487045b3839208665bbcec53165cb28eb13029b92d';
    const VERSION_1 = 'v1';
    const GRANT_TYPE = 'refresh_token';

    const AUTHORIZATION = 'Basic OGVmN2FmNzI0NmJjOGZmNjlhMDI0MmRiNzY1MWE3NmY0YjA5NDA3MjJkZGJlNTZlNzhjMDQ1MTE1ZmY1ZjVjMjpmMTU2OGVkZjEwYTQ1YmY3MTFmMmFmNDg3MDQ1YjM4MzkyMDg2NjViYmNlYzUzMTY1Y2IyOGViMTMwMjliOTJk';
    const REFRESH_TOKEN = 'eyJraWQiOiJjLjk1MzI5Ml9TQjEuMjAyMy0xMS0zMF8wMC0yMy00MCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzOzk0NjA0IiwiYXVkIjpbIjRBRDRCMjc4LTgzQzMtNEI4My05NTkzLUMwMUExN0JGMTJDQTs5NTMyOTJfU0IxIiwiOGVmN2FmNzI0NmJjOGZmNjlhMDI0MmRiNzY1MWE3NmY0YjA5NDA3MjJkZGJlNTZlNzhjMDQ1MTE1ZmY1ZjVjMiJdLCJzY29wZSI6WyJyZXN0bGV0cyJdLCJpc3MiOiJodHRwczovL3N5c3RlbS5uZXRzdWl0ZS5jb20iLCJvaXQiOjE3MDU1NzI0MDcsImV4cCI6MTcwNjE3NzIwNywiaWF0IjoxNzA1NTcyNDA3LCJqdGkiOiI5NTMyOTJfU0IxLnItYS42OTZjNzc5Ny1iZjJlLTQwODktODA3Ni0xNWYyODQ3ZjY2Y2JfMTcwNTU3MjQwNzE4MC4wIn0.NsBpQ-Z_aGSvwz6MM-2cXdvY3ni6LSkW1W9toNNdleLqdU0yGzacdTcvaTinl_CbtP35YvPx6fgfLVCIftlsqxEThjY1IdkIOyFop1OxYpfA2A1fwZEx7_bjYm94jqe0bp9ztM23bAUfjepICZtF8tS4jZULic8l_zNtO27KhyemWQnYJyvmgSLrJQ_aqmWLokMvR9jgC06MDH6tFVfnKearxf9YdGZtf5xNEEhEV_WZhaKO9XmpPu_EvUshx8DtfiyVSKkba6BkjkJKYLfvGnm4I-lBBiTHY0jeOaBgZDlGkNx_u1DFaW0qqNGCEBAGRnmEe83X8NOUpFiWSHIEeryVQQW5s7wmnJt_QdVs-jD_jopScYMvfLj7kS4Oot37rL7N0_wRKArhXSgVqaQZNZlChkBiQkdNdZ0TngOZr4devoINx3aFYuJznaWxacl7p_wKUxpVktacRKDbnr1NcypyITh0Fk3G98P9APVrzWLbe9sd6N3AKnjpFdIHA5sw5EIf7vdRne96zG9VsOT2CqFQZGt6yLmKrAQpygHkGOwzEjzA8Uo420Hd2_4ed4WvKSvO2xu5xSN6gRWzqFeWz-zB0cz7aoCH1keoJCQTp7SkKvLzj4Z5szmePD4BmLTb3waguUFUzCR2784GPWzW7INKx1BH0M4ySHdMEGXMAy4';
    const CALLBACK_URL = 'https://system.netsuite.com/pages/customerlogin.jsp';

    public $access_token;

    private $client;

    public function __construct()
    {
        $this->client = new Client();

        if (Cache::has('access_token')) {
            $this->access_token = Cache::get('access_token');
        } else {
            $this->access_token = $this->getAccessToken();

            if ($this->access_token) {
                Cache::put('access_token', $this->access_token, 3600);
            }

        }
    }

    private function makeRequest($method, $url, $options = [])
    {
        try {
            $response = $this->client->request($method, $url, $options);
            return $response->getBody();
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getAccessToken()
    {
        try {
            $headers = ['Authorization' => self::AUTHORIZATION];
            $url = 'https://' . self::ACCOUNT . '.suitetalk.api.netsuite.com/services/rest/auth/oauth2/' . self::VERSION_1 . '/token';
            $query = [
                'grant_type' => self::GRANT_TYPE,
                'refresh_token' => self::REFRESH_TOKEN
            ];
            $response = $this->makeRequest('GET', $url, [
                'query' => $query,
                'headers' => $headers
            ]);

            return json_decode($response)->access_token;
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getInvoiceByInternalId(GetInvoiceById $request)
    {
        try {

            $params = [
                'script' => '1597',
                'deploy' => '1',
                'invoiceId' => $request->invoiceId
            ];

            $cacheKey = $this->generateCacheKey($params);

            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            $response =  $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);

            $responseBody = json_decode((string)$response, true);
            Cache::put($cacheKey, $responseBody, 3600);
            return $response;
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getInvoiceByDateRange(GetInvoiceByDateRange $request)
    {
        try {
            $params = [
                'script' => '1598',
                'deploy' => '1',
                'fromDate' => $request->fromDate,
                'toDate' => $request->toDate,
                'page' => $request->page,
                'pageSize' => $request->per_page 
            ];

            $cacheKey = $this->generateCacheKey($params);

            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            $response = $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);

            $responseBody = json_decode((string)$response, true);
            Cache::put($cacheKey, $responseBody, 3600);
            return $response;
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getCustomers(GetCustomerRequest $request)
    {
        try {

            $params = [
                'script' => '1600',
                'deploy' => '1',
                'customerId' => $request->customerId,
                'page' => '1'
            ];

            $cacheKey = $this->generateCacheKey($params);

            if (Cache::has($cacheKey)) {
                return Cache::get($cacheKey);
            }

            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            $response = $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);

            $responseBody = json_decode((string)$response, true);
            Cache::put($cacheKey, $responseBody, 3600);
            return $response;

        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    private function generateCacheKey($params)
    {
        return md5(json_encode($params));
    }
}
