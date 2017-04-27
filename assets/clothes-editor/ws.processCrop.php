<?php

if($_POST) {
    
    define('UPLOAD_DIR', 'cropped/');
    $img = $_POST['image'];
    $img = str_replace('data:image/png;base64,', '', $img);
   
    $img = str_replace(' ', '+', $img);
   
    $dataimg = base64_decode($img);
    
    $nameimg= uniqid() ;

    $fileimg = UPLOAD_DIR . $nameimg . '.png';

    $successimg = file_put_contents($fileimg, $dataimg);

    // $fileimg = UPLOAD_DIR . '56a59db3ed64d.png';
    // $im = new Imagick($fileimg);

    // $im->borderImage("#ffffff", 20, 20);
    // $im->trimImage(0.3);

    // $im->setImagePage($im->getImageWidth(), $im->getImageHeight(), 0, 0);
    // $im->setImageFormat("png");

    // header("Content-Type: image/" . $im->getImageFormat());
    // echo $im->getImageBlob();

    echo json_encode(array("result"=>true,"image"=>$fileimg));

}
?>