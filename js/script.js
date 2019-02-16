'use strict'
$(function () {
    let powerange = [];
    let sumRange = $('.sum-range')[0];
    powerange[0] = new Powerange(sumRange, { min: 1000, max: 3000000, start: 1000000 });
    sumRange.onchange = function () {
        $('#sum').val(this.value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    };

    let refillSumRange = $('.refill-sum-range')[0];
    powerange[1] = new Powerange(refillSumRange, { min: 1000, max: 3000000, start: 1000000 });
    refillSumRange.onchange = function () {
        $('#refill-sum').val(this.value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
    };

    $('#date').datepicker({ dateFormat: 'dd.mm.yy' });

    $('.range-min').each((index, value) => {
        $(value).text('1 тыс. руб.');
    });

    $('.range-max').each((index, value) => {
        let newText = ($(value).text() * 1).toLocaleString('ru');
        $(value).text(newText);
    });

    $('input[name=refill]').change(function () {
        if ($(this).val() == 'yes') {
            $('.table-refill-sum').show();
        } else {
            $('.table-refill-sum').hide();
        }
    });
    $('input[name=refill]').change(function () {
        if ($(this).val() == 'yes') {
            $('.table-refill-sum').show();
        } else {
            $('.table-refill-sum').hide();
        }
    });
    $('input[name=refill-sum], input[name=sum]').focusout(function () {

        let moneyType = ($(this).attr('name') == 'sum') ? 0 : 1;
        let money = $(this).val().replace(/\s+/g, '');
        let newVal = '';
        if (money < 1000) {
            setSliderValue(powerange[moneyType], 1000);
            newVal = '1 000';
        } else if (money > 3000000) {
            setSliderValue(powerange[moneyType], 3000000);
            newVal = '3 000 000';
        } else {
            setSliderValue(powerange[moneyType], money);
            newVal = money.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }
        $(this).val(newVal);
    });

});

$('#form-calc').submit(function (e) {
    let form = $(this);
    let url = form.attr('action');
    let date = $(form.find('#date')).val();
    let validDate = /^(?:(?:31(\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (!validDate.test(date)) {
        alert('Поле дата оформления вклада не заполнено или заполнено не верно');
    } else {
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: form.serialize(),
            success: (data) => {
                if (data) {
                    if (data['error']) {
                        alert(data['error'].join(', '));
                    } else if (data['sum']) {
                        $('#result').text(`${data['sum'].toLocaleString('ru')} руб`);
                    }
                } else {
                    alert('Ошибка обработки данных');
                }
            },
            error: (err) => {
                alert('Ошибочка вышла');
                console.log(err);
            }
        });
    }
    e.preventDefault();
});


/**
 * set slider new value
 * 
 * @param {object} sliderInstance 
 * @param {number} newValue       
 */

function setSliderValue(sliderInstance, newValue) {
    console.assert((newValue >= sliderInstance.options.min && newValue <= sliderInstance.options.max),
        'New value is less then slider min value or greater then slider max value!');
    var changed = false;
    var offset;
    var maxValue = sliderInstance.options.max;
    var minValue = sliderInstance.options.min;
    var stepIndex;
    var stepsArr = (sliderInstance.options.step) ? sliderInstance.steps : null;
    var value = (sliderInstance.options.decimal) ? (Math.round(newValue * 100) / 100) : Math.round(newValue);

    if (!sliderInstance.options.step) {

        var persentNewValueOfVal = (newValue - minValue) * 100 / (maxValue - minValue);
        offset = (sliderInstance.slider.offsetWidth - sliderInstance.handle.offsetWidth) * persentNewValueOfVal / 100;

    } else {

        stepIndex = ((value - minValue) / sliderInstance.options.step).toFixed(0);
        offset = stepsArr[+stepIndex];

    }

    changed = (sliderInstance.element.value != value) ? true : false;
    sliderInstance.setPosition(offset);
    sliderInstance.element.value = value;
    sliderInstance.options.callback();
    if (changed) sliderInstance.changeEvent();
}