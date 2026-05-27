<?php
/**
 * bm24api-20251210 — Huidu game launch proxy (deploy on your PHP host).
 * Point Next.js GAME_LAUNCH_PROXY_URL to this script.
 */
error_log("bm24GameLaunch.php started: " . date('Y-m-d H:i:s'));

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// =========================
// CONFIG — bm24api-20251210
// =========================
$aesKey = "4b5dd9df7e1f4a1c64c937ba38629c0f";
$customAgencyUid = "0b98f74aa493413ce882a9edef9f9ede";
$serverUrl = "https://jsgame.live/game/v2";

// =========================
// INPUT
// =========================
$raw = file_get_contents("php://input");
$input = json_decode($raw, true);

if (!is_array($input)) {
    echo json_encode(["code" => 1, "msg" => "Invalid JSON"]);
    exit;
}

if (empty($input["member_account"]) || empty($input["game_uid"])) {
    echo json_encode([
        "code" => 1,
        "msg"  => "Missing required fields",
        "missing" => ["member_account", "game_uid"]
    ]);
    exit;
}

if (empty($input["timestamp"])) {
    $input["timestamp"] = (string) round(microtime(true) * 1000);
}

$credit = isset($input["credit_amount"]) ? (float) $input["credit_amount"] : 0.0;

// =========================
// AES FUNCTION
// =========================
function encryptAES256ECB($text, $key)
{
    $key = str_pad(substr($key, 0, 32), 32, "\0");
    $enc = openssl_encrypt($text, "AES-256-ECB", $key, OPENSSL_RAW_DATA);
    return base64_encode($enc);
}

function huiduRequest($serverUrl, $body)
{
    $ch = curl_init($serverUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $res = curl_exec($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    return [$res, $http, $err];
}

// =========================
// BUILD BASE PAYLOAD
// =========================
$basePayload = [
    "agency_uid"     => $customAgencyUid,
    "member_account" => $input["member_account"],
    "game_uid"       => $input["game_uid"],
    "timestamp"      => $input["timestamp"],
    "credit_amount"  => (string)$credit,
    "currency_code"  => $input["currency_code"] ?? "BDT",
    "language"       => $input["language"] ?? "en",
    "platform"       => $input["platform"] ?? 1,
    "home_url"       => $input["home_url"] ?? "http://localhost:3000",
    "transfer_id"    => $input["transfer_id"] ?? ("tx_" . bin2hex(random_bytes(6))),
];

// =====================================================
// STEP 1: GAME LAUNCH CALL
// =====================================================
$enc1 = encryptAES256ECB(json_encode($basePayload, JSON_UNESCAPED_SLASHES), $aesKey);

$send1 = [
    "agency_uid" => $customAgencyUid,
    "timestamp"  => $input["timestamp"],
    "payload"    => $enc1
];

list($resp1, $code1, $err1) = huiduRequest($serverUrl, $send1);
$data1 = json_decode($resp1, true);

if ($resp1 === false || !isset($data1["code"]) || $data1["code"] != 0) {
    echo json_encode(["code" => 2, "msg" => "Launch failed", "raw" => $resp1, "curl_error" => $err1]);
    exit;
}

$providerBal = isset($data1["payload"]["after_amount"]) ? (float)$data1["payload"]["after_amount"] : 0.0;
$delta = $credit - $providerBal;

// =====================================================
// STEP 2: DEPOSIT / WITHDRAW
// =====================================================
$txn = $basePayload;
$txn["credit_amount"] = rtrim(rtrim(number_format($delta, 2, '.', ''), '0'), '.');
$txn["transfer_id"] = "txn_" . bin2hex(random_bytes(8));

$enc2 = encryptAES256ECB(json_encode($txn, JSON_UNESCAPED_SLASHES), $aesKey);

$send2 = [
    "agency_uid" => $customAgencyUid,
    "timestamp"  => $input["timestamp"],
    "payload"    => $enc2
];

list($resp2, $code2, $err2) = huiduRequest($serverUrl, $send2);
$data2 = json_decode($resp2, true);

// =====================================================
// STEP 3: OPEN (credit 0)
// =====================================================
$open = $basePayload;
$open["credit_amount"] = "0";
$open["transfer_id"] = "op_" . bin2hex(random_bytes(6));

$enc3 = encryptAES256ECB(json_encode($open, JSON_UNESCAPED_SLASHES), $aesKey);

$send3 = [
    "agency_uid" => $customAgencyUid,
    "timestamp"  => $input["timestamp"],
    "payload"    => $enc3
];

list($resp3, $code3, $err3) = huiduRequest($serverUrl, $send3);
$data3 = json_decode($resp3, true);

// =====================================================
// FINAL RESPONSE
// =====================================================
echo json_encode([
    "code" => 0,
    "msg"  => "Succeed",
    "step1" => $data1,
    "step2" => $data2,
    "step3" => $data3,
    "payload" => $data3["payload"] ?? []
]);

exit;
