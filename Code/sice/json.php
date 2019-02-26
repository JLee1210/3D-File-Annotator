<?php 
	//if(isset($_POST['submit'])) {
	  $file = "json/" . $_POST['fname'] . ".json";
	  $arr = array('user' => $_POST['user'], 'file' => $_POST['file'], 'label' => $_POST['label'], 'date' => $_POST['date'], 'comment' => $_POST['comment']);
	  $json_string = json_encode($arr, JSON_PRETTY_PRINT);
	  file_put_contents($file, $json_string);
	//}
?>
