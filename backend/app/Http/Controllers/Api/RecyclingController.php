<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\GetCustomerRequest;
use App\Http\Requests\GetInvoiceByDateRange;
use App\Http\Requests\GetInvoiceById;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;

class RecyclingController extends BaseController
{
    const ACCOUNT = '953292-sb1';
    const STATE = 'ykv2XLx1BpT5Q0F3MRPHb94j';
    const CLIENT_ID = '8ef7af7246bc8ff69a0242db7651a76f4b0940722ddbe56e78c045115ff5f5c2';
    const CLIENT_SECRET = 'f1568edf10a45bf711f2af487045b3839208665bbcec53165cb28eb13029b92d';
    const VERSION_1 = 'v1';
    const GRANT_TYPE = 'refresh_token';

    const AUTHORIZATION = 'Basic OGVmN2FmNzI0NmJjOGZmNjlhMDI0MmRiNzY1MWE3NmY0YjA5NDA3MjJkZGJlNTZlNzhjMDQ1MTE1ZmY1ZjVjMjpmMTU2OGVkZjEwYTQ1YmY3MTFmMmFmNDg3MDQ1YjM4MzkyMDg2NjViYmNlYzUzMTY1Y2IyOGViMTMwMjliOTJk';
    const REFRESH_TOKEN = 'eyJraWQiOiJjLjk1MzI5Ml9TQjEuMjAyMy0xMS0zMF8wMC0yMy00MCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzOzk0NjA0IiwiYXVkIjpbIjRBRDRCMjc4LTgzQzMtNEI4My05NTkzLUMwMUExN0JGMTJDQTs5NTMyOTJfU0IxIiwiOGVmN2FmNzI0NmJjOGZmNjlhMDI0MmRiNzY1MWE3NmY0YjA5NDA3MjJkZGJlNTZlNzhjMDQ1MTE1ZmY1ZjVjMiJdLCJzY29wZSI6WyJyZXN0bGV0cyJdLCJpc3MiOiJodHRwczovL3N5c3RlbS5uZXRzdWl0ZS5jb20iLCJvaXQiOjE3MDQ5NTk2NzUsImV4cCI6MTcwNTU2NDQ3NSwiaWF0IjoxNzA0OTU5Njc1LCJqdGkiOiI5NTMyOTJfU0IxLnItYS5hMGE2NjAxMC1jMDYwLTRkNmEtOTRjOC04MTljNWE3MGU2ZTFfMTcwNDk1OTY3NTgwOS4wIn0.UdkaY_VckcJKoZ89epSzqPZa9Je4chYEthA9hdUvlqeCLXpzCS5OVonSNNUHD3kTd5L_fUs1xCZDaLVvaso3QnRLojlFs4JGUT5mZgJQR66zIa5echpciQmdfsteuy_l3XqC8YcU6HG5TAXi1dd0XhPscjwBw9onQntVyDWSsUljmG4CB3ouUGzHkkpwPjHzw3DJZLskIqqVeuEgAGzVXnfSrlmGb93tjgHi8XBi87n42Lx7HU4J3BpQUKIchMXtgQg4Bltacc0togTEr8EbMYSa8t0U7EPwNR0Jpto_6Utez6IJX6rOkwDbcuSxy5S3ivGgD_uNZTePAXuKi9xO6ThUoHXd78Ou8YKCjWcu0gJXWd3S_AzdqKX-T5NVGJNyz1f0-kgZmUHi0umyFIiVAwKb9l5u1MNIQgsWh4DoFTG5kNTvmOcacrjPqqkQTsk8nmRK5eyLEIoD4WBDD8uTQdL22rZUl96CuSe1FpcRJouFrwhCrfuVLXRnVYPUE97_5owQM_U6EXFGCeZdeuB7H76QjswOTA7dzDMQGTyBe5r2JhRCg9MkbdT18sKmohcJD5zIsTWxCFrKiYmSRYpctO5TdNQrQRUp-carjyZ0GXqcLNA9nIFyqhC9_F1kEzyE38VTkBclFlt46WHGIsNOaL6NQCpwDaqDjrZMC4IXiaY';
    const CALLBACK_URL = 'https://system.netsuite.com/pages/customerlogin.jsp';

    public $access_token;

    private $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->access_token = $this->getAccessToken();
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
        try{
            $headers = ['Authorization' => self::AUTHORIZATION];
            $url = 'https://' . self::ACCOUNT . '.suitetalk.api.netsuite.com/services/rest/auth/oauth2/' . self::VERSION_1 . '/token';
            $query = [
                'grant_type' => self::GRANT_TYPE,
                'refresh_token' => self::REFRESH_TOKEN
            ];
            $response =  $this->makeRequest('GET', $url, [
                'query' => $query,
                'headers' => $headers
            ]);

            return json_decode($response)->access_token;
        }
        catch (\Exception $e)
        {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getInvoiceByInternalId(GetInvoiceById $request)
    {
        try{
            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $params = [
                'script' => '1597',
                'deploy' => '1',
                'invoiceId' => $request->invoiceId
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            return $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);
        }
        catch (\Exception $e)
        {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getInvoiceByDateRange(GetInvoiceByDateRange $request)
    {
        try{
            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $params = [
                'script' => '1598',
                'deploy' => '1',
                'fromDate' => $request->fromDate,
                'toDate' => $request->toDate,
                'page' => $request->page
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            return $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);
        }
        catch (\Exception $e)
        {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }

    public function getCustomers(GetCustomerRequest $request)
    {
        try{
            $headers = [
                'Authorization' => 'Bearer ' . $this->access_token,
                'Cookie' => '_abck=B55A2E2B82A1BC7FC776BCCD988FFA99~-1~YAAQVfV0aCQn/WSMAQAAXBOSCwupmB1SAtiesO4EY4Y+5mKq/XRDOemJVn9RS5N/t6V0drZX/1+wDgxBkAo9cfz13hNty2ipm/U5DDRSuWTeDWo62HqMZhsAH2wyZRxeQX0taDdSeXeZcPmyC88sd+6T6J6AVkolln+7eVHicuHNjAyUR1h/JOjdDVqd/5HbrxJfUrWmPcRDEQwfoCruUdFMHshMGeOUNbn9LVX4TLf6AyODH/+ZZLLl7Kyy6UvvfVX1X41mHvDJibQLm/hfBexwBN8AIglOo+vdd3lmJy/6xYGSXMI3Tz51p0FJ9lx5l9YraUdhkkpOOGZ+kcuWkt7UVVuGhUhMaUXZfOGCHT7Q3YIVFJJO0Ool8g==~-1~-1~1705299690; bm_sz=B876C6978A1F7EFB936FD37310AFD4FD~YAAQVfV0aCUn/WSMAQAAXBOSCxbht7eZyVd5JeZOFmbP4XnIKfK9a5pFGQhp2CB7RBRzVLQ5Or9e1kUuRI5x6n1cxdKYzlugXC+e5JD4cSvQP1lwDR/QdYNs0csjXHPwyt0mwjIGpPzxdrnNvVg9GNzt7JgPSfZolhdKYBnWtrciVQ+GSIK19GiAgtw8rpr0TpNfOG8fcLmwzq+BZelTi52DYH8ChNoW8vsIa53G+6McUDc9eovKoo+jpMzDV+LFP9/t5MwHel4fDS9A0feS3p+scdIl5jJuCTCKGApI5QuoQZE9dw==~4539702~3682868'
            ];

            $params = [
                'script' => '1600',
                'deploy' => '1',
                'customerId' => $request->customerId,
                'page' => '1'
            ];

            $uri = 'https://' . self::ACCOUNT . '.restlets.api.netsuite.com/app/site/hosting/restlet.nl';

            return $this->makeRequest('GET', $uri, [
                'query' => $params,
                'headers' => $headers
            ]);
        }
        catch (\Exception $e)
        {
            return $this->sendError($e->getMessage(), 'There was an error.', 500);
        }
    }
}
