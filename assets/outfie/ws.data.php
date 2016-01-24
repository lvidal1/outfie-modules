<?php
	// To get data in php
	$data = json_decode(file_get_contents('php://input'),true);
	print_r($data);

	$path = 'ws.user.json';
	if (file_exists($path)) { unlink ($path); }
	$f = fopen($path, "a+");
	fwrite($f, json_encode($data));
	fclose($f);

?>