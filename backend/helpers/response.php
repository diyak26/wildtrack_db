<?php

function json_success($data = null) {
    echo json_encode(['success' => true, 'data' => $data]);
    exit;
}

function json_error($message = 'Error', $code = 400) {
    http_response_code($code);
    echo json_encode(['success' => false, 'error' => $message]);
    exit;
}
