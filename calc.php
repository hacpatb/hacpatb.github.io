<?php
echo json_encode(Calc());

function Calc() {
    $response = null;
    $date = $_POST['date'];
    if(!$date){
        $response['error'][] = 'Date error';
    }
    $sum = $_POST['sum'];
    $sum = str_replace(' ', '', $sum);
    if(!$sum || ($sum < 1000 || $sum > 3000000)){
        $response['error'][] = 'Sum error';
    } 
    $term = $_POST['term'];
    if(!$term){
        $response['error'][] = 'Term error';
    }
    if($response && count($response['error']) != 0){
        return $response;
    }
    $refill = ($_POST['refill'] == 'no') ? false : true;
    $refillSum = ($refill) ? str_replace(' ','',$_POST['refill-sum']): 0;
    $sumArr[] = $sum;
    $date = strtotime($date);

    for($i = 1; $i < $term; $i++){
        $date = strtotime("+1 months", $date);
        $year = date('Y', $date);
        $month = date('m', $date);
        $yearDays = date('L', $date) ? 366 : 365; 
        $days = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $sumArr[$i] = $sumArr[$i-1] + ($sumArr[$i-1] + $refillSum) * $days * (0.1 / $yearDays) ;
    }
    $response['sum'] = floor(array_pop($sumArr));
    return $response;
}

