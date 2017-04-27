<?php
	// To get data in php
	$data = json_decode(file_get_contents('php://input'),true);

	$path = 'ws.user.json';
	if (file_exists($path)) { unlink ($path); }
	$f = fopen($path, "a+");
	fwrite($f, json_encode($data));
	fclose($f);

	echo json_encode($data);

?>