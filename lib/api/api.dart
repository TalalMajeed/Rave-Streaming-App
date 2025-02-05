import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:developer';
import 'package:dart_des/dart_des.dart';

Future<List<dynamic>> getSongs(String query) async {
  final url =
      "https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=$query";

  int retryCount = 0;
  while (retryCount < 5) {
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final Map<String, dynamic> jsonResponse = json.decode(response.body);
        final data = jsonResponse['songs']['data'] as List<dynamic>;
        List<dynamic> songs = [];

        for (var song in data) {
          songs.add({
            'id': song['id'],
            'name': (song['title'] as String)
                .replaceAll("&quot;", '"')
                .replaceAll("&amp;", "&"),
            'album': (song['album'] as String)
                .replaceAll("&quot;", '"')
                .replaceAll("&amp;", "&"),
            'artist': (song['more_info']?['primary_artists'] as String? ?? '')
                .replaceAll("&quot;", '"')
                .replaceAll("&amp;", "&"),
            'image': song['image'],
          });
        }
        return songs;
      } else {
        retryCount++;
      }
    } catch (e) {
      retryCount++;
    }
  }
  return [];
}

Future<String> getSongURL(String songId) async {
  final url =
      "https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=$songId";

  int retryCount = 0;
  Map<String, dynamic>? jsonResponse;
  while (retryCount < 5) {
    try {
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        jsonResponse = json.decode(response.body);
        break;
      } else {
        retryCount++;
      }
    } catch (e) {
      retryCount++;
    }
  }

  if (jsonResponse == null || !jsonResponse.containsKey(songId)) {
    return "";
  }

  String encryptedUrl = jsonResponse[songId]['encrypted_media_url'];
  return decryptLink(encryptedUrl);
}

String decryptLink(String base64Ciphertext) {
  log(base64Ciphertext);

  final key = '38346591'.codeUnits;
  final encryptedBytes = base64.decode(base64Ciphertext);

  final des = DES(
    key: key,
    mode: DESMode.ECB,
    paddingType: DESPaddingType.PKCS5,
  );

  final decryptedBytes = des.decrypt(encryptedBytes);
  return utf8.decode(decryptedBytes);
}
