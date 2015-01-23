<?php

if (isset($_POST) && $_POST) {
    $_POST = _valid($_POST);
    $data = $_POST;
    
    $result = array();
    $errors = array();
    
    $required = array('email');
    foreach ($required as $r) {
        if (!isset($data[$r]) || !trim($data[$r])) {
            if (!isset($errors['required'])) {
                $errors['required'] = array($r);
            } else {
                $errors['required'][] = $r;
            }
            $errors['no' . $r] = $r;
        }
    }
    
    // Своего рода АнтиБот
    if (!isset($data['klaatu']) || $data['klaatu'] != 'klaatu_ajax') {
        $errors['klaatu'] = 'klaatu';
    }
    
    if (!$errors) {
        //успех
        $result['success'] = 1;
    } else {
        $result['errors'] = $errors;
    }
    
    if (is_ajax()){
        ajaxOut($result);
    }
} else {
    if (is_ajax()){
        ajaxOut(array("error" => array("nodata" => 1)));
    }
}
header("HTTP/1.x 301 Moved Permanently");
header("Location: /");
die('<a href="/">перейти</a>');


/**
 * Рекурсивно делает валидацию post данных
 *
 * @param mixed $data
 * @param bool $script
 * @param bool $mysql
 * @param bool $tags
 * @param int $length
 * @param bool $slashes
 * @return mixed
 */
function _valid($data, $script = true, $mysql = false, $tags = true, $length = null, $slashes = false) {
    if (is_array($data) && $data) {
        foreach ($data as &$value) {
            $value = _valid($value, $script, $mysql, $tags, $length);
        }
    } else {
        // Удаляет теги <script></script> и все, что находится внутри
        if ($script) {
            $ptn = '#<script[^>]*>.*?</script>#is';
            $data = preg_replace($ptn, "", $data);
            if ($data == '') {
                return '';
            }
        }

        // Защита от sql-иньекций
        if ($mysql) {
            $data = mysql_real_escape_string($data);
        }

        // Защита от PHP и HTML тэгов
        if ($tags) {
            $data = strip_tags($data);
            if ($data == '') {
                return '';
            }
        }

        // Обрезание строки до нужной длины
        if (!is_null($length) && is_numeric($length) && $length > 0) {
            $data = mb_substr($data, 0, $length);
        }

        // Заменяем "\" на "\\"
        if ($slashes && !get_magic_quotes_gpc()) {
            $data = addslashes($data);
        }
    }
    return $data;
}

function sendmail($from, $to, $subject, $message, $send_html = true) {
    $headers = '';
    if ($send_html) {
        $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    }
    $headers .= 'From: ' . $from . "\r\n";
    return mail($to, $subject, $message, $headers);
}

function ajaxOut($out = null, $type = 'text/html', $charset = 'utf-8') {
    if (is_null($out))
        $out = 'empty';

    if (is_array($out))
        $out = rjson_encode($out);

    header("Content-Type: $type; charset=$charset");
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");  // disable IE caching
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");
    echo $out;
    exit;
}

function rjson_encode($arr = null) {
    if (is_null($arr))
        return false;
    if (!is_array($arr))
        $arr = array($arr);

    $result = "";
    $assoc = true;
    foreach ($arr as $k => $v) {
        if ($result)
            $result .= ', ';
        if (is_numeric($k)) {
            $assoc = false;
        } else {
            $result .= '"' . $k . '" :';
        }
        if (is_array($v)) {
            $result .= rjson_encode($v);
        } else {
            $result .= ' "' . str_replace("\'", "'", addslashes($v)) . '"';
        }
    }
    if ($assoc)
        $result = '{' . $result . '}';
    else
        $result = '[' . $result . ']';

    return preg_replace("/[\n\r\t]+/", "", $result);
}

function is_ajax() {
    return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == "XMLHttpRequest" ? true : false);
}
