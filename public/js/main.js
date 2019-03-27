var filename = '';
$(() => {
    $('#start').click(() => {
        let text = $('#text').val();
        if (text == '') {
            $('#text').focus();
        } else {
            $('#loading').removeClass('hide');
            if (!$('#audioDiv').hasClass('hide')) $('#audioDiv').addClass('hide');
            if (!$('#error').hasClass('hide')) $('#error').addClass('hide');
            $.ajax({
                url: '/uploadText',
                method: 'POST',
                data: {
                    text: text
                },
                success: (res) => {
                    $('#loading').addClass('hide');
                    if (res.status) {
                        filename = res.filename;
                        loadFileAsBlob(res.filename);
                    } else {
                        $('#error').removeClass('hide');
                    }
                }
            })
        }
    })
})

function loadFileAsBlob(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/audio/' + file);
    xhr.responseType = "blob";
    xhr.onload = function () {
        analyze_data(xhr.response);
    }
    xhr.send();
}

function analyze_data(blob) {
    var myReader = new FileReader();
    myReader.readAsArrayBuffer(blob)

    myReader.addEventListener("loadend", function (e) {
        var buffer = e.srcElement.result;
        var blob = new Blob([buffer], { type: 'audio/mp3' });
        var blobUrl = URL.createObjectURL(blob);
        $('#audioDiv').removeClass('hide');
        $('#audio').attr('src', blobUrl);
        removeRequest();
    });
}

function removeRequest() {
    console.log(filename)
    $.ajax({
        url: '/removeFile',
        method: 'POST',
        data: {
            filename: filename
        },
        success: (res) => {
        }
    })
}