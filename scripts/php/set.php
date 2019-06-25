<?php
include "config.php";

try {
  $data = json_decode(file_get_contents("php://input"),true);

  $sql = $conn->prepare("INSERT INTO typing_test (name, speed, accuracy)
    VALUES (:name, :speed, :accuracy)");
  $sql->bindParam(':name', $data['name'], PDO::PARAM_STR, 12);
  $sql->bindParam(':speed', $data['speed'], PDO::PARAM_INT);
  $sql->bindParam(':accuracy', $data['accuracy'], PDO::PARAM_STR, 12);

  $sql->execute();
  echo "New record created successfully";
}
catch(PDOException $e) {
  echo "Error: " . $e->getMessage();
}
$conn = null;
