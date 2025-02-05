import 'package:flutter/material.dart';
import 'api/api.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Rave Music',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const Home(),
    );
  }
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  HomeState createState() => HomeState();
}

class HomeState extends State<Home> {
  String output = "";
  final TextEditingController queryController = TextEditingController()
    ..text = "Dusk till Dawn";
  final TextEditingController songIdController = TextEditingController()
    ..text = "ApJ-pvzS";

  Future<void> fetchSongs() async {
    final query = queryController.text.trim();
    if (query.isEmpty) return;

    final songs = await getSongs(query);
    print("TestAPI1 - getSongs result:");
    print(songs.toString());

    setState(() {
      output = songs.toString();
    });
  }

  Future<void> fetchSongURL() async {
    final songId = songIdController.text.trim();
    if (songId.isEmpty) return;

    final songUrl = await getSongURL(songId);
    print("TestAPI2 - getSongURL result:");
    print(songUrl);

    setState(() {
      output = songUrl;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rave Music'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: queryController,
              decoration: const InputDecoration(
                hintText: "Enter a query",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: fetchSongs,
              child: const Text("Search Songs"),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: songIdController,
              decoration: const InputDecoration(
                hintText: "Enter a song ID",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: fetchSongURL,
              child: const Text("Get Song URL"),
            ),
            const SizedBox(height: 40),
            Text(
              "Output:\n$output",
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    queryController.dispose();
    songIdController.dispose();
    super.dispose();
  }
}
