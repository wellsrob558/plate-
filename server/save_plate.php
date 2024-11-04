
<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['plate'])) {
    $plate = $_POST['plate'];

    $stmt = $conn->prepare("INSERT INTO plates (plate) VALUES (?)");
    $stmt->bind_param("s", $plate);
    if ($stmt->execute()) {
        echo "Placa salva com sucesso!";
    } else {
        echo "Erro ao salvar a placa.";
    }
    $stmt->close();
}
$conn->close();
?>
