<?php

$config = parse_ini_file('config.ini'); 

$servername = $config['servername'];
$dbname = $config['dbname'];

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $config['username'], $config['password']);
  
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
}
catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
