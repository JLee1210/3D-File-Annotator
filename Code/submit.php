<?php  
	$file = "json/" . $_POST['fname'] . ".json";
		if (!file_exists($path)) {
	    mkdir('json/', 0777, true);
	}
	$comments = $_POST['comment'];
	$comments = str_replace(array(",", ":"), "_", $comments);
	//$arr = array('user' => $_POST['user'], 'file' => $_POST['file'], 'label' => $_POST['label'], 'date' => $_POST['date'], 'comment' => $_POST['comment']);
	$arr = array('user' => $_POST['user'], 'file' => $_POST['file'], 'label' => $_POST['label'], 'date' => $_POST['date'], 'comment' => $comments);
	$json_string = json_encode($arr, JSON_PRETTY_PRINT);
	file_put_contents($file, $json_string);
	echo $json_string;
?>
