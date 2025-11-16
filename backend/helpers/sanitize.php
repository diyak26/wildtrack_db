<?php
function get_json_input() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return null;
    }
    return $data;
}

// small sanitizer helper
function s($value) {
    if ($value === null) return null;
    return trim($value);
}
