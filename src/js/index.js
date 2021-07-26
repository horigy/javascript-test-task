
import '../scss/index.scss';
import data from '../data/rawdata';
import datepickerFactory from 'jquery-datepicker';

datepickerFactory($);


$(document).ready(function() {
    init()
});

function init() {
    $('#first').css("display", "block");
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            start();
            resolve();
        });
    });
    promise.then(setTimeout(() => next(), 3000))
}

function start() {
    var w = window.innerWidth / 2;
    var h = window.innerHeight / 2;
    $('#box-1').css({"top": "0", "left": "0", "right": "unset", "bottom": "unset"});
    $('#box-2').css({"top": "0", "right": "0", "bottom": "unset", "left": "unset"});
    $('#box-3').css({"bottom": "0", "left": "0", "top": "unset", "right": "unset"});
    $('#box-4').css({"bottom": "0", "right": "0", "top": "unset", "left": "unset"});
    $('#box-1').animate({left: -w, top: -h}, 3000);
    $('#box-2').animate({right: -w, top: -h}, 3000);
    $('#box-3').animate({left: -w, bottom: -h}, 3000);
    $('#box-4').animate({right: -w, bottom: -h}, 3000);
}

function next() {
    $('#first').css("display", "none");
    $('#second').css("display", "block");
    let promise = new Promise((resolve) => {
        $({deg: 180}).animate({deg: 0}, {
            duration: 2000,
            step: function(now) {
                $('#secondBtn').css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });
        resolve();
    });
    promise.then(setTimeout(() => {
        $('#secondBtn').click(function() {
            showModal();
        });
    }, 2000));
}

function showModal() {
    console.log('click');
    $('#second').css("display", "none");
    $('#modal').css("display", "block");
    selectMark();
}

function appendOptions(type, arr) {
    let select = $(type);
    select.find('option:not(:first)').remove();
    for(let i=0; i<arr.length; i++) {
        let text = arr[i].toUpperCase();
        select.append(`"<option value="${arr[i]}">${text}</option>"`)
    }
}

function selectMark() {
    let cars = data.cars;
    let marks = [];
    for(let i=0; i<data.cars.length; i++) {
        if(marks.indexOf(cars[i].mark) == -1) {
            marks.push(cars[i].mark);
        }
    }
    appendOptions("#mark", marks);
    $("#mark").change(function() {
        selectModel($(this).val())
    });
}

function selectModel(val) {
    let cars = data.cars;
    if(!val == 0) {
        let markArr = cars.filter((e) => {
            return e.mark == val;
        });
        let models = [];
        markArr.map((e) => {
            if(models.indexOf(e.model) == -1) {
                models.push(e.model);
            }
        });
        appendOptions("#model", models);
        $("#model").change(function() {
            selectYear($(this).val(), markArr);
        });
    }
}

function selectYear(model, markArr) {
    if(!model == 0) {
        let modelArr = markArr.filter((e) => {
            return e.model == model;
        });
        let years = [];
        modelArr.map((e) => {
            if(years.indexOf(e.year) == -1) {
                years.push(e.year);
            }
        });
        appendOptions("#year", years);
        $("#year").change(function() {
            selectDelivery($(this).val(), modelArr)
        });
    }
}

function selectDelivery(year, modelArr) {
    if(!year == 0) {
        let yearArr = modelArr.filter((e) => {
            return e.year = year;
        })
        $("#deliver").css("display", "block");
        $("#deliver").click(function(e) {
            e.preventDefault();
            showCalendar(yearArr)
        });
    }
}

function showCalendar(arr) {
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: 'Предыдущий',
        nextText: 'Следующий',
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
    let dateArr = arr[0].delivery.split('-');
    let start = dateArr[0];
    let end = dateArr[1];
    $('#datepicker').datepicker('setDate', null);
    $('#datepicker').datepicker({
        minDate: new Date(start),
        maxDate: new Date(end),
        onSelect: function(dateText) {
            showFinal(dateText, arr[0])
        }
    });
    $('#modal').css("display", "none");
    $('#pickDate').css("display", "flex");
    $('#pickText').text(`c ${start} до ${end}`);
    $('#datepicker').change(() => console.log('pick', $(this).val()))
}

function showFinal(date, obj) {
    $('#finalText').text(`Вы выбрали ${obj.mark} ${obj.model} ${obj.year}, доставка ${date}`);
    $('#pickDate').css("display", "none");
    $('#final').css("display", "flex");
    $('#restart').click(function() {
        $('#final').css("display", "none");
        init();
    });

}
