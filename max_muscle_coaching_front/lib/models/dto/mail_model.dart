class MailModel {
  final String name;
  final String email;
  final String subject;
  final String body;
  final String? phone;
  final String? source;

  MailModel({this.phone, this.source, required this.name, required this.email, required this.subject, required this.body});

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['name'] = name;
    data['email'] = email;
    data['subject'] = subject;
    data['body'] = body;
    data['phone'] = phone;
    data['source'] = source;
    return data;
  }
}
