<?php

if(isset($_POST['email']))
{


	$name=$_POST['name'];
	$phoneno=$_POST['phoneno'];
	$msg=$_POST['msg'];
	$email=$_POST['email'];

	$from=$email;
	$admin="RRUDRARAJU@CASAGRANDA.IN";

	$headers = 'MIME-Version: 1.0' . "\r\n";
	$headers.= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	$headers .= 'From: '.$from."\r\n".
	'X-Mailer: PHP/' . phpversion();

	$message="Name : ".$name."<br><br>";
    $message.="Email : ".$email."<br><br>";
    $message.="Phone No : ".$phoneno."<br><br>";
    $message.="Message : ".$msg."<br><br>";

	$subject="Online Customer Inquiry";
	$mail=mail($admin,$subject,$message,$headers);

	if($mail){
	 
	  echo 1;	
	}
	else{
		echo 0;
	}
}

?>