var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var textToSpeech = new TextToSpeechV1({
    iam_apikey: '4Jxvz6lErmt4y_Zup_N4xlQrpgBOjdXqjDyun0YuSQI3',
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
        text = '<voice-transformation type="Custom" pitch_range="100%" rate="-60%">' + text + '</voice-transformation>'
        var synthesizeParams = {
            text: text,
            accept: 'audio/wav',
            voice: 'en-US_LisaVoice'
        };

        textToSpeech
            .synthesize(synthesizeParams, function (err, audio) {
                if (err) {
                    console.log(err);
                    res.json({ status: false, message: error })
                }
                textToSpeech.repairWavHeader(audio);
                let filename = 'audio_' + Date.now() + '.wav'
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

