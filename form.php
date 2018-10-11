<?php

if (!($_SERVER["REQUEST_METHOD"] == "POST")) {
   exit;
}

error_reporting(0);

function filtrado($datos){
    $datos = trim($datos); 
    $datos = stripslashes($datos); 
    $datos = htmlspecialchars($datos);
    return $datos;
}

if (isset($_POST["name"]) && $_POST["name"] == "") {
    $errores[] = "El nombre es requerido";
}

if (isset($_POST["email"]) && !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
    $errores[] = "No se ha indicado email o el formato no es correcto";
}

if (isset($_POST["asunto"]) && $_POST["asunto"] == "") {
    $errores[] = "El asunto es requerido";
}

if (isset($_POST["message"]) && $_POST["message"] == "") {
    $errores[] = "El mensaje es requerido";  
}

if (empty($errores)) {

    $name = filtrado($_POST["name"]);
    $email = filtrado($_POST["email"]);
    $asunto = filtrado($_POST["asunto"]);
    $message = filtrado($_POST["message"]);   

    $cuerpo = "<strong>Datos de contacto</strong> <br>";
    $cuerpo .= "Nombre: " . $name;
    $cuerpo .= "<br>";
    $cuerpo .= "E-Mail: " . $email;
    $cuerpo .= "<br>";
    $cuerpo .= "Asunto: " . $asunto;
    $cuerpo .= "<br>";
    $cuerpo .= "Mensaje: " . $message;

    $cabecera = "From: " . $email . "\r\n";
    $cabecera .= "MIME-Version: 1.0\r\n";
    $cabecera .= "Content-Type: text/html; charset=utf-8\r\n";

    $web = "Contacto de chennzys.com";

    if (!mail("louiss862@gmail.com", $web, $cuerpo, $cabecera)) {
        echo "ERROR DE SERVIDOR: mensaje no enviado";
    } else {
        echo "mensaje enviado";
    } exit;
}

 if(isset($errores)){
    foreach ($errores as $error){
        echo $error . '<br/>' ;
    }
}





