<?php

$config = parse_ini_file('config.ini'); 

try {
  $conn = new PDO("mysql:host=$config['servername'];dbname=$config['dbname']", $config['username'], $config['password']);

  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
 
}
catch(PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}