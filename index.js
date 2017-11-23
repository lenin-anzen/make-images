const path = require("path");
const Jimp = require("jimp");
const printer = require('printer');
const moment = require('moment');
const uuid = require('node-uuid');

function ucwords(str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}

const fileName = 'assets/img/BadwingMoto.jpg';
const temporalDirectory = 'assets/delete';
const imageCaption1 = 'Su turno es: G590';

console.log('Supported:', printer.getSupportedPrintFormats());

let loadedImage;

Jimp.read(fileName)
    .then(function (image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    })
    .then(function (font) {
        const temporalFileName = path.join(temporalDirectory, uuid.v1()) + '.jpg';
        console.log('temporalFileName:', temporalFileName);
        loadedImage.print(font, 85, 180, imageCaption1)
                   .write(temporalFileName);

        const date = ucwords(moment(new Date).format("dd, MMMM D YYYY, h:mm:ss a"));
        loadedImage.print(font, 20, 220, date)
                   .write(temporalFileName);

        printer.printDirect({
            data: temporalFileName,
            type: 'JPEG',
            success: function(jobID){
                console.log(`sent to printer with ID: ${jobID}`);
            },
            error: function(err){
                console.log(err);
            }
        });
    })
    .catch(function (err) {
        console.error(err);
    });
