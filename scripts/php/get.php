<?php
include "config.php";

try {
  $stmt = $conn->prepare("SELECT * FROM typing_test");
          $stmt->execute();
  $responce = $stmt->fetchAll(PDO::FETCH_ASSOC);

  $json = json_encode($responce);

  echo $json;
}
catch(PDOException $e) {
  echo "Error: " . $e->getMessage();
}
$conn = null;
