var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var textToSpeech = new TextToSpeechV1({
    iam_apikey: 'xKzGTa1Vy1xJsGS7GmsZQ-CV-ZXqB1AmJq8m__fZNYWu',
    url: 'https://stream.watsonplatform.net/text-to-speech/api'
});

class mainController {
    constructor() {

    }

    index(req, res) {
        res.render('index');
    }

    uploadText(req, res) {
        let text = req.body.text
        text = '<voice-transformation type="Custom" rate="-100%">' + text + '</voice-transformation>'
        var synthesizeParams = {
            text: text,
            accept: 'audio/mp3',
            voice: 'en-US_LisaVoice'
        };

        textToSpeech
            .synthesize(synthesizeParams, function (err, audio) {
                if (err) {
                    console.log(err);
                    res.json({ status: false, message: err })
                }
                // textToSpeech.repairWavHeader(audio);
                let filename = 'audio_' + Date.now() + '.mp3'
                fs.writeFileSync('public/audio/' + filename, audio);
                res.json({ status: true, filename: filename })
            });
    }

    removeFile(req, res) {
        let filename = req.body.filename;
        let url = process.cwd() + '/public/audio/' + filename;
        try {
            if (fs.existsSync(url)) {
                fs.unlink(url, (err) => {
                    console.log('successfully deleted ' + url);
                    res.send('ok')
                });
            }

        }
        catch (err) {
            console.log(err)
            res.send('faild')
        }
    }
}

module.exports = mainController;

