import axios from 'axios'

export function binaryToBlob(data) {
    var arr = new Uint8Array(data.length);
    for(var i = 0, l = data.length; i < l; i++) {
        arr[i] = data.charCodeAt(i);
    }
    return new Blob(arr,{type:'image/jpeg'});
    return bb.getBlob();
};

export function getImageBlob(url) {
    var r = new XMLHttpRequest();
    r.open("GET", url, false);
    // 详细请查看: https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data
    // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
    r.overrideMimeType('text/plain; charset=x-user-defined');
    r.send(null);
    var blob = binaryToBlob(r.responseText);
    blob.name = blob.fileName = url.substring(url.lastIndexOf('/') + 1);
    blob.fileType = "image/jpeg"; //"image/octet-stream";
    console.log(blob);
    return blob;
};
