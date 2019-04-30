export default function decrypter(data, key) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var xored = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result.push(String.fromCharCode(xored));
    }
    return result.join('');
}