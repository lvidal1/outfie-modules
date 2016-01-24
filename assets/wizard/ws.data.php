<?php
	// To get data in php
	$data = json_decode(file_get_contents('php://input'),true);
	print_r($data["p1"]);
	print_r($data["p2"]);
	print_r($data["p3"]);
	print_r($data["p4"]);
	print_r($data["p5"]);
	print_r($data["p6"]);
	print_r($data["p7"]);

?>