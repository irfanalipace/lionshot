<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;

class RecyclingController extends Controller
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

    public function __construct()
    {
//        $this->middleware('auth:api');

    }

    public function getAccessToken()
    {
        $client = new Client();

        $headers = [ 'Authorization' => self::AUTHORIZATION ];

        $uri = 'https://'.self::ACCOUNT.'.suitetalk.api.netsuite.com/services/rest/auth/oauth2/'.self::VERSION_1.'/token';

        $query = [
            'grant_type' => self::GRANT_TYPE,
            'refresh_token' => self::REFRESH_TOKEN
        ];

        $response = $client->requestAsync('POST', $uri, ['query' => $query, 'headers' => $headers])->wait();
        return $response->getBody();
    }

    public function getCode(Request $request)
    {
        $client = new Client();
        $headers = [ 'Authorization' => self::AUTHORIZATION ];

        $uri = 'https://'.self::ACCOUNT.'.suitetalk.api.netsuite.com/services/rest/auth/oauth2/'.self::VERSION_1.'/authorize';

        $query = [
            'response_type' => 'code',
            'client_id' => self::CLIENT_ID,
            'redirect_uri' => self::CALLBACK_URL,
            'state' => self::STATE,
            'scope' => 'restlets'
        ];

        $response = $client->requestAsync('GET', $uri, ['query' => $query, 'headers' => $headers])->wait();
        return $response->getBody();
    }
//    {
//
//        $client = new Client();
//        $headers = [ 'Authorization' => self::AUTHORIZATION ];
//
//        $request = new Request('GET', 'https://953292-sb1.app.netsuite.com/app/login/oauth2/authorize.nl?scope=restlets&redirect_uri=https://oauth.pstmn.io/v1/browser-callback&response_type=code&client_id=8ef7af7246bc8ff69a0242db7651a76f4b0940722ddbe56e78c045115ff5f5c2&state=ykv2XLx1BpT5Q0F3MRPHb94j&prompt=none', $headers);
//        $res = $client->sendAsync($request)->wait();
//        echo $res->getBody();
//
//    }



}
