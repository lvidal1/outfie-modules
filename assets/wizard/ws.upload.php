<?php

$destination = 'tmp/';

$temp = explode(".", $_FILES["file"]["name"]);
$newfilename = round(microtime(true)) . '.' . end($temp);
move_uploaded_file($_FILES["file"]["tmp_name"], $destination . $newfilename);

echo json_encode(array("result"=>1,"token"=>$destination . $newfilename));
?>